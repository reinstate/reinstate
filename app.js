const publicKey = "e886e6be8b5bed7b740bd43081504dff";
const privateKey = "5e670c161672f2d98f2cc55226119858a167e3db";
const apiUrl = "https://gateway.marvel.com/v1/public/comics";

function generateHash(timestamp, privateKey, publicKey) {
  const hashInput = timestamp + privateKey + publicKey;
  const hash = CryptoJS.MD5(hashInput).toString(CryptoJS.enc.Hex);
  return hash;
}

function searchComic() {
  const comicTitle = document.getElementById('comicTitle').value.trim();
  if (!comicTitle) {
    alert('Please enter a comic title');
    return;
  }

  const timestamp = new Date().getTime();
  const hash = generateHash(timestamp, privateKey, publicKey);

  const url = `${apiUrl}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&title=${encodeURIComponent(comicTitle)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayResults(data.data.results);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function displayResults(results) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  if (results.length === 0) {
    resultContainer.innerHTML = 'No comics found.';
    return;
  }

  results.forEach(comic => {
    const comicCard = document.createElement('div');
    comicCard.classList.add('col-md-4', 'mb-4');

    comicCard.innerHTML = `
      <div class="card">
        <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" class="card-img-top" alt="${comic.title}">
        <div class="card-body bg-dark text-light px-4 py-5">
          <h5 class="card-title">${comic.title}</h5>
          <p class="card-text">${comic.description || 'No description available.'}</p>
          <p class="card-text"><small class="text-muted">Writers: ${comic.creators.items.map(creator => creator.name).join(', ')}</small></p>
          <p class="card-text"><small class="text-muted">Release Date: ${comic.dates.find(date => date.type === 'onsaleDate').date}</small></p>
          <p class="card-text"><small class="text-muted">Page Count: ${comic.pageCount}</small></p>
        </div>
      </div>
    `;

    resultContainer.appendChild(comicCard);
  });
}
