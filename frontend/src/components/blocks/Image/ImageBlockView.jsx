import React from 'react';
import { ConditionalLink } from '@plone/volto/components';
import cx from 'classnames';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import SlateEditor from '@plone/volto-slate/editor/SlateEditor';

const Source = ({ source = '', sourceHref }) => (
  <span className="image-source">
    <ConditionalLink condition={!!sourceHref} to={sourceHref}>
      {source}
    </ConditionalLink>
  </span>
);

const ViewImage = (props) => {
  const { data = {}, detached } = props;
  const { source, sourceHref, imageCaption } = data;

  return (
    <div
      className={cx(
        'block image align',
        {
          center: !Boolean(data.align),
          detached,
        },
        data.align,
      )}
    >
      <figure
        className={cx('image-wrapper', {
          'full-width': data.align === 'full',
          large: data.size === 'l',
          medium: data.size === 'm',
          small: data.size === 's',
        })}
      >
        {data.url && (
          <>
            {(() => {
              const image = (
                <img
                  src={
                    isInternalURL(data.url)
                      ? // Backwards compat in the case that the block is storing the full server URL
                        (() => {
                          if (data.size === 'l')
                            return `${flattenToAppURL(
                              data.url,
                            )}/@@images/image/great`;
                          if (data.size === 'm')
                            return `${flattenToAppURL(
                              data.url,
                            )}/@@images/image/preview`;
                          if (data.size === 's')
                            return `${flattenToAppURL(
                              data.url,
                            )}/@@images/image/mini`;
                          return `${flattenToAppURL(
                            data.url,
                          )}/@@images/image/great`;
                        })()
                      : data.url
                  }
                  alt={data.alt || ''}
                  width={800}
                  loading="lazy"
                />
              );
              if (data?.href && data.href[0] && data.href[0]['@id']) {
                if (!isInternalURL(data?.href[0]['@id'])) {
                  return (
                    <a
                      target={data.openLinkInNewTab ? '_blank' : null}
                      href={data.href[0]['@id']}
                    >
                      {image}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      to={flattenToAppURL(data.href[0]['@id'])}
                      target={data.openLinkInNewTab ? '_blank' : null}
                    >
                      {image}
                    </Link>
                  );
                }
              } else {
                return image;
              }
            })()}
          </>
        )}
        <figcaption>
          {source && <Source source={source} sourceHref={sourceHref} />}
          {imageCaption && (
            <span className="image-caption">{imageCaption}</span>
          )}
          {data?.caption && (
            <SlateEditor
              className="image-caption"
              name="photo-credit"
              value={data?.caption}
              readOnly="true"
            />
          )}
        </figcaption>
      </figure>
    </div>
  );
};

const ImageBlockView = (props) => {
  const { data = {} } = props;
  return <ViewImage {...props} data={data} />;
};

export default ImageBlockView;
