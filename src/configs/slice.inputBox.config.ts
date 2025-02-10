import { InputBoxOptions } from 'vscode';
import { title } from '../constants';

export const sliceOptions: InputBoxOptions = {
  title,
  prompt: 'Enter the slice name',
  placeHolder: 'Slice name',
};
