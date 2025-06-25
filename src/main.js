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
    returnLanguage: 'Ver Categorías'
  },
  'Inglés': {
    logo: 'MoviesAPP',
    textWelcome1:'Descubre tu próxima película favorita',
    textWelcome2:'Explora miles de películas organizadas por género y encuentra exactamente lo que buscas',
    changeLanguage: '🌐 Change to Spanish',
    viewMovies: 'View Movies',
    returnLanguage: 'Return to Categories'
  }
};

const generateStars = (voteAverage) => {
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
};


// creamos la estructura de la pagina 
const app = document.querySelector('#app');
const header = document.createElement('header');
const mainContent = document.createElement('main');
const heroSection = document.createElement('section');
heroSection.className="hero-section";
const searchSection = document.createElement('section');
searchSection.className="search-section";
const categoriesSection = document.createElement('section');
const footer = document.createElement('footer');

let currentLanguage = initialLanguage;



// Cambiar idioma 
const cambiarIdioma = () => {
 currentLanguage = currentLanguage === 'Español' ? 'Inglés' : 'Español';
 localStorage.setItem('language', currentLanguage);
 document.documentElement.setAttribute('data-language', currentLanguage);
  updateUI();
};


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
        <h2>${texts[currentLanguage].textWelcome1}</h2>
        <p>${texts[currentLanguage].textWelcome2}</p>
        <button class="btn btn-primary" id="ver-peliculas-btn">${texts[currentLanguage].viewMovies}</button>
      </div>
      `;
    } // end hero

    // Search section
    // const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.innerHTML = `
      <div class="search-content">
        <input type="text" id="search-input" placeholder="Buscar película por título">
        <button class="btn btn-secondary" id="search-btn">Buscar</button>
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
  const moviePages = document.querySelector('#categoriesContainer');
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

//Inyectar HTML
app.appendChild(header);
app.appendChild(mainContent);
mainContent.appendChild(heroSection);
mainContent.appendChild(searchSection);
mainContent.appendChild(categoriesSection);
app.appendChild(footer);


// Para cargar los generos de las peliculas
updateUI();

// Hacer la funcion global
window.cambiarIdioma = cambiarIdioma;

const getPeliculasPorGenero =(id)=>
  {
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
      data.results.forEach((pelicula)=>{
        //tarjeta de peliculas
        peliculasContainer.innerHTML +=`
        <div class="card">
          <img src="${ImagenEndpoint.base}/${pelicula.poster_path}" alt="${pelicula.title}">
          <h2>${pelicula.title}</h2>
          <p>${pelicula.overview}</p>
          <div class="movie-info">
            <div class="rating">
              ${generateStars(pelicula.vote_average)}
              <span>${pelicula.vote_average.toFixed(1)}</span>
            </div>
            <div class="votes">
              <i class="fas fa-heart"></i>
              <span>${pelicula.vote_count}</span>
            </div>
          </div>
        </div>
        `
      })
      // Agrega el evento click a los botones
      const movieCards = document.querySelectorAll('.card');
      movieCards.forEach((card) => {
        card.addEventListener('click', () => {
          getDetallesPelicula(pelicula.id);
        });
      });
    })
    // si hay errores imprimirlos en consola
    .catch((err)=>console.error(err));


  }