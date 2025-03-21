    function OnPopupLoaded() {
//        debugger;
        resizeWinTo('mydiv');
        HookUpHoverStyles();
    }

    // resize the popup to the default div.
    // dataDiv is the div on which the overflow is placed. 
    function ResizePopUpToDiv(popUp, dataDiv) {
//        debugger;
        var popupID = popUp.windowElements[-1].id;
        var div = $('#'+popupID+' .PopUp');
        var overFlowObject = $('#'+popupID+' #' + dataDiv);

        var width = div.width();
        var height = div.height();

        var scW = screen.availWidth ? screen.availWidth : screen.width;
        var scH = screen.availHeight ? screen.availHeight : screen.height;

        scH = scH - 100;     // Take 100 pixels extra for borders, title, and other stuff we forgot
        if (dataDiv == null)
            overFlowObject = div;

        if(height > scH){
            // Add scrollbars to data table
            overFlowObject.css('overflowY', 'auto');
            
            // Height of the data table = available height - overhead on screen
            overFlowObject.height(scH - (height - dataDiv.height));

            overFlowObject.height(scH);

            height = scH;
        }

        if (width < 450) width = 450;

        popUp.SetSize(width, height);
        popUp.UpdatePosition();

    }
