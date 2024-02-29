import * as oss from 'ali-oss';

// letter-avail-works

const keyId = 'LTAI5t9iwF5hTZqN2j9o7JyX';
const keySecret = 'Wut6ZBdgH735CzV05cZy9ciGfA198Q';
const ossClient = oss({
  bucket: 'letter-avail-works',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
  accessKeyId: process.env.ACCESS_KEY_ID, // process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET, //process.env.ACCESS_KEY_SECRET,
  timeout: '300s',
});

function upload(target, filePath) {
  ossClient
    .put(target, filePath)
    .then(() => {
      console.log(`[UPLOAD] ${filePath} upload success.`);
    })
    .catch(() => {
      console.log(`[ERROR] ${filePath} upload failed.`);
    });
}

export default upload;
