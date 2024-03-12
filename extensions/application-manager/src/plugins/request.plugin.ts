import axios, { Axios } from 'axios';
import { isNil, isEmpty } from 'lodash';
import { Context } from './context.plugin';

export enum PlatformEnvEnum {
  halo = 'halo',
  team = 'team',
  kdev = 'kdev',
  kim = 'kim',
  kilo = 'kilo',
  notify = 'notify',
  kcdn = 'kcdn',
}

export interface BaseRes {
  code: number;
  message?: string;
  data: {
    [x: string]: any;
  };
}

export interface BaseReq {
  [x: string]: any;
}

export class Request {
    private httpClient: Axios;
    private baseUrl: { [key: string]: any } = {
      development: {
        // kim 的域名由外部直接传递
        kim: '',
        halo: 'https://halo.corp.kuaishou.com',
        team: 'https://team.corp.kuaishou.com',
        kdev: 'https://kdev.corp.kuaishou.com',
        kilo: 'https://kilo.staging.kuaishou.com',
        notify: 'https://ad-notify-center.staging.kuaishou.com',
        kcdn: 'https://kcdn.corp.kuaishou.com',
      },
      production: {
        // kim 的域名由外部直接传递
        kim: '',
        halo: 'https://halo.corp.kuaishou.com',
        team: 'https://team.corp.kuaishou.com',
        kdev: 'https://kdev.corp.kuaishou.com',
        kilo: 'https://kilo.corp.kuaishou.com',
        notify: 'https://notify-center.e.kuaishou.com',
        kcdn: 'https://kcdn.corp.kuaishou.com',
      },
    };
    private cookieKey: string;
    private platformEnv: string;
    // request的构造函数
    constructor(platformEnv: PlatformEnvEnum, cookieKey?: string) {
      if (isNil(platformEnv) || isEmpty(platformEnv)) {
        throw new Error('env must not be empty');
      }
      this.httpClient = axios.create({
        baseURL: this.getBaseUrl(platformEnv),
        timeout: platformEnv === PlatformEnvEnum.kilo ? 2 * 60 * 1000 : 5000,
        withCredentials: true,
      });
      this.platformEnv = platformEnv as string;
      this.cookieKey = cookieKey as string;
      this.httpClient.interceptors.response.use(
        (res) => {
          console.log('response', res);
          // 统一接口数据格式
          // halo 平台的接口格式不统一

          if (res.data?.data === undefined) {
            return {
              code: 0,
              message: '',
              data: res.data,
            };
          }
          return res.data;
        },
        (err) => {
          console.log('response error', err);
          return err;
        },
      );

      this.httpClient.interceptors.request.use(
        (req) => {
          console.log('request', req);
          return req;
        },
        (err) => {
          console.log('request err', err);
        },
      );
    }

    getBaseUrl(platformEnv: PlatformEnvEnum): string {
      const urlMap = this.baseUrl['production'];
      return urlMap[platformEnv];
    }
    // 前提是登录成功
    getCookieFromCache() {
      const context = Context.get();
      return (context.globalState.get(this.cookieKey) as string) || '';
    }

    getKiloAuthFromCache() {
      const context = Context.get();
      return (context.globalState.get('kiloAuth') as string) || '';
    }

    async get(url: string, params?: BaseReq): Promise<BaseRes> {
      const context = Context.get();
      return this.httpClient.get<BaseReq, BaseRes>(url, {
        params,
        headers:
                this.platformEnv === PlatformEnvEnum.kilo
                  ? {
                    Authorization: (`Bearer ${this.getKiloAuthFromCache()}`) as string,
                  }
                  : {
                    Cookie: this.getCookieFromCache(),
                  },
      });
    }

    post(url: string, params: BaseReq, headers?: any): Promise<BaseRes> {
      const context = Context.get();
      return this.httpClient.post<BaseReq, BaseRes>(url, params, {
        headers:
                this.platformEnv === PlatformEnvEnum.kilo
                  ? {
                    ...headers,
                    Authorization: (`Bearer ${this.getKiloAuthFromCache()}`) as string,
                  }
                  : {
                    ...headers,
                    Cookie: this.getCookieFromCache(),
                  },
      });
    }
}
