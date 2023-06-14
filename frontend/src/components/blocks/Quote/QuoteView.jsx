import React from 'react';

const QuoteView = ({ data, mode = 'view' }) => {
  const text = data.text;
  const author = data.author;
  const isEditMode = mode === 'edit';

  return (
    <blockquote className="quote-block">
      {text ? (
        <p>{`"${text}"`}</p>
      ) : isEditMode ? (
        <span className="placeholder">Edit quote in the sidebar...</span>
      ) : null}
      {author && <footer>&mdash; {author}</footer>}
    </blockquote>
  );
};
export default QuoteView;
