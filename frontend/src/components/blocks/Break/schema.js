import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Break: {
    id: 'Break',
    defaultMessage: 'Break',
  },
});

const BreakSchema = ({ onChangeBlock, intl, data, openObjectBrowser }) => ({
  title: intl.formatMessage(messages.Break),
  fieldsets: [
    {
      id: 'default',
      fields: ['style'],
      title: 'Default',
    },
  ],

  properties: {
    style: {
      title: 'Style',
      choices: [
        ['clear', 'Clear'],
        ['divider', 'Divider'],
      ],
    },
  },
  required: [],
});

export default BreakSchema;
