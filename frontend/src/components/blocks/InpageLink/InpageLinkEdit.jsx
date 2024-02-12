import React from 'react';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';

import InpageLinkBlockSchema from './schema';
import InpageLinkView from './InpageLinkView';

const InpageLinkEdit = (props) => {
  const { block, onChangeBlock, data = {}, selected } = props;
  const schema = InpageLinkBlockSchema(props);

  return (
    <>
      <InpageLinkView {...props} mode="edit" />

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
    </>
  );
};

export default InpageLinkEdit;
