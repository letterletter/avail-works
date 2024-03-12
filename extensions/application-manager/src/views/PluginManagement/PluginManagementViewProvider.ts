import {
  WebviewViewProvider,
  Uri,
  WebviewView,
  extensions,
  commands,
  env,
  window,
  ProgressLocation,
  Webview,
} from 'vscode';
import {  getHtmlForWebview  as originGetHtmlForWebview} from '@appworks/connector/lib/vscode';

import { NotificationType, RequestType } from 'vscode-jsonrpc';
// import { PostMessageServer, WebviewIpcRequestMessage } from '@ad/postmessage-server';
// import { App, getKsUserInfoRequestType } from '../app.controller';
import { PluginInfo, PluginTypeEnum, OPEN_TYPE } from './type';
import { getAllSubPluginListApi } from './api';

const mockList = [
  {
    /** 插件作者 */
    pluginAuthor: 'letterletter',
    /** 插件描述 */
    pluginDesc: 'test',
    /** 插件icon */
    pluginIcon: '',
    /** 插件 ID */
    pluginAppId: 'demo-plugin',
    /** 插件名称 */
    pluginName: '',
    /** 类型枚举：内置:1 第三方:2 */
    pluginType: PluginTypeEnum.INTEGRATION,
    /** 跳转 ID */
    pluginLinkId: '',
    /** 跳转类型：插件、webview、link */
    pluginLinkType: OPEN_TYPE.extension,
    /** 配置入口 ID*/
    pluginConfigId: '',
    /** 配置入口跳转类型*/
    pluginConfigType: OPEN_TYPE.extension,
    pluginShowEntryConfKey: '',
},
{
  /** 插件作者 */
  pluginAuthor: 'letterletter',
  /** 插件描述 */
  pluginDesc: '创建',
  /** 插件icon */
  pluginIcon: '',
  /** 插件 ID */
  pluginAppId: 'letterletter.availworks-project-creator',
  /** 插件名称 */
  pluginName: '',
  /** 类型枚举：内置:1 第三方:2 */
  pluginType: PluginTypeEnum.INTEGRATION,
  /** 跳转 ID */
  pluginLinkId: '',
  /** 跳转类型：插件、webview、link */
  pluginLinkType: OPEN_TYPE.extension,
  /** 配置入口 ID*/
  pluginConfigId: '',
  /** 配置入口跳转类型*/
  pluginConfigType: OPEN_TYPE.extension,
  pluginShowEntryConfKey: '',
}
]
/**
 * 插件管理视图数据源提供类
 * @class PluginManagementViewProvider
 * @implements {WebviewViewProvider}
 */
class PluginManagementViewProvider implements WebviewViewProvider {
    private extensionUri: Uri;
    private id: string;
    private view?: WebviewView;
    static pluginList: PluginInfo[] = [];
    constructor(id: string, extensionUri: Uri) {
      this.extensionUri = extensionUri;
      this.id = id;
    }

    /**
     * 获取子插件集合，根据本地状态判断是否安装
     * @static
     * @memberof PluginManagementViewProvider
     */
    static getAllSubPluginList = async () => {
      if (!PluginManagementViewProvider.pluginList.length) {
        PluginManagementViewProvider.pluginList = await getAllSubPluginListApi();
        // mockList
        PluginManagementViewProvider.pluginList = mockList;

      }

      const subPluginList = PluginManagementViewProvider.pluginList.map((item) => {
        if (item.pluginType === PluginTypeEnum.THIRD) {
          const ext = extensions.getExtension(item.pluginAppId);
          // 已安装
          if (ext) {
            const commands: PluginInfo['commands'] = [
              ...ext.packageJSON.contributes?.commands,
            ];
            return {
              ...item,
              isInstall: true,
              isInstallLoading: false,
              commands: commands
                .filter((commandItem) => commandItem.enablement === 'true')
                .map((commandItem) => ({
                  title: commandItem.title,
                  command: commandItem.command,
                })),
            };
          }
          // 未安装
          return {
            ...item,
            isInstall: false,
            isInstallLoading: false,
          };
        }
        // 内置插件直接返回
        return { ...item, isInstall: true };
      });

      return subPluginList;
    };

    /**
     * 子插件数据刷新事件
     * @memberof PluginManagementViewProvider
     */
    async refresh() {
      if (this.view?.webview) {
        const pluginList = await PluginManagementViewProvider.getAllSubPluginList();

        // const postMessageServer = PostMessageServer.getInstance(this.view.webview);
        // postMessageServer.notify(new NotificationType('vsc://plugin/refresh'), pluginList);
        console.log(`子插件管理刷新列表：${JSON.stringify(pluginList)}`);
      }
    }

