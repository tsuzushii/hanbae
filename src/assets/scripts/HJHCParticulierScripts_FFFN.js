/******************************************************/
/** Custom scripts used in the OL application        **/
/******************************************************/

/**********************************************************************************************************/
/* Constants */
var CSS_DISABLED = 'disabled';
var CSS_DISABLED_BUTTON = 'buttonDisabled';
var CSS_DISABLED_INPUT = 'inputDisabled';
var CSS_DISABLED_HELPBUTTON = 'helpButtonDisabled';
var CSS_DISABLED_FORCED = 'stayDisabled';
var CSS_MANDATORY = 'mandatory';
var CSS_MANDATORY_FORCED = 'forceMandatory';
var CSS_HOVER = 'hover';

var ATTR_DISABLED = 'disabled';
var ATTR_CHECKED = 'checked';

var MIN_WIDTH = 1000;    /* Minimal wid we support */
var MIN_HEIGHT = 640;  /* Minimal height we support */

var treeviewScrollObject;   /* Object containing all info and methods to scroll in the treeview. */

/**********************************************************************************************************/
/* GLOBAL VARIABLES */
var windowWidth;
var windowHeight;
var getScreenValues = true;
var canEnablePage = true;
var LaunchPrintPdfPreview = false;

/**********************************************************************************************************/
/* GENERAL FUNCTIONS */

function LaunchPrintPreviewPopup() {
    if (LaunchPrintPdfPreview) {
        LaunchPrintPdfPreview = false;

        var popupTitle = $('#HiddenPdfPrintViewPopupTitle').val();
        var showPopupWithPostback = $('#HiddenShowPdfPrintViewPopupWithPostback').val();

        if (showPopupWithPostback == 'false') {
            ShowIframePopUp('FWHCParticulierPrintPopupPreviewView_FFFN.aspx', popupTitle, '1000', '600', { resize: true, hideFooter: true, resizeWidth: true });
        }
        else {
            ShowIframePopUp('FWHCParticulierPrintPopupPreviewView_FFFN.aspx?PostBackParent=true', popupTitle, '1000', '600', { resize: true, hideFooter: true, resizeWidth: true });
        }
    }
}

// returns if browser on IE6 or IE7 or IE8 (rendermode IE7)
function isIE67() {
    return $.browser.msie && 
        ($.browser.version == '6.0' || $.browser.version == '7.0' || document.documentMode == 7 );
}

/*** Calculation functions ***/
// Convert a string to a float. If the string does not contain a numerical value, 0 will be returned
function convertStringToFloat(stringValue) {
    if(stringValue == undefined)
        stringValue = "";
        
    var vTmp, re, vRetVal, input;
    var pattern1 = new RegExp("\\.+");
    var pattern2 = new RegExp(",+");

    input = stringValue;
                
    if (pattern1.test(input) && pattern2.test(input)) {  //if input format like "123.456,12"
        input = input.replace(/\./g, "");                //remove all "."
    }

    vTmp = (1 / 2).toString().substr(1, 1); // What's the decimal comma ? ("." or ",")
    re = /\.|\,/g; 						    // Reg.exp. : find all "." or ","

    // Find all "." and "," and replace them by the decimal comma
    vRetVal = parseFloat(input.replace(re, vTmp));

    // If we do not have a numerical value, return 0
    if (isNaN(vRetVal) == true) {
        vRetVal = 0;
    }

    return vRetVal;
}

// function to round a (decimal) value to 2 decimals
function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}

function formatAmount(value) {
    var fraction; // digits after decimal point
    var integral; // digits before decimal point

    value = String(value);

    // replace the '.' decimal seperator with a ',' seperator.
    value = value.replace('.', ',');

    // if no decimals available, add 2 decimals
    if (value.indexOf(',') == -1) {
        value = value + ',00';
    }

    // split fraction and integral to their responsible variables
    fraction = value.substr(value.indexOf(',') + 1, value.length - 1);
    integral = value.substr(0, value.indexOf(','));

    if (fraction.length == 1) { // only 1 fraction after decimal point ==> add 0
        fraction = fraction + '0';
    }

    // if more than 1000 in the integral part, add '.'-seperator between each thousand
    if (integral.length > 3) {
        var tempIntegral = '';
        while (integral.length > 3) {
            tempIntegral = "." + integral.substr(integral.length - 3) + tempIntegral;
            integral = integral.substr(0, integral.length - 3);
        }
        integral = integral + tempIntegral;
    }

    return integral + "," + fraction;
}

