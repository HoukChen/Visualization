function placement_loadPage(){
	alert("Load parameters for placement");
	console.log(Parser.parameters);
	var para = Parser.parameters;
	document.getElementById("rN0").value = para.CPU0OccupiedCoreNum;
	document.getElementById("rN1").value = para.CPU1OccupiedCoreNum;
	document.getElementById("rMemn0").value = para.CPU0OccupiedMEM;
	document.getElementById("rMemn1").value = para.CPU1OccupiedMEM;
	document.getElementById("rDisk").value = para.CloudOSOccupiedDisk;
	document.getElementById("redundancy").value = para.BladeRedundancyRatio;
	document.getElementById("bladeNum").value = para.ManagerBladeNum;
	document.getElementById("stType").value = para.DiskType;
	document.getElementById("mgNum").value = para.DiskArrayNum;
	var pmTab = document.getElementById("pmTable");
	for (pnm in para.PMResource){
		var pm = para.PMResource[pnm];
		//console.log(pm);
		var pmRow = pmTab.insertRow(1);
		var cell0 = pmRow.insertCell(0);
		var cell1 = pmRow.insertCell(1);
		var cell2 = pmRow.insertCell(2);
		var cell3 = pmRow.insertCell(3);
		var cell4 = pmRow.insertCell(4);
		var cell5 = pmRow.insertCell(5);
		var cell6 = pmRow.insertCell(6);
		var cell7 = pmRow.insertCell(7);
		cell0.innerHTML = pm.Category;
		cell1.innerHTML = pm.CPUNumOfBlade;
		cell2.innerHTML = pm.CoreNumOfCPU;
		cell3.innerHTML = pm.vCPUOfCore;
		cell4.innerHTML = pm.MEM;
		cell5.innerHTML = pm.Storage;
		cell6.innerHTML = pm.PMNumber;
		cell7.innerHTML = "删除";
		cell7.setAttribute("onclick", "pmDeleteRow(this)");		
	} 
	
	var vmTab = document.getElementById("vmTable");
	for (vnm in para.VMResource){
		var vm = para.VMResource[vnm];
		var vmRow = vmTab.insertRow(1);
		var cell0 = vmRow.insertCell(0);
		var cell1 = vmRow.insertCell(1);
		var cell2 = vmRow.insertCell(2);
		var cell3 = vmRow.insertCell(3);
		var cell4 = vmRow.insertCell(4);
		var cell5 = vmRow.insertCell(5);
		var cell6 = vmRow.insertCell(6);
		var cell7 = vmRow.insertCell(7);
		var cell8 = vmRow.insertCell(8);
		var cell9 = vmRow.insertCell(9);
		var cell10 = vmRow.insertCell(10);
		var cell11 = vmRow.insertCell(11);
		cell0.innerHTML = vm.VNFType;
		cell1.innerHTML = vm.VMType;
		cell2.innerHTML = vm.VMPriority;
		cell3.innerHTML = vm.VMCore;
		cell4.innerHTML = vm.VMMemory;
		cell5.innerHTML = vm.VMStorage;
		cell6.innerHTML = vm.VMQuantity;
		cell7.innerHTML = vm.AntiAffinity;
		cell8.innerHTML = vm.PolicyLevel;
		cell9.innerHTML = vm.MaxNum;
		//cell10.innerHTML = vm.VNFType;
		cell11.innerHTML = "删除"; 
		cell11.setAttribute("onclick","vmDeleteRow(this)");
		
	}
}

