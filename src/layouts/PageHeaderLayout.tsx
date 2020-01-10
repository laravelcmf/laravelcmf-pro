import Link from 'umi/link';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import styles from './PageHeaderLayout.less';

export interface PageHeaderLayoutProps {
  children?: any;
  wrapperClassName?: any;
  top?: any;
  title?: any;
  breadcrumbList?: any;
  content?: any;
  action?: any;
}

export default (props: PageHeaderLayoutProps) => {
  const { children, wrapperClassName, top, ...restProps } = props;

  return (
    <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
      {top}
      <PageHeader {...restProps} linkElement={Link} />
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
};
