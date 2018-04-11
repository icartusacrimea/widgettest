(function() {

    var results, widgetSearchTerm;

    var xListingContent = '<%= xListingContent %>';
    var authorization = '<%= authorization %>';

    var tn_eventWidget_settings = {
        "targetContainer": "#target-output",
        "website-config-id": 237,
        "eventPageSlug": "/events/",
        "useQueryStringForEventID": false,
        "useQueryStringForSearchTerm": false,
        "searchTermQueryStringKey": "",
        "searchTermUrlPattern": "\/test\/(.*)\.html"
    };

    // check for existence of jQuery; if none, load it
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.2.1') {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js");
        scriptTag.onload = scriptLoadHandler;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
    }

    function scriptLoadHandler() {
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    // instantiate function to get search term either by query string or path
    function getSearchTerm() {
        widgetSearchTerm = "";
        if (tn_eventWidget_settings.useQueryStringForSearchTerm) {
            var queryStringChunks = location.href.split('?')[1].split('&');
            for (var i = 0; i < queryStringChunks.length; i++) {
                var currentKeyValue = queryStringChunks[i].split('=');
                if (currentKeyValue[0] === tn_eventWidget_settings.searchTermQueryStringKey) {
                    widgetSearchTerm = currentKeyValue[1];
                    break;
                }
            }
        }
        else {
            var url = window.location.href;
            var n = url.lastIndexOf('=');
            var widgetSearchTerm = url.substring(n+1, url.length);
        }
        return widgetSearchTerm;
    };


    // change display data formats
    function reformatData(result) {
        var allResults = result.results;
        allResults.forEach(function (part, index, allResults) {
            allResults[index].date.text.date = allResults[index].date.text.date.substr(0, 3).toUpperCase();
            allResults[index].date.date = new Date(allResults[index].date.date).toString().substr(4, 6);
        });
        return allResults;
    }

    function main() {
        jQuery(document).ready(function ($) {

            var template = '<div id="eventResultsWidgetWrapper" class="container-fluid"><section id="eventResults"><!-- {{#results}} --><article class="result-card container container-fluid"><div class="row"><div class="col-2 centerVertical borderRight"><p class="normalParagraph">{{date.text.date}}</p><p class="normalParagraph">{{date.date}}</p><p class="normalParagraph">{{date.text.time}}</p></div><div class="col-7 centerVertical"><p class="title">{{text.name}}</p><p class="normalParagraph slightlyBoldParagraph">{{venue.text.name}}</p><p class="normalParagraph">{{city.text.name}}, {{stateProvince.text.name}}, {{country.text.name}}</p></div><div class="col-3 centerVertical alignRight"><a href="{{settings.eventPageSlug}}{{id}}"><div class="btn btn-success ticketsButton">Buy Tickets  ></div></a><p class="normalParagraph">{{_metadata.eTickets.ticketCount}} ticket(s) remaining</p></div></div></article><!-- {{/results}} --></section></div>';

            var catalogUrl = "https://dev.tn-apis.com/catalog/v1/events/search?q=" + getSearchTerm(),
                targetContainer = tn_eventWidget_settings.targetContainer,
                eventResults = $.ajax({
                    url: catalogUrl,
                    headers: {
                        'x-listing-context': xListingContent,
                        'Authorization': authorization,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    type: 'GET',
                    success: function (result) {
                        var results = reformatData(result);
                        console.log(results)
                        results["settings"] = tn_eventWidget_settings;
                        var html = Mustache.render(template, result);
                        $(targetContainer).html(html);
                  }
            });

            $('head').append('<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto+Slab|Roboto:400,700,800">')
           .append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">')
           .append('<link rel="stylesheet" type="text/css" href="/styles/style.css">')
           .append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js" async>');

            });

    }

}());