var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

var cart = [];
var pdfs = [];
var pattern=/.pdf/i
baseurl = "";

function does_not_contain(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i][0] === obj) {
           return false;
       }
    }
    return true;
}


var getPDF = function(url) {

		console.log(url);
	    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            $("a").each(function() {
    			var link = $(this);
    			var text = link.text();
    			var href = link.attr("href");
    			if (does_not_contain(cart,href) || does_not_contain(pdfs,href)) {
	    			if(pattern.test(href)){
	    				pdfs.push(href);
	    				console.log(baseurl+href);
						fs.writeFile("tmp/test.txt", baseurl+href, function(err) {
    						if(err) {
        						return console.log(err);
    						}

    						console.log("The file was saved!");
						});
						fs.writeFile("tmp2/test.txt", "Hey there!", function(err) {
    						if(err) {
        						return console.log(err);
    						}

    						console.log("The file was saved!");
						});
	    			}
	    			else
	    			cart.push([href, 0]);
	    		};
  			});

           	//for (var i = 0; i < cart.length; i++) {
            //	if(cart[i][1]==0)
            //		cart[i][1]=1;
            //}
            for (var i = 0; i < cart.length; i++) {
            	if(cart[i][1]==0){
            		cart[i][1]=1;
            		getPDF(baseurl+cart[i][0]);
            	}
            };
	    }
    });
	
}



router.post('/', function(req, res, next){
    url = req.body.url;
    baseurl = url;
    getPDF(url);
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
	res.send('Check console!')
})

module.exports = router;
