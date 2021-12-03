// ==UserScript==
// @name         Arya Crypto calcul valeur en usdt
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Pour afficher la valeur en usdt de la quantité sélectionnée de crypto
// @author       CodingSeb
// @match        https://*.crypto.arya.xyz/webui/trades*
// @icon         https://www.google.com/s2/favicons?domain=crypto.arya.xyz
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var number_of_tps_max = 5;
    var ordertype = $('#order_type');
    var amount = $('#amount');
    var price = $('#price');
    var sl1_field = $('#sl1_price');
    var sl1_amount = $('#sl1_amount');
    var current_price = $('#lbl_quote_asset_price');
    var row = amount.parents('.row')[0];
    var sl1_row = sl1_field.parents('.row')[0];
    var base_asset_combobox = $('#base_asset');
    var amount_price = $('<div id="amount_price">0 ' + base_asset_combobox.val() + '</div>').insertAfter(row);
    var sl1_amount_price_in_base = $('<div id="sl1_amountInBase">SL value : 0 ' + base_asset_combobox.val() + ' Loss : 0 ' + base_asset_combobox.val() + '</div>').insertAfter(sl1_row);

    var tps_fields = [];
    var tps_amounts = [];
    var tps_amount_price_in_base = [];
    var tps_rows = [];

    for (let tp = 1; tp <= number_of_tps_max; tp++) {
      let index = tp - 1;
      tps_fields.push($('#tp' + tp.toString() + '_price'));
      tps_amounts.push($('#tp' + tp.toString() + '_amount'));

      tps_rows.push(tps_fields[index].parents('.row')[0]);

      tps_amount_price_in_base.push($('<div id="tp' + tp.toString() + '_amountInBase">TP' + tp.toString() +' value : 0 ' + base_asset_combobox.val() + ' Profit : 0 ' + base_asset_combobox.val() + '</div>').insertAfter(tps_rows[index]));

      tps_fields[index].on('input', calcRefresh);
      tps_amounts[index].on('input', calcRefresh);
    }

    console.log(current_price);

    function calcRefresh(){
        //console.log(ordertype.attr('value'));

        var amountv = parseFloat(amount.val() == '' ? '0' : amount.val());
        var pricev = ordertype.attr('value') == 'market' ? parseFloat(current_price.text()) :parseFloat(price.val());
        var amount_pricev = amountv * pricev;
        var sl1_price = parseFloat(sl1_field.val() == '' ? '0' : sl1_field.val());
        var sl1_amountv = parseFloat(sl1_amount.val() == '' ? '0' : sl1_amount.val());
        var sl1_amount_pricev = amountv * sl1_price * sl1_amountv / 100.0;
        var sl1_loss_value = (amount_pricev * sl1_amountv / 100.0) - sl1_amount_pricev;
        //console.log(amountv, pricev, amount_pricev, base_asset_combobox.val());

        amount_price.html(amount_pricev.toFixed(2) + " " + base_asset_combobox.val());
        sl1_amount_price_in_base.html("SL value : " + sl1_amount_pricev.toFixed(2) + " " + base_asset_combobox.val() + " Loss : " + sl1_loss_value.toFixed(2) + " " + base_asset_combobox.val());

        if(sl1_row.hidden){
            sl1_amount_price_in_base.hide();
        }
        else{
            sl1_amount_price_in_base.show();
        }

        for (let tp = 1; tp <= number_of_tps_max; tp++) {
            let index = tp - 1;
            let tp_price = parseFloat(tps_fields[index].val() == '' ? '0' : tps_fields[index].val());
            let tp_amountv = parseFloat(tps_amounts[index].val() == '' ? '0' : tps_amounts[index].val());
            let tp_amount_pricev = amountv * tp_price * tp_amountv / 100.0;
            let tp_profit_value = tp_amount_pricev - (amount_pricev * tp_amountv / 100.0);

            tps_amount_price_in_base[index].html("TP" + tp.toString() +" value : " + tp_amount_pricev.toFixed(2) + " " + base_asset_combobox.val() + " Profit : " + tp_profit_value.toFixed(2) + " " + base_asset_combobox.val())

            if(tps_rows[index].hidden){
                tps_amount_price_in_base[index].hide();
            }
            else{
                tps_amount_price_in_base[index].show();
            }
        }
    }

    window.calcRefresh = calcRefresh;

    ordertype.attrchange({
        trackValues: true,
        callback: function (event) {
            if(event.attributeName == 'value'){
                calcRefresh();
            }
        }
    });

    amount.on('input', calcRefresh);
    price.on('input', calcRefresh);
    sl1_field.on('input', calcRefresh);
    sl1_amount.on('input', calcRefresh);

    $('a[href="#"]').each(function(){
        $(this).attr('onclick', ($(this).attr('onclick') + "").replace('return', 'window.calcRefresh();return'));
    });

    $('#btn_add_sl').click(function() {
        calcRefresh();
    });

    $('#btn_add_tp').click(function() {
        calcRefresh();
    });

    $('#btn_clear_tps').click(function() {
        calcRefresh();
    });

    $('#btn_clear_sls').click(function() {
        calcRefresh();
    });


    calcRefresh();
})();