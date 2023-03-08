import OSS from 'ali-oss';
import axios from 'axios';
// import request from "@utils/request";

export default {
  oss: null,
  getReturnObject(success, message, url) {
    return {
      success,
      url,
      message,
    }
  },
  async init() {
    const accessObj = await this.getToken();
    console.log('====accessObj====', accessObj)
    if(!accessObj.accessKeyId) {
      // todo
      // return this.getReturnObject(false, '获取文件上传凭证失败');
    }

    this.initOss(accessObj);
    // const path = this.getPath();
    // const fileUrl = await this.upload(this.dataToFile(data), path);

    // if(fileUrl) {
    //   return this.getReturnObject(true, '', fileUrl);
    // } else {
    //   return this.getReturnObject(false, '');
      
    // }
  },

  initOss(accessObj) {
    this.oss = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: 'oss-cn-hangzhou',
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: accessObj.accessKeyId,
      accessKeySecret: accessObj.accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: accessObj.securityToken,
      refreshSTSToken: async () => {
      // 向您搭建的STS服务获取临时访问凭证。
        const info = await this.getToken();
        return {
          accessKeyId: info.accessKeyId,
          accessKeySecret: info.accessKeySecret,
          stsToken: info.securityToken
        }
      },
      // 刷新临时访问凭证的时间间隔，单位为毫秒。
      refreshSTSTokenInterval: 300000,
      // 填写Bucket名称。
      bucket: 'discoverse'
    });
  },

  getPath(fileName: string = '') {
    let path = 'metadata/cyberconnect/';
    path += (fileName ? fileName : Math.floor(Math.random() * 100000000000)) + '.json';
    return path;
  },

  async getToken() {
    const res = await axios.post('https://app-test.discoverse.club/api/v2/token/accessOssBySts').catch(e => e);
    console.log('getToken', res);
    if(res?.data?.data?.accessKeyId) {
      return res?.data?.data;
    }
    // return new Promise((resolve, reject) => {
    //   request({
    //     url: `/api/v2/token/accessOssBySts`,
    //     method: "post",
    //     data: {},
    //     success: (res) => {
    //       if(res?.data?.data?.accessKeyId) {
    //         resolve(res?.data?.data);
    //       } else {
    //         reject()
    //       }
    //     },
    //     fail: (res) => {
    //       reject(res)
    //     }
    //   });
    // })
  },
  dataToFile(data) {
    return new File([JSON.stringify(data)], '.json', {
      type: 'application/json',
      lastModified: Date.now()
    })
  },

  async upload(data, fileName) {
    const resp = await this.oss.put(this.getPath(fileName), this.dataToFile(data), {});
    // console.log('upload resp', resp);
    return resp?.url || '';
  },
}