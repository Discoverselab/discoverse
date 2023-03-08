import {SOUL_TYPE_RELATION, SOUL_TYPE_TAG, SOUL_TYPE_AUTHENTICATION} from '@/constants/soul';
import {
  soul_detail_certification_icon,
  soul_detail_tag_icon
} from '@/constants/soulImage'

export default {
  createNumber: 1,
  message: '',
  submitButtonDisabled: true,
  setSubmitButtonDisabled() {},
  setSetSubmitButtonDisabled(setSubmitButtonDisabled) {
    this.setSubmitButtonDisabled = setSubmitButtonDisabled;
  },
  init() {
    this.createNumber = 1;
    this.message = '';
    this.submitButtonDisabled = true;
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
    if(this.createNumber < 1 || this.createNumber > 500) {
      result.success = false;
      // todo 提示文案确认
      result.message = 'Failed for the word limit.'
      return result;
    }
    return result;
  },
  getImageUrl(type) {
    if(type === SOUL_TYPE_TAG) return soul_detail_tag_icon;
    if(type === SOUL_TYPE_AUTHENTICATION) return soul_detail_certification_icon;
  },
  inputCb(e) {
    this.message = e.detail.value;
    let _submitButtonDisabled;
    if((e.detail.value || '').trim() === '') {
      _submitButtonDisabled = true;
    } else {
      _submitButtonDisabled = false;
    }
    console.log('inputCb', e.detail.value, _submitButtonDisabled, this.submitButtonDisabled, this.setSubmitButtonDisabled)

    if(_submitButtonDisabled !== this.submitButtonDisabled) {
      this.submitButtonDisabled = _submitButtonDisabled;
      this.setSubmitButtonDisabled(_submitButtonDisabled);
    }
  },
  getName(type) {
    if(type === SOUL_TYPE_TAG) return 'Tag';
    if(type === SOUL_TYPE_AUTHENTICATION) return 'Authentication';
  }

}