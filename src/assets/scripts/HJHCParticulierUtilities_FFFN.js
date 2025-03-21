
$(document).ready(function() {    
    // events image buttons
    $('.ImgBtn:disabled').addClass("BtnDisabled");
    $('.ImgBtn:disabled').each(function() {
        var oClass = $(this).attr('class');
        var nClass = oClass.split(' ')[1];
        $(this).addClass(nClass + 'Disabled');
    });

    $('.ImgBtn').hover(
                    function() { $(this).parent().addClass('ImgBtnBorderHover') },
                    function() { $(this).parent().removeClass('ImgBtnBorderHover') }
            );

}); 

var heightSize = 65;
var heightAbsolute = 393;

//function sethover(id) {

//    //debugger;
//    var oldclassName = id.className;
//    id.className = oldclassName +'_hover';


//}
//function setout(id) {

//    var oldclassName = id.className;
//    var i = oldclassName.indexOf('_hover');
//    if (i > 0) {
//        oldclassName = oldclassName.substr(0, i);
//    }
//    id.className = oldclassName;


//}
function deducePct(step) {

    var availableHeight = document.body.scrollHeight;
    var heightalreadyOcuupied = 346;
    if (step != null)
        heightalreadyOcuupied = heightalreadyOcuupied - 20;
    if (availableHeight < 738) {
        heightSize = 64;
        heightAbsolute = 452;
    }
    else {
        heightSize = 64 + ((availableHeight - 738) * 11 / 256);
        heightAbsolute = availableHeight - heightalreadyOcuupied;
    }
    /*
    if (screen.availHeight >= 768) {
    WidthSize = 65;
    }
    if (screen.availHeight >= 994)
    {
    WidthSize = 76;
    }
    else if (screen.availHeight >= 1024) {
    WidthSize = 80;
    }
    */
    var Element = document.getElementById('MainContent');
    //Element.style.height = heightSize + '%';
    heightAbsolute = heightAbsolute - 25;
    Element.style.height = heightAbsolute + 'px';
    //var Element2 = document.getElementById('MainContent2');
    //Element2.style.height = heightAbsolute + 'px';


}

function deducePctResize(step) {

    var availableHeight = document.body.clientHeight;
    var heightalreadyOcuupied = 346;
    if (step != null)
        heightalreadyOcuupied = heightalreadyOcuupied - 20;
    if (availableHeight < 738) {
        heightSize = 64;
        heightAbsolute = 452;
    }
    else {
        heightSize = 64 + ((availableHeight - 738) * 11 / 256);
        heightAbsolute = availableHeight - heightalreadyOcuupied;
    }
    /*
    if (screen.availHeight >= 768) {
    WidthSize = 65;
    }
    if (screen.availHeight >= 994)
    {
    WidthSize = 76;
    }
    else if (screen.availHeight >= 1024) {
    WidthSize = 80;
    }
    */
    var Element = document.getElementById('MainContent');
    //Element.style.height = heightSize + '%';
    heightAbsolute = heightAbsolute - 25;    
    Element.style.height = heightAbsolute + 'px';
    //var Element2 = document.getElementById('MainContent2');
    //Element2.style.height = heightAbsolute + 'px';


}

function resizeIframe() {
    var maTDframe = document.getElementById("tdFrame"); // frame in the parent
    var maframe = document.getElementById("ctl00_ContentPlaceHolderBody2_PDFViewDoc");
    maframe.height = document.body.scrollHeight - 370; //changement de la hauteur 
    maframe.width = document.body.scrollWidth - 220; //changement de la largeur
}


function RecursiveHighlight(id, active) {

    
    if ((id.className == null) ||
            (!id.className.startsWith("intervenient")) ) /* We are not highlighting Content of Intervenient Table.*/
    {
        if ((id.childNodes != null) && (id.childNodes.length > 0)) {
            var i = 0;
            for (i = 0; i < id.childNodes.length; i++) {
                if ((id.childNodes[i].nodeName.toUpperCase() == "TD") || ((id.childNodes[i].nodeName.toUpperCase() == "TH"))) {
                    if (active)
                        id.childNodes[i].style.backgroundColor = '#FFFFFF';
                    else
                        id.childNodes[i].style.backgroundColor = '#FFFFEC';
                }
                RecursiveHighlight(id.childNodes[i], active)
            }
        }
    }

}


