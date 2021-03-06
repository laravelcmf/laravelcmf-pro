import { AnyAction, Dispatch } from 'redux';
import {
  Card,
  Col,
  Form,
  Icon,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Tooltip,
  TreeSelect,
} from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import MenuAction from './Action';
import MenuResource from './Resource';
import { MenuListProps } from '@/pages/menu/index';

export interface MenuCardProps extends FormComponentProps {
  onSubmit?: any;
  dispatch?: Dispatch<AnyAction>;
  onCancel: any;
  menu?: any;
}

class MenuCard extends PureComponent<MenuCardProps> {
  onOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const formData = { ...values };
        formData.hidden = parseInt(formData.hidden, 10);
        formData.sequence = parseInt(formData.sequence, 10);
        onSubmit(formData);
      }
    });
  };

  toTreeSelect = (data: any) => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      menu: { formVisible, formTitle, formData, submitting, treeData },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Modal
        title={formTitle}
        width={900}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="菜单名称">
                  {getFieldDecorator('name', {
                    initialValue: formData.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入菜单名称',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="上级菜单">
                  {getFieldDecorator('parent_id', {
                    initialValue: formData.parent_id,
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.toTreeSelect(treeData)}
                      placeholder="请选择"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="菜单图标">
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('icon', {
                        initialValue: formData.icon,
                        rules: [
                          {
                            required: true,
                            message: '请输入菜单图标',
                          },
                        ],
                      })(<Input placeholder="请输入" />)}
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Tooltip title="图标仅支持官方Icon图标">
                        <Icon type="question-circle" />
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="访问路由">
                  {getFieldDecorator('path', {
                    initialValue: formData.path,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="排序值">
                  {getFieldDecorator('sequence', {
                    initialValue: formData.sequence ? formData.sequence.toString() : '1000000',
                    rules: [
                      {
                        required: true,
                        message: '请输入排序值',
                      },
                    ],
                  })(<InputNumber min={1} style={{ width: '80%' }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="隐藏状态">
                  {getFieldDecorator('hidden', {
                    initialValue: formData.hidden ? formData.hidden.toString() : '0',
                  })(
                    <Radio.Group>
                      <Radio value="0">显示</Radio>
                      <Radio value="1">隐藏</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="动作管理" bordered={false}>
                  {getFieldDecorator('actions', {
                    initialValue: formData.actions ? formData.actions.data : null,
                  })(<MenuAction />)}
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="资源管理(服务端路由)" bordered={false}>
                  {getFieldDecorator('resources', {
                    initialValue: formData.resources ? formData.resources.data : null,
                  })(<MenuResource />)}
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default connect(({ menu }: ConnectState) => ({
  menu,
}))(Form.create<MenuListProps>()(MenuCard));
