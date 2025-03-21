var CT_PRECISION = 2;
var CT_MaxCommission = 0;
var CT_CommissionTar = 0;

function OLClientPRI(bIsBroker) {
    this._aryBse = new Array();
    this._aryTot = new Array();
    this._aryLnk = new Array();
    this._aryFchGlobal = new Array();
    this._aryFchGarantie = new Array();
    this.IsBroker = bIsBroker;

    this.AdjustDecimals = OLClientPRI_AdjustDecimals;
    this.GetValueFractionnementMult = OLClientPRI_GetValueFractionnementMult;
    this.GetValueFractionnementDiv = OLClientPRI_GetValueFractionnementDiv;
    this.GetValueCommission = OLClientPRI_GetValueCommission;
    this.GetValueTaxes = OLClientPRI_GetValueTaxes;
    this.GetValueCosts = OLClientPRI_GetValueCosts;
    this.ReCalcAll = OLClientPRI_ReCalcAll;
    this.CalcPriAsu = OLClientPRI_CalcPriAsu;
    this.CalcTotAsu = OLClientPRI_CalcTotAsu;
    this.CalcPrimeAnnuelle = OLClientPRI_CalcPrimeAnnuelle;
    this.UpdateSelGar = OLClientPRI_UpdateSelGar;
    this.InitSurprimes = OLClientPRI_InitSurprimes;
    this.UpdateSurprimes = OLClientPRI_UpdateSurprimes;
    this.UpdateDates = OLClientPRI_UpdateDates;
    this.GetValueFranchiseGlobal = OLClientPRI_GetValueFranchiseGlobal;
    this.GetValueFranchiseGarantie = OLClientPRI_GetValueFranchiseGarantie;
    this.SetValuesCommission = OLClientPRI_SetValuesCommission;
    this.GetNumberGarantieMediAssUnaccessible = OLClientPri_GetNumberGarantieMediAssUnaccessible;
}

function TblRowBse(iAsu, strTypGar, fSelGar, iPriTar, iPriFix, iPriPta, iSurPri, lIndex, f460Allowed, strTypeCouverture) {
    this.iAsu = iAsu;
    this.strTypGar = strTypGar;
    this.fSelGar = fSelGar;
    this.iPriTar = iPriTar;
    this.iPriFix = iPriFix;
    this.iPriPta = iPriPta;
    this.iSurPri = iSurPri;
    this.lIndex = lIndex;
    this.f460Allowed = f460Allowed;
    this.strTypeCouverture = strTypeCouverture;
}

function TblRowTot(iAsu, iPriGarFrc1, iPriGarFrc2, iPriGarFrc3, iPriGarFrc4, iPriGarFrc5, iPriGarFrc6, iPriGarFrc7, iPriTotFrc, iPriGarAnn1, iPriGarAnn2, iPriGarAnn3, iPriGarAnn4, iPriGarAnn5, iPriGarAnn6, iPriGarAnn7, iPriTotAnn) {
    this.iAsu = iAsu;
    this.iPriGarFrc1 = iPriGarFrc1;
    this.iPriGarFrc2 = iPriGarFrc2;
    this.iPriGarFrc3 = iPriGarFrc3;
    this.iPriGarFrc4 = iPriGarFrc4;
    this.iPriGarFrc5 = iPriGarFrc5;
    this.iPriGarFrc6 = iPriGarFrc6;
    this.iPriGarFrc7 = iPriGarFrc7;
    this.iPriTotFrc = iPriTotFrc;

    this.iPriGarAnn1 = iPriGarAnn1;
    this.iPriGarAnn2 = iPriGarAnn2;
    this.iPriGarAnn3 = iPriGarAnn3;
    this.iPriGarAnn4 = iPriGarAnn4;
    this.iPriGarAnn5 = iPriGarAnn5;
    this.iPriGarAnn6 = iPriGarAnn6;
    this.iPriGarAnn7 = iPriGarAnn7;
    this.iPriTotAnn = iPriTotAnn;
}

function TblRowLnk(strTypGar, iNumOrdGar) {
    this.strTypGar = strTypGar;
    this.iNumOrdGar = iNumOrdGar;
}

function TblRowFchGlobal(strCodFch, iValue) {
    this.strCodFch = strCodFch;
    this.iVlrFch = iValue;
}

function TblRowFchGarantie(strTypGar, strCodFch, iValue) {
    this.strTypGar = strTypGar;
    this.strCodFch = strCodFch;
    this.iVlrFch = iValue;
}

