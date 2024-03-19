/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/member-ordering */

import * as vscode from 'vscode';
import xorBy from 'lodash.xorby';

import BaseWebviewProvider from './base-provider';
import ExtensionManager from '../../managers/extension';
// import { detectDeployRelatedTermFromReadme } from "../../utils/func/deploy";
// import { openInBrowser } from "../../utils/common";

export default class PluginActivateAndRunProvider2 extends BaseWebviewProvider {
  private static instance: PluginActivateAndRunProvider2;

  constructor() {
    super('dist/webview/debug-run-manage.js');
  }

  render() {
    // 获取部署方式
    // const deployMethods = detectDeployRelatedTermFromReadme(
    //   ExtensionManager.getManager().getProjectPath()
    // );
    const arr = [1, 2, 3, 4];
    if (arr.length) {
      this.sendMessage('loadData', arr);
    } else {
      this.sendMessage('setEmpty');
    }
  }

  async handleReceiveMessage(type: string, payload: any) {
    console.log('letter  调试/运行获取参数', type, payload);
    switch (type) {
      case 'openInBrowser':
        // openInBrowser(payload.link);
        return;
      case 'executeCommand':
        vscode.commands.executeCommand(payload)
        console.log('执行命令')
        return;
      case 'getExtensionInfo':
        const extension = vscode.extensions.getExtension(payload);
        const packageJson = extension?.packageJSON;
        const configuration = vscode.workspace.getConfiguration(payload)
        const formatData = {
          availConf: packageJson.availconf,
          config: {
            activate: configuration.get(`${packageJson.shortCut}.activate`),
            debug: configuration.get(`${packageJson.shortCut}.debug`),
          },
        };
        console.log('packageJson', packageJson, formatData);

        this.sendMessage('setExtensionConfig', formatData);
        //   return vscode.window.withProgress(
        //     { location: vscode.ProgressLocation.Notification },
        //     (progress) => {
        //         progress.report({ message: `正在安装${payload}插件` });

      //         return vscode.commands.executeCommand(
      //             'workbench.extensions.installExtension',
      //             `${payload}`,
      //         );
      //     },
      // );
        return;
      default:
        return true;
    }
  }

  static getInstance() {
    if (!PluginActivateAndRunProvider2.instance) {
      PluginActivateAndRunProvider2.instance = new PluginActivateAndRunProvider2();
    }

    return PluginActivateAndRunProvider2.instance;
  }
}
