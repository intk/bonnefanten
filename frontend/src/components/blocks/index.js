import installButtonBlock from './Button';
import installImageBlock from './Image';
import installBreakBlock from './Break';
import installQuoteBlock from './Quote';
import installTeaserBlock from './Teaser';
import installSliderBlock from './Slider';
import installListingBlock from './Listing';
import installNewsletterBlock from './Newsletter';
import installSearchBlock from './Search';
import installAdvancedSearch from './AdvancedSearch';
import installEventPageButtonBlock from './EventPageButton';
import installQuoteblock from './Quoteblock';
import installImageAndTextBlock from './ImageAndTextBlock';
import installSlidingTextBlock from './SlidingTextBlock';
import installVideoPageBlock from './VideoPageBlock';
import installDiscreetText from './DiscreetText';
import installPreviewCollectionBlock from './PreviewCollection';

import { compose } from 'redux';

const installBlocks = (config) => {
  delete config.blocks.blocksConfig.hero;

  return compose(
    installButtonBlock,
    installImageBlock,
    installBreakBlock,
    installQuoteBlock,
    installTeaserBlock,
    installSliderBlock,
    installListingBlock,
    installNewsletterBlock,
    installSearchBlock,
    installAdvancedSearch,
    installEventPageButtonBlock,
    installQuoteblock,
    installImageAndTextBlock,
    installSlidingTextBlock,
    installVideoPageBlock,
    installDiscreetText,
    installPreviewCollectionBlock,
  )(config);
};

export default installBlocks;
