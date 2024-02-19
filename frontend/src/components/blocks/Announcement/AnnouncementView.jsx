import React from 'react';
import './less/Announcement.less';

const ButtonView = ({ data, mode = 'view' }) => {
  return (
    <div className="AnnouncementBlock">
      <div className="message">
        {data.Title && <h3>{data.Title}</h3>}
        {data.Text && <p>{data.Text}</p>}
      </div>
    </div>
  );
};
export default ButtonView;
