export const GridSchema = (props) => {
  return {
    title: 'Quote Block',
    block: '__grid',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['linkTitle', 'linkHref', 'btnStyle'],
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
    },

    required: [],
  };
};
