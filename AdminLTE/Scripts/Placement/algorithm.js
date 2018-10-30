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
	this.REPEAT = 2000;

	this.setParam = function(){

		this.paramDic = new Array();
		this.vmParam = new Array();
		this.pmParam = new Array();
		this.vmRecord = new Array();
		this.pmRecord = new Array();
		

		this.paramDic = JSON.parse(sessionStorage.getItem("placement_param"));
		console.log(this.paramDic);
		var vmdic = this.paramDic.VMResource;
		for (var i=0; i<vmdic.length; i++){
			var tmpdic = {
				"VMCore":vmdic[i].VMCore,
				"VMMemory":vmdic[i].VMMemory,
				"VMStorage":vmdic[i].VMStorage,
				"VMQuantity":vmdic[i].VMQuantity,
				"VMType":vmdic[i].VMType
			};
			(this.vmParam).push(tmpdic);
		}
		
		var pmdic = this.paramDic.PMResource;
		for (var i=0; i<pmdic.length; i++){
			for (var re=0; re<pmdic[i].PMNumber; re++){
				var tmpdic = {
				"CoreNumOfCPU":pmdic[i].CoreNumOfCPU,
				"CPUNumOfBlade":pmdic[i].CPUNumOfBlade,
				"MEM":pmdic[i].MEM,
				"Storage":pmdic[i].Storage,
				"Core":pmdic[i].CoreNumOfCPU*pmdic[i].CPUNumOfBlade,
				"PMIndex":pmdic[i].Category
				};
				this.pmParam.push(tmpdic);
			}
		}
		console.log(this.vmParam);
		console.log(this.pmParam);
	}

	this.getAnPM = function(){
		if (this.pmParam.length == 0){
			return false;
		}
		var randnum = Math.floor(Math.random()*this.pmParam.length);
		var pmr = {	"PMParam":this.pmParam[randnum],
					"RestCore":this.pmParam[randnum].Core,
					"RestMemory":this.pmParam[randnum].MEM,
					"RestStorage":this.pmParam[randnum].Storage,
					"VMList":new Array()};
		this.pmParam.splice(randnum, 1);
		return pmr;
	}

	this.place = function(){
		for (var cate=0; cate<this.vmParam.length; cate++){
			
			// progress bar controller
			var ratio = cate/(this.vmParam.length-1);
			var proDiv = document.getElementById("progressbar");
			var progress = Number(ratio*100).toFixed(2);
			progress += "%"
			proDiv.style.width = progress;

			for (var re=0; re<this.vmParam[cate].VMQuantity; re++){
				var vm = {	"VMCore":this.vmParam[cate].VMCore,
							"VMMemory":this.vmParam[cate].VMMemory,
							"VMStorage":this.vmParam[cate].VMStorage,
							"VMType":this.vmParam[cate].VMType+'_'+re.toString()};
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

					while (true){
						var pmr = this.getAnPM();
						if (pmr == false){
							alert("The PMs are not enough for VMs!");
							return false;
						}
						if (	pmr.RestCore >= vm.VMCore
							&&	pmr.RestMemory >= vm.VMMemory
							&& 	pmr.RestStorage >= vm.VMStorage){

							pmr.RestCore -= vm.VMCore;
							pmr.RestMemory -= vm.VMMemory;
							pmr.RestStorage -= vm.VMStorage;
							pmr.VMList = vmlist;
							/*var pmr = {	"PMParam":this.pmParam[0],
										"RestCore":this.pmParam[0].Core-vm.VMCore,
										"RestMemory":this.pmParam[0].MEM-vm.VMMemory,
										"RestStorage":this.pmParam[0].Storage-vm.VMStorage,
										"VMList":vmlist};*/

							this.pmRecord.push(pmr);
							break;
						}
					}
				}
			}
		}
		console.log(this.vmRecord);
		console.log(this.pmRecord);
		return true;
	}

	this.deepCopyVM = function(){
		var vmRecord = new Array();
		for (var vmind=0; vmind<this.vmRecord.length; vmind++){
			var vmr = { "VMParam":
							{
								"VMCore": this.vmRecord[vmind].VMParam.VMCore,
								"VMMemory": this.vmRecord[vmind].VMParam.VMMemory,
								"VMStorage": this.vmRecord[vmind].VMParam.VMStorage,
								"VMType": this.vmRecord[vmind].VMParam.VMType,
							},
						"PMIndex": this.vmRecord[vmind].PMIndex
					};
			vmRecord.push(vmr);
		}
		return vmRecord;
	}

	this.deepCopyPM = function(){
		var pmRecord = new Array();
		for(var pmind=0; pmind<this.pmRecord.length; pmind++){
			var pmr = {	
						"PMParam":
							{
								"CoreNumOfCPU": this.pmRecord[pmind].PMParam.CoreNumOfCPU,
								"CPUNumOfBlade": this.pmRecord[pmind].PMParam.CPUNumOfBlade,
								"MEM": this.pmRecord[pmind].PMParam.MEM,
								"Storage": this.pmRecord[pmind].PMParam.Storage,
								"Core": this.pmRecord[pmind].PMParam.Core,
								"PMIndex": this.pmRecord[pmind].PMParam.PMIndex
							},
						"RestCore": this.pmRecord[pmind].RestCore,
						"RestMemory": this.pmRecord[pmind].RestMemory,
						"RestStorage": this.pmRecord[pmind].RestStorage,
						"VMList":new Array()
					};
			for (var re=0; re<this.pmRecord[pmind].VMList.length; re++){
				pmr.VMList.push({	"VMCore": this.pmRecord[pmind].VMList[re].VMCore,
									"VMMemory": this.pmRecord[pmind].VMList[re].VMMemory,
									"VMStorage": this.pmRecord[pmind].VMList[re].VMStorage,
									"VMType": this.pmRecord[pmind].VMList[re].VMType}
								);
			}
			pmRecord.push(pmr);
		}
		return pmRecord;
	}

	this.calcUtil = function(){
		var restResRatio = 0;
		for (var pmind=0; pmind<this.pmRecord.length; pmind++){
			restResRatio += (this.pmRecord[pmind].RestCore/this.pmRecord[pmind].PMParam.Core);
			restResRatio += (this.pmRecord[pmind].RestMemory/this.pmRecord[pmind].PMParam.MEM);
			restResRatio += (this.pmRecord[pmind].RestStorage/this.pmRecord[pmind].PMParam.Storage);
		}
		return restResRatio;
	}

	this.calcBalance = function(){
		var baList = new Array();
		var sum = 0;
		for (var pmind=0; pmind<this.pmRecord.length; pmind++){
			var balance = (this.pmRecord[pmind].RestCore/this.pmRecord[pmind].PMParam.Core)+
			(this.pmRecord[pmind].RestMemory/this.pmRecord[pmind].PMParam.MEM)+
			(this.pmRecord[pmind].RestStorage/this.pmRecord[pmind].PMParam.Storage);
			baList.push(balance);
			sum += balance;
		}
		var result = 0;
		var average = sum/baList.length;
		for (var ind=0; ind<baList.length; ind++){
			result += Math.pow(baList[ind]-average, 2);
		}
		return result;
	}

	this.run = function(){
		
		var minPMLen = 100000000;
		var minRestRatio = 10000000;
		var minBalance = 10000000;
		var bestVMRecordLen = new Array();
		var bestPMRecordLen = new Array();
		var bestVMRecordUtil = new Array();
		var bestPMRecordUtil = new Array();
		var bestVMRecordBala = new Array();
		var bestPMRecordBala = new Array();

		for(var re=0; re<this.REPEAT; re++){
			this.setParam();
			var sucess = this.place();
			if (sucess == false){
				return false;
			}
			if (this.pmRecord.length<minPMLen){
				minPMLen = this.pmRecord.length;
				bestPMRecordLen = this.deepCopyPM();
				bestVMRecordLen = this.deepCopyVM();
			}
			if (this.calcUtil()<minRestRatio){
				minRestRatio = this.calcUtil();
				bestPMRecordUtil = this.deepCopyPM();
				bestVMRecordUtil = this.deepCopyVM();
			}
			if (this.calcBalance()<minBalance){
				minBalance = this.calcBalance();
				bestPMRecordBala = this.deepCopyPM();
				bestVMRecordBala = this.deepCopyVM();
			}
		}
		var parameters = {
			"MIN_PM_NUM": 	{
								vmRecord: bestVMRecordLen,
								pmRecord: bestPMRecordLen
							},
			"MAX_RES_UTIL": {
								vmRecord: bestVMRecordUtil,
								pmRecord: bestPMRecordUtil
							},
			"BEST_BALANCE": {
								vmRecord: bestVMRecordBala,
								pmRecord: bestPMRecordBala
							}

		};
		sessionStorage.setItem("placement_result", JSON.stringify(parameters));
		alert("Placement finish!");
		return true;
	}
}

Placer = new Placement();