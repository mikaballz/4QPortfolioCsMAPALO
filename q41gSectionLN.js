const movieForm = document.getElementById('movieForm');
const starRating = document.getElementById('starRating');
const movieList = document.getElementById('movieList');

let selectedRating = 0;

// starting point: also just the star rating
starRating.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        selectedRating = parseInt(e.target.dataset.value);
        updateStars(selectedRating);
    }
});

function updateStars(rating) {
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('selected');
        if (parseInt(star.dataset.value) <= rating) {
            star.classList.add('selected');
        }
    });
}

// loading of existing movies from localStorage
function loadMovies() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    movieList.innerHTML = '';

    movies.forEach((movie, index) => {
        const div = document.createElement('div');
        div.classList.add('movie-item');

        div.innerHTML = `
            <strong>${movie.title}</strong> (${movie.genre})<br>
            ${getStars(movie.rating)}<br>
            <button onclick="deleteMovie(${index})">Delete</button>
        `;

        movieList.appendChild(div);
    });
}

// display of star func
function getStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star ${i <= rating ? 'selected' : ''}">&#9733;</span>`;
    }
    return starsHTML;
}

// adding of movie
movieForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;

    if (!title || !genre || selectedRating === 0) {
        alert('Please fill all fields and select a rating.');
        return;
    }

    const movies = JSON.parse(localStorage.getItem('movies')) || [];


    const existingMovie = movies.find(movie => movie.title.toLowerCase() === title.toLowerCase());

    if (existingMovie) {
        // new thingy: average the ratings
        existingMovie.rating = Math.round((existingMovie.rating + selectedRating) / 2);
        existingMovie.genre = genre; 
    } 
    else {
        // adding of movies
        const movie = { title, genre, rating: selectedRating };
        movies.push(movie);
    }

    localStorage.setItem('movies', JSON.stringify(movies));

    movieForm.reset();
    selectedRating = 0;
    updateStars(selectedRating);

    loadMovies();
});

// delete the movie func
function deleteMovie(index) {

    const confirmDelete = confirm("Are you sure you want to delete this movie?");

    if (confirmDelete) {

        const movies = JSON.parse(localStorage.getItem('movies')) || [];

        movies.splice(index, 1); // remove movie

        localStorage.setItem('movies', JSON.stringify(movies));

        loadMovies(); // refresh list
    }
}

// the initial load
loadMovies();