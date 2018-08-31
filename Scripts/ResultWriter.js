function Writer(){
	/*
		Class to wirte the placement result into local files.

		Attribute:
		* ...

		Methods:
		* write: save the placement result as json files and download it
	*/
	this.write = function(){
		var Placer = JSON.parse(sessionStorage.getItem("Placer"));
		var result = {
			"vmRecord":Placer.vmRecord,
			"pmRecord":Placer.pmRecord,
		};
	    var vmResult = JSON.stringify(result);
	    var eleLink = document.createElement('a');
	    eleLink.download = "vmResult.json";
	    eleLink.style.display = 'none';
	    var blob = new Blob([vmResult]);
	    eleLink.href = URL.createObjectURL(blob);
	    document.body.appendChild(eleLink);
	    eleLink.click();
	    document.body.removeChild(eleLink);
	}
}

Writer = new Writer();