import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';

function SlideshowPreview(props) {
  const item = props;
  const lazy = props.lazy;

  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Define the base URL for the image
    const baseUrl = item.image_field
      ? flattenToAppURL(`${item['@id']}/@@images/${item.image_field}`)
      : '';

    // Start with low-res image
    const lowResSrc = `${baseUrl}/preview`;
    setImageSrc(lowResSrc); // Initially set to low-res

    // Preload high-res image
    const highResSrc = `${baseUrl}/huge`;
    const img = new Image();
    img.src = highResSrc;
    img.onload = () => {
      setImageSrc(highResSrc); // Switch to high-res once loaded
      setIsLoading(false);
    };
  }, [item, item.image_field]);

  const loadingAttribute = lazy ? 'lazy' : 'eager';

  return (
    <>
      {item.image_field !== '' ? (
        <Link to={flattenToAppURL(item['@id'])} className="listing-image">
          <img
            loading={loadingAttribute}
            src={imageSrc}
            alt={item.title ?? 'Image'}
          />
        </Link>
      ) : (
        // Optionally handle the case where there is no image field defined
        <img
          src={imageSrc}
          alt={item.title ?? 'Image'}
          style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        />
      )}
    </>
  );
}

SlideshowPreview.propTypes = {
  item: PropTypes.shape({
    '@id': PropTypes.string.isRequired,
    image_field: PropTypes.string,
    title: PropTypes.string.isRequired,
  }),
  lazy: PropTypes.bool,
};

export default SlideshowPreview;
