/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */
import { useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { UniversalLink } from '@plone/volto/components';
import { toBackendLang } from '@plone/volto/helpers';

const possibleClasses = ['gothic', 'slab', 'block'];

const lettersReducer = (state, action) => {
  let randomLetter = Math.floor(Math.random() * state.length);

  state[randomLetter].theme =
    possibleClasses[Math.floor(Math.random() * possibleClasses.length)];

  return state;
};

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = () => {
  const { settings } = config;
  const lang = useSelector((state) => state.intl.locale);

  const [letters, dispatchLettersChange] = useReducer(lettersReducer, [
    {
      letter: 'B',
      theme: 'block',
    },
    {
      letter: 'o',
      theme: 'slab',
    },
    {
      letter: 'n',
      theme: 'gothic',
    },
    {
      letter: 'n',
      theme: 'slab',
    },
    {
      letter: 'e',
      theme: 'block',
    },
    {
      letter: 'f',
      theme: 'gothic',
    },
    {
      letter: 'a',
      theme: 'slab',
    },
    {
      letter: 'n',
      theme: 'block',
    },
    {
      letter: 't',
      theme: 'gothic',
    },
    {
      letter: 'e',
      theme: 'slab',
    },
    {
      letter: 'n',
      theme: 'block',
    },
  ]);

  const scrollListener = (e) => {
    if (window.scrollY > 300) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }

    let scrollOffset = Math.round(document.body.scrollHeight / 50);
    if (window.scrollY % scrollOffset === 0) {
      // dispatchLettersChange();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <UniversalLink
      className="site-logo"
      href={settings.isMultilingual ? `/${toBackendLang(lang)}` : '/'}
      title="Bonnefanten Maastricht"
    >
      {/* <span class="block">B</span>
      <span class="slab">o</span>
      <span class="gothic">n</span>
      <span class="slab">n</span>
      <span class="block">e</span>
      <span class="gothic">f</span>
      <span class="slab">a</span>
      <span class="block">n</span>
      <span class="gothic">t</span>
      <span class="slab">e</span>
      <span class="block">n</span> */}
      {letters.map((letter, index) => (
        <span key={index} className={letter.theme}>
          {letter.letter}
        </span>
      ))}
    </UniversalLink>
  );
};

export default Logo;
