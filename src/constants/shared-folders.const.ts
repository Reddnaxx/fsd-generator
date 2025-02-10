import { QuickPickItem, QuickPickItemKind } from 'vscode';
import { SharedFolder } from '../types/shared-folder.enum';

export const sharedFolders: QuickPickItem[] = [
  {
    label: 'core',
    kind: QuickPickItemKind.Separator,
  },
  {
    label: SharedFolder.UI,
    description: 'Shared UI components',
    picked: true,
  },
  {
    label: SharedFolder.CONSTANTS,
    description: 'Shared constants',
    picked: true,
  },
  {
    label: SharedFolder.TYPES,
    description: 'Shared types',
    picked: true,
  },
  {
    label: 'lib',
    kind: QuickPickItemKind.Separator,
  },
  {
    label: SharedFolder.API,
    description: 'Shared API services',
  },
  {
    label: SharedFolder.HELPERS,
    description: 'Shared helper functions',
  },
  {
    label: SharedFolder.HOOKS,
    description: 'Shared custom hooks',
  },
  {
    label: SharedFolder.STORE,
    description: 'Shared store',
  },
];

export const sharedLibFolders: string[] = [
  SharedFolder.API,
  SharedFolder.HELPERS,
  SharedFolder.HOOKS,
  SharedFolder.STORE,
];
