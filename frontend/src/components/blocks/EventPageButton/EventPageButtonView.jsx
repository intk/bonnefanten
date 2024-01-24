import React from 'react';
// import { flattenToAppURL } from '@plone/volto/helpers';
// import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { ConditionalLink } from '@plone/volto/components';
import cx from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import { useState, useEffect } from 'react';

const messages = defineMessages({
  tickets: {
    id: 'tickets',
    defaultMessage: 'TICKETS',
  },
  pracktischeinfo: {
    id: 'pracktischeinfo',
    defaultMessage: 'PRAKTISCHE INFO',
  },
  ticketurl: {
    id: 'ticketurl',
    defaultMessage: '/nl/tickets',
  },
  pracktischeinfourl: {
    id: 'pracktischeinfourl',
    defaultMessage: '/nl/zien-en-doen/praktische-informatie',
  },
});

const EventPageButtonView = ({ data, mode = 'view' }) => {
  let intl = useIntl();
  const classNames = cx('text-button btn-block', 'primary');
  const [targetUrl, setTargetUrl] = useState();

  useEffect(() => {
    setTargetUrl(window.location.href);
  }, []);

  return (
    <div className={`event-page-button-block ${data?.btnStyle}`}>
      <div className="event-links">
        <ConditionalLink
          to={intl.formatMessage(messages.ticketurl)}
          condition="view"
          className={classNames}
        >
          {intl.formatMessage(messages.tickets)}
        </ConditionalLink>
        <ConditionalLink
          to={intl.formatMessage(messages.pracktischeinfourl)}
          condition="isEditMode"
          className={classNames}
        >
          {intl.formatMessage(messages.pracktischeinfo)}
        </ConditionalLink>
      </div>
      <div className="social-buttons">
        <div className="social-button facebook">
          <i className="glyphicon link-https"></i>
          <a
            className="popup"
            href={`https://www.facebook.com/sharer/sharer.php?u=${targetUrl}`}
          >
            <span className="rrssb-icon">
              <svg
                id="rrssb-facebook-svg"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                width="45.0001"
                height="45"
                viewBox="0 0 45.0001 45"
              >
                <path
                  d="M31.0489,45V27.5735h5.8536l.873-6.7914H31.0489V16.4457c0-1.9638.545-3.31,3.3692-3.31H38.01V7.0642A47.5987,47.5987,0,0,0,32.7714,6.8c-5.1853,0-8.7363,3.16-8.7363,8.9721v5.01H18.17v6.7914h5.8653V45H2.4814A2.4871,2.4871,0,0,1,0,42.5086V2.4783A2.48,2.48,0,0,1,2.4814,0H42.51A2.4819,2.4819,0,0,1,45,2.4783v40.03A2.4889,2.4889,0,0,1,42.51,45Z"
                  // fill="#575756"
                ></path>
              </svg>
            </span>
            {/* <span className="rrssb-text">facebook</span> */}
          </a>
        </div>
        <div className="social-button twitter">
          <i className="glyphicon link-https"></i>
          <a
            className="popup"
            href={`https://twitter.com/intent/tweet?text=&url=${targetUrl}`}
          >
            <span className="rrssb-icon">
              <svg
                id="twitter-rrssb-svg"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                width="56"
                height="44.9997"
                viewBox="0 0 1200 1277"
              >
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
              </svg>
            </span>
            {/* <span className="rrssb-text">twitter</span> */}
          </a>
        </div>
        <div className="social-button email">
          <i className="glyphicon link-mailto"></i>
          <a href={`mailto:?subject=${targetUrl}&body=${targetUrl}`}>
            <span className="rrssb-icon">
              <svg
                id="email-rrssb-svg"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="45"
                viewBox="0 0 60 45"
              >
                <path
                  d="M0,0V45H60V0ZM32.2923,24.975a3.2424,3.2424,0,0,1-4.5915,0L6.8943,4.0394H53.1057ZM20.0154,22.9887,4.0546,39.0375V6.9293ZM21.8978,24.88l2.9211,2.932a7.3182,7.3182,0,0,0,10.366,0l2.9315-2.9461L54.0876,40.957H5.916Zm18.1011-1.9055L55.9454,6.9293V39.0269Z"
                  // fill="#575756"
                ></path>
              </svg>
            </span>
            {/* <span className="rrssb-text">email</span> */}
          </a>
        </div>
      </div>
    </div>
  );
};
export default EventPageButtonView;
