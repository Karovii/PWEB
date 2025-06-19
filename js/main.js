document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnNova").addEventListener("click", () => {
    window.location.href = "./pages/novaLembranca.html";
  });

  document.getElementById("btnMinhas").addEventListener("click", () => {
    window.location.href = "./pages/minhasLembrancas.html";
  });

  document.getElementById("btnSurpreenda").addEventListener("click", () => {
    window.location.href = "./pages/surpreenda.html";
  });
});
