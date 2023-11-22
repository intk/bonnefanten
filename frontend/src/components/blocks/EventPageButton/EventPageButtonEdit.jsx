import React from 'react';
import EventPageButtonView from './EventPageButtonView';

const EventPageButtonEdit = (props) => {
  return (
    <>
      <EventPageButtonView {...props} mode="view" />
    </>
  );
};

export default EventPageButtonEdit;
