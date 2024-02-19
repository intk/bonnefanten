/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { UniversalLink } from '@plone/volto/components';
import { toBackendLang } from '@plone/volto/helpers';

const possibleClasses = ['gothic', 'slab', 'block'];

const initialLettersState = [
  {
    letter: 'B',
    theme: 'block',
    animations: [],
  },
  {
    letter: 'o',
    theme: 'slab',
    animations: [],
  },
  {
    letter: 'n',
    theme: 'gothic',
    animations: [],
  },
  {
    letter: 'n',
    theme: 'slab',
    animations: [],
  },
  {
    letter: 'e',
    theme: 'block',
    animations: [],
  },
  {
    letter: 'f',
    theme: 'gothic',
    animations: [],
  },
  {
    letter: 'a',
    theme: 'slab',
    animations: [],
  },
  {
    letter: 'n',
    theme: 'block',
    animations: [],
  },
  {
    letter: 't',
    theme: 'gothic',
    animations: [],
  },
  {
    letter: 'e',
    theme: 'slab',
    animations: [],
  },
  {
    letter: 'n',
    theme: 'block',
    animations: [],
  },
];

// Helper function to check if the current URL is the homepage
const isHomepage = (currentURL, lang) => {
  const { settings } = config;
  const homepagePath = settings.isMultilingual
    ? `/${toBackendLang(lang)}`
    : '/';
  return currentURL === homepagePath;
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
  const currentURL = window.location.pathname;

  // Determine the href dynamically
  const hrefValue = isHomepage(currentURL, lang)
    ? '#'
    : settings.isMultilingual
    ? `/${toBackendLang(lang)}`
    : '/';

  const [letters, setLetters] = useState(initialLettersState);

  useEffect(() => {
    let animationsSpan = 300;
    let transitionHeight = 0;

    let newState = [...initialLettersState];

    for (let i = 0; i < 49; i++) {
      let randomLetter = Math.floor(Math.random() * newState.length);
      transitionHeight = transitionHeight + animationsSpan;

      newState[randomLetter].initialTheme = newState[randomLetter].theme;
      newState[randomLetter].animations = [
        ...(newState[randomLetter].animations || []),
        {
          theme:
            possibleClasses[Math.floor(Math.random() * possibleClasses.length)],
          scrollHeight: transitionHeight,
        },
      ];
    }

    setLetters(newState);
  }, []);

  const updateLetters = useCallback(() => {
    let scrollY = Math.round(window.scrollY);

    let newState = [...letters];

    newState.forEach((letter, index) => {
      let themeToApply = letter.initialTheme;

      letter.animations.forEach((animation) => {
        if (scrollY >= animation.scrollHeight) {
          themeToApply = animation.theme;
        }
      });

      newState[index].theme = themeToApply;
    });

    setLetters(newState);
  }, [letters]);

  useEffect(() => {
    window.addEventListener('scroll', updateLetters);

    return () => {
      window.removeEventListener('scroll', updateLetters);
    };
  }, [updateLetters]);

  const scrolledListener = (e) => {
    if (window.scrollY > 500) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', scrolledListener);

    return () => {
      window.removeEventListener('scroll', scrolledListener);
    };
  }, []);

  return (
    <UniversalLink
      className="site-logo"
      href={hrefValue}
      title="Bonnefanten Maastricht"
    >
      {letters.map((letter, index) => (
        <span key={index} className={letter.theme}>
          {letter.letter}
        </span>
      ))}
    </UniversalLink>
  );
};

export default Logo;
