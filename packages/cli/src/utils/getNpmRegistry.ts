import { isAliNpm } from 'ice-npm-utils';
import config from './config';
import log from './log';

export default async function (npmName, materialConfig, publishConfig, enableUseTaobao): Promise<string> {
  // 某些场景不能用 taobao 源（generate）
  let registry = enableUseTaobao ? 'https://registry.npmmirror.com' : 'https://registry.npmjs.org';
  if (publishConfig && publishConfig.registry) {
    registry = publishConfig.registry;
  } else if (process.env.REGISTRY) {
    // 兼容老的用法
    registry = process.env.REGISTRY;
  } else if (isAliNpm(npmName)) {
    registry = 'https://registry.npm.alibaba-inc.com';
  } else if (materialConfig && materialConfig.registry) {
    registry = materialConfig.registry;
  } else {
    const configRegistry = await config.get('registry');
    if (configRegistry) {
      registry = configRegistry;
    }
  }

  log.verbose('getNpmRegistry', registry);
  return registry;
}
