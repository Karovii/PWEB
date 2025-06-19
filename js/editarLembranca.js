document.addEventListener("DOMContentLoaded", async () => {
  const filmeSalvo = JSON.parse(localStorage.getItem("filmeEdicao"));
  if (!filmeSalvo || !filmeSalvo.id) return window.location.href = "./minhasLembrancas.html";

  const poster = document.getElementById("poster");
  const sinopse = document.getElementById("sinopse");
  const titulo = document.getElementById("titulo");
  const tempo = document.getElementById("tempo");
  const elenco = document.getElementById("elenco");
  const direcao = document.getElementById("direcao");
  const ano = document.getElementById("ano");
  const genero = document.getElementById("genero");
  const classificacao = document.getElementById("classificacao");
  const nota = document.getElementById("nota");
  const opiniao = document.getElementById("opiniao");
  const notaUsuario = document.getElementById("notaUsuario");

  try {
    const detalhes = await buscarDetalhesDoFilme(filmeSalvo.id);


    if (detalhes.poster_path) {
      poster.src = `https://image.tmdb.org/t/p/w500${detalhes.poster_path}`;
    } else if (filmeSalvo.poster) {
      poster.src = filmeSalvo.poster;
    } else {
      poster.alt = "Poster não disponível";
    }


    sinopse.textContent = detalhes.overview || filmeSalvo.sinopse || "Sem sinopse.";
    titulo.textContent = detalhes.title || filmeSalvo.titulo || "";
    tempo.textContent = detalhes.duracao || filmeSalvo.duracao || "";
    elenco.textContent = detalhes.elenco || filmeSalvo.elenco || "";
    direcao.textContent = detalhes.diretor || filmeSalvo.diretor || "";
    ano.textContent = detalhes.release_date?.split("-")[0] || filmeSalvo.ano || "";
    genero.textContent = detalhes.genero || filmeSalvo.genero || "";
    classificacao.textContent = detalhes.classificacao || filmeSalvo.classificacao || "";
    nota.textContent = (detalhes.vote_average || filmeSalvo.notaTMDB || filmeSalvo.nota)?.toFixed(1) || "-";
  } catch (erro) {
    console.error("Erro ao buscar detalhes da API:", erro);

    poster.src = filmeSalvo.poster || "";
    sinopse.textContent = filmeSalvo.sinopse || "Sem sinopse.";
    titulo.textContent = filmeSalvo.titulo || "";
    tempo.textContent = filmeSalvo.duracao || "";
    elenco.textContent = filmeSalvo.elenco || "";
    direcao.textContent = filmeSalvo.diretor || "";
    ano.textContent = filmeSalvo.ano || "";
    genero.textContent = filmeSalvo.genero || "";
    classificacao.textContent = filmeSalvo.classificacao || "";
    nota.textContent = (filmeSalvo.notaTMDB || filmeSalvo.nota)?.toFixed(1) || "-";
  }

  opiniao.textContent = filmeSalvo.opiniaoUsuario || filmeSalvo.opiniao || "Sem opinião.";
  notaUsuario.textContent = filmeSalvo.notaUsuario?.toFixed(1) || "-";


  document.getElementById("btnEditar").addEventListener("click", () => {

    localStorage.setItem("filmeParaEdicao", JSON.stringify({
      id: filmeSalvo.id,
      titulo: filmeSalvo.titulo || titulo.textContent,
      poster: poster.src,
      diretor: filmeSalvo.diretor || direcao.textContent,
      ano: filmeSalvo.ano || ano.textContent,
      genero: filmeSalvo.genero || genero.textContent,
      duracao: filmeSalvo.duracao || tempo.textContent,
      elenco: filmeSalvo.elenco || elenco.textContent,
      classificacao: filmeSalvo.classificacao || classificacao.textContent,
      sinopse: filmeSalvo.sinopse || sinopse.textContent,
      notaUsuario: filmeSalvo.notaUsuario || parseFloat(notaUsuario.textContent),
      opiniaoUsuario: filmeSalvo.opiniaoUsuario || opiniao.textContent,
      dataAdicao: filmeSalvo.dataAdicao || new Date().toISOString().split("T")[0],

      overview: filmeSalvo.sinopse || sinopse.textContent,
      poster_path: filmeSalvo.poster_path || poster.src.split('/').pop()
    }));

    window.location.href = "./novaLembranca.html?edicao=true";
  });


  document.getElementById("btnApagar").addEventListener("click", async () => {
    if (confirm("Tem certeza que deseja apagar esta lembrança?")) {
      await removerFilme(Number(filmeSalvo.id));
      localStorage.removeItem("filmeEdicao");
      window.location.href = "./minhasLembrancas.html";
    }
  });
});