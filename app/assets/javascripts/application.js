// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

var markersArray = [];
var NEW_LAT = 37.787988; 
var NEW_LNG = -122.407788;

var QUERY_DELAY = 400;
var inactive = false;
var biz_ID = 0

var uberClientId = "afazQ6dAL6w5nqQ6JqOrKxFu0RgrsO77"
var uberServerToken = "DLJgLTxr89OWSKRD9sAxhZH9uWaYzqF0rM9u3Ng2";




$(document).ready(function() {
  // initialize the map on load
  $('.uberbadge').css("display", "none");
  $('.Divider').css("display", "none");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initialize);
  } 

  //initialize();

});


/**
 * Initializes the map and some events on page load
 */
var initialize = function(position) {
  
  // Define some options for the map
  if (position) {
    var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    NEW_LAT = position.coords.latitude;
    NEW_LNG = position.coords.longitude;
  };

  var mapOptions = {
    center: userLatLng,
    zoom: 12,
    mapTypeID: google.maps.MapTypeId.ROADMAP,
    
  };

  // create a new Google map with the options in the map element
  var map = new google.maps.Map($('#map_canvas')[0], mapOptions);
  var loc_dot = "images/Blue_dot2.png";
  new google.maps.Marker({
          map: map,
          position: userLatLng,
          icon: loc_dot
  });
  bind_controls(map);

  var uberContainer = $('#uber_container')[0];
  
  /**
   * Send location of clicked place & home coordinates to uber update
   */
  $("body").on("click", "div.result", function() {
    bus_loc = $(this).attr('place_add')
    $(".estimate p").html("Updating estimate..."); 
    var lat, lng = geocode_getcoord(bus_loc, NEW_LAT, NEW_LNG);
  });


  $("body").on("click", "div.uberbadge", function() {
      alert("Not yet implemented. Coming soon!")
      $.post('/makereq', {startlat: lat, startlng: lng, userlt: NEW_LAT, userln: NEW_LNG, prodid: prod_id}, function(result) {
        console.log(result);

      });
  });

}

/**
 * Bind and setup search control for the map
 *
 * param: map - the Google map object
 */
var bind_controls = function(map) {
  // get the container for the search control and bind and event to it on submit
  var controlContainer = $('#control_container')[0];
  google.maps.event.addDomListener(controlContainer, 'submit', function(e) {
    e.preventDefault();
    search(map);
  });

  // get the search button and bind a click event to it for searching
  var searchButton = $('#map_search_submit')[0];
  google.maps.event.addDomListener(searchButton, 'click', function(e) {
    e.preventDefault();
    search(map);
  });

  // push the search controls onto the map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlContainer);

}


/*
* To get time estimate of nearest to user location
* We don't need to show this information as we are updating 
* time and price info based on chosen place
*
* Keeping this code here for future usage. 
*
var getQuickestNearby = function(latitude,longitude) {
  $.ajax({
    url: "https://api.uber.com/v1/estimates/time",
    headers: {
        Authorization: "Token " + uberServerToken
    },
    data: {
        start_latitude: latitude,
        start_longitude: longitude
    },
    success: function(result) {
        console.log(result);

        var response = result["times"];
        var quickest = response[0];
        if (typeof quickest != typeof undefined) {
            console.log("Updating time estimate...")
        $(".time p").html(Math.ceil(quickest.estimate / 60.0) + " min");
      }  
    }
  });
}
*
*
*/




  






/**
 * Makes a post request to the server with the search term and
 * populates the map with the response businesses
 *
 * param: map - the Google map object
 */
var search = function(map) {
  var searchTerm = $('#map_search input[type=text]').val();

  if (inactive === true) { return };

  // post to the search with the search term, take the response data
  // and process it
  $.post('/search', { term: searchTerm, coord_lat: NEW_LAT, coord_lng: NEW_LNG }, function(data) {
    inactive = true;

    // do some clean up
    $('#results').show();
    $('#results').empty();
    clearMarkers();

    // iterate through each business in the response capture the data
    // within a closure.
    data['businesses'].forEach(function(business, index) {
      capture(index, map, business);
    });
  });
};

