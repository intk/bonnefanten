import aheadSVG from '@plone/volto/icons/ahead.svg';

import EventPageButtonView from './EventPageButtonView';
import EventPageButtonEdit from './EventPageButtonEdit';

const installEventPageButtonBlock = (config) => {
  config.blocks.blocksConfig.eventPageButtonBlock = {
    id: 'eventPageButtonBlock',
    title: 'Event Page Button',
    icon: aheadSVG,
    group: 'common',
    view: EventPageButtonView,
    edit: EventPageButtonEdit,
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

export default installEventPageButtonBlock;
