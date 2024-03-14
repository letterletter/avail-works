import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { initExtension, registerCommand } from '@appworks/common-service';
import { autoSetContext as autoSetContextByProject } from '@appworks/project-service';
import { ICEWORKS_ICON_PATH } from '@appworks/constant';
import services from './services/index';
import i18n from './i18n';
import recorder from './utils/recorder';
import { createComponentsTreeView } from './views/componentsView';
import { createPagesTreeView } from './views/pagesView';

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions } = context;

  console.log('Congratulations, your extension "material-helper" is now active!');

  // auto set configuration
  initExtension(context);
  autoSetContextByProject();

  // set material importer
  let materialImporterWebviewPanel: vscode.WebviewPanel | undefined;
  function activeMaterialImporterWebview() {
    if (materialImporterWebviewPanel) {
      materialImporterWebviewPanel.reveal();
    } else {
      let columnToShowIn = ViewColumn.One;
      let layout = { orientation: 0, groups: [{}] };
      if (window.activeTextEditor) {
        columnToShowIn = ViewColumn.Beside;
        layout = { orientation: 0, groups: [{ size: 0.7 }, { size: 0.3 }] };
      }

      materialImporterWebviewPanel = window.createWebviewPanel(
        'AppWorks',
        i18n.format('extension.iceworksMaterialHelper.materailImporter.title'),
        { viewColumn: columnToShowIn, preserveFocus: true },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          enableFindWidget: true,
        },
      );
      materialImporterWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'materialimporter');
      materialImporterWebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH);
      materialImporterWebviewPanel.onDidDispose(
        () => {
          materialImporterWebviewPanel = undefined;
        },
        null,
        context.subscriptions,
      );

      vscode.commands.executeCommand('vscode.setEditorLayout', layout);

      connectService(materialImporterWebviewPanel, context, { services, recorder });
    }
  }
  subscriptions.push(
    registerCommand('material-helper.material-importer.start', () => {
      const { visibleTextEditors } = vscode.window;
      if (visibleTextEditors.length) {
        activeMaterialImporterWebview();
      } else {
        vscode.window.showErrorMessage(i18n.format('extension.iceworksMaterialHelper.extension.start.errorMessage'));
      }
    }),
  );


  propsAutoComplete();
  mtopAutoComplete();

  // views
  createComponentsTreeView(context);
  createPagesTreeView(context);

  importAutoComplete();
  // help user complete React Component's propTypes;
  propTypesAutoComplete();

  // exports
  return {
  };
}

export function deactivate() { }
