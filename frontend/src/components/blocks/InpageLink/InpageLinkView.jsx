import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store state
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import cx from 'classnames';

const InpageLinkView = ({ data, mode = 'view' }) => {
  const history = useHistory();
  const isAuthenticated = useSelector((state) => !!state.userSession.token); // Check if user is logged in
  let href = data.linkHref?.[0]?.['@id'] || '';
  const isEditMode = mode === 'edit';
  const classNames = cx('inpage-link');

  useEffect(() => {
    // Do not redirect if user is logged in
    if (isAuthenticated) {
      return;
    }

    // Automatically navigate if in view mode and user is not logged in
    if (!isEditMode) {
      if (isInternalURL(href)) {
        // For internal URLs, use React Router for smooth navigation
        const internalHref = flattenToAppURL(href);
        history.push(internalHref);
      } else if (href) {
        // For external URLs, open in the same tab or a new tab based on your preference
        window.open(href, '_self');
      }
    }
    // This effect will only re-run if `href`, `history`, `isEditMode`, or `isAuthenticated` changes
  }, [href, history, isEditMode, isAuthenticated]);

  const headingStyle = {
    paddingLeft: '135px',
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginRight: '-50vw',
    marginLeft: '-50vw',
  };

  return (
    <div className={classNames}>
      <h4 style={headingStyle}>Het link adres is: {href}</h4>
    </div>
  );
};

export default InpageLinkView;
