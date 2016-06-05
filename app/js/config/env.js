/*(function (window) {
    window.__env = window.__env || {};

    // API url
    window.__env.apiUrl = 'http://localhost:3000';

}(this));
*/

var url='http://localhost:';
var port= '3000';

function getUrlServer(){
  console.log('entre al get url');
    return url+port;
}
