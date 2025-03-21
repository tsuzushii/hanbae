// value of the attribute indicating if a control needs to stay disabled when enabling controls in javascript.
var CSS_STAYDISABLED = "staydisabled";
var CSS_ISMANDATORY = "ismandatory";
var CSS_MANDATORY = "mandatory";
var CSS_DISABLED = "disabled";
var CSS_DROPDOWN_DISABLED = "dropdownDisabled";

var ATR_DISABLED = "disabled";

// function to verify if working on IE 6 or not
function isIE6() {
    return $.browser.msie && $.browser.version == '6.0';
}

function HandleClose() {
    // This only works for internet explorer !
    //    if (((window.event.clientX < 0) && ((window.event.clientY < 0) || window.event.clientY > GetHeight())))
    // --- X33296 : The test on < 0 has been replaced by a test on < -7000. This is a
    // --- quick and dirty way to solve the problem of the session abandoning when the
    // --- mousepointer is located above and to the left of the application (to test, just
    // --- run the application in a window, do something to refresh the screen -like clicking
    // --- on the next or previous buttons- and quickly move the mouse pointer left and above
    // --- the window). When the application is actually closing, clientX and clientY
    // --- always contains -9xxx. This test should be replaced by something more reliable
    // --- and clean after R06
    if (((window.event.clientX < -7000) && ((window.event.clientY < -7000) || window.event.clientY > GetHeight()))) {
        PageMethods.AbandonSession();
    }
}

function GetHeight() {
    var myHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myHeight = document.body.clientHeight;
    }
    return myHeight;
}

function IeHacks() {
    // hacks to  make things work in ie6
//    if (isIE6()) {
//        // search button on Récupe page
//        $('#SearchTextSpan').css('display', 'block');
//        $('#SearchTextSpan').width(420);
//        $('#SearchTextSpan').css('float', 'left');
//    }
}

function ClosePopUp(Popup) {

    Popup.Hide();
}

/* Request 149172: 
On apprearance of popup: 
- Disable all controls in the background, so they can't be changed using tab/enter/space. 
Enable them on disappearance of popup. */
var listControl;

function getCaret(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {

        // The current selection
        var range = document.selection.createRange();
        // We'll use this as a 'dummy'
        var stored_range = range.duplicate();
        // Select all text
        stored_range.moveToElementText(el);
        // Now move 'dummy' end point to end point of original range
        stored_range.setEndPoint('EndToEnd', range);
        return stored_range.text.length;
    }
    return 0;
}

