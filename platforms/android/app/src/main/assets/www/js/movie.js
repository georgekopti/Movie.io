
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

let pos;
let map, infoWindow, service;

function initMap() {

    //Creating the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    infoWindow = new google.maps.InfoWindow;

}


function initApp() {

    const apiKey = "39c5c5d0e110230f59d63ffe62f44ad7";
    let movieID = sessionStorage.getItem('movie_id');

    let favouriteBtn = $("#favourite");
    let removeBtn = $("#remove");
    let count = 0;

    let db = window.openDatabase('favouriteDB',
        '1.0', 'Movies', 2 * 1024 * 1024);


    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM MOVIES', [], function (tx, result) {
            let len = result.rows.length;


            for(let i=0; i < len; i++){
                if(movieID == result.rows.item(i).movie){
                    removeBtn.toggle(true);
                    favouriteBtn.hide();

                }else{
                    removeBtn.hide();
                    favouriteBtn.toggle(true);
                }
            }
        }, null);
    });

    $.get('https://api.themoviedb.org/3/movie/' +movieID+ '?api_key=' +apiKey, function (data) {

        movie = data;
        let output = '';
        let genre = '';
        console.log(movie);

        let rating = (movie.vote_average) /2;
        let star_total = 5;

        const star_percent = (rating / star_total) * 100;
        const rating_rounded = `${Math.round(
            star_percent / 10) *10}%`;

        for(let i = 0; i < movie.genres.length; i++){

            if(i !== 0){
                genre += ", " + movie.genres[i].name;
            }
            genre += movie.genres[i].name;
        }

        //remove bold tag
        output += `
                      <div id="my_movies" class="text-center">
                          <img src="http://image.tmdb.org/t/p/original${movie.backdrop_path}" alt="...">
                      </div>
                      <div class="container mt-3">
                        <p><b>Movie Title: </b> &nbsp;${movie.title}</p>
                        <div id="rating" class="mb-2">
                           <b>Movie Rating: &nbsp;</b>
                           <div id="star_outer">
                                <div id="star_inner"></div>   
                           </div> <i>(${movie.vote_count})</i>
                        </div>
                        
                        <p><b>Run Time: </b>&nbsp; ${movie.runtime} Minutes</p>
                        <p><b>Release Date: </b>&nbsp; ${movie.release_date}</p>
                        <p><b>Genres: </b>&nbsp; ${genre}</p>
                        
                        <p><b>Movie Description: </b> &nbsp;${movie.overview}</p>
                        
                      </div>
                  `;

        $("#my_movie").html(output);
        document.getElementById("star_inner").style.width= rating_rounded;

    });

    $("#go_back").click(function(){
        console.log(movie.id);

        window.history.go(-1);
    });

    favouriteBtn.click(function(){

        console.log(movie.id);

        let db = openDatabase('favouriteDB', '1.0',
            'Movies', 2 * 1024 * 1024);



        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS MOVIES (movie unique )');
            tx.executeSql('INSERT INTO MOVIES (movie) VALUES (?)',
                [movie.id], function (tx, result) {
            });
        });

        favouriteBtn.hide();
        removeBtn.show();
    });

    removeBtn.click(function(){

        let db = openDatabase('favouriteDB', '1.0',
            'Movies', 2 * 1024 * 1024);

        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM MOVIES WHERE (movie) = (?)',
                [movie.id], function (tx, result) {
            console.log("Removes")});
        });

        removeBtn.hide();
        favouriteBtn.show();

    });

    //geolocation has to go inside device ready to run
    function onSuccess(position) {

        if (count < 1){

            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are Here');
            infoWindow.open(map);
            map.setCenter(pos);


            let request = {
                location: pos,
                radius: '500',
                query: 'cinema'
            };

            service = new google.maps.places.PlacesService(map);
            service.textSearch(request, callback);

            count++;

        }
    }

    // On error display error message
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

    navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });

}


function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 1; i < results.length; i++) {
            let place = results[i];
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {

    new google.maps.Marker({
        position: place.geometry.location,
        map: map
    });
}


