/** Personnal external API key */
module.exports.PERSONAL_API_KEY = 'ae3e5728d96161eec2f5d86350cd1cdb'

/** Language */
module.exports.LNG = 'fr-FR'

/** External base API Url base */
module.exports.URL_API = 'https://api.themoviedb.org/3/'
module.exports.URL_PATH_IMG = 'https://image.tmdb.org/t/p/'

/** Local API Url base */
module.exports.URL_LOCAL_API = 'http://localhost:3000/'

module.exports.KEY_KEYWORD = '?api_key='
module.exports.API_KEY = '?api_key=' + this.PERSONAL_API_KEY

module.exports.LNG_PARAM_KEYWORD = '&language='
module.exports.QUERY_PARAM_KEYWORD = '&query='
module.exports.PAGE_PARAM_KEYWORD = '&page='
module.exports.NOINCLUDEADULTECONTENT_PARAM_KEYWORD = '&include_adult=false'
module.exports.SORTBYPOPULARITYDESC_KEYWORD = '&sort_by=popularity.desc'
module.exports.NOINCLUDEVIDEO_PARAM_KEYWORD = '&include_video=false'
module.exports.WITHGENRES_PARAM_KEYWORD = '&with_genres='

module.exports.PAGE_URL_KEYWORD = '/page/'
module.exports.SEARCH_URL_KEYWORD = 'search/'
module.exports.TAG_URL_KEYWORD = '/tag/'
module.exports.LIST__URL_KEYWORD = '/list'
module.exports.GENRE_URL_KEYWORD = '/genre/'
module.exports.CREDITS_URL_KEYWORD = '/credits'
module.exports.TAGS_URL_KEYWORD = '/tags'

module.exports.LOCAL_SOURCE_KEYWORD = 'local'
module.exports.TV_KEYWORD = 'tv'
module.exports.MOVIE_KEYWORD = 'movie'
module.exports.NOW_PLAYING_TV = 'on_the_air'
module.exports.NOW_PLAYING_MOVIE = 'now_playing'

module.exports.URL_API_GENRE = this.URL_API + 'genre/'
module.exports.URL_API_SEARCH = this.URL_API + this.SEARCH_URL_KEYWORD
module.exports.URL_API__DISCOVER = this.URL_API + 'discover/'

/** External API image constant */
module.exports.PATH_IMG_300 = this.URL_PATH_IMG + 'w300/'
module.exports.PATH_IMG_200 = this.URL_PATH_IMG + 'w200/'
module.exports.PATH_IMG_FACE_138_175 = this.URL_PATH_IMG + 'w138_and_h175_face'

/** Maximum item per page */
module.exports.MAX_PER_PAGE = 20
module.exports.MAX_PER_ROW = 5
