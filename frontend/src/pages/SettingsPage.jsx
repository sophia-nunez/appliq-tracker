import { useTheme } from "../components/ThemeContext";
import { Scheme } from "../data/enums";
import "../styles/SettingsPage.css";
import { updateUserScheme } from "../utils/authUtils";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (e) => {
    const chosenTheme = e.target.value;

    updateUserScheme(chosenTheme);
    setTheme(chosenTheme);
  };
  return (
    <main className="settings-page">
      <h2>Settings</h2>
      <section className="settings-list">
        <p>Appearance: </p>
        <select
          id="appearance"
          name="appearance"
          value={theme}
          onChange={(e) => handleChange(e)}
          required
        >
          <option value={Scheme.LIGHT}>Light</option>
          <option value={Scheme.DARK}>Dark</option>
        </select>
      </section>
    </main>
  );
};

export default SettingsPage;