/**
 * Capture the specific business objects within a closure for setTimeout
 * or else it'll execute only on the last business in the array
 *
 * param: i - the index the business was at in the array, used to the
 *            timeout delay
 * param: map - the Google map object used for geocoding and marker placement
 * param: business - the business object from the response
 */
var capture = function(i, map, business) {
  
  setTimeout(function() {
    if (i === 15) {
      inactive = false;
    }

    $('#results').append(build_results_container(business, i));
    

    // get the geocoded address for the business's location
    geocode_address(map, business['name'], business['location']);
  }, QUERY_DELAY * i); // the delay on the timeout
};

/**
 * Builds the div that'll display the business result from the API
 *
 * param: business - object of the business response
 */
var build_results_container = function(business, biz_ID) {
  return [
      '<div class="result" place_id="'+ biz_ID +'" place_add="', business['location']['address'][0] + ',' + business['location']['city'] + ',' + business['location']['country_code'],'">',
      '<img class="biz_img" src="', business['image_url'], '">',
      '<h5><a href="', business['url'] ,'" target="_blank">', business['name'], '</a></h5>',
      '<img src="', business['rating_img_url'], '">',
      '<p>', business['review_count'], ' reviews</p>',
      '<p class="clear-fix"></p>',
    '</div>'
  ].join('');
};

/**
 * Geocode the address from the business and drop a marker on it's
 * location on the map
 *
 * param: map - the Google map object to drop a marker on
 * param: name - the name of the business, used for when you hover
 *               over the dropped marker
 * param: location_object - an object of the businesses address
 */

var geocode_getcoord = function(address, userLat, userLng) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({address: address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();

      //send location coordinates and user location to update uber estimate
      update_uber_estimate(lat,lng,userLat,userLng);

    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
};



var geocode_address = function(map, name, location_object) {
  var geocoder = new google.maps.Geocoder();

  var address = [
    location_object['address'][0],
    location_object['city'],
    location_object['country_code']
  ].join(', ');

  // geocode the address and get the lat/lng
  geocoder.geocode({address: address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {

      // create a marker and drop it on the name on the geocoded location
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        position: results[0].geometry.location,
        title: name
      });

      // save the marker object so we can delete it later
      markersArray.push(marker);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
};

/**
 * Get geocoded lat,lng and send to uber api to get estimate
 * If request button is clicked, dispatch ride to location
 */

var update_uber_estimate = function(lat, lng, userLat, userLng) {
  
  $.ajax({
    url: "https://api.uber.com/v1/estimates/price?callback=jsonp",
    headers: {
      Authorization: "Token " + uberServerToken
    },
    dataType: "jsonp",
    jsonpCallback: 'myfunc',
    jsonp: 'callback',
    data: {
      start_latitude: lat,
      start_longitude: lng,
      end_latitude: userLat,
      end_longitude: userLng
    }
  });

  function myfunc(result) {
        console.log(result);

        var response = result["prices"];
        if (typeof response != typeof undefined) {
            response.sort(function(t0,t1) {
              return t0.estimate - t1.estimate;
            });

          var cheapest = response[0];
          if (typeof cheapest != typeof undefined) {
            $(".estimate p").css("display", "none");
            $('.uberbadge').css("display", "block");
            $('.Divider').css("display", "block");
            $(".time_est p").html("IN " + Math.ceil(cheapest.duration/60.0) + "MIN");  
            $(".price p").html(cheapest.estimate);
            $(".product_id").html(cheapest.product_id);
            prod_id = cheapest.product_id;
          }
          
        }
    }
  
}




/**
 * Remove all of the markers from the map by setting them
 * to null
 */
var clearMarkers = function() {
  markersArray.forEach(function(marker) {
    marker.setMap(null);
  });

  markersArray = [];
};
