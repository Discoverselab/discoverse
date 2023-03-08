import { useState } from 'react';
import {View, Input} from '@tarojs/components'
import './index.scss';

export default function(props) {
  const {numberChangeCb = () => {}, unit, disabled = false, disabledNumber = 1, maxNumber = 50} = props;
  
  const [numberValue, setNumberValue] = useState(1);
  const [displayNumberValue, setDisplayNumberValue] = useState(1);
  console.log('input', displayNumberValue)

  const numberValueChange = function(value, displayNumberValue, numberValue) {
    if(displayNumberValue === undefined) {
      numberChangeCb(value);
      // setNumberValue(value);
      setDisplayNumberValue(value);
    } else {
      numberChangeCb(value);
      setDisplayNumberValue(value);
    }
    // if(value > 0) {
    //   setNumberValue(value);
    // }
  }

  const clickDecrease = function(numberValue) {
    if(numberValue <= 1) {
      return false;
    }
    console.log(numberValue);
    numberValueChange(numberValue - 1);
  }

  const clickIncrease = function(numberValue) {
    if(numberValue >= maxNumber) {
      return false;
    }
    console.log(numberValue);
    numberValueChange(numberValue + 1)
  }

  const _onBlurCb = function(event, displayNumberValue, numberValue) {
    console.log('in inputCb', event.detail.value, event.detail.value.trim())
    const stringValue = event.detail.value;
    let currentNumberValue = '';
    let intNumber = 1;
    if(stringValue.trim() !== '') {
      intNumber = parseInt(stringValue.trim());
      currentNumberValue = intNumber;
      if(intNumber > maxNumber) {
        currentNumberValue = maxNumber;
      } else if(intNumber < 1) {
        currentNumberValue = 1;
      } else {
        currentNumberValue = intNumber;
      }
    }

    console.log('in inputCb2', currentNumberValue, displayNumberValue, numberValue)
    numberValueChange(currentNumberValue, displayNumberValue, numberValue);
    return currentNumberValue + '';
  }

  const _onInputCb = function(event, displayNumberValue, numberValue) {
    const stringValue = event.detail.value;
    if(stringValue.trim() !== '') {
      setDisplayNumberValue(stringValue.trim())
    }
  }

  return <View className="create-soul-number__box">
    <View className="create-soul-number__pre">Quantity</View>
    <View className="create-soul-number__control-box">
      {!disabled ? 
      <View
        className={`create-soul-number__decrease-button ${displayNumberValue <= 1 || displayNumberValue === '' ? 'create-soul-number__decrease-button--disabled' : ''}`}
        onClick={() => clickDecrease(displayNumberValue)}
      >-</View>
      : null}
      <View className="create-soul-number__input-box">
      {!disabled ? 
      <Input
        className="create-soul-number__input"
        type='number'
        controlled={true}
        disabled={disabled}
        value={displayNumberValue}
        onBlur={(event) => _onBlurCb(event, displayNumberValue, numberValue)}
        onInput={(event) => _onInputCb(event, displayNumberValue, numberValue)}
      ></Input>
      :
      <View className="create-soul-number__input">{disabledNumber}</View>
      }
      </View>
      {!disabled ? 
      <View
        className={`create-soul-number__increase-button ${displayNumberValue >= maxNumber || displayNumberValue === '' ? 'create-soul-number__increase-button--disabled' : ''}`}
        onClick={() => clickIncrease(displayNumberValue)}
      >+</View>
      : null}
      {unit ?
        <View className="create-soul-number__after">{unit}</View>
      : null}

    </View>
  </View>
}