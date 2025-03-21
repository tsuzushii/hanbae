/**********************************************************************************************************/
/** Pop-Up related scripts **/

// scripts for Modal window and dropdown issues
var inModalPopUp = false;
var CSS_MODAL_TEXTBOX = "modalTextBox";

// Fix - IE9 compatibility (x76544 - 29/10/2012) - Start
// HOTFIX: We can't upgrade to jQuery UI 1.8.6 (yet)
// This hotfix makes older versions of jQuery UI drag-and-drop work in IE9
// http://forum.jquery.com/topic/jquery-ui-sortable-and-draggable-do-not-work-in-ie9
(function ($) { var a = $.ui.mouse.prototype._mouseMove; $.ui.mouse.prototype._mouseMove = function (b) { if ($.browser.msie && document.documentMode >= 9) { b.button = 1 }; a.apply(this, [b]); } } (jQuery));
// Fix - IE9 compatibility (x76544 - 29/10/2012) - End

function IsOldBrowser() 
{
    if ($.browser.msie) 
    {
        var browserVersionNumber = parseInt($.browser.version.split("."), 10);

        if (!isNaN(browserVersionNumber))
            if (browserVersionNumber <= 8)
                return true;
    }
    return false;
}

(function($) {
        $.fn.popupIframe = function(s) {

        var prop = function(n) { return n && n.constructor == Number ? n + 'px' : n; },
            html = '<iframe class="popupIframe" frameBorder="0" tabindex="-1" src="" ' + 
                    'style="display:block; position:absolute; z-index:-1; filter:Alpha(Opacity=\'0\'); top:0; left:0; />';
        return this.each(function() {
            if ($('> iframe.popupIframe', this).length == 0) {
                if (IsOldBrowser())
                {
                    this.insertBefore(document.createElement(html), this.firstChild);
                }
                else
                {
                    //Fix IE9 - x76544 (Start)
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("class", "popupIframe");
                    iframe.setAttribute("frameBorder", "0");
                    iframe.setAttribute("tabindex", "-1");
                    iframe.setAttribute("src", "");
                    iframe.setAttribute("style", "display:block; position:absolute; z-index:-1; filter:Alpha(Opacity='0'); top:0; left:0;");
                    this.insertBefore(iframe, this.firstChild);
                    //Fix IE9 - x76544 (End)
                }
            }
            // add 5 px to height and width for the shadow.
            $('> iframe.popupIframe', this).css({ 'width': ($(this).outerWidth()+5) + 'px', 'height': ($(this).outerHeight()+5) + 'px' });

        });
        return this;
    };
})(jQuery);

function HookUpHoverStyleForPopUpList() {
    $('.hoverable').live('mouseover', function() {
        $(this).addClass('hoverStyle');
    })
        .live('mouseout', function() {
            $(this).removeClass('hoverStyle');
        });
}

// takes all visible selects and transfers them to TextBoxes
function TransferDropdownToTextBox() {
    if (!isIE67()) return false;    // only do this for IE6 and 7

    if (!inModalPopUp) return;

    $('div#ContentArea div.Content select:visible').each(function() {
        var tb = $('<input type="text" disabled="disabled" value="' +
                    $(this).children('option:selected').text() +
                    '" class="inputFields ' + CSS_MODAL_TEXTBOX + '" />');
        if ($(this).hasClass(CSS_DISABLED))
            tb.addClass(CSS_DISABLED);
        tb.width($(this).width());
        tb.height($(this).height());
        $(this).after(tb);
        $(this).hide();
    });
}

// takes all textboxes and transfers them back to selects
function TransferTextBoxToDropDown() {
    if (!isIE67()) return false;    // only do this for IE6 and 7

    if (!inModalPopUp) return;

    $('.' + CSS_MODAL_TEXTBOX).each(function() {
        $(this).prev().show();  // show control (select) before this textbox
        $(this).remove();       // remove this textbox from the DOM
    });
}

// (re) calculates the offset to make sure the popup is not outside the window area
function GetOffset(popUp, offset) {
    var popupOffsetRigth = (offset.left + popUp.outerWidth(true));
    if (popupOffsetRigth > $(window).width()) { 
        offset.left = offset.left - popupOffsetRigth + $(window).width() - 10; // 10 px for the shadow
    }
    var popupOffsetBottom = (offset.top + popUp.outerHeight(true));
    if (popupOffsetBottom > $(window).height()) {
        offset.top = offset.top - popupOffsetBottom + $(window).height() - 10;
    }
}

// event called when a popup is shown
function ShowPopUpEvent() {
    //    debugger;
    inModalPopUp = true;
    DisablePage();
    TransferDropdownToTextBox();
}
// event called when a popup is closed
function ClosePopUpEvent() {
    EnablePage();
    TransferTextBoxToDropDown();
    inModalPopUp = false;
}

