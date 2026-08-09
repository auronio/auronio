import React from 'react';
import { VCardData } from '../../types';
import { Contact, Building2, Phone, Mail, Globe, MapPin, Calendar, Download } from 'lucide-react';

interface VCardModuleProps {
  data: VCardData;
  onChange: (updated: VCardData) => void;
}

export const VCardModule: React.FC<VCardModuleProps> = ({ data, onChange }) => {
  // Generate downloadable .vcf file string
  const generateVcfString = () => {
    return `BEGIN:VCARD
VERSION:3.0
N:${data.lastName};${data.firstName};;;
FN:${data.firstName} ${data.lastName}
ORG:${data.company}
TITLE:${data.position}
TEL;TYPE=CELL:${data.phone}
EMAIL:${data.email}
URL:${data.website}
ADR:;;${data.location};;;;
NOTE:${data.calendarNote}
END:VCARD`;
  };

  const handleDownloadVcard = () => {
    const element = document.createElement('a');
    const file = new Blob([generateVcfString()], { type: 'text/vcard;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${data.firstName}_${data.lastName}_Vizitka.vcf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Contact className="w-5 h-5 text-stone-700" />
          <h3 className="text-base font-semibold text-[#1D1D1F]">Pametna vCard+ vizitka</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Modul 4/5
        </span>
      </div>

      <p className="text-xs text-stone-600">
        Generirajte pametno digitalno vizitko. S skeniranjem lahko uporabnik takoj shrani kontakt v pametni telefon ali rezervira termin v koledarju.
      </p>

      {/* Osebni in poslovni podatki */}
      <div className="p-4 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-stone-700" />
          Osebni in poslovni podatki
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Ime</label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="Marko"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Priimek</label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="Novak"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Podjetje / Organizacija</label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => onChange({ ...data, company: e.target.value })}
              placeholder="Auronio d.o.o."
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Delovno mesto / Funkcija</label>
            <input
              type="text"
              value={data.position}
              onChange={(e) => onChange({ ...data, position: e.target.value })}
              placeholder="Direktor razvoja & strategij"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Kontaktni kanali */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Kontaktne povezave
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-500" />
              Telefonska številka
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="+386 41 123 456"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-stone-500" />
              E-poštni naslov
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="marko.novak@auronio.com"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-stone-500" />
              Spletno mesto
            </label>
            <input
              type="url"
              value={data.website}
              onChange={(e) => onChange({ ...data, website: e.target.value })}
              placeholder="https://auronio.com"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-500" />
              Naslov / Lokacija
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              placeholder="Slovenska cesta 55, 1000 Ljubljana"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Digital Calendar Appointment Triggers */}
      <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-700" />
            <div>
              <h4 className="text-xs font-semibold text-amber-900">
                Sprožilec za dodajanje v digitalni koledar
              </h4>
              <p className="text-[11px] text-amber-800/80">
                Ob skeniranju samodejno predlaga shranjevanje sestanka ali opomnika v Koledar.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={data.enableCalendar}
              onChange={(e) => onChange({ ...data, enableCalendar: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1D1D1F]"></div>
          </label>
        </div>

        {data.enableCalendar && (
          <div className="pt-2 border-t border-amber-200/50">
            <label className="block text-xs font-medium text-amber-900 mb-1">
              Opomba ob vabilu na sestanek
            </label>
            <input
              type="text"
              value={data.calendarNote}
              onChange={(e) => onChange({ ...data, calendarNote: e.target.value })}
              placeholder="Rezervirajte sestanek preko Auronio sistema ali pošljite e-pošto."
              className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Test Download VCard */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDownloadVcard}
          className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-3.5 h-3.5 text-stone-600" />
          Testiraj prenos VCF datoteke vizitke
        </button>
      </div>
    </div>
  );
};
