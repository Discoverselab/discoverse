import {IRelationDisplayData} from 'types/profile';

import { useState, useEffect } from "react";
import Taro, {getCurrentInstance, useDidShow} from "@tarojs/taro";
import {
  View,
  Image,
} from "@tarojs/components";
import { default_avatar } from "@/constants/images";
import {
  soul_user_page_top_bg,
  soul_user_page_user_avatar_code,
  soul_user_page_certification_icon,
  soul_user_page_other_type,
} from "@/constants/soulImage";

import SoulAvatarName from "./components/soulAvatarName";
import SoulBlock from "./components/soulBlock";
import "./index.scss";
import mainManager from './manager/main';

export default function() {

  const type = getCurrentInstance()?.router?.params?.type;
  const [userInfo, setUserInfo] = useState({});
  const [showEditUser, setShowEditUser] = useState(false);
  const [showSideTag, setShowSideTag] = useState(false);
  const [relationList, setRelationList] = useState<IRelationDisplayData[]>([]);
  const [tagList, setTagList] = useState([]);
  const [certificationList, setCertificationList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  console.log('render profile page', tagList);

  useDidShow(() => {
    // mainManager.getUserDetail()
  })

  // 获取用户头像
  const getUserAvatar = (userInfo) => {
    if (userInfo?.userImg) {
      return userInfo?.avatar;
    } else {
      return default_avatar;
    }
  };

  // 获取用户名称
  const getUserName = (userInfo, showEditUser) => {
    if (userInfo?.handle) {
      return userInfo?.handle;
    } else {
      if (showEditUser) {
        return "login";
      } else {
        return '';
      }
    }
  };

  //跳转修改用户信息页面
  const jumpToModifyUserInfo = (userInfo) => {
    let headImg = getUserAvatar(userInfo);
    let name = getUserName(userInfo);
    let params = {
      headImg: headImg,
      name: name,
      userProfile: userInfo.userProfile || '',
      type: 1, //type 0 修改星球信息 1 修改用户信息
    };
    // 因昵称、描述、图片url 有特殊字符
    let query = encodeURIComponent(JSON.stringify(params));
    Taro.navigateTo({ url: `/pages/starEdit/index?query=${query}` });
  };

  // useEffect(() => {
    // }, [])
    
  useEffect(() => {
    mainManager.setSetUserInfo(setUserInfo);
    mainManager.setSetShowEditUser(setShowEditUser);
    mainManager.setSetShowSideTag(setShowSideTag);
    mainManager.setSetRelationList(setRelationList);
    mainManager.setSetActivityList(setActivityList);
    mainManager.setSetTagList(setTagList);
    mainManager.setSetCertificationList(setCertificationList);
    mainManager.init();
  }, [])
  return <View className="user-new__wrap">
    <Image className="user-new__top-bg" src={soul_user_page_top_bg} />
    <View className="user-new__body">
      <View className="user-new__header">
        <View className="user-new__header-avatar-box">
          <Image className="user-new__header-avatar-outside-circle" src={soul_user_page_user_avatar_code} />
          <Image className="user-new__header-avatar" mode="widthFix" src={getUserAvatar(userInfo)} />
        </View>
        <View className="user-new__header-content">
          {showEditUser ?
            <View className="user-new__header-user-name-box">
                {/* <View className="user-new__header-user-name">{getUserName(userInfo, showEditUser)}</View> */}
              {/* <View className="user-new__header-user-name-edit"></View> */}
              <Image
                className="user-new__header-user-name-edit"
                mode="aspectFit"
                src="https://images.discoverse.club/2.0/home/userinfo_edit.png"
                onClick={() => jumpToModifyUserInfo(userInfo)}
              />
            </View>
          : null}
          {!showEditUser ?
            <View className="user-new__header-user-name-box">
              <View className="user-new__header-user-name">{userInfo.displayAddress}</View>
            </View>
          : null}
          <View className="user-new__header-user-description">{userInfo.userProfile || ''}</View>
        </View>
      </View>
      {showSideTag ?
      <View className="user-new__other-box" onClick={() => type === 'send' ? mainManager.goToReceive() : mainManager.goToSend()}>
        <Image className="user-new__other-bg" src={soul_user_page_other_type} />
        <View className="user-new__other-text">{type === 'send' ? 'Claimed' : 'Issued'}</View>
      </View>
      : null}
      <View className="user-new__main-content">
        <SoulBlock type="relation" title="Relation" number={relationList.length}>
          {relationList.map(relation => {
            return <>
              {relation.collectedList.length === 2 ?
                <View className="soul-relation__wrap" onClick={() => mainManager.jumpToSoulDetail(relation.metadataId)}>
                  <View className="soul-relation__icon-box">
                    <Image className="soul-relation__icon" src={relation.typeIconImage} />
                  </View>
                  <View className="soul-relation__main">
                    <View className="soul-relation__name">{relation.relationName}</View>
                    <View className="soul-relation__lover-box">
                      <SoulAvatarName userName={relation.collectedList[0].displayAddress} userAvatar={relation.collectedList[0].avatar} address={relation.collectedList[0].address}></SoulAvatarName>
                      <Image className="soul-relation__lover-box-icon" mode="widthFix" src={relation.betweenIcon} />
                      <SoulAvatarName userName={relation.collectedList[1].displayAddress} userAvatar={relation.collectedList[1].avatar} address={relation.collectedList[1].address}></SoulAvatarName>
                    </View>
                  </View>
                </View>
              : null}
              {relation.collectedList.length !== 2 ?
                <View className="soul-relation__wrap" onClick={() => mainManager.jumpToSoulDetail(relation.metadataId)}>
                  <View className="soul-relation__icon-box">
                    <Image className="soul-relation__icon" src={relation.typeIconImage} />
                  </View>
                  <View className="soul-relation__main">
                    <View className="soul-relation__name">{relation.relationName}</View>
                    <View className="soul-relation__classmate-box">
                      {relation.collectedList.length > 0 ?
                        relation.collectedList.map((receive) => {
                          return <View className="soul-relation__classmate-item" key={relation.metadataId + '_' + receive.profileID}>
                            <SoulAvatarName userName={receive.displayAddress} userAvatar={receive.avatar} address={receive.address}></SoulAvatarName>
                          </View>
                        })
                        :null
                      }
                    </View>
                  </View>
                </View>
              : null}
            </>
          })}
        </SoulBlock>
        {/* 灵魂标签 */}
        <SoulBlock type="tag" title="Tags" number={tagList.length}>
          {tagList.map((tag) => <View
            key={`profile_tag_item_${tag.metadataId}`}
            className="soul-tag__box"
            onClick={() => mainManager.jumpToSoulDetail(tag.metadataId)}
          >
            <View className="soul-tag__content">#{tag.description}</View>
            <View className="soul-tag__user-box">
              <SoulAvatarName userName={tag.displayAddress} userAvatar={tag.avatar} address={tag.address}></SoulAvatarName>
            </View>
          </View>
          )}
        </SoulBlock>

        {/* 身份认证 */}
        <SoulBlock type="certification" title="Authentication" number={certificationList.length}>
          {certificationList.map((certification) => <View className="soul-certification__box" key={'profile_certification_item_' + certification.metadataId} onClick={() => mainManager.jumpToSoulDetail(certification.metadataId)}>
              <Image className="soul-certification__icon" src={soul_user_page_certification_icon} ></Image>
              <View className="soul-certification__content">{certification.description}</View>
              <View className="soul-certification__user-box">
                <SoulAvatarName userName={certification.displayAddress} userAvatar={certification.avatar} address={certification.address}></SoulAvatarName>
              </View>
            </View>
          )}
        </SoulBlock>

        {/* 活动徽章 */}
        <SoulBlock type="activity" title="POAP" number={activityList.length}>
          {activityList.map((activity) => <View className="soul-activity__box" onClick={() => mainManager.jumpToActivityDetail(activity.drawId)}>
              <Image className="soul-activity__img" src={activity.headImg || activity.headImg} ></Image>
              <View className="soul-activity__content-box">
                <View className="soul-activity__content-title">{activity.activityName || activity.propertyName}</View>
                <View className="soul-activity__content-time">{activity.receiveTime || activity.time}</View>
              </View>
            </View>
          )}
        </SoulBlock>
      </View>


    </View>
  </View>
}