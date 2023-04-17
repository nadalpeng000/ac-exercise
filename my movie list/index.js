const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIES_PER_PAGE = 12

const movies = []
let filterMovies = []
let inputFlag = false

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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
              <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
      `
  })
  dataPanel.innerHTML = rawHTML
}

function getMoivesByPage(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  if (inputFlag === false) {
    return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
  } else {
    return filterMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
  }
}

function renderPaginator(amount) {
  const pageOfMovies = Math.ceil(amount / MOVIES_PER_PAGE)
  let paginatorHTML = ''
  for (let page = 1; page <= pageOfMovies; page++) {
    paginatorHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = paginatorHTML
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

function addFavoriteMovie(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  if (list.some((movie) => movie.id === id)) {
    return alert('This movie is already saved!!')
  }
  list.push(movies.find((movie) => movie.id === id))
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-movie')) {
    addMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavoriteMovie(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('input', function onSearchFormSumitted(event) {
  event.preventDefault()
  inputFlag = true
  const keyWord = searchInput.value.trim().toLowerCase()
  filterMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyWord))
  renderList(getMoivesByPage(1))
  renderPaginator(filterMovies.length)
})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    if (inputFlag === false) {
      renderPaginator(movies.length)
    } else {
      renderPaginator(filterMovies.length)
    }
    renderList(getMoivesByPage(1))
  })
  .catch((err) => {
    console.log(err)
  })

paginator.addEventListener('click', function onPageClicked(event) {
  if (event.target.tagName === 'A') {
    renderList(getMoivesByPage(Number(event.target.dataset.page)))
  }
})
