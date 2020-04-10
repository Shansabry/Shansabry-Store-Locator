var map;
var markers = [];
var infoWindow;
var colors = ["#e67e22", "#8e44ad", "#3498db", "#1abc9c", "#c0392b"];

function initMap() {
  var nagercoil = { lat: 34.0524, lng: -118.443683 };
  var styledMapType = new google.maps.StyledMapType(
    [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#bdbdbd",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#dadada",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#c9c9c9",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
    ],
    { name: "Styled Map" }
  );
  map = new google.maps.Map(document.getElementById("map"), {
    center: nagercoil,
    zoom: 7,
    mapTypeControlOptions: {
      mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
    },
  });
  map.mapTypes.set("styled_map", styledMapType);
  map.setMapTypeId("styled_map");
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}

function displayStores(stores) {
  var storesHtml = "";
  if (stores.length === 0) {
    storesHtml = `<div class = "no-data-found"><i class="fas fa-exclamation-triangle"></i></div>`;
  }
  stores.map((store, index) => {
    var address = store["addressLines"];
    var phone = store["phoneNumber"];
    storesHtml += `
        <div class="store-container">
          <div class ="store-container-background">
            <div class="store-info-container">
              <div class="store-address">
                <span>${address[0]}, </span>
                <span>${address[1]}.</span>
              </div>
              <div class="store-phone-number">
                ${phone}
              </div>
            </div>
            <div id="store-number-container"  >
              <div class="store-number" style ="width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: ${colors[(index + 1) % 5]};
                        color: #000000;">
                  <i id = "store-selector" class="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
      </div>
    `;
  });
  document.querySelector(".stores-list").innerHTML = storesHtml;
}

function showStoreMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.map((store, index) => {
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    var name = store["name"];
    var address = store["addressLines"][0];
    var shopStatus = store["openStatusText"];
    var phone = store["phoneNumber"];
    bounds.extend(latlng);
    colorIndex = (index + 1) % 5;
    createMarker(latlng, name, address, shopStatus, phone, colorIndex);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, shopStatus, phone, colorIndex) {
  var image = {
    path: "M54 24a22 22 0 1 0-28 21.1L32 59l6-13.8A22 22 0 0 0 54 24z",
    fillColor: colors[colorIndex],
    fillOpacity: 0.8,
    anchor: new google.maps.Point(-320, 32),
    strokeWeight: 2,
    strokeColor: colors[colorIndex],
    scale: 0.75,
  };

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: image,
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(
      createInfoWindow(name, shopStatus, address, phone, latlng, colorIndex)
    );
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function createInfoWindow(
  name,
  shopStatus,
  address,
  phone,
  latlng,
  colorIndex
) {
  var destination = latlng.lat() + "," + latlng.lng();
  var htmlInfoWindow = `
      <div class ="store-info-window">
        <div class ="store-info-name" style="color:${colors[colorIndex]};">
           <b>${name}</b>
        </div>
        <div class ="store-info-status">
           ${shopStatus}
        </div>
        <div class ="store-info-address">
        <i style="color:#27ae60;margin-right:8px;" class="fas fa-location-arrow"></i>
         <a href="https://www.google.com/maps/dir/?api=1&destination=${destination}" target="_blank"> ${address} </a>
        </div>
        <div class ="store-info-phone">
        <i style="color:#c0392b;margin-right:8px;" class="fas fa-phone-alt"></i>
           ${phone}
        </div>
      </div>
      `;
  return htmlInfoWindow;
}

function openInfoWindowOnClick() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach((storeElement, index) => {
    storeElement.addEventListener("click", () => {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    for (var store of stores) {
      var postal = store["address"]["postalCode"].includes(zipCode);
      if (postal) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  if (foundStores.length > 0) {
    showStoreMarkers(foundStores);
    openInfoWindowOnClick();
  }
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}
