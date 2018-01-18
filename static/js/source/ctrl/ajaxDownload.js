/**
 * Created by jensenchen on 21/03/2017.
 */
export  default function (url, data, input_name) {
    var $iframe,
        iframe_doc,
        iframe_html;

    if (($iframe = $('#download_iframe')).length === 0) {
        $iframe = $("<iframe id='download_iframe'" +
            " style='display: none' src='about:blank'></iframe>"
        ).appendTo("body");
    }

    iframe_doc = $iframe[0].contentWindow || $iframe[0].contentDocument;
    if (iframe_doc.document) {
        iframe_doc = iframe_doc.document;
    }

    iframe_html = "<html><head></head><body><form method='POST' action='" +
        url +"'>" +
        "<input type=hidden name='" + input_name + "' value='" +
        JSON.stringify(data) +"'/></form>" +
        "</body></html>";

    iframe_doc.open();
    iframe_doc.write(iframe_html);
    $(iframe_doc).find('form').submit();
}