/*********************************************************************************************/
/* custom jQuery plugins */
(function($){
    $.fn.styleBorder = function() {
        //debugger;
        if (!isIE67()) return this;  // do nothing if not IE6 or 7

        return this.each(function() {
            var $this = $(this);

            if ($this.parents('.buttonBorder').length == 0) {
                // check if the button is actually visible on the page or not
                if ($this.css('display') != 'none') {
                    // get the specified width of the button (for custom large or small buttons)
                    var originalWidth = $this.outerWidth();
                    // if no width specified, use default width of 90px, else subtract 2px (border)
                    if (originalWidth == "0") originalWidth = "90";
                    else originalWidth -= 2;
                    // get the specified height of the button (for custom high or low buttons)
                    var originalHeight = $this.outerHeight();
                    // if no width specified, use default height of 20px
                    if (originalHeight == "0") originalHeight = "20";
                    else {  // else subtract 2px (border) and reset size of button
//                        originalHeight -= 2;
                        originalHeight = originalHeight - 2;
                        $this.height(originalHeight);
                    }
                    // change properties of the button
                    $this.css('border', 'none').css('margin', '0').css('width', '100%');
                    // create span that represents button border and give it the width calculated
                    var span = $(document.createElement('span')).addClass('buttonBorder').width(originalWidth).height(originalHeight);
                    $this.before(span); // add new span before button 
                    span.append($this); // move button into the created span 
                }
            }

        });
    };
})(jQuery);

// function to apply transparent style to dropdownlists with a disabled style
(function($){
    $.fn.applyDropDownDisableStyle = function() {
//        alert('in applyDropDownDisableStyle()');
        // only do this for IE6 and IE7
        if (!isIE67()) return this;

        return this.each(function() {
            var color = "transparent";
            var element = $(this);
                
            while (color.toLowerCase() == "transparent") {
                element = element.parent();
                if (element[0].tagName.toLowerCase() == "html") {
                    break;
                }
                color = element.css("background-color");
            }
            $(this).css("background-color", color);
        });
    }
})(jQuery);

/* jQuery plugin to disable/enable controls                                             */
/* $('#myTextBox').disable();           // disables textbox                             */
/* $(':submit.button').disable(false); // enables all submit buttons with class .button */
(function($) {  
    $.fn.disable = function(disableControl)
    {
//        alert('in disable()');
        if(disableControl == undefined) disableControl = true;
        
        this.each(function() {
            var $t = $(this);
            if(disableControl){
                $t.attr('disabled','disabled');
                // remove all asterisk from the corresponding labels.
                $t.labels().addAsterisk(false);
                
                if($t.is(':text,select,:radio,:checkbox'))
                    $t.addClass(CSS_DISABLED_INPUT);
                else if ($t.is(':submit.button'))
                    $t.addClass(CSS_DISABLED_BUTTON);
                else if ($t.is('button.helpButton'))
                    $t.addClass(CSS_DISABLED_HELPBUTTON);
                    
                if($t.is('select'))
                    $t.applyDropDownDisableStyle();
            }
            else if (!$t.hasClass(CSS_DISABLED_FORCED)){    // only enable when not stay in forced disable
                $t.removeAttr('disabled');
                
                // if it has a mandatory class, (re)add the asterisk to the corresponding labels.
                if($t.hasClass(CSS_MANDATORY))
                    $t.labels().addAsterisk();            
            
                if($t.is(':text,select,:radio,:checkbox'))
                    $t.removeClass(CSS_DISABLED_INPUT);
                else if ($t.is(':submit.button'))
                    $t.removeClass(CSS_DISABLED_BUTTON);
                else if ($t.is('button.helpButton'))
                    $t.removeClass(CSS_DISABLED_HELPBUTTON);
                    
                if($t.is('select'))
                    $t.css('background-color','');
            }
        });
        
        return this;
    };
})(jQuery);

/* jQuery plugin to disable/enable controls                                             */
/* $('#myTextBox').enable();           // enable textbox                             */
(function($) {
    $.fn.enable = function()
    {
        this.each(function(){
            $(this).disable(false);
        });
        return this;
    }
})(jQuery);

