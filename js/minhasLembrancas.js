document.addEventListener("DOMContentLoaded", async () => {
  const inputBusca = document.getElementById("searchInput");
  const lista = document.getElementById("listaFilmes");

  let filmesSalvos = await listarFilmes();

  function exibirFilmes(filmes) {
    lista.innerHTML = "";
    filmes.forEach(filme => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 12px 16px; transition: 0.3s; color: white;"><u>${filme.titulo}</u></td>
        <td style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 12px 16px; transition: 0.3s; text-align: right; color: gold; font-weight: bold;">
          ${filme.notaUsuario.toFixed(1)} <span>&#11088;</span>
        </td>
      `;
      linha.onclick = () => editarFilme(filme);
      lista.appendChild(linha);
    });
  }

  function filtrarFilmes(texto) {
    const termo = texto.toLowerCase();
    const filtrados = filmesSalvos.filter(filme => filme.titulo.toLowerCase().includes(termo));
    exibirFilmes(filtrados);
  }

  function editarFilme(filme) {
    localStorage.setItem("filmeEdicao", JSON.stringify(filme));
    window.location.href = "./editarLembranca.html";
  }

  inputBusca.addEventListener("input", (e) => {
    filtrarFilmes(e.target.value);
  });

  exibirFilmes(filmesSalvos);
});
