import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
// import { PostMessageClient } from '@ad/postmessage-client';
import { OPEN_TYPE, PluginTypeEnum } from './types';
import { Input, Select } from 'antd';
import './app.less';
import useSendMessage from '../hooks/useSendMessage';
import useReceiveMessage from '../hooks/useReceiveMessage';
import { SettingOutlined } from '@ant-design/icons';

interface NavItem {
  id: string;
  name: string;
  jobId?: number;
  type?: 'extension' | 'link' | 'webview';
  btnType?: 'link' | 'ghost' | 'text' | 'default' | 'primary' | 'dashed' | undefined;
}
const mockPluginList = [
  'letterletter.create-project',
  'letterletter.availworks-project-creator',
  'letterletter.cat-coding',
  'letterletter.availworks-app',
  'letterletter.availworks-material-helper',
  'letterletter.letter-demo-wf-test',
]

const DebugAndRunPlugin = () => {
  const [pluginId, setPluginId] = useState<string | undefined>(undefined);
  const [extensionConfig, setExtensionConfig] = useState<{ availConf: {activate?: string, debug?: string }} | undefined>(undefined);
  const [send] = useSendMessage();


  useReceiveMessage(
    {
      // loadData: (payload: any) => setDeployMethods(payload),
      setExtensionConfig: (value) => handleSetExtension(value),
    },
    [],
  );

  const handleSetExtension = (value) => {
    console.log('receive extension', value);
    setExtensionConfig(value);
  };
  const onRequestClick = (id: string) => {
    return send('install', id);
  };
  const onUninstallClick = (id: string) => {
    return send('uninstall', id);
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

  const handleChange = (value) => {
    send('getExtensionInfo', value);
  }

  const init = async () => {
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
  };

  const handleClick = (command) => {
    send('executeCommand', command);
  }
  return (
    <>
      <div>测试测试 PluginManagement</div>
      <Select style={{ width: '100%' }} options={mockPluginList.map(item => ({ label: item, value: item }))} onChange={handleChange} />
      {
        extensionConfig?.availConf?.activate ? <Button onClick={() => handleClick(extensionConfig?.availConf?.activate)}>激活</Button> : null
      }
      {
        extensionConfig?.availConf?.debug ? <Button onClick={() => handleClick(extensionConfig?.availConf?.debug)}>调试</Button> : null
      }
    </>
  );
};

// export { PluginManagement };


const IntlConfigHelper = () => {
  return (
    <DebugAndRunPlugin />
  );
};

export default IntlConfigHelper;
