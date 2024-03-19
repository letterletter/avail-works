import PluginListProvider2 from './plugin-list-provided2';
import PluginActivateRunProvided from './plugin-activate-run-provided';
export default [
  { key: 'plugin-list-manage', instance: PluginListProvider2.getInstance() },
  { key: 'plugin-activate-run', instance: PluginActivateRunProvided.getInstance() }
];
