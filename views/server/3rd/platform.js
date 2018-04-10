(function() {

    var results;

    var tn_eventWidget_settings = {
        "targetContainer": "#target-output",
        "website-config-id": 237,
        "eventPageSlug": "/events/",
        "useQueryStringForEventID": false,
        "useQueryStringForSearchTerm": true,
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

    // change display data formats
    function reformatData(result) {
        var allResults = result.results;

        allResults.forEach(function (part, index, allResults) {
            allResults[index].date.text.date = allResults[index].date.text.date.substr(0, 3).toUpperCase();
            allResults[index].date.date = new Date(allResults[index].date.date).toString().substr(4, 6);
        });
        console.log()
        return allResults;
    }

    function main() {
        jQuery(document).ready(function ($) {

             var template = '<div id="eventResultsWidgetWrapper" class="container-fluid"><div class="container"><div class="row"><h1>Upcoming Shows</h1></div></div><section id="eventResults"><!-- {{#results}} --><article class="result-card container container-fluid"><div class="row"><div class="col-2 centerVertical borderRight"><p class="normalParagraph"> {{date.text.date}} </p><p class="normalParagraph"> {{date.date}} </p><p class="normalParagraph"> {{date.text.time}} </p></div><div class="col-7 centerVertical"><p class="title">{{text.name}}</p><p></div><div class="col-3 centerVertical alignRight"><a href="{{settings.eventPageSlug}}{{id}}"><div class="btn btn-success ticketsButton">Buy Tickets&nbsp; ></div></a><p class="normalParagraph">{{_metadata.eTickets.ticketCount}} ticket(s) remaining</p></div></div></article><!-- {{/results}} --></section></div>';



            var catalogUrl = "https://dev.tn-apis.com/catalog/v1/events/search?q=duck",
              targetContainer = tn_eventWidget_settings.targetContainer,
              eventResults = $.ajax({
                  url: catalogUrl,
                  headers: {
                      'x-listing-context': 'website-config-id=237',
                      'Authorization': 'Bearer 3448f98a-ac8b-3216-beee-8584175c6070',
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  },
                  type: 'GET',
                  success: function (result) {
                      var results = reformatData(result);

                      //var elements = document.querySelectorAll('.foo-widget');
                        // for (var i = 0; i < results.length; ++i) {
                        //     //var el = elements[i];
                        //     //processElement(el);
                        //     console.log(results[i].date.date)
                        //     //el.innerHTML = results;
                        // }


                      results["settings"] = tn_eventWidget_settings;
                     var html = Mustache.render(template, result);
                      $(targetContainer).html(html);


                      
                  }
              });
            $('head').append('<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto+Slab|Roboto:400,500">')
           .append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">')
           .append('<link rel="stylesheet" type="text/css" href="./style.css">')
           .append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js" async>');

            });

    }

}());