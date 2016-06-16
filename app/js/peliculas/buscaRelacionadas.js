/**
 * Created by tino on 16/06/2016.
 */
function gcseCallback() {
    if (document.readyState != 'complete')
        return google.setOnLoadCallback(gcseCallback, true);
    google.search.cse.element.render({gname:'gsearch', div:'relacionadas', tag:'searchresults-only', attributes:{linkTarget:'',resultSetSize:'5',webSearchResultSetSize:'5'}});
    var element = google.search.cse.element.getElement('gsearch');
    element.execute('action'); //aca va la busqueda
};
window.__gcse = {
    parsetags: 'explicit',
    callback: gcseCallback
};
(function() {
    var cx = '004662602198127010214:2nj-zd19ml8';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//www.google.com/cse/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
})();