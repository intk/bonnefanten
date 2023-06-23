import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { flattenHTMLToAppURL, flattenToAppURL } from '@plone/volto/helpers';
import { ConditionalLink } from '@plone/volto/components';
import NewsletterSubscribe from '@package/components/theme/Footer/NewsletterSubscribe';
import { SocialLinks } from 'volto-social-settings';
import { getEditableFooterColumns } from 'volto-editablefooter/actions';
import { getItemsByPath } from 'volto-editablefooter/utils';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

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
      {footerColumns
        .filter((c) => c.visible)
        .map((column) => (
          <div className="column" key={column.id}>
            <h3 className={column.showSocial ? 'with-socials' : ''}>
              {column?.title && (
                <ConditionalLink
                  condition={column.titleLink?.length > 0}
                  item={column.titleLink?.[0]}
                  to={
                    flattenToAppURL(column.titleLink?.[0]?.['@id']) ? null : ''
                  }
                  title={column.title}
                >
                  {column.title}:
                </ConditionalLink>
              )}
            </h3>
            {column.newsletterSubscribe && <NewsletterSubscribe />}
            {column.text.data.includes('[![') ? (
              <div
                className="footer-column-content markdown"
                dangerouslySetInnerHTML={{
                  __html: md.render(
                    column.text.data.replace('<p>', '').replace('</p>', ''),
                  ),
                }}
              />
            ) : (
              <div
                className="footer-column-content"
                dangerouslySetInnerHTML={{
                  __html: flattenHTMLToAppURL(column.text.data),
                }}
              />
            )}
            {column.showSocial && <SocialLinks />}
          </div>
        ))}
    </div>
  );
};

export default FooterColumns;
