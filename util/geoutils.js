/**
 * Created by jensen on 2017/1/25.
 */
const request = require('superagent');
exports.geoquerybaidu=function(arg)
{
    request.get('http://api.map.baidu.com/geocoder/v2/')
        .query({coordtype: "wgs84ll"})
        .query({location: `${arg[1]},${arg[0]}`})
        .query({output: 'json'})
        .query({ak: "zLrV88zji1axnGG5dnXsep02jkUlMNSR"})
        .end(function(err, rs) {
            if (err) {
                console.log('err:', err);
                return;
            }
          let locinfo = JSON.parse(rs.text);
        })
};
exports.geoquerygoogle=function(arg,callback)
{
    request.get('https://maps.googleapis.com/maps/api/geocode/json')
        .query({latlng: `${arg[1]},${arg[0]}`})
        .query({key: 'AIzaSyCciNNacEnEyW2FV5qYvS7h9uRicAuwBEo'})
        .query({ak: "zLrV88zji1axnGG5dnXsep02jkUlMNSR"})
        .end(function(err, rs) {
            if (err) {
                console.log('err:', err);
                callback(null,"");
            }
            let locinfo = JSON.parse(rs.text);
            if (locinfo.results && locinfo.results.length>0) {
                callback(null, locinfo.results[0].formatted_address);
            }
            else
                callback(null,"");
        })
}