/* jQuery plugin to find all labels linked to a given input field                       */
/* this plugin will go up 3 levels (will correct problem with checkbox lists)           */
/* $('#myInput').labels().addAsterisk();                                                */
/* $('select').labels().highlight();                                                */
(function($){
    $.fn.labels = function(){
//        this.each(function(){
            t = $(this).slice(0);
            if(t.length == 1){
                var id = t.attr('id');
                var idParent = t.parents('table').attr('id');                          // checkbox and radiobutton lists requires the parent table id
                var idGrandParent = t.parent().parent().attr('id');                    // DateControl requires a grandparent id
                return $('label[for='+id+'],label[for='+idParent+'],label[for='+idGrandParent+']');
            }
            else{
                return this;
            }
//        });
    }
})(jQuery);

/* jQuery plugin to set controls mandatory                                              */
/* $('#myTextBox').mandatory();           // set textbox mandatory                      */
/* $('input.inputFields').disable(false).mandatory(false); 
            // enables all inputfields and removes mandatory style                      */
/* $('#myTextBox').disable().mandatory(true,true);  
            // disables textbox and forces mandatory style */
(function($){
    $.fn.mandatory = function(setMandatory,forceMandatory){
//        alert('in mandatory()');
            if(setMandatory == undefined) setMandatory = true;
            if(forceMandatory == undefined) forceMandatory = false;
            
            this.each(function() {
                var t = $(this);
                if(!t.is(':text,select'))
                    return true;
                    
                if(setMandatory && t.not(':disabled')){
                    t.addClass(CSS_MANDATORY);
                    t.labels().addAsterisk();
                }
                else{
                    t.removeClass(CSS_MANDATORY);
                    t.removeClass(CSS_MANDATORY_FORCED);
                    t.labels().addAsterisk(false);
                }
                if(forceMandatory && !t.hasClass(CSS_DISABLED_FORCED)){
                    if(t.is('select'))                 // remove disabled inline style for select
                        t.css('background-color','');                
                    t.addClass(CSS_MANDATORY_FORCED);
                    t.labels().addAsterisk();
                }
            });
            
            return this;
        };    
})(jQuery);

/* jQuery plugin to add or remove an asterisk at the end of the text                */
(function($){
    $.fn.addAsterisk = function(add){
        if(add == undefined) add = true;
        
        this.each(function(){
            var $t = $(this);
            
            if(add){    // add the asterisk
                var text = $.trim($t.text());
                if (text.lastIndexOf('*') !== text.length - 1) {
                    text += " *";
                }
                $t.text(text);
            }
            else{       // remove the asterisk
                var text = $.trim($t.text());
                if (text.lastIndexOf('*') === text.length - 1) {
                    text = $.trim(text.substring(0, text.length - 1));
                }
                $t.text(text);
            
            }
            
            return this;
        });
    };
})(jQuery);


(function($){
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };
})(jQuery);

/* Refresh function for iframes
*  This function will refresh the iframe with the same url or the specified url.
*/
//(function($){
//    $.fn.refresh = function(){
//        debugger;
//        if(!$(this).is('iframe'))
//            return this;
//    
//        var iframe = $(this);
////        iframe[0].contentWindow.location.reload(true);
//        if(url == undefined){
//            url = iframe.attr('src');
//        }
//        iframe.attr('src','');
////        
//        iframe.attr('src',url);
//        return this;
//    };
//})(jQuery);

/* General functions */

// disables a link
function DisableLink() {
    return false;
}

// select input fields when focused
// we cannot use 'live' here because this causes unwanted effects. This function needs to be called after every async postback as well.
function SelectTextBoxOnClick() {
    $('input:text').focus(function() { 
            $(this).select();
        }
    );
}

// highlights the corresponding lables when a control has the focus
function HighlightLabels(){
    $(':radio,:checkbox,:text,select')
        .live('focusin', function () { // Use this method with UpdatePanel
            $(this).labels().addClass('red');
        })
        .live('focusout', function () { // Use this method with UpdatePanel
            $(this).labels().removeClass('red');
        });
};

function ResizePdf(){
    // gets the container div for the pdf
//    debugger;
    var pdfdiv = $('div#pdfDiv');
    if(pdfdiv.length != 1)  // no pdf on page or too many divs
        return;
        
    var content = $('div#LowerArea div#ContentArea div.Content');
    var contentHeight = content.outerHeight(true);
    // calculates heights of all tabbedsections in the content (if any)
    var tabbedHeights = 0;
    content.find('.noPdfResize').each(function(){
        tabbedHeights += $(this).outerHeight(true);
    });
    // calculates padding and margins of pdf
    var pdfExtraSpace = pdfdiv.outerHeight(true) - pdfdiv.height() + 5;
    // calculate pdf height
    
    var pdfHeight = contentHeight - tabbedHeights - pdfExtraSpace;
    
    pdfdiv.height(pdfHeight);
}