function highlightblock(id, active) {

    var elemNodes = id.childNodes;
   
    var iElem = 0;
    while ((iElem < elemNodes.length)) {
        if (elemNodes[iElem].nodeName.toUpperCase() == "TABLE") {
            var elemTRNodes = elemNodes[iElem].childNodes;

            var fcontinue = true;
            var i = 0;
            while ((fcontinue) && (i < elemTRNodes.length)) {
                if (elemTRNodes[i].nodeName.toUpperCase() == "TBODY") {
                    fcontinue = false;
                    elemTRNodes = elemTRNodes[i].childNodes;
                }
                i++;
            }


            var iTR = 0;
            while ((iTR < elemTRNodes.length)) {
                if (elemTRNodes[iTR].nodeName.toUpperCase() == "TR") {
                    elemTRNode = elemTRNodes[iTR];
                    var elemTDNodes = elemTRNode.childNodes;
                    var iTD = 0;
                    while ((iTD < elemTDNodes.length)) {
                        TdNode = elemTDNodes[iTD];
                        if ((TdNode.className.startsWith("celltitle")) || (TdNode.className.startsWith("cellcontent"))) {
                            if (active)
                                TdNode.style.backgroundColor = '#FFFFFF';
                            else
                                TdNode.style.backgroundColor = '#FFFFEC';
                            RecursiveHighlight(TdNode, active);
                        }
                        iTD++;
                    }
                }
                iTR++;
            }

        }
        iElem++;
    }
}

function SetHeight(id) {

    var Element = document.getElementById(id);
    Element.style.height = WidthSize + '%';
}


function SelectCountCopie(DDLSaveId, DDLNbrCopiesId, DDLPlacePrintingId) {

    
    var nombrecopies = document.getElementById(DDLNbrCopiesId);
    var placeselected = document.getElementById(DDLPlacePrintingId);
    var Valeur = nombrecopies.options[nombrecopies.selectedIndex].text;
    var ValPlacePrinting = placeselected.options[placeselected.selectedIndex].value;
    if ((Valeur == "0") && (ValPlacePrinting == "1")) {
        if (document.getElementById(DDLSaveId) != null) {
            document.getElementById(DDLSaveId).disabled = true;
            document.getElementById(DDLSaveId).style.display = "inline";
            document.getElementById(DDLSaveId).value = "True";
        }
    }
    else {
        if (document.getElementById(DDLSaveId) != null) {
            document.getElementById(DDLSaveId).disabled = false;
            document.getElementById(DDLSaveId).style.display = "inline";
        }

    }
}
function SelectPlacePrinting(DDLNbrCopiesId, DDLPlacePrintingId, DDLSaveId) {
    var PlaceType = document.getElementById(DDLPlacePrintingId);

    var valeur = PlaceType.options[PlaceType.selectedIndex].value;
    //cas central=2
    if (valeur == "2") {
        if (document.getElementById(DDLNbrCopiesId) != null) {
            document.getElementById(DDLNbrCopiesId).disabled = true;
            document.getElementById(DDLNbrCopiesId).style.display = "inline";
            document.getElementById(DDLNbrCopiesId).value = 1; //OLIVIER
            document.getElementById(DDLSaveId).disabled = false;
            document.getElementById(DDLSaveId).style.display = "inline";
        }
    }

    else {
        if (document.getElementById(DDLNbrCopiesId) != null) {
            document.getElementById(DDLNbrCopiesId).disabled = false;
            document.getElementById(DDLNbrCopiesId).style.display = "inline";
            document.getElementById(DDLSaveId).disabled = false;
            document.getElementById(DDLSaveId).style.display = "inline";
        }

    }

}

//function AfficheTxtRemark(CheckBoxCommercialInfoSendCaseId, ZoneTxtRemarkId, ZoneTextBoxUserIdId, TextBoxRemarkId) {


//    if (document.getElementById(CheckBoxCommercialInfoSendCaseId).checked) {
//        //if (document.getElementById('<%=CheckBoxCommercialInfoSendCase.ClientID%>').checked) {

//        if (document.getElementById(ZoneTxtRemarkId) != null) {
//            document.getElementById(ZoneTxtRemarkId).style.display = "inline";
//        }
//        if (document.getElementById(ZoneTextBoxUserIdId) != null) {
//            document.getElementById(ZoneTextBoxUserIdId).style.display = "inline";
//        }
//        if (document.getElementById(TextBoxRemarkId) != null) {
//            if (!document.getElementById(TextBoxRemarkId).isDisabled)
//                document.getElementById(TextBoxRemarkId).focus();
//            document.getElementById(ZoneTxtRemarkId).scrollIntoView(false);
//        }


//    }
//    else {
//        if (document.getElementById(ZoneTxtRemarkId) != null) {
//            document.getElementById(ZoneTxtRemarkId).style.display = 'none';
//        }
//        if (document.getElementById(ZoneTextBoxUserIdId) != null) {
//            document.getElementById(ZoneTextBoxUserIdId).style.display = 'none';
//        }
//    }
//}

