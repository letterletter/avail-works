import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { initExtension, registerCommand } from '@appworks/common-service';
import { ICEWORKS_ICON_PATH } from '@appworks/constant';
// import { Recorder } from '@appworks/recorder';
import services from './services/index';
import { Base64 } from 'js-base64';
import i18n from './i18n';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = {} //  new Recorder(name, version);

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context;

  console.log('Congratulations, your extension "project-creator" is now active!');

  // auto set configuration
  initExtension(context);

  let projectCreatorwebviewPanel: vscode.WebviewPanel | undefined;

  function activeProjectCreatorWebview() {
    if (projectCreatorwebviewPanel) {
      projectCreatorwebviewPanel.reveal();
    } else {
      projectCreatorwebviewPanel = window.createWebviewPanel(
        'appworks',
        i18n.format('extension.iceworksProjectCreator.createProject.webViewTitle'),
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      projectCreatorwebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'createproject', false);
      projectCreatorwebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
      projectCreatorwebviewPanel.onDidDispose(
        () => {
          projectCreatorwebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );
      connectService(projectCreatorwebviewPanel, context, { services, recorder });
    }
  }

  subscriptions.push(
    registerCommand('project-creator.create-project.start', () => {
      activeProjectCreatorWebview();
    }),
  );


  const stateKey = 'appworks.projectCreator.autoActivedWebview';
  if (!globalState.get(stateKey)) {
    activeProjectCreatorWebview();
    globalState.update(stateKey, true);
  }
}

export function deactivate() {}
