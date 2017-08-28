// ==UserScript==
// @name         Asana
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Custom Code formatting for Asana
// @author       Lukas Siemon
// @match        https://app.asana.com/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.3/highlight.min.js
// ==/UserScript==

$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.3/styles/default.min.css" type="text/css" />');

(function() {
    'use strict';
    function highlight() {
        $('pre:not(.syntaxhighlighter *), code:not(.syntaxhighlighter *)').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    }
    function rewrite(input) {
        return input.replace(
            /<!--[^>]*?-->/g,
            ''
        ).replace(
            /(<[^>]+?>)?```([a-z]*?)(?![a-z])(<br>)?([\s\S]*?)```(<[^>]+?>)?/g,
            '<pre class="brush: $2;">$1$4$5</pre>'
        ).replace(
            /`([^`]*?)`/g,
            "<span style='background-color: #f0f0f0; border: 1px solid #d8d8f0; padding: 1px; padding-left: 3px; padding-right: 3px; color: #c01860'>$1</span>"
        );
    }

    setInterval(function() {
        if (!document.hidden) {
            // format description
            let desc = $("#TaskDescription-textEditor, #property_sheet\\:details_property_sheet_field\\:description");
            if (desc.length == 1) {
                let display = desc.next("p");
                if (display.length === 0) {
                    display = $("<p style='min-height: 42px; padding: 4px 9px;'/>");
                    display.click(function(e) {
                        desc.show();
                        desc.focus();
                        display.hide();
                    });
                    desc.blur(function() {
                        display.show();
                        display[0].innerHTML = rewrite(desc[0].innerHTML);
                        highlight();
                        desc.hide();
                    });
                    $(display).insertAfter(desc);
                    display[0].innerHTML = rewrite(desc[0].innerHTML);
                    highlight();
                    desc.hide();
                }
            }
            // format comments
            $("div.truncatedRichText-richText, div.commentStoryView-content").each(function(idx, e) {
                if (e.innerText.indexOf('`') != e.innerText.lastIndexOf('`')) {
                    e.innerHTML = rewrite(e.innerHTML);
                    highlight();
                }
            });
        }
    }, 1000);
})();