function OLClientPRI_AdjustDecimals() {
    var objCurrentRow;

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];

        objCurrentRow.iPriTar /= 100;
        objCurrentRow.iPriFix /= 100000;
        objCurrentRow.iPriPta /= 100000;
        objCurrentRow.iSurPri /= 100;
        objCurrentRow.iSurPri += 1;
        objCurrentRow.lIndex /= 100000;
    }

    for (i = 0; i < this._aryFchGarantie.length; i++) {
        objCurrentRow = this._aryFchGarantie[i];

        objCurrentRow.iVlrFch /= 100000;
    }
}

function OLClientPRI_SetValuesCommission(maxCom, comTar) {

    CT_MaxCommission = parseFloat(maxCom);
    CT_CommissionTar = parseFloat(comTar) / 10;

}

function OLClientPRI_ReCalcAll() {
    this.CalcPriAsu();
    this.CalcTotAsu();
    this.CalcPrimeAnnuelle();
}

function OLClientPri_GetNumberGarantieMediAssUnaccessible() {
    var objCurrentRow, iAsu, iNbrGar460Unaccessible;
    var fGar460SpecialTreatment, fFchSecRangGest;

    iNbrGar460Unaccessible = 0;

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];
        iAsu = objCurrentRow.iAsu;
        if (this.IsBroker) {
            fFchSecRangGest = false;
        }

        fGar460SpecialTreatment = (objCurrentRow.strTypGar == '460') && ((!objCurrentRow.f460Allowed) || (fFchSecRangGest));

        if (fGar460SpecialTreatment)
            iNbrGar460Unaccessible = iNbrGar460Unaccessible + 1;
    }
    return iNbrGar460Unaccessible;
}

function OLClientPRI_GetValueFranchiseGlobal(strCodFch) {
    var strRetVal = 0;

    for (var j = 0; j < this._aryFchGlobal.length; j++) {
        if (this._aryFchGlobal[j].strCodFch == strCodFch) {
            strRetVal = this._aryFchGlobal[j].iVlrFch;
            break;
        }
    }
    return strRetVal;
}

function OLClientPRI_GetValueFranchiseGarantie(strTypGar, strCodFch, iAsu) {
    var strRetVal = 0;
    if (this.IsBroker) {
        if (strTypGar == "458") {
            if (strCodFch.substring(0, 1) == "F") {
                strCodFch = "F00";
            }
        }
    }

    for (var j = 0; j < this._aryFchGarantie.length; j++) {
        if ((this._aryFchGarantie[j].strTypGar == strTypGar) && (this._aryFchGarantie[j].strCodFch == strCodFch)) {
            strRetVal = this._aryFchGarantie[j].iVlrFch;
            break;
        }
    }
    return strRetVal;
}

function OLClientPRI_GetValueFractionnementMult(strCodFra, fDom) {
    var strRetVal = 1;

    if (fDom == "0") {
        switch (strCodFra) {
            case "1":
                strRetVal = 1.00;
                break;
            case "2":
                strRetVal = 1.02;
                break;
            case "3":
                strRetVal = 1.03;
                break;
            case "4":
                strRetVal = 1.04;
                break;
        }
    }
    else
        // Indien Domiciliation altijd 1
        strRetVal = 1;

    return strRetVal;
}

function OLClientPRI_GetValueFractionnementDiv(strCodFra) {
    var strRetVal = 1;

    switch (strCodFra) {
        case "1":
            strRetVal = 1;
            break;
        case "2":
            strRetVal = 2;
            break;
        case "3":
            strRetVal = 4;
            break;
        case "4":
            strRetVal = 12;
            break;
    }
    return strRetVal;
}

function OLClientPRI_GetValueCommission(iValueCom) {
    var strRetVal = 1;

    strRetVal -= (((CT_CommissionTar - (CT_CommissionTar * (parseFloat(iValueCom) / CT_MaxCommission))) / 100) / 100);
    //strRetVal-= (((CT_MaxCommission - parseFloat(iValueCom)) / 100) / 100);

    return strRetVal;
}

function OLClientPRI_GetValueTaxes() {
    var iNami = 0.1; 	// 10   * priGar / 100

    return iNami;
}

function OLClientPRI_GetValueCosts() {
    var iTaxe = 0.0925; 	// 9.25 * priGar / 100

    return iTaxe;
}

