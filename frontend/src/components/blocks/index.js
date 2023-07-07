import installButtonBlock from './Button';
import installImageBlock from './Image';
import installBreakBlock from './Break';
import installQuoteBlock from './Quote';
import installTeaserBlock from './Teaser';
import installSliderBlock from './Slider';
import installListingBlock from './Listing';
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
  )(config);
};

export default installBlocks;
