import {DetailDisplayData, ICollectedItem} from 'types/essence';

import Taro, { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import {cloneDeep} from 'lodash';
import {
  soul_detail_certification_icon,
  soul_detail_tag_icon
} from '@/constants/soulImage'
import login from '@/components/login/index';
import {getMetadataAttribute} from '@/utils/getMetadata';
import getDisPlayAddress from '@/utils/getDisplayAddress';

import {env} from '@/constants/env';
// import {getContractAddress} from '@/constants/contract';
import {relation_list} from '@/constants/soul';
import { CREATE_COLLECT_ESSENCE_TYPED_DATA, RELAY, ESSENCES_BY_FILTER } from '@/graphql';
import fetchGraphql from '@/common/fetchGraphql';
import { sleep } from '@/utils/sleep';
import { getSearchParams } from '@/utils/getSearchParams';

export default {
  showingLoading: false,
  activityData: {},
  displayData: undefined as undefined | DetailDisplayData,
  collectedData: [],
  setData() {},
  setSetData(setData) {
    this.setData = setData;
  },
  setDisplayData() {},
  setSetDisplayData(setDisplayData) {
    this.setDisplayData = setDisplayData;
  },
  setShowDetailModal() {},
  setSetShowDetailModal(setShowDetailModal) {
    this.setShowDetailModal = setShowDetailModal;
  },
  setShowClaimDetailModal() {},
  setSetShowClaimDetailModal(setShowClaimDetailModal) {
    this.setShowClaimDetailModal = setShowClaimDetailModal;
  },
  setCollectedDisplayData() {},
  setSetCollectedDisplayData(setCollectedDisplayData) {
    this.setCollectedDisplayData = setCollectedDisplayData;
  },
  async init() {
    this.activityData = {};
    this.displayData = {};

    const metadataId = getCurrentInstance?.()?.router?.params?.metadataId || '';
    await login.login();
    // await this.collectSbt(id, login.provider, login.profile?.profileID);
    await this.getEssenceByFilter(metadataId);
    
    this.setDisplayData(cloneDeep(this.displayData));
    this.hideLoading();
    
  },

  showLoading() {
    this.showingLoading = true;
    Taro.showLoading({title: '', mask: true});
  },

  hideLoading() {
    if(this.showingLoading) {
      this.showingLoading = false;
      Taro.hideLoading();
    }
  },

  async getEssenceByFilter(metadataId: string) {
    Taro.showLoading({
      title: 'getting essence...',
      mask: true
    })
    const essenceByFilterResult = await fetchGraphql(ESSENCES_BY_FILTER, {
      appId: env.APP_ID,
      metadataID: metadataId,
      me: login.address
    })
    console.log('essenceByFilterResult', essenceByFilterResult)
    const essenceData = essenceByFilterResult?.data?.essenceByFilter?.[0] || {};
    const createdBy = essenceData?.createdBy;
    const essenceID = essenceData?.essenceID;
    const id = essenceData?.id;
    const metadata = essenceData?.metadata;
    const createCount = getMetadataAttribute(metadata?.attributes, 'createCount') || 1;
    const claimCount = (essenceData?.collectedBy?.edges || []).length;

    this.displayData  = {
      id,
      essenceID: essenceID,
      image: metadata.image,
      contractAddress: essenceData?.contractAddress,
      type: getMetadataAttribute(metadata?.attributes, 'type'),
      relationType: getMetadataAttribute(metadata?.attributes, 'relationType'),
      title: metadata.name,
      description: metadata.description,
      avatar: createdBy?.avatar,
      createTime: metadata?.issue_date ? dayjs(metadata?.issue_date).format("YYYY-MM-DD HH:MM:ss") : '',
      userName: createdBy.handle,
      creatorProfileID: createdBy?.profileID,
      addressStr: '',
      isCreator: createdBy?.profileID === login?.profile?.profileID,
      isCollectedByMe: essenceData?.isCollectedByMe || false,
      createCount,
      claimCount,
      remaining: createCount - claimCount,
      inviteUrl: env.DOMAIN + `/lotteryH5/cc/index.html#/pages/sbtDetail/index?metadataId=${metadataId}&from=share`,
      shareUrl: env.DOMAIN + `/lotteryH5/cc/index.html#/pages/sbtDetail/index?metadataId=${metadataId}&from=exhibit`,

      // hasGet: 
    }
    console.log('sbt detail essence displayData', this.displayData);
    this.setDisplayData(cloneDeep(this.displayData));
    this.judgeShowModal(this.displayData);

    this.dealCollected(essenceData?.collectedBy);
    this.hideLoading();
    // if(id) {
    //   const metadata = await getMetadata(createBy?.metadata);
    //   console.log('metadata', metadata);
    // }
  },

  async collectSbt() {
    Taro.showLoading({
      title: 'claiming...',
      mask: true
    })
    
    try {
      if(!login.hasGetProfile) {
        await login.getOrCreateProfile();
      }
      
      /* Get the signer from the provider */
      const signer = await login!.provider!.getSigner();
  
      /* Get the address from the provider */
      const address = await signer.getAddress();
  
      /* Create typed data in a readable format */
      const typedDataResult = await fetchGraphql(CREATE_COLLECT_ESSENCE_TYPED_DATA, {
        input: {
          collector: login.address,
          profileID: this.displayData?.creatorProfileID,
          essenceID: this.displayData.essenceID,
        },
      });
  
      console.log('collect sbt typedDataResult', typedDataResult)
      const typedData =
        typedDataResult.data?.createCollectEssenceTypedData?.typedData;
      const message = typedData.data;
      const typedDataID = typedData.id;
  
      /* Get the signature for the message signed with the wallet */
      const params = [address, message];
      const method = "eth_signTypedData_v4";
      const signature = await signer.provider.send(method, params).catch(e => e);
      if(signature instanceof Error) {
        console.error(signature);
        Taro.hideLoading();
        return Taro.showToast({
          title: signature?.message?.length > 50 ? signature?.message?.substring(0, 50) + '...' : signature?.message,
          icon: 'error'
        })
      }
  
  
      /* Call the relay to broadcast the transaction */
      const relayResult = await fetchGraphql(RELAY, {
        input: {
          typedDataID: typedDataID,
          signature: signature,
        },
      });
      console.log('collect sbt relayResult', relayResult)
      const relayActionId = relayResult?.data?.relay?.relayActionId;
      console.log("collect sbt relayActionId", relayActionId);
      const relayActionStatusResult = await login.loopRelayActionStatus(
        relayActionId
      );
  
      console.log('collect sbt relayActionStatusResult', relayActionStatusResult);
      if(relayActionStatusResult?.txStatus === 'SUCCESS') {
        sleep(2000);
        console.log('collect sbt success')
        const metadataId = getCurrentInstance?.()?.router?.params?.metadataId || '';
        this.getEssenceByFilter(metadataId);
      }
    } catch (err) {
      Taro.showToast({
        title: err.message || 'error',
        icon: 'error',
      })
    }
    Taro.hideLoading();
  },

  dealCollected(collectedBy) {
    console.log('collectedBy', collectedBy);
    const collectedList: ICollectedItem[] = [];
    (collectedBy?.edges || []).forEach(edge => {
      const primaryProfile = edge?.node?.wallet?.primaryProfile || [];
      collectedList.push({
        profileID: primaryProfile?.profileID,
        avatar: primaryProfile?.avatar,
        handle: primaryProfile?.handle,
        address: edge?.node?.wallet?.address || '',
        displayAddress: getDisPlayAddress(edge?.node?.wallet?.address || ''),
      })
    })
    // const displayData = Object.assign({}, this.displayData,{
    //   receivedList: dataList
    // });
    // this.displayData = displayData;
    this.collectedData = collectedList;
    // console.log('cloneDeep(displayData)', cloneDeep(displayData));
    // this.setDisplayData(cloneDeep(displayData));
    this.setCollectedDisplayData(collectedList);
  },

  judgeShowModal(data) {
    const from = getSearchParams()?.from || '';
    if(from === 'create' && data.isCreator) {
      this.setShowDetailModal(true)
    } else if(from === 'share' && !data.isCollectedByMe && !data.isCreator && data.remaining > 0) {
      this.setShowClaimDetailModal(true)
    } else {
      this.setShowDetailModal(false);
      this.setShowClaimDetailModal(false);
    }
  },
  getCardIcon: function(activityType, relationType) {
    if(activityType === 4) return soul_detail_certification_icon;
    if(activityType === 5) return soul_detail_tag_icon;
    if(activityType === 6) return relation_list[relationType].image;
  },
  getRelationTitle: function(relationType) {
    return relation_list[relationType]?.name || '';
  },


  getName(activityType, relationType) {
    if(activityType === 4) {
      return '身份认证'
    } else if(activityType === 5) {
      return '灵魂标签'
    } else if(activityType === 6) {
      return relation_list[relationType].name;
    }
  },
  getDescriptionUserName(userName, type) {
    if(!userName || userName === '微信用户' || userName.indexOf('玩家') === 0) {
      return type === 'send' ? '{__发送人地址__}' : '{__接收人地址__}';
    }
    return userName;
  },
  getDescription(activityData, nickName) {
    const _sendUserName = this.getDescriptionUserName(activityData.userName, 'send');
    const _receiveUserName = this.getDescriptionUserName(nickName, 'receive');
    if(activityData.activityType === 4) {
      return `${_sendUserName}给${_receiveUserName}签发了身份认证型灵魂凭证：${activityData.description}`;
    } else if(activityData.activityType === 5) {
      return `${_sendUserName}给${_receiveUserName}签发了标签型灵魂凭证：${activityData.description}`;
    } else if(activityData.activityType === 6) {
      return `${_sendUserName}和${_receiveUserName}铸造了一对${this.getName(activityData.activityType, activityData.relationType)}关系灵魂凭证：${activityData.description || '让我们的关系在链上永恒存储'}`;
    }
  },
}