import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import ReactDOM from "react-dom/client";
import HomePage from "./components/HomePage";
import ApplicationsPage from "./components/ApplicationsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import "./index.css";

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
