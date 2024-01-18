import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Image } from 'semantic-ui-react';
import { PreviewImage } from '@plone/volto/components';
import { ArtworkPreview } from '@package/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './image-album.less';
import loadable from '@loadable/component';

const Slider = loadable(() => import('react-slick'));
const MAX_THUMBS = 1;

const getContent = (url, subrequest) => {
  const query = { b_size: 1000000 };
  let qs = Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&');
  return {
    type: GET_CONTENT,
    subrequest,
    request: {
      op: 'get',
      path: `${url}${qs ? `?${qs}` : ''}`,
    },
  };
};

const ImageAlbum = (props) => {
  const pathname = useSelector((state) => state.router.location.pathname);
  const slideshowPath = `${pathname}/slideshow`; // Adjusted to fetch from /slideshow
  const id = `full-items@${slideshowPath}`;
  const dispatch = useDispatch();

  const [albumItems, setAlbumItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const action = getContent(slideshowPath, id);
    dispatch(action).then((content) => {
      setAlbumItems(content.items || []);
    });
  }, [dispatch, id, slideshowPath]);

  const thumbsToShow = albumItems.slice(1, MAX_THUMBS);
  const moreImagesLength =
    albumItems.length > MAX_THUMBS ? albumItems.length - MAX_THUMBS : null;

  const carouselSettings = {
    afterChange: (current) => setActiveSlideIndex(current),
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    adaptiveHeight: true,
    autoplay: false,
    fade: false,
    useTransform: false,
    lazyLoad: 'ondemand',
    initialSlide: activeSlideIndex,
  };

  const handleClick = () => {
    if (albumItems.length) {
      setActiveSlideIndex(0);
      setOpen(true);
    }
  };

  return (
    <div className="image-album">
      <div
        tabIndex={0}
        role="button"
        onKeyDown={handleClick}
        onClick={handleClick}
        className="preview-image-wrapper"
      >
        <button className={`text-button btn-block primary`}>PREVIEW</button>
      </div>

      {thumbsToShow.length > 0 && (
        <div className="thumbnails">
          {thumbsToShow.map((thumb, i) => (
            <div
              key={i}
              tabIndex={0}
              role="button"
              onKeyDown={() => {
                setActiveSlideIndex(i + 1);
                setOpen(true);
              }}
              onClick={() => {
                setActiveSlideIndex(i + 1);
                setOpen(true);
              }}
            >
              <PreviewImage
                key={i}
                item={thumb}
                size="mini"
                className="img-thumb"
              />
            </div>
          ))}
          {moreImagesLength && (
            <div className="images-number">
              <div>+{moreImagesLength}</div>
            </div>
          )}
        </div>
      )}

      <Modal
        closeIcon
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        className="slider-modal"
      >
        <Modal.Content>
          <Slider {...carouselSettings} ref={sliderRef}>
            {albumItems.map((item, i) => (
              <Image
                key={i}
                src={
                  item
                    ? flattenToAppURL(
                        `${item?.['@id']}/@@images/${
                          item?.image_field || 'image'
                        }/great`,
                      )
                    : ''
                }
                alt={item?.title}
                className="modal-slide-img"
              />
            ))}
          </Slider>
          <div className="slide-image-count">
            {activeSlideIndex + 1} of {albumItems.length}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default ImageAlbum;
