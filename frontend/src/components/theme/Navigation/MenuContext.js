import React, { useState, createContext } from 'react';

export const MenuContext = createContext({
  openItem: null,
  toggleItem: () => {},
});

export const MenuProvider = ({ children }) => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (itemUrl) => {
    setOpenItem(openItem === itemUrl ? null : itemUrl);
  };

  return (
    <MenuContext.Provider value={{ openItem, toggleItem }}>
      {children}
    </MenuContext.Provider>
  );
};
