import ListingsBlockTemplate from '@package/components/blocks/Listing/ListingTemplate';
import CategoryBlockTemplate from '@package/components/blocks/Listing/CategoryTemplate';
import MasonryBlockTemplate from '@package/components/blocks/Listing/MasonryTemplate';
import MakerPageTemplate from '@package/components/blocks/Listing/MasonryTemplate';
import CollectionSliderTemplate from '@package/components/blocks/Listing/CollectionSliderTemplate';
import PermanentExhibitionsTemplate from '@package/components/blocks/Listing/PermanentExhibitionsTemplate';
import HomepageSliderTemplate from '@package/components/blocks/Listing/HomepageSliderTemplate';
// import MasonryTemplate from './MasonryTemplate';

export default (config) => {
  config.blocks.blocksConfig.listing.schemaEnhancer = ({ schema }) => {
    // move querystring to its own fieldset;
    schema.fieldsets[0].fields = schema.fieldsets[0].fields.filter(
      (f) => f !== 'querystring',
    );
    schema.fieldsets.splice(1, 0, {
      id: 'querystring',
      title: 'Query',
      fields: ['querystring'],
    });

    schema.properties = {
      ...schema.properties,
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
      showDescription: {
        title: 'Show description',
        type: 'boolean',
        default: false,
      },
    };

    schema.fieldsets[0].fields.splice(
      2,
      0,
      'linkHref',
      'linkTitle',
      'showDescription',
    );

    return schema;
  };

  config.blocks.blocksConfig.listing.variations = [
    // ...config.blocks.blocksConfig.listing.variations,
    {
      id: 'listings',
      isDefault: true,
      title: 'Listing',
      template: ListingsBlockTemplate,
    },
    {
      id: 'categories',
      isDefault: false,
      title: 'Category',
      template: CategoryBlockTemplate,
    },
    {
      id: 'masonary',
      isDefault: false,
      title: 'Masonry',
      template: MasonryBlockTemplate,
    },
    {
      id: 'makerpage',
      isDefault: false,
      title: 'Maker Page',
      template: MakerPageTemplate,
    },
    {
      id: 'collectionsliderview',
      isDefault: false,
      title: 'Collection Slider Wiew',
      template: CollectionSliderTemplate,
    },
    {
      id: 'permanentexhibitionsview',
      isDefault: false,
      title: 'Permanent Exhibitions Wiew',
      template: PermanentExhibitionsTemplate,
    },
    {
      id: 'homepagesliderview',
      isDefault: false,
      title: 'Homepage Slider Wiew',
      template: HomepageSliderTemplate,
    },
  ];

  // config.blocks.blocksConfig.listing.variations = [
  //   // ...config.blocks.blocksConfig.listing.variations,

  //   {
  //     id: 'listings',
  //     isDefault: true,
  //     title: 'Cards',
  //     template: ListingsBlockTemplate,
  //   },
  //   {
  //     id: 'search_listing',
  //     isDefault: false,
  //     title: 'Masonry',
  //     template: MasonryTemplate,
  //   },
  // ];

  return config;
};
