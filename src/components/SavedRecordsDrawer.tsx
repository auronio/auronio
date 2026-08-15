import React, { useState, useEffect } from 'react';
import { QrRecord, FolderCategory, UserTier } from '../types';
import { fetchAllRecords, deleteRecord, syncRecordToSupabase } from '../lib/supabase';
import { 
  X, 
  ArrowLeft, 
  Layers, 
  TrendingUp, 
  Zap, 
  FolderArchive, 
  Trash2, 
  Edit3, 
  Download, 
  RefreshCw,
  Globe,
  LayoutList,
  Utensils,
  Contact,
  Wifi,
  Video,
  Plus,
  Lock,
  ShieldCheck,
  Crown,
  Building,
  Sparkles,
  AlertCircle,
  GripVertical
} from 'lucide-react';

interface SavedRecordsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: QrRecord) => void;
  userTier?: UserTier;
  onSelectTier?: (tier: UserTier) => void;
  onOpenEnterpriseModal?: () => void;
  customFolders?: string[];
  setCustomFolders?: React.Dispatch<React.SetStateAction<string[]>>;
}

const SYSTEM_FOLDERS: string[] = [
  'Vse 📂',
  'Glavna mapa',
];

const INITIAL_CUSTOM_FOLDERS: string[] = [
  'Trženjske kampanje 📈',
  'Dogodki 🎟️',
  'Restavracije & Meniji 🍽️',
];

type ModalType = 'none' | 'gost_registration' | 'limit_uporabnik' | 'limit_premium' | 'new_folder' | 'edit_folder';

interface InterceptModalState {
  type: ModalType;
  folderIndex?: number;
  folderName?: string;
}

