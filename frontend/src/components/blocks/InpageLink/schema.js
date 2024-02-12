import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Link: {
    id: 'Inpage Link',
    defaultMessage: 'Inpage Link',
  },
});

const InpageLinkSchema = ({
  onChangeBlock,
  intl,
  data,
  openObjectBrowser,
}) => ({
  title: intl.formatMessage(messages.Link),
  fieldsets: [
    {
      id: 'default',
      fields: ['linkHref'],
      title: 'Default',
    },
  ],

  properties: {
    linkHref: {
      title: 'Call to action',
      widget: 'object_browser',
      mode: 'link',
      selectedItemAttrs: ['Title', 'Description'],
      allowExternals: true,
    },
  },
  required: [],
});

export default InpageLinkSchema;
