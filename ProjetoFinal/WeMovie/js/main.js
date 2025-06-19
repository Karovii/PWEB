document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnNova").addEventListener("click", () => {
    window.location.href = "./novaLembranca.html";
  });

  document.getElementById("btnMinhas").addEventListener("click", () => {
    window.location.href = "./minhasLembrancas.html";
  });

  document.getElementById("btnSurpreenda").addEventListener("click", () => {
    window.location.href = "./surpreenda.html";
  });
});
