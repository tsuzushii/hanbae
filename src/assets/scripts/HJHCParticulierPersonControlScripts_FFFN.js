    var callChangeOnFocusTitle = true;
    var callChangeOnFocusSex = true;
    var firstPageLoad = true;

    var firstnameusedAttribute = 'firstnameused';
    var firstname2usedAttribute = 'firstname2used';
    var lastnameusedAttribute = 'lastnameused';
    var lastname2usedAttribute = 'lastname2used';
    var relationtypeAttribute = 'relationtype';
    var codesexAttribute = 'codesex';

    var dlTitle;
    var dlSex;
    var dlLegal;
    var tbName;
    var tbName2;
    var tbFirstName;
    var tbFirstName2;
    var hdSex;
    var cBirthDate;
    var pnPerson;

    // disable the birthdate control
    function DisableBirthDate() {
//        alert('in DisableBirthDate()');
        cBirthDate.find('input:text').disable();
        cBirthDate.labels().addAsterisk(false);
//        $('#<%= LabelDateOfBirth.ClientID %>').addAsterisk(false);
    }

    // enable the birthdate control
    function EnableBirthDate() {
        
//        alert('in EnableBirthDate();');
        var ismandatory = false;
        cBirthDate.find(':text').disable(false);

        if (ismandatory) {
            cBirthDate.labels().addAsterisk();
//            $('#<%= LabelDateOfBirth.ClientID %>').addAsterisk();            
        }
    }

    // set the value of the sex dropdown
    function SetSexValue(val) {
//        alert('in SetSexValue();');
//        debugger;
        if (val !== undefined) {
            dlSex.val(val);
            dlSex.data('val', val);            
            hdSex.val(val);
        }
        else {
            hdSex.val(dlSex.val());
        }
    }

    // perform the connectivities between the controls on the page.
    // this function will enable/disable and manage mandatory of the controls according to the selected Title.
    function PerfomConnectivities() {
//        alert('in PerformConnectivities();');
        if (dlTitle.val() === "") {
            dlTitle.disable(false);
        }
        else {
            // get values of selected Title
            var selectedOption = dlTitle.find(':selected');
            if (selectedOption !== null) {
                // get attributes of the selected Title
                var sexCode = selectedOption.attr(codesexAttribute);
                var relationType = selectedOption.attr(relationtypeAttribute);
                var firstnameenabled = selectedOption.attr(firstnameusedAttribute) !== undefined;
                var firstname2enabled = selectedOption.attr(firstname2usedAttribute) !== undefined;
                var lastnameenabled = selectedOption.attr(lastnameusedAttribute) !== undefined;
                var lastname2enabled = selectedOption.attr(lastname2usedAttribute) !== undefined;

                // If relationType is undefined, name and firstname are need to stay enabled (in RCF for ex.)
                if (relationType === undefined)
                    return;

                if (selectedOption.val() == "999") {
                    // When value is 999 (Title not filled-in), all fields are enabled.
                    dlLegal.disable(false);
                    dlSex.disable(false);
                    EnableBirthDate();
                    tbName.disable(false);
                    tbFirstName.disable(false);
                    if(dlLegal.length > 0)
                            dlLegal.get(0).selectedIndex = -1;
                    return;
                }
                
                // check relationType of the selected Title
                switch (relationType) {
                    case "0": // corporation
                        // enable legal DL & set mandatory
                        // Start FIX 186647 - Infosys (I17487) : 26/05/2011
                        dlLegal.disable(false);//.mandatory(false);
                        // End FIX 186647 - Infosys (I17487) : 26/05/2011
                        // set Sex to none
                        SetSexValue('0');
                        // disable Sex
                        dlSex.disable().mandatory(false);
                        // disable birthdate
                        DisableBirthDate();
                        break;
                    case "1": // person
                        //debugger;
                        // disable legal DL & remove mandatory
                        dlLegal.disable();//.mandatory(false);

                        if (sexCode === "0") // sextype none, keep sex enabled
                        {
                            if (dlTitle.is(':disabled'))
                            {
                                dlSex.disable().mandatory(false);
                            }
                            else
                            {
                                dlSex.disable(false);
                            }
                        }
                        else
                        {
                            SetSexValue(sexCode);
                            // TODO : followin does not yet work in Fire!!
                            if (dlSex.hasClass(CSS_MANDATORY))   // if mandatory, keep mandatory style when disabled
                                dlSex.disable().mandatory(true, true);
                            else
                                dlSex.disable().mandatory(false);
                        }
                        // enable birthdate
                        EnableBirthDate();
                        if(dlLegal.length > 0)
                            dlLegal.get(0).selectedIndex = -1;
                        break;
                    case "3": // group
                        // disable legal DL & remove mandatory
                        dlLegal.disable();//.mandatory(false);
                        // set Sex to none
                        SetSexValue('0');
                        // disable Sex
                        dlSex.disable().mandatory(false);
                        // disable birthdate
                        DisableBirthDate();
                        if(dlLegal.length > 0)
                            dlLegal.get(0).selectedIndex = -1;
                        break;
                }
            }

            // set enabled & mandatory for TB names according to selected attributes
            // TODO : enabled == mandatory ==> true because only proposition Fire insurancetaker can have multiple Title-types.
            // this won't work when extended.
            tbName.disable(!lastnameenabled);
            if(!lastnameenabled)
                tbName.val('');
            tbFirstName.disable(!firstnameenabled).filter(':has('+CSS_MANDATORY+')').mandatory(firstnameenabled);
            if(!firstnameenabled)
                tbFirstName.val('');
            tbName2.disable(!lastname2enabled).mandatory(lastname2enabled);
            if(!lastname2enabled)
                tbName2.val('');
            tbFirstName2.disable(!firstname2enabled).mandatory(firstname2enabled);
            if(!firstname2enabled)
                tbFirstName2.val('');
        }
    }
    
    function BindChangeEvents() {
        dlTitle.bind($.browser.msie ? 'propertychange' : 'change', function(e){ 
            if(e.type == 'change' || e.type == 'propertychange' && window.event.propertyName == 'selectedIndex'){
                PerfomConnectivities();
            }
        });
        dlSex.bind($.browser.msie ? 'propertychange' : 'change', function(e){ 
            if(e.type == 'change' || e.type == 'propertychange' && window.event.propertyName == 'selectedIndex'){
                SetSexValue(); 
            }
        });
    }
    
    function PersonControlLoadedEvent(sender, args)
    {
//        debugger;
        PerfomConnectivities();
        firstPageLoad = false;
        
        $("#<%= FieldToSetTheFocusOn.Value %>").focus();
        // cannot call this in document.ready because file is not yet loaded
        BindChangeEvents();
        
        Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(PersonControlLoadedEvent);
        Sys.WebForms.PageRequestManager.getInstance().remove_pageLoaded(PersonControlLoadedEvent);        
    }
    
    function ReApplyTextBoxStyles(panel)
    {
        var space = ' ';
        panel.find(':text:not(:disabled)').each(function(){
            var originalVal = $(this).val();
            $(this).val(space);
            $(this).val(originalVal);
        });
    }
    // to fix a bug in ie6/7 with styles in textboxes,
    // we need to change the value of the textbox after each async update.
    function ReApplyTextBoxStylesEvent(sender, args)
    {
        if(isIE67())
        {
            var intervenientTable = $('#intervenientTable');
            
            if(intervenientTable.length > 0)
            {
                ReApplyTextBoxStyles(intervenientTable);
            }
            Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(ReApplyTextBoxStylesEvent);            
        }    
    }
