import {default_avatar} from '@/constants/images';

export function getRandomUserInfo() {
  let nickName = 'player';
  const randomInt = Math.round(Math.random() * 10000000);
  let nickNameId = randomInt + '';
  if(randomInt < 1000000) {
    const nickNameIdPreDefault = '1';
    const nickNameIdPre = Math.round(Math.random() * 10);
    if(nickNameIdPre < 1) {
      nickNameId = nickNameIdPreDefault + (randomInt + '');
    } else {
      nickNameId = nickNameIdPre + (randomInt + '');
    }
  }
  return {
    nickName: nickName + nickNameId,
    handle: nickName + '_' + nickNameId,
    avatarUrl: default_avatar
  }
}
