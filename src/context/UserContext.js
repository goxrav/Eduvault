import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
const [selectedBranch, setSelectedBranch] = useState(null);
const [selectedSemester, setSelectedSemester] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser, selectedBranch, setSelectedBranch, selectedSemester, setSelectedSemester }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);