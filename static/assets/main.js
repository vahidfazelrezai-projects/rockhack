$(document).ready(function () {
    function dLatLon(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta/180
        var dist = Math.min(1, 
            Math.sin(radlat1) * Math.sin(radlat2) + 
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta));
        dist = Math.acos(dist) * 180/Math.PI * 60 * 1.1515;
        return dist
    }

    function addRow(state, name, lat, lon) {
        var dist = dLatLon(state.curLat, state.curLon, lat, lon).toFixed(2) + ' mi';
        $('.location-table').append('<tr><td>'+name+'</td><td>'+dist+'</td></tr>')
    }

    function getLocation(state) {
        console.log("Getting location...")
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Got location...")

            state.curLat = position.coords.latitude;
            state.curLon = position.coords.longitude;

            $('.loading-row').hide();

            
            addRow(state, 'Restaurant 1', state.curLat + 1, state.curLon);
            addRow(state, 'Restaurant 2', state.curLat, state.curLon + 1);
        }, function () {
            console.log("Failed get location...")
        });
    }

    getLocation({
        curLat: 0,
        curLon: 0
    });
})