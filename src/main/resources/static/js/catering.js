
function getDueListPolicyHistory(pgId) {

    var json = {
        "pgId": pgId

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getDueListPolicyHistory/" + pgId,
        data: JSON.stringify(json),
        dataType: 'json',
        async: false,
        success: function (data) {
            $("#tableBody").empty();
            if (data.length == 0) {
                $("#tableBody")
                    .append(
                        '<tr>'
                        + '<td colspan="6" style="text-align: center">Table is empty'
                        + '</td> '
                    );
            } else {
                var installmentNo = "";
                var dueDate = "";
                var premAmount = "";
                var suppBen = "";
                var suppPrd = "";
                var table_row_count = 1;


                $.each(data, function (i, l) {
                    installmentNo = l[0];
                    dueDate = l[1];
                    dueDate = getDateFormat(dueDate);
                    premAmount = l[2];
                    suppBen = l[3];
                    suppPrd = l[4];

                    $("#tableBody")
                        .append(
                            '<tr>'
                            + '<td style="text-align: center" class="row_number" is_selected="0"><span>' + table_row_count + '</span>'
                            + '</td> '
                            + '<td style="text-align: center"><span id="installmentNo">' + installmentNo + '</span>'
                            + '</td> '
                            + '<td style="text-align: center"><span id="dueDate">' + dueDate + '</span>'
                            + '</td> '
                            + '<td><span id="premAmount">' + premAmount + '</span>'
                            + '</td> '
                            + '<td style="text-align: center"><span id="suppBen">' + suppBen + '</span>'
                            + '</td> '
                            + '<td style="text-align: center"><span id="suppPrd">' + suppPrd + '</span>'
                            + '</td> '
                            + '<td style="text-align: center"><input type="checkbox" name="selection" class="selection"/>&nbsp;</td>'
                            + '</tr>');
                    table_row_count = table_row_count + 1;
                });
                $('#tableBody').find('tr td.row_number').hide();
                $('#mtd').find('.selection').closest('input[type=checkbox]:first').attr('checked', 'true');
                $(".selection").trigger("change");
            }

        },
        error: function (e) {
            console.log("error in getDueListPolicyHistory calling in premium ! ");
        }
    });


}


$(document).on('change', '.selection', function () {
// $('.selection').change(function () {

    if (this.checked) {
        $(this).closest("tr").find('td:eq(0)').attr('is_selected', '1');
    } else {
        $(this).closest("tr").find('td:eq(0)').attr('is_selected', '0');
    }

    var max_row_number = getMaxRow($('#tableBody'));

    calSelectedRowValues(max_row_number, $('#tableBody'));

    calLateFeeAndLateFeeWaiver(max_row_number);

    populateStatusTable();

});


function fillDueInfoPremiumCollection(data) {

    var value_0 = "";
    var value_1 = "";
    var value_2 = "";
    var value_3 = "";
    var value_4 = "";
    $.each(data, function (i, l) {
        value_0 = l[0];
        value_1 = l[1];
        value_2 = l[2];
        value_3 = l[3];
        value_4 = l[4];

        $("#dueDateFrom").val('');
        $("#dueDateTo").val('');
        $("#totalDueAmount").val('');
        $("#totalPremiumAmount").val('');
        $("#totalPremiumAmount").val(value_0);
        $("#installmentNoFrom").val(value_1);
        $("#installmentNoTo").val(value_2);

        if (value_3) {
            var momentDate = moment(value_3).utc().format('MM/DD/YYYY');
            var increDueDateFrom = getDateByAddingOne(momentDate);
            var increDueDateFromFormat = getDateShow(increDueDateFrom);
            $("#dueDateFrom").val(increDueDateFromFormat);
        }
        if (value_4) {
            var momentDate = moment(value_4).utc().format('MM/DD/YYYY');
            var increDueDateFrom = getDateByAddingOne(momentDate);
            var increDueDateToFormat = getDateShow(increDueDateFrom);
            $("#dueDateTo").val(increDueDateToFormat);
        }

        if (value_0) {
            var totPrmAmnt = Number(value_0);
            var lateFee = 0;
            var lateFeeWaiver = 0;
            var totalDueAmnt = ((totPrmAmnt + Number(lateFee)) - Number(lateFeeWaiver));
            $("#totalDueAmount").val('');
            $("#totalDueAmount").val(totalDueAmnt);
        }
        calDueInfoTableData();
    });

}

function setCollectionOfficeByEmplId() {

    var json = {
        "officeId": ''

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getCollectionOfficeByEmplId",
        data: JSON.stringify(json),
        dataType: 'json',
        async: true,

        success: function (data) {
            var value_1 = "";
            var value_2 = "";
            $.each(data, function (i, l) {
                value_1 = l[0];
                value_2 = l[1];
            });

            $("#collectionOffice").val(value_1);
            $("#collectionOfficeId").val(value_2);


        },
        error: function (e) {
        }
    });

}

