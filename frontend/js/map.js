// Map instance 
const map = L.map("map").setView([28.6139, 77.2090], 12);   //Default - New Delhi

// Tile Layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
}).addTo(map);

let routePoints = [];
let routeLine = L.polyline([], {color: "blue", weight: 4}).addTo(map)

let startmarker = null;
let endmarker = null;

map.on("click", function (event) {
    const { lat, lng } = event.latlng;

    const point = [lat, lng]
    routePoints.push(point);

    if (routePoints.length===1) {
        startmarker = L.marker(point, {title: "Start"}).addTo(map);
    } else {
        if (endmarker) {
            map.removeLayer(endmarker);
            endmarker = L.marker(point, {title: "End"}).addTo(map);
        } else {
            endmarker = L.marker(point, {title: "End"}).addTo(map);
        }
    }
    routeLine.setLatLngs(routePoints);
});

// Button to clear map 
document.getElementById("clearRoute").addEventListener("click", function () {
    routePoints = [];
    routeLine.setLatLngs([]);

    if (startmarker) {
        map.removeLayer(startmarker);
    }
    if (endmarker) {
        map.removeLayer(endmarker);
    }
});

// Apply customization on route
document.getElementById("applyCustomization").addEventListener("click", function () {
    const color = document.getElementById("routeColor").value;
    const style = document.getElementById("lineStyle").value;
    const thickness = parseInt(document.getElementById("lineThickness").value, 10);
  
    const lineOptions = { color: color, weight: thickness };
  
    if (style === "dotted") {
      lineOptions.dashArray = "1, 6"; 
    } else if (style === "dashed") {
      lineOptions.dashArray = "10, 10"; 
    } else {
      lineOptions.dashArray = null; 
    }
  
    map.removeLayer(routeLine);
    routeLine = L.polyline(routePoints, lineOptions).addTo(map);
  });


// export route in KML format
document.getElementById("exportKML").addEventListener("click", function () {
    const routeData = JSON.stringify(routePoints);  

    fetch(`/export_kml/?route=${encodeURIComponent(routeData)}`)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "route.kml";
            link.click();
        })
        .catch(error => console.error('Error exporting KML:', error));
});

// export route in GPX format
document.getElementById("exportGPX").addEventListener("click", function () {
    const routeData = JSON.stringify(routePoints); 

    fetch(`/export_gpx/?route=${encodeURIComponent(routeData)}`)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "route.gpx";
            link.click();
        })
        .catch(error => console.error('Error exporting GPX:', error));
});


document.getElementById("saveRoute").addEventListener("click", function () {
    const name = prompt("Enter a name for the route:");
    if (!name) return alert("Route name is required!");

    if (routePoints.length === 0) {
        alert("No route to save!");
        return;
    }

    fetch('/save_route/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            coordinates: routePoints, 
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.route_id) {
                alert("Route saved successfully!");
            } else {
                alert("Failed to save route: " + data.error);
            }
        })
        .catch(error => console.error("Error saving route:", error));
});


$(document).ready(function () {
    $('#load-route-btn').on('click', function () {
        const routeId = $('#route-dropdown').val();  

        if (routeId) {
            $.ajax({
                url: `/load_route/${routeId}/`,  
                type: 'GET',
                success: function(response) {
                    if (response.route) {
                        loadRouteOnMap(response.route.coordinates); 
                    } else {
                        alert('Error: ' + response.error);
                    }
                },
                error: function() {
                    alert('Failed to load route');
                }
            });
        } else {
            alert('Please select a route');
        }
    });

    function loadRouteOnMap(coordinates) {
        if (Array.isArray(coordinates) && coordinates.length > 0) {
            const routePoints = [];

            coordinates.forEach(coord => {
                const lat = coord[0];  
                const lng = coord[1];  

                const point = [lat, lng];
                routePoints.push(point); 

                L.marker(point).addTo(map);  
            });

            const routePolyline = L.polyline(routePoints, {color: 'blue'}).addTo(map);

            map.fitBounds(routePolyline.getBounds());  
        } else {
            console.error('Invalid route data:', coordinates);
        }
    }
});
