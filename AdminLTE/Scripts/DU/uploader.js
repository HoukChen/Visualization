function Uploader(){
	/*
		Class to upload the adjustment result and show the result graphs.

		Attribute:
		* ...

		Methods:
		* upload: upload the result file and show the result with echarts.
	*/
	this.upload = function (files){
		this.files = files;
		var file = files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(){
			var parameters = JSON.parse(this.result);
			sessionStorage.setItem("du_result", JSON.stringify(parameters));
		}
		alert("Result file uploaded sucessfully!");
		location.reload();
	}
}

Uploader = new Uploader();