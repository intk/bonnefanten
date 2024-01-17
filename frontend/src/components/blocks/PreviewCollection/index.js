import imagerightSVG from '@plone/volto/icons/image-right.svg';
import ImageTextView from './ImageTextView';
import ImageTextEdit from './ImageTextEdit';

const installPreviewCollectionBlock = (config) => {
  config.blocks.blocksConfig.previewCollectionBlock = {
    id: 'previewCollectionBlock',
    title: 'previewCollectionBlock',
    icon: imagerightSVG,
    group: 'Storytelling',
    view: ImageTextView,
    edit: ImageTextEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};

export default installPreviewCollectionBlock;
