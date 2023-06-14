import quoteSVG from '@plone/volto/icons/quote.svg';

import QuoteView from './QuoteView';
import QuoteEdit from './QuoteEdit';

const installQuoteBlock = (config) => {
  config.blocks.blocksConfig.quoteBlock = {
    id: 'quoteBlock',
    title: 'Quote',
    icon: quoteSVG,
    group: 'common',
    view: QuoteView,
    edit: QuoteEdit,
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

export default installQuoteBlock;
