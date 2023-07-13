import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { ConditionalLink, UniversalLink } from '@plone/volto/components';
import { defineMessages, useIntl } from 'react-intl';
import cx from 'classnames';

const messages = defineMessages({
  subscribe: {
    id: 'Subscribe',
    defaultMessage: 'Subscribe',
  },
  email: {
    id: 'Your email address',
    defaultMessage: 'Your email address',
  },
  privacy: {
    id: 'Privacy statement',
    defaultMessage: 'Privacy statement',
  },
});

const NewsletterView = ({ data, mode = 'view' }) => {
  const intl = useIntl();

  const heading = data?.heading;
  const actionHref = data.actionHref || '#';
  const privacyHref = data.privacyLinkHref?.[0]?.['@id'];
  const privacyTitle = data.privacyLinkTitle;

  const isEditMode = mode === 'edit';

  return (
    <div
      className={cx('block', 'newsletter-block', {
        'full-width': !isEditMode,
      })}
    >
      <div className="block break-block divider">
        <span className="divider">--</span>
      </div>

      <div className="newsletterblock-container">
        {heading && <h2 className="newsletter-heading">{heading}</h2>}
        <form
          method="get"
          action={actionHref}
          target="_blank"
          className="newsletterblock-form"
        >
          <div className="newsletterblock-row">
            <input
              type="email"
              name="EMAIL"
              placeholder={intl.formatMessage(messages.email)}
              disabled={isEditMode}
              className="newsletterblock-input"
              aria-label={intl.formatMessage(messages.email)}
            />
            <button
              type="submit"
              className="text-button btn-block newsletterblock-submit"
              disabled={isEditMode}
            >
              {intl.formatMessage(messages.subscribe)}
            </button>
          </div>
          {privacyHref && (
            <div className="newsletterblock-privacy-statement">
              {isInternalURL(privacyHref) ? (
                <ConditionalLink
                  to={flattenToAppURL(privacyHref)}
                  condition={!isEditMode}
                  className="block newsletterblock-privacylink"
                >
                  {privacyTitle || intl.formatMessage(messages.privacy)}
                </ConditionalLink>
              ) : (
                <UniversalLink
                  href={flattenToAppURL(privacyHref)}
                  className="newsletterblock-privacylink"
                >
                  {privacyTitle || intl.formatMessage(messages.privacy)}
                </UniversalLink>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default NewsletterView;