function getDateByAddingOne(recvDate) {
    var date = new Date(recvDate);
    var newdate = new Date(date);

    newdate.setDate(newdate.getDate() + 1);

    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();

    var someFormattedDate = mm + '/' + dd + '/' + y;
    return someFormattedDate;
}

function setMobileNumberByPgId(pgId) {

    var json = {
        "pgId": pgId

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getMobileNumberByPgId/"
        + pgId,
        data: JSON.stringify(json),
        dataType: 'json',
        async: true,
        success: function (data) {

            $("#mobileNumber").val('');
            $("#mobileNumber").val(data);
        },
        error: function (e) {

        }
    });
}


$(document).ready(function () {


    $("#policyNo").focus();
    $(".hideable-content").hide();
    $('.coll_cat_wise_visibility').hide();
    $('.coll_type_wise_visibility').hide();
    $("#collectionDate").datepicker({dateFormat: "dd/mm/yy"}).datepicker("setDate", new Date());
    $('#collectionMedia').empty();
    $('#collectionMedia').prop('disabled', true);
    $('#collectionMedia').append(
        '<option value="' + "OL" + '">' + "Not Applicable" + '</option>'
    );

    $("#collCategory").on('change', function () {
        if ($(this).val() == 1) {
            $('.coll_cat_wise_visibility').hide();
        } else {
            $('.coll_cat_wise_visibility').show();
        }
    });

    $("#collectionType").on('change', function () {
        if ($(this).val() == 1) {
            $('.coll_type_wise_visibility').hide();
        } else {
            $('.coll_type_wise_visibility').show();
        }
    });


    var regexname = /^[0-9]+\.?[0-9]*$/;


    $('#availableSuspenseAmnt').on('keypress keydown keyup blur focus', function () {
        if (!$(this).val().match(regexname)) {
            // $('#availableSuspenseAmntSpan').show().text("Only Positive Number!!").css('color', 'red');
            // $('#availableSuspenseAmnt').val('');
            // //$('#premiumCollForm').attr('onsubmit','return false;');
        } else {
            // $('#availableSuspenseAmntSpan').show().text("");
        }
    });
    $('#totalPremiumAmount').on('keypress keydown keyup blur focus', function () {
        if (!$(this).val().match(regexname)) {
            $('#totalPremiumAmountSpan').show().text("Only Positive Number!!").css('color', 'red');
            $('#totalPremiumAmount').val('');
        } else {
            $('#totalPremiumAmountSpan').show().text("");
        }
    });
    $('#lateFee').on('keypress keydown keyup blur focus', function () {
        if (!$(this).val().match(regexname)) {
            $('#lateFeeSpan').show().text("Only Positive Number!!").css('color', 'red');
            $('#lateFee').val('');
        } else {
            $('#lateFeeSpan').show().text("");
        }
    });
    $('#lateFeeWaiver').on('keypress keydown keyup blur focus', function () {
        if (!$(this).val().match(regexname)) {
            $('#lateFeeWaiverSpan').show().text("Only Positive Number!!").css('color', 'red');
            $('#lateFeeWaiver').val('');
        } else {
            $('#lateFeeWaiverSpan').show().text("");
        }
    });
    $('#totalDueAmount').on('keypress keydown keyup blur focus', function () {
        if (!$(this).val().match(regexname)) {
            $('#totalDueAmountSpan').show().text("Only Positive Number!!").css('color', 'red');
            $('#totalDueAmount').val('');
        } else {
            $('#totalDueAmountSpan').show().text("");
        }
    });
    $('#totalCollAmnt').on('keypress keydown keyup blur focus', function () {
        if (!$(this).val().match(regexname)) {
            $('#totalCollAmntSpan').show().text("Only Positive Number!!").css('color', 'red');
            $('#totalCollAmnt').val('');
        } else {
            $('#totalCollAmntSpan').show().text("");
        }
    });

    $("#refresh_button").click(function () {
        clearform();
    });

    setCollectionOfficeByEmplId();

    $("#refreshBtn").click(function () {
        clearform();
    });

    // var lateFee = $('#lateFee').val(0);
    // var lateFeeWaiver = $('#lateFeeWaiver').val(0);
    getLastReceiveIdAccRecv();
    //getLastPGIDInsPPersonal();

    $("#add_button").click(function () {

        if (dataValidation() == true) {

            $.confirm({
                icon: 'ace-icon fa fa-question-circle',
                theme: 'material',
                closeIcon: true,
                animation: 'scale',
                type: 'orange',

                title: "Are you sure to continue?",
                content: 'N.B: Please do not proceed until you are sure about the amount.',
                typeAnimated: true,
                buttons: {
                    Yes: {
                        text: '<i class="fa fa-credit-card"></i>  Collect ',
                        btnClass: 'btn-success',
                        action: function () {
                            collectTheAmount()
                        }

                    },
                    CANCEL: {
                        text: '<i class="fa fa-reply"></i> Cancel',
                        btnClass: 'btn-warning',
                        action: function () {
                            return true;
                        }
                    }
                }

            });


        }
    });

    function collectTheAmount() {
        var currDate = $.datepicker.formatDate('dd/mm/yy', new Date());

        var collAmount = $('#totalCollAmnt').val();
        var receiveId = $('#receiveId').val();
        var pgId = $('#pgId').val();
        var modeTp = $('#collCategory').val();
        var officeCode = $('#collectionOfficeId').val();
        var policyNo = $('#policyNo').val();
        var collectionType = $('#collectionMedia').val();
        var receiveMode = $('#collectionType').val();
        var dueDtFrom = $('#dueDateFrom').val();
        var duedtTo = $('#dueDateTo').val();
        var receiveDate = $('#collectionDate').val();
        var checkNo = $('#checkNo').val();
        var checkDate = $('#checkDate').val();
        var avlSusAmnt = $('#availableSuspenseAmnt').val();

        if (checkDate) {
            checkDate = checkDate.split("/").reverse().join("/");
            checkDate = getDate(checkDate);
        } else {
            checkDate = null;
        }

        if (receiveDate) {
            receiveDate = receiveDate.split("/").reverse().join("/");
            receiveDate = getDate(receiveDate);
        } else {
            receiveDate = null;
        }

        var totPremiumAmt = $('#totalPremiumAmount').val();
        // var lateFee = $('#lateFee').val();
        // var lateFeeWaiver = $('#lateFeeWaiver').val();
        var lateFee = $(".amt-val-for-late-total-fee").text();
        var lateFeeWaiver = $(".amt-val-for-late-total-fee-waiver").text();
        //Need to added supp product and benifit

        var mediaDate = $('#mediaDate').val();

        if (mediaDate) {
            mediaDate = mediaDate.split("/").reverse().join("/");
            mediaDate = getDate(mediaDate);
        } else {
            mediaDate = null;
        }

        var installmentNoFrom = $('#installmentNoFrom').val();
        var installmentNoTo = $('#installmentNoTo').val();
        var mobileNumber = $('#mobileNumber').val();
        var bankName = $('#bankName').val();
        var branchName = $('#branchName').val();


        var accReceivables = {};
        accReceivables.collAmount = collAmount;
        accReceivables.receiveId = receiveId;
        accReceivables.modeTp = modeTp;
        accReceivables.officeCode = officeCode;
        accReceivables.policyNo = policyNo;
        accReceivables.collectionType = collectionType;
        accReceivables.receiveMode = receiveMode;

        if (dueDtFrom) {
            dueDtFrom = dueDtFrom.split("/").reverse().join("/");
            dueDtFrom = getDate(dueDtFrom);
        } else {
            dueDtFrom = null;
        }

        if (duedtTo) {
            duedtTo = duedtTo.split("/").reverse().join("/");
            duedtTo = getDate(duedtTo);
        } else {
            duedtTo = null;
        }
        accReceivables.receiveDate = receiveDate;
        accReceivables.pgId = pgId;
        accReceivables.totPremiumAmt = totPremiumAmt;
        accReceivables.lateFee = lateFee;
        accReceivables.lateFeeWaiver = lateFeeWaiver;
        accReceivables.mediaDate = mediaDate;
        accReceivables.installmentNoFrom = installmentNoFrom;
        accReceivables.installmentNoTo = installmentNoTo;
        accReceivables.mobileNumber = mobileNumber;
        accReceivables.checkNo = checkNo;
        accReceivables.checkDate = checkDate;
        accReceivables.policyNo = policyNo;
        accReceivables.avlSusAmnt = avlSusAmnt;
        accReceivables.bankCd = bankName;
        accReceivables.brCd = branchName;
        accReceivables.dueDtFrom = dueDtFrom;
        accReceivables.duedtTo = duedtTo;

        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "/collection/saveAccReceivables",
            data: JSON.stringify(accReceivables),
            dataType: 'json',
            success: function (data) {

                if (!isEmptyString(data[1])) {

                    $.confirm({

                        icon: 'ace-icon fa fa-smile-o',
                        theme: 'material',
                        closeIcon: true,
                        animation: 'scale',
                        type: 'purple',
                        title: "Success",
                        content: 'Successfully paid, do you want to print recipt?',
                        typeAnimated: true,
                        buttons: {
                            Yes: {
                                text: 'Yes',
                                btnClass: 'btn-success',
                                action: function () {
                                    window.open('/collection/generatePremiumCollRec.pdf?receiveId=' + data[3], '_blank');
                                    clearform();

                                    location.reload();
                                }

                            },
                            CANCEL: {
                                text: 'Cancel',
                                btnClass: 'btn-warning',
                                action: function () {
                                    clearform();
                                    location.reload();
                                    return true;
                                }
                            }
                        }

                    });


                    //success

                } else {
                    customAlert(alertTypes.FAILED, '', 'Paid unsuccessfully!');
                }

            },
            error: function (e) {
                customAlert(alertTypes.ERROR, 'Sorry', 'Paid unsuccessfully!');
            }
        });
    }

    $('#mediaNo').prop('disabled', true);
    $('#mediaDate').prop('disabled', true);
    //$('#collectionMedia').prop('disabled', true);
    $('#bankName').prop('disabled', true);
    $('#branchName').prop('disabled', true);
    $('#checkNo').prop('disabled', true);
    $('#checkDate').prop('disabled', true);
    // $('#productName').prop('disabled', true);
    // $('#address').prop('disabled', true);


    $('#collCategory').change(function (e) {
        var selectedValue = $(this).val();

        if (selectedValue == 0) {
            return;
        }

        if (selectedValue == '1') {
            $('#collectionMedia').empty();
            $('#collectionMedia').prop('disabled', true);
            $('#collectionMedia').append(
                '<option value="' + "OL" + '">' + "Not Applicable" + '</option>'
            );

            $('#mediaNo').prop('disabled', true);
            $('#mediaDate').prop('disabled', true);
        }

        if (selectedValue == '2') {
            $('#collectionMedia').empty();
            $('#collectionMedia').prop('disabled', false);
            $('#collectionMedia').append(
                '<option value="' + "PR" + '">' + "PR" + '</option>'
                + '<option value="' + "BM" + '">' + "BM" + '</option>'
                + '<option value="' + "JV" + '">' + "JV" + '</option>'
                + '<option value="' + "MR" + '">' + "MR" + '</option>'
                + '<option value="' + "OL" + '">' + "Not Applicable" + '</option>'
            );

            $('#mediaNo').prop('disabled', false);
            $('#mediaDate').prop('disabled', false);
        }

    });

    $('#collectionType').change(function (e) {

        var selectedValue = $(this).val();

        if (selectedValue == 0) {
            return;
        }

        if (selectedValue == '1') {
            $('#checkNo').prop('disabled', true);
            $('#checkDate').prop('disabled', true);
            $('#bankName').prop('disabled', true);
            $('#branchName').prop('disabled', true);
        } else {
            $('#bankName').prop('disabled', false);
            $('#branchName').prop('disabled', false);
            $('#checkNo').prop('disabled', false);
            $('#checkDate').prop('disabled', false);
        }


    });

    //scroll table
    if ($('#results tr').length >= 5) {
        $('#myTable').addClass('add-scroll');
    }


    $("#genPremCollReport").click(function () {

        var policyNo = $('#policyNoReport').val();

        if ($.trim(policyNo)) {
            window.open('/collection/genPremCollInfoReport?policyNo=' + policyNo, '_blank');

          /*  $.confirm({
                title: 'Message',
                content: 'Are You Sure To Generate Report',
                buttons: {
                    ok: function () {
                        window.open('/collection/genPremCollInfoReport?policyNo=' + policyNo, '_blank');
                    },
                    cancel: function () {
                    },
                }
            });*/
        } else {
            $.confirm({
                title: 'Message',
                content: 'Please Provide Valid Policy No',
                buttons: {
                    ok: function () {
                    },
                }
            });
        }
    });
    $("#findBtn").click(function () {

        var policyNo = $('#policyNoReport').val();

        if ($.trim(policyNo)) {
            getPolInfoAtPremColl(policyNo);
        } else {
            $.confirm({
                title: 'Message',
                content: 'Please Provide Valid Policy No',
                buttons: {
                    ok: function () {
                    },
                }
            });
        }
    });
});

