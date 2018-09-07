

function testParameter(){
	console.log(Parser.parameters);
}
function Parser(){
	/*
		Class for file parsing, to process the uploaded json file and extract parameters. 

		Attributes:
		* files: a file object storing the uploaded json files.
		* parameters: a dictionary storing the parameters parsed from the json file.
		

		Methods:
		* parse: being called when file is uploaded to construct the attributes.
		* ...
	*/
	this.parameters = new Array();
	this.files = "";
	this.parse = function (files){
		this.files = files;
		var file = files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(){
			Parser.parameters = JSON.parse(this.result);
			var parameters = JSON.parse(this.result);
			sessionStorage.setItem("Parser", JSON.stringify(parameters));
			//testParameter();
		}
		alert("Parameters uploaded sucessfully!");
	}
}

Parser = new Parser();
