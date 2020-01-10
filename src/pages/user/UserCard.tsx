import { AnyAction, Dispatch } from 'redux';
import { Form, Input, Modal, Radio } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import RoleSelect from './RoleSelect';
import { ConnectState, AdminModelState } from '@/models/connect';

export interface UserCardProps extends FormComponentProps {
  dispatch?: Dispatch<AnyAction>;
  onSubmit: any;
  onCancel: any;
  admin?: AdminModelState;
}

export interface UserCardState {}

class UserCard extends PureComponent<UserCardProps, UserCardState> {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.status = parseInt(formData.status, 10);
        onSubmit(formData);
      }
    });
  };

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch(action);
    }
  };

  render() {
    const {
      onCancel,
      admin,
      form: { getFieldDecorator },
    } = this.props;

    if (admin === undefined) {
      return undefined;
    }

    const { formType, formTitle, formVisible, formData, submitting } = admin;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title={formTitle}
        width={600}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="用户名">
            {getFieldDecorator('name', {
              initialValue: formData.name,
              rules: [
                {
                  required: true,
                  message: '请输入用户名',
                },
              ],
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="登录密码">
            {getFieldDecorator('password', {
              initialValue: formData.password,
              rules: [
                {
                  required: formType === 'A',
                  message: '请输入登录密码',
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formType === 'A' ? '请输入登录密码' : '留空则不修改登录密码'}
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="所属角色">
            {getFieldDecorator('role_id', {
              initialValue: formData.role_id,
              rules: [
                {
                  required: true,
                  message: '请选择所属角色',
                },
              ],
            })(<RoleSelect />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="用户状态">
            {getFieldDecorator('status', {
              initialValue: formData.status ? formData.status.toString() : '1',
            })(
              <Radio.Group>
                <Radio value="1">正常</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: formData.email,
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default connect(({ admin }: ConnectState) => ({
  admin,
}))(Form.create<UserCardProps>()(UserCard));
