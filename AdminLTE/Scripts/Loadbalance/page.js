
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

function Balance_verify(){
	this.para_v = function(){
		var errormsg = "以下参数有误：\n";var correct = true;
		if(Parser.parameters.vmnumber.large == null ||Parser.parameters.vmnumber.large == "" || isNaN(Parser.parameters.vmnumber.large)){
			errormsg += "vmnumber large(large虚拟机数目)\n";
			correct = false;
		}
		if(Parser.parameters.vmnumber.middle == null ||Parser.parameters.vmnumber.middle == "" || isNaN(Parser.parameters.vmnumber.middle)){
			errormsg += "vmnumber middle(middle虚拟机数目)\n";
			correct = false;
		}
		if(Parser.parameters.vmnumber.small == null ||Parser.parameters.vmnumber.small == "" || isNaN(Parser.parameters.vmnumber.small)){
			errormsg += "vmnumber small(small虚拟机数目)\n";
			correct = false;
		}
		if(Parser.parameters.vmcapacity.large == null ||Parser.parameters.vmcapacity.large == "" || isNaN(Parser.parameters.vmcapacity.large)){
			errormsg += "vmcapacity large(large虚拟机能力)\n";
			correct = false;
		}
		if(Parser.parameters.vmcapacity.middle == null ||Parser.parameters.vmcapacity.middle == "" || isNaN(Parser.parameters.vmcapacity.middle)){
			errormsg += "vmcapacity middle(middle虚拟机能力)\n";
			correct = false;
		}
		if(Parser.parameters.vmcapacity.small == null ||Parser.parameters.vmcapacity.small == "" || isNaN(Parser.parameters.vmcapacity.small)){
			errormsg += "vmcapacity small(small虚拟机能力)\n";
			correct = false;
		}
		if(Parser.parameters.vmstorage.large == null ||Parser.parameters.vmstorage.large == "" || isNaN(Parser.parameters.vmstorage.large)){
			errormsg += "vmstorage large(large虚拟机存储)\n";
			correct = false;
		}
		if(Parser.parameters.vmstorage.middle == null ||Parser.parameters.vmstorage.middle == "" || isNaN(Parser.parameters.vmstorage.middle)){
			errormsg += "vmstorage middle(middle虚拟机存储)\n";
			correct = false;
		}
		if(Parser.parameters.vmstorage.small == null ||Parser.parameters.vmstorage.small == "" || isNaN(Parser.parameters.vmstorage.small)){
			errormsg += "vmstorage small(small虚拟机存储)\n";
			correct = false;
		}
		if(Parser.parameters.tasknumber.urgent == null ||Parser.parameters.tasknumber.urgent == "" || isNaN(Parser.parameters.tasknumber.urgent)){
			errormsg += "tasknumber urgent(紧急任务数量)\n";
			correct = false;
		}
        if(Parser.parameters.tasknumber.normal == null ||Parser.parameters.tasknumber.normal == "" || isNaN(Parser.parameters.tasknumber.normal)){
			errormsg += "tasknumber normal(普通任务数量)\n";
			correct = false;
		}
		if(Parser.parameters.taskmaxlen.urgent == null ||Parser.parameters.taskmaxlen.urgent == "" || isNaN(Parser.parameters.taskmaxlen.urgent)){
			errormsg += "taskmaxlen urgent(紧急任务最大长度)\n";
			correct = false;
		}
        if(Parser.parameters.timelimit == null ||Parser.parameters.timelimit == "" || isNaN(Parser.parameters.timelimit)){
			errormsg += "timelimit(任务到来时间限制)\n";
			correct = false;
		}
		if(Parser.parameters.period == null ||Parser.parameters.period == "" || isNaN(Parser.parameters.period)){
			errormsg += "period(负载均衡周期)\n";
			correct = false;
		}
		if(correct == false){
			errormsg += "请检查参数输入是否正确,如：输入格式不正确，有输入为空等";
			alert(errormsg);
			return -1;
		}
		return 0;
	}
}

var pv = new Balance_verify();

function calculate(){
	//console.log(document.getElementById("vmnuml").value);
	console.log(Parser.parameters);
	Parser.parameters = JSON.parse(balance_para_text);
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
	if(pv.para_v() == 0){
		sessionStorage.setItem("balance_param", JSON.stringify(Parser.parameters));
		//alert(Parser.parameters.VMResource.length);
		Balance.run();
		window.location.href = "loadbalance.html";
	}
	//console.log(Parser.parameters);	
}