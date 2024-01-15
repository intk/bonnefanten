import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Button: {
    id: 'Button',
    defaultMessage: 'Button',
  },
});

const EventPageButtonSchema = ({
  onChangeBlock,
  intl,
  data,
  openObjectBrowser,
}) => ({
  title: intl.formatMessage(messages.Button),
  fieldsets: [
    {
      id: 'default',
      fields: ['btnStyle'], //  'url'
      title: 'Default',
    },
  ],

  properties: {
    btnStyle: {
      title: 'Style',
      choices: [
        ['primary', 'Primary'],
        ['secondary', 'Secondary'],
      ],
    },
  },
  required: [],
});

export default EventPageButtonSchema;