function clearform() {
    // $('#riskDate').val("");
    $('#collCategory').val("");
    $('#receiveId').val("");
    $('#pgId').val("");
    $('#collectionOffice').val("");
    $('#collectionOfficeId').val("");
    // $('#policyNo').val("");
    $('#lastPaidDate').html("");
    $('#assuredName').html("");
    $('#assuredMobile').html("");
    $('#address').html("");
    $('#organizationalSetup').html("");
    $('#productName').html("");
    $('#productId').val("");
    $('#riskDate').html("");
    $('#productIdTerm').html("");
    $('#option').html("");
    $('#modeOfPayment').html("");
    $('#sumAssured').html("");
    $('#policyStatus').html("");
    $('#collectionMedia').val("");
    $('#mediaDate').val("");
    $('#mediaNo').val("");
    $('#collectionType').val("");
    $('#bankName').val("");
    $('#bankId').val("");
    $('#checkNo').val("");
    $('#checkDate').val("");
    $('#dueDateFrom').val("");
    $('#dueDateTo').val("");
    $('#collectionDate').val("");
    $('#branchName').val("");
    $('#branchId').val("");
    $('#availableSuspenseAmnt').val("");
    $('#reference').val("");
    $('#lateFee').val("");
    $('#lateFeeWaiver').val("");
    $('#totalDueAmount').val("");
    $('#totalPremiumAmount').val("");
    $('#totalCollAmnt').val("");
    $('#dateOfCommencement').html("");
    $("#mobileNumber").val("");
    $('#proposalNo').val("");
    $("#totalSuppBenefit").val("");
    $('#totalSuppProduct').val("");

}

