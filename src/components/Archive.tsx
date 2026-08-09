import React from 'react';
import { SavedRecordsDrawer } from './SavedRecordsDrawer';
import { QrRecord, UserTier } from '../types';

interface ArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: QrRecord) => void;
  userTier?: UserTier;
  onSelectTier?: (tier: UserTier) => void;
  onOpenEnterpriseModal?: () => void;
  customFolders: string[];
  setCustomFolders: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Archive: React.FC<ArchiveProps> = (props) => {
  return <SavedRecordsDrawer {...props} />;
};

export default Archive;
