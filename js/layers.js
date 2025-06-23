

let layers = [
    {
        "label": "Super Market",
        "source": "https://raw.githubusercontent.com/Papyngiengo/Supermarche/refs/heads/main/supermarche.geojson",
        "checked": true,
        "style": {
            fillColor: "#ff66cc",


        },
        "point": true,
        "icon": {
            "iconSize": [20, 20],
            "iconUrl": "https://www.svgrepo.com/show/475552/supermarket.svg"
        },
        "popUp": true
    }
];




let layers2 = [
    {
        "label": "Route",
        "source": "https://raw.githubusercontent.com/Papyngiengo/Routes/refs/heads/main/routes.geojson",
        "checked": false,
        "style": {
            color: "#bca605",
            weight: 3,
            opacity: 0.6
        },
        "point": false,
        "icon": {
            "iconSize": [15, 15],
            "iconUrl": "https://www.svgrepo.com/show/530571/conversation.svg"
        },
        "popUp": true
    }
];

let layers3 = [
    {
        "label": "Quartier District",
        "source": "https://raw.githubusercontent.com/Papyngiengo/Montambatshangu/refs/heads/main/Montambatshquartier.geojson",
        "checked": false,
        "style": {
            color: "#4d4c4c",
            weight: 1,
            opacity: 0.8,
            fillColor: "#d7d7d7",
             fillOpacity: 0.3
        },
        "point": false,
        "icon": {
            "iconSize": [15, 15],
            "iconUrl": "https://www.svgrepo.com/show/530571/conversation.svg"
        },
        "popUp": true
    }
];

$(document).ready(function () {
    createLayerSwitcher(layers, "#layer-container");
    createLayerSwitcher(layers2, "#layer-container2");
    createLayerSwitcher(layers3, "#layer-container3");
});

function createLayerSwitcher(layerList, containerSelector) {
    let layerSwitcher = "";

    layerList.forEach(element => {
        let labelClean = element.label.replace(/\s+/g, "_").replace(/'/g, "_");

        layerSwitcher += `
            <label class="container-checkbox">
                ${element.label}
                <input type="checkbox" value="${element.label}" onchange="switchLayer(this, '${labelClean}')" ${element.checked ? "checked" : ""}>
                <span class="checkmark-checkbox"></span>
            </label>
        `;

        if (element.checked) {
            getLayer(element.source, labelClean, element.style, element.point, layerList);
        }
    });

    $(containerSelector).html(layerSwitcher);
}

function getLayer(url, label, style, point, layerList) {
    console.log('Chargement de :', url);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        beforeSend: function () {
            $(".loader-container").show();
        },
        success: function (resultParse) {
            let thisLayer = layerList.find(thisLayer => thisLayer.source === url);

            if (point) {
                let myIcon = L.icon(thisLayer.icon);
                window[label] = L.geoJSON(resultParse, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: myIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('click', function () {
                            sideBarRight(feature);
                        });
                    }
                });
            } else {
                window[label] = L.geoJSON(resultParse, {
                    style: style,
                    onEachFeature: function (feature, layer) {
                        layer.on('click', function () {
                            sideBarRight(feature);
                        });
                    }
                });
            }

            window[label].addTo(map);
        },
        error: function (xhr, status, error) {
            console.error("Erreur de chargement GeoJSON :", error);
        },
        complete: function () {
            $(".loader-container").hide();
        }
    });
}

function switchLayer(checkbox, label) {
    if (checkbox.checked) {
        if (window[label] === undefined) {
            let value = $(checkbox).val();
            let thisLayer = layers.find(l => l.label === value)
                || layers2.find(l => l.label === value)
                || layers3.find(l => l.label === value);

            if (thisLayer) {
                let parentList = [layers, layers2, layers3].find(list => list.includes(thisLayer));
                getLayer(thisLayer.source, label, thisLayer.style, thisLayer.point, parentList);
            }
        } else {
            window[label].addTo(map);
        }
    } else {
        if (window[label] !== undefined) {
            map.removeLayer(window[label]);
        }
    }
}

function sideBarRight(feature) {
    console.log("Propriétés :", feature.properties);
    $('#sidebar-right').show();
    $('.open-sidebar-right').hide();

    let popUpContent = "";
    Object.keys(feature.properties).forEach(function (key) {
        popUpContent += `<p><b>${key}:</b> ${feature.properties[key]}</p>`;
    });

    $('#sidebar-right-content').html(popUpContent);
}
