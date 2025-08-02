"use client"; // Client-side layout

import React, { ReactNode, useEffect, useState } from "react";
import { CssBaseline, CircularProgress, Box } from "@mui/material"; // Import CircularProgress for loading
import Providers from "@/redux/Providers";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import HeaderAppBar from "@/components/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../utils/theme";
import {
  getLocalStorage,
  safeJSONParse,
  setLocalStorage,
} from "@/utils/helper";
import { SESSION } from "@/utils/constants";
import Footer from "@/components/footer";
import RegistrationHeader from "@/components/RegistrationHeader";
import { getUserAccessByRoleList } from "@/redux/slices/rolesAndPermissions/userAccessByRoleSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce, isArray } from "lodash";
import { RootState } from "@/redux/store";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const debounceTime = 500;
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const token = getLocalStorage(SESSION.TOKEN); // Get token on component mount
  const isRegistrationPath = pathname?.includes("/registration");
  const dispatch: any = useDispatch();

  const getUserAccessByRoleID = (row: number) => {
    const usersPayload: any = {
      roleID: row,
    };
    dispatch(
      getUserAccessByRoleList({
        url: "/Sports/GetUserAccessByRoleID",
        payload: usersPayload,
      })
    );
  };

  const debounceGetUserAccessByRoleID = debounce(
    (roleID: number) => getUserAccessByRoleID(roleID),
    debounceTime
  );

  useEffect(() => {
    if (token && pathname) {
      const parsedData = safeJSONParse(String(token));
      if (parsedData && parsedData?.role) {
        debounceGetUserAccessByRoleID(Number(parsedData?.role));
      }
    }
    return () => {
      debounceGetUserAccessByRoleID.cancel();
    };
  }, [pathname, token]);

  //getting user access matrix here
  const userAccessByRoleData = useSelector(
    (state: RootState) => state.userAccessByRole
  );

  useEffect(() => {
    if (
      userAccessByRoleData &&
      userAccessByRoleData.data &&
      userAccessByRoleData.data.length >= 1
    ) {
      if (
        userAccessByRoleData.data[0].modules &&
        isArray(userAccessByRoleData.data[0].modules) &&
        userAccessByRoleData.data[0].modules.length >= 1
      ) {
        setLocalStorage(
          SESSION.ACCESS_MATRIX,
          JSON.stringify(userAccessByRoleData.data[0].modules)
        );
      }
    }
  }, [userAccessByRoleData]);

  useEffect(() => {
    // Update authentication state
    setIsAuthenticated(!!token);

    if (!token && pathname === "/registration") {
      setLoading(false);
      return;
    }

    if (pathname === "/login" && token) {
      router.push("/dashboard");
    } else if (
      !token &&
      pathname !== "/login" &&
      pathname !== "/registration" &&
      !pathname?.startsWith("/registration")
    ) {
      router.push("/login");
    }
    // Set loading to false after checking
    setLoading(false);
  }, [router, pathname, token]);

  // Show a loading spinner until the token check is complete
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress /> {/* Loading spinner */}
      </div>
    );
  }

  const registrationLayout = () => {
    return (
      <div>
        {isRegistrationPath && <RegistrationHeader />}
        {children}
      </div>
    );
  };

  return (
    <Providers>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {(isAuthenticated && isRegistrationPath) || !isAuthenticated ? (
          registrationLayout()
        ) : (
          <Box
            sx={{
              display: "flex",
              maxWidth: "100vw",
            }}
          >
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
              <HeaderAppBar />
              {/* {pathname && !pathname?.includes("/goalsTargets") ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={router.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <main className="bg-workspace">{children}</main>
                  </motion.div>
                </AnimatePresence>
              ) : ( */}
              <main className="bg-workspace">{children}</main>
              {/* )} */}
              <Footer />
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </Providers>
  );
};

export default RootLayout;
