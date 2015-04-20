var express = require('express')
  , http = require('http')                        //for http.get, to download files
  , urllib = require('url')                       //for parsing URL
  , fs = require('fs')                            //for updating pdfs.txt and urls.txt
  , router = express.Router()
  , PDFPattern = /.pdf/i
  , Crawler = require("../public/javascripts/crawler.js")
  , URLs = []                                     //list of URLs
  , PDFs = [];                                    //list of PDFs

router.post('/', function(req, res, next){        //on getting a post req from home page
  var url = req.body.url;
  var keyword = req.body.keyword;
  var depth = req.body.depth;
  new Crawler().configure({depth: depth})         //create new crawler, configure it, and run it
	.crawl(url, keyword, function onSuccess(page) {
		URLs.push(page.url);
    fs.appendFile('urls.txt', ""+page.url+"\n", function (err) {   //write urls to file
      if (err) throw err;
    });
		if(PDFPattern.test(page.url)){                //if file is a pdf, push it to PDFs array
      PDFs.push(page.url);
      fs.appendFile('pdfs.txt', ""+page.url+"\n", function (err) {   //write url to pdfs to file
        if (err) throw err;
      });
      download_file_httpget(page.url);            //download the pdf
		}
	});
  

  var DOWNLOAD_DIR = "./Downloads/";                      
   

  function download_file_httpget(file_url) {      //takes file_url as input and saves the file to DOWNLOAD_DIR        
    var options = {                               //setting up options
        host: urllib.parse(file_url).host,
        port: 80,
        path: urllib.parse(file_url).pathname
    };

    var file_name = urllib.parse(file_url).pathname.split('/').pop();   //extract file name from url
    console.log(file_name);
    var file = fs.createWriteStream(DOWNLOAD_DIR + "/" +file_name);

    http.get(options, function(res) {             //send http get request to download file
        res.on('data', function(data) {
                file.write(data);
            }).on('end', function() {
                file.end();
                console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
            });
        });
  };

    
	res.send("Url list stored in urls.txt!</br>PDF list is stored in pdfs.txt!</br>Download Started!");


})

module.exports = router;
