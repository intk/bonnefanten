/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React, { useState, useEffect } from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import FooterColumns from '@package/components/theme/Footer/FooterColumns';
import useInView from '@package/helpers/useInView';
import { BodyClass } from '@plone/volto/helpers';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { useLocation } from 'react-router-dom';

const messages = defineMessages({
  newsletterErrorMessage: {
    id: 'Close menu',
    defaultMessage: 'Aanmelden op nieuwsbrief mislukt.',
  },
  newsletterSuccessMessage: {
    id: 'Open menu',
    defaultMessage:
      'Bedankt voor uw aanmelding. U ontvangt een e-mail waarin uw inschrijving wordt bevestigd.',
  },
  submitButton: {
    id: 'Submit',
    defaultMessage: 'Inschrijven',
  },
  Privacyreglement: {
    id: 'Privacyreglement',
    defaultMessage: 'Privacyreglement',
  },
  Blijf: {
    id: 'Blijf',
    defaultMessage: 'Blijf op de hoogte',
  },
  Mailaddress: {
    id: 'MailAddress',
    defaultMessage: 'Uw mailadres',
  },
});

const MailChimpForm = ({
  status,
  message,
  onValidated,
  emailValue,
  setEmailValue,
}) => {
  let intl = useIntl();
  let email;
  const submit = () =>
    email &&
    email.value.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email.value,
    });

  return (
    <>
      <div id="newsletter-form">
        <div id="formfield-form-widgets-email">
          <input
            id="form-widgets-email"
            ref={(node) => (email = node)}
            type="email"
            placeholder={intl.formatMessage(messages.Mailaddress)}
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
          <br />
        </div>
        <div className="formControls">
          <button id="form-buttons-subscribe" onClick={submit}>
            {intl.formatMessage(messages.submitButton)}
          </button>
        </div>
      </div>
    </>
  );
};

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => {
  const [status, setStatus] = useState(undefined);
  const [emailValue, setEmailValue] = useState('');
  const location = useLocation();

  useEffect(() => {
    setStatus(undefined);
    setEmailValue('');
  }, [location]);

  const mailchimp_url =
    'https://bonnefanten.us15.list-manage.com/subscribe/post-json?u=9e387b9a702e7ed1e33db1e6e&id=306b21f58b';
  const footerInView = useInView(
    'footer#site-footer',
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    },
    true,
  );

  return (
    <footer id="site-footer" role="contentinfo">
      {footerInView && (
        <>
          <BodyClass className="footer-in-view" />
        </>
      )}

      <div id="Newsletter">
        <p className="newsletter-footer-seperator">--</p>
        <h3 className="Header">{intl.formatMessage(messages.Blijf)}</h3>
        <MailchimpSubscribe
          key={location.pathname}
          url={mailchimp_url}
          render={({ subscribe, status, message }) => (
            <>
              {setStatus(status)}
              <MailChimpForm
                status={status}
                message={message}
                emailValue={emailValue}
                setEmailValue={setEmailValue}
                onValidated={(formData) => subscribe(formData)}
              />
            </>
          )}
        />
        <div id="privacy-statement-wrapper">
          <i class="glyphicon link-https"></i>
          <a
            href="https://new.bonnefanten.nl/nl/mensen-organisatie/organisatie/privacy"
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
          >
            {intl.formatMessage(messages.Privacyreglement)}
          </a>
          <div className="message-wrapper">
            <div className="message">
              {status === 'sending' && <div style={{ color: 'blue' }}>...</div>}
              {status === 'error' && (
                <div
                  style={{ color: 'red' }}
                  // dangerouslySetInnerHTML={{ __html: message }}
                >
                  <p> {intl.formatMessage(messages.newsletterErrorMessage)}</p>
                </div>
              )}
              {status === 'success' && (
                <div
                  className="success-msg"
                  style={{ color: 'blue' }}
                  // dangerouslySetInnerHTML={{ __html: message }}
                >
                  <p>
                    {' '}
                    {intl.formatMessage(messages.newsletterSuccessMessage)}
                  </p>{' '}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-content">
        <FooterColumns />
      </div>
    </footer>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
