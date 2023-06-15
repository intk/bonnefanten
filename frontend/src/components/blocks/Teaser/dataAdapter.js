import { isEmpty } from 'lodash';

export const TeaserBlockDataAdapter = ({
  block,
  data,
  id,
  onChangeBlock,
  value,
}) => {
  let dataSaved = {
    ...data,
    [id]: value,
  };
  if (id === 'href' && !isEmpty(value)) {
    dataSaved = {
      ...dataSaved,
      title: data.title || value[0].Title,
      description: data.description || value[0].Description,
      head_title: value[0].head_title,
      start: value[0].start,
      end: value[0].end,
      open_end: value[0].open_end,
    };
  }
  onChangeBlock(block, dataSaved);
};
