import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Quote: {
    id: 'Quote',
    defaultMessage: 'Quote',
  },
});

const QuoteSchema = ({ onChangeBlock, intl, data, openObjectBrowser }) => ({
  title: intl.formatMessage(messages.Quote),
  fieldsets: [
    {
      id: 'default',
      fields: ['text', 'author'],
      title: 'Default',
    },
  ],

  properties: {
    text: {
      title: 'Text',
    },
    author: {
      title: 'Author',
    },
  },
  required: [],
});

export default QuoteSchema;
