export const GridSchema = (props) => {
  return {
    title: 'Preview collection Block',
    block: '__grid',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['linkTitle', 'linkHref', 'btnStyle'],
      },
      {
        id: 'slideshow',
        title: 'Slideshow Elements',
        fields: ['sliderelementslink'],
      },
    ],
    properties: {
      linkTitle: {
        title: 'Button title',
      },
      linkHref: {
        title: 'Buttons link',
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
      sliderelementslink: {
        title: 'Folder of the images',
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: ['Title', 'Description'],
        allowExternals: false,
      },
    },

    required: [],
  };
};

// props.data.sliderelementslink[0]['@id']
