import React from 'react';
import { useSelector } from 'react-redux';
import { Logo, Navigation } from '@plone/volto/components';
import { BodyClass, isCmsUi } from '@plone/volto/helpers';
// import HeroSection from '@package/components/theme/Header/HeroSection'; // , StickyHeader
import cx from 'classnames';
import { useIntl } from 'react-intl';
// import usePreviewImage from './usePreviewImage';
import { useLocation } from 'react-router-dom';
// import qs from 'query-string';
import useInView from '@package/helpers/useInView';

const Header = (props) => {
  const { navigationItems } = props;
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const { pathname, search } = useLocation();
  // const searchableText = qs.parse(search).SearchableText;

  const content = useSelector((state) => state.content.data);

  // const previewImage = usePreviewImage(pathname);

  // const previewImageUrl = previewImage?.scales?.preview?.download;

  const contentType = content?.['@type'];
  const isHomePage = contentType === 'Plone Site' || contentType === 'LRF';
  const isSearch = pathname === `/${intl.locale}/search`;
  const cmsView = isCmsUi(pathname);
  const homePageView = isHomePage && !cmsView && !isSearch;

  const titleInView = useInView(
    'h1',
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    },
    true,
  );


  return (
    <div className="portal-top">
      {homePageView && <BodyClass className="homepage-view" />}
      {!cmsView && !isSearch && <BodyClass className="has-image" />}
      {!(cmsView && isSearch) && <BodyClass className="has-hero-section" />}
      {isSearch && <BodyClass className="has-hero-section" />}
      {titleInView ? (
        <BodyClass className="title-in-view" />
      ) : (
        <BodyClass className="title-out-of-view" />
      )}
      <div
        className={cx(
          'header-wrapper',
          homePageView ? 'homepage' : 'contentpage',
        )}
        role="banner"
      >
        <div className="header">
          <div
            className={`logo-nav-wrapper ${
              homePageView ? 'home-nav' : 'page-nav'
            }`}
          >
            <div className="logo">
              <Logo />
            </div>

            <div className="right-section">
              <Navigation pathname={pathname} navigation={navigationItems} />
            </div>
          </div>
        </div>
      </div>

      {/* {!((cmsView && !isSearch) || isHomePage) && (
        <div className="header-bg">
          <div className="header-container">
            <HeroSection image_url={previewImageUrl} content={content} />
          </div>
        </div>
      )}
      {isSearch && (
        <div className="header-bg">
          <div className="header-container">
            <HeroSection
              content={{
                title:
                  intl.locale === 'nl'
                    ? `Zoekresultaten voor "${searchableText}"`
                    : `Search results for "${searchableText}"`,
              }}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;
