import { QrCode, QrSegment } from './qrcodegen';
import { toIso88592Bytes } from './iso8859-2';
import { UpnData } from '../types';

// --- ZBS UPN QR: največje dolžine posameznih polj (vir: "Navodilo za pripravo
// izpisa UPN QR registriranih izdajateljev za programerje", ZBS-GIZ, poglavje 4) ---
export const UPN_MAX_LENGTHS = {
	payerName: 33,
	payerAddress: 33,
	payerPlace: 33,
	purposeCode: 4,
	purposeText: 42,
	dueDate: 10,
	recipientIban: 34,
	recipientReference: 26,
	recipientName: 33,
	recipientAddress: 33,
	recipientPlace: 33,
} as const;

export interface UpnValidationIssue {
	field: keyof UpnData;
	message: string;
}

// Preveri dolžine in obvezna polja. Ne preverja IBAN/referenčne kontrolne
// številke (MOD97 itd.) — to lahko dodamo kasneje, ni pa nujno za samo
// generiranje slike, dokler uporabnik testira z resnično banko.
export function validateUpnData(d: UpnData): UpnValidationIssue[] {
	const issues: UpnValidationIssue[] = [];
	const req = (field: keyof UpnData, label: string) => {
		if (!String(d[field] ?? '').trim())
			issues.push({ field, message: `${label} je obvezno polje.` });
	};

	req('recipientIban', 'IBAN prejemnika');
	req('recipientReference', 'Referenca prejemnika');
	req('recipientName', 'Ime prejemnika');
	req('recipientAddress', 'Ulica in št. prejemnika');
	req('recipientPlace', 'Kraj prejemnika');
	req('purposeCode', 'Koda namena');
	req('purposeText', 'Namen plačila');

	if (d.purposeCode && !/^[A-Z]{4}$/.test(d.purposeCode))
		issues.push({ field: 'purposeCode', message: 'Koda namena mora biti natanko 4 velike črke (npr. RENT, COST, OTHR).' });

	if (!Number.isFinite(d.amount) || d.amount <= 0)
		issues.push({ field: 'amount', message: 'Znesek mora biti večji od 0.' });

	const ibanClean = (d.recipientIban || '').replace(/\s+/g, '').toUpperCase();
	if (ibanClean && !/^SI56[0-9]{15}$/.test(ibanClean))
		issues.push({ field: 'recipientIban', message: 'IBAN mora biti slovenski, oblika SI56 + 15 številk (skupaj 19 znakov).' });

	if (d.dueDate && !/^\d{2}\.\d{2}\.\d{4}$/.test(d.dueDate))
		issues.push({ field: 'dueDate', message: 'Rok plačila mora biti v obliki DD.MM.LLLL ali prazen.' });

	(Object.keys(UPN_MAX_LENGTHS) as Array<keyof typeof UPN_MAX_LENGTHS>).forEach((field) => {
		const val = String((d as any)[field] ?? '');
		const max = UPN_MAX_LENGTHS[field];
		if (val.length > max)
			issues.push({ field: field as keyof UpnData, message: `Polje je predolgo (${val.length}/${max} znakov).` });
	});

	return issues;
}

// Formatira znesek (v EUR, npr. 81.05) v 11-mestni niz centov z vodilnimi ničlami,
// natanko po pravilu iz uradnih navodil: "***1.628,45" -> "00000162845".
function formatAmountForQr(amountEur: number): string {
	const cents = Math.round(amountEur * 100);
	return String(Math.max(0, cents)).padStart(11, '0');
}

