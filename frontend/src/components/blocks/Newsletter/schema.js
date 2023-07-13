import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Newsletter: {
    id: 'Newsletter',
    defaultMessage: 'Newsletter',
  },
});

const NewsletterSchema = ({
  onChangeBlock,
  intl,
  data,
  openObjectBrowser,
}) => ({
  title: intl.formatMessage(messages.Newsletter),
  fieldsets: [
    {
      id: 'default',
      fields: ['heading', 'actionHref', 'privacyLinkTitle', 'privacyLinkHref'],
      title: 'Default',
    },
  ],

  properties: {
    heading: {
      title: 'Heading',
    },
    privacyLinkTitle: {
      title: 'Privacy link title',
    },
    privacyLinkHref: {
      title: 'Privacy link URL',
      widget: 'object_browser',
      mode: 'link',
      selectedItemAttrs: ['Title', 'Description'],
      allowExternals: true,
    },
    actionHref: {
      title: 'Action URL',
      widget: 'url',
    },
  },
  required: [],
});

export default NewsletterSchema;