//var popupHeaderHeight = 20;
// total of space between top popup and top window and bottom popup and bottom window.
var extraSpacing = 75;

/* This function provides the logic for resizing a popup window to fit the screen and the content of the popup.
** @div - div containing the content of the popup. 
** @windowHeight - height of the window (available height)
** @windowWidth - widht of the window (available width)
** @resizeWidth - boolean indicating that the logic for calculating the widht needs to be performed or not.
** @popupobject - when not specified, we will use the default popup object on the page. 
**                This parameter should be filled in when the resize is triggered from within a page that does not contain the popup object, 
**                  eg: iframe popup page.
*/
function ResizePopUpToDivCalculation2(div, windowHeight, windowWidth, resizeWidth, popupobject) {
     // get default popup object
    var popup = $.colorbox;
    var popupdiv = $('#colorbox');
    var inOverflow = false;

    // if popupobject is provided, overwrite the defaults to use the overriden ones.
    if (popupobject) {
        popup = popupobject.popup;
        popupdiv = popupobject.popupdiv;
    }

    var popupWidth = popupdiv.width();     // default, use configured width

    // get available screen height and width for popup
    var availableWidth = windowWidth - extraSpacing;
    var availableHeight = windowHeight - extraSpacing;

    // find the div to place the overflow on
    var overflowObject = div.find('#overflowDiv');
    // if no overflow div is present, set the overflow entirely on the popup div.
    if (overflowObject.length == 0)
        overflowObject = div;
    // find the minHeight if any specified. Note the property should always be on the main popup div.
    var minHeight = div.attr('minheight');
    if (minHeight == undefined) minHeight = 0;

    // get height of div
    var titleHeight = popupdiv.find('#cboxTopCenter').outerHeight(true);    // height of the blue title bar.
    if (titleHeight == undefined) titleHeight = 0;

    // calculate current total popup height.
    var popupHeight = div.outerHeight(true) + titleHeight;  // height will always be calculated
    var overflowheight = 0;

    // calculate overflow if height does not fit screen
    if (popupHeight > availableHeight) {
        //PopupHeight is greater then available space => resizing needed
        var heightDifference = popupHeight - availableHeight;
        overflowHeight = overflowObject.outerHeight(true) - heightDifference;

        if (minHeight > 0 && overflowHeight < minHeight)
            overflowHeight = minHeight;

        // subtract also the titleHeight of the popup. (especially needed when overflowobject == div)
        overflowObject.height(overflowHeight - titleHeight);
        popupHeight = availableHeight;
        inOverflow = true;
    }
    else {
        // set the overflowobject height        
        if (popupHeight < minHeight)
            popupHeight = minHeight;

        var header = div.find('#headersDiv');
        var footer = div.find('#footersDiv');

        //overflowHeight = div.outerHeight(true) - header.outerHeight(true) - footer.outerHeight(true) - titleHeight + 10;
        overflowHeight = overflowObject.outerHeight(true);
        // we need to add 5. otherwise the overflowHeight is always 5 smaller than it's content ==> content = 0, height = -5
        overflowObject.height(overflowHeight + 5);
    }

    // calculate popup width if necessary
    if (resizeWidth) {
        var minwidth = div.attr('minwidth');
        if (minwidth == undefined) minwidth = 0;
        // width is always based on the widht of the first table overflowObject content (if exist)
        var overflowWidth = overflowObject.find('table').outerWidth(true);
        if (overflowWidth == undefined) {
            overflowWidth = overflowObject.outerWidth(true);
        }
        if (overflowWidth > minwidth) {
            var extraWidth = div.outerWidth(true) - div.width();
            popupWidth = overflowWidth + extraWidth;

            if (!isIE67()) {
                availableWidth -= 5;
                if (popupWidth > availableWidth)
                    popupWidth = availableWidth;
            }
        }
        else {
            popupWidth = minwidth;
        }
    }

    // only for IE6, the scrollbar of the overflow comes outside the width. Therefore, modify some styles.
    if (inOverflow && isIE67()) {
        var overflowWidth = overflowObject.width();
        overflowObject.width(overflowWidth).css({ 'padding-right': '10px', 'overflow-x':'hidden' });
    }
    overflowObject.css('overflow', 'auto');

    // resize the popup using the calculated values.
    popup.resize({ width: popupWidth, height: popupHeight });

    popupdiv.trigger('AfterResized'); //Launch the event AfterResized (if an event is binded)
}

function SetVisibilityItemsPopUp(parameters) {
    //    debugger;
    if (!parameters.title) {        // hide the blue title
        $('#colorbox div#cboxTopCenter').css('background-color', '#FEFEF9');
    }
    else {                           // show title bar
        $('#colorbox div#cboxTopCenter').css('background-color', '#003163');
    }

    if (!parameters.showClose) {  // show the close button (cross)
        $('#colorbox div#cboxClose').attr('style', 'display:none !important');
    }
    else {
        $('#colorbox div#cboxClose').attr('style', 'display:block !important');
    }

}

