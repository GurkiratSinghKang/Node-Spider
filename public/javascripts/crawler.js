var request = require("request");
var _ = require("underscore");
var urllib = require('url');                           //for manipulating urls
var baseurl;                                          //to prevent spider from spilling over the internet
var keyword;                                          //to narrow down search and visit only specific urls
var DEFAULT_DEPTH = 2;

function Crawler() {                  
  this.visitedURLs = {};                              //keep track of visited urls
  this.depth = DEFAULT_DEPTH;                         //how many levels deep
  this.ignoreRelative = false;                        //flag to check whether to consider or ignore relative urls
  this.shouldCrawl = function() {
    return true;
  };
}

Crawler.prototype.configure = function(options) {     //Initial configuration
  this.depth = (options && options.depth) || this.depth;
  this.depth = Math.max(this.depth, 0);
  this.ignoreRelative = (options && options.ignoreRelative) || this.ignoreRelative;
  this.shouldCrawl = (options && options.shouldCrawl) || this.shouldCrawl;
  return this;
};

Crawler.prototype.crawl = function (url, key, onSuccess, onFailure) {   //Main crawler function, spidering starts from here 
  baseURL = url;                                                        
  keyword = key;
  if(url.indexOf("http://trai.gov.in/Content/PressReleases.aspx")>-1)
    baseURL = "http://trai.gov.in/";
  this.crawlUrl(url, this.depth, onSuccess, onFailure);
};

Crawler.prototype.crawlUrl = function(url, depth, onSuccess, onFailure) {
  if(url.indexOf(keyword)>-1)                                             //if the keyword appears in url, set flag=true
    var flag = true;

  if (url.indexOf("http://trai.gov.in/Content/PressDetails/")>-1){       //to bypass the check in next line (due to irregularities in urls)
    baseURL="http://trai.gov.in/Content/PressDetails/";
  }

  if (0 == depth || this.visitedURLs[url] || url.indexOf(baseURL)<0){     //dont visit url if max length exceeded, or already visited or outside base url
    return;
  }
  if (url.indexOf("http://trai.gov.in/Content/PressDetails/")>-1){        //look for only specific links
    baseURL="/WriteReadData/PressRealease/Document/";
  }
  
  if (flag==true) {                                                       //if keyword does not appear in url again, skip it
    if (url.indexOf(keyword)<0) return; 
  }
  
  var self = this;


  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {                           //if visited
      self.visitedURLs[url] = true;                                       //set visitedURLs = true
      onSuccess({                                                         //send onsuccess reply
          url: url,
          status: response.statusCode,
          content: body
      });
      self.crawlUrls(self.getAllUrls(url, body), depth - 1, onSuccess, onFailure);      //crawl all urls of next level
    } else if (onFailure) {                                               //if error, send error response
      onFailure({ 
        url: url,
        status: response ? response.statusCode : undefined
      });
    }
  });
};

Crawler.prototype.getAllUrls = function(baseUrl, body) {                  //get all urls inside a link
  var self = this;
  var linksRegex = self.ignoreRelative ? /<a[^>]+?href=".*?:\/\/.*?"/gm : /<a[^>]+?href=".*?"/gm;
  var links = body.match(linksRegex) || [];                               //find links

  links = _.map(links, function(link) {                                   //make a links array
    var match = /href=\"(.*?)[#\"]/.exec(link);

    link = match[1];
    link = urllib.resolve(baseUrl, link);                                 //find absolute link
    return link;
  });
  return _.chain(links)                                                   //return all unique urls
    .uniq()
    .filter(this.shouldCrawl)
    .value();
};

Crawler.prototype.crawlUrls = function(urls, depth, onSuccess, onFailure) {     //crawl each url in array
  var self = this;

  _.each(urls, function(url) {
    self.crawlUrl(url, depth, onSuccess, onFailure);
  });
};

module.exports = Crawler;