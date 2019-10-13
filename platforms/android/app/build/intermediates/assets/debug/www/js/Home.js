//Wait for device to be ready
const deviceReady = new Promise((resolve) =>{
    document.addEventListener("deviceready", resolve, false);
});

//wait for content to load
const DOMReady = new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", resolve, false);
});


//wait for both of the events to be fired before starting the application
Promise.all([DOMReady, deviceReady]).then(initApp);

function initApp() {
    const apiKey = "39c5c5d0e110230f59d63ffe62f44ad7";

    function onSuccess(position) {
        alert(position.coords.longitude);
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

    // Options: throw an error if no update is received every 30 seconds.
    //navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });


    $.get("http://api.themoviedb.org/3/discover/movie?api_key=" + apiKey
        + "&with_genres=18&primary_release_year=2019", function (data) {

        let movies = data.results;
        let output = '';

        for(let i = 0; i < 9; i++){

            if(movies[i].poster_path != null && movies[i].backdrop_path != null){
                output += createItem(movies[i]);
            }

        }
        $("#new_movies").html(output);
    });

    $.get("http://api.themoviedb.org/3/discover/movie?api_key="+
        apiKey +"&sort_by=popularity.desc", function (data) {

        let movies = data.results;
        let output = '';

        for(let i = 0; i < 9; i++){

            if(movies[i].poster_path != null && movies[i].backdrop_path != null){
                output += createItem(movies[i]);
            }

        }
        $("#popular_movies").html(output);
    });

    $.get("http://api.themoviedb.org/3/discover/movie?api_key="+
        apiKey +"&certification_country=US&certification=R&sort_by=vote_average.desc", function (data) {

        let movies = data.results;
        let output = '';

        for(let i = 0; i < 9; i++){

            if(movies[i].poster_path != null && movies[i].backdrop_path != null){
                output += createItem(movies[i]);
            }

        }
        $("#top_rated_movies").html(output);
    });


}

function createItem(obj) {
    return `
                        <li class="item">
                            <div class="text-center">
                                <a href="#" onclick="movieClick('${obj.id}')"><img src="http://image.tmdb.org/t/p/w92${obj.poster_path}" alt="..."></a>
                                <p><b>${obj.title}</b></p>
                            </div>
                        </li>`;

}

function movieClick(id){
    console.log(id);
    sessionStorage.setItem("movie_id", id);
    window.location = 'movie.html';
    return false;
}