import login from '@/components/login/index';

export default {
  setAddress: undefined as Function | undefined,
  setUsername: undefined as Function | undefined,
  setIsLogin: undefined as Function | undefined,
  setHasGetProfile: undefined as Function | undefined,
  async init() {
    await login.login();
    console.log('login', login);
    this.setAddress(login.address || '');
    this.setIsLogin(login.isLogin);
    this.setHasGetProfile(login.hasGetProfile);
    if(login.hasGetProfile) {
      this.setUsername(login?.profile?.name);
    }
  },
  destroy() {

  },
  async getOrCreateProfile() {
    await login.getOrCreateProfile();
    this.setHasGetProfile(login.hasGetProfile);
    if(login.hasGetProfile) {
      this.setUsername(login?.profile?.name);
    }
  },
  async clickCreateProfile() {
    console.log('clickCreateProfile')
    await login.createProfile({
      name: '',
      bio: '',
      handle: '',
      version: '',
    });
    // await login
  }
}