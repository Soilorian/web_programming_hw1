const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "enabled") {
    htmlEl.classList.add("dark");
    themeToggle.checked = true;
} else if (savedTheme === "disabled") {
    htmlEl.classList.remove("dark");
    themeToggle.checked = false;
} else {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (systemPrefersDark) {
        htmlEl.classList.add("dark");
        themeToggle.checked = true;
    }
}

themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        htmlEl.classList.add("dark");
        localStorage.setItem("darkMode", "enabled");
    } else {
        htmlEl.classList.remove("dark");
        localStorage.setItem("darkMode", "disabled");
    }
});
