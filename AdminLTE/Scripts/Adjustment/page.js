var dic = [];
dic["RFR"] = "随机森林回归";
dic["IR"] = "线性回归";
dic["DTR"] = "决策树回归";
dic["NCR"] = "最近邻回归";
dic["随机森林回归"] = "RFR";
dic["线性回归"] = "IR";
dic["决策树回归"] = "DTR";
dic["最近邻回归"] = "NCR";


function adjustment_loadPage(){
	alert("load parameters for adjustment");
	//console.log("aaa");
	var para = Parser.parameters;
	console.log(para);
	document.getElementById("vmLarge").value = para.vmscale.large;
	document.getElementById("vmMiddle").value = para.vmscale.middle;
	document.getElementById("vmSmall").value = para.vmscale.small;
	document.getElementById("baseTasknum").value = para.basemagn;
	document.getElementById("maxTasknum").value = para.sinmagn;
	document.getElementById("taskMaxtime").value = para.taskspan;
	document.getElementById("taskFluct").value = para.fluct;
	document.getElementById("algoTime").value = para.simspan;
	
	var slct = document.getElementById("algoSelect");
	var tmdl = para.model;
	tmdl = dic[tmdl];
	for(soption in slct.options){
		if(slct.options[soption].value == tmdl){
			slct.selectedIndex = soption;
		}
	}
	
}

function Adjustment_verify(){
	
	this.para_v = function(){
		var errormsg = "以下参数有误：\n";var correct = true;
		if(Parser.parameters.vmscale.large == null ||Parser.parameters.vmscale.large == "" || isNaN(Parser.parameters.vmscale.large)){
			errormsg += "vmscale large(large虚拟机规模)\n";
			correct = false;
		}
		if(Parser.parameters.vmscale.middle == null ||Parser.parameters.vmscale.middle == "" || isNaN(Parser.parameters.vmscale.middle)){
			errormsg += "vmscale middle(middle虚拟机规模)\n";
			correct = false;
		}
		if(Parser.parameters.vmscale.small == null ||Parser.parameters.vmscale.small == "" || isNaN(Parser.parameters.vmscale.small)){
			errormsg += "vmscale small(small虚拟机规模)\n";
			correct = false;
		}
		if(Parser.parameters.fluct == null ||Parser.parameters.fluct == "" || isNaN(Parser.parameters.fluct)||Parser.parameters.fluct < 0||Parser.parameters.fluct > 1){
			errormsg += "fluct(任务量波动范围):0-1\n";
			correct = false;
		}
		if(Parser.parameters.basemagn == null ||Parser.parameters.basemagn == "" || isNaN(Parser.parameters.basemagn)){
			errormsg += "basemag(基础任务量)\n";
			correct = false;
		}
		if(Parser.parameters.sinmagn == null ||Parser.parameters.sinmagn == "" || isNaN(Parser.parameters.sinmagn)){
			errormsg += "sinmagn(峰值任务量)\n";
			correct = false;
		}
		if(Parser.parameters.simspan == null ||Parser.parameters.simspan == "" || isNaN(Parser.parameters.simspan)){
			errormsg += "simspan(任务最大时长)\n";
			correct = false;
		}
		if(Parser.parameters.taskspan == null ||Parser.parameters.taskspan == "" || isNaN(Parser.parameters.taskspan)){
			errormsg += "taskspan(算法模拟时长)\n";
			correct = false;
		}
		if(Parser.parameters.model == null ||Parser.parameters.model == "" ){
			errormsg += "model(模型选择)\n";
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
var pv = new Adjustment_verify();

function calculate(){
	Parser.parameters = JSON.parse(adjustment_para_text);
	Parser.parameters.vmscale = {
		large: document.getElementById("vmLarge").value,
		middle: document.getElementById("vmMiddle").value,
		small:document.getElementById("vmSmall").value
	}
	Parser.parameters.fluct = document.getElementById("taskFluct").value;
	Parser.parameters.basemagn = document.getElementById("baseTasknum").value;
	Parser.parameters.sinmagn = document.getElementById("maxTasknum").value;
	Parser.parameters.simspan = document.getElementById("algoTime").value;
	Parser.parameters.taskspan = document.getElementById("taskMaxtime").value;
	var slct = document.getElementById("algoSelect");
	//console.log(slct.options[slct.selectedIndex]);
	Parser.parameters.model = dic[slct.options[slct.selectedIndex].innerHTML];
	//alert(Parser.parameters.model);
	Parser.parameters.fluct = document.getElementById("taskFluct").value;
	console.log(Parser.parameters);
	if(pv.para_v() == 0){
		sessionStorage.setItem("adjustment_parameter", JSON.stringify(Parser.parameters));
		Adjustor.run();
		window.location.href = "adjustment.html";
	}
}