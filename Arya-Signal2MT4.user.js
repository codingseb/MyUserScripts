// ==UserScript==
// @name         Arya Signal to MT4 Script
// @namespace    TamperMonkey
// @version      1.0
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

            $('div:contains("entrée au marché")').each(function (index, element) {
                try{

                    if ($(element).children().length === 0) {

                        var infosDiv = $(element).next().children()[0];
                        var infos = $(infosDiv).text();
                        var symbolDiv = $(element).prev().prev().children()[1];
                        var symbol = $(symbolDiv).text().trim();
                        var trade = "trade:Type:market Symbole:[" + symbol + "] " + infos;
                        console.log(trade);
                        $(element).html("<button onclick='window.open(\"" + trade + "\");' class='capitalize border border-gray-500 p-1 px-5 rounded'> Entrée au marché </button>");
                    }

                }
                catch (marketEx) {
                    console.log(marketEx);
                }
            });

            $('div:contains("ordre conditionnel")').each(function (index, element) {
                try{

                    if ($(element).children().length === 0) {

                        var infosDiv = $(element).next().children()[0];
                        var infos = $(infosDiv).text();
                        var symbolDiv = $(element).prev().prev().children()[1];
                        var symbol = $(symbolDiv).text().trim();
                        var trade = "trade:Type:conditional Symbole:[" + symbol + "] " + infos;
                        console.log(trade);
                        $(element).html("<button onclick='window.open(\"" + trade + "\");' class='capitalize border border-gray-500 p-1 px-5 rounded'> Ordre conditionnel </button>");
                    }

                }
                catch (conditionEx) {
                    console.log(conditionEx);
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