// These functions are needed to activate the scrolling inside the TreeView.
function initializeTreeviewScroll() {
    var contentID = 'GlobalNavigationScrollContent';
    var sideNavigation = $('div#LowerArea div#SideNavigation');
    var navigationMenu = $('.GN_GlobalNavigationMenu');

    var containerDiv = navigationMenu.parent().addClass('treeviewScrollContainer');
    var containerID = containerDiv.attr('id');

    navigationMenu.attr('id', contentID);

    treeviewScrollObject = new dw_scrollObj(containerID, contentID);
    treeviewScrollObject.setUpScrollControls('treeviewScrollNavigations');
}

function ResizeScreen() {
    //debugger;
    if (getScreenValues) {  // when set to true, get new window width and height
        windowWidth = $(window).width();
        windowHeight = $(window).height();

        // if scrolled below min sizes, set to min size
        if (windowWidth < MIN_WIDTH)
            windowWidth = MIN_WIDTH;
        if (windowHeight < MIN_HEIGHT)
            windowHeight = MIN_HEIGHT;
    }
    else {  // use previous calculated values and reset the flag for the next time
        getScreenValues = true;
    }

    var mainLayout = $('div#MainLayout');    
    mainLayout.width(windowWidth);
    mainLayout.height(windowHeight);

    var headerArea = $('div#HeaderArea');
    headerArea.width(windowWidth);

    var headerData = $('div#HeaderArea div.LogoBar div.HeaderData');
    var agImage = $('div#HeaderArea div.LogoBar div.agimage');
    var headerDataExtraWidth = headerData.outerWidth(true) - headerData.width();
    // #HeaderArea.width - agimage.width - headerData.margin+padding    
    var headerDataWidth = windowWidth - agImage.outerWidth(true) - headerDataExtraWidth;
    headerData.width(headerDataWidth);

    var lowerArea = $('div#LowerArea');
    var lowerAreaExtraSpace = lowerArea.outerHeight(true) - lowerArea.height();
    // windowHeight - headerArea.height - lowerarea.margin+padding
    var lowerAreaHeight = windowHeight - headerArea.outerHeight(true) - lowerAreaExtraSpace;
    lowerArea.width(windowWidth);
    lowerArea.height(lowerAreaHeight);

    var sideNavigation = $('div#LowerArea div#SideNavigation');
    var sideNavigationExtraHeight = sideNavigation.outerHeight(true) - sideNavigation.height();
    // #LowerArea.height - #SideNavigation.border    
    var sideNavigationHeight = lowerAreaHeight - sideNavigationExtraHeight;
    sideNavigation.height(sideNavigationHeight);

    var topSpace = sideNavigation.find('.treeviewTopborder').outerHeight(true);
    var bottomSpace = sideNavigation.find('.treeviewBottomborder').outerHeight(true);
    var scrollContainerHeight = sideNavigationHeight - topSpace - bottomSpace;
    sideNavigation.find('.GN_GlobalNavigationMenu').parent().height(scrollContainerHeight);
    //sideNavigation.find('ul').height(scrollContainerHeight);

    var ulHeight = sideNavigation.find('ul').height();
    if (ulHeight > scrollContainerHeight) {
        // don't set height on this div, otherwise the scroll won't work in IE8.
        sideNavigation.find('.GN_GlobalNavigationMenu').css('height', '');
        // hook up hoover events to display navigation buttons
        sideNavigation.hover(
            function (event) {
                $(this).find('.treeviewScrollLink').fadeIn('fast');
            },
            function (event) {
                $(this).find('.treeviewScrollLink').fadeOut('fast');
            }
        );
    }
    else {
        // remove hover events
        sideNavigation.unbind('mouseenter').unbind('mouseleave');
        // set height of div to 100% to display the full side borders.
        sideNavigation.find('.GN_GlobalNavigationMenu').css('height', '100%');
    }

    var contentArea = $('div#LowerArea div#ContentArea');
    var contentAreaExtraWidth = contentArea.outerWidth(true) - contentArea.width();
    var contentAreaHeight = sideNavigation.outerHeight(true);
    // #LowerArea.width - #SideNavigation.width - #ContentArea.margin+padding
    var contentAreaWidth = windowWidth - sideNavigation.outerWidth(true) - contentAreaExtraWidth;
    contentArea.width(contentAreaWidth);
    contentArea.height(contentAreaHeight);

//    debugger;
    var content = $('div#LowerArea div#ContentArea div.Content');
    var contentExtraWidth = content.outerWidth(true) - content.width();  
    // #ContentArea.width - Content.padding+margin
    var contentWidth = contentAreaWidth - contentExtraWidth;
    // #LowerArea.height - ToolBar.height - Title.height - ErrorArea.height
    var toolbarHeight = $('div#LowerArea div#ContentArea div.ToolBar').outerHeight(true);
    var titleHeight = $('div#LowerArea div#ContentArea h1').outerHeight(true);
    var familispremiumAreaHeight = $('div#LowerArea div#ContentArea div#FamilisPremiumContainer').outerHeight(true);
    var errorAreaHeight = $('div#LowerArea div#ContentArea div#ErrorContainer').outerHeight(true);
    var contentHeight = contentAreaHeight - toolbarHeight - titleHeight - familispremiumAreaHeight - errorAreaHeight;
       
    content.width(contentWidth);
    content.height(contentHeight);
    
    ResizePdf();
    
    var errorContainer = $('div#LowerArea div#ContentArea div#ErrorContainer');
    errorContainer.width(contentAreaWidth);
//    errorContainer.find('.EDHeader').width('100%');
    //    ScrollBarContentArea();

    // activate scroll in treeview
    if (dw_scrollObj.isSupported()) {
        initializeTreeviewScroll();
    }
}

