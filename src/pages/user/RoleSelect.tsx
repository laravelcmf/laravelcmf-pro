import React, { PureComponent } from 'react';

import { Select } from 'antd';
import { list } from '@/services/role';

export interface RoleSelectProps {
  value?: any;
  onChange?: any;
}

export interface RoleSelectState {
  value: any;
  data: any;
}

export default class RoleSelect extends PureComponent<RoleSelectProps, RoleSelectState> {
  constructor(props: RoleSelectProps) {
    super(props);

    this.state = {
      value: props.value,
      data: [],
    };
  }

  componentDidMount() {
    list().then(response => {
      this.setState({ data: response.data || [] });
    });
  }

  static getDerivedStateFromProps(nextProps: any, state: any) {
    if ('value' in nextProps) {
      return { ...state, value: nextProps.value };
    }
    return state;
  }

  handleChange = (value: any) => {
    this.setState({ value });
    this.triggerChange(value);
  };

  triggerChange = (value: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { value, data } = this.state;
    return (
      <Select
        mode="default"
        value={value}
        onChange={this.handleChange}
        placeholder="请选择角色"
        style={{ width: '100%' }}
      >
        {data &&
          data.map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
      </Select>
    );
  }
}
