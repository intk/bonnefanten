import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import cx from 'classnames';
import BlockRenderer from './BlockRenderer';
import { withBlockExtensions } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import './css/quoteblock.less';
import { UniversalLink } from '@plone/volto/components';

const ViewGrid = (props) => {
  const { data, path, className } = props;
  const blocksConfig =
    config.blocks.blocksConfig.__grid.blocksConfig || props.blocksConfig;

  let href = data?.linkHref1?.[0]?.['@id'] || '';
  let href2 = data?.linkHref2?.[0]?.['@id'] || '';

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
        <div className="button">
          {data?.linkTitle && (
            <UniversalLink
              href={href}
              className={`text-button btn-block primary`}
            >
              {data?.linkTitle || href}
            </UniversalLink>
          )}
          {data?.linkTitle2 && (
            <UniversalLink
              href={href2}
              className={`text-button btn-block primary`}
            >
              {data?.linkTitle2 || href2}
            </UniversalLink>
          )}
        </div>
        {data.columns.map((column) => (
          <Grid.Column
            key={column.id}
            className={`grid-block-${column['@type']}`}
          >
            <BlockRenderer
              block={column.id}
              id={column.id}
              type={column['@type']}
              data={column}
              path={path}
              blocksConfig={blocksConfig}
            />
          </Grid.Column>
        ))}
        {/* Render "Click Me" button if block type is 'text' */}
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
