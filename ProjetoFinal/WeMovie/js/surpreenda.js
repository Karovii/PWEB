document.addEventListener("DOMContentLoaded", async () => {
  const filmesSalvos = await listarFilmes();
  const assistidos = filmesSalvos.map(f => f.id);
  let filmeAleatorio = null;


  const populares = await buscarFilmesPopulares();
  const naoAssistidos = populares.filter(f => !assistidos.includes(f.id));

  if (naoAssistidos.length === 0) {
    alert("Todos os filmes populares já foram assistidos.");
    return;
  }


  filmeAleatorio = naoAssistidos[Math.floor(Math.random() * naoAssistidos.length)];
  const detalhes = await buscarDetalhesDoFilme(filmeAleatorio.id);

  document.getElementById("poster").src = `https://image.tmdb.org/t/p/w500${filmeAleatorio.poster_path}`;
  document.getElementById("titulo").textContent = filmeAleatorio.title;
  document.getElementById("sinopse").textContent = filmeAleatorio.overview;
  document.getElementById("tempo").textContent = detalhes.duracao;
  document.getElementById("elenco").textContent = detalhes.elenco;
  document.getElementById("direcao").textContent = detalhes.diretor;
  document.getElementById("ano").textContent = filmeAleatorio.release_date?.split("-")[0];
  document.getElementById("genero").textContent = detalhes.genero;
  document.getElementById("classificacao").textContent = detalhes.classificacao;
  document.getElementById("nota").textContent = filmeAleatorio.vote_average.toFixed(1);


  const estrelas = document.getElementById("estrelas");
  const nota = Math.round(filmeAleatorio.vote_average);
  estrelas.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    estrelas.innerHTML += i <= nota ? "\u2B50" : "\u2606";
  }
});
