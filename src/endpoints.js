export const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTZjZmY4YzhjYTk0NTdjYTQxMWJjN2Y2ZWU3NDU3ZSIsIm5iZiI6MTc1MDY5MjM5My43NjMsInN1YiI6IjY4NTk3MjI5NTVhOTQ1NGQ4YmQwZmM0ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cUBQEea5KZdPxI_T4ap-QCuesaWKHGAPyMMaZWvBLnA';
export const PeliculasEndpoint = {
    generos: (language) => `https://api.themoviedb.org/3/genre/movie/list?language=${language}`,
    peliculasCategoria: (id, language) => `https://api.themoviedb.org/3/discover/movie?&with_genres=${id}&language=${language}`
};
export const ImagenEndpoint = {
    base: "https://image.tmdb.org/t/p/w500",
    backdrop: "https://image.tmdb.org/t/p/original",
    poster: "https://image.tmdb.org/t/p/w500"
}
