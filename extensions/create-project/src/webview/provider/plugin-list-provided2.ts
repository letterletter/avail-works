import * as vscode from 'vscode';
import xorBy from 'lodash.xorby';

import BaseWebviewProvider from './base-provider';
import ExtensionManager from '../../managers/extension';
// import { detectDeployRelatedTermFromReadme } from "../../utils/func/deploy";
// import { openInBrowser } from "../../utils/common";

export default class PluginListProvider2 extends BaseWebviewProvider {
  private static instance: PluginListProvider2;

  constructor() {
    super('dist/webview/plugin-manage.js');
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

  /**
   * 由于拿不到子插件安装和卸载的完成态，所有通过监听所有插件状态变化来动态判断
   * 注：插件状态变更时，根据前后两个子插件集的差集来判断
   * @private
   * @memberof PluginManagement
   */
      private onSubPluginChange() {
        const { commands, extensions } = vscode
      // const isKiloSubPlugin = (id: string) =>
      //     id.includes(PluginManagement.preId) ||
      //     id.includes('kfc') ||
      //     id.includes('kwai-plateco-fe') ||
      //     id.includes('kuaishou-miniapp') ||
      //     id.includes('kuaishou.kwaipilot');

      const isKiloSubPlugin = (id) => {
        return false
      }
      // 获取插件的初始安装状态，保存在内存中
      // TODO: 这里不应该硬编码 ID 判断，应该根据 DB 里的子插件列表进行查找
      let allPreKiloExtensions = extensions.all.filter((item) => isKiloSubPlugin(item.id));

      // 监听本地所有插件状态变更，更新子插件列表
      // TODO: 只在子插件状态变更时，更新列表
      extensions.onDidChange(async () => {
          // 每次都获取最新的插件安装状态
          // TODO: 这里不应该硬编码 ID 判断，应该根据 DB 里的子插件列表进行查找
          const allKiloExtensions = extensions.all.filter((item) => isKiloSubPlugin(item.id));

          // 证明有新安装的插件
          if (allPreKiloExtensions.length < allKiloExtensions.length) {
              // 取差集获取当前安装的插件
              const installExtensions = xorBy(allPreKiloExtensions, allKiloExtensions, 'id');

              const subPluginList = [] // await PluginManagement.getAllSubPluginList();
              // const updateQuickStartParams: UpdateQuickStartInfo[] = [];
              installExtensions.forEach((item) => {
                  const plugin = subPluginList.find(
                      (subPlugin) => subPlugin.pluginAppId === item.id,
                  );
                  if (plugin?.pluginLinkId) {
                      // updateQuickStartParams.push({
                      //     startName: plugin.pluginName,
                      //     startAppId: plugin.pluginAppId,
                      //     startLinkId: plugin.pluginLinkId,
                      //     startLinkType: plugin.pluginLinkType,
                      //     startLinkExtraParams: plugin.pluginLinkExtraParams,
                      // });
                  }
              });

              // commands.executeCommand(QuickStart.addCommand, updateQuickStartParams);
          } else {
              // 有插件卸载，取差集获取当前卸载的插件
              // const uninstallExtensions = xorBy(allPreKiloExtensions, allKiloExtensions, 'id');
              // commands.executeCommand(QuickStart.refreshCommand);
          }

          // commands.executeCommand(PluginManagement.refreshCommand);

          // 覆盖插件前序的安装状态，以便下次进行判断
          allPreKiloExtensions = allKiloExtensions;
      });
  }

  public initGlobalListener(): void {
    this.onSubPluginChange()
  }

  async handleReceiveMessage(type: string, payload: any) {
    console.log('letter 获取参数', type, payload)
    switch (type) {
      case 'openInBrowser':
        // openInBrowser(payload.link);
        return;
      case 'install':
        return vscode.window.withProgress(
          { location: vscode.ProgressLocation.Notification },
          (progress) => {
              progress.report({ message: `正在安装${payload}插件` });

              return vscode.commands.executeCommand(
                  'workbench.extensions.installExtension',
                  `${payload}`,
              );
          },
      );
        // return;
      case 'uninstall':
        await vscode.commands.executeCommand(
          'workbench.extensions.uninstallExtension',
          `${payload}`,
        );
        const ext = vscode.extensions.getExtension(payload);
        if (ext?.isActive) {
            vscode.window
                .showInformationMessage(
                    '插件卸载完成，需要重新加载',
                    '确定',
                    '取消',
                )
                .then((select) => {
                    if (select === '确定') {
                        vscode.commands.executeCommand(
                            'workbench.action.reloadWindow',
                        );
                    }
                });

            // 需要重新加载
            return true;
        }
        // 不需要重新加载
        return false;
      default:
        return true;
    }
  }

  static getInstance() {
    if (!PluginListProvider2.instance) {
      PluginListProvider2.instance = new PluginListProvider2();
    }

    return PluginListProvider2.instance;
  }
}
