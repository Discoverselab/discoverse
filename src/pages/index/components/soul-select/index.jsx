import { View, Image } from '@tarojs/components';
import Taro from "@tarojs/taro";
import {relation_icon, tag_icon, certification_icon, activity_icon, select_arrow_icon, close_icon} from '@/constants/soulImage';
import {SOUL_TYPE_RELATION, SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION, SOUL_TYPE_BADGE} from '@/constants/soul';

import './index.scss';


export default function(props) {
  const {show, close} = props;
  const goCreateSoul = function(type) {
    Taro.navigateTo({
      url: '/pages/createSoul/index?type=' + type
    });
  }
  // const goActivity = function() {
  //   Taro.navigateTo({
  //     url: '/pages/launchDigitalCollection/index'
  //   });
  // }
  return <View className={`soul-select__wrap ${show ? 'show' : ''}`}>
    <View className="soul-select__body">
      <>
        <View className="soul-select__item soul-select__item-relation" onClick={() => goCreateSoul(SOUL_TYPE_RELATION)}>
          <View className="soul-select__item-icon-box">  
            <Image className="soul-select__item-icon" mode="aspectFit" src={relation_icon}></Image>
          </View>
          <View className="soul-select__item-content">
            <View className="soul-select__item-title">Relation</View>
            <View className="soul-select__item-msg">Mint a relation on the chain.</View>
          </View>
          <Image className="soul-select__item-more-icon" src={select_arrow_icon}></Image>
        </View>

        <View className="soul-select__item soul-select__item-tag" onClick={() => goCreateSoul(SOUL_TYPE_TAG)}>
          <View className="soul-select__item-icon-box">  
            <Image className="soul-select__item-icon" mode="aspectFit" src={tag_icon}></Image>
          </View>
          <View className="soul-select__item-content">
            <View className="soul-select__item-title">Tag</View>
            <View className="soul-select__item-msg">Describe your friend with tagging.</View>
          </View>
          <Image className="soul-select__item-more-icon" src={select_arrow_icon}></Image>
        </View>

        <View className="soul-select__item soul-select__item-certification" onClick={() => goCreateSoul(SOUL_TYPE_AUTHENTICATION)}>
          <View className="soul-select__item-icon-box">
            <Image className="soul-select__item-icon" mode="aspectFit" src={certification_icon}></Image>
          </View>
          <View className="soul-select__item-content">
            <View className="soul-select__item-title">Authentication</View>
            <View className="soul-select__item-msg">Build a on-chian resume.</View>
          </View>
          <Image className="soul-select__item-more-icon" src={select_arrow_icon}></Image>
        </View>
      </>

      {/* <View className="soul-select__item soul-select__item-activity" onClick={() => goActivity()}>
        <View className="soul-select__item-icon-box">
          <Image className="soul-select__item-icon" mode="aspectFit" src={activity_icon}></Image>
        </View>
        <View className="soul-select__item-content">
          <View className="soul-select__item-title">POAP</View>
          <View className="soul-select__item-msg">Preserve our most important memories forever on the chain.</View>
        </View>
        <Image className="soul-select__item-more-icon" src={select_arrow_icon}></Image>
      </View> */}

      <View className="soul-select__close-btn" onClick={() => close()}>
        <Image className="soul-select__close-btn-icon" src={close_icon}></Image>
      </View>
    </View>
  </View>
}