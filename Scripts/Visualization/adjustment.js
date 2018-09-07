function Vadjustor(){
	/*
		Class to visualize the placement algorithm's result.

		Attributes:
		* VMNUM: 1-d array, record number of vms varying with time
		* VMUTL: 1-d array, record resource uitilizaiotn of vms varying with time
		* TASKNUM: 1-d array, record number of tasks varying with time
		* PDTNUM: 1-d array, record predicted number of tasks varyig with time
		* VMREC: 2-d array, for each timepoint record the tasks infomation on each VM
		
		Methods:
		* initParam: construct attributes from the adjustment result
		* globalShower: show the global information graphs with echart
		* vmShower: show the detail information graph at each timepoint
	*/
	
	this.initParams = function(){
		this.VMNUM = new Array();
		this.TASKNUM = new Array();
		this.PDTNUM = new Array();
		this.VMUTL = new Array();
		this.COST = new Array();
		this.VMREC = new Array();
		var Adjustor = JSON.parse(sessionStorage.getItem("Adjustor"));
		
		this.VMREC = Adjustor.vmrec;
		for (var ind=0; ind<Adjustor.realnum.length; ind++){
			this.TASKNUM.push([ind, Adjustor.realnum[ind]]);
			this.PDTNUM.push([ind, Adjustor.pdtres[ind]]);
			this.COST.push([ind, Adjustor.costres[ind]]);

			var vminfo = Adjustor.vmrec[ind];
			this.VMNUM.push([ind, vminfo.length]);
			var totalused = 0;
			var totalres = 0;
			for (var vmind=0; vmind<vminfo.length; vmind++){
				totalres += (vminfo[vmind].res_used+vminfo[vmind].res_avail);
				totalused += vminfo[vmind].res_used;
			}
			this.VMUTL.push([ind, totalused/totalres]);
		}
	}
	this.globalShower = function(){
		this.initParams();
		var initLen = 20;
		// task number graph
		var taskChart = echarts.init(document.getElementById('taskgraph'), 'light');
		var taskdata = this.TASKNUM.slice(0, Math.min(initLen, this.TASKNUM.length));
		var pdtdata = this.PDTNUM.slice(0, Math.min(initLen, this.PDTNUM.length));
		taskoption = {
			title: {text:'任务数量图'},
			legend: {data: ['实际任务数', '预测任务数']},
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                axisTick: {show: false},
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                /*min: function(value) {
                	return Math.ceil(0.5*value.min);
                }*/
            },
            series: [{
                type: 'line',
                name: '实际任务数',
                data: taskdata
            },
            {
            	type: 'line',
            	name: '预测任务数',
            	data: pdtdata
            }]
        };
        taskChart.setOption(taskoption);

        // global vm number graph
        var vmNChart = echarts.init(document.getElementById('vmNgraph'), 'light');
        var vmNdata = this.VMNUM.slice(0, Math.min(initLen, this.TASKNUM.length));
		vmNoption = {
			title: {text:'虚拟机数量图'},
			legend: {data: ['虚拟机数量']},
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                axisTick: {show: false},
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                /*min: function(value) {
                	return Math.ceil(0.5*value.min);
                }*/
            },
            series: [{
                type: 'line',
                name: '虚拟机数量',
                data: vmNdata
            }]
        };
        vmNChart.setOption(vmNoption);

        // global vm resource ultilization graph
        var vmUChart = echarts.init(document.getElementById('vmUgraph'), 'light');
        var vmUdata = this.VMUTL.slice(0, Math.min(initLen, this.TASKNUM.length));
		vmUoption = {
			title: {text:'虚拟机资源图'},
			legend: {data: ['虚拟机资源']},
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                axisTick: {show: false},
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                /*min: function(value) {
                	return Math.ceil(0.5*value.min);
                }*/
            },
            series: [{
                type: 'line',
                name: '虚拟机资源',
                data: vmUdata
            }]
        };
        vmUChart.setOption(vmUoption);

        if (this.TASKNUM.length > initLen){
        	count = initLen;
	        var intervalID = setInterval(function () {
	            taskdata.shift();
	            taskdata.push(Vadjustor.TASKNUM[count]);
	            pdtdata.shift();
	            pdtdata.push(Vadjustor.PDTNUM[count]);
	            vmNdata.shift();
	            vmNdata.push(Vadjustor.VMNUM[count]);
	            vmUdata.shift();
	            vmUdata.push(Vadjustor.VMUTL[count]);
	            count += 1;
	            taskChart.setOption({
	                series: [{data: taskdata}, {data: pdtdata}]
	            });
	            vmNChart.setOption({
	            	series: [{data: vmNdata}]
	            });
	            vmUChart.setOption({
	            	series: [{data: vmUdata}]
	            });
		        if (count == Vadjustor.TASKNUM.length){
	        	clearInterval(intervalID);}
	        }, 1000);
        }
	}

	this.vmShower = function(){

	}
}

Vadjustor = new Vadjustor();