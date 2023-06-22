/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import FooterColumns from '@package/components/theme/Footer/FooterColumns';
import useInView from '@package/helpers/useInView';
import { BodyClass } from '@plone/volto/helpers';
import { Helmet } from '@plone/volto/helpers';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => {
  const footerInView = useInView(
    'footer#site-footer',
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    },
    true,
  );

  return (
    <footer id="site-footer" role="contentinfo">
      {footerInView && (
        <>
          <BodyClass className="footer-in-view" />
        </>
      )}

      <Container>
        <FooterColumns />
        <div className="sponsors-wrapper">
          <div className="sponsor">
            <a
              aria-label="ANBI"
              href="https://anbi.nl/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="sponsors-logo anbi"></span>
            </a>
          </div>
          <div className="sponsor">
            <a
              aria-label="OCW"
              href="https://www.denhaag.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="sponsors-logo ocw"></span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
