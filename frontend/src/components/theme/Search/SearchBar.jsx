/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import { useDetectClickOutside } from 'react-detect-click-outside';
import './SearchBar.less';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    id: 'Search Site',
    defaultMessage: 'Search Site',
  },
});

/**
 * SearchWidget component class.
 * @class SearchWidget
 * @extends Component
 */
const SearchBar = ({ onClose }) => {
  const [text, setText] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const history = useHistory();
  const intl = useIntl();
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setText('');
      setVisible(false);
    },
  });
  const inputRef = React.useRef(null);

  const onChangeText = (e, { value }) => {
    setText(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setVisible(false);
    const basePath = `${intl.locale}/search`;
    const searchParams = `SearchableText=${encodeURIComponent(text)}&Language=${
      intl.locale
    }`;
    const newPath = `/${basePath}?${searchParams}`;
    history.push(newPath);
    setText('');
    // onClose();
  };

  return (
    <div ref={ref} className="searchbar">
      <Form action="/search" onSubmit={onSubmit}>
        <Form.Field className={`searchbox${visible ? ' visible' : ''}`}>
          <Input
            id="search-input"
            ref={inputRef}
            aria-label={intl.formatMessage(messages.searchSite)}
            onChange={onChangeText}
            name="SearchableText"
            value={text}
            transparent
            autoComplete="off"
            placeholder={intl.formatMessage(messages.searchSite)}
            title={intl.formatMessage(messages.search)}
          />
          <button
            className="Search-main-button"
            id="search-button"
            type="submit"
            aria-label={intl.formatMessage(messages.search)}
            onClick={(e) => {
              if (!text?.length) {
                e.preventDefault();
                if (inputRef?.current) {
                  inputRef.current.focus();
                }
                setVisible(true);
              } else {
                onSubmit(e);
              }
            }}
          >
            {intl.formatMessage(messages.search)}
          </button>
        </Form.Field>
      </Form>
    </div>
  );
};

export default SearchBar;
