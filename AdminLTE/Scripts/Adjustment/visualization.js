function Vadjustor(){
	/*
		Class to visualize the placement algorithm's result.

		Attributes:
		* VMNUM: 1-d array, record number of vms varying with time
		* VMUTL: 1-d array, record resource uitilizaiotn of vms varying with time
		* TASKNUM: 1-d array, record number of tasks varying with time
		* PDTNUM: 1-d array, record predicted number of tasks varyig with time
		* VMREC: 2-d array, for each timepoint record the tasks infomation on each VM
		* beginDate: JS Date object, storing the simulation beginning time
		Methods:
		* initParam: construct attributes from the adjustment result
		* globalShower: show the global information graphs with echart
		* vmShower: show the detail information graph at each timepoint
	*/
	
	this.initParams = function(){
		this.VMNUM = new Array();
		this.VMNUM_UNPRE = new Array();
		this.TASKNUM = new Array();
		this.PDTNUM = new Array();
		this.VMUTL = new Array();
		this.COST = new Array();
		this.COST_UNPRE = new Array();
		this.VMREC = new Array();
		var Adjustor = JSON.parse(sessionStorage.getItem("adjustment_result"));
		this.VMREC = Adjustor.vmrec;
		this.beginDate = new Date();

		var simDate = new Date();
		for (var ind=0; ind<Adjustor.realnum.length; ind++){
			var simNow = simDate.getTime();
			this.TASKNUM.push([simNow, Adjustor.realnum[ind]]);
			this.PDTNUM.push([simNow, Adjustor.pdtres[ind]]);
			this.COST.push([simNow, Adjustor.costres[ind]]);
			this.COST_UNPRE.push([simNow, Adjustor.costres_unpre[ind]]);
			var vminfo = Adjustor.vmrec[ind];
			var vminfo_real = Adjustor.vmrec_real[ind];
			var vminfo_unpre = Adjustor.vmrec_unpre[ind];
			this.VMNUM.push([simNow, vminfo.length]);
			this.VMNUM_UNPRE.push([simNow, vminfo_unpre.length]);
			var totalused = 0;
			var totalres = 0;
			for (var vmind=0; vmind<vminfo_real.length; vmind++){
				totalres += (vminfo_real[vmind].res_used+vminfo_real[vmind].res_avail);
				totalused += vminfo_real[vmind].res_used;
			}
			this.VMUTL.push([simNow, (totalused/totalres).toFixed(4)]);
			simDate.setMinutes(simDate.getMinutes()+5);
		}
	}
	this.globalShower = function(){
		this.initParams();
		var initLen = 20;
		// task number graph
		var taskChart = echarts.init(document.getElementById('taskgraph'), 'light');
		var taskdata = this.TASKNUM.slice(0, Math.min(initLen, this.TASKNUM.length));
		var pdtdata = this.PDTNUM.slice(0, Math.min(initLen+1, this.PDTNUM.length));
		taskoption = {
			title: {text:'任务数量图'},
			legend: {data: ['实际任务数', '预测任务数']},
            xAxis: {
                type: 'time',
                axisTick: {show: false},
                name: "\n\n监测点的实际时间",
                nameLocation: "middle",
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                name: "任务数量",
            },
            tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'}
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
        var vmNdata = this.VMNUM.slice(0, Math.min(initLen, this.VMNUM.length));
        var vmN_unpredata = this.VMNUM_UNPRE.slice(0, Math.min(initLen, this.VMNUM_UNPRE.length));
		vmNoption = {
			title: {text:'虚拟机数量图'},
			legend: {data: ['预测', '非预测']},
            xAxis: {
                type: 'time',
                axisTick: {show: false},
				name: "\n\n监测点的实际时间",
                nameLocation: "middle",
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
				name: "虚拟机数量",
            },
            tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'}
			},
            series: [
            	{
	                type: 'line',
	                name: '预测',
	                data: vmNdata
            	},
            	{
	                type: 'line',
	                name: '非预测',
	                data: vmN_unpredata
            	}
            ]
        };
        vmNChart.setOption(vmNoption);

        // global vm resource ultilization graph
        var vmUChart = echarts.init(document.getElementById('vmUgraph'), 'light');
        var vmUdata = this.VMUTL.slice(0, Math.min(initLen, this.TASKNUM.length));
		vmUoption = {
			title: {text:'虚拟机资源图'},
			legend: {data: ['虚拟机资源']},
            xAxis: {
                /*type: 'value',
                min: 'dataMin',
                max: 'dataMax',*/
                type: 'time',
                axisTick: {show: false},
				name: "\n\n监测点的实际时间",
                nameLocation: "middle",
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                /*min: function(value) {
                	return Math.ceil(0.5*value.min);
                }*/
				name: "利用率"
            },
            tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'}
			},
            series: [{
                type: 'line',
                name: '虚拟机资源',
                data: vmUdata
            }]
        };
        vmUChart.setOption(vmUoption);

        // global cost comparison graph
        var costChart = echarts.init(document.getElementById('costgraph'), 'light');
        var costdata = this.COST.slice(0, Math.min(initLen, this.COST.length));
        var cost_unpredata = this.COST_UNPRE.slice(0, Math.min(initLen, this.COST_UNPRE.length));
		costoption = {
			title: {text:'调整代价对比图'},
			legend: {data: ['预测', '非预测']},
            xAxis: {
                type: 'time',
                axisTick: {show: false},
                name: "\n\n监测点的实际时间",
                nameLocation: "middle",
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                name: "代价",
            },
            tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'}
			},
            series: [{
                type: 'line',
                name: '预测',
                data: costdata
            },
            {
            	type: 'line',
            	name: '非预测',
            	data: cost_unpredata
            }]
        };
        costChart.setOption(costoption);

        if (this.TASKNUM.length > initLen){
        	count = initLen;
	        var intervalID = setInterval(function () {
	            taskdata.shift();
	            taskdata.push(Vadjustor.TASKNUM[count]);
	            // predicted num is advanced by 1 point
	            pdtdata.shift();
	            if (count+1 < Vadjustor.TASKNUM.length){
		            pdtdata.push(Vadjustor.PDTNUM[count+1]);
	            }
	            vmNdata.shift();
	            vmNdata.push(Vadjustor.VMNUM[count]);
	            vmN_unpredata.shift();
	            vmN_unpredata.push(Vadjustor.VMNUM_UNPRE[count]);

	            vmUdata.shift();
	            vmUdata.push(Vadjustor.VMUTL[count]);

	            costdata.shift();
	            costdata.push(Vadjustor.COST[count]);
	            cost_unpredata.shift();
	            cost_unpredata.push(Vadjustor.COST_UNPRE[count]);

	            count += 1;
	            taskChart.setOption({
	                series: [{data: taskdata}, {data: pdtdata}]
	            });
	            vmNChart.setOption({
	            	series: [{data: vmNdata}, {data: vmN_unpredata}]
	            });
	            vmUChart.setOption({
	            	series: [{data: vmUdata}]
	            });
	            costChart.setOption({
	            	series: [{data: costdata}, {data: cost_unpredata}]
	            });
		        if (count == Vadjustor.TASKNUM.length){
		        	console.log(Vadjustor.TASKNUM);
	        		taskChart.setOption({
	                series: [{data: Vadjustor.TASKNUM}, {data: Vadjustor.PDTNUM}]
		            });
		            vmNChart.setOption({
		            	series: [{data: Vadjustor.VMNUM}, {data: Vadjustor.VMNUM_UNPRE}]
		            });
		            vmUChart.setOption({
		            	series: [{data: Vadjustor.VMUTL}]
		            });
		            costChart.setOption({
		            	series: [{data: Vadjustor.COST}, {data: Vadjustor.COST_UNPRE}]
		            });
		            clearInterval(intervalID);
	        	}
	        }, 1000);
        }
	}

	this.vmShower = function(){
		this.initParams();

		var vmDiv = document.getElementById("vmsgraph");
		var nodeList = vmDiv.getElementsByClassName("wljbox");
		for (var ind=nodeList.length-1; ind>=0; ind--){
			vmDiv.removeChild(nodeList[ind]);
		}
		var content = document.getElementById("timerange").value;
		var index = content.indexOf("-");
		var start = parseInt(content.slice(0,index));
		var end = parseInt(content.slice(index+1, content.length));

		for (var time=Math.max(start, 0); time<=Math.min(end, this.VMREC.length); time++){
			
			var divTag = document.createElement("div");
			divTag.setAttribute("class","wljbox");
			vmDiv.appendChild(divTag);
			var vmChart = echarts.init(divTag, 'light');
			var vminfo = this.VMREC[time];
			var xAxisData = new Array();
			var yUsed = new Array();
			var yAvail = new Array();
			for (var ind=0; ind<vminfo.length; ind++){
				xAxisData.push(ind);
				yUsed.push(vminfo[ind].res_used);
				yAvail.push(vminfo[ind].res_avail);
			}

			var gDate = new Date();
			gDate.setTime(this.TASKNUM[time][0]);
			var gTime = [gDate.getMonth(), gDate.getDate()].join('月')
				+ '日 ' +[gDate.getHours(), gDate.getMinutes()].join(':')
			option = {
				title: {text: '第'+time.toString()+'个监测点'},
				legend: {data: ['已用资源', '空余资源']},
	            xAxis: {
	                type: 'category',
	                data: xAxisData,
					name: "\n\n虚拟机",
					nameLocation: "middle",
	            },
	            yAxis: {
	                type: 'value',
	                axisTick: {show: false},
					name: "利用率"
	            },
	            tooltip: {
					trigger: 'axis',
					axisPointer: {type: 'shadow'}
				},
	            series: [{
	                type: 'bar',
	                name: '已用资源',
	                stack: 'sum',
	                data: yUsed
	            },
	            {
	            	type: 'bar',
	            	name: '空余资源',
	            	stack: 'sum',
	            	data: yAvail
	            }]
			};
			vmChart.setOption(option);
		}
	}
}

Vadjustor = new Vadjustor();