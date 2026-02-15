import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('moonlight_api_key');
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem('moonlight_api_key', key);
    } else {
      localStorage.removeItem('moonlight_api_key');
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isModalOpen, setModalOpen }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) throw new Error('useApiKey must be used within ApiKeyProvider');
  return context;
};