function getPolInfoAtPremColl(policyNo) {

    var table = $("#dataTable tbody");

    var json = {
        "policyNo": policyNo
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getPolInfoAtPremColl/" + policyNo,
        data: JSON
            .stringify(json),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {

            table.empty();

            var policyNo = "";
            var polHolder = "";
            var prdName = "";
            var polTerm = "";
            var agentNm = "";
            var maturityDt = "";

            $.each(data, function (i, l) {

                policyNo = l[0];
                polHolder = l[1];
                prdName = l[2]
                polTerm = l[3];
                agentNm = l[4];
                maturityDt = l[5];

                table.append("<tr><td>" + '<span>' + policyNo + '</span>' + "</td>" +
                    "<td>" + polHolder + "</td>" +
                    "<td>" + prdName + "</td>" +
                    "<td>" + polTerm + "</td>" +
                    "<td>" + agentNm + "</td>" +
                    "<td>" + maturityDt + "</td>" +
                    "</tr>");
            });
            $("#dataTable").DataTable();
        },
        error: function (e) {
        }
    });

}

function removeNullandReturnEmpty(str) {

    if (str == null) {
        str = '';
    } else if (str == "") {
        str = '';
    } else if (str == 'null') {
        str = '';
    } else if (str == 'NULL') {
        str = '';
    } else if (str < 0) {
        str = '';
    } else {
        str = $.trim(str);
    }

    return str;
}


