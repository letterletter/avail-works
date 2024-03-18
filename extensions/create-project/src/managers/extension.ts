import * as vscode from "vscode";

// import SSO, { UserInfos } from "../utils/sso";

// import CommnadManager from "./command";

export default class ExtensionManager {
  constructor(private readonly extentionContext: vscode.ExtensionContext) {}

  private static instance: ExtensionManager;
  private userInfos?: any;
  private webviewProviders?: any[];

  [key: string]: any;

  getContext() {
    return this.extentionContext;
  }

  getUserInfos() {
    return this.userInfos;
  }

  setUserInfos(userInfos: any) {
    this.userInfos = userInfos;
    this.webviewProviders?.forEach((provider) =>
      provider.instance.afterUserInfosChanged()
    );
  }

  getWebviewProviders() {
    return this.webviewProviders;
  }

  async userInfosInit() {
    try {
      // 获取用户登陆信息
      // 先看看当前 vscode 是否有 sso 插件，如果有直接调用该插件实现 sso 登陆
      const ssoExt = vscode.extensions.getExtension("Kilo.sso-vsc");

      const ssoApi = ssoExt?.exports;
      const hasLogin = await ssoApi.isLogin();

      if (hasLogin) {
        const ksUserInfo = await ssoApi.getUserInfo();
        // const teamCookie = await ssoApi.getCookie("team", teamSSOUrl);
        this.userInfos = {
          ...ksUserInfo,
          // cookie: teamCookie,
        };
        // SSO.getInstance().saveUserInfos(this.userInfos!);
      } else {
        console.log("没有登陆");
        // 打开 sso 插件登陆页面
        await ssoApi.showSsoWebview();
        await ssoApi.onLogin(
          "team",
          // teamSSOUrl,
          async (cookie: string, userInfo: any) => {
            this.userInfos = {
              ...userInfo,
              cookie,
            };
            // SSO.getInstance().saveUserInfos(this.userInfos!);
            await ssoApi.hideSsoWebview();
          }
        );
      }
    } catch (e) {
      // sso 插件不存在
    }
  }

  async extensionStartup() {
    // 获取用户信息
    // this.userInfos = SSO.getInstance().getLoginInfos();

    if (!this.userInfos) {
      // 用户信息不存在时，尝试用 sso 插件获取
      // 获取不到就算了
      await this.userInfosInit();
    }

    // 注册所有 webview
    const { default: webviewProviders } = await import("../webview/provider");

    this.webviewProviders = webviewProviders;
    webviewProviders.forEach((provider) => {
      this.extentionContext.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
          provider.key,
          provider.instance
        )
      );

      this[provider.key + "-provider"] = provider.instance;

      // 注册全局的监听
      provider.instance.initGlobalListener();
    });

    // this.commandManager = new CommnadManager();
  }

  getProjectPath() {
    return vscode.workspace.workspaceFolders![0].uri.fsPath;
  }

  static getManager(context?: vscode.ExtensionContext) {
    if (!ExtensionManager.instance) {
      if (!context) {
        throw new Error("KDH extension init require extension context");
      }

      ExtensionManager.instance = new ExtensionManager(context);
    }

    return ExtensionManager.instance;
  }
}
