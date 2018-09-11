function placement_loadPage(){
	alert("load parameters for placement");
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

function addPm(){
	//alert("addPm");
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
function addVm(){
	//alert("addVm");
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
	//alert("clearRow");
}

function calculate(){
	Parser.parameters.CPU0OccupiedCoreNum = document.getElementById("rN0").value;
	Parser.parameters.CPU1OccupiedCoreNum = document.getElementById("rN1").value;
	Parser.parameters.CPU0OccupiedMEM = document.getElementById("rMemn0").value;
	Parser.parameters.CPU1OccupiedMEM = document.getElementById("rMemn1").value;
	Parser.parameters.CloudOSOccupiedDisk = document.getElementById("rDisk").value;
	Parser.parameters.BladeRedundancyRatio = document.getElementById("redundancy").value;
	Parser.parameters.ManagerBladeNum = document.getElementById("bladeNum").value;
	Parser.parameters.DiskType = document.getElementById("stType").value;
	Parser.parameters.DiskArrayNum = document.getElementById("mgNum").value;
	Parser.parameters.PMResource = [];
	Parser.parameters.VMResource = [];
	var tpmTable = document.getElementById("pmTable");
	trows = tpmTable.rows;

	for(var i = 1; i < trows.length; i++ ){
		var trow = trows.item(i);
		//alert(trow.rowIndex);
		var tobj = {
			Category: trow.cells.item(0).innerHTML,
			CPUNumOfBlade: trow.cells.item(1).innerHTML,
			CoreNumOfCPU: trow.cells.item(2).innerHTML,
			vCPUOfCore: trow.cells.item(3).innerHTML,
			MEM: trow.cells.item(4).innerHTML,
			Storage: trow.cells.item(5).innerHTML,
			PMNumber: trow.cells.item(6).innerHTML 
		};
		Parser.parameters.PMResource.push(tobj);
		//tobj.Category = trow.cells.item(0).innerHTML;
		//alert(tobj);
		//console.log(tobj);
	}
	
	var tvmTable = document.getElementById("vmTable");
	vrows = tvmTable.rows;
	
	for (var i = 1; i < vrows.length; i++ ){
		var vrow = vrows.item(i);
		var tobj = {
			VNFType:vrow.cells.item(0).innerHTML,
			VMType:vrow.cells.item(1).innerHTML,
			VMPriority:vrow.cells.item(2).innerHTML,
			VMCore:vrow.cells.item(3).innerHTML,
			VMMemory:vrow.cells.item(4).innerHTML,
			VMStorage:vrow.cells.item(5).innerHTML,
			VMQuantity:vrow.cells.item(6).innerHTML,
			AntiAffinity:vrow.cells.item(7).innerHTML,
			PolicyLevel:vrow.cells.item(8).innerHTML,
			MaxNum:vrow.cells.item(9).innerHTML,
			AntiAffinityGroup:[],//!!!!
			AffinityNUMA: "TRUE"
		};
		Parser.parameters.VMResource.push(tobj);
	}
	
	Placer.run();
}