"use strict";

var fs = require('fs'),
    jsonfile = require('jsonfile'),
    _ = require('lodash'),
    inputFile = './issues.json',
    outputFile = './domaincount.json';

function main() {
  var issuesList = loadFile(inputFile), // Load the issues JSON
      noMediaList = filterMedia(issuesList), // Filter out type-media bugs from the list
      domains = filterDomains(noMediaList), // Try to get the domain for each issue
      sorted = _.orderBy(domains), // Sort the list
      counts = _.countBy(sorted); // Count the unique domains
  logData(counts); // Save to file
}


function loadFile(filename) {
  //Load the full dataset
   return jsonfile.readFileSync(filename);
}


function filterMedia(issues){
  var noMediaList = [];

  for (var issue of issues) {
    //Loop through all the issues
    var isMedia = false;
    for (var label of issue.labels) {
      //Loop through all the labels in each issue to exclude media bugs
      if(label.name == 'type-media'){
        isMedia = true;
      }
    }
    if (isMedia == false) noMediaList.push(issue);
  }
  return noMediaList;
}


function filterDomains(issues){
  var domains = [];
  for (var issue of issues) {
    var urlEnd = issue.title.indexOf(" - ");
    var url = issue.title.substr(0,urlEnd);
    var domain = extractRootDomain(url);
    //domains.push({ 'url': url, 'domain': domain, 'issue': issue.number });
    domains.push(domain);
  }
  return domains;
}


function extractRootDomain(url) {
    var domain = url,
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}


var logData = function(issuesList) {
  // Write some data to some file
  jsonfile.writeFileSync(outputFile, issuesList);
}


main(); //Let's get started
