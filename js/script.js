let elForm = document.querySelector(".js-form");
let elInputTitel = elForm.querySelector(".js-input-titel");
let elInputPage = elForm.querySelector(".js-input-page");
let elSelect = elForm.querySelector(".js-select");

let elResult = document.querySelector(".js-result");

const elTemplate = document.querySelector("#news__template").content;
const elSecondTemplate = document.querySelector("#second__template").content;
let elSpinner = document.querySelector(".js-content-spinner");
let elError = document.querySelector(".js-error");

let normalized = [];
let elModalMovie = document.querySelector(".js-modal-movie");


const renderMovie = data => {
  elResult.innerHTML = "";

  const elFragment = document.createDocumentFragment();

  elResult.addEventListener("click", (evt) => {
    if (evt.target.matches(".js-movie-info-button")) {
      let movieId = evt.target.closest(".news__item").dataset.imdbID;
  

      let foundMovie = data.Search.find(movie => {
        return movie.imdbID === movieId;
      })
  
      elModalMovie.querySelector(".js-modal-movie-title").textContent = foundMovie.Title;
      elModalMovie.querySelector(".js-modal-movie-summary").textContent = `type: ${foundMovie.Type}`;
      elModalMovie.querySelector(".js-modal-movie-year").textContent = `Year: ${foundMovie.Year}`;
    }
  })

  data.Search.forEach(data => {
    
    const copyFragment = elTemplate.cloneNode(true);

    copyFragment.querySelector(".news__img-poster").src = data.Poster;
    copyFragment.querySelector(".news__img-poster").alt = data.Title;

    copyFragment.querySelector(".news__card-title").textContent = data.Title;
    copyFragment.querySelector(".news__card-year").textContent = data.Year;
    copyFragment.querySelector(".news__item").dataset.imdbID = data.imdbID ;

    

    elFragment.append(copyFragment);
  })
  elResult.appendChild(elFragment);
};

const renderMovieSecond = data => {
  elResult.innerHTML = "";

  const elFragment = document.createDocumentFragment();
  console.log(data.Episodes);

  data.Episodes.forEach(data => {
    normalized.push({
      video: `http://www.imdb.com/title/${data.imdbID}/`
    })
    
    console.log(normalized.video);
    const copyFragment = elSecondTemplate.cloneNode(true);

    normalized.forEach(data => {
      copyFragment.querySelector(".second__img-poster").href = data.video;
    });

    copyFragment.querySelector(".second__card-title").textContent = data.Title;
    copyFragment.querySelector(".second__card-Released").textContent = data.Released;
    copyFragment.querySelector(".second__card-imdbRating").textContent = data.imdbRating;
    
    

    elFragment.append(copyFragment);
  })
  elResult.appendChild(elFragment);
};

const renderMovies = async (movie, page=1)=> {
  try {
    if (elSelect.value === "Movie") {
      let respone = await fetch(`https://www.omdbapi.com/?s=${movie}&apikey=51f50317&page=${page}`);
      const data = await respone.json();
      renderMovie(data)
    } 
    if (elSelect.value === "series") {
      let respone = await fetch(`https://www.omdbapi.com/?t=${movie}&apikey=51f50317&Season=${page}`)
      console.log(respone);
      const data = await respone.json();
      renderMovieSecond(data)
    }

    

  } catch (err) {
    renderErrors(err)
  }
    finally {
      elSpinner.classList.add("d-none");
    };
};

const renderErrors = function (error) {
  error = `movie not found`
  elError.innerHTML = `${error}`
};

function spinnnewerRemove() {
  elSpinner.classList.remove("d-none")
}

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  elError.innerHTML='';
  elResult.innerHTML='';

  spinnnewerRemove()
  let inputVal = elInputTitel.value.trim().toLowerCase();
  let inputVall = elInputPage.value
  renderMovies(inputVal, inputVall);
});