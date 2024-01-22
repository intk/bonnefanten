export const GridSchema = (props) => {
  return {
    title: 'Quote Block',
    block: '__grid',
    fieldsets: [
      {
        id: 'default',
        title: 'Button 1',
        fields: ['linkTitle', 'linkHref'],
      },
      {
        id: 'button 2',
        title: 'Button 2',
        fields: ['linkTitle2', 'linkHref2'],
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
      linkTitle: {
        title: 'Button 1: title',
      },
      linkHref: {
        title: 'Call to action',
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: ['Title', 'Description'],
        allowExternals: true,
      },
      linkTitle2: {
        title: 'Button 2: title',
      },
      linkHref2: {
        title: 'Call to action',
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: ['Title', 'Description'],
        allowExternals: true,
      },
    },

    required: [],
  };
};