function Placement_verify(){
	this.addpm_v = function(){
		if(document.getElementById("pmType").value == ""||document.getElementById("pmType").value == null){
			alert("pm类型不能为空");
			return -1;
		}
		if(document.getElementById("pmNuma").value == ""||document.getElementById("pmNuma").value == null|| isNaN(document.getElementById("pmNuma").value)){
			alert("numa输入不合法");
			return -1;
		}
		if(document.getElementById("pmKernel").value == ""||document.getElementById("pmKernel").value == null|| isNaN(document.getElementById("pmKernel").value)){
			alert("核心数输入不合法");
			return -1;
		}
		if(document.getElementById("pmThread").value == ""||document.getElementById("pmThread").value == null|| isNaN(document.getElementById("pmThread").value)){
			alert("线程数输入不合法");
			return -1;
		}
		if(document.getElementById("pmMemory").value == ""||document.getElementById("pmMemory").value == null|| isNaN(document.getElementById("pmMemory").value)){
			alert("内存输入不合法");
			return -1;
		}
		if(document.getElementById("pmNum").value == ""||document.getElementById("pmNum").value == null|| isNaN(document.getElementById("pmNum").value)){
			alert("物理机数量输入不合法");
			return -1;
		}
		return 0;
	}
	this.addvm_v = function(){
		if(document.getElementById("vnfType").value == ""||document.getElementById("vnfType").value == null){
			alert("vnf类型不能为空");
			return -1;
		}
		if(document.getElementById("vmType").value == ""||document.getElementById("vmType").value == null){
			alert("vm类型不能为空");
			return -1;
		}
		if(document.getElementById("vmPr").value == ""||document.getElementById("vmPr").value == null|| isNaN(document.getElementById("vmPr").value)){
			alert("虚拟机优先级输入不合法");
			return -1;
		}
		if(document.getElementById("vCPU").value == ""||document.getElementById("vCPU").value == null|| isNaN(document.getElementById("vCPU").value)){
			alert("vCPU输入不合法");
			return -1;
		}
		if(document.getElementById("vmRam").value == ""||document.getElementById("vmRam").value == null || isNaN(document.getElementById("vmRam").value)){
			alert("虚拟机内存输入不合法");
			return -1;
		}
		if(document.getElementById("vmRom").value == ""||document.getElementById("vmRom").value == null || isNaN(document.getElementById("vmRom").value)){
			alert("虚拟机存储输入不合法");
			return -1;
		}
		if(document.getElementById("vmNum").value == ""||document.getElementById("vmNum").value == null || isNaN(document.getElementById("vmNum").value)){
			alert("虚拟机数量输入不合法");
			return -1;
		}
		if(document.getElementById("vmZf").value != "TRUE"||document.getElementById("vmZf").value != "FALSE"){
			alert("自反亲和输入不合法");
			return -1;
		}
		if(document.getElementById("vmCtglevel").value == ""||document.getElementById("vmCtglevel").value == null|| isNaN(document.getElementById("vmCtglevel").value)){
			alert("策略级别输入不合法");
			return -1;
		}
		if(document.getElementById("vmMaxnum").value == ""||document.getElementById("vmMaxnum").value == null|| isNaN(document.getElementById("vmMaxnum").value)){
			alert("虚拟机最大数量不合法");
			return -1;
		}
		return 0;
	}
	this.para_v = function(){
		var errormsg = "以下参数有误：\n";var correct = true;
		if((Parser.parameters.CPU0OccupiedCoreNum != 0)&&(Parser.parameters.CPU0OccupiedCoreNum == null ||Parser.parameters.CPU0OccupiedCoreNum == "" || isNaN(Parser.parameters.CPU0OccupiedCoreNum))){
			errormsg += "CPU0OccupiedCoreNum(预留核N0)\n";
			correct = false;
		}
		if((Parser.parameters.CPU1OccupiedCoreNum != 0)&&(Parser.parameters.CPU1OccupiedCoreNum == null ||Parser.parameters.CPU1OccupiedCoreNum == "" || isNaN(Parser.parameters.CPU1OccupiedCoreNum))){
			errormsg += "CPU1OccupiedCoreNum(预留核N1)\n";
			correct = false;
		}
		if((Parser.parameters.CPU0OccupiedMEM != 0)&&(Parser.parameters.CPU0OccupiedMEM == null ||Parser.parameters.CPU0OccupiedMEM == "" || isNaN(Parser.parameters.CPU0OccupiedMEM))){
			errormsg += "CPU0OccupiedMEM(预留内存N0)\n";
			correct = false;
		}
		if((Parser.parameters.CPU1OccupiedMEM != 0)&&(Parser.parameters.CPU1OccupiedMEM == null ||Parser.parameters.CPU1OccupiedMEM == "" || isNaN(Parser.parameters.CPU1OccupiedMEM))){
			errormsg += "CPU1OccupiedMEM(预留内存N1)\n";
			correct = false;
		}
		if((Parser.parameters.CloudOSOccupiedDisk != 0)&&(Parser.parameters.CloudOSOccupiedDisk == null ||Parser.parameters.CloudOSOccupiedDisk == "" || isNaN(Parser.parameters.CloudOSOccupiedDisk))){
			errormsg += "CloudOSOccupiedDisk(预留硬盘)\n";
			correct = false;
		}
		if(Parser.parameters.ManagerBladeNum == null ||Parser.parameters.ManagerBladeNum == "" || isNaN(Parser.parameters.ManagerBladeNum)){
			errormsg += "ManagerBladeNum(集群单板数)\n";
			correct = false;
		}
		if(Parser.parameters.BladeRedundancyRatio == null ||Parser.parameters.BladeRedundancyRatio == "" || isNaN(Parser.parameters.BladeRedundancyRatio)){
			errormsg += "BladeRedundancyRatio(冗余比)\n";
			correct = false;
		}
		if(Parser.parameters.DiskType == null ||Parser.parameters.DiskType == ""){
			errormsg += "DiskType(存储类型)\n";
			correct = false;
		}
		if(Parser.parameters.DiskArrayNum == null||Parser.parameters.DiskArrayNum == ""|| isNaN(Parser.parameters.DiskArrayNum)){
			errormsg += "DiskArrayNum(磁阵数量))\n";
			correct = false;
		}
		if(Parser.parameters.PMResource == null || Parser.parameters.PMResource == ""){
			errormsg += "PMResource(物理机列表)\n";
			correct = false;
		}
		if(Parser.parameters.VMResource == null || Parser.parameters.VMResource == ""){
			errormsg += "VMResource(虚拟机列表)\n";
			correct = false;
		}
		if(correct == false){
			errormsg += "请检查参数输入是否正确,如：输入格式不正确，有输入为空等";
			alert(errormsg);
			return -1;
		}
		return 0;
	}
	this.re_v = function(){
		
	}
}
var pv = new Placement_verify();

