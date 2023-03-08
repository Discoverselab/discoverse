import {
  // relation_select_active,
  relation_lover,
  relation_girlmate,
  relation_boymate,
  // relation_family,
  relation_classmate,
  // relation_colleague,
} from '@/constants/soulImage'

export const SOUL_TYPE_RELATION = 'RELATION'
export const SOUL_TYPE_TAG = 'TAG'
export const SOUL_TYPE_AUTHENTICATION = 'AUTHENTICATION'
export const SOUL_TYPE_BADGE = 'BADGE'
export const relation_list = [
  // 数字关系类型 0：恋人，1：闺蜜，2：死党，3：家人，4：同学，5：同事
  {
    image: relation_lover,
    name: 'Love',
    backendString: 'LOVERS_RELATION'
  },
  {
    image: relation_girlmate,
    name: 'Bestie',
    backendString: 'LADYBRO_RELATION',
  },
  {
    image: relation_boymate,
    name: 'Buddy',
    backendString: 'BEST_RELATION'
  },
  {
    image: relation_classmate,
    name: 'Friend',
    backendString: 'FAMILY_RELATION'
  },
  // {
  //   image: relation_classmate,
  //   name: '同学',
  //   backendString: 'CLASSMATE_RELATION'
  // },
  // {
  //   image: relation_colleague,
  //   name: '同事',
  //   backendString: 'COLLEAGUES_RELATION'
  // },
];