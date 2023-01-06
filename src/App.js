import {useEffect, useState} from 'react';
import React from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';
import MovieCard from './Components/MovieCard';
//import { render } from '@testing-library/react';
const keyCode = process.env.REACT_APP_MOVIE_API_KEY;

function App() {
  const imagePath = 'https://image.tmdb.org/t/p/original/';
  const API_URL = "https://api.themoviedb.org/3";
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectMovie, setSelectMovie] = useState({});

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "/search" : "/discover";
    const {data: {results}} = await axios.get(`${API_URL}${type}/movie`, {
      params: {
        api_key: keyCode,
        query: searchKey
      }
    });
    setMovies(results);
    await movieSelection(results[0]);
  }

  const fetchMovie = async (id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: keyCode,
        append_to_response: 'videos'
      }
    })

    return data
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  const movieSelection = async (movie) => {
    const data = await fetchMovie(movie.id)
    setSelectMovie(movie)
    scrollToTop()
    console.log(data);
  }

  useEffect(() => {
    fetchMovies()
  }, [movies])

  const renderMovies = () => (
    movies.map(movie => (
      <MovieCard
      key={movie.id}
      movie={movie}
      selectMovie={movieSelection}/>
    ))
  )

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  }

  const getTrailerKey = async () => {
        if (!selectMovie || !selectMovie.id) {
          return null
        }

        const response = await axios.get(
        `${API_URL}/movie/${selectMovie.id}/videos`,
        {
          params: {
            api_key: keyCode
          },
        }
      );
      
      const trailer = response.data.results.find((video) => video.type === "Trailer");
      return trailer.key;
  }

  const MyComponent = () => {
    const [trailerKey, setTrailerKey] = useState(null);
  
    useEffect(() => {
      if (!selectMovie || !selectMovie.id) {
        return;  // Return early if the selectMovie or selectMovie.id is invalid
      }
  
      getTrailerKey().then((key) => {
        setTrailerKey(key);
      });
    }, [movieSelection]);  // The useEffect hook will run whenever the selectMovie value changes
    
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    }

      return (
        <div className='hero-ctn' style={{backgroundImage: `url('${imagePath}${selectMovie.backdrop_path}')`}}>
      <div className='trailer-show'>{isVisible && (
        <YouTube
          videoId={trailerKey}
          opts={{width:"720px", height:"480px", playerVars: {autoplay: 1,}}}
        />
      )}</div>
          <div className='hero'>
            <button className='play-btn' onClick={toggleVisibility}>Ver Trailer</button>
            <h1>{selectMovie.title}</h1>
            <div className='movie-overview'>{selectMovie.overview ? <p>{selectMovie.overview}</p> : null}</div>
          </div>
        </div>
        )
  };

  return (
    <div className="App">
      <header className='app-title'>
        <h2>Obsidian Cinema</h2>
        <form className='search-bar' onSubmit={searchMovies}>
          <input type="text" onChange={(e) => setSearchKey(e.target.value)}></input>
          <button type="submit">Buscar</button>
        </form>
      </header>
      {movieSelection ? MyComponent() : console.log('failed')}
      <div className='container'>
        {renderMovies()}
      </div>
    </div>
  );
}

export default App;
