/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';

import { Icon } from '@plone/volto/components';
import zoomSVG from '@plone/volto/icons/zoom.svg';

const messages = {
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    nl: 'Website doorzoeken',
    en: 'Search Site',
  },
};

/**
 * SearchWidget component class.
 * @class SearchWidget
 * @extends Component
 */
class SearchWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      text: '',
    };
  }

  /**
   * On change text
   * @method onChangeText
   * @param {object} event Event object.
   * @param {string} value Text value.
   * @returns {undefined}
   */
  onChangeText(event, { value }) {
    this.setState({
      text: value,
    });
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {event} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    const path =
      this.props.pathname?.length > 0
        ? `&path=${encodeURIComponent(this.props.pathname)}`
        : '';
    this.props.history.push(
      `/search?SearchableText=${encodeURIComponent(
        this.state.text,
      )}${path}/&Language=${this.props.intl.locale}`,
    );
    // reset input value
    this.setState({
      text: '',
    });
    event.preventDefault();
    this.props.onClose();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Form action="/search" onSubmit={this.onSubmit}>
        <Form.Field className="searchbox">
          <Input
            aria-label={messages.searchSite[this.props.intl.locale]}
            onChange={this.onChangeText}
            name="SearchableText"
            value={this.state.text}
            transparent
            autoComplete="off"
            placeholder={messages.searchSite[this.props.intl.locale]}
            title={messages.searchSite[this.props.intl.locale]}
          />
          <button aria-label={messages.searchSite[this.props.intl.locale]}>
            <Icon name={zoomSVG} size="18px" />
          </button>
        </Form.Field>
      </Form>
    );
  }
}

export default compose(withRouter, injectIntl)(SearchWidget);
