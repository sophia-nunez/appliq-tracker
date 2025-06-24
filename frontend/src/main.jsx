import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import ReactDOM from "react-dom/client";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import HomePage from "./pages/HomePage";
import ApplicationsPage from "./pages/ApplicationsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import CompanyPage from "./pages/CompanyPage";
import "./index.css";
import DataPage from "./pages/DataPage";

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
      { index: true, Component: HomePage },
      {
        path: "applications",
        Component: ApplicationsPage,
      },
      {
        path: "companies",
        Component: CompanyPage,
      },
      {
        path: "data",
        Component: DataPage,
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
      <AppContent />
    </ThemeProvider>
  );
}
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<App />);
