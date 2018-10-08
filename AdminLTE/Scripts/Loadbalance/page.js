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
	Parser.parameters.vmnumber.large = document.getElementById("vmnuml").value;
	Parser.parameters.vmnumber.middle = document.getElementById("vmnumm").value;
	Parser.parameters.vmnumber.small = document.getElementById("vmnums").value;
	Parser.parameters.vmcapacity.large = document.getElementById("vmcapl").value;
	Parser.parameters.vmcapacity.middle = document.getElementById("vmcapm").value;
	Parser.parameters.vmcapacity.small = document.getElementById("vmcaps").value;
	Parser.parameters.vmstorage.large = document.getElementById("vmstl").value;
	Parser.parameters.vmstorage.middle = document.getElementById("vmstm").value;
	Parser.parameters.vmstorage.small = document.getElementById("vmsts").value;
	Parser.parameters.tasknumber.urgent = document.getElementById("urgnum").value;
	Parser.parameters.tasknumber.normal = document.getElementById("normalnum").value;
	Parser.parameters.taskmaxlen.urgent = document.getElementById("urgmaxlen").value;
	Parser.parameters.taskmaxlen.normal = document.getElementById("normmaxlen").value;
	Parser.parameters.timelimit = document.getElementById("tlmt").value;
	Parser.parameters.period = document.getElementById("prd").value;
	Parser.parameters.threshold = document.getElementById("thta").value;
	//console.log(Parser.parameters);
	Balance.run();
	window.location.href = "loadbalance.html"
}