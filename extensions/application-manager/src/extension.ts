/* eslint-disable no-new */
import * as vscode from 'vscode';
import { window, ViewColumn } from 'vscode';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import {
  checkIsTargetProjectType,
  autoSetContext as autoSetContextByProject,
  projectPath,
} from '@appworks/project-service';
import { ICEWORKS_ICON_PATH } from '@appworks/constant';
import { checkIsO2, initExtension, registerCommand, getFolderExistsTime, getDataFromSettingJson } from '@appworks/common-service';
import { createActionsTreeView } from './views/actionsView';
import { createNodeDependenciesTreeView } from './views/nodeDependenciesView';
import { createQuickEntriesTreeView } from './views/quickEntriesView';
import services from './services';
import { showExtensionsQuickPickCommandId, projectExistsTime } from './constants';
import showAllQuickPick from './quickPicks/showAllQuickPick';
import createScriptsCommands from './utils/createScriptsCommands';
import createExtensionsStatusBar from './statusBar/createExtensionsStatusBar';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
// const recorder = new Recorder(name, version);
const recorder = {};
export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions, extensionPath } = context;

  console.log('Congratulations, your extension "application-manager" is now active!', extensionPath);

  // auto set configuration & context
  initExtension(context);
  autoSetContextByProject();

  // init statusBarItem
  const extensionsStatusBar = createExtensionsStatusBar();
  subscriptions.push(extensionsStatusBar);
  subscriptions.push(
    registerCommand(showExtensionsQuickPickCommandId, async () => {
      await showAllQuickPick();
    }),
  );

  // init config webview
  let configWebviewPanel: vscode.WebviewPanel | undefined;
  function activeConfigWebview(focusField: string) {
    if (configWebviewPanel) {
      configWebviewPanel.reveal();
    } else {
      configWebviewPanel = window.createWebviewPanel(
        'appworks',
        i18n.format('extension.applicationManager.configHelper.extension.webviewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      const extraHtml = `<script>
        window.iceworksAutoFocusField = "${focusField}";
      </script>
      `;
      configWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'confighelper', false, undefined, extraHtml);
      configWebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
      configWebviewPanel.onDidDispose(
        () => {
          configWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(configWebviewPanel, context, { services });
    }
  }
  subscriptions.push(
    registerCommand('applicationManager.configHelper.start', (focusField: string) => {
      activeConfigWebview(focusField);
    }),
  );

  // init welcome webview
  let welcomeWebviewPanel: vscode.WebviewPanel | undefined;
  function activeWelcomeWebview() {
    if (welcomeWebviewPanel) {
      welcomeWebviewPanel.reveal();
    } else {
      welcomeWebviewPanel = window.createWebviewPanel(
        'appworks',
        i18n.format('extension.applicationManager.welcome.extension.webviewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );

      welcomeWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'welcome');
      welcomeWebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
      welcomeWebviewPanel.onDidDispose(
        () => {
          welcomeWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(welcomeWebviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('applicationManager.welcome.start', () => {
      activeWelcomeWebview();
    }),
  );


  let pluginManageWebviewPanel: vscode.WebviewPanel | undefined;

  // init tree view
  const treeViews: any[] = [];
  treeViews.push(createQuickEntriesTreeView(context));
  treeViews.push(createActionsTreeView(context));
  treeViews.push(createNodeDependenciesTreeView(context));
  treeViews.forEach((treeView) => {
    const { title } = treeView;
    treeView.onDidChangeVisibility(({ visible }) => {
      console.log('changeVisible --- ', visible);
    });
  });

  await createScriptsCommands(context, recorder);

  // TODO auto start welcome page when the application is new
  const isTargetProjectType = await checkIsTargetProjectType();
  const isShowWelcomePage = await getDataFromSettingJson('showWelcomePage', true);
  if (projectPath && isTargetProjectType && isShowWelcomePage && !vscode.window.activeTextEditor) {
    const curProjectExistsTime = getFolderExistsTime(projectPath);
    if (projectExistsTime > curProjectExistsTime) {
      // vscode.commands.executeCommand('applicationManager.welcome.start');
      // globalState.update(didShowWelcomePageBySidebarStateKey, true);
    }
  }
}

export function deactivate() { }
