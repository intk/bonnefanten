/**
 * Link View.
 * @module components/theme/View/LinkView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';
// import { Container } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import { FormattedMessage } from 'react-intl';
import config from '@plone/volto/registry';
import HeroSection from './HeroSection'; // , StickyHeader

/**
 * View container class.
 * @class View
 * @extends Component
 */
class LinkView extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      remoteUrl: PropTypes.string,
    }),
    token: PropTypes.string,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    content: null,
    token: null,
  };

  componentDidMount() {
    if (!this.props.token) {
      const { remoteUrl } = this.props.content;
      if (isInternalURL(remoteUrl)) {
        this.props.history.replace(flattenToAppURL(remoteUrl));
      } else if (!__SERVER__) {
        window.location.href = flattenToAppURL(remoteUrl);
      }
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { remoteUrl } = this.props.content;
    const { openExternalLinkInNewTab } = config.settings;
    return (
      <>
        {this.props.content.preview_image ? (
          <div className="header-bg">
            <div className="header-container">
              <HeroSection
                image_url={
                  this.props.content.preview_image?.scales?.preview?.download
                }
                content={this.props.content}
              />
            </div>
          </div>
        ) : (
          <h1 className="documentFirstHeading">{this.props.content.title}</h1>
        )}

        {this.props.content.description && (
          <p className="documentDescription hero-description">
            {this.props.content.description}
          </p>
        )}
        <div id="page-document" className="ui container">
          {remoteUrl && (
            <p>
              <FormattedMessage
                id="The link address is:"
                defaultMessage="The link address is:"
              />{' '}
              <UniversalLink
                href={remoteUrl}
                openLinkInNewTab={
                  openExternalLinkInNewTab && !isInternalURL(remoteUrl)
                }
              >
                {flattenToAppURL(remoteUrl)}
              </UniversalLink>
            </p>
          )}
        </div>
      </>
    );
  }
}

export default LinkView;