function OLClientPRI_CalcPriAsu() {
    var objCurrentRow, objTotalRow, strControlName, iAsu, iPriGarAnnHrsTax, iPriGarAnnHrsTaxHrsCom, iPriGarAnn, iPriGarFrc, iPriTotGarFrc, iPriTotGarAnn;
    var iMultFranchise, iMultFractionnementMult, iMultCommission, iMultFractionnementDiv, iMultTax, iMultCost;
    var fGar460SpecialTreatment, fFchSecRangGest;

    iMultFractionnementMult = this.GetValueFractionnementMult(FractionnementValue, DomiciliationValue);
    iMultFractionnementDiv = this.GetValueFractionnementDiv(FractionnementValue);
    iMultCommission = this.GetValueCommission(ParameterValue);
    iMultTax = this.GetValueTaxes();
    iMultCost = this.GetValueCosts();

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];
        iAsu = objCurrentRow.iAsu;
        objTotalRow = this._aryTot[objCurrentRow.iAsu - 1];
        if (this.IsBroker) {
            if (objCurrentRow.strTypeCouverture == "1") {
                iMultFranchise = this.GetValueFranchiseGarantie(objCurrentRow.strTypGar, FranchiseValue, iAsu);
                fFchSecRangGest = false;
            }
            else {
                iMultFranchise = this.GetValueFranchiseGarantie(objCurrentRow.strTypGar, 'T20', iAsu);
                fFchSecRangGest = true;
            }
        }
        else {
            if (objCurrentRow.strTypeCouverture == "1") {
                iMultFranchise = this.GetValueFranchiseGarantie(objCurrentRow.strTypGar, FranchiseValue, iAsu);
                fFchSecRangGest = false;
            }
            else {
                iMultFranchise = this.GetValueFranchiseGarantie(objCurrentRow.strTypGar, 'T20', iAsu);
                fFchSecRangGest = true;
            }
        }
        iPriGarAnnHrsTax = roundNumber((objCurrentRow.iPriTar * objCurrentRow.iPriFix * objCurrentRow.iSurPri * iMultFranchise * iMultFractionnementMult * iMultCommission), 2);
        iPriGarAnnHrsTax = roundNumber((iPriGarAnnHrsTax * objCurrentRow.iPriPta), 2);
        iPriGarAnnHrsTax = roundNumber((iPriGarAnnHrsTax * objCurrentRow.lIndex), 2);
        iPriGarAnnHrsTaxHrsCom = roundNumber((iPriGarAnnHrsTax / iMultCommission), 2);
        iPriGarAnn = iPriGarAnnHrsTax + roundNumber(iPriGarAnnHrsTax * iMultTax, 2) + roundNumber(iPriGarAnnHrsTax * iMultCost, 2);
        iPriGarFrc = iPriGarAnn / iMultFractionnementDiv;
        fGar460SpecialTreatment = (objCurrentRow.strTypGar == '460') && ((!objCurrentRow.f460Allowed) || (fFchSecRangGest));

        if (objCurrentRow.fSelGar) {
            if (!fGar460SpecialTreatment) {
                iPriTotGarFrc = iPriGarFrc;
                iPriTotGarAnn = iPriGarAnn;
            }
            else {
                iPriTotGarFrc = 0;
                iPriTotGarAnn = 0;
            }
        }
        else {
            iPriTotGarFrc = 0;
            iPriTotGarAnn = 0;
        }

        for (var j = 0; j < this._aryLnk.length; j++) {
            if (this._aryLnk[j].strTypGar == objCurrentRow.strTypGar)
                break;
        }
        switch (j) {
            case 0:
                strControlName = ".hospi";
                objTotalRow.iPriGarFrc1 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn1 = iPriTotGarAnn;
                break;
            case 1:
                strControlName = ".prepost";
                objTotalRow.iPriGarFrc2 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn2 = iPriTotGarAnn;
                break;
            case 2:
                strControlName = ".optionuniv";
                objTotalRow.iPriGarFrc3 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn3 = iPriTotGarAnn;
                break;
            case 3:
                strControlName = ".optsl";
                objTotalRow.iPriGarFrc4 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn4 = iPriTotGarAnn;
                break;
            case 4:
                strControlName = ".malgraves"; 
                objTotalRow.iPriGarFrc5 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn5 = iPriTotGarAnn;
                break;
            case 5:
                strControlName = ".delta";
                objTotalRow.iPriGarFrc6 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn6 = iPriTotGarAnn;
                break;
            case 6:
                strControlName = ".medi";
                objTotalRow.iPriGarFrc7 = iPriTotGarFrc;
                objTotalRow.iPriGarAnn7 = iPriTotGarAnn;
                break;
        }

        if (!fGar460SpecialTreatment) {
            setControlValue(strControlName + iAsu.toString(), iPriGarFrc, true, false);
            //setControlValue(strControlName + "GarVraiPrime" + iAsu.toString(), "1", false);
        }
        else {
            setControlValue(strControlName + iAsu.toString(), "**********", false, false);
            //setControlValue(strControlName + "GarVraiPrime" + iAsu.toString(), "0", false);
            this.iGarantieMediAssUnaccessible = this.iGarantieMediAssUnaccessible + 1;
        }
        setControlValue(strControlName + "Ann" + iAsu.toString(), iPriGarAnnHrsTax, true, true);
        setControlValue(strControlName + "AnnHrsCom" + iAsu.toString(), iPriGarAnnHrsTaxHrsCom, true, true);
    }
}

