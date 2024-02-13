import React from 'react';
import loadable from '@loadable/component';
import { Message } from 'semantic-ui-react';
import { BodyClass } from '@plone/volto/helpers';
import { getScaleUrl, getPath } from '../utils';
import { CommonCarouselschemaExtender } from '../CommonAssets/schema';
import cx from 'classnames';
import { When } from '@package/customizations/components/theme/View/EventDatesInfo';
import { defineMessages, useIntl } from 'react-intl';
import 'slick-carousel/slick/slick.css';
import '../css/carousel.less';

const Slider = loadable(() => import('react-slick'));

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

const Arrows = (props) => {
  const { slider = {} } = props;

  return (
    <div className="slider-arrow">
      <div className="ui container">
        <button
          className="left-arrow"
          aria-label="Prev Slide"
          onClick={() => {
            if (slider.current) {
              slider.current.slickPrev();
            }
          }}
        >
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            // width="50"
            // height="85"
            viewBox="0 0 50 85"
          >
            <path
              d="M0,34.7584,0,42.5l0,7.7417L34.59,85H50V69.5158L23.1147,42.5,50,15.4843V0H34.59ZM36.5976,80.2423,6.6616,50.1609l.43-.0046,6.8586.071L43.74,80.1616Zm8.6675-8.71-.08,7.1768L16.1323,49.5163l3.6114-3.6288Zm0-58.0655L19.7437,39.1126l-3.6114-3.6288L45.1847,6.2905ZM43.74,4.8385,13.95,34.7728l-6.8586.071-.43-.0047L36.5976,4.7578Z"
              fill="var(--bonnefanten-primary)"
            />
          </svg>
        </button>

        <button
          className="right-arrow"
          aria-label="Prev Slide"
          onClick={() => {
            if (slider.current) {
              slider.current.slickNext();
            }
          }}
        >
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            // width="50"
            // height="85"
            viewBox="0 0 50 85"
          >
            <title>Bonnefanten_Website_Assets</title>
            <path
              d="M50,50.2417,50,42.5l0-7.7417L15.41,0H0V15.4842L26.8853,42.5,0,69.5158V85H15.41ZM13.4024,4.7577l29.936,30.0814-.43.0046-6.8587-.071L6.26,4.8385Zm-8.6675,8.71.08-7.1769L33.8677,35.4837l-3.6114,3.6288Zm0,58.0654L30.2563,45.8875l3.6114,3.6288L4.8152,78.71ZM6.26,80.1615,36.05,50.2273l6.8587-.071.43.0046L13.4024,80.2423Z"
              fill="var(--bonnefanten-primary)"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Carousel = (props) => {
  const { data, editable } = props;
  const {
    cards,
    image_scale,
    height = '600',
    fade = true,
    infinite = true,
    autoplay = true,
    hideArrows = false,
    pauseOnHover = true,
    autoplaySpeed = 10000,
    hideNavigationDots = true,
  } = data;
  const slider = React.useRef(null);

  var settings = {
    fade: fade,
    infinite: infinite,
    autoplay: autoplay && !editable,
    pauseOnHover: pauseOnHover,
    autoplaySpeed: parseInt(autoplaySpeed),
    dots: !hideNavigationDots,
    slidesToShow: 1,
    arrows: false, // we use custom arrows
    slidesToScroll: 1,
    lazyLoad: 'ondemand',
  };

  let intl = useIntl();
  let recurrenceText = '';

  return cards && cards.length > 0 ? (
    <div
      className={cx(
        'block align imagecards-block carousel',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      {cards.length > 0 ? <BodyClass className="has-image-card-block" /> : ''}
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <div className="slider-wrapper" style={{ height: `${height}px` }}>
          <Slider {...settings} ref={slider}>
            {(cards || []).map((card, index) => {
              const hasDailyFrequency = props.content?.recurrence?.includes(
                'FREQ=DAILY',
              );
              const hasWeeklyFrequency = props.content?.recurrence?.includes(
                'FREQ=WEEKLY',
              );
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
                <div className="slider-slide" key={index}>
                  <div
                    className="slide-img"
                    style={
                      card.attachedimage
                        ? {
                            backgroundImage: `url(${getScaleUrl(
                              getPath(card.attachedimage),
                              image_scale || 'huge',
                            )})`,
                            height: `${height}px`,
                          }
                        : {}
                    }
                  />
                  <div className="slide-overlay"></div>
                  {
                    <div className="slider-caption">
                      <div className="slide-body">
                        <div className="description-wrapper">
                          <div className="header-quotes-wrapper">
                            <div className="quote-top-left quote-bonnefanten">
                              “
                            </div>
                            <div className="quote-top-right quote-bonnefanten">
                              ”
                            </div>
                          </div>
                          <div className="hero-dates-wrapper">
                            {props?.content &&
                            props?.content['@type'] === 'Event' ? (
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
                              props?.content['@type'] === 'News Item' ? (
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
                          <div className="slide-title">
                            {card.title || props.properties.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              );
            })}
          </Slider>
          {!hideArrows && cards.length > 1 && <Arrows slider={slider} />}
        </div>
      </div>
    </div>
  ) : (
    <>{editable ? <Message>No image cards</Message> : ''}</>
  );
};

export default Carousel;

Carousel.schemaExtender = (schema, data, intl) => {
  const Common = CommonCarouselschemaExtender({ data, schema, intl });

  return {
    ...schema,
    ...Common,
    properties: {
      ...schema.properties,
      ...Common.properties,
    },
    fieldsets: [...schema.fieldsets, ...Common.fieldsets],
  };
};
