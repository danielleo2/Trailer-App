import React from "react";


const MovieCard = ({movie, selectMovie}) => {
    const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500/';
    return (
        <div className="movie-card" onClick={() => selectMovie(movie)}>
            {movie.poster_path ? <img className="movie-cover" alt="poster de pelicula" src={`${IMAGE_PATH}${movie.poster_path}`}/> 
            : <div className="cover-placeholder">Imagen no Disponible</div>}
            <h3 className="movie-title">{movie.title}</h3>
        </div>
    )
};

export default MovieCard;