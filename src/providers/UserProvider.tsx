// import React from 'react';
// // import {base_url}  from '../constants'
// export const userContext = React.createContext();

// function UserProvider({children}){
//     const [user, setUser] = React.useState();
//     const handleNewUser = (newUser) => {
//         setUser(newUser);

//     }

//     const value = React.useMemo(() => {
//         return {
//             user, handleNewUser
//         }

//     }, [user, handleNewUser]);



//     return (
//         <userContext.Provider value={value}>
//             {children}
//         </userContext.Provider>
//     )
// }

// export default UserProvider;


import React, { createContext, useContext, useMemo, useState } from 'react';

// Define the user type
type User = {
  id: string;
  email: string;
  role: 'manager' | 'engineer';
  name: string;
  // Add other user properties as needed
  skills?: string[];
  department?: string;
};

// Define the context type
type UserContextType = {
  user: User | null;
  isLoading: boolean;
  handleNewUser: (newUser: User | null) => void;
};

// Create context with initial value
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  const handleNewUser = (newUser: User | null) => {
    setUser(newUser);
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    handleNewUser
  }), [user, isLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;