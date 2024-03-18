import {
  CancellationToken,
  Uri,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from "vscode";
import { getHtmlForWebview } from "@appworks/connector";
import { showError, showMessage } from "../../utils/common";

import ExtensionManager from "../../managers/extension";

export default class BaseWebviewProvider implements WebviewViewProvider {
  extensionUri: Uri;
  webview?: WebviewView;
  // extensionPath: string;
  vendorsResource?: any;
  webviewResource?: any;

  constructor(webviewResource: string) {
    this.extensionUri = ExtensionManager.getManager().getContext().extensionUri;
    this.webviewResource = Uri.joinPath(this.extensionUri, webviewResource);
    const a = Uri.joinPath(this.extensionUri, webviewResource)
    this.vendorsResource = Uri.joinPath(
      this.extensionUri,
      "dist/webview/vendors.js"
    );
    this.initGlobalListener();
  }

  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext<unknown>,
    token: CancellationToken
  ): void | Thenable<void> {
    this.webview = webviewView;
    console.log('resolve wevview---- ', this.webview)
    this.vendorsResource = this.webview.webview.asWebviewUri(
      this.vendorsResource
    );
    this.webviewResource = this.webview.webview.asWebviewUri(
      this.webviewResource
    );

    this.webview.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    this.webview.webview.html = this.getHtmlForWebview();
    console.log('getHtmlForWebview --- letter', this.getHtmlForWebview() )
    this.webview.onDidChangeVisibility(() => {
      if (this.webview?.visible) {
        this.render();
      }
    }); 

    this.render();

    // 注册接受消息事件
    this.webview.webview.onDidReceiveMessage(({ type, payload }) => {
      this.handleReceiveMessage(type, payload);
    });
  }

  render() {}
  initGlobalListener() {}
  afterUserInfosChanged() {}

  handleReceiveMessage(type: string, payload: any) {
    switch (type) {
      case "showMessage":
        showMessage(payload);
        return;
      case "showError":
        showError(payload);
        return;
    }
  }

  sendMessage(type: string, payload?: any, delay?: number) {
    setTimeout(() => {
      this.webview?.webview.postMessage({
        type,
        payload,
      });
    }, delay || 100);
  }

  getHtmlForWebview() {
    const htmlRowContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Swet Panel</title>
            <style>
              body {
                background-color: transparent !important;
              }
            </style>
        </head>
    
        <body>
            <div id="ice-container">
            <div>hello</div>
            </div>
            <script>
            const vscode = acquireVsCodeApi();
            </script>
            <script src="${this.webviewResource}"></script>
            <script src="${this.vendorsResource}"></script>
        </body>
        </html>
    `;

    return htmlRowContent;
  }
}
