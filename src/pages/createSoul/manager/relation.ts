import {relation_list} from '@/constants/soul';

export default {
  messageList: [
    [
      '近朱者赤，近你者甜',
      '亲爱的，我十拿九稳，只差你一吻',
      '你眼瞎吗?撞我心口上了',
      '被你赞过的朋友圈，叫甜甜圈',
      '只许州官放火，不许你离开我',
      '岁月为笔，相思入墨，字里行间全是你',
      '我喜欢你，胜于昨日，略匮明朝',
      '我不善于旅行，你就是我的整个世界',
      '梦想的生活有一百种，种种都有你',
      '不思进取，思你',
    ],
    [

    ],
    [

    ],
    [

    ],
    [

    ],
    [

    ],
  ],
  setActiveRelationIndex() {},
  setRelationMessage() {},
  setSetActiveRelationIndex(setActiveRelationIndex) {
    this.setActiveRelationIndex = setActiveRelationIndex;
  },
  setSetRelationMessage(setRelationMessage) {
    this.setRelationMessage = setRelationMessage;
  },
  init() {
    this.activeIndex = 0;
    this.message = '';
    this.hasInput = false;
    // this.getRandomMessage();
  },
  getRandomMessage() {
    if(this.hasInput) return;
    let newMessage = '';
    const messageList = this.messageList[this.activeIndex];
    if(messageList.length > 0) {
      let randomNumber = Math.floor(Math.random() * messageList.length);
      if(randomNumber < 0 || randomNumber >= messageList.length) {
        randomNumber = 0;
      }
      newMessage = messageList[randomNumber];
    }
    this.message = newMessage;
    this.setRelationMessage(this.message);
  },
  activeIndex: 0,
  createNumber: 1,
  message: '',
  hasInput: false,
  constantsList: relation_list,
  activeIndexChangeCb(index) {
    if(this.activeIndex !== index) {
      this.activeIndex = index;
      this.setActiveRelationIndex(index);
      if(index === 0) {
        this.createNumber = 1;
      }
      // this.getRandomMessage();
    }

    console.log('index', index);
  },
  createNumberChangeCb(number) {
    this.createNumber = number;
    console.log('createNumber', number);
  },
  validate() {
    const result = {
      success: true,
      message: '',
    }
    // if(this.activeIndex === 0 && (this.createNumber < 1 || this.createNumber > 2)) {
    //   result.success = false;
    //   // todo 提示文案确认
    //   result.message = '铸造数量应该在1-2间'
    //   return result;
    // }
    if(this.activeIndex > 0 && (this.createNumber < 1 || this.createNumber > 500)) {
      result.success = false;
      // todo 提示文案确认
      result.message = 'Failed for the word limit.'
      return result;
    }
    return result;
  },
  inputCb(e) {
    this.hasInput = true;
    this.message = e.detail.value;
    this.setRelationMessage(this.message);
    // console.log('relation inputCb', e);
  },
  getImageUrl() {
    return this.constantsList[this.activeIndex].image;

  },
  getRelationType() {
    return this.constantsList[this.activeIndex].name
  },
  getName() {
    return this.constantsList[this.activeIndex].name; 
  }
}