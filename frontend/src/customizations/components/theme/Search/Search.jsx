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
    en: 'Only in the collection',
    nl: 'Alleen in de collectie',
  },
  excludeArtworks: {
    en: 'Only in the website',
    nl: 'Alleen in de website',
  },
  hasImage: {
    nl: 'Alleen met beeld',
    en: 'Only Images',
  },
  onDisplay: {
    en: 'Now on view',
    nl: 'Nu te zien',
  },
  filterheading: {
    nl: 'Filter de resultaten.',
    en: 'Filter the results',
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
    this.state = {
      currentPage: 1,
      isClient: false,
      active: 'relevance',
      onlyArtworks: false,
      excludeArtworks: false,
      objOnDisplay: false,
      hasPreviewImage: false,
      ObjOnDisplay: false,
      filtersDisplay: false,
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const options = qs.parse(this.props.history.location.search);

    if (
      options?.advancedsearch === 'true' &&
      options.portal_type !== 'artwork'
    ) {
      this.handleCheckboxChange('onlyArtworks');
    }
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

  // doSearch = () => {
  //   const { onlyArtworks } = this.state;
  //   const options = qs.parse(this.props.history.location.search);

  //   if (onlyArtworks) {
  //     options.portal_type = 'artwork';
  //   } else {
  //     delete options.portal_type; // Remove the filter if checkbox is unchecked
  //   }

  //   this.setState({ currentPage: 1 });
  //   options['use_site_search_settings'] = 1;
  //   this.props.searchContent('', options);
  // };

  handleCheckboxChange = (checkboxType) => {
    const { history, location } = this.props;
    let currentUrlParams = new URLSearchParams(location.search);

    // Initialize updates based on checkboxType
    let updates = {};

    switch (checkboxType) {
      case 'onlyArtworks':
        updates = {
          onlyArtworks: !this.state.onlyArtworks,
          // Turn off excludeArtworks if onlyArtworks is being turned on
          excludeArtworks: this.state.onlyArtworks
            ? this.state.excludeArtworks
            : false,
        };
        break;
      case 'excludeArtworks':
        updates = {
          excludeArtworks: !this.state.excludeArtworks,
          // Turn off onlyArtworks if excludeArtworks is being turned on
          onlyArtworks: this.state.excludeArtworks
            ? this.state.onlyArtworks
            : false,
        };
        break;
      case 'hasPreviewImage':
        updates = { hasPreviewImage: !this.state.hasPreviewImage };
        break;
      case 'ObjOnDisplay':
        updates = { ObjOnDisplay: !this.state.ObjOnDisplay };
        break;
      default:
        break;
    }

    // Update state with the changes
    this.setState(updates, () => {
      // After state update, adjust URL parameters
      currentUrlParams.delete('portal_type');
      currentUrlParams.delete('portal_type:list');
      currentUrlParams.delete('hasPreviewImage');
      currentUrlParams.delete('ObjOnDisplay');
      currentUrlParams.delete('advancedsearch');

      if (this.state.onlyArtworks) {
        currentUrlParams.set('portal_type', 'artwork');
      }
      if (this.state.excludeArtworks) {
        const includeTypes = [
          'Document',
          'Event',
          'News Item',
          'author',
          'Link',
        ];
        includeTypes.forEach((type) =>
          currentUrlParams.append('portal_type:list', type),
        );
      }
      if (this.state.hasPreviewImage) {
        currentUrlParams.set('hasPreviewImage', 'true');
      }
      if (this.state.ObjOnDisplay) {
        currentUrlParams.set('ObjOnDisplay', 'true');
      }

      history.push(`${location.pathname}?${currentUrlParams.toString()}`);
      this.doSearch();
    });
  };

  doSearch = () => {
    const options = qs.parse(this.props.history.location.search);

    if (this.state.onlyArtworks) {
      options.portal_type = 'artwork';
    } else if (this.state.excludeArtworks) {
      options.excludeArtworks = 'true';
    } else if (this.state.hasPreviewImage) {
      options.hasPreviewImage = 'true';
    } else if (this.state.ObjOnDisplay) {
      options.hasPreviewImage = 'true';
    } else {
      delete options.portal_type;
      delete options.excludeArtworks;
      delete options.hasPreviewImage;
    }

    this.setState({ currentPage: 1 });
    options['use_site_search_settings'] = 1;
    this.props.searchContent('', options);
  };

  handleQueryPaginationChange = (e, { activePage }) => {
    const { settings } = config;
    window.scrollTo(0, 0);
    let options = qs.parse(this.props.history.location.search);
    options['use_site_search_settings'] = 1;

    this.setState({ currentPage: activePage }, () => {
      this.props.searchContent('', {
        ...options,
        b_start: (this.state.currentPage - 1) * settings.defaultPageSize,
      });
    });
  };

  renderFilterButtons = () => {
    const { intl } = this.props;
    return (
      <>
        <label>
          <input
            type="checkbox"
            checked={this.state.hasPreviewImage}
            onChange={() => this.handleCheckboxChange('hasPreviewImage')}
            className="artwork-checkbox"
          />
          <span className="label">{translations.hasImage[intl.locale]}</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.excludeArtworks}
            onChange={() => this.handleCheckboxChange('excludeArtworks')}
            className="artwork-checkbox"
          />
          <span className="label">
            {translations.excludeArtworks[intl.locale]}
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.onlyArtworks}
            onChange={() => this.handleCheckboxChange('onlyArtworks')}
            className="artwork-checkbox"
          />
          <span className="label">
            {translations.filterArtworks[intl.locale]}
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.ObjOnDisplay}
            onChange={() => this.handleCheckboxChange('ObjOnDisplay')}
            className="artwork-checkbox"
          />
          <span className="label">{translations.onDisplay[intl.locale]}</span>
        </label>
      </>
    );
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
                <div
                  id="filter-section"
                  className="artwork-search-check button"
                >
                  <button
                    className="filter-button text-button btn-block"
                    onClick={() =>
                      this.setState({
                        filtersDisplay: !this.state.filtersDisplay,
                      })
                    }
                  >
                    {translations.filterheading[intl.locale]}
                  </button>
                  {this.state.filtersDisplay && this.renderFilterButtons()}
                </div>
                <div className="artwork-search-check heading">
                  <h3 className="search-heading">
                    {translations.filterheading[intl.locale]}
                  </h3>
                  {this.renderFilterButtons()}
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
