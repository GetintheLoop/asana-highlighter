// ==UserScript==
// @name         Asana in Rollbar Summary
// @namespace    https://github.com/GetintheLoop/asana-highlighter/
// @version      0.7
// @description  Display Asana Tasks in Rollbar List View
// @author       Lukas Siemon
// @match        https://rollbar.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/GetintheLoop/asana-highlighter/master/scripts/asana-in-rollbar.js
// ==/UserScript==

(function() {
    'use strict';
    let check = setInterval(function() {
        if (!document.hidden) {
            let trs = $("table.table-condensed tr[class]");
            trs.each(function (idx) {
                let tr = $(trs[idx]);
                if (tr.find("td.injected").length === 0) {
                    let td = $("<td class='injected'>");
                    tr.append(td);
                    let links = tr.find("span.ellipsis a");
                    if (links.length === 1) {
                        $.ajax({
                            url: links[0].href,
                            method: "GET",
                            success: function(data){
                                let splitter = 'href="https://app.asana.com/';
                                let lastIndex = data.partial.lastIndexOf(splitter);
                                if (lastIndex !== -1) {
                                    let match = data.partial.substring(lastIndex + splitter.length).split('"', 1)[0];
                                    td.html("<a title='Asana Task' target='_blank' style='cursor:pointer' href='https://app.asana.com/" + match + "'>" +
                                            "<img width='24px' height='24px' src='https://i.imgur.com/EPeKqJ5.png'></a>");
                                } else {
                                    td.html("<a title='Link Task' target='_blank' style='cursor:pointer' href='" + links[0].href + "'>" +
                                            "<img src='https://i.imgur.com/CLPbsA0.gif'></a>");
                                }
                            }
                        });
                    }
                }
            });
        }
    }, 1500);
})();
