
function Task(number,tarrive,priority){
	this.num = number;
	this.tarr = tarrive;
	this.pr = priority;
	this.tend = -0.1;
}

function Vm(vmid,max_num,capacity, load0, num0){
	this.vid = vmid;
	this.num = 0;
	this.load = 0;
	this.maxnum = max_num;
	this.cap = capacity;
	this.jobq = new Array();
	this.finishtime = new Number(-1);
	this.addjob = function(j){
		//console.log("addjob");
		this.jobq.push(j);
		this.num += j.num;
		this.load = this.num / this.cap;
		j.tend = j.tarr + (Math.round( this.load * 10) / 10);
		this.finishtime = this.tarr + this.load;
	}
	this.calload = function(){
		this.load = this.num / this.cap;
		return this.load;
	}
}


function Balance(){

	/*
		Class for the balance algorithm

		Attributes:
		* 

		Methods:
		* 
	*/
	this.Taskq = new Array();
	this.Vmq = new Array();
	this.WRRT = new Array();
	this.LBFT = new Array();
	this.WLCT = new Array();
	this.LOAD = new Array();
	this.TASKS = new Array();
	this.para = null;
	this.Th = 0.2;
	this.sortfunc0 = function(a,b){ return a.tarr - b.tarr }
	this.initialize = function(){
		/*
			initial vms
		*/
		console.log("initialstart");
		this.para = Parser.parameters;
		this.Taskq.length = 0;
		this.Vmq.length = 0;
		this.Th = this.para.threshold;
		
		for(var i = 0; i < this.para.vmnumber.large ; i++ ){
			//console.log(i);
			var vmid = "vml" + i;
			this.Vmq.push(new Vm(vmid,this.para.vmstorage.large,this.para.vmcapacity.large,new Number(0),new Number(0)));
		}
		for(var i = 0; i < this.para.vmnumber.middle ; i++ ){
			var vmid = "vmm" + i;
			this.Vmq.push(new Vm(vmid,this.para.vmstorage.middle,this.para.vmcapacity.middle,new Number(0),new Number(0)));
		}
		for(var i = 0; i < this.para.vmnumber.small ; i++ ){
			var vmid = "vms" + i;
			this.Vmq.push(new Vm(vmid,this.para.vmstorage.small,this.para.vmcapacity.small,new Number(0),new Number(0)));
		}
		/*
			initial tasks
		*/
		for(var i = 0; i < this.para.tasknumber.urgent; i++ ){
			var rnum = (0.5 + Math.random()*0.5) * this.para.taskmaxlen.urgent;
			var rarrt = Math.round(Math.random() * this.para.timelimit * 10)/10;
			this.Taskq.push(new Task(rnum,rarrt,1));
		}
		for(var i = 0; i < this.para.tasknumber.normal; i++ ){
			var rnum = (0.5 + Math.random()*0.5) * this.para.taskmaxlen.normal;
			var rarrt = Math.round(Math.random() * this.para.timelimit * 10)/10;
			this.Taskq.push(new Task(rnum,rarrt,0));
		}
		this.Taskq.sort(this.sortfunc0);
		//console.log(this.Vmq);
	}
	
	
	this.sortfunc1 = function(a,b){ return a.load - b.load; }
	this.sortfunc2 = function(a,b){ return b.load - a.load; }//降序
	
	this.loadbalance = function(clk){
		var ll_list = new Array();
		var ol_list = new Array();
		var tr_list = new Array();
		var sumload = 0.0;
		var maxload = 0.0;
		var minload = 1.0e9;
		var vl = this.Vmq.length;
		for (var i = 0;i < this.Vmq.length; i++){
			var tvm = this.Vmq[i];
			sumload += tvm.load;
			if(tvm.load > maxload){ maxload = tvm.load; }
			if(tvm.load < minload){ minload = tvm.load; }
		}
		var avgload = sumload / vl;
		var det = 0.0;
		for (var i = 0;i < this.Vmq.length; i++){
			var ti = this.Vmq[i];
			det += (ti.load - avgload)*(ti.load - avgload);
		}
		det /= vl;
		det = Math.sqrt(det);
		if(det > this.Th * 100){
			var theta = Math.abs(avgload * (maxload - minload) / (2 * maxload));
			var esub = avgload - theta;
			var etop = avgload + theta;
			for(var i = 0; i < this.Vmq.length ; i++){
				var j = this.Vmq[i];
				if(j.load < esub){ll_list.push(j); }
				if(j.load > etop){ol_list.push(j); }
			}
			ll_list.sort(this.sortfunc2);
			ol_list.sort(this.sortfunc1);
			for(var j = 0;j < ol_list.length;j++){
				var i = ol_list[j];
				var tq = i.jobq;
				var re_list = new Array();
				while(tq.length != 0){
					tj = tq.shift();			
					if(i.load > etop){
						tr_list.push(tj);
					}else{
						re_list.push(tj);
					}
					i.num -= tj.num;
					i.calload();
				}
				i.finishtime = clk;
				for(var jj = 0;jj < re_list.length ; jj++){
					var tjob = re_list[jj];
					i.addjob(tjob);
				}
			}
			tr_list.sort(this.sortfunc2);
			for(var j = 0; j < tr_list.length ; j++ ){
				var i = tr_list[j];
				var flg = false;
				for(var kj = 0; kj < ll_list.length ; kj++){
					var k = ll_list[kj];
					if(i.num <= k.maxnum - k.num){
						k.addjob(i);
						flg = true;
						break;
					}
				}
				if(!flg && ll_list.length > 0 ){
					console.log("overload");
					ll_list[0].addjob(i);
				}
				ll_list.sort(this.sortfunc2);
			}
		}
	}
	
	this.start = function(mode){
		this.initialize();
		var jl = this.Taskq.length;
		console.log(jl);
		var vl = this.Vmq.length;
		clock = 0.0;
		var pvt = 0;
			
		for(var j = 0 ; j < jl; j++ ){
			console.log(j);
			var tmpj = this.Taskq[j];
			//console.log(tmpj);
			var tmpv = this.Vmq[pvt];
			//console.log(tmpv);
			if(clock != tmpj.tarr || j == jl - 1){
				this.LOAD.push(tmpj.num);
				var tpsby = Math.round((tmpj.tarr - clock) * 10)/10;
				//console.log("tpsby");
				//console.log(tpsby);
				clock = tmpj.tarr;
				//console.log(clock);
				//this.LOAD[clock * 10] += tmpj.num;
				
				for(var jj = 0; jj < vl; jj++ ){
					var tvm = this.Vmq[jj];
					//console.log("*");
					//console.log(tvm);
					var tq = tvm.jobq;
					while(tq.length > 0){
						var thj = tq.shift();
						if(thj.tend >= clock){
							break;
						}
					}
					tvm.num -= tpsby * tvm.cap;
					if(tvm.num < 0){
						tvm.num = 0;
					}
					tvm.calload();
				}
				
			}
				
			if(mode == 2 && j % this.para.period / 2 == 0){
				//this.Taskq.sort(this.sortfunc1);
				pvt = 0;
			}
			var cnt = 0;
			//console.log(tmpv);
			while(tmpj.num > tmpv.maxnum - tmpv.num && cnt < vl ){
				if(mode == 2){
					pvt = (pvt + 1)%vl;
				}else{
					pvt = (pvt + 7)%vl;
				}
				tmpv = this.Vmq[pvt];
				//console.log(tmpv);
				cnt++;
			}
			if(tmpj.num <= tmpv.maxnum - tmpv.num){
				tmpv.addjob(tmpj);
				pvt = (pvt + 71) % vl;
			}else{
				console.log("overload");
				tmpv.addjob(tmpj);
			}
			if(j % this.para.period == 0){
				if(mode == 1){
					this.loadbalance();
				}
			}
		}
		console.log("ok");
		
	}
	
	
	this.calavgtime = function(){
		avgt = 0.0;
		avgt0 = 0.0;
		avgt1 = 0.0;
		uunum = 0;
		unum = 0;
		for(var i =0 ; i < this.Taskq.length ;i++){
			var ti = this.Taskq[i];
			avgt += ti.tend - ti.tarr;
		}
		avgt /= this.Taskq.length;
		return avgt;
	}
	
	this.dobalance = function(){
		for(var i = 0;i < 9; i++ ){
			// progress bar controller
			var ratio = i/8;
			var proDiv = document.getElementById("progressbar");
			var progress = Number(ratio*100).toFixed(2);
			progress += "%"
			proDiv.style.width = progress;
			this.para.tasknumber.urgent = 500 * i;
			this.para.tasknumber.normal = 500 * i;
			for(var j = 0;j < 3; j++ ){
				//if(j == 1){continue;}
				this.start(j); 	
				if(j == 0){this.WRRT.push(this.calavgtime());}
				if(j == 1){this.LBFT.push(this.calavgtime());}
				if(j == 2){this.WLCT.push(this.calavgtime());}
			}
		}
		//dobalance();
	}
	
	this.run = function(){
		this.initialize();
		console.log(this.Vmq);
		if(this.TASKS.length == 0){
			for(var i = 0; i < this.para.timelimit * 10; i++ ){
				this.TASKS.push(0);
			}
			for(var i = 0 ;i < this.Taskq.length; i++ ){
				var itsk = this.Taskq[i];
				this.TASKS[itsk.tarr*10] ++ ;
			}
		}
		dobalance();
		var parameters = {
			wrrt: this.WRRT,
			lbft: this.LBFT,
			wlct: this.WLCT,
			load: this.LOAD,
			tasks: this.TASKS
		}
		console.log("houk++++++");
		var proDiv = document.getElementById("progressbar");
		console.log(proDiv);
		proDiv.style.width = "10%";
		sessionStorage.setItem("balance_result", JSON.stringify(parameters));
		alert("balance finish!");
	}
	
}

Balance = new Balance();
