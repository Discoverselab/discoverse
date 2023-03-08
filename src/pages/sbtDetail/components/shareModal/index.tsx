import {Button, Icon, View, Canvas, Image} from '@tarojs/components'
import { useState, useEffect } from 'react';
import {
  weixin_icon,
  download_icon,
} from '@/constants/soulImage'

import mainManager from './manager/main';

import './index.scss';

export default function(props) {
  const {close, displayData, currentUserName} = props;

  const [showImageUrl, setShowImageUrl] = useState('');
  useEffect(() => {
    // setTimeout(() => {
      mainManager.currentUserName = currentUserName;
      mainManager.displayData = displayData;
      mainManager.setSetShowImageUrl(setShowImageUrl);
      mainManager.init();
      
    // }, 500)
  }, [])
  
  return <View className="soul-share-modal__wrapper">
    <View className="soul-share-modal__mask"></View>
    {/* <View className="soul-share-modal__main"> */}
      <View className={"soul-share-modal__bottom-box"}>
        <Button className="soul-share-modal__bottom-button-box"  openType='share' >
          <Image className="soul-share-modal__bottom-button-icon" src={weixin_icon} />
          <View className="soul-share-modal__bottom-button-text">
            分享给朋友
          </View>
        </Button>
        <Button className="soul-share-modal__bottom-button-box soul-share-modal__bottom-button-download-box" onClick={() => mainManager.saveImg()}>
          <Image className="soul-share-modal__bottom-button-icon" src={download_icon} />
          <View className="soul-share-modal__bottom-button-text">
            保存到相册
          </View>
        </Button>
      </View>
      {displayData.isCreator && displayData.remaining > 0 ?
        <View className="soul-share-modal__canvas-box">
          <Canvas canvasId="soulShareCanvas" style={{
            position: 'relative',
            zIndex: 99999999,
            width: '300px',
            background: 'transparent',
            height: 6 === displayData.activityType ?  '519px' : '465px',
          }}></Canvas>
        </View>
      : null}
      {!(displayData.isCreator && displayData.remaining > 0) ?
        <View className="soul-share-modal__canvas-box">
          {
            displayData.activityType === 6 && displayData.relationType === 0 ? 
            <Canvas canvasId="soulExhibitLoverCanvas" style={{
              position: 'relative',
              zIndex: 99999999,
              width: '300px',
              height:  '644px',
            }}></Canvas>
            :
            <Canvas canvasId="soulExhibitCanvas" style={{
              position: 'relative',
              zIndex: 99999999,
              width: '375px',
              height:  6 === displayData.activityType ?  '750px' : '700px',
            }}></Canvas>
          }
        </View>
      : null}
      <View className="soul-share-modal__image-box">
        <Image className="soul-share-modal__image" mode="heightFix" src={showImageUrl}></Image>
        <View className="soul-share-modal__image-box-cancel-icon"  onClick={() => close()}>
          <Icon type="cancel" color="#fff" size="50"></Icon>
        </View>
      </View>
      <View className="soul-share-modal__share-card-canvas-box">
        <Canvas canvasId="soulShareCardCanvas" style={{
          position: 'relative',
          zIndex: 99999999,
          width: '241px',
          height: '193px',
        }}></Canvas>
      </View>
      
    {/* </View> */}
  </View>
}