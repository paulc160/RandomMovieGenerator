import {useState,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {useNavigate,Link} from 'react-router-dom';
import {TEXT_STYLE} from "./styles"

const ShowRandomMovie = () => {
  const [randomMovieData, setRandomMovieData] = useState([]);
  const [movieRatings, setMovieRatings] = useState([]);
  const [genres, setGenres] = useState(null);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(false);
  const location = useLocation();
  const genreData = location.state;

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    navigate("/")
  }

  const fetchRandomMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        genreData
    }
    const url = "http://127.0.0.1:5000/randomMovie"
    const options = {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    }
    const response = await fetch(url,options)
    .then( response => response.json() )
    .then( responseData => {setRandomMovieData(responseData)})
    .then(console.log(responseData))
    .then(setLoading(false))
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMovie();
  }, []);

  if(loading){
    return(
      <div className="flex flex-col mx-auto">
        <span className="loading loading-spinner text-info"></span>
        <h1>Loading</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col m-auto w-3/4 p-5">
      <div className="pt-5 items-center mx-auto">
        <button className="btn btn-info btn-wide text-white" onClick={onSubmit}>Get Another Random Movie</button>
      </div>
      {randomMovieData && (
        <div className="pt-5">
          <div className="flex flex-row p-2">
          <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-black md:text-3xl lg:text-4xl dark:text-grey">{randomMovieData.title}</h1>
          
          <h1 className="pl-5 my-auto mb-4 text-xl font-extrabold leading-none tracking-tight text-black md:text-xl lg:text-2xl dark:text-grey">{randomMovieData.release_date}</h1>
          </div>
          <div className="flex flex-row p-2">
            <div className="flex flex-col">
              <img className="drop-shadow-2xl size-fit" src={"https://image.tmdb.org/t/p/w500/" + randomMovieData.poster_path} alt="image" />
              <div className="overflow-x-auto pt-5">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Age Rating</td>
                      <td>{randomMovieData.rating}</td>
                    </tr>
                    <tr>
                      <td>Runtime</td>
                      <td>{randomMovieData.runtime}</td>
                    </tr>
                    <tr>
                      <td>Box Office</td>
                      <td>{randomMovieData.box_office}</td>
                    </tr>
                    <tr>
                      <td>Genres</td>
                      <td>{randomMovieData.genres}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pl-5">
              <div className="flex flex-col">
                <h1 className={TEXT_STYLE}>{randomMovieData.description}</h1>
              </div>
              <div>
                <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-info md:text-xl lg:text-2xl dark:text-grey">Director</h1>
                <h1 className={TEXT_STYLE}>{randomMovieData.director}</h1>
              </div>
              <div>
                <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-info md:text-xl lg:text-2xl dark:text-grey">Starring</h1>
                <h1 className={TEXT_STYLE}>{randomMovieData.actors}</h1>
              </div>
              <div className="flex flex-col">
                <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-info md:text-xl lg:text-2xl dark:text-grey">Ratings</h1>
                <div className="flex flex-row">
                  <img 
                    className="pt-2 w-24 rounded-xl"
                    src={'/public/rt logo.png'}
                    alt="new"
                    />
                  <h1 className="pl-5 font-extrabold text-lg text-black my-auto">{randomMovieData.rotten_tomatoes_rating}</h1>
                </div>
                <div className="flex flex-row">
                <img 
                  className="pt-5 w-24 rounded-xl"
                  src={'/public/imdb logo.png'}
                  alt="new"
                  />
                  <h1 className="pl-5 font-extrabold text-lg text-black my-auto">{randomMovieData.imdb_score}</h1>
                </div>
              </div>
            </div>
          </div>
        <div>

        </div>
        </div>
      )}
    </div>
  )
}

export default ShowRandomMovie