/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { UniversalLink } from '@plone/volto/components';
import { toBackendLang } from '@plone/volto/helpers';

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = () => {
  const { settings } = config;
  const lang = useSelector((state) => state.intl.locale);

  return (
    <UniversalLink
      className="site-logo"
      href={settings.isMultilingual ? `/${toBackendLang(lang)}` : '/'}
      title="Bonnefanten Maastricht"
    >
      <span class="block">B</span>
      <span class="slab">o</span>
      <span class="gothic">n</span>
      <span class="slab">n</span>
      <span class="block">e</span>
      <span class="gothic">f</span>
      <span class="slab">a</span>
      <span class="block">n</span>
      <span class="gothic">t</span>
      <span class="slab">e</span>
      <span class="block">n</span>
    </UniversalLink>
  );
};

export default Logo;