function addPm(){
	//alert("addPm");
	if(pv.addpm_v()==0){
		var pmTab = document.getElementById("pmTable");
		var pmRow = pmTab.insertRow(1);
		pmRow.insertCell(0).innerHTML = document.getElementById("pmType").value;
		var cell1 = pmRow.insertCell(1);
		var cell2 = pmRow.insertCell(2);
		var cell3 = pmRow.insertCell(3);
		var cell4 = pmRow.insertCell(4);
		var cell5 = pmRow.insertCell(5);
		var cell6 = pmRow.insertCell(6);
		var cell7 = pmRow.insertCell(7);
		cell1.innerHTML = document.getElementById("pmType").value;
		cell2.innerHTML = document.getElementById("pmNuma").value;
		cell3.innerHTML = document.getElementById("pmKernel").value;
		cell4.innerHTML = document.getElementById("pmThread").value;
		cell5.innerHTML = document.getElementById("pmMemory").value;
		cell6.innerHTML = document.getElementById("pmNum").value;
		cell7.innerHTML = "删除";
		cell7.setAttribute("onclick", "pmDeleteRow(this)");	
	}
	
}
function addVm(){
	//alert("addVm");
	if(pv.addvm_v()==0){
		var vmTab = document.getElementById("vmTable");
		var vmRow = vmTab.insertRow(1);
		var cell0 = vmRow.insertCell(0);
		var cell1 = vmRow.insertCell(1);
		var cell2 = vmRow.insertCell(2);
		var cell3 = vmRow.insertCell(3);
		var cell4 = vmRow.insertCell(4);
		var cell5 = vmRow.insertCell(5);
		var cell6 = vmRow.insertCell(6);
		var cell7 = vmRow.insertCell(7);
		var cell8 = vmRow.insertCell(8);
		var cell9 = vmRow.insertCell(9);
		var cell10 = vmRow.insertCell(10);
		var cell11 = vmRow.insertCell(11);
		cell0.innerHTML = document.getElementById("vnfType").value;
		cell1.innerHTML = document.getElementById("vmType").value;
		cell2.innerHTML = document.getElementById("vmPr").value;
		cell3.innerHTML = document.getElementById("vCPU").value;
		cell4.innerHTML = document.getElementById("vmRam").value;
		cell5.innerHTML = document.getElementById("vmRom").value;
		cell6.innerHTML = document.getElementById("vmNum").value;
		cell7.innerHTML = document.getElementById("vmZf").value;
		cell8.innerHTML = document.getElementById("vmCtglevel").value;
		cell9.innerHTML = document.getElementById("vmMaxnum").value;
		//cell10.innerHTML = document.getElementById("vmQh").value;
		cell11.innerHTML = "删除"; 
		cell11.setAttribute("onclick","vmDeleteRow(this)");
	}else{
		
	}
}

function pmDeleteRow(dRow){
	if(confirm("确定删除?")){
		var di = dRow.parentNode.rowIndex;
		document.getElementById("pmTable").deleteRow(di);
	}
}
function vmDeleteRow(dRow){
	if(confirm("确定删除?")){
		var di = dRow.parentNode.rowIndex;
		document.getElementById("vmTable").deleteRow(di);
	}
}




