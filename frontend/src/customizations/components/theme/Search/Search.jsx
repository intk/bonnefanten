/**
 * Search component.
 * @module components/theme/Search/Search
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { UniversalLink } from '@plone/volto/components';
import { asyncConnect } from '@plone/volto/helpers';
import { FormattedMessage } from 'react-intl';
import { Portal } from 'react-portal';
import { Container, Pagination } from 'semantic-ui-react';
import qs from 'query-string';
// import classNames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import config from '@plone/volto/registry';
import { Helmet } from '@plone/volto/helpers';
import { searchContent } from '@plone/volto/actions';
// eslint-disable-next-line no-unused-vars
import { SearchTags, Toolbar, Icon } from '@plone/volto/components';
import { PreviewImage } from '@plone/volto/components';
import SearchBar from '@package/components/theme/Search/SearchBar';
import { When } from '@package/customizations/components/theme/View/EventDatesInfo';
import { NavLink } from 'react-router-dom';
import { HiMiniArrowLongLeft } from 'react-icons/hi2';
import { HiMiniArrowLongRight } from 'react-icons/hi2';

const messages = defineMessages({
  Search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

const translations = {
  searchresults: {
    en: 'Search results',
    nl: 'Zoekresultaten',
  },
  results: {
    en: 'items matching your search terms.',
    nl: 'resultaten voor de zoekopdracht.',
  },
  for: {
    en: 'for',
    nl: 'voor',
  },
  advancedsearch: {
    en: 'Advanced search',
    nl: 'Geavanceerd zoeken',
  },
  filterArtworks: {
    en: 'Show only artworks',
    nl: 'Alleen kunstwerken tonen',
  },
};

function truncate(str, num) {
  if (str.length <= num) {
    return str;
  }

  const subString = str.substr(0, num);
  return subString.substr(0, subString.lastIndexOf(' ')) + ' ...';
}

// const test = withQuerystringResults(this.props);
// console.log(test);

/**
 * Search class.
 * @class SearchComponent
 * @extends Component
 */
