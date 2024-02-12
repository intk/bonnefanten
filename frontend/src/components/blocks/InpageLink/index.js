import aheadSVG from '@plone/volto/icons/ahead.svg';

import InpageLinkView from './InpageLinkView';
import InpageLinkEdit from './InpageLinkEdit';

const installInpageLinkBlock = (config) => {
  config.blocks.blocksConfig.Link = {
    id: 'Link',
    title: 'Link',
    icon: aheadSVG,
    group: 'common',
    view: InpageLinkView,
    edit: InpageLinkEdit,
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

export default installInpageLinkBlock;