function clearRow(){
	document.getElementById("pmType").value = "";
	document.getElementById("pmNuma").value = "";
	document.getElementById("pmKernel").value = "";
	document.getElementById("pmThread").value = "";
	document.getElementById("pmMemory").value = "";
	document.getElementById("pmNum").value = "";
	document.getElementById("pmDisk").value = "";
	document.getElementById("vnfType").value = "";
	document.getElementById("vmPr").value = "";
	document.getElementById("vCPU").value = "";
	document.getElementById("vmRam").value = "";
	document.getElementById("vmRom").value = "";
	document.getElementById("vmNum").value = "";
	document.getElementById("vmMaxnum").value = "";
	document.getElementById("vmZf").value = "";
	document.getElementById("vmCtglevel").value = "";
	document.getElementById("vmType").value = "";
	document.getElementById("vmQh").value = "";
	document.getElementById("vmGrp").value = "";
	document.getElementById("vmEfc").value = "";
	//alert("clearRow");
}

function calculate(){
	Parser.parameters = JSON.parse(placement_para_text);
	Parser.parameters.CPU0OccupiedCoreNum = parseInt(document.getElementById("rN0").value);
	Parser.parameters.CPU1OccupiedCoreNum =  parseInt(document.getElementById("rN1").value);
	Parser.parameters.CPU0OccupiedMEM =  parseInt(document.getElementById("rMemn0").value);
	Parser.parameters.CPU1OccupiedMEM =  parseInt(document.getElementById("rMemn1").value);
	Parser.parameters.CloudOSOccupiedDisk =  parseInt(document.getElementById("rDisk").value);
	Parser.parameters.BladeRedundancyRatio =  parseInt(document.getElementById("redundancy").value);
	Parser.parameters.ManagerBladeNum =  parseInt(document.getElementById("bladeNum").value);
	Parser.parameters.DiskType = document.getElementById("stType").value;
	Parser.parameters.DiskArrayNum =  parseInt(document.getElementById("mgNum").value);
	Parser.parameters.PMResource = [];
	Parser.parameters.VMResource = [];
	var tpmTable = document.getElementById("pmTable");
	trows = tpmTable.rows;

	for(var i = 1; i < trows.length; i++ ){
		var trow = trows.item(i);
		//alert(trow.rowIndex);
		var tobj = {
			Category: trow.cells.item(0).innerHTML,
			CPUNumOfBlade: parseInt(trow.cells.item(1).innerHTML),
			CoreNumOfCPU: parseInt(trow.cells.item(2).innerHTML),
			vCPUOfCore: parseInt(trow.cells.item(3).innerHTML),
			MEM: parseInt(trow.cells.item(4).innerHTML),
			Storage: parseInt(trow.cells.item(5).innerHTML),
			PMNumber: parseInt(trow.cells.item(6).innerHTML) 
		};
		Parser.parameters.PMResource.push(tobj);
	}
	
	var tvmTable = document.getElementById("vmTable");
	vrows = tvmTable.rows;
	
	for (var i = 1; i < vrows.length; i++ ){
		var vrow = vrows.item(i);
		var tobj = {
			VNFType:vrow.cells.item(0).innerHTML,
			VMType:vrow.cells.item(1).innerHTML,
			VMPriority:parseInt(vrow.cells.item(2).innerHTML),
			VMCore:parseInt(vrow.cells.item(3).innerHTML),
			VMMemory:parseInt(vrow.cells.item(4).innerHTML),
			VMStorage:parseInt(vrow.cells.item(5).innerHTML),
			VMQuantity:parseInt(vrow.cells.item(6).innerHTML),
			AntiAffinity:vrow.cells.item(7).innerHTML,
			PolicyLevel:vrow.cells.item(8).innerHTML,
			MaxNum:parseInt(vrow.cells.item(9).innerHTML),
			AntiAffinityGroup:[],//!!!!
			AffinityNUMA: "TRUE"
		};
		Parser.parameters.VMResource.push(tobj);
	}
	//console.log(placement_verify);
	//pv.para_v();
	if(pv.para_v() == 0){
		console.log(Parser.parameters);
		sessionStorage.setItem("placement_param", JSON.stringify(Parser.parameters));
		var ttv = JSON.parse(sessionStorage.getItem("placement_param"));
		console.log(ttv);
		//alert(Parser.parameters.VMResource.length);
		
		if (Placer.run()){
			window.location.href = "placement.html"
		}
		else{
			return false;
		}

	}
	
}

function uploadAndshow(ufile){
	Uploader.upload(ufile);
	Vplacer.globalShower();
}