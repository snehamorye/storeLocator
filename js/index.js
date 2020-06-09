
var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 8,
        styles: mapStyles
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    
}

function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode) {
        stores.forEach(function(store) {
            var postal = store.address.postalCode.substring(0,5);
            if(postal == zipCode) {
                foundStores.push(store);
            }
        });
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index) {
        elem.addEventListener('click', function() {
            google.maps.event.trigger(markers[index], 'click');
        });
    });
}

function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function(store, index) {
        var address = store.addressLines;
        var phoneNumber = store.phoneNumber;
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            
                            <span>
                            
                            ${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">
                            <i class="fas fa-phone-alt"></i> &nbsp;
                            ${phoneNumber}
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index) {
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude
        );
        var name = store.name;
        var address = store.addressLines[0];
        var phoneNumber = store.phoneNumber;
        var openStatusText = store.openStatusText;
        bounds.extend(latlng);
        createMarker(latlng, name, openStatusText, address, phoneNumber, index);
    }); 
    map.fitBounds(bounds);
}

function createMarker(latlng, name, openStatusText, address, phoneNumber, index) {
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <a href ="https://www.google.com/maps/dir/?api=1&destination=${address}" title="Click To Get Direction On Google Map">${address}</a>
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    `;

    var iconBase = './img/marker-2.png';
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: {
        url: iconBase
      },
      //label: `${index+1}`,
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}