//All others are Start from  Here


function getMaxRow(table) {
    var max_row_number = 0;
    table.find('tr').each(function (i, el) {

        var $tds = $(this).find('td');
        if ($tds.eq(0).attr('is_selected') == '1') {
            max_row_number = $tds.eq(0).text();
        }
        // do something with productId, product, Quantity
    });

    return max_row_number;

}


function calSelectedRowValues(row_number, table) {
    var count = 1;
    var total_premium = 0;
    var due_date_from = "";
    var due_date_to = "";
    var initial_inst_no = 0;
    var last_inst_no = 0;
    var total_supp_benefit = 0;
    var total_supp_product = 0;
    // table.find('tr').siblings().removeClass("selected");
    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td');
        if (count <= row_number) {
            if (count == 1) {
                initial_inst_no = $tds.eq(1).text();
                due_date_from = getDateShow($tds.eq(2).text());
                last_inst_no = $tds.eq(1).text();
                due_date_to = getDateShow($tds.eq(2).text());
                total_premium = parseInt($tds.eq(3).text());
                total_supp_benefit = parseInt($tds.eq(4).text());
                total_supp_product = parseInt($tds.eq(5).text());
            } else {
                last_inst_no = $tds.eq(1).text();
                due_date_to = getDateShow($tds.eq(2).text());
                total_premium = total_premium + parseInt($tds.eq(3).text());
                total_supp_benefit = total_supp_benefit + parseInt($tds.eq(4).text());
                total_supp_product = total_supp_product + parseInt($tds.eq(5).text());
            }
            $tds.find('.selection').prop('checked', true);
            $tds.eq(0).attr('is_selected', '1');
            // $tds.find('.selection').addClass("selected");
        } else {
            $tds.find('.selection').prop('checked', false);
            // $tds.find('.selection').removeClass("selected");
        }
        count = count + 1;

    });

    $("#totalPremiumAmount").val(total_premium);
    $("#dueDateFrom").val(due_date_from);
    $("#dueDateTo").val(due_date_to);
    $("#installmentNoFrom").val(initial_inst_no);
    $("#installmentNoTo").val(last_inst_no);
    $("#totalSuppBenefit").val(total_supp_benefit);
    $("#totalSuppProduct").val(total_supp_product);

}


