var mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVha3dvbmciLCJhIjoiY2pmZ2ZscDRkMmFzcTJ3bWlieGtqOGV2NSJ9.l64uYll6s7hU-IWz8FYW7w'
;


// var maxBounds = [
//     [19.8968, 155.5828], //Southwest
//     [60.905296, -73.478260]  //Northeast
// ];
var map = L.map('map').setView([37.8, -96], 5);
    


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    attribution: 'Map data &#169; Leaflet',
    id: 'mapbox.light'
}).addTo(map);

function getColor(d) {
    return d == 1 ? '#ffecb3' :
           d == 2 ? '#ffd966' :
           d == 3 ? '#ffc61a' :
           d == 4 ? '#cc9900' :
           d == 5 ? '#997300' :
           d == 6 ? '#664d00' :
           d == 7 ? '#332600' :
                    '#fff9e6';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.laws),
        weight: 1,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}
L.geoJson(statesData, {style: style}).addTo(map);


var statesLayer = L.geoJson(statesData, {
    onEachFeature: onEachFeature,
    weight: 1,
    opacity: 1,
    color: 'gray',
    fillOpacity: 0
}).addTo(map);

function onEachFeature(feature, layer) {
    layer.bindTooltip("<strong>State: </strong>" + feature.properties.name + "<br><strong>Number of Laws: </strong>" + feature.properties.laws);      
        };


var legend = L.control({ position: 'topright' })

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var colors = ['#fff9e6','#ffecb3', '#ffd966', '#ffc61a', '#cc9900','#997300', '#664d00','#332600']
    var labels_num = [0,1,2,3,4,5,6,7]

    div.innerHTML = '<div class = "labels"><div class ="min">'+ labels_num[0] +'</div> \
    <div class="max">' + labels_num[labels_num.length - 1] + '</div></div>'

    var labels = []
    labels_num.forEach(function(index)  {
        // if (labels.string === '1234567') {continue; }
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })
        console.log(labels)
        var span = document.createElement("span");
       div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    
    return div
};
legend.addTo(map);








