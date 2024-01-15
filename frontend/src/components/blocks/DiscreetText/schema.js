import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Discreet: {
    id: 'Discreet',
    defaultMessage: 'Discreet',
  },
});

const DiscreetSchema = ({ onChangeBlock, intl, data, openObjectBrowser }) => ({
  title: intl.formatMessage(messages.Discreet),
  fieldsets: [
    {
      id: 'default',
      fields: ['text'],
      title: 'Default',
    },
  ],

  properties: {
    text: {
      widget: 'slate_richtext',
      title: 'Text',
    },
  },
  required: [],
});

export default DiscreetSchema;
