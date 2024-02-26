import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Button: {
    id: 'Button',
    defaultMessage: 'Button',
  },
});

const ButtonSchema = ({ onChangeBlock, intl, data, openObjectBrowser }) => ({
  title: intl.formatMessage(messages.Button),
  fieldsets: [
    {
      id: 'default',
      fields: ['linkTitle', 'linkHref', 'target', 'btnStyle'], //  'url'
      title: 'Default',
    },
  ],

  properties: {
    linkTitle: {
      title: 'Button title',
    },
    linkHref: {
      title: 'Call to action',
      widget: 'object_browser',
      mode: 'link',
      selectedItemAttrs: ['Title', 'Description'],
      allowExternals: true,
    },
    btnStyle: {
      title: 'Style',
      choices: [
        ['primary', 'Primary'],
        ['secondary', 'Secondary'],
      ],
    },
    target: {
      title: 'Target',
      choices: [
        ['_self', 'Open in this window / frame'],
        ['_blank', 'Open in new window'],
      ],
    },
  },
  required: [],
});

export default ButtonSchema;
