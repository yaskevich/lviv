var isRotate = false;
var timer;
var defLayerIndex = 10;
var osm_attr = 'Map data  &copy; <a href="http://www.lvivcenter.org/en/" target="_blank">Center for Urban History of East Central Europe</a> &copy; <a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a> &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>';
// var wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', { maxZoom: 19, minZoom: 6, opacity: 0.5} );
var wikimedia = L.tileLayer('https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=a0b0612456064c01a5aa81dbb0670862', { maxZoom: 19, minZoom: 6, opacity: 0.5} );
var sources = [
	[1, 16, 11, "1. Lemberg, 1848", "Einzahl der Einwohner v. Lemberg, 1848", "04-Zajachkivska 1848.jpg (1)"],
	[2, 15, 11, "2. Lemberg Leopol Lwow", "", "// 01-BIXa390_col.XXI_sect.262_c.JPEG (2)"],
	[3, 16, 11, "3. Horbaya plan 1931 r.", "Horbaya plan orientacyjny Wielkiego Lwowa", "02-Horbaya plan orjentacyjny wielkiego Lwowa_1931_id15.jpg (3)"],
	[4, 17, 11, "4. Plan Król. Stol. Miasta Lwowa", "", "03-nb-lnu_464 II.jpg (4)"],
	[5, 17, 11, "5. Plan of the City of Lemberg, 1828", "", "id11_1828.jpg (5)"],
	[6, 17, 11, "6. Plan von Lemberg", "", "19.jpg (6)"],
	[7, 15, 11, "7. Lwów - Leopol - Lemberg - Львовъ, 1914", "", "1914_Lemberg_Tourist guide_HRC.jpg (7)"],
	[8, 16, 11, "8. Lviv - Lwow - Leopol, 1915 r.", "", "1915_PL_ka_GIh378-4 1.Expl.jpg (8)"],
	[9, 15, 11, "9. Plan miasta Lwowa 1916 r.", "", "1916_PL_nl k I 113.797_bw.jpg (9)"],
	[10, 15, 11, "10. Mapa warstwicowa Lwowa 1917 r.", "", "1917_MWL_HRC.jpg (10)"],
	// cust
	[11, 14, 11, "11. Plan Lwowa 1918 r.", "Plan Lwowa według stanu z listopada i grudnia 1918 r.", "1918_PL_Kharchuk.jpg (11)"],
	[16, 16, 11, "12. Royal and Capital City of Lwow, 1936", "", "2.41.7.jpg (16)"]
];
var baseLayers = {};
for (var i = 0; i < sources.length; ++i){
	var c = sources[i];
	baseLayers[c[3]] =  L.tileLayer('https://maps.yaskevich.com/lviv/'+c[0]+'/{z}/{x}/{y}.png', { maxZoom: c[1], minZoom: c[2], attribution: osm_attr});
}
var baseLayers2 = {			
	"Map of the age of Lviv buildings (by Intetics)": L.tileLayer('https://opengeo.intetics.com.ua/buildingage/data/tiles/{z}/{x}/{y}.png', { maxZoom: 19, minZoom: 6, attribution: osm_attr}),
	"ESRI Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'	, { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, 	IGP, UPR-EGP, and the GIS User Community'}),
	"Google Satellite" : L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3'],
		attribution: "Google Maps"
	})	
};
var street = new L.LayerGroup();
var churches = new L.LayerGroup();
var neighborhood = new L.LayerGroup();
var overlays = {
	"Staroyevreiska street": street,
	"Lviv churches (OSM POI)": churches,
	"Staroyevreiska neighborhood (by <a href='https://drive.google.com/open?id=1iC3yziuM_hg50_cqHPxzvvk5Kc4&usp=sharing_eil' target='_blank'>Eugene Polyakov)": neighborhood
};
var myIcon = L.icon({
	iconUrl: 'icons/synagogue11.svg',
	// iconSize: [75, 75],
	// iconAnchor: [37.5, 75]
	iconSize: [46, 46],
	iconAnchor: [23, 46]
});
var marker = new L.marker([49.84135908817427, 24.034717082977295], {icon: myIcon}).addTo(street);
var pointA = new L.LatLng(49.84016207033833,24.030178785324097);
var pointB = new L.LatLng(49.84124838256608,24.03509259223938);
new L.Polyline([pointA, pointB], {
	color: 'blue', weight: 5, opacity: 1, smoothFactor: 1
}).addTo(street);
var map = L.map('map', { zoomControl:false, center: [49.83, 24.014167], zoom: 14, layers: [wikimedia, baseLayers[sources[defLayerIndex][3]], street]});
// http://overpass-turbo.eu/s/qCd
L.control.layers(Object.assign(baseLayers, baseLayers2), overlays).addTo(map);


