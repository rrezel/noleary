/*
 * NoLeary - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Donald Trump from the web page.
 */

// Variables
var regex = /Leary/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Leary'), :contains('LEARY'), :contains('leary')";


// Functions
function filterMild() {
	console.log("Filtering O'Leary with Mild filter...");
	return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterSmart() {
	console.log("Filtering O'Leary with Default filter...");
	elem = $(selector).filter('h1,h2,h3,h4,h5,p,span,li');
	
	var noparent = ['thestar.com','twitter.com'],
	length = noparent.length;
	while(length--) {
	   if (document.URL.indexOf(noparent[length])!=-1) {
		   return elem;
	   }
	}	
	
	var twoparents = ['reddit.com','news.google.ca'],
	length = twoparents.length;
	while(length--) {
	   if (document.URL.indexOf(twoparents[length])!=-1) {
		   return elem.parent().parent();
	   }
	}
		

	return elem.parent();

}

function filterVindictive() {
	console.log("Filtering O'Leary with Vindictive filter...");
	return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else if (filter == "smart") {
	   return filterSmart();
   } else {
     return filterMild();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}


// Implementation
if (search) {
   console.log("Kevin O'Leary found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'smart',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", trumps: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " olearies.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
