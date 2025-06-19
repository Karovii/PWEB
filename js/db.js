async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("filmesDB", 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("filmes")) {
        db.createObjectStore("filmes", { keyPath: "id" });
      }
    };
    request.onsuccess = function () {
      resolve(request.result);
    };
    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function adicionarFilme(filme) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("filmes", "readwrite");
    const store = tx.objectStore("filmes");
    const request = store.put(filme);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function listarFilmes() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("filmes", "readonly");
    const store = tx.objectStore("filmes");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removerFilme(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("filmes", "readwrite");
    const store = tx.objectStore("filmes");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
