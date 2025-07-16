import { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { UserProvider, useUser } from "./components/UserContext";
import { MantineProvider } from "@mantine/core";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
import "@mantine/dates/styles.css";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import PrivacyPage from "./pages/PrivacyPage";
import { LoadingProvider } from "./components/LoadingContext";
import SubmissionStatus from "./components/SubmissionStatus";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

// basic layout to be rendered on all pages
function Root() {
  // pop up on form submission
  const [message, setMessage] = useState({
    type: "error",
    text: "Failed to complete action.",
  }); // error or success message
  const [statusOpen, setStatusOpen] = useState(false);
  // track if interview date is modified for calendar addition
  const [interviewChanged, setInterviewChanged] = useState({});

  return (
    <>
      <Header />
      <Outlet
        context={{
          message,
          setMessage,
          statusOpen,
          setStatusOpen,
          interviewChanged,
          setInterviewChanged,
        }}
      />
      {statusOpen && (
        <SubmissionStatus
          message={message}
          setMessage={setMessage}
          setStatusOpen={setStatusOpen}
          interviewChanged={interviewChanged}
          setInterviewChanged={setInterviewChanged}
        />
      )}
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
  const [isLoading, setIsLoading] = useState(false);
  // separate loading for user to prevent page re-rendering
  const [loadingUser, setLoadingUser] = useState(true);
  // can't access main pages if not logged in
  const ProtectedHome = WithAuth(loadingUser, HomePage);
  const ProtectedApplications = WithAuth(loadingUser, ApplicationsPage);
  const ProtectedApplication = WithAuth(loadingUser, ApplicationDetailPage);
  const ProtectedCompanies = WithAuth(loadingUser, CompanyPage);
  const ProtectedCompany = WithAuth(loadingUser, CompanyDetailPage);
  const ProtectedData = WithAuth(loadingUser, DataPage);
  const ProtectedSettings = WithAuth(loadingUser, SettingsPage);

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
          Component: ProtectedCompany,
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
        {
          path: "privacy-policy",
          Component: PrivacyPage,
        },
      ],
    },
  ]);

  // loading provider for loading state
  // wraps in mantine provider for imported component functionality
  // theme provider to give theme for light/dark mode
  // userProvider to give login/user information
  return (
    <MantineProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <UserProvider setLoadingUser={setLoadingUser}>
            <LoadingProvider>
              <AppContent router={router} />
            </LoadingProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}
