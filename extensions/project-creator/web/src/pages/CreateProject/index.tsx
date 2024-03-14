import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Notification, Icon, Loading } from '@alifd/next';
import callService from '@/callService';
import { IProjectField, IDEFProjectField } from '@/types';
import { LocaleProvider } from '@/i18n';
import { useIntl, FormattedMessage } from 'react-intl';
import { IMaterialSource } from '@appworks/material-utils';
import CreateProjectForm from '@/components/CreateProjectForm';
import styles from './index.module.scss';

const { CLIENT_TOKEN } = process.env;

const CreateProject: React.FC = () => {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [curProjectField, setCurProjectField] = useState<IProjectField>({} as any);
  const [materialSources, setMaterialSources] = useState<IMaterialSource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function createProject(data: IProjectField) {
    const projectDir = await callService('project', 'createProject', data);
    const { projectPath } = data;
    await callService('common', 'saveDataToSettingJson', 'workspace', projectPath);
    await callService('project', 'openLocalProjectFolder', projectDir);
  }

  async function onSettingsClick() {
    try {
      await callService('common', 'executeCommand', 'applicationManager.configHelper.start');
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  async function getMaterialSources() {
    const sources: any = (await callService('material', 'getSources')) as IMaterialSource[];
    setMaterialSources(sources);
    return sources;
  }
  async function refreshMaterialSources() {
    await callService('material', 'cleanCache');
    const sources = await getMaterialSources();
    setMaterialSources(sources);
  }

  useEffect(() => {
    async function setDefaultFields() {
      const workspace = (await callService('common', 'getDataFromSettingJson', 'workspace')) || '';
      setCurProjectField({ ...curProjectField, projectPath: workspace });
    }
    async function initMaterialSources() {
      const sources = await getMaterialSources();
      setMaterialSources(sources);
    }
    async function initData() {
      try {
        setLoading(true);
        await initMaterialSources();
        await setDefaultFields();
      } catch (e) {
        Notification.error({ content: e.message });
      } finally {
        setLoading(false);
      }
    }
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <div>项目创建main</div>
      <Card free>
        <Card.Content className={styles.cardContent}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>
                <FormattedMessage id="web.iceworksProjectCreator.CreateProject.createProject" />
              </div>
              <div className={styles.subTitle}>
                <FormattedMessage id="web.iceworksProjectCreator.CreateProject.subTitle" />
              </div>
            </div>
            <div className={styles.headerBtns}>
              <Button size="medium" text onClick={onSettingsClick} className={styles.btn}>
                <Icon type="set" />
                <FormattedMessage id="web.iceworksProjectCreator.CreateProject.setting" />
              </Button>
              {currentStep === 0 && (
                <Button size="medium" text onClick={refreshMaterialSources}>
                  <Icon type="refresh" />
                  <FormattedMessage id="web.iceworksProjectCreator.CreateProject.refresh" />
                </Button>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

const IntlCreateProject = () => {
  return (
    <LocaleProvider>
      <CreateProject />
    </LocaleProvider>
  );
};

export default IntlCreateProject;
