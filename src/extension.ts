import { join } from 'path';
import * as vscode from 'vscode';
import { foldersOptions, layerOptions, sliceOptions } from './configs';
import { sharedFoldersOptions } from './configs/sharedFolders.quickPick.config';
import { folders, layers, sharedFolders, sharedLibFolders } from './constants';
import { InterFolder } from './types/inter-folder.enum';

export function activate(context: vscode.ExtensionContext) {
  console.log('FSD Generator is now active!');

  const generateStructureCommand = vscode.commands.registerCommand(
    'fsd-generator.generateStructure',
    async (uri: vscode.Uri) => {
      const layerName = await vscode.window.showQuickPick(layers, layerOptions);
      const isShared = layerName === 'shared';

      const sliceName = !isShared
        ? await vscode.window.showInputBox(sliceOptions)
        : null;

      if ((!isShared && !sliceName) || !layerName) {
        return;
      }

      try {
        const targetUri = await getTargetUri(
          uri ?? vscode.workspace.workspaceFolders![0].uri
        );
        if (!targetUri) {
          throw new Error('No workspace folder is open');
        }

        const folderPath = vscode.Uri.file(
          !isShared
            ? join(targetUri.fsPath, layerName, sliceName!)
            : join(targetUri.fsPath, layerName)
        );

        await createLayerFolders(folderPath, layerName === 'shared');
        vscode.window.showInformationMessage(
          isShared
            ? `Shared layer created successfully!`
            : `Slice '${sliceName}' in layer '${layerName}' created successfully!`
        );
      } catch (err: any) {
        vscode.window.showErrorMessage(`Error creating slice: ${err.message}`);
      }
    }
  );

  context.subscriptions.push(generateStructureCommand);
}

async function createLayerFolders(folderPath: vscode.Uri, isShared = false) {
  const layerFolders = isShared ? sharedFolders : folders;
  const layerOptions = isShared ? sharedFoldersOptions : foldersOptions;

  const foldersToCreate = (await vscode.window.showQuickPick(
    layerFolders,
    layerOptions
  )) as unknown as vscode.QuickPickItem[];

  await vscode.workspace.fs.createDirectory(folderPath);

  if (foldersToCreate) {
    await createInterFolders(
      folderPath,
      foldersToCreate.map(folder => folder.label),
      isShared
    );
  }
}

async function createInterFolders(
  uri: vscode.Uri,
  folders: string[],
  shared = false
) {
  folders.forEach(async folder => {
    const isFolderInLib = shared && sharedLibFolders.includes(folder);
    const folderPath = vscode.Uri.file(
      isFolderInLib ? join(uri.fsPath, 'lib', folder) : join(uri.fsPath, folder)
    );
    await vscode.workspace.fs.createDirectory(folderPath);

    const isUiFolder = folder === InterFolder.UI;
    createIndexFile(folderPath, isUiFolder ? 'tsx' : 'ts');
  });
}

function createIndexFile(uri: vscode.Uri, extension: 'tsx' | 'ts') {
  const indexFile = vscode.Uri.file(join(uri.fsPath, `index.${extension}`));
  vscode.workspace.fs.writeFile(indexFile, new Uint8Array(0));
}

async function getTargetUri(currentUri: vscode.Uri) {
  const findSrcFolder = async (uri: vscode.Uri): Promise<string> => {
    const hasLocalSrc = (await vscode.workspace.fs.readDirectory(uri)).some(
      ([name]) => name === 'src'
    );
    if (hasLocalSrc) {
      return join(uri.fsPath, 'src');
    }

    const srcIndex = uri.fsPath.indexOf('src');
    if (srcIndex !== -1) {
      return uri.fsPath.substring(0, srcIndex + 3);
    }

    const entries = await vscode.workspace.fs.readDirectory(uri);
    for (const [name, type] of entries) {
      if (type === vscode.FileType.Directory) {
        try {
          const childUri = vscode.Uri.file(join(uri.fsPath, name));
          const result = await findSrcFolder(childUri);
          if (result) {
            return result;
          }
        } catch (error) {
          continue;
        }
      }
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error('No workspace folder found');
    }

    const srcFiles = await vscode.workspace.findFiles('**/src', null, 1);
    if (!srcFiles.length) {
      throw new Error('No src folder found in the workspace');
    }

    return srcFiles[0].fsPath;
  };

  return vscode.Uri.file(await findSrcFolder(currentUri));
}

export function deactivate() {}
