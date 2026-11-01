/* Aplica o tema antes da página renderizar (evita "piscar" ao carregar) */
(function () {
  var t = null;
  try { t = localStorage.getItem("ff-theme"); } catch (e) {}
  if (!t) t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
})();
