


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


    //Left empty for now

}

//map settings and centre location
function initMap() {

    var location = {lat: 43.4690, lng: -79.6986};

    var map = new google.maps.Map(
        document.getElementById('second_map'), {
            zoom: 16,
            center: location,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

    var marker = new google.maps.Marker({position: location, map: map});
}



