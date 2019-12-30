import { Table } from 'antd';
import React, { PureComponent } from 'react';

import EditableCell from './EditableCell';
import * as menuService from '@/services/menu';

export interface RoleMenuProps {
  value?: any;
  onChange?: any;
}

export interface RoleMenuState {
  dataSource: any;
  menuData: any;
}

export interface column {
  title: string;
  editable?: boolean;
  dataIndex: string;
  width: string;
}

export default class RoleMenu extends PureComponent<RoleMenuProps, RoleMenuState> {
  private columns: column[];

  constructor(props: RoleMenuProps) {
    super(props);

    this.columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: '动作权限',
        dataIndex: 'actions',
        editable: true,
        width: '30%',
      },
      {
        title: '资源权限',
        dataIndex: 'resources',
        editable: true,
        width: '40%',
      },
    ];

    this.state = {
      menuData: [],
      dataSource: props.value || [],
    };
  }

  componentDidMount(): void {
    menuService.queryTree({ include: 'actions,resources' }).then((response: any) => {
      const list = response.data || [];
      this.setState({ menuData: this.fillData(list) });
    });
  }

  static getDerivedStateFromProps(nextProps: { value: any }, state: any) {
    if ('value' in nextProps) {
      return {
        ...state,
        dataSource: nextProps.value || [],
      };
    }
    return state;
  }

  fillData = (data: any) => {
    const newData = [...data];
    for (let i = 0; i < newData.length; i += 1) {
      const { children } = newData[i];
      const item = { ...newData[i], hasChild: children && children.length > 0 };
      if (item.hasChild) {
        item.children = this.fillData(children);
      } else {
        delete item.children;
      }
      newData[i] = item;
    }
    return newData;
  };

  handleSave = (record: any, dataIndex: any, values: any) => {
    const { dataSource } = this.state;
    const data = [...dataSource];
    const index = data.findIndex(item => item.menu_id === record.id);
    let item = data[index];
    if (!item) {
      item = {
        menu_id: record.id,
        dataIndex: values,
      };
    } else {
      item[dataIndex] = values;
    }
    data.splice(index, 1, {
      ...item,
    });
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  triggerChange = (data: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  expandAllChild = (data: any): any => {
    let child = [];
    for (let i = 0; i < data.length; i += 1) {
      child.push(data[i]);
      if (data[i].children && data[i].children.length > 0) {
        child = [...child, ...this.expandAllChild(data[i].children)];
      }
    }
    return child;
  };

  checkAndAdd = (data: any, addData: any): any => {
    const list = [...data];

    for (let i = 0; i < addData.length; i += 1) {
      let exists = false;
      for (let j = 0; j < list.length; j += 1) {
        if (list[j].menu_id === addData[i].id) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        const item = {
          menu_id: addData[i].id,
          actions: addData[i].actions ? addData[i].actions.map((v: any) => v.code) : [],
          resources: addData[i].resources ? addData[i].resources.map((v: any) => v.code) : [],
        };
        list.push(item);
      }
    }

    return list;
  };

  cancelSelected = (data: any, selectedRows: any) => {
    const list = [];
    for (let i = 0; i < data.length; i += 1) {
      let exists = false;
      for (let j = 0; j < selectedRows.length; j += 1) {
        if (data[i].menu_id === selectedRows[j].id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        list.push(data[i]);
      }
    }
    return list;
  };

  handleSelectedRow = (record: any, selected: any) => {
    let selectedRows = [record];
    if (record.children && record.children.length > 0) {
      selectedRows = [...selectedRows, ...this.expandAllChild(record.children)];
    }

    const { dataSource } = this.state;
    let list: any[] = [];
    if (selected) {
      list = this.checkAndAdd(dataSource, selectedRows);
    } else {
      list = this.cancelSelected(dataSource, selectedRows);
    }

    this.setState({ dataSource: list }, () => {
      this.triggerChange(list);
    });
  };

  handleSelectAll = (selected: any, selectRows: any) => {
    let list: never[] = [];
    if (selected) {
      list = selectRows.map((vv: any) => ({
        menu_id: vv.id,
        actions: vv.actions ? vv.actions.map((v: any) => v.code) : [],
        resources: vv.resources ? vv.resources.map((v: any) => v.code) : [],
      }));
    }
    this.setState({ dataSource: list }, () => {
      this.triggerChange(list);
    });
  };

  render() {
    const { dataSource, menuData } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          data: dataSource,
          dataIndex: col.dataIndex,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      menuData.length > 0 && (
        <Table
          bordered
          defaultExpandAllRows
          rowSelection={{
            selectedRowKeys: dataSource.map((v: any) => v.menu_id),
            onSelect: this.handleSelectedRow,
            onSelectAll: this.handleSelectAll,
          }}
          rowKey={record => record.id}
          components={components}
          dataSource={menuData}
          columns={columns}
          pagination={false}
        />
      )
    );
  }
}
