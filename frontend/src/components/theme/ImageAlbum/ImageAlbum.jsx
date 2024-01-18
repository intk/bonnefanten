import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Image } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './image-album.less';
import loadable from '@loadable/component';
import { debounce } from 'lodash'; // Import debounce from lodash

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetIndex = useCallback(
    debounce((newIndex) => {
      setActiveSlideIndex(newIndex);
    }, 100),
    [],
  );

  // Custom method to change slide
  const changeSlide = useCallback(
    (newIndex) => {
      debouncedSetIndex(newIndex); // Use debounced method to set index
      sliderRef.current.slickGoTo(newIndex); // Change the slide
    },
    [debouncedSetIndex],
  );

  const CustomCloseIcon = ({ onClick }) => {
    const handleKeyDown = (event) => {
      // Trigger click on Enter or Space key press
      if (event.key === 'Enter' || event.key === ' ') {
        onClick();
      }
    };

    return (
      <div
        className="icon close"
        role="button"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onClick={onClick}
        // style={{ display: 'block', cursor: 'pointer' }}
        aria-label="Close"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 85 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M85,12.5v-5L77.5,0h-5L42.5046,30,12.5,0h-5L0,7.51v4.9981L30,42.5,0,72.5v4.9907L7.75,85h4.7571L42.5046,55,72.5,85h5L85,77.4526V72.5l-30-30ZM47.1028,45.473A5.5819,5.5819,0,0,1,45.51,47.0894a5.4907,5.4907,0,0,1-8.39-5.6332,5.5,5.5,0,0,1,1.5168-2.8351,5.4764,5.4764,0,0,1,8.466,6.8519Z"
            fill="#216d6a"
          />
        </svg>
      </div>
    );
  };

  const CustomExpandButton = (props) => {
    const { className, onClick } = props;

    // Function to handle key down events
    const handleKeyDown = (event) => {
      // Trigger click on Enter or Space key press
      if (event.key === 'ArrowLeft' || event.key === ' ') {
        onClick();
      }
    };

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          cursor: 'pointer',
          top: '10px',
          right: '12px',
        }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex="0" // Make the div focusable
        role="button" // Indicate that the div is a button
        aria-label="Previous Slide" // Accessibility label for screen readers
      >
        <svg
          id="expand-svg"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 85 85"
        >
          <path
            d="M50.2548,48.3175l3.1236-3.1165,7.5786,7.56,3.1236,3.1156v.0009l-3.124,3.1165h0l-5.0458,5.034v-.0009l-.0005.0009L45.2085,53.3514l3.1236-3.1165,7.5782,7.56,1.9222-1.9175ZM38.591,36.6825,48.3317,46.4l3.1241-3.1165-9.7412-9.7174ZM85,77.283l-.159.155.0212.0212L77.4514,85H43.4729l-7.568-7.5408L43.4729,70H70V43.426l7.432-7.5408L85,43.426ZM70,73.2175H44.813l-3.4685,3.5352H70Zm6.7676-31.9119-3.5352,3.4559V70h3.5352ZM46.41,48.3175,36.6683,38.6l-3.1241,3.1165,9.7412,9.7174ZM41.7245,15H15V41.3775L7.5685,48.9183,0,41.3775V7.5214L7.5685.1374,7.59.1586,7.7455,0h33.979l7.568,7.5408ZM11.7676,15H8.2324V43.4989l3.5352-3.4569Zm28.6163-3.2166,3.469-3.5352H15v3.5343ZM27.1675,29.1224,29.09,27.2049l7.5786,7.5592,3.1241-3.1164-7.5786-7.5593h0L29.09,20.9719l-5.0468,5.034h0l-.864.8614-2.26,2.2551h0L31.6221,39.7981l3.1236-3.1165Z"
            fill="#216d6a"
          ></path>
        </svg>
      </div>
    );
  };
  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;

    // Function to handle key down events
    const handleKeyDown = (event) => {
      // Trigger click on Enter or Space key press
      if (event.key === 'ArrowLeft' || event.key === ' ') {
        onClick();
      }
    };

    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex="0" // Make the div focusable
        role="button" // Indicate that the div is a button
        aria-label="Previous Slide" // Accessibility label for screen readers
      >
        <svg
          width="25"
          height="42"
          viewBox="0 0 50 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,34.7584,0,42.5l0,7.7417L34.59,85H50V69.5158L23.1147,42.5,50,15.4843V0H34.59ZM36.5976,80.2423,6.6616,50.1609l.43-.0046,6.8586.071L43.74,80.1616Zm8.6675-8.71-.08,7.1768L16.1323,49.5163l3.6114-3.6288Zm0-58.0655L19.7437,39.1126l-3.6114-3.6288L45.1847,6.2905ZM43.74,4.8385,13.95,34.7728l-6.8586.071-.43-.0047L36.5976,4.7578Z"
            fill="#216d6a"
          ></path>
        </svg>
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;

    // Function to handle key down events
    const handleKeyDown = (event) => {
      // Trigger click on Enter or Space key press
      if (event.key === 'ArrowRight' || event.key === ' ') {
        onClick();
      }
    };

    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex="0" // Make the div focusable
        role="button" // Indicate that the div is a button
        aria-label="Previous Slide" // Accessibility label for screen readers
      >
        <svg
          width="25"
          height="42"
          viewBox="0 0 50 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50,50.2417,50,42.5l0-7.7417L15.41,0H0V15.4842L26.8853,42.5,0,69.5158V85H15.41ZM13.4024,4.7577l29.936,30.0814-.43.0046-6.8587-.071L6.26,4.8385Zm-8.6675,8.71.08-7.1769L33.8677,35.4837l-3.6114,3.6288Zm0,58.0654L30.2563,45.8875l3.6114,3.6288L4.8152,78.71ZM6.26,80.1615,36.05,50.2273l6.8587-.071.43.0046L13.4024,80.2423Z"
            fill="#216d6a"
          />
        </svg>
      </div>
    );
  };

  const thumbsToShow = albumItems.slice(1, MAX_THUMBS);
  const moreImagesLength =
    albumItems.length > MAX_THUMBS ? albumItems.length - MAX_THUMBS : null;

  const carouselSettings = {
    // afterChange: (current) => setActiveSlideIndex(current),
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    // arrows: true,
    adaptiveHeight: true,
    autoplay: false,
    fade: false,
    useTransform: false,
    lazyLoad: 'ondemand',
    initialSlide: activeSlideIndex,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
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
        {props.image === 'false' ? (
          <button className={`text-button btn-block primary`}>PREVIEW</button>
        ) : (
          <div className="imagethumb" style={{ position: 'relative' }}>
            <Image
              key="prev-image"
              src={
                albumItems[0]
                  ? flattenToAppURL(
                      `${albumItems[0]?.['@id']}/@@images/${
                        albumItems[0]?.image_field || 'image'
                      }/great`,
                    )
                  : ''
              }
              alt={albumItems[0]?.title}
              className="modal-slide-img"
            />
            <CustomExpandButton
              onClick={() => setOpen(true)}
              className="expandbutton"
            />
          </div>
        )}
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
              <Image
                key={i}
                src={
                  albumItems[0]
                    ? flattenToAppURL(
                        `${albumItems[0]?.['@id']}/@@images/${
                          albumItems[0]?.image_field || 'image'
                        }/great`,
                      )
                    : ''
                }
                alt={albumItems[0]?.title}
                className="modal-slide-img"
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
        closeIcon={<CustomCloseIcon onClick={() => setOpen(false)} />}
        // closeIcon
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        className="slider-modal"
      >
        <Modal.Content>
          <Slider
            {...carouselSettings}
            ref={sliderRef}
            beforeChange={(current, next) => changeSlide(next)}
          >
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
            {activeSlideIndex + 1}/{albumItems.length}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default ImageAlbum;
