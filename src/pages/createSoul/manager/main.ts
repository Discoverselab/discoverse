import Taro, { getCurrentInstance } from "@tarojs/taro";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import { sleep } from "@/utils/sleep";
import login from '@/components/login/index';
import metadataOss from "@/common/metadataOss";
import {pinJSONToIPFS} from '@/common/ipfs';
import {SOUL_TYPE_RELATION, SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION} from '@/constants/soul';
import {CREATE_REGISTER_ESSENCE_TYPED_DATA, RELAY} from '@/graphql'
import fetchGraphQL from '@/common/fetchGraphql';
import {IEssenceMetadata} from 'types/essence';
import {env} from '@/constants/env'
import relationManager from './relation';
import otherManager from "./other";

// 后端类型映射
const soulTypeMap = {
  [SOUL_TYPE_RELATION]: 6,
  [SOUL_TYPE_TAG]: 5,
  [SOUL_TYPE_AUTHENTICATION]: 4,
}

export default {
  async init() {
    relationManager.init();
    otherManager.init();
    login.login();
  },
  showSuccessToast() {
    Taro.showToast({
      title: '铸造成功',
      icon: "success",
      duration: 2000,
    })
  },
  async clickSubmit(type) {
    if((type === SOUL_TYPE_TAG || type === SOUL_TYPE_AUTHENTICATION) && otherManager.submitButtonDisabled) {
      return false;
    }
    const validateResult = this.validate(type);

    if(!login.hasGetProfile) {
      Taro.showLoading({
        title: 'login...',
        mask: true
      })
      const res = await login.getOrCreateProfile().catch(e => e);
      Taro.hideLoading();
      if(res instanceof Error) {
        Taro.showToast({
          title: res.message || 'error', 
          icon: 'error',
        })
        return false;
      }
    }
    // const id = parseInt(Math.random() * 100000000);
    if(validateResult.success) {
      const description = type === SOUL_TYPE_RELATION ? relationManager.message : otherManager.message;
      const image = type === SOUL_TYPE_RELATION ? relationManager.getImageUrl() : otherManager.getImageUrl(type);
      const name = type === SOUL_TYPE_RELATION ? relationManager.getName() : otherManager.getName(type);
      const relationType = type === SOUL_TYPE_RELATION ? relationManager.getRelationType() : '';
      this.mintSBT({
        image,
        name,
        description,
        type,
        relationType,
        provider: login.provider,
        primaryProfile: login.profile,
        createNumber: type === SOUL_TYPE_RELATION ? relationManager.createNumber : otherManager.createNumber,
      })
    } else {
      Taro.showToast({
        title: validateResult.message,
        icon: "none",
        duration: 2000,
      })
    }
  },

  async mintSBT({image, name, description, type, relationType, provider, primaryProfile, createNumber}) {
    Taro.showLoading({
      title: 'minting...',
      mask: true
    })
    /* Construct the metadata object for the Essence NFT */
    const metadataId = uuidv4();
    const metadata: IEssenceMetadata = {
      metadata_id: metadataId,
      version: "1.0.0",
      app_id: env.APP_ID,
      lang: "en",
      issue_date: new Date().toISOString(),
      content: "",
      media: [],
      tags: [],
      image,
      // image_data: !nftImageURL ? svg_data : "",
      name: name,
      description: description,
      animation_url: "",
      external_url: "",
      attributes: [
        {
          display_type: "string",
          trait_type: "type",
          value: type,
        },
        {
          display_type: "string",
          trait_type: "relationType",
          value: relationType,
        },
        {
          display_type: "number",
          trait_type: "createCount",
          value: createNumber + '',
        }
      ],
    };

    /* Upload metadata to IPFS */
    // const ipfsHash = await pinJSONToIPFS(metadata);
    await metadataOss.init();
    const tokenURI = await metadataOss.upload(metadata, '');

    console.log('tokenURI', tokenURI);

    /* Get the signer from the provider */
    const signer = await provider.getSigner();

    /* Get the chain id from the network */
    /* Create typed data in a readable format */
    const typedDataResult = await fetchGraphQL(CREATE_REGISTER_ESSENCE_TYPED_DATA, {
      input: {
        /* The profile id under which the Essence is registered */
        profileID: primaryProfile.profileID,
        /* Name of the Essence */
        name: name,
        /* Symbol of the Essence */
        symbol: "SBT",
        /* URL for the json object containing data about content and the Essence NFT */
        // tokenURI: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        tokenURI,
        /* Middleware that allows users to collect the Essence NFT for free */
        middleware: {
          collectFree: true,
          // collectPaid: {
          //   amount: '0.1',
          //   totalSupply: '10'
          // }
          collectLimitedTimePaid: {
            price: '0',
            totalSupply: createNumber + '',
            endTimestamp: dayjs().add(100, 'year').toDate().getTime(),
            currency: '0x',
            profileRequired: false,
            recipient: '0x',
            startTimestamp: Date.now(),
            subscribeRequired: false,
          }
        },
        /* Set if the Essence should be transferable or not */
        /* SBTs are non-transferable */
        transferable: false,
      },
    });
    console.log('create sbt typedDataResult', typedDataResult);
    const typedData =
      typedDataResult.data?.createRegisterEssenceTypedData?.typedData;
    const message = typedData.data;
    const typedDataID = typedData.id;

    /* Get the signature for the message signed with the wallet */
    const fromAddress = await signer.getAddress();
    const params = [fromAddress, message];
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
    const relayResult = await fetchGraphQL(RELAY, {
      input: {
        typedDataID: typedDataID,
        signature: signature,
      },
    });
    console.log('create sbt relayresult', relayResult);
    // const txHash = relayResult.data?.relay?.relayTransaction?.txHash;

    const relayActionId = relayResult?.data?.relay?.relayActionId;
    console.log("create sbt relayActionId", relayActionId);
    const relayActionStatusResult = await login.loopRelayActionStatus(
      relayActionId
    );
    console.log("create sbt relayActionStatusResult", relayActionStatusResult);

    await sleep(4000);
    // 0x2f4fc2b7dd66c4b299694e309f4bd4ca769be5b33bcd8f5b1d10565a63581c78
    this.goToSbtDetail(metadataId);
  },

  goToSbtDetail(id) {
    Taro.navigateTo({
      url: '/pages/sbtDetail/index?metadataId=' + id + '&from=create',
    });
  },
  validate(type) {
    if(SOUL_TYPE_RELATION === type) {
      return relationManager.validate();
    } else {
      return otherManager.validate();
    }
  }
}