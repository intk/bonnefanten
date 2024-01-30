import React, { createContext } from 'react';
import NavItem from './NavItem';
import { MenuProvider } from './MenuContext';

const NavItems = ({ items, lang, onClose }) => {
  return (
    <MenuProvider>
      <ul className="nav-items">
        {items.map((item) => (
          <NavItem item={item} lang={lang} onClose={onClose} key={item.url} />
        ))}
      </ul>
    </MenuProvider>
  );
};

export default NavItems;
