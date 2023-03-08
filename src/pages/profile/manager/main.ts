import {Profile, IProfileMetadata, IRelationDisplayData} from 'types/profile';


import Taro, { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import login from "@/components/login";
import getDisPlayAddress from '@/utils/getDisplayAddress';
import { getSearchParams } from '@/utils/getSearchParams';
import {
  soul_user_lover_between_icon,
  soul_user_girlmate_between_icon,
  soul_user_boymate_between_icon,
  soul_user_family_between_icon,
  soul_user_classmate_between_icon,
  soul_user_colleague_between_icon,
} from "@/constants/soulImage";
import { ADDRESS } from "@/graphql";
import fetchGraphql from "@/common/fetchGraphql";
import {getMetadataAttribute} from '@/utils/getMetadata';
import {relation_list} from '@/constants/soul';

export default {
  setUserInfo() {},
  setSetUserInfo(setUserInfo) {
    this.setUserInfo = setUserInfo;
  },
  setShowEditUser() {},
  setSetShowEditUser(setShowEditUser) {
    this.setShowEditUser = setShowEditUser;
  },
  setShowSideTag() {},
  setSetShowSideTag(setShowSideTag) {
    this.setShowSideTag = setShowSideTag;
  },
  setRelationList() {},
  setSetRelationList(setRelationList) {
    this.setRelationList = setRelationList;
  },
  setTagList() {},
  setSetTagList(setTagList) {
    this.setTagList = setTagList;
  },
  setCertificationList() {},
  setSetCertificationList(setCertificationList) {
    this.setCertificationList = setCertificationList;
  },
  setActivityList() {},
  setSetActivityList(setActivityList) {
    this.setActivityList = setActivityList;
  },
  type: '',
  relationList: [] as IRelationDisplayData[],
  async init() {
    console.log('user profile init');
    await login.login();
    console.log('user profile ', login.profile)
    // this.setUserInfo({
    //   avatar: login.profile?.avatar,
    //   handle: login.profile?.handle,
    // })
    const type = getSearchParams()?.type || 'receive';
    const address = getSearchParams()?.address || '';
    this.type = type;
    this.relationList = [];
    Taro.showLoading({title: 'getting essence', mask: true});
    const collectedEssenceList = await this.getAddressMsg(address || login.address, type);
    Taro.hideLoading();
    

    this.judgeShowTag(login.address);

    const relationEssenceList = this.getEssenceList(collectedEssenceList, type, 'RELATION')
    this.handleRelationResponse(relationEssenceList, type);

    const tagEssenceList = this.getEssenceList(collectedEssenceList, type, 'TAG')
    this.handleTagResponse(tagEssenceList, type);

    const AuthenticationEssenceList = this.getEssenceList(collectedEssenceList, type, 'AUTHENTICATION')
    this.handleAuthenticationResponse(AuthenticationEssenceList, type);
  },

  getEssenceList(collectedEssenceList: [], requestType: String, type: string) {
    if(requestType === 'send') {
      const essenceList = collectedEssenceList
        .filter(collectedEssence => getMetadataAttribute(collectedEssence?.node?.metadata?.attributes, 'type') === type)
        .map(collectedEssence => collectedEssence.node);
      return essenceList;
    } else {
      const essenceList = collectedEssenceList
        .filter(collectedEssence => getMetadataAttribute(collectedEssence?.node?.essence?.metadata?.attributes, 'type') === type)
        .map(collectedEssence => collectedEssence.node?.essence);
      return essenceList;
    }
  },

  async getAddressMsg(address, type) {
    const addressRes = await fetchGraphql(ADDRESS, {
      address
    })
    console.log('addressRes', addressRes);
    this.setUserInfo({
      avatar: addressRes?.data?.address?.wallet?.primaryProfile?.avatar,
      name: addressRes?.data?.address?.wallet?.primaryProfile?.name,
      handle: addressRes?.data?.address?.wallet?.primaryProfile?.handle,
      address: addressRes?.data?.address?.wallet?.address,
      displayAddress: (getDisPlayAddress(addressRes?.data?.address?.wallet?.address)),
    })
    if(type === 'receive') {
      return addressRes?.data?.address?.wallet?.collectedEssences?.edges || [];
    } else {
      return addressRes?.data?.address?.wallet?.primaryProfile?.essences?.edges || [];
    }
  },
  
  judgeShowTag(address) {
    const params = getSearchParams();
    if(!params.address || params.address === address) {
      this.setShowSideTag(true);
    } else {
      this.setShowSideTag(false);
    }
  },

  handleRelationResponse(essenceList, requestType) {
    console.log('relation essence list', essenceList);
    const relationDisplayList = [] as IRelationDisplayData[];
    const dataList = [] as any[];
    for(let i = 0; i < relation_list.length; i++) {
      const type = relation_list[i].name;
      const typeEssenceList = essenceList
        .filter(essence => getMetadataAttribute(essence?.metadata?.attributes, 'relationType') === type)
        .sort((a, b) => dayjs(a?.metadata?.issue_date).isBefore(dayjs(b?.metadata?.issue_date)));
      dataList.push(typeEssenceList);
    }
    console.log('dataList', dataList)
    // console.log('handleRelationResponse', data, dataList, requestType);
    dataList.forEach((typeList) => {
      (typeList || []).forEach((essence) => {
        const collectedLength = (essence?.collectedBy?.edges || []).length;
        const metadata = essence?.metadata || {};
        const relationType = getMetadataAttribute(metadata?.attributes, 'relationType')
        const obj = {
          metadataId: metadata?.metadata_id,
          relationType,
          relationName: relationType,
          typeIconImage: metadata?.image,
          createTime: metadata?.issue_date,
          collectedList: (essence?.collectedBy?.edges || []).map(item => {
            const primaryProfile = item?.node?.wallet?.primaryProfile || {};
            return {
              profileID: primaryProfile?.profileID,
              avatar: primaryProfile?.avatar,
              handle: primaryProfile?.handle,
              address: item?.node?.wallet?.address || '',
              displayAddress: getDisPlayAddress(item?.node?.wallet?.address || '')
            }
          }),
          betweenIcon: this.getRelationBetweenIcon(relationType),
        }
        obj.collectedList.unshift({
          profileID: essence?.createdBy?.profileID,
          avatar: essence?.createdBy?.avatar,
          handle: essence?.createdBy?.handle,
          address: essence?.createdBy?.owner?.address,
          displayAddress: getDisPlayAddress(essence?.createdBy?.owner?.address || '')

        })
        if(this.type === 'send') {
          relationDisplayList.push(obj);
        } else {
          if(requestType === 'receive' || collectedLength > 0) {
            relationDisplayList.push(obj)
          }
        }
      })
    })

    this.setRelationList([...relationDisplayList]);
    console.log('relationDisplayList', relationDisplayList);
  },

  getRelationBetweenIcon(relationType) {
    console.log('getRelationBetweenIcon ', relationType);
    switch (relationType) {
      case 'LOVER':  return soul_user_lover_between_icon;
      case 'Bestie': return soul_user_girlmate_between_icon;
      case 'Buddy': return soul_user_boymate_between_icon;
      case 'Friend': return soul_user_classmate_between_icon;
      default: return soul_user_lover_between_icon;
    }
  },

  handleTagResponse(essenceList) {
    console.log('tag essence list', essenceList);
    const displayList = [];
    const dataList = essenceList.sort((a, b) => dayjs(a?.metadata?.issue_date).isBefore(dayjs(b?.metadata?.issue_date)));

    dataList.forEach((essence) => {
      const metadata = essence?.metadata || {};
      const obj = {
        metadataId: metadata?.metadata_id,
        description: metadata?.description,
        typeIconImage: metadata?.image,
        createTime: metadata?.issue_date,
        profileID: essence?.createdBy?.profileID,
        avatar: essence?.createdBy?.avatar,
        handle: essence?.createdBy?.handle,
        address: essence?.createdBy?.owner?.address,
        displayAddress: getDisPlayAddress(essence?.createdBy?.owner?.address || '')
      }
      displayList.push(obj);
    })
    
    this.setTagList([...displayList]);
    console.log('tagDisplayList', displayList);
  },

  handleAuthenticationResponse(essenceList) {
    console.log('authentication essence list', essenceList);
    const displayList = [];
    const dataList = essenceList.sort((a, b) => dayjs(a?.metadata?.issue_date).isBefore(dayjs(b?.metadata?.issue_date)));

    dataList.forEach((essence) => {
      const metadata = essence?.metadata || {};
      const obj = {
        metadataId: metadata?.metadata_id,
        description: metadata?.description,
        typeIconImage: metadata?.image,
        createTime: metadata?.issue_date,
        profileID: essence?.createdBy?.profileID,
        avatar: essence?.createdBy?.avatar,
        handle: essence?.createdBy?.handle,
        address: essence?.createdBy?.owner?.address,
        displayAddress: getDisPlayAddress(essence?.createdBy?.owner?.address || '')
      }
      displayList.push(obj);
    })
    
    this.setCertificationList([...displayList]);
    console.log('authenticationDisplayList', displayList);
  },

  jumpToSoulDetail(id) {
    Taro.navigateTo({
      // url: `/pages/soulDetail/index?id=${activityId}&from=user`,
      url: `/pages/sbtDetail/index?metadataId=${id}&from=user`,
    });
  },
  
  jumpToActivityDetail(drawId) {
    const type = getSearchParams()?.type;
    
    if(type === 'send') {
      Taro.navigateTo({ url: `/pages/activity/activityDetail/index?drawId=${drawId}` });
    } else {
      Taro.navigateTo({ url: `/pages/nft/detail/index?nftId=${drawId}` });
    }
  },

  goToSend() {
    const params = getSearchParams();
    if(params.from === 'send') {
      return Taro.navigateBack();
    }
    let _address = login.address;
    if(params.address) {
      _address = params.address;
    }

    Taro.navigateTo({
      url: `/pages/profile/index?address=${_address}&type=send&from=receive`,
    });
  },

  goToReceive: function() {
    const userId = Taro.getStorageSync("userId");
    const path = getCurrentInstance()?.router?.path;
    const params = getSearchParams();
    if(params.from === 'receive') {
      return Taro.navigateBack();
    }
    let _userId = userId;;
    if(path === '/pages/user/index-new') {
      _userId = userId;
    } else {
      _userId = params.userId;
    }
    Taro.navigateTo({
      url: `/pages/user/index-profile?userId=${_userId}&from=send`,
    });
  }
  
}