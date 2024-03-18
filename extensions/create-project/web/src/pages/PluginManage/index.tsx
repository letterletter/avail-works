import React, { useEffect, useState } from 'react';
// import { PostMessageClient } from '@ad/postmessage-client';
import { OPEN_TYPE, PluginTypeEnum } from './types';
import './index.less';
import { SettingOutlined } from '@ant-design/icons';

interface NavItem {
  id: string;
  name: string;
  jobId?: number;
  type?: 'extension' | 'link' | 'webview';
  btnType?: 'link' | 'ghost' | 'text' | 'default' | 'primary' | 'dashed' | undefined;
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
  pluginName: '';
  /** 类型枚举：内置:1 第三方:2 */
  pluginType: PluginTypeEnum.INTEGRATION;
  /** 跳转 ID */
  pluginLinkId: string;
  /** 跳转类型：插件、webview、link */
  pluginLinkType: OPEN_TYPE;
  /** 配置入口 ID */
  pluginConfigId?: string;
  /** 配置入口跳转类型 */
  pluginConfigType?: OPEN_TYPE;
  pluginShowEntryConfKey?: string;
  pluginShowIcon?: string;
  isInstall?: boolean;
  isInstallLoading?: boolean;
  isReload?: boolean;
}


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
    /** 配置入口 ID */
    pluginConfigId: '',
    /** 配置入口跳转类型 */
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
    /** 配置入口 ID */
    pluginConfigId: '',
    /** 配置入口跳转类型 */
    pluginConfigType: OPEN_TYPE.extension,
    pluginShowEntryConfKey: '',
  },
];


const PluginManagement = () => {
  const [pluginList, setPluginList] = useState<PluginInfo[]>([]);

  const onInstallClick = (id: string) => {
    // return PostMessageClient.instance.send<typeof installRequestType>(installRequestType, id);
  };
  const onUninstallClick = (id: string) => {
    // return PostMessageClient.instance.send<typeof uninstallRequestType>(
    //     uninstallRequestType,
    //     id,
    // );
  };
  const onClick = (id: string) => {
    // PostMessageClient.instance.send<typeof openRequestType>(openRequestType, id);
  };
  const onConfigClick = (itemInfo: NavItem) => {
    // PostMessageClient.instance.send<typeof openConfigRequestType>(
    //     openConfigRequestType,
    //     itemInfo,
    // );
  };

  async function getPluginInfo() {
    // const data = await PostMessageClient.instance.send(fetchRequestType, {});
    const data = mockList;
    return data as PluginInfo[];
  }

  const init = async () => {
    const pluginInfo = await getPluginInfo();
    console.log('init----- wf', pluginInfo);
    setPluginList(pluginInfo);
  };

  useEffect(() => {
    init();
  }, []);

  // 监听页面刷新命令
  useEffect(() => {
    // const disposable = PostMessageClient.instance.on<NotificationType<PluginInfo[], any>>(
    //     new NotificationType('vsc://plugin/refresh'),
    //     (pluginList) => {
    //         if (pluginList.length) {
    //             setPluginList(pluginList);
    //         }
    //     },
    // );
    return () => {
      // 取消监听
      // disposable.dispose();
    };
  }, []);

  const setPluginLoading = (id: string, isLoading: boolean) => {
    setPluginList((pluginList) => {
      const target = pluginList.find((plugin) => plugin.pluginAppId === id);
      if (target) {
        target.isInstallLoading = isLoading;
      }
      return [...pluginList];
    });
  };

  const setPluginReload = (id: string, isReload: boolean) => {
    setPluginList((pluginList) => {
      const target = pluginList.find((plugin) => plugin.pluginAppId === id);
      if (target) {
        target.isReload = isReload;
      }
      return [...pluginList];
    });
  };

  const onInstallBtnClick = async (pluginInfo: PluginInfo) => {
    if (pluginInfo.isInstallLoading) {
      return;
    }
    if (pluginInfo.isReload) {
      // PostMessageClient.instance.send(reloadRequestType, {});
    }
    if (pluginInfo.isInstall) {
      const isNeedReload = await onUninstallClick(pluginInfo.pluginAppId);
      console.log('isNeedReload', isNeedReload);

      if (isNeedReload) {
        setPluginReload(pluginInfo.pluginAppId, true);
      }
    } else {
      // 这里把 loding 置为 true 后，不用设置回 false，因为安装会触发数据重新加载
      setPluginLoading(pluginInfo.pluginAppId, true);
      await onInstallClick(pluginInfo.pluginAppId);
    }
  };

  return (
    <>
      <div>测试测试 PluginManagement</div>
      {pluginList?.map((item) => (
        <div className="plugin-management" key={item.pluginAppId}>
          <section
            className="item-container"
            onClick={() => {
              if (item.pluginType === PluginTypeEnum.THIRD) {
                onClick(item.pluginAppId);
              }
              if (item.pluginType === PluginTypeEnum.INTEGRATION) {
                onConfigClick({
                  id: item.pluginName,
                  name: item.pluginName,
                  type: item.pluginLinkType,
                });
              }
            }}
          >
            <img
              className="img-container"
              width="60"
              height="60"
              src={item.pluginIcon}
              alt=""
            />
            <div className="title-container">
              <h3 className="title">{item.pluginName}</h3>
              <p className="desc">{item.pluginDesc}</p>
            </div>
          </section>

          {item.pluginConfigId && (
          <SettingOutlined
            className="config-container"
            onClick={() => {
              onConfigClick({
                id: item.pluginConfigId || '',
                name: item.pluginName,
                type: item.pluginConfigType || OPEN_TYPE.webview,
              });
            }}
          />
          )}
          {item.pluginType === PluginTypeEnum.THIRD && (
          <div
            className="button-container"
            onClick={() => {
              onInstallBtnClick(item);
            }}
          >
            {item.isInstallLoading
              ? '正在安装中'
              : item.isReload
                ? '重新加载'
                : item.isInstall
                  ? '卸载'
                  : '安装'}
          </div>
          )}
        </div>
      ))}
    </>
  );
};

// export { PluginManagement };


const IntlConfigHelper = () => {
  return (
      <PluginManagement />
  );
};

export default IntlConfigHelper;
