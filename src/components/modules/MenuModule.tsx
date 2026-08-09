import React, { useState } from 'react';
import { MenuData, MenuItem } from '../../types';
import { 
  Utensils, 
  FileText, 
  Plus, 
  Trash2, 
  Tag, 
  DollarSign, 
  Store, 
  UploadCloud, 
  Info, 
  Link as LinkIcon,
  Shield,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

interface MenuModuleProps {
  data: MenuData;
  onChange: (updated: MenuData) => void;
}

export const MenuModule: React.FC<MenuModuleProps> = ({ data, onChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPremiumShieldModal, setShowPremiumShieldModal] = useState(false);

  const addItem = () => {
    const newItem: MenuItem = {
      id: 'item_' + Date.now(),
      name: 'Novi kulinarični krožnik',
      price: '14.50 €',
      description: 'Sveže lokalne sestavine, domače oljčno olje in zelišča.',
      category: data.categories[0] || 'Glavne jedi',
      badge: 'NOVO',
    };
    onChange({
      ...data,
      items: [...data.items, newItem],
    });
  };

  const updateItem = (id: string, field: keyof MenuItem, value: string) => {
    const updated = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: updated });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const handleSimulateFileUpload = (fileName: string, fileSize: string) => {
    onChange({
      ...data,
      pdfFileName: fileName,
      pdfFileSize: fileSize,
      pdfUrl: data.pdfUrl || 'https://auronio.com/katalog.pdf',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-stone-700" />
          <h3 className="text-base font-semibold text-[#1D1D1F]">Meni & PDF katalog</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Modul 3/5
        </span>
      </div>

      <p className="text-xs text-stone-600">
        Ustvarite pametni digitalni meni za restavracijo, bar ali trgovino z neposredno povezavo do PDF ponudbenega kataloga in dinamičnim preusmerjanjem.
      </p>

      {/* Main Form Fields Container */}
      <div className="p-5 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-5">
        
        {/* FIELD 1: NAZIV GOSTILNE / KATALOGA */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-stone-600" />
            NAZIV GOSTILNE / KATALOGA
          </label>
          <input
            type="text"
            value={data.restaurantName}
            onChange={(e) => onChange({ ...data, restaurantName: e.target.value })}
            placeholder="npr. Restavracija Center - Letni Meni"
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs"
          />
        </div>

        {/* FIELD 2: NALOŽI PDF JEDILNIK ALI KATALOG */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              NALOŽI PDF JEDILNIK ALI KATALOG
            </label>
            <button
              type="button"
              onClick={() => setShowPremiumShieldModal(true)}
              className="text-[10px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/80 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-amber-600" />
              SaaS Premium Shield Info
            </button>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const files = e.dataTransfer.files;
              if (files && files[0]) {
                handleSimulateFileUpload(files[0].name, `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`);
              }
            }}
            className={`p-5 border-2 border-dashed rounded-2xl text-center transition-all ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50/60' 
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto shadow-xs border border-stone-200">
                <UploadCloud className="w-5 h-5 text-stone-600" />
              </div>

              {data.pdfFileName ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{data.pdfFileName} ({data.pdfFileSize || '2.4 MB'})</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Datoteka je uspešno naložena in pripravljena za prenos ob skeniranju.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-stone-800">
                    Povlecite in ispustite PDF datoteko sem ali kliknite za izbiro
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Podprti formati: PDF (do 25 MB v Premium paketu)
                  </p>
                </div>
              )}

              <div className="pt-1 flex justify-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Izberi PDF datoteko</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) {
                        handleSimulateFileUpload(files[0].name, `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                      }
                    }}
                  />
                </label>

                {data.pdfFileName && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...data, pdfFileName: undefined, pdfFileSize: undefined })}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium rounded-xl transition-colors"
                  >
                    Odstrani
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FIELD 3: POVEZAVA DO SPLETNEGA MENIJA (ALTERNATIVE URL) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-stone-600" />
            POVEZAVA DO SPLETNEGA MENIJA (ALTERNATIVE URL)
          </label>
          <input
            type="url"
            value={data.pdfUrl}
            onChange={(e) => onChange({ ...data, pdfUrl: e.target.value })}
            placeholder="Prilepite povezavo do obstoječega spletnega menija, če nimate PDF datoteke"
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs"
          />
        </div>

        {/* FIELD 4: UNIKATNI REP POVEZAVE ZA TISK */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                UNIKATNI REP POVEZAVE ZA TISK
              </label>
              <div className="relative group/info inline-block">
                <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 ml-1 inline-block cursor-help transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-80 p-3.5 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none transition-all space-y-2">
                  <p>
                    Vnesite kratko besedo po izbiri (npr. &apos;koledarji&apos; ali &apos;akcija&apos;).
                  </p>
                  <p className="text-amber-300 font-medium">
                    ⚠️ ZELENO PRAVILO: Ko kodo enkrat natisnete na papir, te besede ne spreminjate več, saj se bo QR koda uničila. Ciljni spletni naslov zgoraj pa boste lahko kasneje v nadzorni plošči poljubno zamenjali vsak dan, ne da bi morali QR kodo kadarkoli ponovno tiskati!
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Dinamično preusmerjanje</span>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs">
            <span className="inline-flex items-center px-3.5 text-xs text-stone-500 bg-stone-100 border-r border-stone-200 font-mono font-medium shrink-0">
              auronio.com/r/
            </span>
            <input
              type="text"
              value={data.slug || ''}
              onChange={(e) => onChange({ ...data, slug: e.target.value })}
              placeholder="meni"
              className="w-full px-3.5 py-2.5 text-xs text-[#1D1D1F] font-mono focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-mono">
            Povezava na namiznih nalepkah: <strong className="text-blue-600">auronio.com/r/{data.slug || 'meni'}</strong>
          </p>
        </div>

      </div>

      {/* Optional Interactive Digital Items List Builder */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Interaktivni digitalni jedilnik ({data.items.length} postavk)
            </h4>
            <p className="text-[11px] text-stone-500">
              Prikazano na zaslonu telefona poleg PDF gumba.
            </p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 text-xs font-bold bg-[#1D1D1F] text-white rounded-xl hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Dodaj jed / izdelek
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Ime jedi ali izdelka"
                  className="w-full text-xs font-bold text-[#1D1D1F] focus:outline-none border-b border-stone-200 focus:border-blue-500 pb-1"
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors shrink-0 rounded-lg hover:bg-rose-50"
                  title="Odstrani jed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Cena</span>
                  <div className="flex items-center bg-stone-50 rounded-xl px-2.5 py-1.5 border border-stone-200">
                    <DollarSign className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      placeholder="12.00 €"
                      className="w-full text-xs text-[#1D1D1F] focus:outline-none font-bold ml-1 bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Kategorija</span>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    className="w-full text-xs font-semibold text-[#1D1D1F] bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
                  >
                    {data.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Značka</span>
                  <div className="flex items-center bg-stone-50 rounded-xl px-2.5 py-1.5 border border-stone-200">
                    <Tag className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      value={item.badge || ''}
                      onChange={(e) => updateItem(item.id, 'badge', e.target.value)}
                      placeholder="npr. Hišna specialiteta"
                      className="w-full text-xs text-[#1D1D1F] focus:outline-none ml-1 bg-transparent font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Kratek opis sestavin in pripravljenosti..."
                  className="w-full text-xs text-stone-600 focus:outline-none border-t border-stone-100 pt-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SaaS Premium Shield Info Modal */}
      {showPremiumShieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">Auronio SaaS Premium Shield</h4>
                <p className="text-[11px] text-stone-500">Zaščita in prilagoditev blagovne znamke</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong>Brezplačni paket:</strong> Omogoča nalaganje PDF datotek do 5 MB ter standardno preusmerjanje.
              </p>
              <p>
                <strong>Premium paket (Priporočeno):</strong> Odklene lastno znamčenje brez logotipa Auronio, datoteke do 25 MB, ultra hitro CDN strežbo ter statistiko skeniranja v realnem času.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPremiumShieldModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                Razumem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
