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
  const classNames = cx('text-button btn-block', data.btnStyle || 'primary');
  const [targetUrl, setTargetUrl] = useState();

  useEffect(() => {
    setTargetUrl(window.location.href);
  }, []);

  return (
    <div className="event-page-button-block">
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
                viewBox="0 0 56 44.9997"
              >
                <path
                  d="M17.61,45c21.1342,0,32.69-17.3107,32.69-32.3188,0-.4988-.0065-.981-.0364-1.4657A23.3929,23.3929,0,0,0,56,5.3267,23.2677,23.2677,0,0,1,49.4047,7.119a11.4378,11.4378,0,0,0,5.0479-6.29,23.1875,23.1875,0,0,1-7.2961,2.7642,11.518,11.518,0,0,0-19.8756,7.7657A11.3794,11.3794,0,0,0,27.58,13.95,32.7246,32.7246,0,0,1,3.9,2.079a11.2047,11.2047,0,0,0-1.56,5.7085,11.32,11.32,0,0,0,5.1168,9.46A11.5328,11.5328,0,0,1,2.25,15.8271v.1478A11.4063,11.4063,0,0,0,11.4663,27.113a11.8639,11.8639,0,0,1-3.03.4,11.5093,11.5093,0,0,1-2.1611-.2108,11.4906,11.4906,0,0,0,10.73,7.8891A23.1451,23.1451,0,0,1,2.745,40.0536,22.6788,22.6788,0,0,1,0,39.8955,32.7811,32.7811,0,0,0,17.61,45"
                  // fill="#575756"
                ></path>
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
