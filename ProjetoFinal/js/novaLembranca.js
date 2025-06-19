document.addEventListener("DOMContentLoaded", async () => {
    const slider = document.getElementById("notaUsuario");
    const notaDisplay = document.getElementById("notaDisplay");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("results");
    const movieDetails = document.getElementById("movieDetails");
    let filmesSalvos = [];
    let filmeSelecionado = null;
    const modoEdicao = new URLSearchParams(window.location.search).get('edicao') === 'true';


    openDatabase().then(async () => {
        filmesSalvos = await listarFilmes();

        if (modoEdicao) {
            const filmeParaEdicao = JSON.parse(localStorage.getItem("filmeParaEdicao"));
            if (filmeParaEdicao) {
                carregarFilmeParaEdicao(filmeParaEdicao);
            } else {
                window.location.href = "./minhasLembrancas.html";
            }
        }
    });


    async function carregarFilmeParaEdicao(filmeParaEdicao) {
        filmeSelecionado = {
            id: filmeParaEdicao.id,
            title: filmeParaEdicao.titulo,
            poster_path: filmeParaEdicao.poster_path || filmeParaEdicao.poster?.split('/').pop(),
            overview: filmeParaEdicao.sinopse,
            release_date: filmeParaEdicao.ano ? `${filmeParaEdicao.ano}-01-01` : null
        };

        document.getElementById("tituloFilme").textContent = filmeParaEdicao.titulo;
        document.getElementById("poster").src = filmeParaEdicao.poster;
        document.getElementById("notaUsuario").value = filmeParaEdicao.notaUsuario;
        notaDisplay.textContent = filmeParaEdicao.notaUsuario.toFixed(1);
        document.getElementById("opiniaoUsuario").value = filmeParaEdicao.opiniaoUsuario;

        try {
            const detalhes = await buscarDetalhesDoFilme(filmeParaEdicao.id);
            Object.assign(filmeSelecionado, {
                diretor: detalhes.diretor || filmeParaEdicao.diretor,
                genero: detalhes.genero || filmeParaEdicao.genero,
                duracao: detalhes.duracao || filmeParaEdicao.duracao,
                elenco: detalhes.elenco || filmeParaEdicao.elenco,
                classificacao: detalhes.classificacao || filmeParaEdicao.classificacao
            });
        } catch (erro) {
            console.error("Erro ao buscar detalhes:", erro);
            Object.assign(filmeSelecionado, {
                diretor: filmeParaEdicao.diretor,
                genero: filmeParaEdicao.genero,
                duracao: filmeParaEdicao.duracao,
                elenco: filmeParaEdicao.elenco,
                classificacao: filmeParaEdicao.classificacao
            });
        }

        movieDetails.classList.remove("d-none");
        input.style.display = "none";
        results.style.display = "none";
        document.getElementById("btnCancelarEdicao").style.display = "block";
    }


    slider.addEventListener("input", () => {
        notaDisplay.textContent = parseFloat(slider.value).toFixed(1);
    });

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        if (query.length < 3) {
            results.innerHTML = "";
            return;
        }

        try {
            const filmes = await buscarFilmesPorTitulo(query);
            const naoAssistidos = filmes.filter(f => !filmesSalvos.some(s => s.id === f.id));

            results.innerHTML = "";
            naoAssistidos.forEach(filme => {
                const li = document.createElement("li");
                li.className = "list-group-item list-group-item-action text-dark";
                li.textContent = filme.title;
                li.onclick = () => selecionarFilme(filme);
                results.appendChild(li);
            });
        } catch (erro) {
            console.error("Erro na busca:", erro);
            results.innerHTML = "<li class='list-group-item text-danger'>Erro ao buscar filmes</li>";
        }
    });

    async function selecionarFilme(filme) {
        filmeSelecionado = filme;

        try {
            document.getElementById("tituloFilme").textContent = filme.title;
            document.getElementById("poster").src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            document.getElementById("notaUsuario").value = "";
            notaDisplay.textContent = "0.0";
            document.getElementById("opiniaoUsuario").value = "";
            movieDetails.classList.remove("d-none");
            results.innerHTML = "";

            const detalhes = await buscarDetalhesDoFilme(filme.id);
            Object.assign(filmeSelecionado, {
                diretor: detalhes.diretor,
                genero: detalhes.genero,
                duracao: detalhes.duracao,
                elenco: detalhes.elenco,
                classificacao: detalhes.classificacao
            });
        } catch (erro) {
            console.error("Erro ao selecionar filme:", erro);
            alert("Erro ao carregar detalhes do filme");
        }
    }

    document.getElementById("btnCancelar").addEventListener("click", () => {
        movieDetails.classList.add("d-none");
        input.value = "";
        if (modoEdicao) {
            window.location.href = "./minhasLembrancas.html";
        }
    });

    document.getElementById("btnSalvar").addEventListener("click", async () => {
        try {
            if (!filmeSelecionado) {
                throw new Error("Nenhum filme selecionado");
            }

            const nota = parseFloat(document.getElementById("notaUsuario").value);
            const opiniao = document.getElementById("opiniaoUsuario").value.trim();

            if (isNaN(nota)) {
                throw new Error("Por favor, insira uma nota válida");
            }

            if (nota < 0 || nota > 10) {
                throw new Error("A nota deve ser entre 0 e 10");
            }

            if (!opiniao) {
                throw new Error("Por favor, escreva sua opinião");
            }


            const filmeData = {
                id: filmeSelecionado.id,
                titulo: filmeSelecionado.title || document.getElementById("tituloFilme").textContent,
                poster: document.getElementById("poster").src,
                diretor: filmeSelecionado.diretor || "",
                ano: parseInt(filmeSelecionado.release_date?.split("-")[0]) || 0,
                genero: filmeSelecionado.genero || "",
                duracao: filmeSelecionado.duracao || "",
                elenco: filmeSelecionado.elenco || "",
                classificacao: filmeSelecionado.classificacao || "",
                sinopse: filmeSelecionado.overview || filmeSelecionado.sinopse || "",
                notaUsuario: nota,
                notaTMDB: filmeSelecionado.vote_average || 0,
                opiniaoUsuario: opiniao, 
                dataAdicao: new Date().toISOString().split("T")[0],
                poster_path: filmeSelecionado.poster_path
            };


            console.log("Dados a serem salvos:", filmeData); 

            await adicionarFilme(filmeData);
            alert(`Lembrança ${modoEdicao ? "atualizada" : "salva"} com sucesso!`);

            if (modoEdicao) {
                localStorage.removeItem("filmeParaEdicao");
            }

            window.location.href = "./minhasLembrancas.html";
        } catch (erro) {
            console.error("Erro detalhado:", erro);
            alert(`Erro ao salvar: ${erro.message}`);
        }
    });
});