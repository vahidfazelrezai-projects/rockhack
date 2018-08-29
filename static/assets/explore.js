var state = {
    leftCollection: '',
    rightCollection: '',
    leftField: '',
    rightField: ''
}

function loadCollectionLists() {
    $.get('/rs/collections', function (data) {
        var collections = JSON.parse(data);
        for (var i = 0; i < collections.length; i++) {
            var name = collections[i]['name'];
            $('.left-collection-list').append('\
                <li class="bx--dropdown-item">\
                    <a class="bx--dropdown-link" onclick="(function(){loadFieldsList(\'left\', \''+name+'\')})();" tabindex="-1">'+name+'</a>\
                </li>')
            $('.right-collection-list').append('\
                <li class="bx--dropdown-item">\
                    <a class="bx--dropdown-link" onclick="(function(){loadFieldsList(\'right\', \''+name+'\')})();" tabindex="-1">'+name+'</a>\
                </li>')
        }
    });
}

function selectField(side, path) {
    if (side == 'left') {
        state.leftField = path.replace(',', '.');
    } else {
        state.rightField = path.replace(',', '.');
    }

    if ((state.leftField != '') && (state.rightField != '')) {
        if (state.leftCollection == state.rightCollection) {
            $('.check-result').html('Please select different collections...');
        } else {
            $('.check-result').html('<div data-loading class="bx--loading bx--loading--small">\
  <svg class="bx--loading__svg" viewBox="-75 -75 150 150">\
    <title>Loading</title>\
    <circle cx="0" cy="0" r="37.5" />\
  </svg>\
</div>\
')
            $.get('/rs/check?state=' + JSON.stringify(state), function (data) {
                var results = JSON.parse(data);
                if (results.length > 0) {
                    $('.check-result').html('<div><div>Possible good join! Sample values:</div><ul class="bx--list--unordered">'
                        + results.map(function (x) {
                            return '<li class="bx--list__item">' + Object.values(x)[0] + '</li>';
                        }).join('') + '</ul></div>');
                } else {
                    $('.check-result').html('BAD JOIN');
                }
            });
        }
    }
}

function loadFieldsList(side, collectionName) {
    if (side == 'left') {
        state.leftCollection = collectionName;
        state.leftField = '';
    } else {
        state.rightCollection = collectionName;
        state.rightField = '';
    }

    $('.check-result').html('Select two fields...');

    $.get('/rs/collections/' + collectionName, function (data) {
        var fields = JSON.parse(data);
        $('.' + side + '-fields-list').html('');
        for (var i = 0; i < fields.length; i++) {
            var path = fields[i]['field'];
            var type = fields[i]['type'];
            var id = side + '@' + path.join('$');
            $('.' + side + '-fields-list').append('\
                <label for="'+id+'" aria-label="'+id+'" class="bx--structured-list-row" tabindex="0" onclick="(function(){selectField(\''+side+'\',\''+path+'\')})()">\
                    <input tabindex="-1" id="'+id+'" class="bx--structured-list-input" value="'+id+'" type="radio" name="'+side+'-fields" title="'+id+'" />\
                        <div class="bx--structured-list-td">\
                            <svg class="bx--structured-list-svg" width="16" height="16" viewBox="0 0 16 16">\
                                <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.646-10.854L6.75 10.043 4.354 7.646l-.708.708 3.104 3.103 5.604-5.603-.708-.708z" fill-rule="evenodd" />\
                            </svg>\
                        </div>\
                        <div class="bx--structured-list-td bx--structured-list-content--nowrap">'+path+'</div>\
                    <div class="bx--structured-list-td">'+type+'</div>\
                </label>');
        }
    });
}

$(document).ready(function () {
    loadCollectionLists();
});
