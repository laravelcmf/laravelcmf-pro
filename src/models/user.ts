export interface UserModelType {
  namespace: 'user';
  state: {};
  effects: {};
  reducers: {};
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {},

  reducers: {},
};

export default UserModel;
