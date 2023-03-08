export default {
  imageUrl: '',
  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
  },
  shareAppMessage(res, {activityId, isInitiator, remaining, activityType, relationType}) {
    // if (res.from !== 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      // return {};
    // }
    const isClickButton = res.from === 'button';
    console.log('this.activityId', activityId);
    const from = isInitiator && remaining > 0 && isClickButton ? 'share' : 'exhibit';
    let title = '';
    if(from === 'share') {
      title = `快来签收你的灵魂凭证！`;
    } else {
      title = '快来围观我的灵魂凭证！';
    }
    if(activityType === 6 && relationType === 0 && isInitiator && remaining > 0) {
      // title =  [
      //   'anyweb邀请你领取新春祝福',
      //   '闺蜜品牌邀请你领取新春祝福',
      //   '死党品牌邀请你领取新春祝福',
      //   '家人品牌邀请你领取新春祝福',
      //   '童鞋品牌邀请你领取新春祝福',
      //   '同事品牌邀请你领取新春祝福',
      // ][displayData.relationType];
      title = '让我们一起铸造链上爱情宣言';
    }
    return {
      title,
      path: `pages/soulDetail/index?id=${activityId}&from=${from}`,
      imageUrl: isClickButton ? this.imageUrl : '',
    }
  }
}