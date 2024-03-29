import React from 'react';
import { Message } from 'semantic-ui-react';
import Slider from 'react-slick';
import cx from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import Body from './Body';
import { withBlockExtensions } from '@plone/volto/helpers';
import teaserTemplate from '@kitconcept/volto-slider-block/icons/teaser-template.svg';
import {
  SlidesWidthFix,
  useNodeDimensions,
} from '@kitconcept/volto-slider-block/helpers';
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';
import config from '@plone/volto/registry';

const messages = defineMessages({
  PleaseChooseContent: {
    id: 'Please choose an existing content as source for this element',
    defaultMessage:
      'Please choose an existing content as source for this element',
  },
});

const PrevArrow = ({ className, style, onClick }) => (
  <button
    className={className}
    style={{ ...style, display: 'block' }}
    onClick={onClick}
  >
    <LeftArrow width="48" />
  </button>
);

const NextArrow = ({ className, style, onClick }) => (
  <button
    className={className}
    style={{ ...style, display: 'block' }}
    onClick={onClick}
  >
    <RightArrow width="48" />
  </button>
);

const SliderView = (props) => {
  const {
    className,
    data,
    isEditMode,
    block,
    openObjectBrowser,
    onChangeBlock,
    slideIndex,
    setSlideIndex,
  } = props;
  const intl = useIntl();

  const sliderRef = React.useRef();

  if (sliderRef.current && isEditMode) {
    // This syncs the current slide with the objectwidget (or other sources
    // able to access the slider context)
    // that can modify the SliderContext (and come here via props slideIndex)
    sliderRef.current.slickGoTo(slideIndex);
  }

  const [headerNode, setHeaderNode] = React.useState(null);

  React.useEffect(() => {
    setHeaderNode(
      document.querySelector(
        config.blocks.blocksConfig.slider.referenceContainerQuery,
      ),
    );
  }, []);
  const { width } = useNodeDimensions(headerNode);

  return (
    <>
      <SlidesWidthFix width={width} />
      <div className={cx('block slider', className)}>
        {(data.slides?.length === 0 || !data.slides) && isEditMode && (
          <Message>
            <div className="teaser-item default">
              <img src={teaserTemplate} alt="" />
              <p>{intl.formatMessage(messages.PleaseChooseContent)}</p>
            </div>
          </Message>
        )}
        {data.slides?.length > 0 && (
          <Slider
            ref={sliderRef}
            dots
            dotsClass="slick-dots sr-only"
            infinite
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            draggable={false}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
            slideWidth="1200px"
            // This syncs the current slide with the SliderContext state
            // responding to the slide change event from the slider itself
            // (the dots or the arrows)
            // There's also the option of doing it before instead than after:
            // beforeChange={(current, next) => setSlideIndex(next)}
            afterChange={(current) => isEditMode && setSlideIndex(current)}
          >
            {data.slides &&
              data.slides.map((item, index) => (
                <div key={item['@id']}>
                  <Body
                    {...props}
                    key={item['@id']}
                    data={item}
                    isEditMode={isEditMode}
                    dataBlock={data}
                    index={index}
                    block={block}
                    openObjectBrowser={openObjectBrowser}
                    onChangeBlock={onChangeBlock}
                  />
                </div>
              ))}
          </Slider>
        )}
      </div>
    </>
  );
};

export default withBlockExtensions(SliderView);
