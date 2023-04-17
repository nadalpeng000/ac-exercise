const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src= ${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button type="button" class="btn btn-danger btn-del-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
      `
  })
  dataPanel.innerHTML = rawHTML
}

function addMovieModal(id) {
  const modalMovieTitle = document.querySelector('#modal-movie-title')
  const modalMoviePoster = document.querySelector('#modal-movie-poster')
  const modalMovieDate = document.querySelector('#modal-movie-date')
  const modalMovieDescription = document.querySelector('#modal-movie-description')
  modalMovieTitle.innerText = ''
  modalMoviePoster.src = ''
  modalMovieDate.innerText = ''
  modalMovieDescription.innerText = ''
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalMovieTitle.innerText = data.title
    modalMoviePoster.src = `${POSTER_URL}${data.image}`
    modalMovieDate.innerText = `Release Date:  ${data.release_date}`
    modalMovieDescription.innerText = data.description
  })
}

function delFavoriteMovie(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderList(movies)
}

dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-movie')) {
    addMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-del-favorite')) {
    delFavoriteMovie(Number(event.target.dataset.id))
  }
})

renderList(movies)