// show a popup with a page as content
function ShowIframePopUp(page, title, width, height, properties) {
    //debugger;
    // declare default colorbox parameters
    var defaults = { title: title
            , width: width + 'px'
            , height: height + 'px'
            , opacity: 0.50
            , resize: true                                // set this to 'false' for production, 'true' for development
            , showClose: false                            // show the close button
            , resizeWidth: false
            , escKey: true
            , overlayColor: '#000'
            , hideFooter: false
            , onOpen: function() {
                //debugger;
                $('#cboxOverlay').css('background-color', defaults.overlayColor);
                $('.ToolBar .ImgBtn:not(:disabled)').blur();    // trigger the blur on toolbar buttons to remove selected style
                ShowPopUpEvent();                      // called when popup opens
            }
            , onComplete: function() {                     // called when popup-content is loaded
                var iframe = $('#colorbox iframe');
                iframe.load(function () {
                    if (defaults.hideFooter) {
                        var contentDiv = iframe.contents().find('div.popUpContent');
                        var footer = contentDiv.find('#footersDiv');
                        footer.css('display', 'none');
                    }

                    if (defaults.resize) {
                        var contentDiv = iframe.contents().find('div.popUpContent');
                        contentDiv.css('height', '100%');
                        ResizePopUpToDivCalculation2(contentDiv, $(window).height(), $(window).width(), defaults.resizeWidth);
                    }

                    SetVisibilityItemsPopUp(defaults);

                    var colorbox = $('#colorbox');
                    colorbox.width(colorbox.width() + 2).height(colorbox.height() + 2).popupIframe();
                    EnablePage(true);
                });
            }
            , onClosed: function() {
                //debugger;
                ClosePopUpEvent();                   // called when popup closed
                $('#colorbox').trigger('close');    // trigger all custom close events
                $('#colorbox').unbind('close');     // remove all custom close events
            }
    };

    if (properties) $.extend(defaults, properties);

    $.fn.agpopup('iframe', { href: page, resize: false }, defaults);
}

// show a popup with a div as content
function ShowInlinePopUp(div, title, width, height, properties) {
    //debugger;
    var divControl = $('#' + div);

    // declare default colorbox parameters
    var defaults = { title: title
            , width: width + 'px'
            , height: height + 'px'
            , opacity: 0.50
            , resize: true
            , showClose: false
            , resizeWidth: true
            , escKey: false
            , overlayColor: '#000'
            , onOpen: function () {
                //debugger;
                $('#cboxOverlay').css('background-color', defaults.overlayColor);
                $('.ToolBar .ImgBtn:not(:disabled)').blur();    // trigger the blur on toolbar buttons to remove selected style
                ShowPopUpEvent();                      // called when popup opens            
                divControl.show();
            }
            , onComplete: function () {                     // called when popup-content is loaded
                //debugger;
                if (defaults.resize) {
                    var contentDiv = divControl.find('div.popUpContent');
                    ResizePopUpToDivCalculation2(contentDiv, $(window).height(), $(window).width(), defaults.resizeWidth);
                }

                SetVisibilityItemsPopUp(defaults);

                var colorbox = $('#colorbox');
                colorbox.width(colorbox.width() + 2).height(colorbox.height() + 2).popupIframe();
            }
            , onCleanup: function () {
                //debugger;
                divControl.hide();
            }
            , onClosed: function () {
//                debugger;
                // remove the style attribute as configured in the resize function. Not doing so will result in a miss-calculation the next time the same popup is called with a different content.
                var popupContent = divControl.find('div.popUpContent');
                var overflowDiv = popupContent.find('#overflowDiv');
                if (overflowDiv.length == 0)
                    overflowDiv = popupContent;
                overflowDiv.removeAttr('style');

                ClosePopUpEvent();                   // called when popup closed
                $('#colorbox').trigger('close');    // trigger all custom close events
                $('#colorbox').unbind('close');     // remove all custom close events                
            }
    }

    if (properties) $.extend(defaults, properties);

    //    debugger;
    $.fn.agpopup('inline', { href: '#' + div },     // ag parameters
        defaults
    );
}

// close popup event for IE67
function ClosePopUpHandler() {
    $.colorbox.close();
    Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(ClosePopUpHandler);
}
// close the current popup
function ClosePopUp() {
    // when IE6 or 7, and we're in an Async postback (updatepanel), delay the closing. This will remove the 'flikkering' of the page
    if (isIE67() && Sys.WebForms.PageRequestManager.getInstance().get_isInAsyncPostBack())
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ClosePopUpHandler);
    else
        $.colorbox.close();
}
// close the current parent popup
function CloseParentPopUp() {
    window.parent.$.colorbox.close();
}

function AddClosePopUpEvent(event) {
    $('#colorbox').bind('close', event);
}


