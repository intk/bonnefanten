import React, { useState } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
// import { ListingBlockHeader } from '@package/components';
import { UniversalLink } from '@plone/volto/components';
import './less/MakerTemplate.less';
import { BodyClass } from '@plone/volto/helpers';
import AuthorPreviewImage from './AuthorPreviewImage';
import { defineMessages, useIntl } from 'react-intl';

const Masonry = loadable(() => import('react-masonry-css'));

const messages = defineMessages({
  work: {
    id: 'work',
    defaultMessage: 'werk',
  },
});

const Card = ({ item, showDescription = true }) => {
  const authorName = item.title;
  const [artworkCounts, setArtworkCounts] = useState({});
  const [firstItem, setFirstItem] = useState(undefined);
  const updateArtworkCount = (authorName, count, firstItem) => {
    setArtworkCounts((prevCounts) => ({ ...prevCounts, [authorName]: count }));
    setFirstItem(firstItem);
  };
  const intl = useIntl();

  return (
    <div className="plone-item-card">
      <BodyClass className="maker-page-listing" />
      <UniversalLink href={item['@id']} className="plone-item-card-link">
        <AuthorPreviewImage
          authorName={authorName}
          item={item}
          onUpdateArtworkCount={updateArtworkCount}
        />
        {firstItem ? (
          <div className="title-description">
            {/* <h3 className="plone-item-title">
            <p>{item.title}</p>
          </h3> */}
            <p>
              {firstItem && artworkCounts[authorName]
                ? `${artworkCounts[authorName]} ${intl.formatMessage(
                    messages.work,
                  )}`
                : ''}
            </p>
            <div className="desctiption"></div>
          </div>
        ) : (
          ''
        )}
      </UniversalLink>
    </div>
  );
};

const breakpointColumnsObj = {
  default: 3,
  1200: 3,
  992: 2,
  768: 1,
};

const MakerPageTemplate = (props) => {
  const { items } = props;

  return (
    <div className="masonary-template">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="search-items"
        columnClassName="masonry-multiple-column"
        style={{ display: 'flex' }}
      >
        {items.map((item, i) => (
          <div>
            <Card item={item} showDescription="true" />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

MakerPageTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default MakerPageTemplate;
