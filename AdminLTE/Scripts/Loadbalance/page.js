function balance_loadPage(){
	alert("load parameters for load balance");
	//console.log("aaa");
	var para = Parser.parameters;
	console.log(para);
	document.getElementById("vmnuml").value = para.vmnumber.large;
	document.getElementById("vmnumm").value = para.vmnumber.middle;
	document.getElementById("vmnums").value = para.vmnumber.small;
	document.getElementById("vmcapl").value = para.vmcapacity.large;
	document.getElementById("vmcapm").value = para.vmcapacity.middle;
	document.getElementById("vmcaps").value = para.vmcapacity.small;
	document.getElementById("vmstl").value = para.vmstorage.large;
	document.getElementById("vmstm").value = para.vmstorage.middle;
	document.getElementById("vmsts").value = para.vmstorage.small;
	document.getElementById("urgnum").value = para.tasknumber.urgent;
	document.getElementById("normalnum").value = para.tasknumber.normal;
	document.getElementById("urgmaxlen").value = para.taskmaxlen.urgent;
	document.getElementById("normmaxlen").value = para.taskmaxlen.normal;
	document.getElementById("tlmt").value = para.timelimit;
	document.getElementById("prd").value = para.period;
	document.getElementById("thta").value = para.threshold;
}

function calculate(){
	
}