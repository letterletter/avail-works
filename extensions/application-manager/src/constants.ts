import { NodeDepTypes } from './types';

export const nodeDepTypes: NodeDepTypes[] = ['dependencies', 'devDependencies'];

export const showExtensionsQuickPickCommandId = 'applicationManager.showEntriesQuickPick';

export const editorTitleRunDebugCommandId = 'npmScripts-editor-title-run-dev';
export const editorTitleRunBuildCommandId = 'npmScripts-editor-title-run-build';

export const projectExistsTime = 5;


export enum MESSAGE_CHANNEL {
  openApp = 'vsc://sidebar/open',
}

export enum OPEN_TYPE {
  extension = 'extension',
  webview = 'webview',
  link = 'link',
}

export const EXTENSION_ID = 'Kilo';

export const NOTIFY_HOST: string = 'ws://172.28.202.42:3000';
