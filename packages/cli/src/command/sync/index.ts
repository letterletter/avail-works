import * as path from 'path';
import { checkAliInternal, isAliNpm } from 'ice-npm-utils';
import * as inquirer from 'inquirer';
import * as fse from 'fs-extra';
import * as chalk from 'chalk';
import { DB_PATH, TOKEN_ALI_KEY, TOKEN_KEY } from '../../utils/constants';
import FusionSDK from './fusionSDK';
import goldlog from '../../utils/goldlog';
import log from '../../utils/log';
import config from '../../utils/config';

export default async (options) => {
  const cwd = process.cwd();
  const DB_PATH_ABSOLUTE = path.join(cwd, DB_PATH);
  const pkgPath = path.join(cwd, 'package.json');
  const pkgData = await fse.readJson(pkgPath);
  const { name, materialConfig = {} } = pkgData;
  let syncToAli = false;

  if (isAliNpm(name)) {
    // 内部物料源只允许同步到内部
    syncToAli = true;
  } else {
    // 外部物料源：内网环境询问下；外网环境直接同步到外部
    const isAliInternal = await checkAliInternal();
    if (isAliInternal) {
      const { forAli } = await inquirer.prompt([
        {
          type: 'confirm',
          message: '您正处于阿里巴巴内网环境，是否需要同步到内部站点？',
          name: 'forAli',
        },
      ]);
      syncToAli = forAli;
    }
  }

  goldlog('sync', materialConfig);

  // get materialsData
  const materialsData = await getMaterialData(pkgData, DB_PATH_ABSOLUTE);

  const fusionSDK = new FusionSDK({
    syncToAli,
    env: options.env,
  });

  // get fusion token
  const tokenKey = syncToAli ? TOKEN_ALI_KEY : TOKEN_KEY;
  let fusionToken = await config.get(tokenKey);
  if (!fusionToken) {
    fusionToken = await fusionSDK.getToken();
    try {
      await config.set(tokenKey, fusionToken);
    } catch (err) {
      log.warn('set token warning', err.message);
    }
  }
  log.verbose('get fusion token success', fusionToken);

  // select fusion site by token
  let fusionSite;
  if (materialConfig['fusion-site']) {
    fusionSite = materialConfig['fusion-site'];
  } else {
    try {
      fusionSite = await fusionSDK.getSite(fusionToken);
    } catch (err) {
      if (err.noAuth) {
        // token 失效，重置掉本地 token
        await config.set(tokenKey, null);
      } else {
        // 接口异常、列表为空
        log.error('error', `${err.message}，如果怀疑是 token 问题，可通过命令 ${chalk.cyan(`appworks config set ${tokenKey}`)} 手动清除 token，然后再次执行 sync 命令`);
      }
      throw err;
    }

    materialConfig['fusion-site'] = fusionSite;
    pkgData.materialConfig = materialConfig;
    try {
      await fse.writeJson(pkgPath, pkgData, { spaces: 2 });
      log.verbose('Sync:', 'write site success');
    } catch (err) {
      log.warn('write site warning', err.message);
      console.error(err);
    }
  }
  log.verbose('select fusion site success', fusionSite);

  // upload data to fusion
  try {
    const materialUrl = await fusionSDK.uploadMaterialsData(fusionToken, fusionSite, materialsData);
    console.log();
    log.info('Sync:', '物料上传完成，可以在 appworks 中添加自定义物料使用啦！');
    log.info('物料地址：', materialUrl);
    console.log();
  } catch (err) {
    if (err.noAuth) {
      // token 失效，重置掉
      await config.set(tokenKey, null);
    } else {
      log.error('error', `${err.message}，如果怀疑是 token 问题，可通过命令 ${chalk.cyan(`appworks config set ${tokenKey}`)} 手动清除 token，然后再次执行 sync 命令`);
    }
    throw err;
  }
};

async function getMaterialData(pkgData, materialDataPath) {
  const result = [];

  if (pkgData.componentConfig) {
    // 单独的 component 项目
    result.push({
      npm: pkgData.name,
      version: pkgData.version,
      type: 'component',
    });
  } else if (pkgData.materialConfig) {
    // material collection
    const data = await fse.readJson(materialDataPath);

    ['block', 'scaffold', 'component'].forEach((materialType) => {
      (data[`${materialType}s`] || []).forEach((item) => {
        result.push({
          npm: item.source.npm,
          version: item.source.version,
          type: materialType,
        });
      });
    });
  } else {
    throw new Error('Invalid ice materials project, Missing `materialConfig` property in package.json file.');
  }

  return result;
}