function calLateFeeAndLateFeeWaiver(max_row_number) {
  // alert("aaaaa")
    var collection_category = $("#collCategory").val();
    var mediaDate = formatShowedDate($('#mediaDate').val());
    var collectionDate = formatShowedDate($('#collectionDate').val());
    var due_date_from = formatShowedDate($('#dueDateFrom').val());
    var due_date_to = formatShowedDate($('#dueDateTo').val());
    var inst_from = $("#installmentNoFrom").val();
    var inst_to = $("#installmentNoTo").val();
    var total_premium = $("#totalPremiumAmount").val();
    var pgId = $("#pgId").val();
    var payModeCd = $("#modeOfPaymentCd").val();

    $("#lateFee").val(0);
    $("#lateFeeWaiver").val(0);

    if (collection_category == 1) {
        if (due_date_from == "" && due_date_to == "" && collectionDate == "" && max_row_number == 0) {
            $("#lateFee").val(0);
            $("#lateFeeWaiver").val(0);
        } else {
            var cat_url = "/collection/getLateFee?pgId=" + pgId + "&due_balance=" + total_premium +
                "&mode_tp=" + payModeCd + "&coll_till_date=" + collectionDate + "&coll_slip_date=" +
                collectionDate + "&due_dt_from=" + due_date_from + "&due_dt_to=" + due_date_to +
                "&inst_from=" + inst_from + "&inst_to=" + inst_to;
        }
    } else if (collection_category == 2) {
        if (due_date_from == "" && due_date_to == "" && mediaDate == "" && max_row_number == 0) {
            $("#lateFee").val(0);
            $("#lateFeeWaiver").val(0);
        } else {
            var cat_url = "/collection/getLateFee?pgId=" + pgId + "&due_balance=" + total_premium +
                "&mode_tp=" + payModeCd + "&coll_till_date=" + mediaDate + "&coll_slip_date=" +
                mediaDate + "&due_dt_from=" + due_date_from + "&due_dt_to=" + due_date_to +
                "&inst_from=" + inst_from + "&inst_to=" + inst_to;
        }
    }


    if (max_row_number != 0) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: cat_url,
            dataType: 'json',

            success: function (data) {
                console.log(data);

                var lateFee = "";
                var lateFeeWaiver = "";

                $.each(data, function (i, l) {
                    lateFee = l[0];
                    lateFeeWaiver = l[1];
                });

                $("#lateFee").val(lateFee);
                $("#lateFeeWaiver").val(lateFeeWaiver);

                // TO Do:
                $(".amt-val-for-late-total-fee-waiver").text(lateFeeWaiver.toFixed(0));
                $(".amt-val-for-late-total-fee").text(lateFee.toFixed(0));


            },
            error: function (e) {

            }
        });
    }

}

function clearPaymentDetailsBreackdown() {

    $(".amt-val-for-late-total-payable").text('0');
    $(".amt-val-for-late-total-fee-waiver").text('0');
    $(".amt-val-for-late-total-fee").text('0');
    $(".amt-val-for-total-sp-premium").text('0');
    $(".amt-val-for-total-sb-premium").text('0');
    $(".amt-val-for-total-premium").text('0');
}

function initStatusTable() {
    clearPaymentDetailsBreackdown();
    $("#totalCollAmnt").val("0");
    $(".payment-det-section").css("display", "none");
}

function populateStatusTable() {
    initStatusTable();
    var table = $("#cal_table");
    var count = 0;
    var total_premium = parseFloat($("#totalPremiumAmount").val());
    var total_supp_benefit = parseFloat($("#totalSuppBenefit").val());
    var total_supp_product = parseFloat($("#totalSuppProduct").val());
    console.log($("#lateFee").val());
    console.log($("#lateFeeWaiver").val());
    var late_fee = parseFloat($("#lateFee").val());
    var lateFeeWaiver = parseFloat($("#lateFeeWaiver").val());

    //total due calculation
    var totalDueAmount = total_premium + total_supp_benefit + total_supp_product +
        late_fee - lateFeeWaiver;
    //
    // var value = [, , , , , ];
    // table.find('tr').each(function (i, el) {
    //     var $tds = $(this).find('td');
    //     $tds.eq(3).text(value[count]);
    //     count = count + 1;
    // });

    $(".amt-val-for-late-total-payable").text(totalDueAmount.toFixed());
    // $(".amt-val-for-late-total-fee-waiver").text(lateFeeWaiver.toFixed(2));
    // $(".amt-val-for-late-total-fee").text(late_fee.toFixed(2));
    $(".amt-val-for-total-sp-premium").text(total_supp_product.toFixed(0));
    $(".amt-val-for-total-sb-premium").text(total_supp_benefit.toFixed(0));
    $(".amt-val-for-total-premium").text(total_premium.toFixed(0));

    $("#totalDueAmount").val(totalDueAmount.toFixed(0));
    $("#totalCollAmnt").val(totalDueAmount.toFixed(0));

    $(".payment-det-section").css("display", "block");
}

