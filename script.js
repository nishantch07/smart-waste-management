let map;
const bangaloreCenter = { lat: 12.9716, lng: 77.5946 };
let directionsService;
let directionsRenderer;
let selectedLocations = [];

const nearbyAreas =  [
    { name: "Indiranagar", lat: 12.9719, lng: 77.6412 },
    { name: "Koramangala", lat: 12.9279, lng: 77.6271 },
    { name: "Whitefield", lat: 12.9698, lng: 77.7500 },
    { name: "Jayanagar", lat: 12.9299, lng: 77.5804 },
    { name: "MG Road", lat: 12.9758, lng: 77.6096 },
    { name: "Malleswaram", lat: 12.9825, lng: 77.5745 },
    { name: "BTM Layout", lat: 12.9166, lng: 77.6101 },
    { name: "HSR Layout", lat: 12.9081, lng: 77.6476 },
    { name: "Marathahalli", lat: 12.9591, lng: 77.6974 },
    { name: "Banashankari", lat: 12.9250, lng: 77.5470 },
    { name: "JP Nagar", lat: 12.9077, lng: 77.5851 },
    { name: "Bannerghatta Road", lat: 12.8750, lng: 77.5970 },
    { name: "Electronic City", lat: 12.8399, lng: 77.6770 },
    { name: "Yelahanka", lat: 13.1005, lng: 77.5963 },
    { name: "Hebbal", lat: 13.0358, lng: 77.5973 },
    { name: "Rajajinagar", lat: 12.9866, lng: 77.5517 },
    { name: "Basavanagudi", lat: 12.9422, lng: 77.5738 },
    { name: "Vijayanagar", lat: 12.9719, lng: 77.5324 },
    { name: "RT Nagar", lat: 13.0211, lng: 77.5949 },
    { name: "Nagarbhavi", lat: 12.9615, lng: 77.5070 },
    { name: "Peenya", lat: 13.0268, lng: 77.5236 },
    { name: "Hennur", lat: 13.0323, lng: 77.6386 },
    { name: "Kalyan Nagar", lat: 13.0206, lng: 77.6479 },
    { name: "Banaswadi", lat: 13.0139, lng: 77.6396 },
    { name: "CV Raman Nagar", lat: 12.9854, lng: 77.6639 },
    { name: "Sarjapur Road", lat: 12.9068, lng: 77.6784 },
    { name: "Kadugodi", lat: 12.9899, lng: 77.7616 },
    { name: "Hoodi", lat: 12.9925, lng: 77.7159 },
    { name: "KR Puram", lat: 13.0080, lng: 77.6962 },
    { name: "Ramamurthy Nagar", lat: 13.0133, lng: 77.6756 },
    { name: "Bellandur", lat: 12.9257, lng: 77.6762 },
    { name: "Domlur", lat: 12.9609, lng: 77.6378 },
    { name: "Old Airport Road", lat: 12.9569, lng: 77.6490 },
    { name: "Frazer Town", lat: 13.0039, lng: 77.6134 },
    { name: "Shivajinagar", lat: 12.9825, lng: 77.6036 },
    { name: "Richmond Town", lat: 12.9667, lng: 77.6099 },
    { name: "Langford Town", lat: 12.9539, lng: 77.6078 },
    { name: "Koramangala 4th Block", lat: 12.9343, lng: 77.6267 },
    { name: "Koramangala 5th Block", lat: 12.9302, lng: 77.6215 },
    { name: "Koramangala 6th Block", lat: 12.9284, lng: 77.6334 },
    { name: "HSR Layout Sector 2", lat: 12.9146, lng: 77.6454 },
    { name: "HSR Layout Sector 3", lat: 12.9120, lng: 77.6500 },
    { name: "HSR Layout Sector 4", lat: 12.9097, lng: 77.6553 },
    { name: "BTM Layout 2nd Stage", lat: 12.9129, lng: 77.6100 },
    { name: "JP Nagar 6th Phase", lat: 12.9076, lng: 77.5929 },
    { name: "Banashankari 3rd Stage", lat: 12.9240, lng: 77.5462 },
    { name: "Jayanagar 4th Block", lat: 12.9299, lng: 77.5843 },
    { name: "Malleshwaram 18th Cross", lat: 12.9918, lng: 77.5710 },
    { name: "Vijayanagar Chord Road", lat: 12.9710, lng: 77.5367 }
];


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: bangaloreCenter,
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    nearbyAreas.forEach(area => {
        const marker = new google.maps.Marker({
            position: { lat: area.lat, lng: area.lng },
            map: map,
            title: area.name,
            icon: {
                url: area.name === "Indiranagar" ? "truck-icon.png" : "icon.png",
                scaledSize: new google.maps.Size(area.name === "Indiranagar" ? 40 : 30, area.name === "Indiranagar" ? 40 : 30),
            },
        });

        marker.addListener("click", () => {
            selectLocation(area);
        });
    });

    // Add Indiranagar to selected locations by default
    selectLocation(nearbyAreas.find(area => area.name === "Indiranagar"));
}

