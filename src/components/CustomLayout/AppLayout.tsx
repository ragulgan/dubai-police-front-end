// app/AppLayout.tsx

'use client'; // This component will use client-side features

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import Sidebar from '../Sidebar';
import HeaderAppBar from '../AppBar';
import Cookies from 'js-cookie'; // For handling cookies (or use any preferred method)

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <HeaderAppBar />
        <main>{children}</main> {/* Render child pages here */}
      </Box>
    </Box>
  );
};

export default AppLayout;