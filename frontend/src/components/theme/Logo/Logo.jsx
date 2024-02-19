/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { UniversalLink } from '@plone/volto/components';
import { toBackendLang } from '@plone/volto/helpers';
import { useLocation } from 'react-router-dom';

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

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = () => {
  const { settings } = config;
  const lang = useSelector((state) => state.intl.locale);
  const location = useLocation();

  const [letters, setLetters] = useState(initialLettersState);
  let isCurrentPageHomepage =
    location.pathname === '/nl' || location.pathname === '/en';

  useEffect(() => {
    isCurrentPageHomepage =
      // eslint-disable-next-line react-hooks/exhaustive-deps
      location.pathname === '/nl' || location.pathname === '/en';
  });

  const handleLogoClick = (e) => {
    // Check if not on the homepage
    if (!isCurrentPageHomepage) {
      return;
    }
    // Prevent default link behavior and scroll to top if already on the homepage
    e.preventDefault();
    window.scrollTo(0, 0);
  };

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
      href={settings.isMultilingual ? `/${toBackendLang(lang)}` : '/'}
      title="Bonnefanten Maastricht"
      onClick={handleLogoClick}
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
