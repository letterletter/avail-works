import { ExtensionContext, window, commands, extensions } from 'vscode';
import { xorBy } from 'lodash';
import * as vscode from 'vscode';
import { OPEN_TYPE } from '../../constants';
// import { App } from '../app.controller';
import PluginManagementViewProvider from './PluginManagementViewProvider';
import { PluginTypeEnum } from './type';

import type { PluginInfo } from './type';
/**
 * 插件管理逻辑类，激活插件管理列表视图
 * @class PluginManagement
 */
class PluginManagement {
    /**
     * 子插件管理注册 ID
     * @static
     * @memberof PluginManagement
     */
    static readonly id = 'avail-plugin-management';

    /**
     * 子插件前缀 ID
     * @static
     * @memberof PluginManagement
     */
    static readonly preId = 'Kilo';

    /**
     * 子插件管理刷新命令
     * @static
     * @memberof PluginManagement
     */
    static readonly refreshCommand = `${`${PluginManagement.id}.refresh`}`;

    /**
     * 子插件管理配置页面打开命令
     * @static
     * @memberof PluginManagement
     */
    static readonly openConfigCommand = `${`${PluginManagement.id}.openConfig`}`;

    /**
     * 配置页面跳转对象
     * @static
     * @memberof PluginManagement
     */
    static readonly configLink = {
      id: 'manage',
      type: OPEN_TYPE.webview,
      name: '插件设置',
    };

    private context: ExtensionContext;
    private pluginManagementViewProvider: PluginManagementViewProvider;

    constructor(context: ExtensionContext) {
      this.context = context;
      this.pluginManagementViewProvider = new PluginManagementViewProvider(
        PluginManagement.id,
        this.context.extensionUri,
      );
    }

    /**
     * 获取所有子插件集合
     * @static
     * @return {Promise} Promise 对象
     * @memberof PluginManagement
     */
    static getAllSubPluginList() {
      return PluginManagementViewProvider.getAllSubPluginList();
    }

    /**
     * 由于拿不到子插件安装和卸载的完成态，所有通过监听所有插件状态变化来动态判断
     * 注：插件状态变更时，根据前后两个子插件集的差集来判断
     * @private
     * @memberof PluginManagement
     */
    private onSubPluginChange() {
      const isKiloSubPlugin = (id: string) =>
        id.includes(PluginManagement.preId) ||
            id.includes('kfc') ||
            id.includes('kwai-plateco-fe') ||
            id.includes('kuaishou-miniapp') ||
            id.includes('kuaishou.kwaipilot');

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

          const subPluginList = await PluginManagement.getAllSubPluginList();
          installExtensions.forEach((item) => {
            const plugin = subPluginList.find(
              (subPlugin) => subPlugin.pluginAppId === item.id,
            );
            if (plugin?.pluginLinkId) {
              updateQuickStartParams.push({
                startName: plugin.pluginName,
                startAppId: plugin.pluginAppId,
                startLinkId: plugin.pluginLinkId,
                startLinkType: plugin.pluginLinkType,
                startLinkExtraParams: plugin.pluginLinkExtraParams,
              });
            }
          });

          // commands.executeCommand(QuickStart.addCommand, updateQuickStartParams);
        } else {
          // 有插件卸载，取差集获取当前卸载的插件
          // const uninstallExtensions = xorBy(allPreKiloExtensions, allKiloExtensions, 'id');
          // commands.executeCommand(QuickStart.refreshCommand);
        }

        commands.executeCommand(PluginManagement.refreshCommand);

        // 覆盖插件前序的安装状态，以便下次进行判断
        allPreKiloExtensions = allKiloExtensions;
      });
    }

    /**
     * 注册激活插件管理列表视图
     * @memberof PluginManagement
     */
    activate() {
      window.registerWebviewViewProvider(PluginManagement.id, this.pluginManagementViewProvider, {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      });
      console.log('子插件letter管理激活成功');

      this.context.subscriptions.push(
        // 子插件管理打开配置页
        commands.registerCommand(PluginManagement.openConfigCommand, () => {
          // App.openAppHandler(
          //     {
          //         id: PluginManagement.configLink.id,
          //         method: MESSAGE_CHANNEL.openApp,
          //         params: {
          //             id: PluginManagement.configLink.id,
          //             type: PluginManagement.configLink.type,
          //             name: PluginManagement.configLink.name,
          //         },
          //     },
          //     this.context.extensionUri,
          // );
          console.log(
            `子插件管理打开配置页面：${JSON.stringify({
              id: PluginManagement.configLink.id,
              type: PluginManagement.configLink.type,
              name: PluginManagement.configLink.name,
            })}`,
          );
        }),
        // 子插件管理刷新事件
        commands.registerCommand(PluginManagement.refreshCommand, () => {
          this.pluginManagementViewProvider.refresh();
          console.log('子插件管理刷新事件触发');
        }),
      );

      this.onSubPluginChange();
    }
}

export { PluginManagement, PluginTypeEnum };
export type { PluginInfo };

