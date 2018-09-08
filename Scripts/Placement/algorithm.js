function Placement(){
	/*
		Class to implement the vm placement algorithm

		Attributes:
		* paramDic: to store the parsed parameters dictionary
		* vmParam: to store the vm parameters dictionary
		* pmParam: to store the vm parameters dictionary
		* vmRecord: to record the placement process from the vm perspective
		* pmRecord: to record the placement process from the pm perspective

		Methods:
		* setParam: to construct [vmParam] and [pmParam] from [paramDic]
		* placement: to place the VMs on PMs, to fill vmRecord and pmRecord
	*/

	this.paramDic = new Array();
	this.vmParam = new Array();
	this.pmParam = new Array();
	this.vmRecord = new Array();
	this.pmRecord = new Array();

	this.setParam = function(){
		this.paramDic = JSON.parse(sessionStorage.getItem("placement_param"));
		console.log("hello,here");
		console.log(this.paramDic);
		var vmdic = this.paramDic.VMResource;
		for (var i=0; i<vmdic.length; i++){
			var tmpdic = {
				"VMCore":vmdic[i].VMCore,
				"VMMemory":vmdic[i].VMMemory,
				"VMStorage":vmdic[i].VMStorage,
				"VMQuantity":vmdic[i].VMQuantity
			};
			(this.vmParam).push(tmpdic);
		}
		
		var pmdic = this.paramDic.PMResource;
		for (var i=0; i<pmdic.length; i++){
			var tmpdic = {
				"CoreNumOfCPU":pmdic[i].CoreNumOfCPU,
				"CPUNumOfBlade":pmdic[i].CPUNumOfBlade,
				"MEM":pmdic[i].MEM,
				"Storage":pmdic[i].Storage,
				"Core":pmdic[i].CoreNumOfCPU*pmdic[i].CPUNumOfBlade
			};
			this.pmParam.push(tmpdic);
		}
		console.log(this.vmParam);
		console.log(this.pmParam);
	}

	this.place = function(){
		for (var cate=0; cate<this.vmParam.length; cate++){
			for (var re=0; re<this.vmParam[cate].VMQuantity; re++){
				var vm = {	"VMCore":this.vmParam[cate].VMCore,
							"VMMemory":this.vmParam[cate].VMMemory,
							"VMStorage":this.vmParam[cate].VMStorage};
				var flag = false;
				for (var pmindex=0; pmindex<this.pmRecord.length; pmindex++){
					var pmr = this.pmRecord[pmindex];
					if (	pmr.RestCore >= vm.VMCore	
						&&	pmr.RestMemory >= vm.VMMemory
						&&	pmr.RestStorage >= vm.VMStorage){

						// update vmRecord 
						var vmr = { "VMParam":vm,
									"PMIndex":pmindex};
						this.vmRecord.push(vmr);

						// update pmRecord
						pmr.VMList.push(vm);
						pmr.RestCore -= vm.VMCore;
						pmr.RestMemory -= vm.VMMemory;
						pmr.RestStorage -= vm.VMStorage;
						flag = true;
						break;
					}
				}
				if (flag == false){
					// update vmRecord
					var vmr = { "VMParam":vm,
								"PMIndex":this.pmRecord.length};
					this.vmRecord.push(vmr);

					// update pmRecord
					var vmlist = new Array();
					vmlist.push(vm);
					var pmr = {	"PMParam":this.pmParam[0],
								"RestCore":this.pmParam[0].Core-vm.VMCore,
								"RestMemory":this.pmParam[0].MEM-vm.VMMemory,
								"RestStorage":this.pmParam[0].Storage-vm.VMStorage,
								"VMList":vmlist};
					this.pmRecord.push(pmr);
				}
			}
		}
		console.log(this.vmRecord);
		console.log(this.pmRecord);
	}

	this.run = function(){
		this.setParam();
		this.place();

		var parameters = {
			paramDic: this.paramDic,
			vmParam: this.vmParam,
			pmParam: this.pmParam,
			vmRecord: this.vmRecord,
			pmRecord: this.pmRecord
		};

		sessionStorage.setItem("placement_result", JSON.stringify(parameters));
		alert("Placement finish!");
	}
}

Placer = new Placement();