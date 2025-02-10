import { QuickPickOptions } from 'vscode';
import { title } from '../constants';

export const sharedFoldersOptions: QuickPickOptions = {
  title,
  placeHolder: 'Choose a folders to include',
  canPickMany: true,
};
