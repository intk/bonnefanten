import quoteSVG from '@plone/volto/icons/quote.svg';

import DiscreetView from './DiscreetView';
import DiscreetEdit from './DiscreetEdit';

const installDiscreetText = (config) => {
  config.blocks.blocksConfig.discreetText = {
    id: 'discreetText',
    title: 'discreetText',
    icon: quoteSVG,
    group: 'text',
    view: DiscreetView,
    edit: DiscreetEdit,
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

export default installDiscreetText;
