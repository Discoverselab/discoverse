// import ImageUtil from "@utils/ImageUtil";
import Taro, {getCurrentInstance} from "@tarojs/taro";

import createCanvas from "../createCanvas";
import createShareCardCanvas from "../createShareCardCanvas";
import createExhibitCanvas from "../createExhibitCanvas";
import createExhibitLoverCanvas from "../createExhibitLoverCanvas";
import shareMessage from "../../../manager/shareMessage";

export default {
  setShowImageUrl() {},
  setSetShowImageUrl(setShowImageUrl) {
    this.setShowImageUrl = setShowImageUrl;
  },
  displayData: {},
  shareCardImageUrl: '',
  downloadCardImageUrl: '',
  isDownloadCardFinish: false,
  isShareCardFinish: false,
  async init() {
    // Taro.showLoading({ title: "海报生成中", mask: true });
    // const shareImageUrl = await this.getShareImageUrl();
    const shareImageUrl = 'dd';
    if(!shareImageUrl) {
      return Taro.showToast({
        title: "二维码生成码出错",
        icon: "none",
        duration: 2000,
      });
    }
    try {
      debugger
      const displayData = this.displayData;
      if(true && displayData.isCreator && displayData.remaining > 0) {
        createCanvas.createCanvas('soulShareCanvas', {
          shareImageUrl,
          cardIcon: displayData.image,
          // titleFontSize: displayData.type === 6 ? 30 : 24,
          titleFontSize: 24,
          titleHeight: displayData.type === 6 ?  45 : 36,
          relationTitle: displayData.type === 6 ? `To 我的${displayData.relationTitle || ''}` : '',
          description: displayData.description || '',
          username: displayData.userName,
          headImage: displayData.headImage,
          emitTime: displayData.emitTime,
          txHash: (displayData.type),
          // txHash: displayData.txHash,
          activityType: displayData.type,
          cb: (resp) => {
            console.log('download form success', resp);
            this.isDownloadCardFinish = true;
            this.hideLoading();
            this.createCanvasCb(resp);
          }
        });
      } else {
        // 恋人关系单独
        if(displayData.activityType === 6 && displayData.relationType === 0) {
          createExhibitLoverCanvas.createCanvas('soulExhibitLoverCanvas', {
            shareImageUrl,
            relationTitle: `To 我的${displayData.relationTitle || ''}`,
            userName: displayData.userName || '',
            headImage: displayData.headImage,
            emitTime: displayData.emitTime,
            description: displayData.description || '',
            activityType: displayData.activityType,
            relationType: displayData.relationType,
            receivedList: displayData.receivedList || [],
            tokenIdList: displayData.tokenIdList || [],
            txHash: displayData.txHash,
            contractAddress: displayData.contractAddress,
            cb: (resp) => {
              console.log('lover canvas cb')
              this.isDownloadCardFinish = true;
              this.hideLoading();
              this.createCanvasCb(resp);
            }
          })
        } else {
          createExhibitCanvas.createCanvas('soulExhibitCanvas', {
            shareImageUrl,
            relationTitle: displayData.activityType === 6 ? `To 我的${displayData.relationTitle || ''}` : '',
            username: this.currentUserName || '',
            // username: displayData.userName,
            description: displayData.description || '',
            activityType: displayData.activityType,
            relationType: displayData.relationType,
            cb: (resp) => {
              this.isDownloadCardFinish = true;
              this.hideLoading();
              this.createCanvasCb(resp);
            }
          })
        }
      }
  
      createShareCardCanvas.createCanvas('soulShareCardCanvas', {
        activityType: displayData.activityType,
        relationType: displayData.relationType,
        relationTitle: displayData.activityType === 6 ? `To 我的${displayData.relationTitle || ''}` : '',
        description: displayData.description || '',
        cb: (resp) => {
          console.log('share form success')
          this.isShareCardFinish = true;
          this.hideLoading();
          this.createShareCanvasCb(resp);
        }
      })
    } catch(e) {
      this.hideLoading();
      Taro.showToast({
        title: "删除海报出错",
        icon: "none",
        duration: 2000,
      });
    }
  },

  getShareImageUrl() {
    return new Promise((resolve, reject) => {

      const userId = Taro.getStorageSync("userId");
      const activityId = getCurrentInstance().router.params?.id || '';
  
      const displayData = this.displayData;
      const from = displayData.isCreator && displayData.remaining > 0 ? 'share' : 'exhibit'
      // const envVersion = Taro.getAccountInfoSync().miniProgram.envVersion;

      // request({
      //   url:`/api/v2/draw/shareimage/${activityId}?user_id=${userId}&type=8&from=${from}&env=${envVersion}`,
      //   method: 'get',
      //   data: {
  
      //   },
      //   success: (res) => {
      //     console.log("shareimage", res);
      //     if(res?.statusCode === 200 && res?.data?.statusCode === 200) {
      //       resolve(BASE_URL + '/' + res?.data?.data || '');
      //       // this.dealReceivedResp(res?.data?.data?.recordVos || []);
      //     } else {
      //         Taro.showToast({
      //           title: "二维码生成出错:" + res.data.message,
      //           icon: "none",
      //           duration: 2000,
      //         });
      //         resolve('');
      //     }
      //   },
      //   fail:(res)=>{
      //     Taro.showToast({
      //       title: "二维码生成出错",
      //       icon: "none",
      //       duration: 2000,
      //     });
      //     resolve('');
      //   }
      // });
    })
    // const displayData = this.displayData;

  },
  hideLoading() {
    if(this.isDownloadCardFinish && this.isShareCardFinish) {
      console.log('in hideLoading')
      Taro.hideLoading();
    }
  },
  createCanvasCb(resp) {
    console.log('canvas cb', resp.tempFilePath);
    this.setShowImageUrl(resp.tempFilePath);
    this.downloadCardImageUrl = resp.tempFilePath;
  },
  createShareCanvasCb(resp) {
    this.shareCardImageUrl = resp.tempFilePath;
    shareMessage.setImageUrl(this.shareCardImageUrl);
  },
  saveImg() {
    if(!this.downloadCardImageUrl) {
      return false
    }
    // ImageUtil.saveImgToLocal(this.downloadCardImageUrl,false);
  },
}