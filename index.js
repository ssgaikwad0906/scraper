const reqProm = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://medium.com/';
var urlSrc = new Array();
var totalInternalUrls = 0;
var totalUrls = 0;
// var https = require('https');
// var httpAgent = new https.Agent();
// httpAgent.maxSockets = 5;
getPageUrls(url);

function writeToFile(text)
{
    fs.appendFile('scrape.txt', text, function(err) {
        if(!err) {
            console.log("scrape written out successfully");
        } else {
            console.error(err);
        }
    })

}

function getPageUrls(url)
{
    var https = require('https');
    var httpAgent = new https.Agent();
    httpAgent.maxSockets = 5;
    reqProm(url, httpAgent).then(function(data) {
        const $ = cheerio.load(data);
        totalInternalUrls = $('a').length;

        for (let i = 0; i < totalInternalUrls; i++) {
            if(urlSrc.includes($('a',data)[i].attribs.href) !== true && $('a',data)[i].attribs.href != 'https://medium.com') {
                // console.log($('a',data)[i].attribs.href);
                // if($('a',data)[i].attribs.href != url && $('a',data)[i].attribs.href != 'https://medium.com' ) {
                urlSrc.push($('a',data)[i].attribs.href);
                writeToFile($('a',data)[i].attribs.href+"\r\n");
            }
        }
        totalUrls = totalInternalUrls-5;
        if(totalUrls > 4)
        {
            // console.log(totalInternalUrls);
            urlSrc.forEach(function(src){
                getPageUrls(src);
            })
        }
        
    }).catch(function(err) {
        // console.error(err);
    });
    
}