import { QuickPickItem, QuickPickItemKind } from 'vscode';
import { InterFolder } from '../types';

export const folders: QuickPickItem[] = [
  {
    label: 'core',
    kind: QuickPickItemKind.Separator,
  },
  {
    label: InterFolder.API,
    description: 'API services',
    picked: true,
  },
  {
    label: InterFolder.MODELS,
    description: 'Data models',
    picked: true,
  },
  {
    label: InterFolder.UI,
    description: 'UI components',
    picked: true,
  },
  {
    label: 'other',
    kind: QuickPickItemKind.Separator,
  },
  {
    label: InterFolder.STORE,
    description: 'App state manager',
  },
];
