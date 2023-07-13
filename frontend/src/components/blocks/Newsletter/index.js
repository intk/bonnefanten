import newsSVG from '@plone/volto/icons/news.svg';

import NewsletterView from './NewsletterView';
import NewsletterEdit from './NewsletterEdit';

const installNewsletterBlock = (config) => {
  config.blocks.blocksConfig.newsletterBlock = {
    id: 'newsletterBlock',
    title: 'Newsletter',
    icon: newsSVG,
    group: 'common',
    view: NewsletterView,
    edit: NewsletterEdit,
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

export default installNewsletterBlock;
