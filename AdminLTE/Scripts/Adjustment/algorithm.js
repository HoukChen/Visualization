/*
	ml.js - Machine learning tools in JavaScript, https://github.com/mljs/ml
	<script src="https://www.lactame.com/lib/ml/3.3.0/ml.min.js"></script>
*/
function Adjsutment(){

	/*
		Class for the adjustment algorithm

		Attributes:
		* 

		Methods:
		* 
	*/
}


function VirtualMachine(resource){
	/*
		class for virtual machines, where to place the tasks
	
		Attributes:
		* res_total: total resource of the virtual machine
		* res_avail: available resuorce of the virtual machine
		* tasklist: list of the tasks placed on the vrtual machine
		* flag: decide whether this virtual machine is needed to be closed

		Methods:
		* addTask: add a new task on the vritual machine
		* removeTask: remove a specific task on the virtual machine
		* enlargeRes: enlarge the resource of the virtual machine
		* narrowRes: narrow the resource of the virtual machine
	*/

	this.res_total = resource;
	this.res_avail = resource;
	this.tasklist = new Array();
	this.flag = true;

	this.addTask = function(task){
		this.tasklist.push(task);
		this.res_avail -= task.taskcap;
	}

	this.removeTask =function(index){
		this.res_avail += (this.tasklist[index]).taskcap;
		this.tasklist.splice(index,1);
	}

	this.enlargeRes = function(resource){
		this.res_avail = this.res_avail + (resource - this.res_total);
		this.res_total = resource;
	}

	this.narrowRes = function(resource){
		this.res_avail = this.res_avail - (this.res_total - resource);
		this.res_total = resource;
	}
}


function Task(stime, etime, taskcap){
	/*
		class for tasks

		Attributes:
		* stime: starting time of the task
		* etime: ending time of the task
		* taskcap: resource requirements of the task
	*/
	this.stime = stime;
	this.etime = etime;
	this.taskcap = taskcap;
}


function Generator(fluct, sinmagn, basemagn, taskspan, simspan){

	/*
		class for task generating scheme

		Attributes:
		* TaskList: a 2-dim list, with simulation time as index and a task list as value
		* TaskNum: a list, with task number of different time
		* fluct: alternative values interval of the poisson distribution
		* sinmagn: magnitude of the sin function to simulate task number
		* basemagn: base task number
		* taskspan: maximum simspan of each task

		Methods:
		* tool_factorial: tool function, to calculate factorial
		* poisson: poisson distribution simulation function
		* generateTask: task generating function, to fill [TaskList] and [TaskNum]
	*/

	this.TaskList = new Array();
	this.TaskNum = new Array();
	this.fluct = fluct;
	this.sinmagn = sinmagn;
	this.basemagn = basemagn;
	this.taskspan = taskspan;
	this.simspan = simspan;
	this.begintime = 50;

	this.tool_factorial = function(num){
		var result = 1;
		for(var ind=1; ind<=num; ind++){
			result *= ind;
		}
		return result;
	}

	this.tool_poisson = function(gamma, k){
		return (gamma**k)*((Math.E)**(-gamma))/this.tool_factorial(k);
	}

	this.poisson = function(pmean){

		// calculate possibility for alternative values
		var vset = new Array();
		var pset = new Array();
		var psum = 0 ;
		var vlow = Math.ceil((1-this.fluct)*pmean);
		var vhigh = Math.ceil((1+this.fluct)*pmean);
		for (var ind=vlow; ind<vhigh; ind++){
			vset.push(ind);
			var possib = this.tool_poisson(pmean,ind);
			pset.push(possib);
			psum += possib;
		}

		// normalizaiton for possibilities
		for (var ind=0; ind<pset.length; ind++){
			pset[ind] /= psum;
		}
		for (var ind=1; ind<pset.length; ind++){
			pset[ind] += pset[ind-1];
		}

		var randnum = Math.random();
		var possnum = 0;
		for (var ind=0; ind<pset.length; ind++){
			if (randnum < pset[ind]){
				possnum = vset[ind];
				break;
			}
		}
		return possnum;
	}

	this.generateTask = function(){
		for (var re=0; re<this.begintime+this.simspan+this.taskspan; re++){
			this.TaskNum.push(0);
		}
		for (var stime=0; stime<this.begintime+this.simspan; stime++){
			var sinnum = this.sinmagn*Math.abs(Math.sin(stime*Math.PI/(12*60)));
			var taskmean = Math.ceil(sinnum+this.basemagn);
			var tasklist = new Array();
			var tasknum = this.poisson(taskmean);
			for (var re=0; re<tasknum; re++){
				var etime = stime + Math.random()*this.taskspan;
				var task = new Task(stime, etime, 1);
				tasklist.push(task);
				for (var time=stime; time<etime; time++){
					this.TaskNum[time] += 1;
				}
			}
			this.TaskList.push(tasklist);
		}
	}
}


