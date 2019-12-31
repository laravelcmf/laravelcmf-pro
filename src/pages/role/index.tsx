import { connect } from 'dva';
import { AnyAction, Dispatch } from 'redux';
import { Button, Card, Col, Form, Input, Modal, Row, Table } from 'antd';
import React, { PureComponent } from 'react';

import { FormComponentProps } from 'antd/es/form';
import PButton from '@/components/PermButton';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';
import { ConnectState, RoleModeState } from '@/models/connect';
import RoleCard from './RoleCard';

export interface RoleProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  loading: any;
  role: RoleModeState;
}

export interface RoleState {
  selectedRowKeys: any;
  selectedRows: any;
}

export interface column {
  title: string;
  dataIndex: string;
  width?: number;
}

class Role extends PureComponent<RoleProps, RoleState> {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'role/fetch',
      search: {},
      pagination: {},
    });
  }

  // 请求函数
  dispatch = (action: AnyAction) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  handleAddClick = () => {
    this.dispatch({
      type: 'role/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  handleEditClick = (item: any) => {
    this.dispatch({
      type: 'role/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  handleDelClick = (item: any) => {
    Modal.confirm({
      title: `确定删除【角色数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.id),
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

  // 选中项发生变化时的回调
  handleTableChange = ({ current, pageSize, total }: any) => {
    this.dispatch({
      type: 'role/fetch',
      pagination: { current, pageSize, total },
    });
    this.clearSelectRows();
  };

  handleResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'role/fetch',
      search: {},
      pagination: {},
    });
  };

  handleSearchFormSubmit = (e: any) => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      this.dispatch({
        type: 'role/fetch',
        search: values,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleDataFormSubmit = (data: any) => {
    this.dispatch({
      type: 'role/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'role/changeFormVisible',
      payload: false,
    });
  };

  handleDelOKClick(id: number) {
    this.dispatch({
      type: 'role/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return <RoleCard onCancel={this.handleDataFormCancel} onSubmit={this.handleDataFormSubmit} />;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={8}>
            <Form.Item label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  // 渲染
  render() {
    const {
      loading,
      role: { data },
    } = this.props;

    const { list, pagination } = data || {};
    const { selectedRowKeys, selectedRows } = this.state;

    const columns: column[] = [
      {
        title: '角色名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '排序值',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '角色备注',
        dataIndex: 'memo',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '角色管理', href: '/system/role' }];
    return (
      <PageHeaderLayout title="角色管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  icon="delete"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
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
                onChange={this.handleTableChange}
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

export default connect(({ role }: ConnectState) => ({
  role,
}))(Form.create<RoleProps>()(Role));
