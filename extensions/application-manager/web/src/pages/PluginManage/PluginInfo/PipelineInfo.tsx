import { Divider } from '@alifd/next';
import React, { useEffect, useState } from 'react';
import './index.less';

export const PipelineInfo = () => {
  return (
    <section>
      <div className="wrapper">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            alt=""
            className="img-container"
            src="https://js-ad.a.yximgs.com/kos/nlav12177/chrome-plugin-upload/2022-12-26/1672024964350.7a53595519d3b32f.svg"
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="title-container">流水线</h2>
            <h4>
              Kilo |{' '}
              {/* <Rate
                disabled
                defaultValue={5}
                style={{ fontSize: 'var(--vscode-font-size)', color: '#ff8e00' }}
              /> */}
            </h4>
            <h4>流水线部署配置</h4>
          </div>
        </div>
        <span className="word-container">功能</span>
        <Divider />
        <div className="content-container">
          <h1>流水线配置部署</h1>
          在数据配置面板中，可以添加流水线 ID，在插件中显示出的流水线名称可以自己定义
          <img
            style={{ marginTop: '10px', marginBottom: '10px' }}
            src="https://tx-ad.a.yximgs.com/kos/nlav11206/chrome-plugin-upload/2022-09-02/1662120944173.b44d472e7ef46484.png"
            alt=""
          />
          可以直接在 VS Code 中部署流水线，支持三种环境的流水线部署
          点击持续集成模块下的流水线入口，打开一个流水线部署页面
          填好分支、代理等信息后，可以触发流水线部署
          <img
            style={{ marginTop: '10px' }}
            src="https://tx-ad.a.yximgs.com/kos/nlav11206/chrome-plugin-upload/2022-09-02/1662121158364.353316e9f369f4f9.png"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};
