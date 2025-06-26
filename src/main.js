import './style.css'
import { PeliculasEndpoint, apiKey, ImagenEndpoint } from './endpoints.js'

// Initial state
const userPrefersSpanish = navigator.language && navigator.language.startsWith('es');
const savedLanguage = localStorage.getItem('language');
const initialLanguage = savedLanguage || (userPrefersSpanish ? 'Español' : 'Inglés');

// Apply initial language
document.documentElement.setAttribute('data-language', initialLanguage);


// Texto en ingles y español
const texts = {
  'Español': {
    logo: 'PeliculasAPP',
    textWelcome1:'Descubre tu próxima película favorita',
    textWelcome2:'Explora miles de películas organizadas por género y encuentra exactamente lo que buscas',
    changeLanguage: '🌐 Cambiar a Inglés',
    viewMovies: 'Ver Películas',
    returnLanguage: 'Ver Categorías',
    searchMovies:'Buscar película por título',
    loadingMovies:'Cargando películas...',
  },
  'Inglés': {
    logo: 'MoviesAPP',
    textWelcome1:'Discover your next favorite movie',
    textWelcome2:'Discover thousands of movies organized by genre and find exactly what you are looking for',
    changeLanguage: '🌐 Change to Spanish',
    viewMovies: 'View Movies',
    returnLanguage: 'Return to Categories',
    searchMovies:'Search for a movie by title',
    loadingMovies:'Loading movies...',
  }
};

// creamos la estructura de la pagina 
const app = document.querySelector('#app');
const header = document.createElement('header');
const mainContent = document.createElement('main');
mainContent.className= "main-container";
const heroSection = document.createElement('section');
heroSection.className="hero-section";
const searchSection = document.createElement('section');
searchSection.className="search-section";
const categoriesSection = document.createElement('section');
const footer = document.createElement('footer');

// Idioma por defecto
let currentLanguage = initialLanguage;

// Cambiar idioma 
const cambiarIdioma = () => {
 currentLanguage = currentLanguage === 'Español' ? 'Inglés' : 'Español';
 localStorage.setItem('language', currentLanguage);
 document.documentElement.setAttribute('data-language', currentLanguage);
  updateUI();
};

// Metodo para calcular las estrellas --omitido en el nuevo diseño
/* const generateStars = (voteAverage) => {
  const fullStars = Math.floor(voteAverage / 2);
  const halfStar = (voteAverage % 2) >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  return starsHtml;
}; */

// Hacer la funcion global
window.cambiarIdioma = cambiarIdioma;


// Actualiza el texto del header y contenido de acuerdo al lenguaje seleccionado
/*   <h1>${texts[currentLanguage].welcome}</h1>
      <button id="categorias-btn" class="language-btn" >${texts[currentLanguage].returnLanguage}</button>
      <button id="language-btn" class="language-btn" >${texts[currentLanguage].changeLanguage}</button> */
