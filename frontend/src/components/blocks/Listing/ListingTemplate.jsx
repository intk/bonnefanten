import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { ConditionalLink, UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';

import { isInternalURL } from '@plone/volto/helpers/Url/Url';

const Card = ({ item, showDescription = true }) => {
  const image = item?.image_field
    ? `${item['@id']}/${
        item.image_scales[item.image_field]?.[0]?.scales?.teaser?.download
      }`
    : null;
  return (
    <div className="plone-item-card">
      <UniversalLink href={item['@id']} className="plone-item-card-link">
        {image && (
          <figure className="listing-image">
            <img src={image} alt="" role="presentation" />
          </figure>
        )}
        <div className="title-description">
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
        <p className="plone-item-description">
          <span>{item.description}</span>
        </p>
      )}
    </div>
  );
};

const ListingTemplate = (props) => {
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

  return (
    <div className="listing-template">
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

ListingTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ListingTemplate;
