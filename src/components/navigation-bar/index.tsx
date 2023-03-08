import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components"
import { home_icon } from "@/constants/soulImage"

import './index.scss';

export default function() {
  const goHome = function() {
    Taro.navigateTo({
      url: '/pages/index/index',
    });
  }
  return <View className="navigation-bar__wrapper">
    <View className="navigation-bar__icon-box" onClick={() => goHome()}>
      <Image className="navigation-bar__icon" src={home_icon}></Image>
    </View>
  </View>
}