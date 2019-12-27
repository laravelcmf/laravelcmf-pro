import React from 'react';

export interface MenuAction {
  id?: number;
  code?: string;
  name?: string;
  menu_id?: number;
}

export interface MenuResource {
  id?: number;
  code?: string;
  name?: string;
  method?: string;
  path?: string;
  menu_id?: number;
}

export interface MenuParam {
  id?: number;
  name?: string;
  parent_id?: number;
  parent_path?: string;
  sequence?: number;
  icon?: string;
  path?: string;
  hidden?: number;
  created_at?: string;
  updated_at?: string;
  actions?: MenuAction[];
  resources?: MenuResource[];
}

export interface GlobalItem {
  menuPaths?: { [key: string]: MenuParam };
}

export const GlobalContext = React.createContext<GlobalItem>({});