/*************************************************************************************************/
/** ToolBar related scripts                                                                     **/

/* Disable the toolbar */
function DisableToolBar(addAttribute, forceDisable) { // when addAttrubite == true, ToolBar buttons will have disabled attribute (=> no event handled)
    var toolbar = $('.ToolBar');
    
    if(forceDisable == undefined)
        forceDisable = false;
        
    toolbar.addClass(CSS_DISABLED);
    if (addAttribute == undefined || addAttribute == true) {
        toolbar.find(':submit.ImgBtn').attr(ATTR_DISABLED, ATTR_DISABLED);
    }
    
    if(forceDisable)
        $('.ToolBar').addClass(CSS_DISABLED_FORCED);
}
/* Enable the toolbar */
function EnableToolBar() {
    var toolbar = $('.ToolBar');
    if(!toolbar.hasClass(CSS_DISABLED_FORCED)){
        toolbar.removeClass(CSS_DISABLED);
        $('.ToolBar').find('span:not(.disabled) :submit').removeAttr(ATTR_DISABLED);
    }
}
/* Events for hover toolbar buttons */
function HoverToolBarButtonEvent() {
    $('.ToolBar .ImgBtn:not(:disabled)').hover( // default behaviour for all buttons
        function() { $(this).parent().addClass(CSS_HOVER); },
        function() { $(this).parent().removeClass(CSS_HOVER); }
    )
    .blur(function() { $(this).parent().removeClass(CSS_HOVER); })
    ;
}

/* Event to hide toolbar expand menu */
function HideToolBarExpand(event) {
    var visibleMenu = event.data.menu;
    visibleMenu.children('ul').slideUp('fast',
            function() { visibleMenu.removeClass('expand'); }
        );
    $('body').unbind('click', HideToolBarExpand);
}
/* Events when clicking an expand button in the ToolBar or clicking links */
function ExpandButtonClickEvents() {
    // show actions dropdown when clicking actions button
    $('.ToolBar .ImgBtnExpand').click(function (e) {
        e.preventDefault();
        var parentDiv = $(this).parent().parent();
        if (!parentDiv.hasClass('expand')) { /* only show menu when not yet shown */
            $('body').click(); /* execute body click event to hide any open menus */
            parentDiv.addClass('expand');
            parentDiv.find('ul.ActionsList').slideDown('fast');
            $('body').bind('click', { menu: parentDiv }, HideToolBarExpand);
        }
        return false;
    });}

