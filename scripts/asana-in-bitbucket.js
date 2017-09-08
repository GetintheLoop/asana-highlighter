// ==UserScript==
// @name         Asana Links in Bitbucket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use Asana Task Id and render as links in Bitbucket
// @author       Lukas Siemon
// @match        https://bitbucket.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        if (!document.hidden) {
            let desc = $(".pull-request-title h1");
            if (desc.length === 1) {
                if (desc[0].innerText.indexOf('#') !== -1) {
                    desc[0].innerHTML = desc[0].innerText.replace(
                        /#(\d{10,})/g,
                        '<a href="https://app.asana.com/0/0/$1" target="_blank">' +
                        '<img src="http://i.imgur.com/gsoSXCM.png" style="height:20px; vertical-align:text-top">' +
                        '</a>'
                    );
                }
            }
        }
    }, 1000);
})();
