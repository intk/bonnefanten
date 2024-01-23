import React from 'react';
import PropTypes from 'prop-types';
// import { ListingBlockHeader } from '@package/components';
import { UniversalLink } from '@plone/volto/components';
import SlideshowPreview from '../../theme/SlideshowPreview/SlideshowPreview';
import { BodyClass } from '@plone/volto/helpers';
import ReactSwipe from 'react-swipe';
import './less/HomepageSliderTemplate.less';
import { When } from '@package/customizations/components/theme/View/EventDatesInfo';
import useInView from '@package/helpers/useInView';

const Card = ({ item, showDescription = true }) => {
  const titleInView = useInView(
    '.homepagesliderview',
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    },
    true,
  );
  return (
    <div className="plone-item-card">
      {titleInView ? (
        <BodyClass className="homepage-title-in-view" />
      ) : (
        <BodyClass className="homepage-title-out-of-view" />
      )}
      <UniversalLink href={item['@id']} className="plone-item-card-link">
        <div className="content">
          <SlideshowPreview {...item} />
          <div className="title-wrapper">
            <div className="title-description">
              {/* <h3 className="plone-item-title">
              <p>{item.title}</p>
            </h3> */}
              <div className="slide-description">
                <div className="header-quotes-wrapper">
                  <div className="quote-top-left quote-bonnefanten">“</div>
                  <div className="quote-top-right quote-bonnefanten">”</div>
                </div>
                <div className="slide-title-date">
                  <When
                    start={item.start}
                    end={item.end}
                    whole_day="true"
                    open_end={item.open_end}
                  />
                </div>
                <p className="slide-title">{item.title}</p>
                {/* <span className="documentDescription">
                {item.artwork_author &&
                  item.artwork_author.map((author, index) => (
                    <span key={author}>
                      {author}
                      {index + 1 !== item.artwork_author.length && ', '}
                    </span>
                  ))}
              </span>
              <span className="documentDescription">
                {item.ObjDateFromTxt && ', '}
                {item.ObjDateFromTxt && item.ObjDateFromTxt}
              </span> */}
              </div>
            </div>
          </div>
        </div>
      </UniversalLink>
    </div>
  );
};

const HomepageSliderTemplate = (props) => {
  const { items } = props;
  let reactSwipeEl;

  return (
    <div className="homepage-slider-template">
      <div className="content-wrapper">
        <ReactSwipe
          className="listing-slider"
          swipeOptions={{
            continuous: true,
          }}
          ref={(el) => (reactSwipeEl = el)}
        >
          {items.map((item, i) => (
            <div>
              <Card item={item} showDescription="true" />
            </div>
          ))}
        </ReactSwipe>
        {items.length > 1 && (
          <div className="buttons">
            <button
              className="left-button"
              onClick={() => {
                reactSwipeEl.prev();
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
                  fill=""
                />
              </svg>
            </button>
            {/* <span className="paginator">
          <p>{`${currentIndex + 1}/${props.content?.items_total}`}</p>
        </span>{' '} */}
            <button
              className="right-button"
              onClick={() => {
                reactSwipeEl.next();
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
                  fill=""
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

HomepageSliderTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default HomepageSliderTemplate;
