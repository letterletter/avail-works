import React, { useState, useEffect } from 'react';
import { Notification } from '@alifd/next';
import callService from '@/callService';
// import Material from '@appworks/material-ui';
import { IMaterialData, IMaterialBlock, IMaterialComponent, IMaterialBase } from '@appworks/material-utils';
import { useIntl } from 'react-intl';
import styles from './index.module.scss';
import { LocaleProvider } from '../../i18n';

const Home = () => {
  const [projectComponentType, setProjectComponentType] = useState('');
  const intl = useIntl();
  async function getSources() {
    let sources = [];
    try {
      sources = await callService('material', 'getSourcesByProjectType');
    } catch (e) {
      Notification.error({
        content: intl.formatMessage({ id: 'web.iceworksMaterialHelper.extension.getMaterialError' }),
      });
    }
    return sources;
  }

  useEffect(() => {
    callService('material', 'getProjectComponentType').then((res: string) => {
      setProjectComponentType(res);
    });
  }, []);
  return (
    <div className={styles.container}>
      物料导入
      {/* <Material
        disableLazyLoad
        onSettingsClick={onSettingsClick}
        getSources={getSources}
        getComponentTypeOptions={getComponentTypeOptions}
        refreshSources={refreshSources}
        getData={getData}
        projectComponentType={projectComponentType}
        onBlockClick={onBlockClick}
        onBaseClick={onBaseClick}
        onComponentClick={onComponentClick}
        dataWhiteList={['bases', 'blocks', 'components']}
      /> */}
    </div>
  );
};

export const IntlHome = () => {
  return (
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  );
};

export default IntlHome;
