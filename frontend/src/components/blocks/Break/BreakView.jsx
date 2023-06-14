/**
 * View Break block.
 */

import React from 'react';
import cx from 'classnames';

/**
 * View Break block class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  return (
    <div
      className={cx('block break-block', { divider: data.style === 'divider' })}
    >
      {data.style === 'divider' && <span className="divider">--</span>}
    </div>
  );
};

export default View;
