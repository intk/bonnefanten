/**
 * SocialLinks component.
 * @module volto-social-settings/src/components/SocialLinks/SocialLinks
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getSocialSettings } from '../../actions/getSocialSettings';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';

const SocialLinks = ({ wrapperCssClass, itemCssClass }) => {
  const socialSettings = useSelector((state) => state.socialSettings?.results);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSocialSettings());
  }, [dispatch]);

  return socialSettings?.length > 0 ? (
    <div className={cx('social-header', wrapperCssClass)}>
      {socialSettings.map((social) => (
        <a
          href={social.url}
          title={social.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {social.icon === 'twitter' ? (
            <svg
              // id="twitter-rrssb-svg"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              // width="50"
              // height="43"
              viewBox="0 0 1200 1277"
            >
              <path
                d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <Icon name={social.icon} size="large" />
          )}
        </a>
      ))}
    </div>
  ) : null;
};

SocialLinks.propTypes = {
  wrapperCssClass: PropTypes.string,
  itemCssClass: PropTypes.string,
};

export default SocialLinks;