function compte_ligne(texte) {
    var nl = "\r\n";
    var nbligne = texte.split(nl).length;
    return nbligne;
}


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

var PrevChar = 32;
function limit_carac_max_ligne(f, texte) {

    var LocPrev = PrevChar;
    PrevChar = window.event.keyCode;
    if (document.getElementById('status') != null)
        document.getElementById('status').innerHTML = window.event.keyCode + " " + window.event.shiftKey + " " + LocPrev;
    if ((window.event.keyCode == 35) || (window.event.keyCode == 36) || (window.event.keyCode == 37) || (window.event.keyCode == 39) || (window.event.keyCode == 38) && (window.event.keyCode == 40))
        document.onkeypress = process_keypress;
    else if (((LocPrev == 35) || (LocPrev == 36) || (LocPrev == 37) || (LocPrev == 39) || (LocPrev == 38) && (LocPrev == 40))
            && ((window.event.keyCode == 16) || (window.event.shiftKey)))
        ;
    else {
        var nl = "\r\n";
        var CaretPosition = getCaret(f);
        var LocEnteredChar = texte.toString().substr(CaretPosition, 1);
        var LocTextBefore = texte.toString().substr(0, CaretPosition);
        while (LocTextBefore.indexOf(nl) > 0)
            LocTextBefore = LocTextBefore.replace(nl, "\n");
        //debugger
        var CaretPosition2 = LocTextBefore.length+1;//olivier
        if ((LocEnteredChar == "\r") && (window.event.keyCode == 13)) {
            CaretPosition2 = CaretPosition2 + 1;
        }
        var tableau_result = new Array();
        var nl = "\r\n";
        var max_carac = 71; //nombre de caractère maximum par ligne + 1
        var max_ligne = 5; //nombre de ligne maximum
        var nb_ligne = 0;
        var chntmp = "";
        var Maxchn = "";
        var result = "";
        var chaine = "";
        //chaque ligne du tableau represente une ligne délimité par un \r\n
        var tableau = texte.split(nl);
        var tableau_test = new Array();

        //pour chaque ligne 
        for (var i = 0; i < tableau.length; i++) {
            //on recupère la ligne
            chntmp = tableau[i];
            //si une ligne utilise X lignes du textarea
            while (chntmp.length > max_carac - 1) {
                //on recupère les max premiers caractères
                Maxchn = chntmp.substring(0, max_carac - 1);
                //on récupère le reste de la chaine
                chntmp = chntmp.substring(max_carac, chntmp.length - 1);
                tableau_result.push(Maxchn);
                //            var test=Maxchn.substring(0,3

            }
            tableau_result.push(chntmp);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////	
        //on parcourt tableau_result pour réafficher le tableau 
        //Problème d'ajout des retour à la ligne pour le réaffichage
        //Il n'y a saut à la ligne que si pour tableau_result[i], il existe un tableau_result[i+1]
        //on connait la taille de tableau_result : tableau_result.length
        for (var i = 0; i <= tableau_result.length - 1; i++) {
            // si on est à la fin du tableau on ne rajoute pas de \n
            if (i < tableau_result.length - 1) {
                result += tableau_result[i] + "\r\n";
            }
            else {
                result += tableau_result[i];
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////////////////	
        //Limitation du nombre de ligne
        nbligne = compte_ligne(result);
        tableau = result.split(nl);
        if (nbligne > max_ligne - 1) {
            for (var i = 0; i < max_ligne; i++) {
                if (i < max_ligne - 1) {
                    chaine += tableau[i] + '\r\n';
                }
                else {
                    chaine += tableau[i];
                }
            }
            f.value = chaine;
        }
        else {
            tableau_test = result.split(nl);
            f.value = result;

        }
        SetCursorPosition(f, CaretPosition2);
    }
}

function process_keypress() {

    if (window.event.type == "keypress" & window.event.keyCode > 0) {

        //Et que cet évènement correspond à une pression
        //sur la flèche de droite, on éxécute suivante()

        if (window.event.keyCode == 124) {
            suivante();
        }

        //Si cet évènement est une pression sur la flèche de gauche
        //alors on éxécute precedente()
        if (window.event.keyCode == 123) {
            precedente();
        }
    }
    return true;
}



// limits a textarea input to max 5 lines of 70 charactes
var maxRows = 5;
var maxChar = 70;
var previousInputText;
function limitTextarea(area) {    
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
function GetVerticalPosition(iex, HiddenField) {
    var iex = document.activeElement.id;
    var hideText = document.getElementById(HiddenField);
    if (iex) {
        ypos = event.y;
        hideText.value = ypos-300;
    } else {
        
        ypos = e.pageY;
    }

}

// TO BE DELETED
//function ClosePopUp(Popup) {
//    
//    Popup.Hide();
//}  

