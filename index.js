const axios = require("axios")
const mongoose = require("mongoose")
const Movie = require("./moviesModel")

mongoose.connect('mongodb://127.0.0.1:27017/movies', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB подключена'))
    .catch(error => console.log(error))

const fetchMoviePlayer = async () => {
    let movies = []
    var url = 'https://pleer.video/movies.json'
    while(url){
        const response = await axios.request( {
            url: url,
            method: 'get',
        })
        movies.push(...response.data["results"])
        url = response.data["pages"]["url"]["next"]
    }
    return movies
}

const formatMoviesData = async () => {
    const movies = await fetchMoviePlayer()
    let films = []
    for(let film of movies){
        try{
            const response = await axios.request( {
                url: film["json"],
                method: 'get',
            })
            const film_json = response.data
            let poster = "https://cinexus.kz/images/posters/posts_none.png"
            if(film_json.poster === 1){
                poster = film.json.replace("json", "jpg")
            }

            films.push({
                kp_id: film_json.kp_id,
                title_ru: film_json.title_ru,
                title_en: film_json.title_en,
                year: film_json.year,
                countries: film_json.countries.split(","),
                producer: film_json.directors,
                genres: film_json.genres.split(","),
                actors: film_json.actors,
                description: film_json.description,
                premiere: film_json.premiere,
                kp_rating: film_json.kp_rating,
                imdb_rating: film_json.imdb_rating,
                poster: poster,
                player: film_json.embeds[0].iframe
                
            })
            console.log("Фильм найден")
            const movie_model = await Movie.create({
                kp_id: film_json.kp_id,
                title_ru: film_json.title_ru,
                title_en: film_json.title_en,
                year: film_json.year,
                countries: film_json.countries.split(","),
                producer: film_json.directors,
                genres: film_json.genres.split(","),
                actors: film_json.actors,
                description: film_json.description,
                premiere: film_json.premiere,
                kp_rating: film_json.kp_rating,
                imdb_rating: film_json.imdb_rating,
                poster: poster,
                player: film_json.embeds[0].iframe
            })
            
        }
        catch(error){
            console.log("Фильм не найден")
        }
        
    }
    console.log(films)
}

formatMoviesData()