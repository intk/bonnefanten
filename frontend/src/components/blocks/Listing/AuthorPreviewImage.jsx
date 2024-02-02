import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchContent } from '@plone/volto/actions';
import { Container } from 'semantic-ui-react';
import MakerPreview from '../../theme/MakerPreview/MakerPreview';
import { useIntl } from 'react-intl';

const AuthorPreviewImage = ({ item, authorName, onUpdateArtworkCount }) => {
  const [firstArtwork, setFirstArtwork] = useState(null);
  const dispatch = useDispatch();
  const intl = useIntl();

  useEffect(() => {
    if (!authorName) return;

    const currentPath = intl.locale;
    let authors = [];
    if (item['@type'] === 'author') {
      const authorTitle = authorName;
      authors = [authorTitle];
    }
    let authorQueryString = authors.length
      ? authors.map((author) => `"${author}"`).join(' || ')
      : undefined;

    const options = {
      portal_type: 'artwork',
      artwork_author: authorQueryString,
      path: currentPath,
      metadata_fields: ['ObjDateFromTxt'],
    };

    const fetchData = async () => {
      try {
        // Dispatch searchContent action to fetch artworks by the author
        const resultAction = await dispatch(searchContent('', options));
        if (resultAction?.items?.length > 0) {
          const sortedItems = resultAction.items.sort((a, b) =>
            a.title.localeCompare(b.title),
          );

          const firstItem = sortedItems.find((item) => item.image_scales);
          firstItem.previewImageUrl = `${firstItem['@id']}/@@images/preview_image/large`;
          onUpdateArtworkCount(authorName, sortedItems.length, firstItem);

          setFirstArtwork(firstItem);
        } else {
          // Handle case where no artworks are found
          setFirstArtwork(null);
          onUpdateArtworkCount(authorName, 0);
        }
      } catch (error) {
        setFirstArtwork(null);
        onUpdateArtworkCount(authorName, 0);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorName, dispatch, intl.locale, item]);

  return (
    <Container id="author-artwork-preview">
      {firstArtwork ? <MakerPreview {...firstArtwork} /> : ''}
    </Container>
  );
};

export default AuthorPreviewImage;
