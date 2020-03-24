import { AnyAction, Dispatch } from 'redux';
import { Badge, Button, Card, Col, Form, Input, Modal, Radio, Row, Table } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import RoleSelect from './RoleSelect';
import UserCard from './UserCard';
import styles from './index.less';
import PButton from '@/components/PermButton';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { ConnectState, AdminModelState } from '@/models/connect';

export interface UserListProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  admin: AdminModelState;
  loading: any;
}

export interface UserListState {
  selectedRowKeys: string[];
  selectedRows: any[];
}

class UserList extends PureComponent<UserListProps, UserListState> {
  constructor(props: UserListProps) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'admin/fetch',
      search: {},
      pagination: {},
    });
  }

  onItemDisableClick = (item: any) => {
    this.dispatch({
      type: 'admin/changeStatus',
      payload: { id: item.id, status: 2 },
    });
  };

  onItemEnableClick = (item: any) => {
    this.dispatch({
      type: 'admin/changeStatus',
      payload: { id: item.id, status: 1 },
    });
  };

  onItemEditClick = (item: any) => {
    this.dispatch({
      type: 'admin/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'admin/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onDelOKClick(Id: any) {
    this.dispatch({
      type: 'admin/del',
      payload: { id: Id },
    });
    this.clearSelectRows();
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  onItemDelClick = (item: any) => {
    Modal.confirm({
      title: `确定删除【用户数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  handleTableSelectRow = (record: any, selected: any) => {
    let keys = new Array(0);
    let rows = new Array(0);
    if (selected) {
      keys = [record.id];
      rows = [record];
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onTableChange = (pagination: any) => {
    this.dispatch({
      type: 'admin/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'admin/fetch',
      search: {},
      pagination: {},
    });
  };

  onSearchFormSubmit = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }

      this.dispatch({
        type: 'admin/fetch',
        search: {
          ...values,
        },
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  onDataFormSubmit = (data: any) => {
    this.dispatch({
      type: 'admin/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'admin/changeFormVisible',
      payload: false,
    });
  };

  dispatch = (action: any) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderDataForm() {
    return <UserCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属角色">{getFieldDecorator('role_id')(<RoleSelect />)}</Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="用户状态">
              {getFieldDecorator('status', { initialValue: '0' })(
                <Radio.Group>
                  <Radio value="0">全部</Radio>
                  <Radio value="1">正常</Radio>
                  <Radio value="2">停用</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      admin: { data },
    } = this.props;
    const { list, pagination } = data || {};
    const { selectedRows, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 50,
      },
      {
        title: '用户名',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '角色名称',
        dataIndex: 'role.name',
        width: 150,
      },
      {
        title: '登录IP',
        dataIndex: 'last_login_ip',
        width: 150,
      },
      {
        title: '登录地点',
        dataIndex: 'login_address',
        width: 200,
      },
      {
        title: '登录次数',
        dataIndex: 'login_count',
        width: 100,
      },
      {
        title: '用户状态',
        dataIndex: 'status',
        render: (val: any): any => {
          if (val === 2) {
            return <Badge status="error" text="停用" />;
          }
          if (val === 3) {
            return <Badge status="error" text="删除" />;
          }
          return <Badge status="success" text="启用" />;
        },
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 150,
      },
      {
        title: '最近登录',
        dataIndex: 'updated_at',
        width: 150,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: any) => <span>共{total}条</span>,
      ...pagination,
    };

    return (
      <PageHeaderLayout title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  icon="edit"
                  onClick={() => this.onItemEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  icon="delete"
                  type="danger"
                  onClick={() => this.onItemDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                (selectedRows[0].status === 2 || selectedRows[0].status === 3) && (
                  <PButton
                    key="enable"
                    code="enable"
                    icon="check"
                    onClick={() => this.onItemEnableClick(selectedRows[0])}
                  >
                    启用
                  </PButton>
                ),
                selectedRows[0].status === 1 && (
                  <PButton
                    key="disable"
                    code="disable"
                    icon="stop"
                    type="danger"
                    onClick={() => this.onItemDisableClick(selectedRows[0])}
                  >
                    禁用
                  </PButton>
                ),
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onSelect: this.handleTableSelectRow,
                }}
                loading={loading}
                rowKey={(record: any) => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.onTableChange}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default connect((state: ConnectState) => ({
  loading: state.loading.models.admin,
  admin: state.admin,
}))(Form.create<UserListProps>()(UserList));
