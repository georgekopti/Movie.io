
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
    let db = window.openDatabase('favouriteDB', '1.0', 'Movies', 2 * 1024 * 1024);

    let output = '';

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MOVIES', [], function (tx, result) {
            let len = result.rows.length;
            let i;

            $("#not_found").hide();

            for(i=0; i < len; i++){
                console.log(result.rows.item(i));

                $.get('https://api.themoviedb.org/3/movie/' +result.rows.item(i).movie+ '?api_key=' +apiKey, function (data) {

                    let movies = data;

                    output += `
                               <div class="col-md-2">
                                    <div class="text-center">
                                        <a href="#" onclick="movieClick('${movies.id}')"><img src="http://image.tmdb.org/t/p/original${movies.poster_path}" alt="..."></a>
                                        <p><b>${movies.title}</b></p>
                                    </div>
                                </div>`;

                    $("#movies").html(output);
                });

            }

        }, null);

    });

}

function movieClick(id){
    console.log(id);
    sessionStorage.setItem("movie_id", id);
    window.location = 'movie.html';
    return false;
}