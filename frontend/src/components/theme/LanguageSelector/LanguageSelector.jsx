/**
 * Language selector component.
 * @module components/LanguageSelector/LanguageSelector
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import cx from 'classnames';
import { find, map } from 'lodash';

import { Helmet, langmap, flattenToAppURL } from '@plone/volto/helpers';

import config from '@plone/volto/registry';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  switchLanguageTo: {
    id: 'Switch to',
    defaultMessage: 'Switch to',
  },
});

const LanguageSelector = (props) => {
  const intl = useIntl();
  const currentLang = useSelector((state) => state.intl.locale);
  const translations = useSelector(
    (state) => state.content.data?.['@components']?.translations?.items,
  );

  const { settings } = config;

  return settings.isMultilingual ? (
    <div className="language-selector">
      {map(
        settings.supportedLanguages.filter((l) => l !== currentLang),
        (lang) => {
          const translation = find(translations, { language: lang });
          return (
            <Link
              key={`language-selector-${lang}`}
              aria-label={`${intl.formatMessage(
                messages.switchLanguageTo,
              )} ${langmap[lang].nativeName.toLowerCase()}`}
              className={cx({ selected: lang === currentLang })}
              to={
                translation ? flattenToAppURL(translation['@id']) : `/${lang}`
              }
              title={langmap[lang].nativeName}
              onClick={() => {
                props.onClickAction();
              }}
            >
              {(lang === 'nl'
                ? 'Nederlands'
                : lang === 'en'
                ? 'English'
                : lang
              ).toUpperCase()}
            </Link>
          );
        },
      )}
    </div>
  ) : (
    <Helmet>
      <html lang={settings.defaultLanguage} />
    </Helmet>
  );
};

LanguageSelector.propTypes = {
  onClickAction: PropTypes.func,
};

LanguageSelector.defaultProps = {
  onClickAction: () => {},
};

export default LanguageSelector;
