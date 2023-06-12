import installButtonBlock from './Button';
import installImageBlock from './Image';
import installBreakBlock from './Break';
import { compose } from 'redux';

const installBlocks = (config) => {
  return compose(
    installButtonBlock,
    installImageBlock,
    installBreakBlock,
  )(config);
};

export default installBlocks;
