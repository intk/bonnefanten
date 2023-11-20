import React from 'react';

import { RenderBlocks } from '@plone/volto/components';
import { Container } from 'semantic-ui-react';

import { hasBlocksData, getBaseUrl } from '@plone/volto/helpers';
import ShareLinks from '@package/components/theme/ShareLinks/ShareLinks';

// Customized to hide the title blocks, as they are included in
// the header

function filterBlocks(content, types) {
  if (!(content.blocks && content.blocks_layout?.items)) return content;

  return {
    ...content,
    blocks_layout: {
      ...content.blocks_layout,
      items: content.blocks_layout.items.filter(
        (id) => types.indexOf(content.blocks[id]?.['@type']) === -1,
      ),
    },
  };
}

const DefaultView = (props) => {
  const { content, location } = props;
  const path = getBaseUrl(location?.pathname || '');

  // const description = content?.description;
  const isHeroSection = content?.has_hero_section && content?.preview_image;
  const filteredContent = filterBlocks(content, ['title', 'description']);

  return hasBlocksData(content) ? (
    <>
      {isHeroSection ? (
        <>
          <p className="documentDescription hero-description">
            {content.description}
          </p>
        </>
      ) : (
        <>
          <h1 className="documentFirstHeading">{content.title}</h1>
          {content.description ? (
            <div className="description-wrapper">
              <div className="header-quotes-wrapper">
                <div className="quote-top-left quote-bonnefanten">“</div>
                <div className="quote-top-right quote-bonnefanten">”</div>
              </div>
              <p className="documentDescription">{content.description}</p>
            </div>
          ) : (
            <div className="empty-description-wrapper"> </div>
          )}
        </>
      )}

      <div id="page-document" className="ui container">
        <div className="content-container">
          <RenderBlocks {...props} path={path} content={filteredContent} />
        </div>

        <ShareLinks />
      </div>
    </>
  ) : (
    <Container id="page-document">
      <div className="content-container">
        {/* default title+description blocks are inserted by the HeroSection */}
        {content.remoteUrl && (
          <span>
            The link address is:
            <a href={content.remoteUrl}>{content.remoteUrl}</a>
          </span>
        )}
        {content.text && (
          <div
            dangerouslySetInnerHTML={{
              __html: content.text.data,
            }}
          />
        )}

        <ShareLinks />
      </div>
    </Container>
  );
};

//    <h1 className="documentFirstHeading">{content.title}</h1>
//    {content.description && (
//      <p className="documentDescription">{content.description}</p>
//    )}
//    {content.preview_image && (
//      <Image
//        className="document-image"
//        src={content.preview_image.scales.thumb.download}
//        floated="right"
//      />
//    )}

export default DefaultView;
