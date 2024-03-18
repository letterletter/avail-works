import * as vscode from 'vscode';

const configScopeFlag = 'kdh';

export const getConfig = (flag: string): string | undefined => {
  return vscode.workspace.getConfiguration(configScopeFlag).get(flag);
};

export const getCurrentWorkingFolder = () => {
  return vscode.workspace.workspaceFolders?.[0].uri.path;
};

export const showMessage = (tip: string) => {
  vscode.window.showInformationMessage(tip);
};

export const showError = (tip: string) => {
  vscode.window.showErrorMessage(tip);
};

export const openInBrowser = (link: string) => {
  vscode.env.openExternal(vscode.Uri.parse(link));
};