function InitializeToolBar()
{
    HoverToolBarButtonEvent();
    ExpandButtonClickEvents();
    // set style and disable action for disabled action lists
    $('.ToolBar ul.ActionsList li a[disabled]')
        .addClass(CSS_DISABLED)
        .click(function (e) { return false; });
}

/**********************************************************************************************************/
/* GLOBAL NAVIGATION RELATED SCRIPTS */

/* Prevents to click the treeview */
function DisableTreeViewClick(e) {
//    debugger;
    e.preventDefault();
    return false;
}

/* Disable the treeview */
function DisableTreeView(addAttribute, forceDisable) {
    var sidenavigation = $('#SideNavigation');
    if(forceDisable == undefined)   
        forceDisable = false;

    sidenavigation.addClass(CSS_DISABLED);
    if(addAttribute == undefined || addAttribute == true)
        $('.GN_GlobalNavigationMenu ul li.GN_Clickable a').bind('click', DisableTreeViewClick);
        
    if(forceDisable)
        sidenavigation.addClass(CSS_DISABLED_FORCED);
}

/* Enable the treeview */
function EnableTreeView() {
    var sidenavigation = $('#SideNavigation');
    
    if(!sidenavigation.hasClass(CSS_DISABLED_FORCED)){
        sidenavigation.removeClass(CSS_DISABLED);
        $('.GN_GlobalNavigationMenu ul li.GN_Clickable a').unbind('click', DisableTreeViewClick);
    }
}

/************************************************************************************************/
/** Table related scripts                                                                      **/

// select next item in gérer menu
function SelectNextDropDownItem(list) {
    var li = list.find('li.focused');   // find focused item
    if (li.length != 0) {               // if focused item is found, focus next item
        li.removeClass('focused');
        li.next().addClass('focused');
        li.next().children('a').focus();
    }                                   // else focus first item
    else {
        list.addClass('focused');
        list.find('a:first').focus(); 
    }
}
// select previous item in gérer menu
function SelectPreviousDropDownItem(list) {
    var li = list.find('li.focused');   // find focused item
    if (li.length != 0) {               // if focused item is found, focus previous item
        li.removeClass('focused');
        li.prev().addClass('focused');
        li.prev().children('a').focus();
    }                                   // else focus last item
    else {
        list.addClass('focused');
        list.find('a:last').focus(); 
    }
}
// event to handle keys for the generalTableStyle manage list
function ManageButtonListKeyEvents(e) {
    if (e.keyCode == 27) { // escape key --> close dropdown
        HideManageButtonList();
    } else
    {
        var list = $("table.generalTableStyle tr td ul.ButtonList:visible");
        if (list.length != 0) {
            if (e.keyCode == 40 || e.keyCode == 34) {
                e.preventDefault();
                SelectNextDropDownItem(list);
            }
            else if (e.keyCode == 38 || e.keyCode == 33) {
                e.preventDefault();
                SelectPreviousDropDownItem(list);
            }
        }
    }
}
// event on scroll menu gérer
function ManageButtonScrollEvents(event, delta) {
    var list = event.data.menu;
    if (delta < 0) {
        SelectNextDropDownItem(list);
    }
    else if (delta > 0) {
        SelectPreviousDropDownItem(list);
    }
    return false;
}
// hide the manage button list of the listview
function HideManageButtonList(event) {
    event.data.menu.slideUp('fast');
    $('body').unbind('keydown.generalTableStyle');
    $('body').unbind('click', HideManageButtonList);
    $('body').unbind('mousewheel', ManageButtonScrollEvents);
}
// show menu gérer
function ShowManageButtonList(button) {
    var list = button.parents('td').children('ul.ButtonList');
    if (list.not(':visible')) {
        // triggers click on body to hide any open popups
        $('body').trigger('click');

        var btnOffset = button.offset();
        btnOffset.top = btnOffset.top + button.outerHeight();
        // ie 6 and 7 have an extra span around the button. 
        if (isIE67()){
            btnOffset.left = btnOffset.left - 1; /* span border */
            
        }
        // we have to set first the offset, slide down, and set offset again. 
        // if not, the first time the menu will be visible somewhere on the screen, except below the button ;)
        list.offset(btnOffset).slideDown('fast').offset(btnOffset);

        $('body').bind('keydown.generalTableStyle', ManageButtonListKeyEvents);
        $('body').bind('mousewheel', { menu: list }, ManageButtonScrollEvents);
        $('body').bind('click', { menu: list }, HideManageButtonList);
    }
}
// initialize javascript actions on table styles
function InitializeGeneralTableStyles() {
    $('table.generalTableStyle:not(.listFormat) tbody tr.itembody td:last-child').addClass('rightColumn');
    $('table.generalTableStyle:not(.listFormat) tbody tr.itembodyinner td.itembodyinner').addClass('rightColumn');

    $('table.generalTableStyle:not(.listFormat:not(.alternative)) tbody tr.itembody:not(.expand,.expand tr)').removeClass('alternateRow');
    $('table.generalTableStyle:not(.listFormat:not(.alternative)) tbody tr.itembody:odd:not(.expand,.expand tr)').addClass('alternateRow');
    

    $('table.generalTableStyle:not(.notHoverable,.listFormat) tbody tr:not(.disabledRow,.expand,.expand tr)').hover(
        function() { $(this).addClass('hoverRow'); },
        function() { $(this).removeClass('hoverRow'); }
    );
    // show selected style when clicking on row
    $('table.generalTableStyle:not(.notHoverable,.listFormat) tbody tr:not(.disabledRow,.selectedRow,.expand,.expand tr)').live('click',
        function() {
            $(this).siblings('tr').removeClass('selectedRow');
            $(this).addClass('selectedRow');
        }
    );

    $('table.generalTableStyle tbody tr td.buttonColumn input.button:not(:disabled,.viewOnly)').live('click', 
        function(e) {
            e.preventDefault();
            ShowManageButtonList($(this));
            return false;
        }
    );

    // Start FIX 196522 - Infosys (I17487) : 23/09/2011
    $('table.dxgvControl.generalTableStyle tbody tr td table.dxgvTable tbody tr td.dxgv.rightColumn input.button:not(:disabled,.viewOnly)').live('click',
        function (e) {
            e.preventDefault();
            ShowManageButtonList($(this));
            return false;
        }
    );
    // End FIX 196522 - Infosys (I17487) : 23/09/2011

    // focus and blur not yet supported in jQuery
    $('table.generalTableStyle tbody tr td ul.ButtonList li a').focus(function() {
        var li = $(this).parents('li');
        li.addClass('focused');
    });
    $('table.generalTableStyle tbody tr td ul.ButtonList li a').blur(function () {
        var li = $(this).parents('li');
        li.removeClass('focused');
    });
}

