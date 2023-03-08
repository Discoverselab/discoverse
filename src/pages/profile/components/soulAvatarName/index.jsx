import Taro, { getCurrentInstance } from "@tarojs/taro";
import login from "@/components/login";
import {
  View,
  Image,
} from "@tarojs/components";
import "./index.scss";

import { default_avatar } from "@/constants/images";

export default function(props) {
  const {address, userName, userAvatar} = props;
  const clickCb = function(_address, e) {
    e.stopPropagation();
    console.log('click avatar');
    const currentPageAddress = parseInt(getCurrentInstance().router?.params?.address || '-1');
    const currentAddress = login.address;

    // 当前在查看别人页面
    if(currentPageAddress !== -1 && currentPageAddress !== currentAddress) {
      if(_address === currentAddress) {
        Taro.navigateTo({
          url: '/pages/profile/index',
        });
      } else if(currentPageAddress !== _address) {
        Taro.navigateTo({
          url: `/pages/profile/index?address=${_address}`,
        });
      }
    } else {
      if(currentAddress !== _address) {
        Taro.navigateTo({
          url: `/pages/profile/index?address=${_address}`,
        });
      }
    }
    return false;

  }
  return <View className="soul-user-avatar-name__wrap" onClick={(e) => clickCb(address, e)}>
    <Image className="soul-user-avatar-name__avatar" src={userAvatar || default_avatar} />
    <View className="soul-user-avatar-name__name">{userName || ''}</View>
  </View>
}