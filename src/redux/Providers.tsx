// Providers.tsx
'use client';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import store from './store'; // Ensure the path to your store is correct

interface ProvidersProps {
  children: ReactNode; // Type for children prop
}

// Define the Providers component
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>{children}</Provider>)
};

export default Providers;
