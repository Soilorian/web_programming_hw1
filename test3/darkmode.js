const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

console.log("hi")
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (systemPrefersDark) {
    htmlEl.classList.add("dark");
    themeToggle.checked = true;
} else {
    htmlEl.classList.remove("dark");
    themeToggle.checked = false;
}

themeToggle.addEventListener("change", () => {
    htmlEl.classList.toggle("dark");
});
