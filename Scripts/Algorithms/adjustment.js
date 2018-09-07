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
		this.res_avail += this.tasklist[index].taskcap;
		this.tasklist.splice(index,1);
	}

	this.enlargeRes = function(resource){
		this.res_avail = this.res_avail + (resource - self.res_total);
		this.res_total = resource;
	}

	this.narrowRes = function(resource){
		this.res_avail = this.res_avail - (this.res_total - resouce);
		this.res_total = resouce;
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


function Generator(pmean, fluct, sinmagn, basemagn, taskspan){
	/*
		class for task generating scheme

		Attributes:
		* TaskList: a 2-dim list, with simulation time as index and a task list as value
		* TaskNum: a list, with task number of different time
		* fluct: alternative values interval of the poisson distribution
		* sinmagn: magnitude of the sin function to simulate task number
		* basemagn: base task number
		* taskspan: maximum timespan of each task

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
		var vhigh = MAth.ceil((1+this.fluct)*pmean);
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
		for (var stime=0; stime<this.timespan; stime++){
			var sinnum = this.sinmagn*abs(Math.sin(stime*Math.PI/(12*60)));
			var taskmean = Math.ceil(sinnum+this.basemagn);
			var tasklist = new Array();
			var tasknum = this.poisson(taskmean);
			for (var re=0; re<tasknum; re++){
				var etime = stime + Math.randrom()*this.taskspan;
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


function Simulator(TaskList, TaskNum){
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
	this.Params = {
		large: 12,		
		middle: 8,
		small: 4
	};

	this.removeTask = function(time){
		for (var vmindex=0; vmindex<VMList.lenght; vmindex++){
			var vm = VMList[vmindex];
			for (var ind=vm.tasklist.length-1; ind>=0; ind--){
				if (vm.tasklist[ind].etime < time){
					vm.removeTask(index);
				}
			}
		}
	}

	this.placeTask = function(time){
		var totalres = 0;
		for (var vmindex=0; vmindex<VMList.length; vmindex++){
			totalres += VMList[vmindex].res_total;
		}
		var cost = 0;
		if (this.TaskNum[time] < totalres){
			cost = (totalres - TaskNum[time]) * 5 * this.reddcost;
		}
		else{
			cost = (TaskNum[time] - totalres) * this.srvcost * this.srvtime;
		}

		// try to place tasks on vms
		for (var task in this.TaskList[time]){
			var flag = true;
			for (var vm in this.VMList){
				if (vm.res_avail >= task.taskcap){
					vm.addTask(task);
					flag = false;
					break;
				}
			}

			// enlarge the small vms to midlle scale
			if (flag == true){
				for (vm in this.VMList){
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
				for (vm in this.VMList){
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
				this.VMList.append(vm);
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
		for (var vm in this.VMList){
			totalrest += vm.res_avail;
		}
		if (totalrest <= increment){
			var newRes = increment - totalrest;
			
			// enlarge existing vms first
			for (var vm in this.VMList){
				if (vm.res_avail == this.Params['small']){
					vm.enlargeRes(this.Params['large']);
					newRes -= (this.Params['large'] - this.Params['small']);
					if (newRes <= 0){break;}
				}
			}
			
			// if can not be satisfied, then start more vms
			if (newRes > 0){
				var largenum = newRes / this.Params['large'];
				var middlenum = (newRes%this.Params['large'])/this.Params['middle'];
				var smallnum = ((newRes%this.Params['large'])%this.Params['middle'])/this.Params['small'];
				if (((newRes%this.Params['large'])%this.Params['middle'])%this.Params['small'] != 0){
					smallnum += 1;
				}
				for (var re=0; re<largenum; re++){
					var vm = VirtualMachine(self.Params['large']);
					self.VMList.append(vm);
				}
				for (var re=0; re<middle; re++){
					var vm = VirtualMachine(self.Params['middle']);
					self.VMList.append(vm);
				}
					
				for (var re=0; re<middle; re++){
					var vm = VirtualMachine(self.Params['small']);
					self.VMList.append(vm);
				}
			}
		}
		return true;
	}

	this.narrowVM = function(){
		for (vm in this.VMList){
			if ((vm.res_total - vm.res_avail) <= this.Params['small']){
				vm.narrowRes(this.Params['small']);
			}
			else if ((vm.res_total - vm.res_avail) <= this.Params['middle']){
				vm.narrowRes(self.Params['middle']);
			}
		}
		return true;
	}

}


function Predictor(){
	/*
		class for task number prediction

		Attributes:
		* category: task category, user task or data task
		* model: predicting model
	
	*/

}