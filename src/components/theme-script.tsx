const themeScript = `
  (function () {
    function getTheme() {
      if (typeof localStorage !== "undefined" && localStorage.theme) {
        return localStorage.theme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }
    var theme = getTheme();
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  })();
`;

export function ThemeScript() {
  return <script id="theme-script" dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
