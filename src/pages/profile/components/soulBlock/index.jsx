import {
  View,
  Image,
} from "@tarojs/components";
import "./index.scss";

import {
  relation_icon,
  tag_icon,
  certification_icon,
  activity_icon,
  soul_user_block_bg_relation,
  soul_user_block_bg_tag,
  soul_user_block_bg_certification,
  soul_user_block_bg_activity,
} from '@/constants/soulImage';

const iconImageMap = {
  relation: relation_icon,
  tag: tag_icon,
  certification: certification_icon,
  activity: activity_icon,
}

const bgImageMap = {
  relation: soul_user_block_bg_relation,
  tag: soul_user_block_bg_tag,
  certification: soul_user_block_bg_certification,
  activity: soul_user_block_bg_activity,
}

// type relation, tag, certification, activity
export default function(props) {
  const {title, number, children, type} = props;
  return <View className="user-soul-block__wrap">
    <Image className="user-soul-block__bg" mode="aspectFill" src={bgImageMap[type]}></Image>
    <View className="user-soul-block__body">
      <View className="user-soul-block__header">
        <Image className="user-soul-block__header-icon" src={iconImageMap[type]}  mode="widthFix" />
        <View className="user-soul-block__header-text">{title}</View>
        <View className="user-soul-block__header-num">{number}</View>
      </View>
      {children}
    </View>
  </View>
}