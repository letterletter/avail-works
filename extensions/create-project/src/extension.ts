import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { registerCommand, initExtension } from '@appworks/common-service';
import ExtensionManager from "./managers/extension";

import { services } from './services';

// eslint-disable-next-line
const { name } = require('../package.json');

function activate(context: vscode.ExtensionContext) {

  const { window, } = vscode;
  const { extensionPath } = context;

  ExtensionManager.getManager(context).extensionStartup();


  // auto set configuration
  // initExtension(context);

  let webviewPanel: vscode.WebviewPanel | undefined;

  const openWebview = () => {

    if (webviewPanel) {
      webviewPanel.reveal();
      return;
    }

    webviewPanel = window.createWebviewPanel('appworks', 'Webview Title', vscode.ViewColumn.Two, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    const extraHtml = `
      <script>
        window.MESSAGE = 'Hello World11111';
      </script>
    `;

    webviewPanel.webview.html = getHtmlForWebview(extensionPath, '', false, '', extraHtml);
    webviewPanel.onDidDispose(() => {
      webviewPanel = undefined;
    }, null, context.subscriptions);

    connectService(webviewPanel, context, { services });
  };

  registerCommand('.createStart', () => {
    openWebview();
  });
}

exports.activate = activate;
