/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { BodyClass, getBaseUrl, hasApiExpander } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions';
import { CSSTransition } from 'react-transition-group';
import NavItems from './NavItems';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import SearchWidget from '@plone/volto/components/theme/SearchWidget/SearchWidget';

const messages = defineMessages({
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

/**
 * Navigation container class.
 * @class Navigation
 * @extends Component
 */
class Navigation extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getNavigation: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
    lang: PropTypes.string.isRequired,
  };

  static defaultProps = {
    token: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Navigation
   */
  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.state = {
      isMobileMenuOpen: false,
    };
  }

  componentDidMount() {
    const { settings } = config;
    if (!hasApiExpander('navigation', getBaseUrl(this.props.pathname))) {
      this.props.getNavigation(
        getBaseUrl(this.props.pathname),
        settings.navDepth,
      );
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { settings } = config;
    if (
      nextProps.pathname !== this.props.pathname ||
      nextProps.token !== this.props.token
    ) {
      if (!hasApiExpander('navigation', getBaseUrl(this.props.pathname))) {
        this.props.getNavigation(
          getBaseUrl(nextProps.pathname),
          settings.navDepth,
        );
      }
    }
  }

  /**
   * Toggle mobile menu's open state
   * @method toggleMobileMenu
   * @returns {undefined}
   */
  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  }

  /**
   * Close mobile menu
   * @method closeMobileMenu
   * @returns {undefined}
   */
  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) {
      return;
    }
    this.setState({ isMobileMenuOpen: false });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <nav className="navigation" id="navigation" aria-label="navigation">
        <div className="hamburger-wrapper">
          <button
            className={cx('hamburger hamburger--spin', {
              'is-active': this.state.isMobileMenuOpen,
            })}
            aria-label={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            title={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            type="button"
            onClick={this.toggleMobileMenu}
          >
            <svg id="nav-trigger-close-svg" viewBox="0 0 85 85">
              <path
                d="M85,12.5v-5L77.5,0h-5L42.5046,30,12.5,0h-5L0,7.51v4.9981L30,42.5,0,72.5v4.9907L7.75,85h4.7571L42.5046,55,72.5,85h5L85,77.4526V72.5l-30-30ZM47.1028,45.473A5.5819,5.5819,0,0,1,45.51,47.0894a5.4907,5.4907,0,0,1-8.39-5.6332,5.5,5.5,0,0,1,1.5168-2.8351,5.4764,5.4764,0,0,1,8.466,6.8519Z"
                fill="currentColor"
              ></path>
            </svg>
            <svg id="nav-trigger-open-svg" viewBox="0 0 85 85">
              <g>
                <path
                  d="M76.1606,67.3208H56.4463l-.0046-.0005H8.8394a8.84,8.84,0,0,0,0,17.68H56.4417L56.4463,85H76.1606a8.8394,8.8394,0,1,0,0-17.6787ZM8.8394,81.1465a4.9864,4.9864,0,1,1,4.9877-4.9859A5.0305,5.0305,0,0,1,8.8394,81.1465Zm22.44-.0005A4.9861,4.9861,0,1,1,36.2671,76.16,5.0308,5.0308,0,0,1,31.2793,81.146Zm22.44,0A4.9861,4.9861,0,1,1,58.7068,76.16,5.0308,5.0308,0,0,1,53.719,81.146Zm22.4416,0A4.9864,4.9864,0,1,1,81.1465,76.16,5.0308,5.0308,0,0,1,76.1606,81.146Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8.8394,17.68H56.4417l.0046,0H76.1606a8.8394,8.8394,0,1,0,0-17.6787H56.4463l-.0046,0H8.8394a8.84,8.84,0,0,0,0,17.68ZM76.1606,3.853A5.0312,5.0312,0,0,1,81.1465,8.84a4.9868,4.9868,0,0,1-9.9736,0A5.0317,5.0317,0,0,1,76.1606,3.853Zm-22.44,0A5.0311,5.0311,0,0,1,58.7068,8.84a4.987,4.987,0,0,1-9.9739,0A5.0315,5.0315,0,0,1,53.7207,3.8535Zm-22.4414,0A5.0315,5.0315,0,0,1,36.2671,8.84a4.987,4.987,0,0,1-9.9739,0A5.0312,5.0312,0,0,1,31.2793,3.8535Zm-22.44,0A5.0315,5.0315,0,0,1,13.8271,8.84a4.9868,4.9868,0,0,1-9.9736,0A5.0314,5.0314,0,0,1,8.8394,3.8535Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M76.1606,33.6606H56.4463l-.0046,0H8.8394a8.84,8.84,0,0,0,0,17.68H56.4417l.0046,0H76.1606a8.8394,8.8394,0,0,0,0-17.6788ZM8.8394,47.4863a4.9863,4.9863,0,1,1,4.9877-4.9858A5.0305,5.0305,0,0,1,8.8394,47.4863Zm22.44-.0005A4.9861,4.9861,0,1,1,36.2671,42.5,5.0308,5.0308,0,0,1,31.2793,47.4858Zm22.44,0A4.9861,4.9861,0,1,1,58.7068,42.5,5.0308,5.0308,0,0,1,53.719,47.4858Zm22.4416,0A4.9863,4.9863,0,1,1,81.1465,42.5,5.0308,5.0308,0,0,1,76.1606,47.4858Z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </button>
        </div>
        <CSSTransition
          in={this.state.isMobileMenuOpen}
          classNames="mobile-menu"
          appear
          mountOnEnter
          timeout={500}
          onEntering={() => {
            document.body.classList.add('intk-menu-opening');
            document.body.classList.add('intk-menu-visible');
          }}
          onEntered={() => {
            document.body.classList.add('intk-menu-opened');
          }}
          onExiting={() => {
            document.body.classList.remove('intk-menu-opening');
            document.body.classList.remove('intk-menu-opened');
          }}
          unmountOnExit
        >
          <div key="mobile-menu-key" className="mobile-menu">
            <BodyClass className="has-mobile-menu-open" />

            <div className="mobile-menu-nav">
              <div className="search">
                <SearchWidget onClose={this.closeMobileMenu} />
              </div>

              <div className="tools-search-wrapper">
                <LanguageSelector onClickAction={this.closeMobileMenu} />
              </div>

              <NavItems
                items={this.props.items}
                lang={this.props.lang}
                onClose={this.closeMobileMenu}
              />
            </div>
          </div>
        </CSSTransition>
      </nav>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      token: state.userSession.token,
      items: state.navigation.items,
      lang: state.intl.locale,
    }),
    { getNavigation },
  ),
)(Navigation);
