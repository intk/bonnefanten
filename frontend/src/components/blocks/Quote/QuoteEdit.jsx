import React from 'react';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';

import QuoteBlockSchema from './schema';
import QuoteView from './QuoteView';

const QuoteEdit = (props) => {
  const { block, onChangeBlock, data = {}, selected } = props;
  const schema = QuoteBlockSchema(props);

  return (
    <>
      <QuoteView {...props} mode="edit" />

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

export default QuoteEdit;
