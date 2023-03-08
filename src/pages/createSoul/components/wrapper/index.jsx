import {View, Image} from '@tarojs/components'
import {SOUL_TYPE_RELATION, SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION, SOUL_TYPE_BADGE} from '@/constants/soul';
import {
  relation_icon,
  tag_icon,
  certification_icon,
  activity_icon,
  relation_top_bg,
  tag_top_bg,
  certification_top_bg,
  activity_top_bg,
} from '@/constants/soulImage';
import './index.scss';

const dataMap = {
  [SOUL_TYPE_RELATION]: {
    icon: relation_icon,
    topBg: relation_top_bg,
    title: 'Relation',
    message: 'Mint a relation on the chain'
  },
  [SOUL_TYPE_TAG]: {
    icon: tag_icon,
    topBg: tag_top_bg,
    title: 'Tag',
    message: 'Describe your friend with tagging.'
  },
  [SOUL_TYPE_AUTHENTICATION]: {
    icon: certification_icon,
    topBg: certification_top_bg,
    title: 'Authentication',
    message: 'Build a on-chian resume.'
  },
  // [SOUL_TYPE_BADGE]: {
  //   icon: activity_icon,
  //   topBg: activity_top_bg,
  //   title: '活动徽章',
  //   message: '为我们的活动留下永恒的记忆'
  // },
}

export default function(props) {
  const {type, children} = props;
  const data = dataMap[type || SOUL_TYPE_RELATION];
  return <View className="create-soul-wrapper">
    <Image className="create-soul-wrapper__top-bg" mode="heightFix" src={data.topBg}></Image>
    <View className="create-soul-wrapper__main-box">
      <View className="create-soul-wrapper__header-box">
        <Image className="create-soul-wrapper__header-icon" mode="heightFix" src={data.icon}></Image>
        <View className="create-soul-wrapper__header-content">
          <View className="create-soul-wrapper__header-title">{data.title}</View>
          <View className="create-soul-wrapper__header-msg">{data.message}</View>
        </View>
      </View>
      {children}
    </View>
  </View>
}