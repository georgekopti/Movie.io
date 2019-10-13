
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

    $("#searchForm").on("submit", (e) =>{
        e.preventDefault();

        let searchedMovie = $("#searchText").val();

        if(searchedMovie.length < 1){
            alert("Please provide input");
        }else{
            getMovies(searchedMovie);
        }

    });

    function getMovies(message){

        $.get("http://api.themoviedb.org/3/search/movie?api_key="+
            apiKey +"&query="+message, function (data) {

            let movies = data.results;
            let output = '';

            for(var i = 0; i < 15; i++){

                if(movies[i].poster_path != null && movies[i].backdrop_path != null){

                    output += `
                    <div class="col-md-2">
                        <div class="text-center">
                            <a href="#" onclick="movieClick('${movies[i].id}')"><img src="http://image.tmdb.org/t/p/original${movies[i].poster_path}" alt="..."></a>
                            <p><b>${movies[i].title}</b></p>
                        </div>
                    </div>`;

                }
            }
            $("#movies").html(output);

        });

    }

}

function movieClick(id){
    console.log(id);
    sessionStorage.setItem("movie_id", id);
    window.location = 'movie.html';
    return false;
}



