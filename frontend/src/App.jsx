import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { UserProvider, useUser } from "./components/UserContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ApplicationsPage from "./pages/ApplicationsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import CompanyPage from "./pages/CompanyPage";
import WithAuth from "./components/WithAuth";
import DataPage from "./pages/DataPage";
import SettingsPage from "./pages/SettingsPage";
import "./index.css";

// can't access main pages if not logged in
const ProtectedHome = WithAuth(HomePage);
const ProtectedApplications = WithAuth(ApplicationsPage);
const ProtectedCompanies = WithAuth(CompanyPage);
const ProtectedData = WithAuth(DataPage);
const ProtectedSettings = WithAuth(SettingsPage);

function Root() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

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
        path: "companies",
        Component: ProtectedCompanies,
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

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <div id="main-content" data-theme={theme}>
      {<RouterProvider router={router} />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}
