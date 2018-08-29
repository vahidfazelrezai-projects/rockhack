javascript:(function () {
    var jq = document.createElement('script');
    jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);

    setTimeout(function () {
        var exploreButton = $("<li id=\"hack-button\" style=\"cursor: pointer\">\
            <a onclick=\"$('#sidebar-wrapper li').removeClass('selected');\
            $('#hack-button').addClass('selected');\
            $('#page-content-wrapper').html('<iframe></iframe>');\
            $('#page-content-wrapper iframe').attr('src', 'http://localhost:5000');\
            $('#page-content-wrapper').css('width', '100%');\
            $('#page-content-wrapper').css('height', 'calc(100vh - 49px)');\
            $('#page-content-wrapper iframe').css('width', '100%');\
            $('#page-content-wrapper iframe').css('height', '100%');\
            \">Explore</a></li>");
        $('#sidebar-wrapper ul').append(exploreButton);
    }, 200);
}())
