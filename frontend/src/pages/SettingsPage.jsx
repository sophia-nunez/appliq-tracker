import { useTheme } from "../components/ThemeContext";
import "../styles/SettingsPage.css";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="settings-page">
      <h2>Settings</h2>
      <section className="settings-list">
        <p>
          Current theme:
          {theme === "light" ? " Light ☀️" : " Dark 🌖"}
        </p>
        <button id="toggle-mode" onClick={toggleTheme}>
          Toggle
          {theme === "dark" ? " ☀️" : " 🌖"}
        </button>
      </section>
    </main>
  );
};

export default SettingsPage;