const updateUI = () => {
  const header = document.querySelector('header');
  if (header) { // valida si existe la etiqueta header
    header.className="header";
    header.innerHTML = `
      <div class="nav-container">
      <h1 class="logo">${texts[currentLanguage].logo}</h1>
        <div class="nav-buttons">
            <button class="nav-btn btn-primary" id="categorias-btn">${texts[currentLanguage].returnLanguage}</button>
            <button class="nav-btn btn-secondary" id="language-btn">${texts[currentLanguage].changeLanguage}</button>
        </div>
      </div>
      `;

    // Hero section
    //const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.innerHTML = `
      <div class="hero-content">
        <h2 class="hero-title">${texts[currentLanguage].textWelcome1}</h2>
        <p class="hero-subtitle">${texts[currentLanguage].textWelcome2}</p>
      </div>
      `;
    } // end hero

    // Search section
    // const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.innerHTML = `
      <div class="search-container">
        <input type="text"  class="search-input" id="search-input" placeholder="${texts[currentLanguage].searchMovies}">
        <button class="search-btn" id="search-btn"> 
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
           </svg>
        </button>
      </div>
      `;
    } // end search

    // Se movieron al metodo UpdateUI para que se vuelva a asociar el evento click
    //  despues de renderizar el header
    const btnCategorias = document.querySelector('#categorias-btn');
    const languageBtn = document.querySelector('#language-btn');
    if (btnCategorias) {
      btnCategorias.addEventListener('click',getGeneros);
    }
    if (languageBtn) {
      languageBtn.addEventListener('click',cambiarIdioma);
    }
  }

  // Volver a realizar la petición con el lenguaje seleccionado
  const moviePages = document.querySelector('.movie-card');
  console.log("update UI CategoriesContainer",moviePages)
  if (moviePages) {
    getPeliculasPorGenero(localStorage.getItem('generoId'));
  }else{
     getGeneros();
  }
}

// Opciones de la petición. La Api pide key de autenticación
const options ={
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
};

// Obtener los Generos de las peliculas
const getGeneros =()=>
  {
    // De acuerdo al lenguaje seleccionado se realiza la petición a la API
    const apiLanguage = currentLanguage === 'Español' ? 'es' : 'en';
    
    // URL de la API -- endpoint generos
    fetch(PeliculasEndpoint.generos(apiLanguage), options)
    // Respuesta de la API se convierte a JSON
    .then((res)=>res.json())
    // Imprimir el json en consola
    .then((data)=>{
      console.log(data);
      // Limpiar el contenido de mainContent
      categoriesSection.innerHTML = '';
      //Crear un div contenedor de categorias
      const categoriesContainer = document.createElement('div');
      categoriesContainer.className="categories-grid";
      categoriesContainer.id="categoriesGrid";
      categoriesSection.appendChild(categoriesContainer);
      // Agregar categorias al section de CategoriasContainer
      data.genres.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'category-card loading glow-effect';
        card.style.animationDelay = (index * 0.1) + 's';
        card.innerHTML = `
            <span class="category-icon">${category.icon || ''}</span>
            <h3 class="category-title">${category.name}</h3>
            <button class="category-btn" id="${category.id}">
                ${texts[currentLanguage].viewMovies}
            </button>
        `;
        
        // Efecto Hover  
        card.addEventListener('mouseenter', function() {
            this.style.setProperty('--category-color', category.color);
        });
        
        categoriesContainer.appendChild(card);
    });

      // Agregar evento click a los botones pasando el id de genero
      const buttons = document.querySelectorAll('.category-btn');
      buttons.forEach((btn)=>{
        btn.addEventListener('click',()=>{
          getPeliculasPorGenero(btn.id);
          localStorage.setItem('generoId', btn.id);
        })
      })
    })
    // si hay errores imprimirlos en consola
    .catch((err)=>console.error(err));
  }

// Obtener detalle de las películas
const getDetallesPelicula= (id)=>{
    console.log(id);
  }

// Obtener las peliculas al seleccionar el género
const getPeliculasPorGenero =(id)=>
  {
     const grid = document.getElementById('categoriesGrid');
            
            // Add loading animation
    grid.innerHTML = `<div class="loading-spinner">${texts[currentLanguage].loadingMovies}</div>`;

    // Get language code for API
    const apiLanguage = currentLanguage === 'Español' ? 'es-ES' : 'en-US';
    
    // Limpiar contenido de main-content
    categoriesSection.innerHTML = '';
      //Crear un div contenedor de peliculas por categoría
      const peliculasContainer = document.createElement('div');
      peliculasContainer.className="categories-grid";
      peliculasContainer.id="categoriesGrid";
      categoriesSection.appendChild(peliculasContainer);
    // URL de la API -- endpoint
    fetch(PeliculasEndpoint.peliculasCategoria(id, apiLanguage), options)
    // Respuesta de la API se convierte a JSON
    .then((res)=>res.json())
    // Imprimir el json en consola
    .then((data)=>{
      console.log(data);
      data.results.forEach((pelicula,index)=>{
        //tarjeta de peliculas
      const movieCard = document.createElement('div');
                    movieCard.className = 'movie-card';
                    movieCard.style.animationDelay = (index * 0.1) + 's';
                    
                    movieCard.innerHTML = `
                        <div class="movie-poster">
                            <img src="${ImagenEndpoint.base}/${pelicula.poster_path}" alt="${pelicula.title}" loading="lazy">
                            <div class="movie-overlay">
                                <button class="play-btn" onclick="playMovie('${pelicula.title}')">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </button>
                                <button class="info-btn" onclick="showMovieInfo('${pelicula.title}')">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="movie-rating">
                                <span class="rating-stars">★</span>
                                <span class="rating-number">${(pelicula.vote_average).toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${pelicula.title}</h3>
                            <div class="movie-meta">
                                <span class="movie-year">${pelicula.year || 'Desconocido'}</span>
                                <span class="pelicula-duration">${pelicula.duration || 'Desconocido'}</span>
                            </div>
                            <p class="movie-description">${pelicula.overview}</p>
                            <div class="movie-actions">
                                <button class="like-btn" onclick="toggleLike(this, '${pelicula.title}')">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                    <span class="like-count">${pelicula.vote_count}</span>
                                </button>
                                <button class="watch-btn" onclick="playMovie('${pelicula.title}')">
                                    Ver Ahora
                                </button>
                            </div>
                        </div>
                    `
                    peliculasContainer.appendChild(movieCard);

                   
      })
        // Efecto de Animación de peliculas
          const movieCards = grid.querySelectorAll('.movie-card');
          movieCards.forEach(card => {
              card.classList.add('loading');
              getDetallesPelicula(pelicula.id);
          });
    })
    // si hay errores imprimirlos en consola
    .catch((err)=>console.error(err));


  }

//Inyectar HTML
app.appendChild(header);
app.appendChild(mainContent);
mainContent.appendChild(heroSection);
mainContent.appendChild(searchSection);
mainContent.appendChild(categoriesSection);
app.appendChild(footer);


// Para cargar los generos de las peliculas al iniciar la aplicacion
updateUI();