function Simulator(TaskList, TaskNum, VMParams){
	/*
		class for dynamic adjustment simulation

		Attributes:
		* VMList: a list of virtual machine, where to place the existing tasks
		* TaskList: a 2-dim list, with simulation time as index and a task list as value
		* TaskNum: a list, with task number of different time 
		* Params: a dictionary for the parameters of virtual machines with differemt scale
	
		Methods:
		* removeTask: check the finished tasks and remove them 
		* placeTask: place the new coming tasks on the virtual machines in VMList
		* reduceVM: check the empty virtual machines and remove them
		* enlargeVM: actively enlarge the virtual machines after prediction
		* narrowVM: actively narrow the virtual machines after the prediction 
	*/

	this.reddcost = 1;
	this.srvcost = 2;
	this.srvtime = 3;
	this.VMList = new Array();
	this.TaskList = TaskList;
	this.TaskNum = TaskNum;
	this.Params = VMParams;

	this.initialize = function(){
		for (var re=0; re<1; re++){
			var svm = new VirtualMachine(this.Params.small);
			this.VMList.push(svm);
			
			var mvm = new VirtualMachine(this.Params.middle);
			this.VMList.push(mvm);
			var lvm = new VirtualMachine(this.Params.large);
			this.VMList.push(lvm);
		}
	}

	this.removeTask = function(time){

		for (var vmindex=0; vmindex<this.VMList.length; vmindex++){
			var vm = this.VMList[vmindex];
			for (var ind=vm.tasklist.length-1; ind>=0; ind--){
				if (vm.tasklist[ind].etime < time){
					vm.removeTask(ind);
				}
			}
		}
	}

	this.placeTask = function(time){
		var totalres = 0;
		for (var vmindex=0; vmindex<this.VMList.length; vmindex++){
			totalres += (this.VMList[vmindex]).res_total;
		}
		var cost = 0;
		if (this.TaskNum[time] < totalres){
			cost = (totalres - this.TaskNum[time]) * 5 * this.reddcost;
		}
		else{
			cost = (this.TaskNum[time] - totalres) * this.srvcost * this.srvtime;
		}

		// try to place tasks on vms
		for (var ind=0; ind<(this.TaskList[time]).length; ind++){
			var task = this.TaskList[time][ind];
			var flag = true;
			for (var vmind=0; vmind<this.VMList.length; vmind++){
				var vm = this.VMList[vmind];
				if (vm.res_avail >= task.taskcap){
					vm.addTask(task);
					flag = false;
					break;
				}
			}

			// enlarge the small vms to midlle scale
			if (flag == true){
				for (var vmind=0; vmind<this.VMList.length; vmind++){
					var vm = this.VMList[vmind];
					if (vm.res_total == this.Params['small']){
						vm.enlargeRes(this.Params['middle']);
						vm.addTask(task);
						flag = false;
						break;
					}
				}
			}

			// enlarge the middle vms to large scale
			if (flag == true){
				for (var vmind=0; vmind<this.VMList.length; vmind++){
					var vm = this.VMList[vmind];
					if (vm.res_total == this.Params['middle']){
						vm.enlargeRes(this.Params['large']);
						vm.addTask(task);
						flag = false;
						break;
					}
				}
			}

			// start new small scale vms
			if (flag == true){
				vm = new VirtualMachine(this.Params['small']);
				vm.addTask(task);
				this.VMList.push(vm);
			}
		}
		return cost;
	}

	this.reduceVM = function(){
		for (var vmindex=this.VMList.length-1; vmindex>=0; vmindex--){
			var vm = this.VMList[vmindex];
			if (vm.res_avail == vm.res_total){
				this.VMList.splice(vmindex, 1);
			}
		}
	}

	this.enlargeVM = function(increment){
		var totalrest = 0;
		for (var vmind=0; vmind<this.VMList.length; vmind++){
			var vm = this.VMList[vmind];
			totalrest += vm.res_avail;
		}
		if (totalrest <= increment){
			var newRes = increment - totalrest;
			
			// enlarge existing vms first
			for (var vmind=0; vmind<this.VMList.length; vmind++){
				var vm = this.VMList[vmind];
				if (vm.res_total == this.Params['small']){
					vm.enlargeRes(this.Params['large']);
					newRes -= (this.Params['large'] - this.Params['small']);
					if (newRes <= 0){break;}
				}
			}
			
			// if can not be satisfied, then start more vms
			if (newRes > 0){
				var largenum = Math.floor(newRes / this.Params['large']);
				var middlenum = Math.floor((newRes%this.Params['large'])/this.Params['middle']);
				var smallnum = Math.floor(((newRes%this.Params['large'])%this.Params['middle'])/this.Params['small']);
				if (((newRes%this.Params['large'])%this.Params['middle'])%this.Params['small'] != 0){
					smallnum += 1;
				}
				for (var re=0; re<largenum; re++){
					var vm = new VirtualMachine(this.Params['large']);
					this.VMList.push(vm);
				}
				for (var re=0; re<middlenum; re++){
					var vm = new VirtualMachine(this.Params['middle']);
					this.VMList.push(vm);
				}
					
				for (var re=0; re<smallnum; re++){
					var vm = new VirtualMachine(this.Params['small']);
					this.VMList.push(vm);
				}
			}
		}
		return true;
	}

	this.narrowVM = function(){
		for (var vmind=0; vmind<this.VMList.length; vmind++){
			var vm = this.VMList[vmind];
			if ((vm.res_total - vm.res_avail) <= this.Params['small']){
				vm.narrowRes(this.Params['small']);
			}
			else if ((vm.res_total - vm.res_avail) <= this.Params['middle']){
				vm.narrowRes(this.Params['middle']);
			}
		}
		return true;
	}

}



