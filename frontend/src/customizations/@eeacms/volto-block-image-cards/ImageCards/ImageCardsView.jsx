import React from 'react';
import config from '@plone/volto/registry';
import useInView from '@package/helpers/useInView';
import { BodyClass } from '@plone/volto/helpers';

const ImageCardView = (props) => {
  const byDisplayType = {};
  const blockRenderers = config.blocks.blocksConfig.imagecards.blockRenderers;
  const block_renderers_ids = Object.keys(blockRenderers);
  block_renderers_ids.forEach(function (value) {
    byDisplayType[value] = blockRenderers[value].view;
  });

  const Impl = byDisplayType[props.data.display || 'carousel'];
  const titleInView = useInView(
    'p',
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    },
    true,
  );
  return Impl ? (
    <>
      {titleInView ? (
        <BodyClass className="page-title-in-view" />
      ) : (
        <BodyClass className="page-title-out-of-view" />
      )}{' '}
      <Impl {...props} />{' '}
    </>
  ) : (
    ''
  );
};

export default ImageCardView;
