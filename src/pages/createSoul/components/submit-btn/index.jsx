import {View} from '@tarojs/components'
import {SOUL_TYPE_RELATION} from '@/constants/soul';
import './index.scss';

export default function(props) {
  const {type, name, clickSubmit, submitButtonDisabled} = props;
  // const clickedCallback = function(phone) {
  //   console.log('phone clicked', phone);
  //   if(phone) {
  //     clickSubmit(type);
  //   }
  // }
  return <>
    <View className={`create-soul__submit-button ${submitButtonDisabled && type !== SOUL_TYPE_RELATION ? 'create-soul__submit-button--disabled' : ''}`} onClick={() => clickSubmit(type)}>{name}</View>
  </>
}