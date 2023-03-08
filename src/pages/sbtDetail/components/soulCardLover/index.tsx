import { View, Image } from "@tarojs/components";
import './index.scss';

import {
  relation_lover,
  soul_card_address_top_image,
  logo_icon,
  soul_user_lover_between_icon,
  soul_lover_share_card_bg,
  soul_lover_share_card_top_text,
  soul_lover_share_card_top_text_2,
  soul_lover_share_card_icon_bg,
} from '@/constants/soulImage';


export default function(props) {
  const {displayData = {}} = props;
  return <View className="soul-card-lover__block">
    <View className="soul-card-lover__bg-color"></View>
    <Image className="soul-card-lover__bg" mode="widthFix" src={soul_lover_share_card_bg}></Image>
    <View className="soul-card-lover__main">
      <View className="soul-card-lover__top-text-1-box">
        <Image className="soul-card-lover__top-text-1" mode="widthFix" src={soul_lover_share_card_top_text}></Image>
      </View>
      <View className="soul-card-lover__top-text-2-box">
        <Image className="soul-card-lover__top-text-2" mode="widthFix" src={soul_lover_share_card_top_text_2}></Image>
      </View>
      <View className="soul-card-lover__icon-box">
        <Image className="soul-card-lover__icon" src={displayData.cardIcon}></Image>
      </View>
      <View className="soul-card-lover__time">铸造于{displayData.emitTime}</View>
      <View className="soul-card-lover__user-box">
        <View className="soul-card-lover__user-item-box">
          <Image className="soul-card-lover__user-item-avatar" src={displayData.headImage}></Image>
          <View className="soul-card-lover__user-item-user-name">{displayData.userName}</View>
        </View>
        {/* <View className="soul-card-lover__user-middle-icon"></View> */}
        <Image className="soul-card-lover__user-middle-icon" mode="widthFix" src={soul_user_lover_between_icon}></Image>
      </View>
      <View className="soul-card-lover__message-1-box">
        我们是第
        <View className="soul-card-lover__message-1-number">100</View>
        对在区块链上
      </View>
      <View className="soul-card-lover__message-2-box">铸造爱情宣言的恋人</View>
      <View className="soul-card-lover__address-box">
        <Image className="soul-card-lover__address-header-image" src={soul_card_address_top_image}></Image>
        <View className="soul-card-lover__address">{(displayData.activityType)}</View>
      </View>
      <View className="soul-card-lover__qrcode-box">
        <Image className="soul-card-lover__qrcode-icon" src={displayData.shareImageUrl}></Image>
        <Image className="soul-card-lover__qrcode-user-avatar" src={displayData.headImage}></Image>
      </View>
      <View className="soul-card-lover__slogan">基于灵魂图谱的开放社交网络</View>
    </View>
  </View>
}