// import { Request, PlatformEnvEnum } from '@/extension/plugin';
import Axios from 'axios';
import { PluginInfo } from './type';

// const httpClient = new Request(PlatformEnvEnum.kilo);

/**
 * 获取所有子插件集合
 * @return {Promise} Promise 操作对象
 */
const getAllSubPluginListApi = () => {
    return Axios
        .get('/rest/kilo/home/all_sub_plugin_list')
        .then((data) => {
            if (data.code === 200) {
                const res: PluginInfo[] = data.data.map((item: any) => ({
                    ...item,
                    pluginLinkExtraParams: JSON.parse(item.pluginLinkExtraParams),
                }));
                return Promise.resolve(res);
            }
            return Promise.resolve([]);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

export { getAllSubPluginListApi };
