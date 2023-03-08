import {useState} from 'react';
import {View, Image} from '@tarojs/components'

import {
  relation_select_active,
  relation_lover,
  relation_girlmate,
  relation_boymate,
  relation_family,
  relation_classmate,
  relation_colleague,
} from '@/constants/soulImage'

import './index.scss';

const relationSelectList = [
  {
    image: relation_lover,
    name: 'Love'
  },
  {
    image: relation_girlmate,
    name: 'Bestie'
  },
  {
    image: relation_boymate,
    name: 'Buddy'
  },
  {
    image: relation_classmate,
    name: 'Friend'
  },
  // {
  //   image: relation_classmate,
  //   name: '同学'
  // },
  // {
  //   image: relation_colleague,
  //   name: '同事'
  // },
]

export default function(props) {
  const {activeIndexChangeCb = function() {}} = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const _activeIndexChangeCb = function(index, activeIndex) {
    if(index === activeIndex) {
      return false;
    }
    setActiveIndex(index);
    activeIndexChangeCb(index);
  }
  return  <View className="create-soul__relation-select-list">
    {
      relationSelectList.map((relationSelect, index) => <View
        className={`
          create-soul__relation-select-item
          ${(index+1)%4 === 0 ? 'create-soul__relation-select-item--no-margin-right' : ''}
        `}
        key={`create-soul-relation-select-item-key-id-${index}`}
        onClick={() => _activeIndexChangeCb(index, activeIndex)}
      >
        <View className="create-soul__relation-select-icon-box">
          <Image className="create-soul__relation-select-icon" src={relationSelect.image}></Image>
          {index === activeIndex ? <Image className="create-soul__relation-select-active" src={relation_select_active}></Image> : null}
        </View>
        <View className="create-soul__relation-select-name">{relationSelect.name}</View>
      </View>
      )
    }
  </View>
}