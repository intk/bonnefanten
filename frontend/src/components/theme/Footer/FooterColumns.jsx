import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { flattenHTMLToAppURL, flattenToAppURL } from '@plone/volto/helpers';
import { ConditionalLink, Logo } from '@plone/volto/components';
import NewsletterSubscribe from '@package/components/theme/Footer/NewsletterSubscribe';
import { SocialLinks } from 'volto-social-settings';
import { getEditableFooterColumns } from 'volto-editablefooter/actions';
import { getItemsByPath } from 'volto-editablefooter/utils';

const FooterColumns = ({ footer }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const footerConfiguration = useSelector(
    (state) => state.editableFooterColumns?.result,
  );

  useEffect(() => {
    dispatch(getEditableFooterColumns());
  }, [dispatch, location]);

  //filter rootpaths
  const footerColumns = getItemsByPath(
    footerConfiguration,
    location?.pathname?.length ? location.pathname : '/',
  );

  return (
    <div className="footer-columns">
      <div className="column">
        <Logo />
      </div>
      {footerColumns
        .filter((c) => c.visible)
        .map((column) => (
          <div className="column" key={column.id}>
            <h3 className={column.showSocial ? 'with-socials sr-only' : ''}>
              {column?.title && (
                <ConditionalLink
                  condition={column.titleLink?.length > 0}
                  item={column.titleLink?.[0]}
                  to={
                    flattenToAppURL(column.titleLink?.[0]?.['@id']) ? null : ''
                  }
                  title={column.title}
                >
                  {column.title}
                </ConditionalLink>
              )}
            </h3>
            {column.showSocial && <SocialLinks />}
            {column.newsletterSubscribe && <NewsletterSubscribe />}
            <div
              className="footer-column-content"
              dangerouslySetInnerHTML={{
                __html: flattenHTMLToAppURL(column.text.data),
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default FooterColumns;
