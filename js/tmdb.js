
const { TMDB_API_KEY, TMDB_BASE_URL } = window.TMDB_CONFIG || {};

async function buscarFilmesPorTitulo(titulo) {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(titulo)}&language=pt-BR`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar filme na TMDB");

  const dados = await response.json();
  return dados.results;
}

async function buscarFilmesPopulares() {
  const url = `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1&api_key=${TMDB_API_KEY}`;
  const resposta = await fetch(url);
  const dados = await resposta.json();
  return dados.results;
}

async function buscarDetalhesDoFilme(id) {
  const [detalhesRes, creditosRes] = await Promise.all([
    fetch(`${TMDB_BASE_URL}/movie/${id}?language=pt-BR&api_key=${TMDB_API_KEY}`),
    fetch(`${TMDB_BASE_URL}/movie/${id}/credits?language=pt-BR&api_key=${TMDB_API_KEY}`)
  ]);

  if (!detalhesRes.ok || !creditosRes.ok) throw new Error("Erro ao buscar detalhes");

  const detalhes = await detalhesRes.json();
  const creditos = await creditosRes.json();

  const diretor = creditos.crew.find(p => p.job === "Director")?.name || "";
  const elenco = creditos.cast.slice(0, 3).map(a => a.name).join(", ");
  const genero = detalhes.genres.map(g => g.name).join(", ");
  const duracao = detalhes.runtime ? `${Math.floor(detalhes.runtime / 60)}h ${detalhes.runtime % 60}min` : "";
  const classificacao = detalhes.adult ? "18+" : "Livre";

  return { 
    ...detalhes,
    diretor, 
    elenco, 
    genero, 
    duracao, 
    classificacao,
    poster_path: detalhes.poster_path 
  };
}