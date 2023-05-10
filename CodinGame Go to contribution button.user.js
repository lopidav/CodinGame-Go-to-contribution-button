// ==UserScript==
// @name         CodinGame Go to contribution button
// @namespace    https://lopidav.com/
// @version      0.1
// @description  Adds "Go to contribution" button to the Clash of Code results page
// @author       lopidav
// @match        https://www.codingame.com/*
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var lastQuestions=[];

(function() {
    $(document).on('DOMNodeInserted', checkForReportLoad);

    function checkForReportLoad(event) {
        if (
            window.location.pathname.includes('clash/report')
            && $(event.target).is('div#clashofcode-report')
            && lastQuestions.length > 0
        ) {
            var lastQuestionTitle = lastQuestions[0].title;
            lastQuestions = [];
            let button = $(`<button class="join-clash-button" style="display: inline-block;">Go to Contribution</button>`);
            button.click(function() {
                button.css('background-color', '#c9b94b');
                fetch("https://www.codingame.com/services/Contribution/getAcceptedContributions", {
                    "headers": {
                        "content-type": "application/json;charset=UTF-8",
                    },
                    "body": "[\"CLASHOFCODE\"]",
                    "method": "POST"
                })
                    .then(r => r.json())
                    .then(d => {
                    let found = true;
                    for(let i in d) {
                        if(d[i].title==lastQuestionTitle) {
                            window.open(`https://www.codingame.com/contribute/view/${d[i].publicHandle}`);
                            found = true;
                            break;
                        }
                    }
                    if(!found) {
                        button.css('background-color', '#404d4d');
                    }
                });
            });
            $('div.report-container div.button-container').append(button);
        }
    }
})();
(function(XHR) {
    const {open, send} = XHR;
    XHR.open = function(method, url) {
        this.addEventListener('readystatechange', () => {
            if(this.readyState == 4 && this.responseURL.includes('startTestSession')) {
                let data = JSON.parse(this.response);
                lastQuestions = data.questions;
            }
        });
        open.apply(this, arguments);
    }
})(XMLHttpRequest.prototype);
