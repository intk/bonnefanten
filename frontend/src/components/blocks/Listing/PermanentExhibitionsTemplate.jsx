import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
// import { ListingBlockHeader } from '@package/components';
import { UniversalLink } from '@plone/volto/components';
import './less/PermanentExhibitionsTemplate.less';
import ArtworkPreview from '../../theme/ArtworkPreview/ArtworkPreview';
import { defineMessages, useIntl } from 'react-intl';
import useInViewHomepage from '@package/helpers/useInViewHomepage';
import { BodyClass } from '@plone/volto/helpers';

const Masonry = loadable(() => import('react-masonry-css'));

const messages = defineMessages({
  altijd: {
    id: 'altijd',
    defaultMessage: 'Altijd',
  },
});

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
                item.artwork_author.map((author, index) => (
                  <span key={author}>
                    {author}
                    {index + 1 !== item.artwork_author.length && ', '}
                  </span>
                ))}
            </span>
            <span className="item-description">
              {item.ObjDateFromTxt && item.artwork_author.length > 0
                ? ', '
                : ''}
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
      <div className="seperator">––––––––</div>
    </div>
  );
};

const breakpointColumnsObj = {
  default: 3,
  1200: 3,
  992: 2,
  768: 1,
};

const PermanentExhibitionsTemplate = (props) => {
  const { items } = props;
  const intl = useIntl();
  const ref = useRef();
  const InView = useInViewHomepage(ref);

  return (
    <div className="permanent-exhibitons-template">
      {InView ? (
        <BodyClass className="permanentslide-in-view" />
      ) : (
        <BodyClass className="permanentslide-out-of-view" />
      )}
      <div className="permanent-exhitions-header">
        <h3>
          <span>{intl.formatMessage(messages.altijd)}</span> <span>—</span>{' '}
        </h3>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="search-items"
        columnClassName="masonry-multiple-column"
        style={{ display: 'flex' }}
      >
        {items.map((item, i) => (
          <div ref={ref}>
            <Card item={item} showDescription="true" />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

PermanentExhibitionsTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default PermanentExhibitionsTemplate;
