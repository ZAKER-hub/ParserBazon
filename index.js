const axios = require('axios')

const COUNT_OF_PAGES = 10
const COUNT_OF_MOVIES_ON_PAGE = 50

const fetchMoviePlayer = async () => {
    let movies = []

    for (let page = 0; page < COUNT_OF_PAGES; page++) {
        const response = await axios.request( {
            url: 'https://videocdn.tv/api/movies',
            method: 'get',
            params: {
                page,
                limit: COUNT_OF_MOVIES_ON_PAGE,
                api_token: 'LSQuzDpZeVxKP4EWfzCKAUMhTy2Zj3XS'
            }
        })

        movies.push(...response.data.data)
    }

    return movies
}

const formatMoviesData = async () => {
    const movies = await fetchMoviePlayer()
    let result = []

    for (let movie of movies) {
        const response = await axios.request({
            url: `https://kinopoiskapiunofficial.tech/api/v2.1/films/${movie.kinopoisk_id}`,
            method: 'get',
            params: {
                'append_to_response': 'RATING',
            },
            headers: {
                'X-API-KEY': '62d26150-2088-4c42-946e-c4ae522967bb',
            }
        })

        const { data } = response.data
        const { rating } = response.data

        result.push({
            title_ru: data.nameRu,
            title_en: data.nameEn,
            kinopoisk_id: data.filmId,
            poster: data.posterUrl,
            year: data.year,
            slogan: data.slogan,
            description: data.description,
            type: data.type,
            time: data.filmLength,
            genres: data.genres.map(genre => genre.genre),
            countries: data.countries.map(country => country.country),
            rating: rating.rating,
            player: movie.preview_iframe_src
        })
    }

    console.log(result)
}

formatMoviesData()