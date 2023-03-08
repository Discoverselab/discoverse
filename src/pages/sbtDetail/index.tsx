import {DetailDisplayData, ICollectedItem} from 'types/essence';

import Taro, { getCurrentInstance, useShareAppMessage } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import {useState, useEffect} from 'react';
import NavigationBar from '@/components/navigation-bar';

import {
  // relation_lover,
  invite_button_icon,
  invite_button_icon_2,
  share_button_icon,
  soul_detail_address_icon,
  soul_detail_number_icon,
  soul_detail_receive_bg,
  soul_received_list_empty_icon,
} from '@/constants/soulImage'

import {
  SOUL_TYPE_RELATION,
  SOUL_TYPE_TAG,
  SOUL_TYPE_AUTHENTICATION,
  SOUL_TYPE_BADGE
} from '@/constants/soul'

import ReceiveBtn from "./components/receive-btn";
import './index.scss';
import SoulDetailModal from './components/soulDetailModal';
import ShareModal from './components/shareModal';
import mainManager from './manager/main';

export default function() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showClaimDetailModal, setShowClaimDetailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [displayData, setDisplayData] = useState<DetailDisplayData>({});
  const [collectedDisplayData, setCollectedDisplayData] = useState<ICollectedItem[]>([]);
  const [data, setData] = useState({});

  console.log('getCurrentInstance()', getCurrentInstance())
  const from = getCurrentInstance().router.params?.from || '';

  useEffect(() => {
    mainManager.showLoading({
      mask: true
    });
    mainManager.setSetDisplayData(setDisplayData);
    mainManager.setSetShowDetailModal(setShowDetailModal);
    mainManager.setSetShowClaimDetailModal(setShowClaimDetailModal);
    mainManager.setSetCollectedDisplayData(setCollectedDisplayData);

    mainManager.setSetData(setData);
    mainManager.init();
  }, []);

  useShareAppMessage(res => {
    return mainManager.shareAppMessage(res);
  })

  const clickInviteButton = function() {
    console.log('clickInviteButton');
    setShowShareModal(true);
    setShowDetailModal(true);
  }

  const clickShareButton = function() {
    setShowShareModal(true);
    setShowDetailModal(true)
  }

  const getShowNumber = function(number) {
    if(number < 10) {
      return '0' + number;
    }
    return number;
  }

  return <View className="soul-detail__wrapper">
    <NavigationBar></NavigationBar>
    <View className={`soul-detail__card-box ${displayData.type === SOUL_TYPE_AUTHENTICATION ? 'soul-detail__card-box--certification' : ''} ${displayData.type === SOUL_TYPE_TAG ? 'soul-detail__card-box--tag' : ''} ${displayData.type === SOUL_TYPE_RELATION ? 'soul-detail__card-box--relation' : ''}`}>
      {/* <Image className="soul-detail__card-bg" src={bgRelationLover}></Image> */}
      <View className="soul-detail__card-main">
        <View className="soul-detail__card-icon-box">
          <Image className="soul-detail__card-icon" src={displayData.image}></Image>
        </View>
        {displayData.type === SOUL_TYPE_RELATION ? <View className="soul-detail__card-title">{displayData.title}</View> : null}
        {displayData.type === SOUL_TYPE_RELATION ? <View className="soul-detail__card-message">{displayData.description}</View> : null}
        {[SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION].includes(displayData.type) ? <View className="soul-detail__card-description">{displayData.description}</View> : null}
      </View>
    </View>
    <View
      className="soul-detail__detail-block"
      style={{
        marginTop: [SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION].includes(displayData.type) ? Taro.pxTransform(-101,350) : Taro.pxTransform(-41,350)
      }}
    >
      <View className="soul-detail__detail-header-box">
        <Image className="soul-detail__detail-header-avatar" src={displayData.avatar}></Image>
        <View className="soul-detail__detail-header-content">
          <View className="soul-detail__detail-header-username">{displayData.userName}</View>
          <View className="soul-detail__detail-header-time">{displayData.createTime}</View>
        </View>
        {displayData.isCreator && displayData.remaining > 0 ?
          <View className="soul-detail__detail-header-button-box" onClick={() => clickInviteButton()}>
            <View className="soul-detail__detail-header-button-icon-box">
              <Image mode="widthFix" className="soul-detail__detail-header-button-icon" src={invite_button_icon_2}></Image>
            </View>
            Issue
          </View>
        : null}
        {
          (displayData.isCreator && displayData.remaining === 0) || !displayData.isCreator ?
          <View className="soul-detail__detail-header-button-box" onClick={() => clickShareButton()}>
            <View className="soul-detail__detail-header-button-icon-box">
              <Image className="soul-detail__detail-header-button-icon" src={share_button_icon}></Image>
            </View>
            Share
          </View>
          : null

        }
      </View>
      <View className="soul-detail__detail-body">
        <View className="soul-detail__detail-message-box">
          <Image className="soul-detail__detail-message-icon" src={soul_detail_number_icon}></Image>
          <View className="soul-detail__detail-message-pre">Quantity</View>
          <View className="soul-detail__detail-message-content-box">
            <View className="soul-detail__detail-message-content-number">{displayData.createCount}</View>
          </View>
        </View>
        <View className="soul-detail__detail-message-box">
          <Image className="soul-detail__detail-message-icon" src={soul_detail_address_icon}></Image>
          <View className="soul-detail__detail-message-pre">Address</View>
          <View className="soul-detail__detail-message-content-box">
            {/* <View className="soul-detail__detail-message-content-address">{displayData.txHash}</View> */}
            <View className="soul-detail__detail-message-content-address">{(displayData.contractAddress)}</View>
          </View>
        </View>
      </View>
    </View>
    <View className="soul-receive__wrap">
      <View className="soul-receive__header">
        <Image className="soul-receive__header-bg" src={soul_detail_receive_bg}></Image>
        <View className="soul-receive__header-main">
          <View className="soul-receive__header-title">Claimed List</View>
          <View className="soul-receive__header-content">
            <View className="soul-receive__header-content-pre">Collector</View>
            <View className="soul-receive__header-content-number">{collectedDisplayData.length}</View>
          </View>
        </View>
      </View>

      <View className="soul-receive__list-box">
        {
          collectedDisplayData.length > 0 ? collectedDisplayData.map((collected, index) => 
          <View className="soul-receive__list-item-box" key={'detail_collected_item_' + collected.profileID}>
            <View className="soul-receive__list-item-under-line"></View>
            <View className="soul-receive__list-item">
              <View className="soul-receive__list-item-rank">{getShowNumber(index + 1)}</View>
              <Image className="soul-receive__list-item-avatar" src={collected.avatar}></Image>
              <View className="soul-receive__list-item-username">{collected.displayAddress}</View>
              {/* <View className="soul-receive__list-item-time">{collected.time}</View> */}
            </View>
          </View>
          )
          : null
        }
        {
          collectedDisplayData.length === 0 ?
          <View className="soul-receive__empty-box">
            <Image className="soul-receive__empty-icon" src={soul_received_list_empty_icon}></Image>
            <View className="soul-receive__empty-text">No one has claimed</View>
            {displayData.isCreator ?
              <View className="soul-receive__empty-button-box" onClick={() => clickInviteButton()}>
                <Image className="soul-receive__empty-button-icon" src={invite_button_icon} mode="widthFix"></Image>
                Go to issue
              </View>
            : null}
          </View>
          : null
        }
      </View>
    </View>
    {!displayData.isCreator && from === 'share' && !displayData.isCollectedByMe && displayData.remaining > 0 ?
      <View className="soul-detail__bottom-box">
        <ReceiveBtn claimCb={() => mainManager.collectSbt()}></ReceiveBtn>
      </View>
      : null
    }
    
    {showDetailModal? <SoulDetailModal
      displayData={displayData}
      close={() => setShowDetailModal(false)}
      clickInviteCb={() => setShowShareModal(true)}
      claimCb={() => mainManager.collectSbt()}
      from= {from}
    ></SoulDetailModal> : null}

    {showClaimDetailModal? <SoulDetailModal
      displayData={displayData}
      close={() => setShowClaimDetailModal(false)}
      clickInviteCb={() => setShowShareModal(true)}
      claimCb={() => mainManager.collectSbt()}
      forClaim={true}
      from= {from}
    ></SoulDetailModal> : null}
    {/* {showShareModal
      ? <ShareModal currentUserName={''}  displayData={displayData} close={() => setShowShareModal(false)}></ShareModal> : null} */}
  </View>
}