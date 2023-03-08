import { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
// import { useMutation } from "@apollo/client";
// import { LOGIN_GET_MESSAGE, LOGIN_VERIFY } from "@/graphql";

import { index } from '@/constants/images';
import getDisPlayAddress from '@/utils/getDisplayAddress';
import main from './manager/main';
import SoulSelect from './components/soul-select';
import './index.less'

export default function() {
  // const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE);
  // const [loginVerify] = useMutation(LOGIN_VERIFY);
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [hasGetProfile, setHasGetProfile] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  useEffect(() => {
    main.setAddress = setAddress;
    main.setUsername = setUsername;
    main.setIsLogin = setIsLogin;
    main.setHasGetProfile = setHasGetProfile;
    main.init();
  }, [])

  const goToProfile = function(_username: string) {
    if(_username) {
      Taro.navigateTo({
        url: '/pages/profile/index',
      });
    }
  }
  return <View className="index__wrapper">
    <Image className="index__bg-image" src="https://images.discoverse.club/3.0/indexPage/index_background2.png">
    </Image>
    <View className="index__body">
      <Image className="index__top-logo" src={index.logo}></Image>
      <View className="index__brand-name">DISCOVERSE</View>
      <View className="index__brand-slogan">Discover, display and defend unique souls.</View>
      <View className="index__user-content" onClick={() => goToProfile(username)}>
        <Image className="index__user-content-bg" src={index.profile_bg}></Image>
        <Image className="index__user-avatar" src={index.default_avatar}></Image>
        <View className="index__user-box">

          {isLogin && (!hasGetProfile || !username) ? 
            <View className="index__user-name" onClick={() => main.getOrCreateProfile()}>Create Profile</View>
          : null}
          {/* {username ? <View className="index__user-name">{username}</View> : null} */}
          {address ? <View className="index__user-address">{getDisPlayAddress(address)}</View> : null}
        </View>
        {/* <View className="index__user-sbt-box">
          <View className="index__user-sbt-count">200</View>
          <View className="index__user-sbt-suffix-box">
            <Image className="index__user-sbt-suffix-icon" src={index.badge}></Image>
            <View className="index__user-sbt-suffix">SBTs</View>
          </View>
        </View> */}
      </View>

      <View className="index__sbt-content">
        <View className="index__sbt-left">
          <View className="index__sbt-title-box">
            
            <Image className="index__sbt-title-icon" src={index.badge_2}></Image>
            <View className="index__sbt-title">Soulbound Token</View>
          </View>
          <View className="index__sbt-main">
            {/* <View className="index__sbt-count">102,222 claimed</View> */}
            <View className="index__sbt-user-list-box"></View>
          </View>

        </View>
        <View className="index__sbt-right">
          <View className="index__sbt-button" onClick={() => setShowSelectModal(true)}>Mint SBT</View>
        </View>
      </View>
    </View>
    <SoulSelect show={showSelectModal} close={() => setShowSelectModal(false)}></SoulSelect>
  </View>
}
