import installBlocks from './components/blocks';
import TagManager from 'react-gtm-module';
import MultipleContentView from './components/theme/View/MultipleContentView';
import ArtworkView from './components/theme/View/ArtworkView';
import AuthorView from './components/theme/View/AuthorView';
import { getContent } from '@plone/volto/actions';

// All your imports required for the config here BEFORE this line
import '@plone/volto/config';

const tagManagerArgs = {
  gtmId: 'GTM-PTCC6J6',
};

__CLIENT__ && !__DEVELOPMENT__ && TagManager.initialize(tagManagerArgs);

export default function applyConfig(config) {
  if (__DEVELOPMENT__) {
    config.settings.apiPath = 'http://localhost:8080/Plone';
    config.settings.internalApiPath = 'http://localhost:8080/Plone';
  }

  config.settings.isMultilingual = true;
  config.settings.supportedLanguages = ['en', 'nl'];
  config.settings.defaultLanguage = 'en';

  config.settings.navDepth = 2;

  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: '',
      GET_CONTENT: ['translations', ''],
    },
  ];

  config.blocks.initialBlocks = {
    ...config.blocks.initialBlocks,
    Document: ['title', 'description'],
    Event: ['title', 'description'],
    'News Item': ['title', 'description'],
  };

  config.blocks.groupBlocksOrder.push({
    id: 'Storytelling',
    title: 'Storytelling',
  });

  config.blocks.initialBlocksFocus = {
    ...config.blocks.initialBlocksFocus,
    Document: 'title',
    Event: 'title',
    'News Item': 'title',
  };
  delete config.views.layoutViews.document_view;
  config.views.layoutViewsNamesMapping = {
    ...config.views.layoutViewsNamesMapping,
    artwork_view: 'Artwork',
  };
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    artwork: ArtworkView,
  };
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    author: AuthorView,
  };

  config.views.layoutViews.multiple_content = MultipleContentView;
  config.views.layoutViewsNamesMapping.multiple_content = 'Section layout';

  if (config.settings['volto-gdpr-privacy']) {
    config.settings['volto-gdpr-privacy'].defaultPanelConfig = {
      ...config.settings['volto-gdpr-privacy'].defaultPanelConfig,
      last_updated: '2022-12-10T00:07:00+00:00',
      text: {
        en: {
          title: 'This site uses cookies',
          description:
            'For this website we use cookies for anonymous analytics gathering and show external content. You can also enable third parties independently.',
        },
      },
      technical: {
        text: {
          en: {
            title: 'Required cookies',
            description:
              'This website uses cookies for visitor analytics and login functionality. No personal identifiable information is collected or exchanged with third parties.',
          },
        },
        choices: [],
      },
      profiling: {
        text: {
          en: {
            title: 'Third party integrations',
            description:
              'To show rich content from other websites we use integrations from third parties. These might set cookies and collect personal data that can be used for profiling purposes across websites. You can disable individual services below.',
          },
        },
        choices: [
          ...config.settings['volto-gdpr-privacy'].defaultPanelConfig.profiling
            .choices,
          {
            config_key: 'GTAG',
            text: {
              en: {
                title: 'Google Tag Manager',
                description:
                  'Google Tag Manager is a tag management system that allows you to manage and deploy marketing tags (snippets of code or tracking pixels) on your website. Google Tag Manager does not collect any personal data.',
              },
            },
          },
        ],
      },
    };
  }

  const DEFAULT_LANG = 'nl';

  config.settings.siteDataPageId = 'nutezien';

  config.settings.asyncPropsExtenders = [
    ...config.settings.asyncPropsExtenders,
    {
      path: '/',
      key: 'nutezien',
      extend: (dispatchActions) => {
        const action = {
          key: 'nutezien',
          promise: ({ location, store }) => {
            // const currentLang = state.intl.locale;
            const bits = location.pathname.split('/');
            const currentLang =
              bits.length >= 2 ? bits[1] || DEFAULT_LANG : DEFAULT_LANG;

            const state = store.getState();
            if (state.content.subrequests?.[`footer-${currentLang}`]?.data) {
              return;
            }

            const siteDataPageId = config.settings.siteDataPageId;
            const url = `/${currentLang}/${siteDataPageId}`;
            const action = getContent(url, null, `nutezien-${currentLang}`);
            return store.dispatch(action).catch((e) => {
              // eslint-disable-next-line
              console.log(
                `Footer links folder not found: ${url}. Please create as page
                named ${siteDataPageId} in the root of your current language and
                fill it with the appropriate action blocks`,
              );
            });
          },
        };
        return [...dispatchActions, action];
      },
    },
  ];

  config.settings['volto-editablefooter'] = {
    options: { socials: true, newsletterSubscribe: true },
  };

  return installBlocks(config);
}
