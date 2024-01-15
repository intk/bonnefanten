import React from 'react';
import EventPageButtonView from './EventPageButtonView';
import EventPageButtonSchema from './schema';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';

const EventPageButtonEdit = (props) => {
  const { block, onChangeBlock, data = {}, selected } = props;
  const schema = EventPageButtonSchema(props);
  return (
    <>
      <EventPageButtonView {...props} mode="view" />
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

export default EventPageButtonEdit;