function getDateFormat(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "-" + month + "-" + day;

    return date;
};

function getBranchName(bankCd) {

    var json = {
        "bankCd": bankCd

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getBankCd/"
        + bankCd,
        data: JSON
            .stringify(json),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            $('#branchName').empty();
            $.each(data, function (key, value) {
                $('#branchName').append('<option value="' + key + '">' + value + '</option>');
            });

        },
        error: function (e) {

        }
    });
}


function getDate(dateObject) {
    var d = new Date(dateObject);

    return d;
};

function getDateShow(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
};

function formatShowedDate(dateObject) {

    var reverse_date = getDate(dateObject.split("/").reverse().join("/"));
    var d = new Date(reverse_date);
    var curr_day = ('0' + d.getDate()).slice(-2);
    var curr_month = ('0' + (d.getMonth() + 1)).slice(-2); //Months are zero based
    var curr_year = d.getFullYear();
    var change_date = curr_month + "/" + curr_day + "/" + curr_year;

    return change_date;
};


// todo mithun bhai

// function getCollectionDate(){
//     var mediaDateStr = $('#mediaDate').val();
//     var mediaDate = getYear(mediaDateStr);
//     var duedtToSTr = $('#dueDateTo').val();
//     var duedtTo = getYear(duedtToSTr);
//     if(mediaDate && duedtTo){
//         if(mediaDate === duedtTo){
//             $('#collectionDate').val('');
//             $('#collectionDate').val($.datepicker.formatDate('dd/mm/yy', new Date()));
//         }else{
//             $( "#collectionDate" ).datepicker({
//                 dateFormat: 'dd/mm/yy',
//                 changeMonth: true,
//                 changeYear: true
//             })
//         }
//     }else{
//         alert("please select Media Date and Due Date To");
//     }
//
// }

function calDueInfoTableData() {


    var to_date = $('#dueDateTo').val();
    to_date = getDate(to_date.split("/").reverse().join("/"));
    var from_date = $('#dueDateFrom').val();
    from_date = getDate(from_date.split("/").reverse().join("/"));

    if (from_date > to_date) {
        customAlert(alertTypes.WARNING, "Required Validation", "Date is greater than from date.");
    }

    var table_due_date = "";
    var table = $('#tableBody');

    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td');
        $tds.eq(0).attr('is_selected', '0');
        table_due_date = getDateShow($tds.eq(2).text());
        table_due_date = getDate(table_due_date.split("/").reverse().join("/"));
        if (table_due_date <= to_date && from_date <= to_date) {
            $tds.eq(0).attr('is_selected', '1');
        }

    });

    if (table_due_date < to_date || table_due_date == "") {
        $.confirm({
            icon: 'ace-icon fa fa-exclamation-circle',
            theme: 'material',
            closeIcon: true,
            animation: 'scale',
            type: 'orange',

            title: "Due Date Exceeded!!",
            content: 'Selected date is greater than the current estimation. Do you want to create new due for this policy?',
            typeAnimated: true,
            buttons: {
                Yes: {
                    text: 'Yes',
                    btnClass: 'btn-danger',
                    action: function () {
                        createDue($("#pgid").val());


                        //todo: create due
                    }

                },
                CANCEL: {
                    text: 'Cancel',
                    btnClass: 'btn-warning',
                    action: function () {
                        initStatusTable();
                        var max_row_number = getMaxRow($('#tableBody'));

                        calSelectedRowValues(max_row_number, $('#tableBody'));

                        calLateFeeAndLateFeeWaiver(max_row_number);

                        populateStatusTable();
                        return true;
                    }
                }
            }

        });
    }


}
function createDue(pgId) {


    var addPolicyDueCreation = {};

    addPolicyDueCreation.pgId = pgId;

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "/servicing/addPolicyDueCreation",
        data: JSON
            .stringify(addPolicyDueCreation),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.pProcessStatus == null) {
                customAlert(alertTypes.SUCCESS, '', 'Successfully due created');
                $("#policyNo").trigger("change");

            } else {

                customAlert(alertTypes.FAILED, data.pProcessStatus, 'Unable to create due, invalid request! ');
            }
        },
        error: function (e) {
            customAlert(alertTypes.ERROR, '', 'Something went wrong!');
        }
    });
}

function getYear(dateObject) {
    var d = new Date(dateObject);
    var year = d.getFullYear();

    return year;
};


function getAssuredNmInPPersonal(pgId) {

    var json = {
        "pgId": pgId

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getAssuredNmInsPPersonal/"
        + pgId,
        data: JSON.stringify(json),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data[0]) {
                $(".hideable-content").show();
            } else {
                $(".hideable-content").hide();

            }

            $("#assuredName").html(data[0]);
            $("#assuredMobile").html(data[1]);

        },
        error: function (e) {
            // customAlert(alertTypes.ERROR, '', 'Unable to process right now, try later!');
        }
    });

}

