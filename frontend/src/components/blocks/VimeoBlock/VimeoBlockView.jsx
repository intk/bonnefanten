import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import './css/vimeoblock.less';
import { BodyClass } from '@plone/volto/helpers';
// import { Link } from 'react-router-dom';
import { UniversalLink } from '@plone/volto/components';
import { When } from '@package/customizations/components/theme/View/EventDatesInfo';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  daily: {
    id: 'daily',
    defaultMessage: 'dagelijks',
  },
  weekly: {
    id: 'weekly',
    defaultMessage: 'wekelijks',
  },
  monthly: {
    id: 'monthly',
    defaultMessage: 'maandelijks',
  },
});

const VimeoBlockView = (props) => {
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    if (props.data.VideoLink) {
      const linkWithParams = `${props.data.VideoLink}?dnt=1&loop=1&background=1`;
      setVideoLink(linkWithParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let intl = useIntl();
  let recurrenceText = '';
  const hasDailyFrequency = props.content?.recurrence?.includes('FREQ=DAILY');
  const hasWeeklyFrequency = props.content?.recurrence?.includes('FREQ=WEEKLY');
  const hasMonthlyFrequency = props.content?.recurrence?.includes(
    'FREQ=MONTHLY',
  );

  if (hasDailyFrequency) {
    recurrenceText = intl.formatMessage(messages.daily);
  } else if (hasWeeklyFrequency) {
    recurrenceText = intl.formatMessage(messages.weekly);
  } else if (hasMonthlyFrequency) {
    recurrenceText = intl.formatMessage(messages.monthly);
  }

  return (
    <div id="vimeo-block">
      <BodyClass className="has-image-card-block" />
      <div className="video-wrapper">
        <div className="first-frame" style={{ width: '100%' }}>
          <img
            style={{ width: '100%' }}
            src={`${props.data.FirstFrame?.[0]?.['@id']}/${props?.data?.FirstFrame?.[0]?.image_scales?.image?.[0].download}`}
            alt=""
          ></img>
        </div>
        <iframe
          frameborder="0"
          webkitAllowFullScreen
          mozallowfullscreen
          allowfullscreen
          allow="autoplay; fullscreen;"
          data-ready="true"
          src={videoLink}
          title="video"
        ></iframe>
        <div
          className="shadow"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(46, 46, 46, 0) 0%, #242424 200%)',
            zIndex: 2,
            height: '100%',
            width: '100vw',
            position: 'absolute',
          }}
        ></div>

        {/* <div className="slider-caption">
          <div className="slide-body">
            <div className="description-wrapper">
              <div className="header-quotes-wrapper">
                <div className="quote-top-left quote-bonnefanten">“</div>
                <div className="quote-top-right quote-bonnefanten">”</div>
              </div>
              <div className="hero-dates-wrapper">
                {props?.content && props?.content['@type'] === 'Event' ? (
                  <div className="hero-dates">
                    {props.content.recurrence !== null ? (
                      recurrenceText?.toUpperCase()
                    ) : (
                      <When
                        start={props?.content.start}
                        end={props?.content.end}
                        whole_day={props?.content.whole_day}
                        open_end={props?.content.open_end}
                      />
                    )}
                  </div>
                ) : props?.content &&
                  props?.content['@type'] === 'News Item' &&
                  props?.content.effective ? (
                  <When
                    start={props?.content.effective}
                    end={props?.content.end}
                    whole_day="true"
                    open_end="true"
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="slide-title">{props.properties.title}</div>
            </div>
          </div>
        </div> */}
        {
          <div className="slider-caption">
            <div className="slide-body">
              <div className="description-wrapper">
                <div className="header-quotes-wrapper">
                  <div className="quote-top-left quote-bonnefanten">“</div>
                  <div className="quote-top-right quote-bonnefanten">”</div>
                </div>
                <div className="hero-dates-wrapper">
                  {props?.content && props?.content['@type'] === 'Event' ? (
                    <div className="hero-dates">
                      {props.content.recurrence !== null ? (
                        recurrenceText?.toUpperCase()
                      ) : (
                        <When
                          start={props?.content.start}
                          end={props?.content.end}
                          whole_day={props?.content.whole_day}
                          open_end={props?.content.open_end}
                        />
                      )}
                    </div>
                  ) : props?.content &&
                    props?.content['@type'] === 'News Item' &&
                    props?.content.effective ? (
                    <When
                      start={props?.content.effective}
                      end={props?.content.end}
                      whole_day="true"
                      open_end="true"
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className="slide-title">{props.properties.title}</div>
              </div>
            </div>
          </div>
        }
      </div>
      {/* <div className="vimeo-buttons">
        <ul className="arrow-lists">
          {props.data.button1 && (
            <li>
              <UniversalLink className="link" href={props.data.button1link}>
                {props.data.button1}
              </UniversalLink>
            </li>
          )}
          {props.data.button2 && (
            <li>
              <UniversalLink className="link" href={props.data.button2link}>
                {props.data.button2}
              </UniversalLink>
            </li>
          )}
          {props.data.button3 && (
            <li>
              <UniversalLink className="link" href={props.data.button3link}>
                {props.data.button3}
              </UniversalLink>
            </li>
          )}
        </ul>
      </div> */}
    </div>
  );
};

export default injectIntl(VimeoBlockView);
