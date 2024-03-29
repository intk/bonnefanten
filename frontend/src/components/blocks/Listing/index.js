import ListingsBlockTemplate from '@package/components/blocks/Listing/ListingTemplate';
import CategoryBlockTemplate from '@package/components/blocks/Listing/CategoryTemplate';
import SubcategoryBlockTemplate from '@package/components/blocks/Listing/SubcategoryTemplate';
import MasonryBlockTemplate from '@package/components/blocks/Listing/MasonryTemplate';
import MakerPageTemplate from '@package/components/blocks/Listing/MakerPageTemplate';
import CollectionSliderTemplate from '@package/components/blocks/Listing/CollectionSliderTemplate';
import PermanentExhibitionsTemplate from '@package/components/blocks/Listing/PermanentExhibitionsTemplate';
import HomepageSliderTemplate from '@package/components/blocks/Listing/HomepageSliderTemplate';
import NutezienSliderTemplate from './NutezienSliderTemplate';
import VerwachtSliderTemplate from './VerwachtSliderTemplate';
import WhatsonTemplate from './WhatsonTemplate';
import TedoenTemplate from './TedoenTemplate';
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
      id: 'subcategories',
      isDefault: false,
      title: 'Subcategory',
      template: SubcategoryBlockTemplate,
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
    {
      id: 'nuteziensliderview',
      isDefault: false,
      title: 'Nutezien Slider',
      template: NutezienSliderTemplate,
    },
    {
      id: 'verwachtsliderview',
      isDefault: false,
      title: 'Verwacht Slider',
      template: VerwachtSliderTemplate,
    },
    {
      id: 'whatsonview',
      isDefault: false,
      title: 'Whatson Listing',
      template: WhatsonTemplate,
    },
    {
      id: 'tedoenview',
      isDefault: false,
      title: 'Homepage Tedoen Listing',
      template: TedoenTemplate,
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