class Search extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    searchContent: PropTypes.func.isRequired,
    searchableText: PropTypes.string,
    subject: PropTypes.string,
    path: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    items: [],
    searchableText: null,
    subject: null,
    path: null,
  };

  constructor(props) {
    super(props);
    this.state = { currentPage: 1, isClient: false, active: 'relevance' };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.doSearch();
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.location.search !== nextProps.location.search) {
      this.doSearch();
    }
  };

  /**
   * Search based on the given searchableText, subject and path.
   * @method doSearch
   * @param {string} searchableText The searchable text string
   * @param {string} subject The subject (tag)
   * @param {string} path The path to restrict the search to
   * @returns {undefined}
   */

  doSearch = () => {
    const { onlyArtworks } = this.state;
    const options = qs.parse(this.props.history.location.search);

    if (onlyArtworks) {
      options.portal_type = 'artwork'; // Adjust search to include only artworks if checkbox is checked
    } else {
      delete options.portal_type; // Remove the filter if checkbox is unchecked
    }

    this.setState({ currentPage: 1 });
    options['use_site_search_settings'] = 1;
    this.props.searchContent('', options);
  };

  handleCheckboxChange = () => {
    this.setState(
      (prevState) => ({ onlyArtworks: !prevState.onlyArtworks }),
      () => this.doSearch(), // Perform search after state update
    );
  };

  handleCheckboxChange = () => {
    const { history, location } = this.props;
    const currentUrlParams = new URLSearchParams(location.search);

    if (this.state.onlyArtworks) {
      // If currently checked, remove the portal_type=artwork parameter
      currentUrlParams.delete('portal_type');
    } else {
      // If currently unchecked, add the portal_type=artwork parameter
      currentUrlParams.set('portal_type', 'artwork');
    }

    // Toggle the onlyArtworks state
    this.setState((prevState) => ({ onlyArtworks: !prevState.onlyArtworks }));

    // Redirect to the updated URL
    history.push(`${location.pathname}?${currentUrlParams.toString()}`);
  };

  onSortChange = (event, sort_order) => {
    let options = qs.parse(this.props.history.location.search);
    options.sort_on = event.target.name;
    options.sort_order = sort_order || 'ascending';
    if (event.target.name === 'relevance') {
      delete options.sort_on;
      delete options.sort_order;
    }
    let searchParams = qs.stringify(options);
    this.setState({ currentPage: 1, active: event.target.name }, () => {
      // eslint-disable-next-line no-restricted-globals
      this.props.history.replace({
        search: searchParams,
      });
    });
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { settings } = config;
    const { intl } = this.props;

    return (
      <>
        <h1 className="documentFirstHeading">
          {translations.searchresults[intl.locale]}{' '}
          {translations.for[intl.locale]}{' '}
          <span className="search-term">{this.props.searchableText}</span>
        </h1>
        <Container id="page-search">
          <Helmet title={this.props.intl.formatMessage(messages.Search)} />
          <div className="container">
            <article id="content">
              <header>
                {/* <SearchTags /> */}
                <div className="search">
                  <SearchBar />
                </div>
                <div className="advanced-search-link">
                  {/* <a href={`/${intl.locale}/advancedsearch`}>
                    {translations.advancedsearch[intl.locale]}
                  </a> */}
                  <NavLink
                    to={`/${intl.locale}/advancedsearch`}
                    key={`/${intl.locale}/advancedsearch`}
                    activeClassName="active"
                  >
                    {translations.advancedsearch[intl.locale]}
                  </NavLink>
                </div>
                <div id="artwork-search-check">
                  <label>
                    <span> {translations.filterArtworks[intl.locale]} </span>
                    <input
                      className="artwork-checkbox"
                      type="checkbox"
                      checked={this.state.onlyArtworks}
                      onChange={this.handleCheckboxChange}
                    />
                  </label>
                </div>
                {this.props.search?.items_total > 0 ? (
                  <>
                    <div className="items_total">
                      <strong>{this.props.search.items_total}</strong>
                      {translations.results[intl.locale]}
                    </div>
                  </>
                ) : (
                  <div>
                    <FormattedMessage
                      id="No results found"
                      defaultMessage="No results found"
                    />
                  </div>
                )}
              </header>
              <section id="content-core">
                {this.props.items.map((item) => (
                  <article className="tileItem" key={item['@id']}>
                    {item.image_field !== '' ? (
                      <PreviewImage
                        item={item}
                        size="preview"
                        alt={
                          item.image_caption ? item.image_caption : item.title
                        }
                        className="ui image"
                      />
                    ) : (
                      <div className="image-placeholder"></div>
                    )}

                    <div className="search-text-wrapper">
                      <h2 className="tileHeadline">
                        <UniversalLink
                          item={item}
                          className="summary url"
                          title={item['@type']}
                        >
                          {item.title}
                        </UniversalLink>
                      </h2>
                      {item['@type'] === 'Event' ? (
                        <div className="listing-dates">
                          <div className={`listing-dates-wrapper`}>
                            <When
                              start={item.start}
                              end={item.end}
                              whole_day={item.whole_day}
                              open_end={item.open_end}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                      {item.description && (
                        <div className="tileBody">
                          <span className="description">
                            {truncate(item.description, 155)}
                          </span>
                        </div>
                      )}
                      <div className="visualClear" />
                    </div>
                  </article>
                ))}

                {this.props.search?.batching && (
                  <div className="pagination-wrapper">
                    <Pagination
                      activePage={this.state.currentPage}
                      totalPages={Math.ceil(
                        this.props.search.items_total /
                          settings.defaultPageSize,
                      )}
                      onPageChange={this.handleQueryPaginationChange}
                      firstItem={null}
                      lastItem={null}
                      prevItem={{
                        content: <HiMiniArrowLongLeft />,
                        icon: true,
                        'aria-disabled': !this.props.search.batching.prev,
                        className: !this.props.search.batching.prev
                          ? 'disabled'
                          : null,
                      }}
                      nextItem={{
                        content: <HiMiniArrowLongRight />,
                        icon: true,
                        'aria-disabled': !this.props.search.batching.next,
                        className: !this.props.search.batching.next
                          ? 'disabled'
                          : null,
                      }}
                    />
                  </div>
                )}
              </section>
            </article>
          </div>
          {this.state.isClient && (
            <Portal node={document.getElementById('toolbar')}>
              <Toolbar
                pathname={this.props.pathname}
                hideDefaultViewButtons
                inner={<span />}
              />
            </Portal>
          )}
        </Container>
      </>
    );
  }
}

export const __test__ = compose(
  injectIntl,
  connect(
    (state, props) => ({
      items: state.search.items,
      searchableText: qs.parse(props.history.location.search).SearchableText,
      pathname: props.history.location.pathname,
      itemsTotal: state.search.items_total,
    }),
    { searchContent },
  ),
)(Search);

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      items: state.search.items,
      searchableText: qs.parse(props.history.location.search).SearchableText,
      pathname: props.location.pathname,
      currentLang: state.intl?.locale,
    }),
    { searchContent },
  ),
  asyncConnect([
    {
      key: 'search',
      promise: ({ location, store: { dispatch } }) =>
        dispatch(
          searchContent('', {
            ...qs.parse(location.search),
            use_site_search_settings: 1,
          }),
        ),
    },
  ]),
)(Search);
