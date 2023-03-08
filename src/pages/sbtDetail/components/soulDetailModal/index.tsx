import { View, Image } from '@tarojs/components'
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import {
  close_icon,
  invite_button_icon,
  soul_lover_share_card_link,
} from '@/constants/soulImage'
import SoulCard from '../soulCard';
// import SoulCardLover from '../soulCardLover';

import './index.scss'
import ReceiveBtn from '../receive-btn';

export default function(props) {
  const {
    displayData = {},
    close,
    clickInviteCb = function() {},
    claimCb = function() {},
    forClaim = false,
    from,
  } = props;


  const [scale, setScale] = useState(1);

  useEffect(() =>  {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if(clientHeight < 700) {
      setScale(clientHeight / 800)
    }
    console.log('clientHeigh', clientHeight);
  }, [])

  const copy = function(e) {

    console.log('click', displayData?.isCreator && displayData?.remaining > 0 ? displayData?.inviteUrl : displayData?.shareUrl)
    Taro.setClipboardData({
      data: displayData?.isCreator && displayData?.remaining > 0 ? displayData?.inviteUrl : displayData?.shareUrl, 
      success () {
        Taro.showToast({
          title: 'copy success'
        })
      }
    })

  }
  // const userInfo = useSelector(state => state.user.userInfo)
  // const userInfo = null;
  return <View className="soul-detail-modal__wrapper">
    <View className="soul-detail-modal__mask"></View>
    <View className="soul-detail-modal__main">
      <View className="soul-detail-modal__close-mask" onClick={() => close()}></View>

      <View
        className="soul-detail-modal__soul-card-block"
        style={{
          transformOrigin: 'center top',
          // transform: displayData.isCreator && from === 'create' ? 'scale(0.7)' : 'scale(1)'
          transform: `scale(${scale})`
        }}
      >
        <SoulCard displayData={displayData}></SoulCard>
      </View>
      {/* {displayData.isCollectedByMe && from=== 'create' ?
        <View className="soul-detail-modal__button-box" onClick={() => clickInviteCb()}>
          <Image className="soul-detail-modal__button-icon" src={invite_button_icon}></Image>
          让Ta来领取
        </View>
        :null
      } */}
      {forClaim ?
        <View className="soul-detail-modal__button-box">
          <ReceiveBtn claimCb={() => claimCb()}></ReceiveBtn>
        </View>
        // userInfo === null || !userInfo?.avatarUrl ? 
        // <UserInfoAuthButton className="soul-detail-modal__button-box" cb={(userInfo) => clickReceivedAuthCb(userInfo)}>
        //   <Image className="soul-detail-modal__button-icon soul-detail-modal__button-icon_2" src={invite_button_icon}></Image>
        //   确认签收
        // </UserInfoAuthButton>
        // :
        // <View className="soul-detail-modal__button-box" onClick={() => clickReceivedCb()}>
        //   <Image className="soul-detail-modal__button-icon" src={invite_button_icon}></Image>
        //   确认签收
        // </View>
        :null
      }
      {/* {forClaim  ? 
        <View
          className="soul-detail-modal__close-button"
          onClick={() => close()}
          style={{
            marginTop: displayData.isCreator && from === 'create' ? '-130px' : '30px'
          }}
        >
          <Image className="soul-detail-modal__close-button-icon" src={close_icon}></Image>
        </View>
      : null} */}
      {!forClaim  ? 
        <View className="soul-share-modal__bottom-box">
          <View className="soul-share-modal__bottom-button-box" onClick={(e) => copy(e)}>
            <Image className="soul-share-modal__bottom-button-icon" src={soul_lover_share_card_link} />
            <View className="soul-share-modal__bottom-button-text">
            Copy link and Share
            </View>
          </View>
          {/* <Button className="soul-share-modal__bottom-button-box soul-share-modal__bottom-button-download-box" onClick={() => mainManager.saveImg()}>
            <Image className="soul-share-modal__bottom-button-icon" src={download_icon} />
            <View className="soul-share-modal__bottom-button-text">
              保存到相册
            </View>
          </Button> */}
        </View>
      : null}
    </View>
  </View>
}