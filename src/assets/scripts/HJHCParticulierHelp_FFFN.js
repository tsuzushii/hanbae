/// <reference path="http://ajax.Microsoft.com/ajax/jQuery/jquery-1.4.1.min-vsdoc.js" />
var helpPopUp;

function GetHelpPopUp() {
    if (helpPopUp == null)
        helpPopUp = $('.helpPopUp');
    return helpPopUp;
}

// function called when help request succeeds
function OnHelpRequestComplete(result) {
//    debugger;
    var index = result.indexOf(':');
    var helpCode = result.substring(0, index);
    var help = result.substring(index + 1, result.length);
    if (helpCode !== '') // only cash when a code is available
        $('body').data(helpCode, help);
    DisplayHelp(help);
}

// function called when help request failed
function OnHelpRequestError(error) {
//    debugger;
    DisplayHelp(error.get_message());
}

function DisplayHelp(help) {
//    debugger;
    var popup = GetHelpPopUp();
    popup.find('img').hide();
    popup.find('.smallPopUpContent').show().html(help);
    popup.redrawShadow();
    popup.popupIframe();    // resizes the iframe inside the popup
}

function CloseSmallPopUp(event){
    if(event.data.popup != undefined)
        event.data.popup.removeShadow().hide();
    $('body').unbind('click.smallPopUp');
}

function ShowHelpPopUp(e) {
    
    e.preventDefault();

    var button = $(this);
    var offset = button.offset();
    offset.top += 20;
    
    var parameter = button.attr('commandargument');

    var popup = GetHelpPopUp();
    popup.show();
    popup.css('position', 'absolute');

    //deplace popup to the left if right border is out of the windows
    var popupOffsetRigth = (offset.left + popup.outerWidth(true));
    if (popupOffsetRigth > $(window).width())
    {
        offset.left = offset.left - popupOffsetRigth + $(window).width() - 10; // 10 px for the shadow
    }

    popup.offset(offset);
    popup.removeShadow();
    popup.dropShadow();
    popup.find('.smallPopUpContent').hide();
    popup.find('img').show(); //.html('Loading data...');
    popup.redrawShadow();

    popup.popupIframe();
    
    $('body').bind('click.smallPopUp', {popup: popup}, CloseSmallPopUp);

    if ($('body').data(parameter) == null) {
        if (parameter !== '')
            $('body').data(parameter, '');
        PageMethods.GetHelpString(parameter, OnHelpRequestComplete, OnHelpRequestError);
    }
    else
        DisplayHelp($('body').data(parameter));

}

// events linked to the help popup.
function HelpEvents() {
    // event on help button click
    $('button.helpButton:not(.helpButtonDisabled)').live('click', ShowHelpPopUp);
    // add draggable features to small popup (help/octrooi)
    $('div.smallPopUp').draggable({
        start: function(event, ui) {
            var popup = $(this);
            popup.removeShadow();
        },
        stop: function(event, ui) {
            var popup = $(this);
            popup.redrawShadow();
        }
    });
    // close button for small popup (help/octrooi)
    $('div.smallPopUp div.popUpCloseButton').live('click', {popup:$(this).parents('div.smallPopUp') }, CloseSmallPopUp);
};

// hide the help dropdown menu in the util bar.
function HideHelpMenu(event){
    event.data.menu.slideUp('fast');
    $('body').unbind('click',HideHelpMenu);
}

// show the help dropdown menu in the util bar.
function ShowHelpDropDownMenu(link)
{
    // find list to display.
    var list = $('.ButtonListHelpPopUp');
    // only do following when list not yet displayed.
    //Infosys - Changing the comparision property as "Visible" is not working for all browsers. - Defect 198496
    if (list.css("display") == "none") {
        $('body').click(); /* execute body click event to hide any open menus */    
        
        var menuOffset = link.offset();
        // we need to show the list before we can get the width of it for our calculation.
        // the slideDown does not seem to work in IE8, so we keep showing it at this point.
        list.show();
        menuOffset.top = menuOffset.top + link.outerHeight();
        menuOffset.left = menuOffset.left - list.outerWidth() + link.outerWidth();
        // we still need this strange concatination to display the menu correctly in both IE6 and 8. 
        // the slideDown does not seem to work in IE8.
        list.offset(menuOffset).slideDown('fast').offset(menuOffset);
        // hook up the close event on body click.
        $('body').bind('click', {menu:list}, HideHelpMenu);
    }
}

function ShowOffset(offset)
{
    var str = "Top: "+offset.top + "  Left: "+offset.left;
    alert(str);
}

