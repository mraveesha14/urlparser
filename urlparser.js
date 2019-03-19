var http = require('http');
var url = require('url');

var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});
  var resultJsonObj;

  if (queryData.input) {
    var str = queryData.input; 
    str = str.replace(/^"(.*)"$/, '$1'); //replacing leading and lagging quotes from the input string parameter
    
    var menRegEx = /(?:^|\W)@(\w+)(?!\w)/g;      // RegEx for finding all strings that start with "@"
    var emoRegExp = /\(([^)]+)\)/g;              // RegEx for finding all strings enclosed in ()
    var urlRegEx = /(https?:\/\/[^\s]+)/g;       // RegEx for finding all URLs in a string
    var matchMen, matchEmo, matchUrl, mentions = [], emoticons = [], links = [];
    var resultStr;

    while (matchMen = menRegEx.exec(str)) {
        mentions.push(JSON.stringify(matchMen[1]));
    }

    while (matchEmo = emoRegExp.exec(str)) {
        emoticons.push(JSON.stringify(matchEmo[1]));
    }

    while (matchUrl = urlRegEx.exec(str)) {
        links.push(JSON.stringify(matchUrl[1]));
    }
    resultStr = JSON.stringify('{ "mentions": [' + mentions + '] , "emoticons": ['+ emoticons + '] , "links": [' + links + ']}'); //converting into json string
    resultJsonObj = JSON.parse(resultStr); //converting the string in to JSON object 
    console.log('Input String - ', queryData.input);  //display input in the console
    console.log('Output - ', resultJsonObj);    //display output in the console
    response.end(resultJsonObj);    //display output in the response body
  } else {
    response.end("Please Enter a URL with data parameters");
  }
});

server.listen(8000);
