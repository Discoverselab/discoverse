import {Profile, IProfileMetadata} from 'types/profile';
import Taro from '@tarojs/taro';
import {cloneDeep} from 'lodash';
import detectEthereumProvider from "@metamask/detect-provider";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Eip1193Provider } from "ethers/src.ts/providers/provider-browser"
import {env} from '@/constants/env';
import { sleep } from '@/utils/sleep';
import fetchGraphql, {setToken, hasToken} from '@/common/fetchGraphql';
import {getRandomUserInfo} from '@/common/getRandomUserInfo';
import getNameFromHandle from '@/common/getNameFromHandle';
import {pinJSONToIPFS} from '@/common/ipfs';
import metadataOss from "@/common/metadataOss";
import {getMetadata} from '@/utils/getMetadata';
import {
  LOGIN_GET_MESSAGE,
  LOGIN_VERIFY,
  PRIMARY_PROFILE,
  CREATE_CREATE_PROFILE_TYPED_DATA,
  RELAY,
  RelayActionStatus,
} from "../../graphql";

const CHAIN_ID = env.NEXT_PUBLIC_CHAIN_ID
const DOMAIN = window.location.hostname;
export default {
  profileMetadata: undefined as IProfileMetadata | undefined,
  profile: undefined as Profile | undefined,
  address: undefined as string | undefined,
  provider: undefined as Web3Provider | undefined,
  isLogin: false,
  hasGetProfile: false,
  loginGetMessage: undefined as any | undefined,
  loginVerify: undefined as any | undefined,
  hasAutoCreateProfile: false,
  getIsLogin():Boolean {
    return this.isLogin;
  },
  setIsLogin(isLogin:Boolean) {
    this.isLogin = isLogin;
  },
  showErrorToast(error: Error) {
    Taro.hideLoading();
    Taro.showToast({
      title: error.message,
      icon: 'error',
    })
  },
  async login() {
    const hasShowLoading = !this.isLogin;
    let provider;
    if(!this.isLogin) {
      Taro.showLoading({
        title: 'login...',
        mask: true
      })
      provider = await this.connectWallet().catch(e => e);
      if(provider instanceof Error) {
        return this.showErrorToast(provider);
      }
    } else {
      provider = this.provider;
    }
    await this.checkNetwork(provider);
    if(hasShowLoading) {
      Taro.hideLoading();
    }
  },
  async getOrCreateProfile() {
    if(!hasToken()) {
      const accessToken = await this.getAccessToken(this.provider).catch(e => e);
      if(accessToken instanceof Error) {
        return this.showErrorToast(accessToken);
      }
    }
    if(this.hasGetProfile && this.profile) {

    } else {
      const profileRes = await this.getPrimaryProfile();
      console.log('profileRes', profileRes);
      if(profileRes && !profileRes?.primaryProfile) {
        await this.createProfile({
          name: '',
          bio: '',
          handle: '',
          version: '',
        })
      }
      
    }

  },
  async connectWallet () {
		try {
			/* Function to detect most providers injected at window.ethereum */
			const detectedProvider =
				(await detectEthereumProvider()) as Eip1193Provider;

			/* Check if the Ethereum provider exists */
			if (!detectedProvider) {
				throw new Error("Please install MetaMask!");
			}

			/* Ethers Web3Provider wraps the standard Web3 provider injected by MetaMask */
			const web3Provider = new ethers.BrowserProvider(detectedProvider);

			/* Connect to Ethereum. MetaMask will ask permission to connect user accounts */
			await web3Provider.send("eth_requestAccounts", []);

			/* Get the signer from the provider */
			const signer = await web3Provider.getSigner();

			/* Get the address of the connected wallet */
			const address = await signer.getAddress();

			/* Set the providers in the state variables */
			// setProvider(web3Provider);
      this.provider = web3Provider;

			/* Set the address in the state variable */
			// setAddress(address);
      this.address = address;
      this.isLogin = true;
      console.log('my address', this.address)

			return web3Provider;
		} catch (error) {
      // console.error(error)
			/* Throw the error */
			// throw new Error('connect wallet failed');
      throw error;
		}
	},

  /* Function to check if the network is the correct one */
	async checkNetwork (provider: Web3Provider) {
		try {
			/* Get the network from the provider */
			const network = await provider.getNetwork();

			/* Check if the network is the correct one */
			if (network.chainId.toString() !== CHAIN_ID.toString()) {
				/* Switch network if the chain id doesn't correspond to Goerli Testnet Network */
				await provider.send("wallet_switchEthereumChain", [
					{ chainId: "0x" + CHAIN_ID.toString(16) },
				]);

				/* Trigger a page reload */
				window.location.reload();
			}
		} catch (error) {
			/* This error code indicates that the chain has not been added to MetaMask */
			if (error.code === 4902) {
				await provider.send("wallet_addEthereumChain", [
					{
						chainId: "0x" + CHAIN_ID.toString(16),
						rpcUrls: ["https://goerli.infura.io/v3/"],
					},
				]);

				/* Trigger a page reload */
				window.location.reload();
			} else {
				/* Throw the error */
				throw error;
			}
		}
	},

  async getAccessToken(provider) {
    try {
      /* Get the message from the server */
      const messageResult = await fetchGraphql(LOGIN_GET_MESSAGE, {
        input: {
          address: this.address,
          domain: DOMAIN,
        }
      })
      
      console.log('messageResult', messageResult);
      const message = messageResult?.data?.loginGetMessage?.message;
  
      const signer = await provider.getSigner();
      /* Get the signature for the message signed with the wallet */
      const signature = await signer.signMessage(message);
  
      /* Verify the signature on the server and get the access token */
      const accessTokenResult = await fetchGraphql(LOGIN_VERIFY, {
        input: {
          address: this.address,
          domain: DOMAIN,
          signature: signature,
        }
      })
      const accessToken = accessTokenResult?.data?.loginVerify?.accessToken;
      console.log('accessToken', accessToken)
      setToken(accessToken);
    } catch(error) {
      console.error(error);
      throw error;
    }
  },

  async getPrimaryProfile() {
    const res = await fetchGraphql(PRIMARY_PROFILE, 
      {
        address: this.address,
      }
    );

    /* Get the primary profile */
    const primaryProfile = res?.data?.address?.wallet?.primaryProfile;
    this.hasGetProfile = true;
    
    if(primaryProfile && primaryProfile?.metadata) {
      const metadata = await getMetadata(primaryProfile?.metadata);
      console.log('metadata', metadata)
      if(metadata) {
        this.profileMetadata = metadata;
      }
      this.profile = cloneDeep(primaryProfile);
      this.profile.name = getNameFromHandle(this.profile.handle);
    }
    
    return res?.data?.address?.wallet;
  },

  async createProfile(metadata: IProfileMetadata) {
    const { nickName, avatarUrl } = getRandomUserInfo();
    const _metadata: IProfileMetadata = {
      name: metadata.name || nickName,
      bio: metadata.bio || "",
      handle: metadata.handle || nickName,
      version: metadata.version || env.VERSION,
    };

    /* Upload metadata to IPFS */
    const ipfsHash = await pinJSONToIPFS(_metadata);
    await metadataOss.init();
    const tokenURI = await metadataOss.upload(_metadata, ipfsHash);
    console.log("ipfs hash", tokenURI);

    const createProfileResult = await fetchGraphql(
      CREATE_CREATE_PROFILE_TYPED_DATA,
      {
        input: {
          // "`to` the owner address of the ccProfile."
          to: this.address,
          // "`handle` the handle of the ccProfile."
          handle: _metadata.handle || nickName,
          // "`avatar` the avatar of the ccProfile, should be a valid image link."
          avatar: avatarUrl,
          // "`metadata` the metadata of the ccProfile, should be a valid IPFS CID which points to a valid json file."
          metadata: ipfsHash,
          // "`operator` the operator address of the ccProfile. In addition to the profile owner, operator address could also help to manage the profile. The field could be void address if no operator is needed."
          operator: env.OPERATOR_ADDRESS,
        },
      }
    );
    console.log("createProfileResult", createProfileResult);
    const typedDataID =
      createProfileResult?.data?.createCreateProfileTypedData?.typedDataID;

    const relayResult = await fetchGraphql(RELAY, {
      input: {
        typedDataID,
      },
    });
    console.log("relayResult", relayResult);

    const relayActionId = relayResult?.data?.relay?.relayActionId;
    console.log("relayActionId", relayActionId);

    /*
     * error:
     * {
     *    "data": {
     *        "relayActionStatus": {
     *             "lastKnownTxHash": null,
     *             "reason": "insufficient funds for transfer"
     *        }
     *    }
     *  }
     * waiting
     * {
     *    "data": {
     *      "relayActionStatus":{
     *        "queuedAt": "2023-03-02T06:29:53Z",
     *        "reason": "waiting"
     *      }
     *    }
     * }
     * success
     * 
     * {
     *   "data": {
     *     "relayActionStatus": {
     *       "txHash": "0x8d226272ea2ad5759c826ce9e644a41a5cce146e6d67c05c662887764c5f2fb7",
     *       "txStatus": "SUCCESS | MINTING | ERROR"
     *     }
     *   }
     * }
     */

    const relayActionStatusResult = await this.loopRelayActionStatus(
      relayActionId
    );
    console.log("relayActionStatusResult", relayActionStatusResult);

    if(relayActionStatusResult?.txStatus === "SUCCESS") {
      await this.getPrimaryProfile();
    }

  },
  async loopRelayActionStatus(relayActionId) {
    const relayActionStatusResult = await fetchGraphql(RelayActionStatus, {
      relayActionId
    });
    const queuedAt = relayActionStatusResult?.data?.relayActionStatus?.queuedAt;
    const txStatus = relayActionStatusResult?.data?.relayActionStatus?.txStatus;
    const errorReason = relayActionStatusResult?.data?.relayActionStatus?.lastKnownTxHash !== undefined ? relayActionStatusResult?.data?.relayActionStatus?.reason : '';
    console.log('queuedAt', queuedAt)
    if(queuedAt) {
      await sleep(1000);
      return this.loopRelayActionStatus(relayActionId);
    }
    if(errorReason) {
      throw new Error(errorReason);
    }
    if(txStatus === 'SUCCESS') {
      return relayActionStatusResult?.data?.relayActionStatus;
    } else if(txStatus === 'MINTING') {
      await sleep(1000);
      return this.loopRelayActionStatus(relayActionId);
    } else {
      throw new Error('mint error');
    }
  }
}