function selectLocation(area) {
    if (!selectedLocations.includes(area)) {
        selectedLocations.push(area);
        alert(`Added ${area.name} to the route.`);
        if (selectedLocations.length >= 2) {
            document.getElementById("findPathBtn").disabled = false;
        }
    } else {
        alert(`${area.name} is already in the route.`);
    }
}

function resetLocations() {
    selectedLocations = [nearbyAreas.find(area => area.name === "Indiranagar")];
    document.getElementById("findPathBtn").disabled = true;
    directionsRenderer.set('directions', null);
    alert("Locations reset. Please select new locations for the route.");
}

async function findPath() {
    if (selectedLocations.length < 2) {
        alert("Please select at least one destination besides Indiranagar.");
        return;
    }

    const optimizedRoute = await findShortestPath(selectedLocations);
    const waypoints = optimizedRoute.slice(1, -1).map(location => ({
        location: new google.maps.LatLng(location.lat, location.lng),
        stopover: true
    }));

    const request = {
        origin: { lat: optimizedRoute[0].lat, lng: optimizedRoute[0].lng },
        destination: { lat: optimizedRoute[optimizedRoute.length - 1].lat, lng: optimizedRoute[optimizedRoute.length - 1].lng },
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const totalDistance = result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000;
            alert(`Shortest path found!\nTotal Distance: ${totalDistance.toFixed(2)} km`);
        } else {
            alert("Could not find a path: " + status);
        }
    });
}

async function findShortestPath(locations) {
    const n = locations.length;
    const distanceMatrix = await getDistanceMatrix(locations);
    
    // Ensure Indiranagar is the start and end point
    const indiranagarIndex = locations.findIndex(loc => loc.name === "Indiranagar");
    const permutations = getPermutations(Array.from({length: n - 1}, (_, i) => i === indiranagarIndex ? n - 1 : i));
    
    let shortestDistance = Infinity;
    let shortestPath = [];

    for (let perm of permutations) {
        let distance = 0;
        let fullPath = [indiranagarIndex, ...perm, indiranagarIndex];
        for (let i = 0; i < fullPath.length - 1; i++) {
            distance += distanceMatrix[fullPath[i]][fullPath[i+1]];
        }
        if (distance < shortestDistance) {
            shortestDistance = distance;
            shortestPath = fullPath;
        }
    }

    return shortestPath.map(index => locations[index]);
}

function getPermutations(arr) {
    if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : [arr];
    return arr.reduce((acc, item, i) =>
        acc.concat(getPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])),
    []);
}

function getDistanceMatrix(locations) {
    return new Promise((resolve, reject) => {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: locations,
                destinations: locations,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === google.maps.DistanceMatrixStatus.OK) {
                    const distances = response.rows.map(row => row.elements.map(element => element.distance.value));
                    resolve(distances);
                } else {
                    reject("Error: " + status);
                }
            }
        );
    });
}

window.onload = initMap;
