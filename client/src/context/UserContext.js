import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
