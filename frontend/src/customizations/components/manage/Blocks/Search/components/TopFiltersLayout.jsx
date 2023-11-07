import React from 'react';
import { FormattedMessage } from 'react-intl';
import { flushSync } from 'react-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Button, Grid } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import downSVG from '@plone/volto/icons/down-key.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import cx from 'classnames';
import { isEqual } from 'lodash';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';
// import { useHistory, useLocation } from 'react-router-dom';

import {
  SearchInput,
  SearchDetails,
  ViewSwitcher,
} from '@plone/volto/components/manage/Blocks/Search/components';
import Facets from './Facets';

// import HiddenFacets from './HiddenFacets';
import SortOn from './SortOn';

const messages = defineMessages({
  searchButtonText: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

const FacetWrapper = ({ children }) => (
  <Grid.Column mobile={12} tablet={4} computer={3}>
    {children}
  </Grid.Column>
);

const isDirty = (searchDataQuery, query) => {
  let isDirty = searchDataQuery.find((q) => {
    const predefined = query.find((pf) => pf.i === q.i);
    return predefined
      ? !isEqual(predefined.v, q.v) || predefined.o !== q.o
      : true;
  });

  return isDirty;
};

const TopSideFacets = (props) => {
  const {
    children,
    data,
    totalItems,
    facets,
    setFacets,
    setSortOn,
    setSortOrder,
    sortOn,
    sortOrder,
    onTriggerSearch,
    searchedText, // search text for previous search
    searchText, // search text currently being entered (controlled input)
    isEditMode,
    querystring = {},
    searchData,
    // mode = 'view',
    // variation,
  } = props;
  const { showSearchButton } = data;
  const isLive = !showSearchButton;
  const intl = useIntl();

  // const history = useHistory();
  // const location = useLocation();

  // React.useEffect(() => {
  //   const allowedPaths = [
  //     '/nl/collectie-onderzoek/collectie',
  //     '/en/collection-research/collection',
  //   ];

  //   // Check if the current URL is one of the allowed paths and the specific query isn't present
  //   if (
  //     allowedPaths.includes(location.pathname) &&
  //     !location.hash.includes('#query')
  //   ) {
  //     // Construct the new URL
  //     const newURL = `${location.pathname}${location.search}#query=%5B%7B"i"%3A"portal_type"%2C"o"%3A"paqo.selection.any"%2C"v"%3A%5B"artwork"%5D%7D%2C%7B"i"%3A"objectOnDisplay"%2C"o"%3A"paqo.boolean.isTrue"%2C"v"%3A""%7D%2C%7B"i"%3A"hasImage"%2C"o"%3A"paqo.boolean.isTrue"%2C"v"%3A""%7D%5D&sort_order=ascending`;

  //     history.replace(newURL); // Update the URL

  //     // Refresh the page to apply changes
  //     window.location.reload();
  //   }
  // }, []);

  const defaultOpened = isDirty(
    searchData.query || [],
    data.query?.query || [],
  );
  const [showFilters, setShowFilters] = React.useState(defaultOpened);

  const _hiddenData = {
    ...data,
    facets: data.facets?.map((f) => ({
      ...f,
      hidden: f.hidden
        ? Object.keys(facets).includes(f.field?.value) && facets[f.field?.value]
          ? false
          : true
        : false,
    })),
  };
  const hiddenData = useDeepCompareMemoize(_hiddenData);

  let facetOnView = {
    facets: hiddenData.facets?.filter(
      (facet) =>
        facet.field?.value === 'objectOnDisplay' ||
        facet.field?.value === 'hasImage',
    ),
  };

  let facetRest = {
    facets: hiddenData.facets?.filter(
      (facet) =>
        facet.field?.value !== 'objectOnDisplay' &&
        facet.field?.value !== 'hasImage',
    ),
  };

  return (
    <Grid className="searchBlock-facets" stackable>
      {data.headline && (
        <Grid.Row>
          <Grid.Column>
            <h2 className="headline">{data.headline}</h2>
          </Grid.Column>
        </Grid.Row>
      )}

      <Grid.Row>
        <Grid.Column>
          {(Object.keys(data).includes('showSearchInput')
            ? data.showSearchInput
            : true) && (
            <div className="search-wrapper">
              <SearchInput {...props} isLive={isLive} />
              {data.showSearchButton && (
                <Button primary onClick={() => onTriggerSearch(searchText)}>
                  {data.searchButtonLabel ||
                    intl.formatMessage(messages.searchButtonText)}
                </Button>
              )}
            </div>
          )}

          <div className="search-filters-sort">
            {data.facets?.length > 0 && data?.facets[0]?.field && (
              <div className="search-button-wrapper">
                <Button
                  className={cx('secondary filters-btn', {
                    open: showFilters,
                  })}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FormattedMessage id="Filters" defaultMessage="Filters" />
                  {showFilters ? (
                    <Icon name={upSVG} size="30px" />
                  ) : (
                    <Icon name={downSVG} size="30px" />
                  )}
                </Button>
                <div className="facetOnView">
                  <Facets
                    data={facetOnView}
                    querystring={querystring}
                    facets={facets}
                    setFacets={(f) => {
                      flushSync(() => {
                        setFacets(f);
                        onTriggerSearch(searchedText || '', f);
                      });
                    }}
                    facetWrapper={FacetWrapper}
                  />
                </div>
              </div>
            )}

            {data.showSortOn && (
              <SortOn
                data={data}
                querystring={querystring}
                isEditMode={isEditMode}
                sortOn={sortOn}
                sortOrder={sortOrder}
                setSortOn={(sortOn) => {
                  flushSync(() => {
                    setSortOn(sortOn);
                    onTriggerSearch(searchedText || '', facets, sortOn);
                  });
                }}
                setSortOrder={(sortOrder) => {
                  flushSync(() => {
                    setSortOrder(sortOrder);
                    onTriggerSearch(
                      searchedText || '',
                      facets,
                      sortOn,
                      sortOrder,
                    );
                  });
                }}
              />
            )}
            {data.availableViews && data.availableViews.length > 1 && (
              <ViewSwitcher {...props} />
            )}
          </div>
          {showFilters && data.facets?.length > 0 && (
            <div className="facets">
              {data.facetsTitle && <h3>{data.facetsTitle}</h3>}

              {/* <Facets */}
              {/*   data={data} */}
              {/*   querystring={querystring} */}
              {/*   facets={facets} */}
              {/*   setFacets={(f) => { */}
              {/*     flushSync(() => { */}
              {/*       setFacets(f); */}
              {/*       onTriggerSearch(searchedText || '', f); */}
              {/*     }); */}
              {/*   }} */}
              {/*   facetWrapper={FacetWrapper} */}
              {/* /> */}

              <Facets
                data={facetRest}
                querystring={querystring}
                facets={facets}
                setFacets={(f) => {
                  flushSync(() => {
                    setFacets(f);
                    onTriggerSearch(searchedText || '', f);
                  });
                }}
                facetWrapper={FacetWrapper}
              />
            </div>
          )}
          <SearchDetails
            text={searchedText}
            total={totalItems}
            as="h5"
            data={data}
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>{children}</Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default TopSideFacets;