function SetCursorPosition(oField, pos) {
    // HERE txt is the text field name


    //FOR FireFox
    if (oField.setSelectionRange) {
        oField.focus();
        oField.setSelectionRange(pos, pos);
    }

    // For IE
    else if (oField.createTextRange) {
        var range = oField.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

var previousInputText;
function DoKeyDownLogic(area) {
    var maxRows = 5;
    var maxChar = 70;

    if ((window.event.keyCode == 8) || (window.event.keyCode == 16) || (window.event.keyCode == 35) ||
                (window.event.keyCode == 36) || (window.event.keyCode == 37) || (window.event.keyCode == 38) ||
                (window.event.keyCode == 39) || (window.event.keyCode == 40) || (window.event.keyCode == 45) ||
                (window.event.keyCode == 46))
        return; // do nothing

    var lines = area.val().split('\n');
    var actualLines = new Array();
    var lineNr = 0;
    var newLinesNr = 0;
    var range = getCaret(area[0]);

    while (lineNr < lines.length) {
        if (lines[lineNr].length > maxChar) {
            var tempLine = lines[lineNr];
            while (tempLine.length > maxChar) {
                actualLines[newLinesNr++] = tempLine.substring(0, maxChar);
                tempLine = tempLine.substring(maxChar, tempLine.length);
            }
            actualLines[newLinesNr++] = tempLine;
        }
        else {
            actualLines[newLinesNr++] = lines[lineNr];
        }
        lineNr++;
    }

    if (actualLines.length > maxRows) {
        area.val(previousInputText);
        // '\n' between start and cursor position.
        var nrReturns = area.val().substring(0, range).split('\n').length - 1;
        if (window.event.keyCode == 13) range++;
        SetCursorPosition(area[0], range - 1 - nrReturns);
    }
    else {
        previousInputText = area.val();
    }
}

/*
REMARK : DO NOT USE function DoOnKeyPress anymore

USE function OnlyNumericAllowed on KeyPress event and function SetFocus on KeyUp event

Otherwise a non expected behavior occurs : For example

Type 9 in the day box and go to the month box (day = 9)
Come back to day box and place the cursor in front of 9 and type 1 : you expect 19
But you receive 91 because the line "obj.value += String.fromCharCode(window.event.keyCode)"

(V HELLIN)
*/
function DoOnKeyPress(obj, NextObj) {
    if (window.event.keyCode >= 33) {
        if (window.event.keyCode >= 48 && window.event.keyCode <= 57) {
            if (obj.value.length == obj.maxLength - 1) {
                if (NextObj != undefined) {
                    obj.value += String.fromCharCode(window.event.keyCode);
                    window.event.returnValue = false;
                    window.event.cancelBubble = true;

                    if (NextObj.style.display != "none") {
                        NextObj.focus();
                        NextObj.select();
                    }
                }
            }
        }
        else {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
    }
}

function OnlyNumericAllowed(e) {   
    if (window.event.keyCode < 48 || window.event.keyCode > 57) {
        window.event.returnValue = false;
        window.event.cancelBubble = true;
    }
}

/* Move focus to another object when keycode is not an arrow key and maxLength is reached*/
function SetFocus(obj, NextObj) {
    if (obj.value.length >= obj.maxLength
    && NextObj != undefined
    && window.event.keyCode >40) {
                
        window.event.returnValue = false;
        window.event.cancelBubble = true;

        if (NextObj.style.display != "none") {
            NextObj.focus();
            NextObj.select();
        }
    }
}

function DoOnBlur(obj, Lbl) {
    if (Lbl != undefined)
        Lbl.style.color = "";

    if (obj.value.length > 0) {
        for (var iLoop = obj.value.length; iLoop < obj.maxLength; iLoop++) {
            obj.value = '0' + obj.value;
        }
    }
}

// add mandatory styles to control
function SetControlMandatory(cl, forceMandatory) {
    if (cl.hasClass(CSS_ISMANDATORY) || forceMandatory) {
        cl.addClass(CSS_MANDATORY);
        // add asterisk to corresponding label (use label for)
        var label = $("label[for='" + cl.attr('id') + "']");
        var text = $.trim(label.text());
        if (text.lastIndexOf('*') !== text.length - 1) {
            text += " *";
        }
        label.text(text);
    }
}

// remove mandatory styles from control
function UnsetControlMandatory(cl) {
    cl.removeClass(CSS_MANDATORY);
    // remove asteriks from corresponding label (use label for)
    var label = $("label[for='" + cl.attr('id') + "']");
    var text = $.trim(label.text());
    if (text.lastIndexOf('*') === text.length - 1) {
        text = $.trim(text.substring(0, text.length - 1));
    }
    label.text(text);
}

// Set accessibility of a control (TextBox, DropDownList, ...)
// TODO : add parameter to indicate if the control needs to be cleared when disabled or not.
/* PARAMETERS
@cl - the control being worked on.
@enabel - enable or disable the control.
@mandatory - when given a value it will use this value to manage mandatory. Default not mandatory when disabled.
@forceMandatory - if we want to force a field to be set to mandatory even if it was not mandatory at first rendering
*/
function AccessibilityInputControl(cl, enabel, mandatory, forceMandatory) {
    var autoManageMandatory = mandatory == null;    // default not mandatory when disabled.
    if (forceMandatory == null) {
        //default value
        forceMandatory = false;
    }
    if (cl[0] !== undefined) {
        if (!enabel) { // disable the control
            cl.data('val', cl.val());       // save value to data cash of control
            cl.val('');                     // empty the control
            cl.attr(ATR_DISABLED, ATR_DISABLED); // set disabled attribute

            if (autoManageMandatory || !mandatory) {
                // add disabled class
                cl.addClass(CSS_DISABLED_INPUT);
                //                debugger;
                //                if (cl.is('select'))
                //                    cl.addClass(CSS_DROPDOWN_DISABLED);                
                // remove mandatory class
                UnsetControlMandatory(cl);
            }
            else if (mandatory) {
                // remove disabled class
                cl.removeClass(CSS_DISABLED);
                //                cl.removeClass(CSS_DROPDOWN_DISABLED);                
                // set control mandatory as specified
                SetControlMandatory(cl, forceMandatory);
            }
        }
        else {          // enable the control if possible
            if (!cl.hasClass(CSS_STAYDISABLED)) {
                cl.removeAttr(ATR_DISABLED);  // remove disabled attribute
                cl.removeClass(CSS_DISABLED);   // remove disabled class
                //                cl.removeClass(CSS_DROPDOWN_DISABLED);
                if (cl.data('val') != undefined) {
                    cl.val(cl.data('val'));     // fill value with value stored in data cash of control
                    cl.removeData('val');
                }

                if (autoManageMandatory || mandatory) {
                    // set control mandatory
                    SetControlMandatory(cl, forceMandatory);
                }
                else if (!mandatory) {
                    // remove mandatory as specified
                    UnsetControlMandatory(cl);
                }
            }
        }
    }
}
// Start FIX 184582 - Infosys (I17487) : 14/09/2011
function ChangeLabelColorOnControlFocus(labelToChange, controlFocused, targetColor) {
    var currentColor = $(labelToChange).css('color');
    $(controlFocused).focus(function() {
        $(labelToChange).css('color', targetColor);
    });
    $(controlFocused).blur(function() {
        $(labelToChange).css('color', currentColor);
    });
}

function ChangeLabelColorOnRadioListFocus(labelToChange, controlFocused, targetColor) {
    var currentColor = $(labelToChange).css('color');
    var count = 0;
    var numberOfRadioButtons = $(controlFocused + ' input').length;
    while (count < numberOfRadioButtons) {
        $(controlFocused + '_' + count).focus(function() {
            $(labelToChange).css('color', targetColor);
            $(this).next().css('color', targetColor);
        });
        $(controlFocused + '_' + count).blur(function() {
            $(labelToChange).css('color', currentColor);
            $(this).next().css('color', currentColor);
        });
        count++;
    }
}

function ChangeCheckBoxColorOnFocus(controlFocused, targetColor) {
    var currentColor = $(controlFocused).next().css('color');
    $(controlFocused).focus(function() {
        $(this).next().css('color', targetColor);
    });
    $(controlFocused).blur(function() {
        $(this).next().css('color', currentColor);
    });
}
// End FIX 184582 - Infosys (I17487) : 14/09/2011