import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Announcement: {
    id: 'Announcement',
    defaultMessage: 'Announcement',
  },
});

const AnnouncementSchema = ({
  onChangeBlock,
  intl,
  data,
  openObjectBrowser,
}) => ({
  title: intl.formatMessage(messages.Announcement),
  fieldsets: [
    {
      id: 'default',
      fields: ['Title', 'Text'],
      title: 'Default',
    },
  ],

  properties: {
    Title: {
      title: 'Announcement title',
    },
    Text: {
      title: 'Announcement text',
    },
    // linkHref: {
    //   title: 'Call to action',
    //   widget: 'object_browser',
    //   mode: 'link',
    //   selectedItemAttrs: ['Title', 'Description'],
    //   allowExternals: true,
    // },
  },
  required: [],
});

export default AnnouncementSchema;