/************************************************************************************************/
/** Scripts regarding disabling page                                                           **/

/* Disable the page headers client-side */
function DisableHeaders()
{
    var headers = $('div#ContentArea h1, div#ContentArea h2');
    headers.addClass(CSS_DISABLED);
}
/* Dis the page headers client-side */
function EnableHeaders()
{
    var headers = $('div#ContentArea h1, div#ContentArea h2');
    headers.removeClass(CSS_DISABLED);
}

/* Disables the page client-side */
function DisableContent(addAttribute, forceDisable) {
    
    var content = $('div#ContentArea div.Content');

    if(forceDisable == undefined)
        forceDisable = false;
        
    content.addClass(CSS_DISABLED);

    if (addAttribute == undefined || addAttribute == true) {
        var selector = 'div#ContentArea div.Content div.TabbedSection input,';
        selector += 'div#ContentArea div.Content div.TabbedSection select,';
        selector += 'div#ContentArea div.Content div.TabbedSection :submit,';
        selector += 'div#ContentArea div.Content div.TabbedSection :checkbox,';
        selector += 'div#ContentArea div.Content div.TabbedSection :radio,';
        selector += 'div#ContentArea div.Content div.TabbedSection button'; //:not(table#intervenientTable.stayEnabled)
        $(selector).filter(function(){  // filter out all controls that are inside an enabled intervenient table
                return $(this).parents('table.generalTableStyle tr.expand').length == 0;
            })
            .attr(ATTR_DISABLED, ATTR_DISABLED);
    }

    $('select:disabled').applyDropDownDisableStyle();
    
    if(forceDisable)
        content.addClass(CSS_DISABLED_FORCED);
}

