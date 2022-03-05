// ==UserScript==
// @name         Arya Signal to MT4 Script
// @namespace    TamperMonkey
// @version      1.1
// @description  try to take over the world!
// @author       Coding Seb
// @match        https://arya.xyz/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?domain=arya.xyz
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var timerInverval = 1000;

    function inject(){
        try{

            $('span:contains("acheter"), span:contains("vendre"), span:contains("buy"), span:contains("sell")').each(function (index, element) {
                try{

                    if ($(element).children().length === 0) {
                        var content = $(element).text();
                        var parent = $(element).parent();
                        var infosDiv = parent.parent().next().next().children()[0];
                        console.log(infosDiv);
                        var infos = $(infosDiv).text();
                        console.log(infos);
                        var symbolDiv = parent.next();
                        var symbol = $(symbolDiv).text().trim();
                        var trade = "trade:Type:market Symbole:[" + symbol + "] " + infos;
                        console.log(trade);
                        parent.replaceWith("<button onclick='window.open(\"" + trade + "\");' class='" + parent.attr('class') + "'>" + content.toUpperCase() + "</button>");
                    }

                }
                catch (marketEx) {
                    console.log(marketEx);
                }
            });
        }
        catch (globalEx) {
            console.log(globalEx);
        }

        setTimeout(function(){ inject() }, timerInverval);
    }

    inject();

})();
