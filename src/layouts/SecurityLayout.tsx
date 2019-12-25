import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import PageLoading from '@/components/PageLoading';
import store from '@/utils/store';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/fetchUser',
        success: () => {
          dispatch({
            type: 'global/fetchMenuTree',
          });
        },
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = store.getAccessToken();
    const queryString = stringify({
      redirect: window.location.href,
    });
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin) {
      return <Redirect to={`/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(({ global, loading }: ConnectState) => ({
  global,
  loading: loading.models.global,
}))(SecurityLayout);
