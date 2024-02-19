import aheadSVG from '@plone/volto/icons/ahead.svg';

import AnnouncementView from './AnnouncementView';
import AnnouncementEdit from './AnnouncementEdit';

const installAnnouncementBlock = (config) => {
  config.blocks.blocksConfig.announcementBlock = {
    id: 'announcementBlock',
    title: 'Announcement',
    icon: aheadSVG,
    group: 'common',
    view: AnnouncementView,
    edit: AnnouncementEdit,
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

export default installAnnouncementBlock;
