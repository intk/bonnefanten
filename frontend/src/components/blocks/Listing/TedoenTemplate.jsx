import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { ConditionalLink, UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import ArtworkPreview from '../../theme/ArtworkPreview/ArtworkPreview';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { When } from './EventDatesInfo';
import './less/TedoenTemplate.less';
import { defineMessages, useIntl } from 'react-intl';
import useInViewHomepage from '@package/helpers/useInViewHomepage';
import { BodyClass } from '@plone/volto/helpers';

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
  tedoen: {
    id: 'tedoen',
    defaultMessage: 'Te Doen',
  },
});

function truncate(str, num) {
  if (str.length <= num) {
    return str;
  }

  const subString = str.substr(0, num);
  return subString.substr(0, subString.lastIndexOf(' ')) + ' ...';
}

const Card = ({ item, showDescription = true }) => {
  // const image = item?.image_field
  //   ? `${item['@id']}/${
  //       item.image_scales[item.image_field]?.[0]?.scales?.teaser?.download
  //     }`
  //   : null;
  const intl = useIntl();

  const hasDailyFrequency = item.recurrence?.includes('FREQ=DAILY');
  const hasWeeklyFrequency = item.recurrence?.includes('FREQ=WEEKLY');
  const hasMonthlyFrequency = item.recurrence?.includes('FREQ=MONTHLY');

  let recurrenceText = '';
  if (hasDailyFrequency) {
    recurrenceText = intl.formatMessage(messages.daily);
  } else if (hasWeeklyFrequency) {
    recurrenceText = intl.formatMessage(messages.weekly);
  } else if (hasMonthlyFrequency) {
    recurrenceText = intl.formatMessage(messages.monthly);
  }

  return (
    <div className="plone-item-card">
      <UniversalLink href={item['@id']} className="plone-item-card-link">
        {/* {image && (
          <figure className="listing-image">
            <img src={image} alt="" role="presentation" />
          </figure>
        )} */}
        <ArtworkPreview {...item} />
        <div
          className={`title-description ${
            item.review_state === 'private' ? 'private' : ''
          }`}
        >
          <div className="event-label">
            {item['@type'] === 'Event' && (
              <div className="listing-dates">
                <div className={`listing-dates-wrapper`}>
                  {item.recurrence !== null ? (
                    recurrenceText?.toUpperCase()
                  ) : (
                    <When
                      start={item.start}
                      end={item.end}
                      whole_day={item.whole_day}
                      open_end={item.open_end}
                    />
                  )}
                </div>
              </div>
            )}
            {item['@type'] === 'News Item' && (
              <div className="listing-dates">
                <div className={`listing-dates-wrapper`}>
                  {' '}
                  <When
                    start={item.effective}
                    whole_day="true"
                    open_end="true"
                  />
                </div>
              </div>
            )}
          </div>
          <h3 className="plone-item-title">
            <span>{item.title}</span>
          </h3>
          <div className="desctiption">
            <span className="item-description">
              {item.artwork_author &&
                item.artwork_author.map((author) => (
                  <span key={author}>{author}, </span>
                ))}
            </span>
            <span className="item-description">
              {item.ObjDateFromTxt && item.ObjDateFromTxt}
            </span>
          </div>
        </div>
      </UniversalLink>
      {!!showDescription && (
        <p
          className={`plone-item-description ${
            item.review_state === 'private' ? 'private' : ''
          }`}
        >
          <span>{truncate(item.description, 159)}</span>
        </p>
      )}
    </div>
  );
};

const TedoenTemplate = (props) => {
  const {
    items,
    linkTitle,
    linkHref,
    showDescription = true,
    isEditMode,
  } = props;

  let link = null;
  let href = linkHref?.[0]?.['@id'] || '';

  if (isInternalURL(href)) {
    link = (
      <ConditionalLink
        to={flattenToAppURL(href)}
        condition={!isEditMode}
        className="text-button btn-block"
      >
        {linkTitle || href}
      </ConditionalLink>
    );
  } else if (href) {
    link = (
      <UniversalLink className="text-button btn-block" href={href}>
        {linkTitle || href}
      </UniversalLink>
    );
  }
  const intl = useIntl();
  const ref = useRef();
  const InView = useInViewHomepage(ref);

  return (
    <div className="listing-template">
      {InView ? (
        <BodyClass className="permanentslide-in-view" />
      ) : (
        <BodyClass className="permanentslide-out-of-view" />
      )}
      <div className="permanent-exhitions-header">
        <h3>
          <span>{intl.formatMessage(messages.tedoen)}</span> <span>—</span>{' '}
        </h3>
      </div>
      <Grid columns={3} className="listings">
        {items.map((item, i) => (
          <Grid.Column
            mobile={12}
            tablet={6}
            computer={4}
            className="listing-column"
            key={i}
          >
            <Card item={item} showDescription={showDescription} />
          </Grid.Column>
        ))}
      </Grid>

      {link && <div className="showmore-link">{link}</div>}
    </div>
  );
};

TedoenTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default TedoenTemplate;
