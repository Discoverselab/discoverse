
import { View, Image } from "@tarojs/components";
import {getCurrentInstance} from '@tarojs/taro';
import { useEffect, useState } from 'react';
// import {getContractAddress} from '@constants/contract';
import QRCode from 'qrcode';
import { getSearchParams } from "@/utils/getSearchParams";
import {
  relation_lover,
  soul_card_address_top_image,
  cc_logo,
} from '@/constants/soulImage';
import {
  SOUL_TYPE_RELATION,
  SOUL_TYPE_TAG,
  SOUL_TYPE_AUTHENTICATION,
  SOUL_TYPE_BADGE
} from '@/constants/soul'

import './index.scss';

export default function(props) {
  const {displayData = {}} = props;
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  
  useEffect(() => {
    const from = getSearchParams()?.from || '';
    if(displayData.inviteUrl || displayData.shareUrl) {
      QRCode.toDataURL(displayData?.isCreator && from === 'create' ? displayData.inviteUrl : displayData.shareUrl).then((data) => {
        console.log('qrcode', data);
        setQrCodeDataUrl(data);
      })
    }
  }, [displayData]);
  return <View className="soul-card-page__block-box">
    <View
      className={`soul-card__block ${displayData.type === SOUL_TYPE_TAG ? 'soul-card__block--certification' : ''} ${displayData.type === SOUL_TYPE_AUTHENTICATION ? 'soul-card__block--tag' : ''} ${displayData.type === SOUL_TYPE_RELATION ? 'soul-card__block--relation' : ''}`}
    >
      <View className="soul-card__main">
        <View className="soul-card__icon-box">
          <Image className="soul-card__icon" src={displayData.image}></Image>
        </View>
        {displayData.type === 'RELATION' ? <View className="soul-card__title">To My{displayData.title}</View> : null}
        {displayData.type === 'RELATION' ? <View className="soul-card__relation-message">{displayData.description}</View> : null}
        {displayData.type !== 'RELATION' ? <View className="soul-card__description">{displayData.description}</View> : null}

        <View className="soul-card__creator-box">
          <Image className="soul-card__creator-avatar" src={displayData.avatar}></Image>
          <View className="soul-card__creator-username">{displayData.userName}</View>
        </View>
        <View className="soul-card__create-time">{displayData.createTime}</View>
        <View className="soul-card__address-box">
          <Image className="soul-card__address-header-image" src={soul_card_address_top_image}></Image>
          <View className="soul-card__address">{(displayData.contractAddress)}</View>
        </View>
        {/* <View className="soul-card__bottom-box">
          <View className="soul-card__qrcode-box">
            <Image className="soul-card__qrcode-icon" src={displayData.shareImageUrl}></Image>
            <Image className="soul-card__qrcode-user-avatar" src={displayData.headImage}></Image>
          </View>
          <View className="soul-card__brand-box">
            <Image className="soul-card__brand-icon" src={logo_icon}></Image>
            <View className="soul-card__brand-slogan">基于灵魂图谱的开放社交网络</View>
          </View>
        </View> */}
        <View className="soul-card__qrcode-box">
          <View className="soul-card__qrcode-image-box">
            <Image className="soul-card__qrcode-image" src={qrCodeDataUrl}></Image>
          </View>
          <View className="soul-card__qrcode-msg">Scan the QRcode to claim the SBT</View>
        </View>
        
      </View>
      <Image className="soul-card__logo" src={cc_logo}></Image>
    </View>
  </View>
}