import React from 'react';
import PropTypes from 'prop-types';
// import { ListingBlockHeader } from '@package/components';
import { UniversalLink } from '@plone/volto/components';
// import ArtworkPreview from '../../theme/ArtworkPreview/ArtworkPreview';
// import { BodyClass } from '@plone/volto/helpers';
import './less/CollectionSliderTemplate.less';
// import { PreviewImage } from '@plone/volto/components/';
import { When } from '@package/customizations/components/theme/View/EventDatesInfo';
import './less/Whatson.less';
import TruncateText from './TruncateText';
import { defineMessages, useIntl } from 'react-intl';
import { ConditionalLink } from '@plone/volto/components';

import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers';

const messages = defineMessages({
  nutezien: {
    id: 'nutezien',
    defaultMessage: 'Nu te zien',
  },
  meerinfo: {
    id: 'meerinfo',
    defaultMessage: 'MEER INFO',
  },
});

const Card = ({ item, showDescription = true }) => {
  const src = item.image_field
    ? flattenToAppURL(`${item['@id']}/@@images/${item.image_field}`)
    : config.getComponent({
        name: 'DefaultImage',
        dependencies: ['listing', 'summary'],
      }).component;

  const intl = useIntl();
  return (
    <div className="plone-item-card">
      <div className="header-quotes-wrapper">
        <div className="quote-top-left quote-bonnefanten">“</div>
        <div className="quote-top-right quote-bonnefanten">”</div>
        <div className="content">
          <div className="card-left-part">
            <UniversalLink href={item['@id']} className="plone-item-card-link">
              <div className="listing-image">
                <a href={src}>
                  <img src={src} alt={item.title ?? 'alt'} />
                </a>
              </div>
            </UniversalLink>
          </div>

          <div className="card-right-part">
            <div className="event-label">
              <When
                start={item.start}
                end={item.end}
                whole_day="true"
                open_end={item.open_end}
              />
            </div>
            <div className="title-description">
              <h3 className="plone-item-title">
                <UniversalLink
                  href={item['@id']}
                  className="plone-item-card-link"
                >
                  <h2>{item.title}</h2>
                </UniversalLink>
              </h3>
              <div className="description">
                <TruncateText text={item.Description} />
                {/* <p>{item.Description}</p> */}
              </div>
              <div className="text-button btn-block more-info">
                <ConditionalLink
                  // to={intl.formatMessage(messages.ticketurl)}
                  to="/nl"
                  condition="view"
                >
                  {/* {intl.formatMessage(messages.tickets)} */}
                  {intl.formatMessage(messages.meerinfo)}
                </ConditionalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WhatsonTemplate = (props) => {
  const { items } = props;
  const intl = useIntl();

  return (
    <div className="whatson-template">
      <div className="nutezien-header">
        <h3>
          <span>{intl.formatMessage(messages.nutezien)}</span> <span>—</span>
        </h3>
      </div>
      <div className="content-wrapper">
        <div className="listing-slider">
          {items.map((item, i) => (
            <div>
              <Card item={item} showDescription="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

WhatsonTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default WhatsonTemplate;
