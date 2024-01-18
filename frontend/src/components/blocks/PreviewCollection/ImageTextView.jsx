import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import cx from 'classnames';
import BlockRenderer from './BlockRenderer';
import { withBlockExtensions } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import './css/previewimageblock.less';
import ImageAlbum from '../../theme/ImageAlbum/ImageAlbum';

const ViewGrid = (props) => {
  const { data, path, className } = props;
  const blocksConfig =
    config.blocks.blocksConfig.__grid.blocksConfig || props.blocksConfig;

  return (
    <div
      className={cx(
        'block __grid',
        {
          [data['@type']]: data['@type'] !== '__grid',
          centered: data.align === 'center' || data.align === undefined,
          'space-between': data.align === 'space-between',
          'centered-text': data.centeredText,
          one: data?.columns?.length === 1,
          two: data?.columns?.length === 2,
          three: data?.columns?.length === 3,
          four: data?.columns?.length === 4,
        },
        className,
      )}
      id="quote-block-wrapper"
    >
      {data.headline && <h2 className="headline">{data.headline}</h2>}

      <Grid stackable stretched columns={data.columns.length}>
        {data.columns.map((column) => (
          <Grid.Column
            key={column.id}
            className={`grid-block-${column['@type']}`}
          >
            {column['@type'] === 'text' && (
              <div>
                <h4 id="preview-collection-headline">ONTDEK DE COLLECTIE</h4>
                <h2 id="preview-collection-item-title">
                  {props.content.title}
                </h2>{' '}
                <p id="preview-collection-item-description">
                  {props.content.description}
                </p>
              </div>
            )}
            <BlockRenderer
              block={column.id}
              id={column.id}
              type={column['@type']}
              data={column}
              path={path}
              blocksConfig={blocksConfig}
              buttonData={data}
            />
            {column['@type'] === 'text' && (
              <ImageAlbum
                items={props.content.items}
                itemTitle={props.content.objectTitle}
              />
            )}
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ViewGrid.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withBlockExtensions(ViewGrid);
