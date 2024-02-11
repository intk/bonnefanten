import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { ConditionalLink, UniversalLink } from '@plone/volto/components';
import cx from 'classnames';

const ButtonView = ({ data, mode = 'view' }) => {
  let href = data.linkHref?.[0]?.['@id'] || '';
  const isEditMode = mode === 'edit';
  const classNames = cx('text-button btn-block', data.btnStyle || 'primary');

  // Check if the URL ends with "/file", indicating a potential PDF link
  const hasDownloadPath = href.includes('/@@download/file');
  // Modify href to replace "/@@download/file" with "/@@display-file/file" if it exists
  const modifiedHref = hasDownloadPath
    ? `${flattenToAppURL(
        href.replace('/@@download/file', '/@@display-file/file'),
      )}`
    : flattenToAppURL(href);

  return isInternalURL(href) ? (
    isEditMode ? (
      <div className={classNames}>{data.linkTitle || href}</div>
    ) : (
      <ConditionalLink
        to={modifiedHref}
        condition={!isEditMode}
        className={classNames}
      >
        {data.linkTitle || href}
      </ConditionalLink>
    )
  ) : href ? (
    // Ensure external links and modified document links open in a new tab
    <UniversalLink href={modifiedHref} className={classNames} target="_blank">
      {data.linkTitle || href}
    </UniversalLink>
  ) : isEditMode ? (
    'Button block'
  ) : null;
};
export default ButtonView;
