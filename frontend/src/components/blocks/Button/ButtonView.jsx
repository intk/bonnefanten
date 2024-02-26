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
        target={data?.target}
      >
        {data.linkTitle || href}
      </ConditionalLink>
    )
  ) : href ? (
    <UniversalLink
      href={modifiedHref}
      className={classNames}
      target={data?.target}
    >
      {data.linkTitle || href}
    </UniversalLink>
  ) : isEditMode ? (
    'Button block'
  ) : null;
};
export default ButtonView;
