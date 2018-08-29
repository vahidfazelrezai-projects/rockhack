function makeTable(headers, rows) {
    var keys = Object.keys(headers);

    // empty table
    var table = $('<table class="bx--data-table-v2 bx--data-table-v2--compact"></table>');

    // add header
    var head = $('<thead></thead>');
    var headRow = $('<tr></tr>');
    for (var i = 0; i < keys.length; i++) {
        var col = $('<td>' + headers[keys[i]] + '</td>');
        headRow.append(col);
    }
    head.append(headRow);
    table.append(head);

    // add body
    var body = $('<tbody></tbody>');
    for (var i = 0; i < rows.length; i++) {
        var bodyRow = $('<tr></tr>');
        for (var j = 0; j < keys.length; j++) {
            var col = (keys[j] in rows[i]) 
                ? $('<td>' + rows[i][keys[j]] + '</td>')
                : $('<td><i>(null)<i></td>');
            bodyRow.append(col);
        }
        body.append(bodyRow);
    }
    table.append(body);

    return table;
}

function dLatLon(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta/180
    var dist = Math.min(1, 
        Math.sin(radlat1) * Math.sin(radlat2) + 
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta));
    dist = Math.acos(dist) * 180/Math.PI * 60 * 1.1515;
    return dist // in miles
}

function setVisibility(state) {
    states = ['waiting', 'loading', 'loaded'];
    states.forEach(function (s) { $('.visible-' + s).hide() });
    $('.visible-' + state).show();
}

$(document).ready(function () {
    setVisibility('waiting');

    $('.use-my-current-location').click(function () {
        setVisibility('loading');

        $('.location-message').text('Getting location...');

        navigator.geolocation.getCurrentPosition(function (position) {
            $('.location-message').text('Got location.');

            var curLat = position.coords.latitude;
            var curLon = position.coords.longitude;

            $.get('/yelp?lat=' + curLat + '&lon=' + curLon, function (data) {
                places = JSON.parse(data).map(function (x) {
                    x.dist = dLatLon(curLat, curLon, x.latitude, x.longitude)
                    return x;
                }).sort(function (x, y) {
                    if (x.dist > y.dist) {
                        return 1;
                    }
                    if (x.dist < y.dist) {
                        return -1;
                    }
                    return 0;
                }).map(function (x) {
                    x.distDisplay = x.dist.toFixed(2) + ' mi';
                    return x;
                });

                $('.places-table').append(makeTable({
                    'name': 'Restaurant Name',
                    'city': 'City',
                    'distDisplay': 'Distance',
                }, places));

                setVisibility('loaded');
            })

        }, function () {
            console.log("Failed get location...")
        });
    });
});