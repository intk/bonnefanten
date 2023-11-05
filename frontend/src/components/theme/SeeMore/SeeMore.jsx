import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { UniversalLink } from '@plone/volto/components';
import { Container } from 'semantic-ui-react';
import { searchContent } from '@plone/volto/actions';
import qs from 'query-string';
import { defineMessages, useIntl } from 'react-intl';
import ArtworkPreview from '../ArtworkPreview/ArtworkPreview';

const messages = defineMessages({
  seemore: {
    id: 'seemore',
    defaultMessage: 'Kijk verder',
  },
});
const Search = (props) => {
  useEffect(() => {
    doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchableText]);

  const authors = props.content.authors.map((author) => author.title);
  let authorQueryString = authors.map((author) => `${author}`).join(' OR ');
  if (authorQueryString === '') {
    authorQueryString = undefined;
  }

  const intl = useIntl();

  const doSearch = () => {
    const currentPath = intl.locale;
    const options = {
      portal_type: 'artwork',
      artwork_author: authorQueryString,
      path: currentPath,
    };
    props.searchContent('', options);
  };

  return (
    <Container id="page-search">
      <div id="page-search-title" className="page-search-title">
        <h1 style={{ fontFamily: 'BonnefantenBlock, Arial, sans-serif' }}>
          {intl.formatMessage(messages.seemore)}
        </h1>
      </div>

      {/* Display all item titles with their preview images */}
      <div className="search-items">
        {authors.length !== 0
          ? props.items.slice(0, 20).map((item) =>
              props.location.pathname !== item['@id'] ? (
                <div className="SeeMoreItem" key={item['@id']}>
                  <ArtworkPreview {...item} />
                  <UniversalLink item={item}>
                    <div className="item_title">{item.title}</div>
                  </UniversalLink>
                  {/* <div>
                <p>
                  {console.log(item)}
                </p>
              </div> */}
                </div>
              ) : (
                ''
              ),
            )
          : ''}
      </div>
    </Container>
  );
};

const mapStateToProps = (state, ownProps) => {
  const locationSearch = ownProps.location?.search || '';
  return {
    items: state.search.items,
    searchableText: qs.parse(locationSearch).SearchableText,
  };
};

export default connect(mapStateToProps, { searchContent })(Search);
