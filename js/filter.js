/*
 * NoLeary - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Donald Trump from the web page.
 */

// Variables
var regex = /Leary/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Leary'), :contains('LEARY'), :contains('leary')";
var sites={'thestar.com': 2,
			 'twitter.com': 0,
			 'reddit.com': 2,
			 'news.google.ca': 2};

// Functions
function filterMild() {
	console.log("Filtering O'Leary with Mild filter...");
	return $(selector).filter("a,h1,h2,h3,h4,h5,p,span,li");
}

function filterSmart() {
	console.log("Filtering O'Leary with Smart filter...");
	
	elems = $(selector).filter('a,h1,h2,h3,h4,h5,p,span,li');
	
	if (document.URL.includes('news.google.ca')) {
		elems = elems.add($(selector).filter('a,h1,h2,h3,h4,h5,p,span,li').parents().filter('.blended-wrapper'));
	} else if (document.URL.includes('reddit.com')) {
		elems = elems.add($(selector).filter('a,h1,h2,h3,h4,h5,p,span,li').parents().filter('.link'));
	} else if (document.URL.includes('facebook.com')) {
		elems = elems.add($(selector).filter('a,h1,h2,h3,h4,h5,p,span,li').parents().filter('.userContentWrapper'));
	} else if (document.URL.includes('theglobeandmail.com')) {
		elems = elems.add($(selector).filter('a,h1,h2,h3,h4,h5,p,span,li').parents().filter('article'));
	} else if (document.URL.includes('theprovince.com')) {
		elems = elems.add($(selector).filter('a,h1,h2,h3,h4,h5,p,span,li').parents().filter('.wfull'));
	}
	
	
	return elems;
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

function filterElements(elems) {
	console.log("Elements to filter: ", elems);
	elems.fadeOut("fast");
}

function fade(element) {
    var op = 1; 
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.3;
    }, 50);
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
