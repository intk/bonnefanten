import { useSelector } from 'react-redux';

export default function useNutezienContent() {
  const currentLang = useSelector((state) => state.intl.locale);
  const content = useSelector(
    (state) =>
      state.content.subrequests?.[`nutezien-${currentLang}`]?.data || {},
  );

  return content;
}
