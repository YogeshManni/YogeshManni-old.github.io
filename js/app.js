 var map;

function getDetails() {
    var self = this;

    this.searchOption = ko.observable("");
    this.markers = [];

    this.fetchData = function(marker, newwindow) {
        if (newwindow.marker != marker) {      // fetchData function will open a window whem marker is clicked and display data 
                                                // about that location.
            newwindow.setContent('');
            newwindow.marker = marker;
            var clientID = "4EPS21I4V4MVCYXWDT4QNZZG1JETWZ2LIJMYQ34FNBWZ1RMV";
     var clientSecret = "U3P1XLU204VMYO4BHGIWPDOY130Z1AFTT1OQTI2TY0HW0T43";
 var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +  marker.lat + ',' + marker.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&query=' + marker.title + '&v=20170708' + '&m=foursquare';
$.getJSON(apiUrl).done(function(marker) {
    var fetch = marker.response.venues[0];
  self.street = fetch.location.formattedAddress[0];
   self.city = fetch.location.formattedAddress[1];
  self.zip = fetch.location.formattedAddress[3];
   self.country = fetch.location.formattedAddress[4];
self.category = fetch.categories[0].shortName;

               self.htmlContentFoursquare =
                    '<h5 class="iw_subtitle">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="address_title"> Address: </h6>' +
                    '<p class="address">' + self.street + '</p>' +
                    '<p class="address">' + self.city + '</p>' +
                    '<p class="address">' + self.zip + '</p>'  + '</div>' + '</div>';

                newwindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                
                alert(
                    " There was a problem retrieving the foursquare API, Refresh to try again !"//If API is not loaded then we will display an error...
                );
            }); 

            this.htmlContent = '<div>' + '<h4 class="Title">' + marker.title +
                '</h4>';

            newwindow.open(map, marker);

            newwindow.addListener('closeclick', function() {
                newwindow.marker = null;
            });
        }
    };

    this.AnimateCurrentMarker = function() {        // Applying Bounce animation to marker whenever it is clicked... 
        self.fetchData(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.openInfoWindow = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(21.1458, 79.0882),   //Specifying center of our map by giving position latitude and longitude....
            zoom: 13,
            styles: Styles
        };
        map = new google.maps.Map(mapCanvas, mapOptions);

        this.largeInfoWindow = new google.maps.InfoWindow();    //Opening a new Window....
        for (var i = 0; i < locationList.length; i++) {
            this.markerTitle = locationList[i].title;
            this.markerLat = locationList[i].lat;
            this.markerLng = locationList[i].lng;
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.AnimateCurrentMarker);
        }
    };

    this.openInfoWindow();


    this.search= ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function googleError() {      //In case map didn't get loaded then we have to display an alert message.........
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

function MyMap() {
    ko.applyBindings(new getDetails()); //Using knockout.js to apply bindings.....
}