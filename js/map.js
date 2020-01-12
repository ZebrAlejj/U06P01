var data = JSON.parse(localStorage.getItem("espcult"));
var mcg;
var map;
document.getElementById('event').addEventListener('click',filter);

var addressPoints = data.map(function (obj) {
    var datosEspCult = {
        nombre: obj.properties.nombre,
        direccion: obj.properties.dir,
        cp: obj.properties.cp,
        coor: obj.geometry.coordinates
    };
    return datosEspCult;
});

function filter() {
    let filterValue = document.getElementById("filter").value.toLowerCase().trim();
    let option = document.getElementById("option").value;
    mcg.clearLayers();
    map.remove();
    var filterEspacios = addressPoints.filter(function (espacio) {
        if (filterValue == '') {
            return espacio;
        } else {
            if (option == 'nombre') {
                if (espacio.nombre.toLowerCase().trim().includes(filterValue)) {
                    return espacio;
                }
            } else {
                if (option == 'cp') {
                    if (filterValue == espacio.cp) {
                        return espacio;
                    }
                }
            }
        }
    });
    show(filterEspacios);
}

function show(addressPoints) {
    var tiles = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="//openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ',
    accessToken: "pk.eyJ1IjoiemVicmFsZWpqIiwiYSI6ImNrNGNxazJhajBxYzYzbm1uNDhvMXQwdTcifQ.tNwqtdsYq_YViiHQuRPJ_w"
    });

    map = L.map('map', {
    center: L.latLng(addressPoints[0].coor[1], addressPoints[0].coor[0]),
    zoom: 13,
    layers: [tiles]
    });

    mcg = L.markerClusterGroup({
    chunkedLoading: true,
    //singleMarkerMode: true,
    spiderfyOnMaxZoom: false
    });

    for (var i = 0; i < addressPoints.length; i++) {
    var a = addressPoints[i].coor;
    var title = addressPoints[i].nombre;
    var marker = L.marker(new L.LatLng(a[1], a[0]), { title: title });
    marker.bindPopup(title);
    mcg.addLayer(marker);
    }

    map.addLayer(mcg);
}

show(addressPoints);