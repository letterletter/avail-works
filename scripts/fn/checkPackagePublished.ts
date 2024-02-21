
// import { getLatestVersion, getNpmInfo } from 'ice-npm-utils';
import { getPublishedPackages } from './published-info';
import axios from 'axios';
import { join as joinPath } from 'node:path/posix';


function getNpmRegistry(npmName) {
  if (npmName === undefined) { npmName = ''; }
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  }
  return 'https://registry.npmjs.org'

  // return 'https://registry.npmmirror.com';
}

/**
 * 从 registry 获取 npm 的信息
 */
async function getNpmInfo(npm, registry?: string) {
  const register = registry || getNpmRegistry(npm);
  // const url = urlJoin(register, npm);
  const url = new URL(register);

  url.pathname = joinPath(npm);

  const response = await axios.get(url.toString())
  console.log('registry---', npm, register, url.toString(), response.data);
  let body
  try {
    body = response.data;// JSON.parse(response.data as any);
  } catch (error) {
    return Promise.reject(error);
  }
  console.log('body ---- ', body)
  return body
  // return fetch(url.toString()).then((response) => {
  //   let body;
  //   try {
  //     body = JSON.parse(response as any);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  //   return body;
  // });
}

/**
 * 获取某个 npm 的最新版本号
 *
 * @param {String} npm
 */
async function getLatestVersion(npm, registry?: string) {
  const data = await getNpmInfo(npm, registry)
  if (!data['dist-tags'] || !data['dist-tags'].latest) {
    console.error('没有 latest 版本号', data);
    return Promise.reject(new Error('Error: 没有 latest 版本号'));
  }
  const latestVersion = data['dist-tags'].latest;
  return latestVersion;
  // return getNpmInfo(npm, registry).then((data) => {
  //   if (!data['dist-tags'] || !data['dist-tags'].latest) {
  //     console.error('没有 latest 版本号', data);
  //     return Promise.reject(new Error('Error: 没有 latest 版本号'));
  //   }
  //   const latestVersion = data['dist-tags'].latest;
  //   return latestVersion;
  // });
}

async function getNpmVersion(name: string, isBeta: boolean): Promise<string> {
  let version = '';
  try {
    if (isBeta) {
      const data = await getNpmInfo(name);
      console.log('is Beta', isBeta, data)
      if (data['dist-tags'] && data['dist-tags'].beta) {
        version = data['dist-tags'].beta;
      }
    } else {
      version = await getLatestVersion(name);
    }
  } catch (e) {
    // ignore
  }
  return version;
}

// Check published packages can be installed.
export default function checkPackagePublished(isBeta?: boolean) {
  const publishedPackages: string[] = getPublishedPackages();
  console.log('publishedPackages---', publishedPackages);
  const timeout = 10000;
  const maxDetectTimes = 30;
  return Promise.all(
    publishedPackages.map((publishedPackage) => {
      return new Promise((resolve, retject) => {
        const info = publishedPackage.split(':');
        // Example: @appworks/project-service:0.1.8
        const name = info[0];
        const version = info[1];
        console.log('------- info', info);

        let times = 0;
        const timer = setInterval(() => {
          if (times++ > maxDetectTimes) {
            // Exit if detect times over maxDetectTimes.
            clearInterval(timer);
            retject(new Error(`${name}@${version} publish failed! Please try again.`));
          } else {
            getNpmVersion(name, !!isBeta)
              .then((latestVersion) => {
                console.log('lastVersion', latestVersion);
                if (version === latestVersion) {
                  // Can be installed.
                  clearInterval(timer);
                  console.log('can be installed');
                  resolve(undefined);
                }
              })
              .catch((err) => {
                console.log('catch---', err);
                // ignore
              });
          }
        }, timeout);
      });
    }),
  );
}
