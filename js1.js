//starts with el(as in element) to show it's a HTML element
var elInputText = document.getElementById("inputText");
var elInputSubmit = document.getElementById("inputSubmit");
var elOptionsList = document.getElementById("optionsList");

function init(){
	elInputSubmit.addEventListener("click", userInputSubmit, false); //gets the value from input when submit button is clicked, or Enter key is pressed
	
	//autocomplete for input box
	$("#inputText").autocomplete({
			source: function(request, response) {
					$.ajax({
							url: "https://en.wikipedia.org/w/api.php",
							dataType: "jsonp",
							data: {
									'action': "opensearch",
									'format': "json",
									'search': request.term
							},
							success: function(data) {
									response(data[1]);
							}
					});
			},
			
	});
}



function userInputSubmit(event){ //gets the value from input when submit button is clicked, or Enter key is pressed
	event.preventDefault();
	var url = elInputText.value.replace(/[ ]/gi, "%20");
	url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + url + "&srprop=snippet&continue=&callback=?";
	console.log(url);
	$.getJSON(url, printWiki, false); //gets wiki articles and calles printWiki
}

function printWiki(data){ //checks if input is valid, if so, it prints them
	while (elOptionsList.firstChild) { //deletes any articles before printing new ones
   	elOptionsList.removeChild(elOptionsList.firstChild);
	}
	
	if(data.query.search.length === 0){ //if the input was invalid and no article was found
		var div = document.createElement("div");
		var p = document.createElement("p");
		p.innerHTML = "Wrong input";
		div.appendChild(p);
		elOptionsList.appendChild(div);
	} else { //if input was valid, print the list of articles
		for(var i = 0; i < 10; i++){
			var div = document.createElement("div");
			var a = document.createElement("a");
			a.textContent = data.query.search[i].title;
			var url = "https://en.wikipedia.org/wiki/" + data.query.search[i].title;
			a.setAttribute("href", url);
			a.setAttribute("target", "_blank");
			div.appendChild(a);
			var p = document.createElement("p");
			p.innerHTML = data.query.search[i].snippet + "...";
			div.appendChild(p);
			div.setAttribute("class", "option");
			elOptionsList.appendChild(div);
		}
	}
}

//executes when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function(event) {
    init();
});
