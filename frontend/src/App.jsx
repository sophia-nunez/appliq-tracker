import { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { UserProvider, useUser } from "./components/UserContext";
import { MantineProvider } from "@mantine/core";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import CompanyPage from "./pages/CompanyPage";
import WithAuth from "./components/WithAuth";
import DataPage from "./pages/DataPage";
import SettingsPage from "./pages/SettingsPage";
import "./index.css";
import "@mantine/core/styles.css";

// basic layout to be rendered on all pages
function Root() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

// wraps content so all components have the theming
const AppContent = ({ router }) => {
  const { theme } = useTheme();
  return (
    <div id="main-content" data-theme={theme}>
      {<RouterProvider router={router} />}
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // can't access main pages if not logged in
  const ProtectedHome = WithAuth(isLoading, HomePage);
  const ProtectedApplications = WithAuth(isLoading, ApplicationsPage);
  const ProtectedApplication = WithAuth(isLoading, ApplicationDetailPage);
  const ProtectedCompanies = WithAuth(isLoading, CompanyPage);
  const ProtectedData = WithAuth(isLoading, DataPage);
  const ProtectedSettings = WithAuth(isLoading, SettingsPage);

  // sets up routes for each URL to the respectice component
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      errorElement: <NotFound />,
      children: [
        { index: true, Component: ProtectedHome },
        {
          path: "applications",
          Component: ProtectedApplications,
        },
        {
          path: "applications/:appId",
          Component: ProtectedApplication,
        },
        {
          path: "companies",
          Component: ProtectedCompanies,
        },
        {
          path: "companies/:companyId",
          Component: ProtectedCompanies, //TODO temporary, no companyDetailPage yet
        },
        {
          path: "data",
          Component: ProtectedData,
        },
        {
          path: "settings",
          Component: ProtectedSettings,
        },
        {
          path: "login",
          Component: LoginPage,
        },
        {
          path: "register",
          Component: RegisterPage,
        },
      ],
    },
  ]);

  // wraps in mantine provider for imported component functionality
  // theme provider to give theme for light/dark mode
  // userProvider to give login/user information
  return (
    <MantineProvider>
      <ThemeProvider>
        <UserProvider setIsLoading={setIsLoading}>
          <AppContent router={router} />
        </UserProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}