    /**
     * 要实现的方法：生成 WebviewView 视图
     * @param {WebviewView} webviewView
     * @memberof PluginManagementViewProvider
     */
    resolveWebviewView(webviewView: WebviewView) {
      this.view = webviewView;

      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [this.extensionUri],
      };

      webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

      // const postMessageServer = PostMessageServer.getInstance(webviewView.webview);

      // 在此 webview 中处理网页页面的消息，用于页面通信
      webviewView.webview.onDidReceiveMessage((req) => {
        console.log('sidebar view received message from webview', req);
        switch (req.method) {
          // 获取数据源
          case 'remote://plugin/fetch':
            // postMessageServer.onIpcRequest(
            //   new RequestType('remote://plugin/fetch'),
            //   req,
            //   async () => {
            //     const pluginList =
            //                     await PluginManagementViewProvider.getAllSubPluginList();
            //     console.log(
            //       `子插件管理 remote://plugin/fetch 命令通信：${JSON.stringify(
            //         pluginList,
            //       )}`,
            //     );
            //     return pluginList;
            //   },
            // );
            break;
            // 插件打开事件
          case 'vsc://plugin/open':
            env.openExternal(Uri.parse(`vscode:extension/${req.params}`));
            console.log(`子插件管理点击插件：${req.params}`);
            break;
            // 插件安装事件
          case 'vsc://plugin/install':
            // postMessageServer.onIpcRequest(
            //   new RequestType('vsc://plugin/install'),
            //   req,
            //   async () => {
            //     console.log(`子插件管理安装插件：${req.params}`);
            //     return window.withProgress(
            //       { location: ProgressLocation.Notification },
            //       (progress) => {
            //         progress.report({ message: `正在安装${req.params}插件` });

            //         return commands.executeCommand(
            //           'workbench.extensions.installExtension',
            //           `${req.params}`,
            //         );
            //       },
            //     );
            //   },
            // );

            break;

            // 插件卸载事件
          case 'vsc://plugin/uninstall':
            // postMessageServer.onIpcRequest(
            //   new RequestType('vsc://plugin/uninstall'),
            //   req,
            //   async () => {
            //     console.log(`子插件管理卸载插件：${req.params}`);
            //     await commands.executeCommand(
            //       'workbench.extensions.uninstallExtension',
            //       `${req.params}`,
            //     );
            //     const ext = extensions.getExtension(req.params);
            //     if (ext?.isActive) {
            //       window
            //         .showInformationMessage(
            //           '插件卸载完成，需要重新加载',
            //           '确定',
            //           '取消',
            //         )
            //         .then((select) => {
            //           if (select === '确定') {
            //             commands.executeCommand(
            //               'workbench.action.reloadWindow',
            //             );
            //           }
            //         });

            //       // 需要重新加载
            //       return true;
            //     }
            //     // 不需要重新加载
            //     return false;
            //   },
            // );
            break;
            // 插件刷新 window 事件
          case 'vsc://plugin/reload':
            // postMessageServer.onIpcRequest(
            //   new RequestType('vsc://plugin/reload'),
            //   req,
            //   async () => {
            //     commands.executeCommand('workbench.action.reloadWindow');
            //   },
            // );
            break;
            // 插件打开配置页面事件
          case 'vsc://plugin/open/config':
            // App.openAppHandler(
            //     {
            //         id: req.id,
            //         method: MESSAGE_CHANNEL.openApp,
            //         params: {
            //             id: req.params.id,
            //             name: req.params.name,
            //             type: req.params.type,
            //         },
            //     },
            //     this.extensionUri,
            // );
            break;
            // 获取用户信息
            // case 'remote://access/getuserinfo':
            //     postMessageServer.onIpcRequest<typeof getKsUserInfoRequestType>(
            //         getKsUserInfoRequestType,
            //         req as WebviewIpcRequestMessage,
            //         async (type: any, params: any) => {
            //             // Event.emit('sentryUser', res?.data); // @sentry/node 中增加用户信息
            //             return res;
            //         },
            //     );
            //     break;

          default:
            console.warn('sidebar view received message from webview unknown method');
        }
      });
    }

    /**
     * 获取 HTML 字符串 Webview 模版
     * @private
     * @return {string} HTML 字符串
     * @memberof PluginManagementViewProvider
     */
    private getHtmlForWebview(webview: Webview) {
      return originGetHtmlForWebview(extensionPath, 'pluginmanagement')
      // return View.getHtml(this.extensionUri, this.id, webview, {});
    }
}

export default PluginManagementViewProvider;