function getAddressInsPAdd(pgId) {

    var json = {
        "pgId": pgId

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getAddressInsPAdd/"
        + pgId,
        data: JSON
            .stringify(json),
        dataType: 'json',

        success: function (data) {
            $("#address").html(data[0]);

        },
        error: function (e) {

        }
    });

}

function getProductNmInsPrd(pgId) {

    var json = {
        "pgId": pgId

    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getProductNmInsPrd/"
        + pgId,
        data: JSON.stringify(json),
        dataType: 'json',
        async: true,
        success: function (data) {
            var value_1 = "";
            var value_2 = "";
            $.each(data, function (i, l) {
                value_1 = l[0];
                value_2 = l[1];
            });
            $("#productName").html(value_1);
            $("#productId").val(value_2);

        },
        error: function (e) {

        }
    });

}

function getLastReceiveIdAccRecv() {

    var json = {
        "officeId": ""
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/collection/getLastReceiveIdAccRecv",
        data: JSON.stringify(json),
        dataType: 'json',
        async: true,
        success: function (data) {
            $("#receiveId").val(data[0]);

        },
        error: function (e) {

        }
    });
}

function dataValidation() {

    var status = true;
    var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
    var duedtToStr = $('#dueDateTo').val();
    var dueDtFromStr = $('#dueDateFrom').val();
    var mobileNo = $('#mobileNumber').val();

    if ($("#installmentNoFrom").val() == "" || $("#installmentNoTo").val() == "") {
        status = false;

        customAlert(alertTypes.WARNING, 'Data validation', 'Invalid installment selection!,Installment No From/To Can\'t be empty !');

    }

    if ($("#dueDateFrom").val() == "" || $("#dueDateFrom").val() == "0") {
        status = false;
        $("#dueDateFromSpan").text("Empty field found!!").css('color', 'red');
        $("#dueDateFrom").focus();
    } else $("#dueDateFromSpan").text("");

    if ($("#dueDateTo").val() == "" || $("#dueDateTo").val() == "0") {
        status = false;
        $("#dueDateToSpan").text("Empty field found!!").css('color', 'red');
        $("#dueDateTo").focus();
    } else $("#dueDateToSpan").text("");

    if ($("#collectionDate").val() == "" || $("#collectionDate").val() == "0") {
        status = false;
        $("#collectionDateSpan").text("Empty field found!!").css('color', 'red');
        $("#collectionDate").focus();
    } else $("#collectionDateSpan").text("");

    if (new Date(duedtToStr) < new Date(dueDtFromStr)) {
        status = false;
        alert("Due Date To can not be greater than Due Date From!");
        var duedtToStr = $('#dueDateTo').val('');
        $("#dueDateTo").focus(duedtToStr.css({'background-color': 'yellow'}));
    }
    if ($("#policyNo").val() == "" || $("#policyNo").val() == "0") {
        status = false;
        $("#policyNoSpan").text("Empty field found!!").css('color', 'red');
        $("#policyNo").focus();
    } else $("#policyNoSpan").text("");

    if ($("#mobileNumber").val() == "" || $("#mobileNumber").val() == "0") {
        status = false;
        $("#mobileNumberSpan").text("Empty field found!!").css('color', 'red');
        $("#mobileNumber").focus();
    } else $("#mobileNumberSpan").text("");

    var str_sms = $('#mobileNumber').val();

    if (numberRegex.test(str_sms) == false
        || $("#mobileNumber").val().length != 11) {
        status = false;
        $("#mobileNumberSpan").text("Invalid contact no");
        $("#mobileNumber").focus();

    } else
        $("#mobileNumberSpan").text("");


    return status;
}

function setCollDateByMediaDate() {
    var currDateStr = new Date();
    var mediaDateStr = $('#mediaDate').val();
    mediaDateStr = mediaDateStr.split("/").reverse().join("/");
    mediaDateStr = getDate(mediaDateStr);

    if (mediaDateStr <= currDateStr) {
        if (mediaDateStr) {
            var mediaDateYear = getYear(mediaDateStr);
            var curDateYear = getYear(currDateStr);
            if (mediaDateYear === curDateYear) {
                $('#collectionDate').val('');
                $('#collectionDate').val($.datepicker.formatDate('dd/mm/yy', new Date()));
            } else {
                $('#collectionDate').val('');
                var customCollDate = '31/12' + '/' + mediaDateYear;
                $('#collectionDate').val(customCollDate);
            }
        }
    } else {
        $('#mediaDate').val('');
        $('#collectionDate').val('');
        customAlert(alertTypes.WARNING, 'Invalid media date!', "Media date should be less than or equal current date.");
    }

}

// end here