function Predictor(TaskNum, modelname){
	/*
		class for task number prediction

		Attributes:
		* category: task category, user task or data task
		* model: predicting model

		Methods:
		* tool_mean: get the mean value of an array
		* getFeature: function for feature construction

	*/
	this.TaskNum = TaskNum;
	this.modelname = modelname;

	this.tool_mean = function(array){
		var sum = 0;
		for (var ind=0; ind<array.length; ind++){
			sum += array[ind];
		}
		return sum/(array.length);
	}
	this.getFeature = function(timelist){
		var train_X = new Array();
		var train_Y = new Array();
		for (var timeind=0; timeind<timelist.length; timeind++){
			var time = timelist[timeind];
			var feature = new Array();
			for (var index=1; index<10; index++){
				feature.push(this.TaskNum[time-index]);
			}
			var m_last10 = this.tool_mean(this.TaskNum.slice(time-10,time));
			var m_last20 = this.tool_mean(this.TaskNum.slice(time-20,time));
			var m_last30 = this.tool_mean(this.TaskNum.slice(time-30,time));
			feature.push(m_last10);
			feature.push(m_last20);
			feature.push(m_last30);
			feature.push(time);

			train_X.push(feature);
			train_Y.push(this.TaskNum[time]);
		}
		var data = {
			features: train_X,
			labels: train_Y
		};
		return data;
	}

	this.trainModel = function(time){
		/*
			TODO(houk): needed to be modified, (data.features, data.labels)
		*/
		var timelist = new Array();
		for(var index=time-50; index<time; index++){
			timelist.push(index);
		}
		var data = this.getFeature(timelist);
		if (this.modelname == "RFR"){
			var options = {
				seed: 3,
				maxFeatures: 1,
				replacement: false,
				nEstimators: 200
			};
			console.log(data);
			var model = new ML.RandomForestRegression(options);
			model.train(data.features, data.labels);
			var pdata = this.getFeature([time]);
			var predvalue = Math.round(model.predict(pdata.features));
			console.log(predvalue);
			var value = this.TaskNum[time-1];
			return (predvalue-value);
		}
	}
}

function Adjustor(){

	this.COSTRES = new Array();
	this.PDTRES = new Array();
	this.REALNUM = new Array();

	this.run = function(){
		var Params = JSON.parse(sessionStorage.getItem("adjustment_parameter"));
		var GRT = new Generator(Params.fluct, Params.sinmagn, Params.basemagn, Params.taskspan, Params.simspan);
		GRT.generateTask();

		var SIM = new Simulator(GRT.TaskList, GRT.TaskNum, Params.vmscale);
		SIM.initialize();

		var PDT = new Predictor(GRT.TaskNum, "RFR");
		
		var VMREC = new Array();
		for (var time=GRT.begintime; time<GRT.begintime+Params.simspan; time++){

			// progress bar controller
			var ratio = (time-GRT.begintime)/(GRT.begintime+Params.simspan-GRT.begintime-1);
			var proDiv = document.getElementById("progressbar");
			var progress = Number(ratio*100).toFixed(2);
			progress += "%";
			proDiv.style.width = progress;

			SIM.removeTask(time);
			var cost = SIM.placeTask(time);
			this.COSTRES.push(cost);
			SIM.reduceVM();
			
			var vminfo = new Array();
			for (var vmind=0; vmind<SIM.VMList.length; vmind++){
				var vm = SIM.VMList[vmind];
				var resinfo = {
					res_used: vm.res_total-vm.res_avail,
					res_avail: vm.res_avail
				};
				vminfo.push(resinfo);
			}
			VMREC.push(vminfo);

			// var increment = PDT.trainModel(time+1);
			increment = 3;
			
			this.PDTRES.push(increment+SIM.TaskNum[time]);
			if (increment>0){
				SIM.enlargeVM(increment);
			}
			else{
				SIM.narrowVM();
			}
			this.REALNUM.push(SIM.TaskNum[time+1]);
		}
		
		var parameters = {
			costres: this.COSTRES,
			pdtres: this.PDTRES,
			realnum: this.REALNUM,
			vmrec: VMREC
		}

		sessionStorage.setItem("adjustment_result", JSON.stringify(parameters));
		alert("Algorithm finish!");

		console.log(this.COSTRES);
		console.log(this.PDTRES);
		console.log(this.REALNUM);
		console.log(VMREC);
	}	
}

Adjustor = new Adjustor();

