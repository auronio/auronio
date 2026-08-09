import React from 'react';
import { LinktreeData, LinktreeLink } from '../../types';
import { LayoutList, Instagram, Facebook, MessageCircle, Plus, Trash2, Link as LinkIcon, User } from 'lucide-react';

interface LinktreeModuleProps {
  data: LinktreeData;
  onChange: (updated: LinktreeData) => void;
}

export const LinktreeModule: React.FC<LinktreeModuleProps> = ({ data, onChange }) => {
  const addCustomLink = () => {
    const newLink: LinktreeLink = {
      id: 'link_' + Date.now(),
      label: 'Novo spletno mesto',
      url: 'https://auronio.com',
    };
    onChange({
      ...data,
      customLinks: [...data.customLinks, newLink],
    });
  };

  const updateCustomLink = (id: string, field: 'label' | 'url', value: string) => {
    const updated = data.customLinks.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, customLinks: updated });
  };

  const removeCustomLink = (id: string) => {
    onChange({
      ...data,
      customLinks: data.customLinks.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <LayoutList className="w-5 h-5 text-stone-700" />
          <h3 className="text-base font-semibold text-[#1D1D1F]">Seznam povezav (All-in-One Linktree)</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Modul 2/5
        </span>
      </div>

      <p className="text-xs text-stone-600">
        Združite vse svoje družbene profile (Instagram, Facebook, WhatsApp) in poljubne povezave v eni sami elegatni mobilni pristajalni strani.
      </p>

      {/* Profilne informacije */}
      <div className="p-4 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-stone-700" />
          Podatki o profilu ali podjetju
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Naziv profila / Ime</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              placeholder="Auronio Studio Slovenia"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Slika profila (URL)</label>
            <input
              type="text"
              value={data.avatarUrl}
              onChange={(e) => onChange({ ...data, avatarUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Kratek opis / Bio</label>
          <input
            type="text"
            value={data.bio}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
            placeholder="Dobrodošli na naši uradni stični točki. Izberite želeno možnost spodaj."
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>

      {/* Družbena omrežja */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Uradni profili družbenih omrežij
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Instagram */}
          <div className="flex items-center gap-2 bg-white p-2.5 border border-stone-200 rounded-xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block text-[11px] font-medium text-stone-500">Instagram profil</span>
              <input
                type="text"
                value={data.instagram}
                onChange={(e) => onChange({ ...data, instagram: e.target.value })}
                placeholder="https://instagram.com/auronio_official"
                className="w-full text-xs text-[#1D1D1F] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-center gap-2 bg-white p-2.5 border border-stone-200 rounded-xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Facebook className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block text-[11px] font-medium text-stone-500">Facebook stran</span>
              <input
                type="text"
                value={data.facebook}
                onChange={(e) => onChange({ ...data, facebook: e.target.value })}
                placeholder="https://facebook.com/auronio.slovenia"
                className="w-full text-xs text-[#1D1D1F] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2 bg-white p-2.5 border border-stone-200 rounded-xl shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block text-[11px] font-medium text-stone-500">WhatsApp neposredni pogovor</span>
              <input
                type="text"
                value={data.whatsapp}
                onChange={(e) => onChange({ ...data, whatsapp: e.target.value })}
                placeholder="https://wa.me/38641123456"
                className="w-full text-xs text-[#1D1D1F] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Links List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Povezave po meri ({data.customLinks.length})
          </h4>
          <button
            type="button"
            onClick={addCustomLink}
            className="px-2.5 py-1 text-xs font-medium bg-[#1D1D1F] text-white rounded-lg hover:bg-stone-800 transition-all flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Dodaj povezavo
          </button>
        </div>

        <div className="space-y-2">
          {data.customLinks.map((item) => (
            <div key={item.id} className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateCustomLink(item.id, 'label', e.target.value)}
                  placeholder="Naslov gumba (npr. E-trgovina)"
                  className="w-full text-xs font-semibold text-[#1D1D1F] focus:outline-none border-b border-transparent focus:border-stone-300 pb-0.5"
                />
                <button
                  type="button"
                  onClick={() => removeCustomLink(item.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Odstrani povezavo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-stone-400">
                <LinkIcon className="w-3 h-3 shrink-0" />
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => updateCustomLink(item.id, 'url', e.target.value)}
                  placeholder="https://auronio.com/trgovina"
                  className="w-full text-xs text-stone-600 focus:outline-none font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