// Sestavi 19 podatkovnih polj (v pravilnem vrstnem redu, polja 2–5 in 10–11 so
// za "registrirane izdajatelje" vedno prazna) + izračuna kontrolno vsoto (polje 20).
// Vrne končni niz, pripravljen za pretvorbo v ISO-8859-2 bajte in vpis v QR kodo.
export function buildUpnPayload(d: UpnData): string {
	const trim = (s: string) => (s || '').trim();

	const fields: string[] = [
		'UPNQR',                                                  // 1. Vodilni slog
		'',                                                       // 2. IBAN plačnika
		'',                                                       // 3. Polog
		'',                                                       // 4. Dvig
		'',                                                       // 5. Referenca plačnika
		trim(d.payerName),                                        // 6. Ime plačnika
		trim(d.payerAddress),                                     // 7. Ulica in št. plačnika
		trim(d.payerPlace),                                       // 8. Kraj plačnika
		formatAmountForQr(d.amount),                              // 9. Znesek
		'',                                                       // 10. Datum plačila
		'',                                                       // 11. Nujno
		trim(d.purposeCode).toUpperCase(),                        // 12. Koda namena
		trim(d.purposeText),                                      // 13. Namen plačila
		trim(d.dueDate),                                          // 14. Rok plačila
		trim(d.recipientIban).replace(/\s+/g, '').toUpperCase(),  // 15. IBAN prejemnika
		trim(d.recipientReference).replace(/\s+/g, '').toUpperCase(), // 16. Referenca prejemnika
		trim(d.recipientName),                                    // 17. Ime prejemnika
		trim(d.recipientAddress),                                 // 18. Ulica in št. prejemnika
		trim(d.recipientPlace),                                   // 19. Kraj prejemnika
	];

	// Kontrolna vsota = seštevek dolžin polj 1..19 + 19 (ločila <LF>), na 3 mesta.
	const checksum = fields.reduce((sum, f) => sum + f.length, 0) + fields.length;
	const checksumStr = String(checksum).padStart(3, '0');

	return fields.map((f) => f + '\n').join('') + checksumStr + '\n';
}

// Zgradi QR kodo natanko po ZBS zahtevah: verzija 15 (fiksno), ECC = M,
// en Byte segment v ISO-8859-2, s predhodnim ECI segmentom (vrednost 4).
export function encodeUpnQrCode(payload: string): QrCode {
	const bytes = toIso88592Bytes(payload);
	const segs = [
		QrSegment.makeEci(4),
		QrSegment.makeBytes(bytes),
	];
	// minVersion = maxVersion = 15, mask = -1 (avtomatska izbira maske), boostEcl = false
	// (nikoli ne dvigujemo nad M, tudi če bi šlo — standard zahteva točno M).
	return QrCode.encodeSegments(segs, QrCode.Ecc.MEDIUM, 15, 15, -1, false);
}

// Nariše QR na canvas: čisto črno-bela slika brez logotipa/barvnih stilov
// (za UPN QR to ni na voljo — banke kodo strogo skenirajo in barvni/pikčasti
// stili ali logotip čez sredino lahko povzročijo, da jo banka zavrne).
export function drawUpnQrToCanvas(qr: QrCode, canvas: HTMLCanvasElement, pixelsPerModule = 8): void {
	const quietZone = 4; // modulov belega roba (ZBS standard)
	const size = (qr.size + quietZone * 2) * pixelsPerModule;
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0, 0, size, size);
	ctx.fillStyle = '#000000';
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y)) {
				ctx.fillRect(
					(x + quietZone) * pixelsPerModule,
					(y + quietZone) * pixelsPerModule,
					pixelsPerModule,
					pixelsPerModule
				);
			}
		}
	}
}

// Enak izris, samo kot SVG niz (za gumb "Prenesi Vector SVG").
export function buildUpnQrSvg(qr: QrCode, pixelsPerModule = 8): string {
	const quietZone = 4;
	const size = (qr.size + quietZone * 2) * pixelsPerModule;
	let rects = '';
	for (let y = 0; y < qr.size; y++) {
		for (let x = 0; x < qr.size; x++) {
			if (qr.getModule(x, y)) {
				rects += `<rect x="${(x + quietZone) * pixelsPerModule}" y="${(y + quietZone) * pixelsPerModule}" width="${pixelsPerModule}" height="${pixelsPerModule}"/>`;
			}
		}
	}
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#FFFFFF"/><g fill="#000000">${rects}</g></svg>`;
}
