const axios = require("axios")
const mongoose = require("mongoose")
const Movie = require("./moviesModel")

mongoose.connect('mongodb://127.0.0.1:27017/test', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => { 
        console.log('MongoDB подключена')
    } )
    .catch(error => console.log(error))

const fetchMoviePlayer = async () => {
    const max_page = 10 //463
    console.log(max_page)
    let movies = []
    try{
        for(let i =0; i < max_page; i++){
            console.log(i)
            var url = `https://bazon.cc/api/json?token=0a604f3166ed1ce5fada829972bef7d8&type=film&page=${i}`
            const response = await axios.request( {
                url: url,
                method: 'get',
            })
            movies.push(...response.data["results"])
        }
        console.log("Получение данных по API завершено ...............")
        console.log(`Кол-во страниц: ${max_page-1}. Кол-во фильмов ${movies.length}.`)
        console.log(movies)
    }
    catch{
        console.log('ошибка')
    }
    
    return movies
}



const insertMoviesInDB = async function() {
    
    const movies = await fetchMoviePlayer()
    console.log("Добавление фильмов в базу....................")
    for(let movie of movies){
        try{
            const movie_model =  await Movie.create({
                kp_id: Number(movie.kinopoisk_id),
                title_ru: movie.info.rus,
                title_en: movie.info.orig,
                year: Number(movie.info.year),
                countries: movie.info.country.split(","),
                producer: movie.info.director,
                genres: movie.info.genre.split(","),
                actors: movie.info.actors,
                description: movie.info.description,
                premiere: movie.info.premiere,
                vote: Number(movie.info.rating.vote_num_imdb),
                rating: Number(movie.info.rating.rating_imdb),
                poster: movie.info.poster,
                player: movie.link
            })
        }
        catch{
            console.log('ошибка')
        }
       
    }
    console.log("Добавление в базу завершено!!!")
    
}

insertMoviesInDB()