function OLClientPRI_CalcTotAsu() {
    var objCurrentRow;
    var strControlName;

    for (var i = 0; i < this._aryTot.length; i++) {
        objCurrentRow = this._aryTot[i];

        this._aryTot[i].iPriTotFrc = objCurrentRow.iPriGarFrc1
            + objCurrentRow.iPriGarFrc2
            + objCurrentRow.iPriGarFrc3
            + objCurrentRow.iPriGarFrc4
            + objCurrentRow.iPriGarFrc5
            + objCurrentRow.iPriGarFrc6
            + objCurrentRow.iPriGarFrc7;
        this._aryTot[i].iPriTotAnn = objCurrentRow.iPriGarAnn1
            + objCurrentRow.iPriGarAnn2
            + objCurrentRow.iPriGarAnn3
            + objCurrentRow.iPriGarAnn4
            + objCurrentRow.iPriGarAnn5
            + objCurrentRow.iPriGarAnn6
            + objCurrentRow.iPriGarAnn7;

        strControlName = ".totalass" + (i + 1).toString();
        setControlValue(strControlName, this._aryTot[i].iPriTotFrc, true, false);
    }
}

function OLClientPRI_CalcPrimeAnnuelle() {
    var iPriAnn, iPriFrc;

    iPriAnn = 0.0;
    iPriFrc = 0.0;

    for (var i = 0; i < this._aryTot.length; i++) {
        iPriAnn += this._aryTot[i].iPriTotAnn;
        iPriFrc += this._aryTot[i].iPriTotFrc;
    }

    setControlValue(".primemensuelle", iPriFrc, true, false);
    setControlValue(".primeannuelle", ConvertToNumberWithPoint(RoundFormatAmount(iPriFrc, CT_PRECISION)) * this.GetValueFractionnementDiv(FractionnementValue), true, false);
}

function OLClientPRI_UpdateSelGar(strTypGar, fSelGar) {
    var objCurrentRow;

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];

        if (objCurrentRow.strTypGar == strTypGar)
            objCurrentRow.fSelGar = fSelGar;
    }
}

function setControlValue(strControlCssClass, strNewValue, fNumericFormat, fHidden) {
    var objControl = $(strControlCssClass);
    if (objControl != undefined && objControl.length != 0) {
        if (fNumericFormat)
            if (fHidden)
                objControl.val(RoundFormatAmount(strNewValue, CT_PRECISION));
            else
                objControl.text(RoundFormatAmount(strNewValue, CT_PRECISION));
        else
            if (fHidden)
                objControl.val(strNewValue);
            else
                objControl.text(strNewValue);
    }
}

function OLClientPRI_InitSurprimes() {
    var objCurrentRow;

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];

        objCurrentRow.iSurPri = 1;
    }
}

function OLClientPRI_UpdateSurprimes(aryAsu) {
    var objCurrentRow;

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];
        objCurrentRow.iSurPri = 1 + (aryAsu[objCurrentRow.iAsu - 1] / 10000);
    }
}

function OLClientPRI_UpdateDates(aryAsu) {
    var objCurrentRow;

    for (var i = 0; i < this._aryBse.length; i++) {
        objCurrentRow = this._aryBse[i];
        objCurrentRow.iPriTar = aryAsu[i][3] / 100;
        objCurrentRow.iPriFix = aryAsu[i][4] / 100000;
        objCurrentRow.iPriPta = aryAsu[i][5] / 100000;
        objCurrentRow.lIndex = aryAsu[i][7] / 100000;
    }
}

function RoundFormatAmount(num, precision) {
    var sDEc = "";
    if (precision > 0)
        sDEc = ",";

    var adjustmentFactor = Math.pow(10, precision);
    var tempNum = Math.round(num * adjustmentFactor);

    var sNum = tempNum.toString(10);
    if (sNum.length > precision)
        sNum = sNum.substring(0, sNum.length - precision) + sDEc + sNum.substring(sNum.length - precision, sNum.length);
    else {
        if (sNum.length == precision)
            sNum = "0" + sDEc + sNum;
        else {
            for (; sNum.length < precision;)
                sNum = "0" + sNum;
            sNum = "0" + sDEc + sNum;
        }
    }
    return sNum;
}

function roundNumber(num, precision) {
    var adjustmentFactor = Math.pow(10, precision);

    return Math.round(num * adjustmentFactor) / adjustmentFactor;
}

function ConvertToNumberWithPoint(Value) {

    // Vervangt de komma in een bedrag door een punt
    // Reden : JS kent enkel bedragen met een punt om de decimalen te onderscheiden
    return Value.toString(10).replace(',', '.');
}
