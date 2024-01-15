import React from 'react';
import SlateEditor from '@plone/volto-slate/editor/SlateEditor';

const DiscreetView = ({ data, mode = 'view' }) => {
  const text = data.text;
  // const isEditMode = mode === 'edit';

  return (
    <div className="Discreet-text-block">
      <SlateEditor
        id="discreet-text"
        className="discreet-text"
        name="discreet-text"
        value={text}
      />
    </div>
  );
};
export default DiscreetView;
