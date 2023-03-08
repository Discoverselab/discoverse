import {View, Image} from '@tarojs/components'

import {
  invite_button_icon,
} from '@/constants/soulImage'
import './index.scss';

export default function(props) {
  const {claimCb} = props;

  return <>
    <View className="soul-detail__button-box" onClick={() => claimCb()} >
      <Image className="soul-detail__button-icon" src={invite_button_icon}></Image>
      Claim
    </View>
    {/* {!authPhone ?
      <AuthNickName openType="getPhoneNumber" clickedCallback={(phone) => clickedCallback(phone)}>
        <View className={`create-soul__submit-button ${submitButtonDisabled && type !== SOUL_TYPE_RELATION ? 'create-soul__submit-button--disabled' : ''}`}>{name}</View>

      </AuthNickName>
      :
      <View className={`create-soul__submit-button ${submitButtonDisabled && type !== SOUL_TYPE_RELATION ? 'create-soul__submit-button--disabled' : ''}`} onClick={() => clickSubmit(type)}>{name}</View>
    } */}
  </>
}