import React from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
// import { ListingBlockHeader } from '@package/components';
import { UniversalLink } from '@plone/volto/components';
import './less/MasonryTemplate.less';
import ArtworkPreview from '../../theme/ArtworkPreview/ArtworkPreview';

const Masonry = loadable(() => import('react-masonry-css'));

const Card = ({ item, showDescription = true }) => {
  return (
    <div className="plone-item-card">
      <UniversalLink href={item['@id']} className="plone-item-card-link">
        {/* {image && (
          <figure className="listing-image">
            <img src={image} alt="" role="presentation" />
          </figure>
        )} */}
        <ArtworkPreview {...item} />
        <div className="title-description">
          <h3 className="plone-item-title">
            <p>{item.title}</p>
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
          <div>{item.description}</div>
        </p>
      )}
    </div>
  );
};

const breakpointColumnsObj = {
  default: 4,
  1200: 4,
  992: 2,
  768: 1,
};

const MasonryTemplate = (props) => {
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

MasonryTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default MasonryTemplate;
