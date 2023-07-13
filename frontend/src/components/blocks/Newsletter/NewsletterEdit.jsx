import React from 'react';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';

import NewsletterBlockSchema from './schema';
import NewsletterViewView from './NewsletterView';

const NewsletterEdit = (props) => {
  const { block, onChangeBlock, data = {}, selected } = props;
  const schema = NewsletterBlockSchema(props);

  return (
    <>
      <NewsletterViewView {...props} mode="edit" />

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

export default NewsletterEdit;
