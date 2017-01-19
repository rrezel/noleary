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
	console.log("Filtering O'Leary with Default filter...");
	elems = $(selector).filter('a,h1,h2,h3,h4,h5,p,span,li');
	
	elemList = [];
	console.log(elems);
	
	var parents=2;
	for (var key in sites) {
		if (sites.hasOwnProperty(key)) {
			if (document.URL.indexOf(key)!=-1) {
				parents=sites[key];
			}
		}
	}
	
	console.log("Parents "+parents);
	var elemsLength = elems.length;		
	for (var i = 0; i < elemsLength; i++) {
		elem = elems[i];
		console.log(elem);
		if (parents==2) {
			elemList.push(elem.parentNode.parentNode);
		} else if (parents==1) {
			elemList.push(elem.parentNode);
		} else {
			elemList.push(elem);
		}
	}
	
	return $(elemList);
	/*
	var noparent = ['thestar.com','twitter.com'],
	length = noparent.length;
	while(length--) {
	   if (document.URL.indexOf(noparent[length])!=-1) {
		   return elems;
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
	*/ 

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
