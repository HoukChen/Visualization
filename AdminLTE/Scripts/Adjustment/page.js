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
function calculate(){
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
	Adjustor.run();
}