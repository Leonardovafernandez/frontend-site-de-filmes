const body = document.querySelector('body');
const root = document.querySelector(':root')

const headerSize = document.querySelector('.header');
const headerLogo = document.querySelector('.header_logo');
const headerTittle = document.querySelector('.header__title');
const headerInput = document.querySelector('.input');
const headerIcon = document.querySelector('.btn-theme');

const container = document.querySelector('.container');
const movieContainer = document.querySelector('.movies-container');
const leftIcon = document.querySelector('.btn-prev');
const movies = document.querySelector('.movies');
const rightIcon = document.querySelector('.btn-next');

const highLightSize = document.querySelector('.highlight');
const highVideoLink = document.querySelector('#highlight__video-link');
const highVideo = document.querySelector('.highlight__video');
const highTitleInfo = document.querySelector('.highlight__info');
const highTitleRating = document.querySelector('.highlight__title-rating');
const highTitle = document.querySelector('.highlight__title');
const highRating = document.querySelector('.highlight__rating');
const highGenreLaunch = document.querySelector('.highlight__genre-launch');
const highGenres = document.querySelector('.highlight__genres');
const highLaunch = document.querySelector('.highlight__launch');
const highDescription = document.querySelector('.highlight__description');

const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal__body');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenreAvarage = document.querySelector('.modal__genre-average');
const modalGenres = document.querySelector('.modal__genres');
const modalAvarage = document.querySelector('.modal__average');

let page = 1;
let id;
let filmes = [];

function applyCurrentTheme() {
    const currentTheme = localStorage.getItem("theme");

    if (!currentTheme || currentTheme === "light") {
        headerLogo.src = './assets/logo-dark.png';
        headerIcon.src = 'assets/light-mode.svg';
        leftIcon.src = 'assets/arrow-left-dark.svg';
        rightIcon.src = 'assets/arrow-right-dark.svg';
        modalClose.src = 'assets/close-dark.svg';
        root.style.setProperty("--background", "#fff");
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--input-bg-color", "#fff");
        root.style.setProperty("--text-color", "#1b2028");
        root.style.setProperty("--bg-secondary", "#ededed");
        root.style.setProperty("--rating-color", "#f1c40f");
        root.style.setProperty("--bg-modal", "#ededed");

        return;
    }

    headerLogo.src = './assets/logo.svg';
    headerIcon.src = './assets/dark-mode.svg';
    leftIcon.src = 'assets/arrow-left-light.svg';
    rightIcon.src = 'assets/arrow-right-light.svg';
    modalClose.src = 'assets/close.svg';
    root.style.setProperty("--background", "rgba(27, 32, 40, 1)");
    root.style.setProperty("--input-color", "#665F5F");
    root.style.setProperty("--input-bg-color", "#3E434D");
    root.style.setProperty("--text-color", "#fff");
    root.style.setProperty("--bg-secondary", "rgba(45, 52, 64, 1)");
    root.style.setProperty("--rating-color", "#f1c40f");
    root.style.setProperty("--bg-modal", "black");
}

applyCurrentTheme();

async function loadHighLight() {
    try {
        const response = await api.get('/movie/436969?language=pt-BR');

        const info = response.data;

        let genero = [];

        info.genres.forEach((generoCard) => {
            genero.push(generoCard.name);
        });

        highVideo.style.backgroundImage = `url(${info.backdrop_path})`;
        highTitle.textContent = info.title;
        highRating.textContent = info.vote_average;
        highDescription.textContent = info.overview;
        highGenres.textContent = genero.join(', ');

        const months = ["DE JAN DE", "DE FEV DE", "DE MAR DE", "DE ABRIL DE", "DE MAIO DE", "DE JUN DE", "DE JUL DE", "DE AGO DE", "DE SET DE", "DE OUT DE", "DE NOV DE", "DE DEZ DE"];
        let movieDate = new Date(info.release_date);
        let dataFormatada = ((movieDate.getDate() + " " + months[(movieDate.getMonth())] + " " + movieDate.getFullYear()));

        highLaunch.textContent = dataFormatada;
    } catch (error) {
        console.log(error.message);
    }
};

loadHighLight();

async function loadHighLightVideo() {
    try {
        const response = await api.get('/movie/436969/videos?language=pt-BR');

        const info = response.data;

        highVideoLink.href = `https://www.youtube.com/watch?v=${info.results[0].key}`;

    } catch (error) {
        console.log(error.message);
    }
};

loadHighLightVideo();

