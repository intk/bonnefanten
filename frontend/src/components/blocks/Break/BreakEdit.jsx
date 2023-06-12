/**
 * Edit Break block.
 */

import React from 'react';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import ButtonBlockSchema from './schema';

import cx from 'classnames';

/**
 * Edit Break block class.
 */
const Edit = (props) => {
  const { block, onChangeBlock, data = {}, selected } = props;
  const schema = ButtonBlockSchema(props);

  return (
    <div className={cx('block break-block')}>
      <p>- Break ({data.style || 'Clear'}) -</p>

      <SidebarPortal selected={selected}>
        <BlockDataForm
          key={Object.keys(data?.cards || {}).length}
          schema={schema}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </div>
  );
};

export default Edit;
