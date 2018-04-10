'use strict';
/*globals document, console, XMLHttpRequest*/

console.log('hello from server');

(function(global) {
    var serverHost = '<%= serverHost %>';
    var elements = document.querySelectorAll('.foo-widget');
    for (var i = 0; i < elements.length; ++i) {
        var el = elements[i];
        processElement(el);
    }

    function processElement(el) {
        var id = el.getAttribute('data-foo-id');
        var processed = el.getAttribute('data-foo-processed');
        if (!id || processed === 'done') {
            //skip this one as it has either already been processed, or lacks an ID
            //This is done to ensure logic is not executed twice in the event that the
            //user erroneously embeds the script tag more than once on a single page
            console.log('skipping element:', el);
            return;
        }
        var xhr = new XMLHttpRequest();

        // var url = 'https://dev.tn-apis.com/catalog/v1/events/search?q=duck';

        // xhr.setRequestHeader('x-listing-context', 'website-config-id=237');
        // xhr.setRequestHeader('Authorization', 'Bearer 3448f98a-ac8b-3216-beee-8584175c6070');
        // xhr.setRequestHeader('Accept', 'application/json');
        // xhr.setRequestHeader('Content-Type', 'application/json');

        

        xhr.onload = function() {
            el.innerHTML = 'foo-widget: '+this.responseText;
            el.setAttribute('data-foo-processed', 'done');
        };
        xhr.open("GET", serverHost+'/api/3rd/foo-widget/init/'+id);
        xhr.send();
    }
}());