headerIcon.addEventListener('click', () => {
    const currentTheme = localStorage.getItem("theme");

    if (!currentTheme || currentTheme === "light") {
        localStorage.setItem("theme", "dark");
        applyCurrentTheme();
        return;
    }

    localStorage.setItem("theme", "light");
    applyCurrentTheme();
});


async function loadUserData() {
    try {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false');

        filmes = response.data.results;

        for (let i = 0; i <= 5; i++) {
            const divMovie = document.createElement('div');
            divMovie.classList.add('movie');

            const divMovieInfo = document.createElement('div');
            divMovieInfo.classList.add('movie__info');

            const spanTittle = document.createElement('span');
            spanTittle.classList.add('movie__title');

            const spanRating = document.createElement('span');
            spanRating.classList.add('movie__rating');

            const img = document.createElement('img');
            img.src = './assets/estrela.svg';
            img.alt = 'Estrela';

            movies.appendChild(divMovie);
            divMovie.appendChild(divMovieInfo);
            divMovieInfo.appendChild(spanTittle);
            divMovieInfo.appendChild(spanRating);
            spanRating.appendChild(img);

            divMovie.addEventListener('click', () => {
                const tracker = i;
                let index = 0;

                if (page === 1) {
                    index = tracker;
                };
                if (page === 2) {
                    index = tracker + 6;
                };
                if (page === 3) {
                    index = tracker + 12;
                };
                id = filmes[index].id;

                openModal();
            });
        }

        loadPage();
    } catch (error) {
        console.log(error.message);
    }
};

loadUserData();

function loadPage() {
    const movieCards = document.querySelectorAll('.movie');


    if (page === 1) {
        let index = 0;

        movieCards.forEach((movie) => {
            const spanTittle = movie.querySelector('.movie__title');
            const spanRating = movie.querySelector('.movie__rating');

            movie.style.backgroundImage = `url(${filmes[index].poster_path})`;
            spanTittle.textContent = filmes[index].title;
            spanRating.textContent = filmes[index].vote_average;

            index++;
        });
    };

    if (page === 2) {
        let index = 6;

        movieCards.forEach((movie) => {
            const spanTittle = movie.querySelector('.movie__title');
            const spanRating = movie.querySelector('.movie__rating');

            movie.style.backgroundImage = `url(${filmes[index].poster_path})`;
            spanTittle.textContent = filmes[index].title;
            spanRating.textContent = filmes[index].vote_average;

            index++;
        });
    };

    if (page === 3) {
        let index = 12;

        movieCards.forEach((movie) => {
            const spanTittle = movie.querySelector('.movie__title');
            const spanRating = movie.querySelector('.movie__rating');

            movie.style.backgroundImage = `url(${filmes[index].poster_path})`;
            spanTittle.textContent = filmes[index].title;
            spanRating.textContent = filmes[index].vote_average;

            index++;
        });
    };
};

function addPage() {
    page++;

    if (page >= 4) {
        page = 1;
    };

    if (page <= 0) {
        page = 3;
    };

    loadPage();
};

function subtractPage() {
    page--;

    if (page >= 4) {
        page = 1;
    };

    if (page <= 0) {
        page = 3;
    };

    loadPage();

};

rightIcon.addEventListener('click', () => {
    addPage();
});

leftIcon.addEventListener('click', () => {
    subtractPage();
});

async function searchMovie() {
    const filmeBuscado = headerInput.value;
    try {
        if (!filmeBuscado) {
            const response = await api.get('/discover/movie?language=pt-BR&include_adult=false');

            filmes = response.data.results;

            Page = 1;

            loadPage();
        };

        const response = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${filmeBuscado}`);

        filmes = response.data.results;

        loadPage();

        headerInput.value = "";
    } catch (error) {
        console.log(error.message);
    }
};

headerInput.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') {
        return;
    };
    searchMovie();
});

async function openModal() {
    try {
        const response = await api.get(`/movie/${id}?language=pt-BR`);

        const info = response.data;

        modal.classList.remove('hidden');

        modalTitle.textContent = info.title;
        modalImg.src = info.backdrop_path;
        modalDescription.textContent = info.overview;
        modalAvarage.textContent = info.vote_average;
        modalGenres.textContent = "";

        info.genres.forEach((generoCard) => {
            const modalGenreSpan = document.createElement('span');
            modalGenreSpan.classList.add('modal__genre');

            modalGenreSpan.textContent = generoCard.name;

            modalGenres.appendChild(modalGenreSpan);
        });
    } catch (error) {
        console.log(error.message);
    }

};

modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});
