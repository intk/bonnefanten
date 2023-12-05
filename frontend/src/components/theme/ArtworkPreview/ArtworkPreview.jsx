import React from 'react';
import PropTypes from 'prop-types';

import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { Link } from 'react-router-dom';

import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';

/**
 * Renders a preview image for a catalog brain result item.
 *
 */
function ArtworkPreview(props) {
  const item = props;

  const src = item.image_field
    ? flattenToAppURL(
        `${item['@id']}/${item.image_scales.preview_image[0].scales.preview.download}`,
      )
    : config.getComponent({
        name: 'DefaultImage',
        dependencies: ['listing', 'summary'],
      }).component || DefaultImageSVG;

  return (
    <>
      {item.image_field !== '' ? (
        <Link to={flattenToAppURL(item['@id'])} className="listing-image">
          <img src={src} alt={item.title ?? 'alt'} />
        </Link>
      ) : (
        <img
          src={src}
          alt={item.title ?? 'alt'}
          style={{ visibility: 'hidden' }}
        />
      )}
    </>
  );
}

ArtworkPreview.propTypes = {
  size: PropTypes.string,
  item: PropTypes.shape({
    '@id': PropTypes.string.isRequired,
    image_field: PropTypes.string,
    title: PropTypes.string.isRequired,
  }),
};

export default ArtworkPreview;
