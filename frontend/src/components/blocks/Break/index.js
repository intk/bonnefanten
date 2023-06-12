import divideHorizontalSVG from '@plone/volto/icons/divide-horizontal.svg';

import BreakView from './BreakView';
import BreakEdit from './BreakEdit';

const installBreakBlock = (config) => {
  config.blocks.blocksConfig.breakBlock = {
    id: 'breakBlock',
    title: 'Break',
    icon: divideHorizontalSVG,
    group: 'common',
    view: BreakView,
    edit: BreakEdit,
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

export default installBreakBlock;
