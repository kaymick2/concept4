import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { isEmployerUser } from '../utils/authUtils';

const EmployerContext = createContext();

export function useEmployer() {
  return useContext(EmployerContext);
}

export function EmployerProvider({ children }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    async function checkEmployerStatus() {
      if (user) {
        const status = await isEmployerUser();
        setIsEmployer(status);
      } else {
        setIsEmployer(false);
      }
    }

    checkEmployerStatus();
  }, [user]);

  return (
    <EmployerContext.Provider value={{ isEmployer }}>
      {children}
    </EmployerContext.Provider>
  );
}