var customControl =  L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom info');
	container.innerHTML = map.getZoom();
    // container.onclick = function(){
      // console.log('buttonClicked');
    // }
    return container;
  },
  update: function (props) {	
    this._container.innerHTML = props;
	}
});

var info = new customControl();
map.addControl(info);
info.update(sources[defLayerIndex][3]);

map.on('baselayerchange', function (e) {
    info.update(e.name);
});


function onEachFeature(feature, layer) {
var popupContent = 
(feature.properties.name?'<b>' + feature.properties.name + '</b></br>':'')+
(feature.properties.denomination?feature.properties.denomination:'church');

if (feature.properties && feature.properties.popupContent) {
	popupContent += feature.properties.popupContent;
}

layer.bindPopup(popupContent);
}

function onEachFeature2(feature, layer) {
	var popupContent = 
	(feature.properties.Name?'<b>' + feature.properties.Name + '</b></br>':'')+
	(feature.properties.description?feature.properties.description:'');
	if (feature.properties && feature.properties.popupContent) {
		popupContent += feature.properties.popupContent;
	}
	layer.bindPopup(popupContent);
}

L.geoJSON([geojson], {
	style: function (feature) {
		return feature.properties && feature.properties.style;
	},
	onEachFeature: onEachFeature,
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			radius: 8,
			fillColor: "white",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		});
	}
}).addTo(churches);

L.geoJSON([jewish], {
	style: function (feature) {
		return feature.properties && feature.properties.style;
	},
	onEachFeature: onEachFeature2,
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			radius: 8,
			fillColor: "yellow",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		});
	}
}).addTo(neighborhood);

// console.log(document.getElementsByClassName('leaflet-control-layers-base')[0]);
// console.log(document.getElementsByClassName('leaflet-control-layers-base')[0]);
var layerControlElement = document.getElementsByClassName('leaflet-control-layers')[0];
function caroussel(cl){
	timer = setTimeout(function(){ 
		// bool ^= true;
		if (isRotate === true){
			layerControlElement.getElementsByTagName('input')[cl].click();
			map.invalidateSize();
			caroussel(cl>13 ? 0: ++cl);
		}
	}, 10000);	
}


L.easyButton({
    states: [{
            stateName: 'mapswitching-run',        // name the state
            icon:      'fa-sync-alt',               // and define its properties
            title:     'Switch map every 10 seconds',      // like its title
            onClick: function(btn, map) {       // and its callback
				isRotate = true;
                caroussel(0);
                btn.state('mapswitching-stop');    // change state on click!
            }
        }, {
            stateName: 'mapswitching-stop',
            icon:      'fa-stop-circle',
            title:     'Stop map rotation',
            onClick: function(btn, map) {
                isRotate = false;
				clearTimeout(timer);
                btn.state('mapswitching-run');
            }
    }]
}).addTo(map);



var Zzz = new customControl();
map.addControl(Zzz);
map.on('zoomend', function (e) {
	// console.log(e);
    Zzz.update(map.getZoom());
});