// enables the content area
function EnableContent() {
    var content = $('div#ContentArea div.Content');
    
    if(!content.hasClass(CSS_DISABLED_FORCED)){    
        content.removeClass(CSS_DISABLED);
        $('table#intervenientTable').removeClass('stayEnabled');

        var selector = 'div#ContentArea div.Content input:not(.inputDisabled, .buttonDisabled, .arrowDisabled, .helpButtonDisabled),';
        selector += 'div#ContentArea div.Content select:not(.inputDisabled),';
        selector += 'div#ContentArea div.Content :submit:not(.buttonDisabled, .arrowDisabled, .helpButtonDisabled),';
        selector += 'div#ContentArea div.Content :checkbox:not(.inputDisabled),';
        selector += 'div#ContentArea div.Content :radio:not(.inputDisabled),';
        selector += 'div#ContentArea div.Content button:not(.buttonDisabled, .helpButtonDisabled)';
        $(selector).removeAttr(ATTR_DISABLED);
        
        $('select:not(:disabled)').css("background-color", "");
    }
}

/* Specific functions */
/* Disables the page client-side */
function DisablePage(addAttribute) {
    DisableTreeView(addAttribute);
    DisableToolBar(addAttribute);
    DisableHeaders();
    DisableContent(addAttribute);
}

/* (re)Enables the page client-side*/
function EnablePage() {
    if (canEnablePage) {
        EnableTreeView();
        EnableToolBar();
        EnableHeaders();
        EnableContent();
    }
}

// find the parent tabbed section of a specific control
function FindTabSectionOfControl(controlID) {
    return $('#' + controlID).parents('div.TabbedSection');
}

// disable page function called from intervenients
function DisablePageFromIntervenient(sender, args, controlIDToKeepEnabled)
{
    DisablePage();
    canEnablePage = false;
    var requestManager = Sys.WebForms.PageRequestManager.getInstance();
    // at this point, it is not possible to determine if it's a async or full postback, so remove both even if they are not bound.    
    requestManager.remove_endRequest(DisablePageFromIntervenient);
    requestManager.remove_pageLoaded(DisablePageFromIntervenient);
}
// enable page function called from intervenients
function EnablePageFromIntervenient(sender, args)
{
    canEnablePage=true;
    EnablePage();
    var requestManager = Sys.WebForms.PageRequestManager.getInstance();
    // at this point, it is not possible to determine if it's a async or full postback, so remove both even if they are not bound.
    requestManager.remove_endRequest(EnablePageFromIntervenient);
    requestManager.remove_pageLoaded(EnablePageFromIntervenient);
}

// Refreshes the iframe of the pdf. 
// this expect you to have a #pdfDiv on the page, and that the iframe always has 100% width/height
function RefreshPdfIframe(){
    var div = $('#pdfDiv');
    if (div.length == 0) return;
    
    var iframe = div.find('iframe');
    if (iframe.length == 0) return;

    var source = iframe.attr('src');
            
    div.html("<iframe width='100%' height='100%' src='"+source+"'></iframe>");
}


/************************************************************************************************/
/** Scripts to keep focus after partial postback (updatepanels)                                **/
/** Script taken from 'Yuriy Solodkyy'                                                         **/
/** http://couldbedone.blogspot.com/2007/08/restoring-lost-focus-in-update-panel.html          **/
//var lastFocusedControlId = "";

//function focusHandler(e) {
//    document.activeElement = e.originalTarget;
//}

//function appInit() {
////    $(window).focus(focusHandler);
//    if (typeof (window.addEventListener) !== "undefined") {
//        window.addEventListener("focus", focusHandler, true);
//    }
//    Sys.WebForms.PageRequestManager.getInstance().add_pageLoading(pageLoadingHandler);
//    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(pageLoadedHandler);
//}

//function pageLoadingHandler(sender, args) {
//    lastFocusedControlId = typeof (document.activeElement) === "undefined"
//    ? "" : document.activeElement.id;
//}

//function focusControl(targetControl) {
//    if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
//        var focusTarget = targetControl;
//            if (focusTarget && (typeof (focusTarget.contentEditable) !== "undefined")) {
//                oldContentEditableSetting = focusTarget.contentEditable;
//                focusTarget.contentEditable = false;
//            }
//            else {
//                focusTarget = null;
//            }
//            targetControl.focus();
//            if (focusTarget) {
//            focusTarget.contentEditable = oldContentEditableSetting;
//        }
//    }
//    else {
//        targetControl.focus();
//    }
//}

//function pageLoadedHandler(sender, args) {
//    if (typeof (lastFocusedControlId) !== "undefined" && lastFocusedControlId != "") {
//        var newFocused = $get(lastFocusedControlId);
//        if (newFocused) {
//            focusControl(newFocused);
//        }
//    }
//}