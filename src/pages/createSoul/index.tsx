import { useState, useEffect } from "react";
import {View, Textarea} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {getSearchParams} from '@/utils/getSearchParams';
import {SOUL_TYPE_RELATION, SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION} from '@/constants/soul';
import SubmitBtn from './components/submit-btn/index';

// import UserInfoAuthButton from "@components/user-info-auth";

import './index.scss';
import Wrapper from "./components/wrapper";
import Numbers from "./components/numbers";
import RelationSelect from "./components/relation-select";

import mainManager from './manager/main';
import relationManager from './manager/relation';
import otherManager from './manager/other'

export default function() {
  const type = getSearchParams()?.type || SOUL_TYPE_RELATION;
  const [activeRelationIndex, setActiveRelationIndex] = useState(0);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [relationMessage, setRelationMessage] = useState('');
  // const userInfo = null;

  useEffect(() => {
    console.log('in create soul');
    relationManager.setSetActiveRelationIndex(setActiveRelationIndex);
    relationManager.setSetRelationMessage(setRelationMessage);
    otherManager.setSetSubmitButtonDisabled(setSubmitButtonDisabled);
    mainManager.init();
  }, [])
  const getPageTitleName = function(type) {
    if(type === SOUL_TYPE_RELATION) {
      return '建立数字关系';
    }
    if(type === SOUL_TYPE_TAG) {
      return '发送灵魂标签';
    }
    if(type === SOUL_TYPE_AUTHENTICATION) {
      return '发放身份认证';
    }
  }
  return <>
    <Wrapper type={type}>
      {/* 关系 */}
      {type === SOUL_TYPE_RELATION ?
      <>
        <View className="create-soul__block-box">
          <View className="create-soul__block-section-name">Choose a Relation</View>
          <RelationSelect activeIndexChangeCb={(index) => relationManager.activeIndexChangeCb(index)}></RelationSelect>
          <Numbers numberChangeCb={(number) => relationManager.createNumberChangeCb(number)} unit={''} disabled={activeRelationIndex === 0}></Numbers>
          <View className="create-soul__relation-textarea-box">
            <View className="create-soul__textarea-block">
              <View className="create-soul__textarea-title">Message</View>
                <Textarea
                  className="create-soul__textarea"
                  // autoHeight
                  controlled
                  // rows={3}
                  onInput={(e) => relationManager.inputCb(e)}
                  value={relationMessage}
                  placeholder="Do you want to say something?"
                  placeholderStyle={`
                    color: rgba(255, 255, 255, 0.45);
                    font-size: ${Taro.pxTransform(32,750)};
                    line-height: ${Taro.pxTransform(48,750)};
                  `}
                  style="background: transparent; color: #fff;"
                />
            </View>
          </View>
        </View>
        {/* {userInfo === null || !userInfo?.avatarUrl ? 
          <UserInfoAuthButton className="create-soul__submit-button" cb={(userInfo) => mainManager.clickSubmit(SOUL_TYPE_RELATION)}>
              <View></View>
          </UserInfoAuthButton>
          : */}
        <SubmitBtn type={SOUL_TYPE_RELATION} name="Go to issue" submitButtonDisabled={submitButtonDisabled} clickSubmit={() => mainManager.clickSubmit(SOUL_TYPE_RELATION)}></SubmitBtn>
        {/* <View className="create-soul__submit-button" onClick={() => mainManager.clickSubmit(SOUL_TYPE_RELATION)}>生成数字关系</View> */}
        {/* } */}
      </>
      : null
      }

      {/* 标签 */}
      {type === SOUL_TYPE_TAG ?
      <>
        <View className="create-soul__block-box">
          {/* <View className="create-soul__block-section-name">标签</View> */}
          <View className="create-soul__tag-textarea-box">
            <View className="create-soul__textarea-block">
              <View className="create-soul__textarea-title">Tag</View>
              <Textarea
                className="create-soul__textarea"
                // onInput={this.onInput}
                onInput={(e) => otherManager.inputCb(e)}
                  // value={remake}
                placeholder="Do you want to say something?"
                placeholderStyle={`
                  color: rgba(255, 255, 255, 0.45);
                  font-size: ${Taro.pxTransform(32,750)};
                  line-height: ${Taro.pxTransform(48,750)};
                `}
                style="background: transparent; color: #fff;"
              />
            </View>
          </View>
          <Numbers numberChangeCb={(number) => otherManager.createNumberChangeCb(number)}></Numbers>
        </View>
        {/* <View className={`create-soul__submit-button ${submitButtonDisabled ? 'create-soul__submit-button--disabled' : ''}`} onClick={() => mainManager.clickSubmit(SOUL_TYPE_TAG)}>发放数字标签</View> */}
        <SubmitBtn type={SOUL_TYPE_TAG} name="Go to issue" submitButtonDisabled={submitButtonDisabled} clickSubmit={() => mainManager.clickSubmit(SOUL_TYPE_TAG)}></SubmitBtn>

      </>
      : null
      }

      {/* 身份 */}
      {type === SOUL_TYPE_AUTHENTICATION ?
      <>
        <View className="create-soul__block-box">
          {/* <View className="create-soul__block-section-name">标签</View> */}
          <View className="create-soul__tag-textarea-box">
            <View className="create-soul__textarea-block">
              <View className="create-soul__textarea-title">Authentication</View>
              <Textarea
                className="create-soul__textarea"
                onInput={(e) => otherManager.inputCb(e)}
                // value={remake}
                placeholder="Do you want to say something?"
                placeholderStyle={`
                  color: rgba(255, 255, 255, 0.45);
                  font-size: ${Taro.pxTransform(32,750)};
                  line-height: ${Taro.pxTransform(48,750)};
                `}
                style="background: transparent; color: #fff;"
              />
            </View>
          </View>
          <Numbers numberChangeCb={(number) => otherManager.createNumberChangeCb(number)}></Numbers>
        </View>
        <SubmitBtn type={SOUL_TYPE_AUTHENTICATION} name="Go to issue" submitButtonDisabled={submitButtonDisabled} clickSubmit={() => mainManager.clickSubmit(SOUL_TYPE_AUTHENTICATION)}></SubmitBtn>

        {/* <View className={`create-soul__submit-button ${submitButtonDisabled ? 'create-soul__submit-button--disabled' : ''}`} onClick={() => mainManager.clickSubmit(SOUL_TYPE_AUTHENTICATION)}>发放身份认证</View> */}
      </>
      : null
      }
    </Wrapper>
  </>
}