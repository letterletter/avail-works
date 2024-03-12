

export enum OPEN_TYPE {
	extension = "extension",
	webview = "webview",
	link = "link"
}

/**
 * 插件类型枚举
 * @enum {number}
 */
enum PluginTypeEnum {
    /** 内置插件 */
    INTEGRATION = 1,
    /** 第三方插件 */
    THIRD = 2,
}

/**
 * 子插件类型
 * @interface PluginInfo
 */
interface PluginInfo {
    /** 插件作者 */
    pluginAuthor: string;
    /** 插件描述 */
    pluginDesc: string;
    /** 插件icon */
    pluginIcon: string;
    /** 插件 ID */
    pluginAppId: string;
    /** 插件名称 */
    pluginName: string;
    /** 类型枚举：内置:1 第三方:2 */
    pluginType: PluginTypeEnum;
    /** 跳转 ID */
    pluginLinkId: string;
    /** 跳转类型：插件、webview、link */
    pluginLinkType: OPEN_TYPE;
    /** 配置入口 ID*/
    pluginConfigId?: string;
    /** 配置入口跳转类型*/
    pluginConfigType?: string;
    /** 跳转配置，用于个性化配置 JSON 字符串 */
    pluginLinkExtraParams?: Record<string | number, any>;
    /** 本地是否安装 */
    isInstall?: boolean;
    /** 安装 loading */
    isInstallLoading?: boolean;
    /** 子插件命令集合 */
    commands?: { title: string; command: string; enablement?: string }[];
}

export type { PluginInfo };
export { PluginTypeEnum };