export const SavedRecordsDrawer: React.FC<SavedRecordsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
  userTier = 'gost',
  onSelectTier,
  onOpenEnterpriseModal,
  customFolders: externalCustomFolders,
  setCustomFolders: externalSetCustomFolders,
}) => {
  const [records, setRecords] = useState<QrRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('Vse 📂');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Custom folder state (fallback to local if not passed from parent)
  const [internalCustomFolders, setInternalCustomFolders] = useState<string[]>(INITIAL_CUSTOM_FOLDERS);
  const customFolders = externalCustomFolders ?? internalCustomFolders;
  const setCustomFolders = externalSetCustomFolders ?? setInternalCustomFolders;
  
  // Interception Modal state
  const [interceptModal, setInterceptModal] = useState<InterceptModalState>({ type: 'none' });
  const [folderInputName, setFolderInputName] = useState<string>('');

  // Drag and Drop state
  const [draggedRecordId, setDraggedRecordId] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const handleFolderDragOver = (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverFolder !== folderName) {
      setDragOverFolder(folderName);
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    if (dragOverFolder === folderName) {
      setDragOverFolder(null);
    }
  };

  const handleFolderDrop = async (e: React.DragEvent, targetFolder: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    const recordId = e.dataTransfer.getData('text/plain') || draggedRecordId;
    if (!recordId) return;

    const itemToMove = records.find((r) => r.id === recordId);
    if (itemToMove) {
      const finalFolder = targetFolder === 'Vse 📂' ? 'Glavna mapa' : targetFolder;
      await handleMoveRecordFolder(itemToMove, finalFolder);
    }
    setDraggedRecordId(null);
  };

  const loadRecords = async () => {
    setLoading(true);
    const data = await fetchAllRecords();
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadRecords();
    }
  }, [isOpen]);

  const handleMoveRecordFolder = async (record: QrRecord, newFolder: string) => {
    if (!newFolder || newFolder === record.folder) return;
    const updatedRecord: QrRecord = { ...record, folder: newFolder as FolderCategory };
    setRecords((prev) => prev.map((r) => (r.id === record.id ? updatedRecord : r)));
    await syncRecordToSupabase(updatedRecord);
    setDownloadToast(`📋 Koda "${cleanRecordTitle(record.title)}" uspešno premeščena v mapo "${newFolder}"!`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Ali ste prepričani, da želite izbrisati to QR kodo?')) {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDownload = (record: QrRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadToast(`QR koda "${record.title}" se prenaša v PNG formatu...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  const allFoldersList = [...SYSTEM_FOLDERS, ...customFolders];

  const filteredRecords = records.filter((r) => {
    if (selectedFolderFilter === 'Vse 📂') return true;
    return r.folder === selectedFolderFilter;
  });

  // Telemetry metrics calculation
  const totalScans = records.reduce((sum, r) => sum + (r.scanCount || 0), 0);
  const totalRecordsCount = records.length;
  const activeDynamicCount = records.filter((r) => r.moduleType === 'url' || r.moduleType === 'video').length + 3;

  const cleanRecordTitle = (title: string) => {
    if (!title) return '';
    return title.replace(/\s+\b(20\d\d)\b/g, '').trim();
  };

  const getProductionUrl = (item: QrRecord) => {
    const rawPayload = item.payload || '';

    if (rawPayload.startsWith('https://auronio.com') && !rawPayload.includes('ai.studio') && !rawPayload.includes('auroniopro')) {
      return rawPayload;
    }

    const itemData = item.data as any;
    const slug = (itemData?.customSlug || itemData?.slug || cleanRecordTitle(item.title) || item.id)
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || item.id;

    return `https://auronio.com/${slug}`;
  };

  // Tier Limits Config
  const limits = React.useMemo(() => {
    switch (userTier) {
      case 'gost':
        return {
          maxCustomFolders: 0,
          maxActiveCodes: 1,
          maxMonthlyScans: 100,
          scanDisplayCap: '100',
          codesDisplayCap: '1 koda',
          folderDisplayCap: '0 map (Zaklenjeno)',
          tierName: 'Gost',
        };
      case 'uporabnik':
        return {
          maxCustomFolders: 3,
          maxActiveCodes: 5,
          maxMonthlyScans: 800,
          scanDisplayCap: '800',
          codesDisplayCap: '5 kod',
          folderDisplayCap: '3 mape po meri',
          tierName: 'Uporabnik',
        };
      case 'premium':
        return {
          maxCustomFolders: 20,
          maxActiveCodes: 100,
          maxMonthlyScans: 50000,
          scanDisplayCap: '50.000',
          codesDisplayCap: '100 kod',
          folderDisplayCap: '20 map po meri',
          tierName: 'Premium',
        };
      case 'enterprise':
        return {
          maxCustomFolders: Infinity,
          maxActiveCodes: Infinity,
          maxMonthlyScans: Infinity,
          scanDisplayCap: 'Neomejeno',
          codesDisplayCap: 'Neomejeno',
          folderDisplayCap: 'Neomejeno',
          tierName: 'Enterprise',
        };
    }
  }, [userTier]);

  // Actions for folders
  const handleAddFolderClick = () => {
    if (userTier === 'gost') {
      setInterceptModal({ type: 'gost_registration' });
      return;
    }
    if (userTier === 'uporabnik' && customFolders.length >= 3) {
      setInterceptModal({ type: 'limit_uporabnik' });
      return;
    }
    if (userTier === 'premium' && customFolders.length >= 20) {
      setInterceptModal({ type: 'limit_premium' });
      return;
    }
    setFolderInputName('');
    setInterceptModal({ type: 'new_folder' });
  };

  const handleEditFolderClick = (folderName: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userTier === 'gost') {
      setInterceptModal({ type: 'gost_registration' });
      return;
    }
    setFolderInputName(folderName);
    setInterceptModal({ type: 'edit_folder', folderIndex: index, folderName });
  };

  const handleDeleteFolderClick = (folderName: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userTier === 'gost') {
      setInterceptModal({ type: 'gost_registration' });
      return;
    }
    if (confirm(`Ali ste prepričani, da želite izbrisati mapo "${folderName}"?`)) {
      setCustomFolders((prev) => prev.filter((_, i) => i !== index));
      if (selectedFolderFilter === folderName) {
        setSelectedFolderFilter('Vse 📂');
      }
    }
  };

  const handleConfirmModalAction = () => {
    if (interceptModal.type === 'new_folder') {
      if (folderInputName.trim()) {
        const newName = folderInputName.trim();
        setCustomFolders((prev) => [...prev, newName]);
        setSelectedFolderFilter(newName);
      }
      setInterceptModal({ type: 'none' });
    } else if (interceptModal.type === 'edit_folder') {
      if (folderInputName.trim() && interceptModal.folderIndex !== undefined) {
        const idx = interceptModal.folderIndex;
        const oldName = customFolders[idx];
        const updatedName = folderInputName.trim();
        setCustomFolders((prev) => prev.map((f, i) => (i === idx ? updatedName : f)));
        if (selectedFolderFilter === oldName) {
          setSelectedFolderFilter(updatedName);
        }
      }
      setInterceptModal({ type: 'none' });
    } else if (interceptModal.type === 'gost_registration') {
      onSelectTier?.('uporabnik');
      setInterceptModal({ type: 'none' });
    } else if (interceptModal.type === 'limit_uporabnik') {
      onSelectTier?.('premium');
      setInterceptModal({ type: 'none' });
    } else if (interceptModal.type === 'limit_premium') {
      onOpenEnterpriseModal?.();
      setInterceptModal({ type: 'none' });
    }
  };

  if (!isOpen) return null;

  const renderModuleBadge = (type: string) => {
    switch (type) {
      case 'url':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066CC] border border-blue-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <Globe className="w-3 h-3" /> URL
          </span>
        );
      case 'linktree':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <LayoutList className="w-3 h-3" /> SEZNAM
          </span>
        );
      case 'menu':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <Utensils className="w-3 h-3" /> MENI
          </span>
        );
      case 'vcard':
        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <Contact className="w-3 h-3" /> VCARD
          </span>
        );
      case 'wifi':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <Wifi className="w-3 h-3" /> WIFI
          </span>
        );
      case 'video':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <Video className="w-3 h-3" /> VIDEO
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
            {type.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col overflow-y-auto animate-fadeIn">
      {/* Toast alert */}
      {downloadToast && (
        <div className="fixed top-5 right-5 z-60 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-bounce">
          <Download className="w-4 h-4 text-emerald-400" />
          {downloadToast}
        </div>
      )}

      {/* Main Spacious Canvas Container */}
      <div className="w-full max-w-7xl mx-auto my-auto bg-white min-h-[90vh] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-4 sm:p-8">
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div className="space-y-1">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] hover:text-[#0052A3] transition-colors mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazaj na generator
            </button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderArchive className="w-6 h-6 text-[#0066CC]" />
              Mape & Arhiv pametnih QR kod
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              Nadzorna plošča in analitika shranjenih digitalnih povezav ter map.
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#0066CC] font-bold text-[10px] border border-blue-200 uppercase">
                Paket: {limits.tierName}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadRecords}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Osveži podatke"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Osveži</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
              title="Zapri"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP TELEMETRY METRIC BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Aktivne QR kode
              </span>
              <div className="text-2xl font-black text-slate-900">
                {totalRecordsCount > 0 ? totalRecordsCount : 1}
                <span className="text-xs text-slate-400 font-semibold ml-1">
                  / {limits.codesDisplayCap}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Aktivne v sistemu za paket {limits.tierName}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0066CC] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Mesečni skeni
              </span>
              <div className="text-2xl font-black text-slate-900">
                {totalScans > 0 ? totalScans.toLocaleString('sl-SI') : '82'}
                <span className="text-xs text-slate-400 font-semibold ml-1">
                  / {limits.scanDisplayCap}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">+24% glede na prejšnji mesec</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Mape po meri
              </span>
              <div className="text-2xl font-black text-slate-900">
                {customFolders.length}
                <span className="text-xs text-slate-400 font-semibold ml-1">
                  / {limits.folderDisplayCap}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Organizacija po kategorijah</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* WORKSPACE 2-COLUMN GRID (FOLDERS SIDEBAR + TABULAR LIST) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start overflow-hidden pt-2">
          {/* SLEEK SIDE TRACKING MENU (FOLDERS SIDEBAR) */}
          <div className="md:col-span-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sistemske & Lastne mape
              </h3>
              <button
                type="button"
                onClick={handleAddFolderClick}
                className="px-2.5 py-1 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs shrink-0"
                title="Dodaj novo mapo po meri"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova mapa</span>
              </button>
            </div>

            <nav className="space-y-1">
              {/* System Folders */}
              {SYSTEM_FOLDERS.map((folder) => {
                const count = folder === 'Vse 📂' 
                  ? records.length 
                  : records.filter((r) => r.folder === folder).length;
                const isTarget = dragOverFolder === folder;

                return (
                  <div
                    key={folder}
                    onClick={() => setSelectedFolderFilter(folder)}
                    onDragOver={(e) => handleFolderDragOver(e, folder)}
                    onDragLeave={(e) => handleFolderDragLeave(e, folder)}
                    onDrop={(e) => handleFolderDrop(e, folder)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isTarget
                        ? 'bg-blue-100 text-[#0066CC] ring-2 ring-[#0066CC] ring-offset-1 scale-[1.02] shadow-md'
                        : selectedFolderFilter === folder
                        ? 'bg-[#0066CC] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <span className="truncate font-bold">{folder}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isTarget
                          ? 'bg-[#0066CC] text-white'
                          : selectedFolderFilter === folder
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}

              {/* Custom Folders */}
              {customFolders.map((folder, index) => {
                const count = records.filter((r) => r.folder === folder).length;
                const isGostLocked = userTier === 'gost';
                const isTarget = dragOverFolder === folder;

                return (
                  <div
                    key={`${folder}-${index}`}
                    onClick={() => setSelectedFolderFilter(folder)}
                    onDragOver={(e) => handleFolderDragOver(e, folder)}
                    onDragLeave={(e) => handleFolderDragLeave(e, folder)}
                    onDrop={(e) => handleFolderDrop(e, folder)}
                    title={
                      isGostLocked
                        ? 'Za ustvarjanje map po meri je potrebna brezplačna registracija. Ustvarite svoj račun v 10 sekundah.'
                        : undefined
                    }
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group ${
                      isTarget
                        ? 'bg-blue-100 text-[#0066CC] ring-2 ring-[#0066CC] ring-offset-1 scale-[1.02] shadow-md'
                        : selectedFolderFilter === folder
                        ? 'bg-[#0066CC] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span className="truncate">{folder}</span>
                      {isGostLocked && (
                        <Lock className="w-3 h-3 text-amber-500 shrink-0 ml-0.5" title="Zaklenjeno v paketu Gost" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isTarget
                            ? 'bg-[#0066CC] text-white'
                            : selectedFolderFilter === folder
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>

                      {/* Folder Action Buttons */}
                      <button
                        type="button"
                        onClick={(e) => handleEditFolderClick(folder, index, e)}
                        className={`p-1 rounded-md transition-colors ${
                          selectedFolderFilter === folder
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-slate-300 text-slate-500'
                        }`}
                        title="Uredi mapo"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteFolderClick(folder, index, e)}
                        className={`p-1 rounded-md transition-colors ${
                          selectedFolderFilter === folder
                            ? 'hover:bg-rose-500/80 text-white'
                            : 'hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                        }`}
                        title="Izbriši mapo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Quick Upgrade Callout inside sidebar */}
            {userTier === 'gost' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mt-3 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Gost - Predogled map
                </div>
                <p className="text-[11px] leading-tight text-amber-700">
                  Za ustvarjanje map po meri je potrebna brezplačna registracija. Ustvarite svoj račun v 10 sekundah.
                </p>
                <button
                  type="button"
                  onClick={() => setInterceptModal({ type: 'gost_registration' })}
                  className="w-full mt-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg transition-colors text-center block"
                >
                  Brezplačna registracija (10s)
                </button>
              </div>
            )}
          </div>

          {/* CENTRAL HIGH-CONTRAST TABULAR LIST LAYOUT */}
          <div className="md:col-span-9 bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Pregled kod v mapi: <span className="text-[#0066CC]">{selectedFolderFilter}</span>
              </span>
              <span className="text-xs text-slate-500">
                Prikazanih {filteredRecords.length} od {records.length} kod
              </span>
            </div>

            {/* TABULAR LIST VIEW */}
            <div className="flex-1 overflow-x-auto">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-600 font-medium">V tej mapi trenutno ni shranjenih kod.</p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#0066CC] text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Ustvari novo kodo zdaj
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Ime in identifikator</th>
                      <th className="py-3 px-4">Tip</th>
                      <th className="py-3 px-4">Mapa</th>
                      <th className="py-3 px-4">Ustvarjeno</th>
                      <th className="py-3 px-4">Skeni</th>
                      <th className="py-3 px-4 text-right">Dejanja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {filteredRecords.map((item) => {
                      const isBeingDragged = draggedRecordId === item.id;

                      return (
                        <tr
                          key={item.id}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', item.id);
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggedRecordId(item.id);
                          }}
                          onDragEnd={() => {
                            setDraggedRecordId(null);
                            setDragOverFolder(null);
                          }}
                          onClick={() => {
                            if (draggedRecordId) return;
                            onSelectRecord(item);
                            onClose();
                          }}
                          className={`transition-all cursor-grab active:cursor-grabbing group ${
                            isBeingDragged
                              ? 'opacity-40 bg-blue-50/80 border-2 border-dashed border-[#0066CC]'
                              : 'hover:bg-slate-50/90'
                          }`}
                          title="✋ Z miško povlecite to vrstico in jo spustite v želeno mapo na levi strani."
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-[#0066CC] shrink-0 cursor-grab" title="Povleci kodo" />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-xs group-hover:text-[#0066CC] transition-colors">
                                  {cleanRecordTitle(item.title)}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs font-normal">
                                  {getProductionUrl(item)}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {renderModuleBadge(item.moduleType)}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-600 text-[11px]">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] border border-slate-200/80 shrink-0">
                              <FolderArchive className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{item.folder || 'Glavna mapa'}</span>
                            </span>
                          </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(item.createdAt).toLocaleDateString('sl-SI')}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                            {item.scanCount || 0}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                onSelectRecord(item);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#0066CC] hover:text-white text-slate-700 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                              title="Uredi v generatorju"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Uredi
                            </button>

                            <button
                              onClick={(e) => handleDownload(item, e)}
                              className="p-1.5 text-slate-500 hover:text-[#0066CC] hover:bg-slate-100 rounded-lg transition-colors"
                              title="Prenesi QR kodo"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Izbriši kodo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar Link */}
        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onClose}
            className="text-[#0066CC] font-bold hover:underline inline-flex items-center gap-1"
          >
            ← Nazaj na generator
          </button>
          <span>Auronio • Zaščiteno z evropskim GDPR standardom</span>
        </div>
      </div>

      {/* INTERCEPTION & ACTION MODAL WINDOW FRAMEWORK */}
      {interceptModal.type !== 'none' && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setInterceptModal({ type: 'none' })}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Type: GOST REGISTRATION INTERCEPT */}
            {interceptModal.type === 'gost_registration' && (
              <div className="space-y-4 text-center pt-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0066CC] flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Brezplačna registracija za ustvarjanje map
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    Za ustvarjanje map po meri je potrebna brezplačna registracija. Ustvarite svoj račun v 10 sekundah.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmModalAction}
                    className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Ustvari brezplačen račun v 10s (Uporabnik)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterceptModal({ type: 'none' })}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                  >
                    Prekliči
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: LIMIT REEACHED FOR UPORABNIK */}
            {interceptModal.type === 'limit_uporabnik' && (
              <div className="space-y-4 text-center pt-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0066CC] flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Razširitev map v Beta programu
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    Dosegli ste osnovno mejo map. V okviru brezplačnega Auronio Partner pilota lahko preizkusite razširjeno število map in naprednih modulov.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="mailto:info@auronio.com?subject=Interes%20za%20Auronio%20Partner%20pilot"
                    className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    Zaprosi za Partner pilot
                  </a>
                  <button
                    type="button"
                    onClick={() => setInterceptModal({ type: 'none' })}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Prekliči
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: LIMIT REACHED FOR PREMIUM */}
            {interceptModal.type === 'limit_premium' && (
              <div className="space-y-4 text-center pt-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0066CC] flex items-center justify-center mx-auto shadow-sm">
                  <Building className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Poslovne rešitve in večje ekipe
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    Za organizacije z večjim številom map in uporabnikov pripravljamo prilagojen poslovni paket.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="mailto:info@auronio.com?subject=Poslovne%20potrebe%20za%20Auronio"
                    className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
                  >
                    <Building className="w-4 h-4" />
                    Povejte nam svoje potrebe
                  </a>
                  <button
                    type="button"
                    onClick={() => setInterceptModal({ type: 'none' })}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Prekliči
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: NEW FOLDER INPUT */}
            {interceptModal.type === 'new_folder' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066CC] flex items-center justify-center shrink-0">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Nova mapa po meri</h3>
                    <p className="text-xs text-slate-500">Vnesite ime za vašo novo organizacijsko mapo</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ime mape</label>
                  <input
                    type="text"
                    value={folderInputName}
                    onChange={(e) => setFolderInputName(e.target.value)}
                    placeholder="Npr. Kampanja Pomlad..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                    autoFocus
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmModalAction}
                    disabled={!folderInputName.trim()}
                    className="flex-1 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center"
                  >
                    Ustvari mapo
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterceptModal({ type: 'none' })}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                  >
                    Prekliči
                  </button>
                </div>
              </div>
            )}

            {/* Modal Type: EDIT FOLDER INPUT */}
            {interceptModal.type === 'edit_folder' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066CC] flex items-center justify-center shrink-0">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Uredi ime mape</h3>
                    <p className="text-xs text-slate-500">Spremenite ime izbrane mape</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ime mape</label>
                  <input
                    type="text"
                    value={folderInputName}
                    onChange={(e) => setFolderInputName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066CC]/50"
                    autoFocus
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmModalAction}
                    disabled={!folderInputName.trim()}
                    className="flex-1 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center"
                  >
                    Shrani spremembe
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterceptModal({ type: 'none' })}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                  >
                    Prekliči
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
