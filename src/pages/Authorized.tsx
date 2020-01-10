import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/global';

interface AuthComponentProps extends ConnectProps {
  user: CurrentUser;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const currentUser = user;
  const { routes = [] } = route;
  const isLogin = currentUser && currentUser.name;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ global }: ConnectState) => ({
  currentUser: global.user,
}))(AuthComponent);
