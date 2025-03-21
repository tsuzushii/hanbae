function calcHeight() {
    var titleHeight = $('h1').height();
    var buttonHeight = $('button').height();
    // no idea why to subtract twice the title height but the last are margins and paddings
    var contentHeight = $(window).height() - titleHeight - titleHeight - buttonHeight -40;

    if ($.browser.msie && $.browser.version == '6.0')
        contentHeight = contentHeight - 5;
        
    //var ch = $('.contentWrapper').height();
    $('.contentWrapper').height(contentHeight);
    $('.contentWrapper').css('display', 'none');
    $('.contentWrapper').css('display', 'block');
};

function displayContent(ref) {
    $('#' + ref).show();
    $('.qa').not('#' + ref).hide();
    $('.index li[ref=' + ref + ']').css("font-weight", "bold");
    $('.index li[ref=' + ref + ']').css("background-color", "#F6E9B6");

    $('.index li[ref!=' + ref + ']').css("font-weight", "normal");
    $('.index li[ref!=' + ref + ']').css("background-color", "#FFFFEC");
};

$(document).ready(function() {
    $('.qa').hide();

    $('.index li').css("padding-left", "5px");

    $('.index li').click(function(e) {
        e.preventDefault();
        var reference = $(this).attr('ref'); //attr('href'); //.substring(1);
        displayContent(reference);
        calcHeight();
    });
    $('.button').click(function(e) {
        window.close();
    });
    calcHeight();
    $(window).resize(function() {
        calcHeight();
    });
    $(".index li").hover(function() {
        if ($(this).css("font-weight") != "700") {
            $(this).css("background-color", "#FEF4DD");
        } else {
            $(this).css("background-color", "#F6E9B6");
        }
    }, function() {
        if ($(this).css("font-weight") != "700") {
            $(this).css("background-color", "#FFFFEC");
        } else {
            $(this).css("background-color", "#F6E9B6");
        }
    });
});