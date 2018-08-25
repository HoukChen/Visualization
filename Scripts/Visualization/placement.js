function Vplacer(){
	/*
		Class to visualize the placement algorithm's result.

		Attributes:
		*... 
		Methods:
		* pmConf: generate configuration data suitable for [pmShower].
		* pmShower: show the placement result of a given pm by echart.
		* globalConf: generate configuration data suitable for [globalShower].
		* numShower: show the number of vms of all pms by echart.
		* utilShower: show the resuorce utilization of all pms by echart.
		* globalShower: main function for [numShower] and [utilShower].
	*/

	this.pmConf = function(index){
		var pm = Placer.pmRecord[index];
		var vmlist = pm['VMList'];
		var series = new Array();
		var legend = new Array();
		for (var vmindex=0; vmindex<vmlist.length; vmindex++){
			var data = [ (vmlist[vmindex].VMCore/pm.PMParam.Core), 
						 (vmlist[vmindex].VMMemory/pm.PMParam.MEM), 
						 (vmlist[vmindex].VMStorage/pm.PMParam.Storage)
						];
			console.log(data);

			var element = {
							name : '虚拟机'+String(vmindex),
							type :'bar', 
							data : data, 
							stack : 'same',
							label: {formatter: function(params){
								var content = (String((params.value*100).toFixed(2))+' %');
								return content;
							}},
							emphasis: {label:{show: true}}
						};
			series.push(element);
			legend.push('虚拟机'+String(vmindex));
			console.log(legend);
		}
		var echartConf = {
			series: series,
			legend: {data: legend},
			pm: pm
		};
		return echartConf;
	}

	this.pmShower = function(){
		var pmindex = document.getElementById("choice").value;
		console.log(parseInt(pmindex));
		var conf = this.pmConf(parseInt(pmindex));
		var vmlist = conf.pm['VMList'];
		var pm = conf.pm;
		echarts.dispose(document.getElementById("pmresult"));
		var pmChart = echarts.init(document.getElementById('pmresult'), 'light');
		var option = {
			title: {text:'物理机资源分布图'},
			legend: conf.legend,
			xAxis: {
				type: 'value',
				axisTick: {show: false},
				axisLine: {show: false},
				axisLabel:{formatter:function(value){return (String(value*100)+' %')}}
			},
			yAxis: {
				type: 'category', 
				axisTick: {show: false},
				axisLine: {show: false},
				data: ['核心数','内存大小','存储容量']
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'},
				formatter: function(params){
					var content = params[0].name+'信息: <br/>';
					var pmResource = '';
					var pmRatio = '';
					console.log(params);
					for (var index=0; index<params.length; index++){
						content += ('* ' + params[index].seriesName + ': ');
						if (params[index].name == '核心数'){
							content += (String(vmlist[index].VMCore) + '个 <br/>');
							pmResource = (String(pm.PMParam.Core)+'个');
							pmRatio = String((100*(pm.PMParam.Core-pm.RestCore)/pm.PMParam.Core).toFixed(2))+' %';
						}
						else if (params[index].name == '内存大小'){
							content += (String(vmlist[index].VMMemory)+'GB <br/>');
							pmResource = (String(pm.PMParam.MEM)+' GB');
							pmRatio = String((100*(pm.PMParam.MEM-pm.RestMemory)/pm.PMParam.MEM).toFixed(2))+' %';
						}
						else if (params[index].name == '存储容量'){
							content += (String(vmlist[index].VMStorage)+'GB <br/>');
							pmResource = (String(pm.PMParam.Storage)+' GB');
							pmRatio = String((100*(pm.PMParam.Storage-pm.RestStorage)/pm.PMParam.Storage).toFixed(2))+' %';
						}
					}
					content += ('物理机'+params[0].name+'总量: '+pmResource+'  利用率: ' + pmRatio);
					return content;
				}
			},
			series: conf.series
		};
		pmChart.setOption(option);
	}

	this.globalConf = function(){
		var pm = Placer.pmRecord;
		var dataAxis = new Array();
		var num = new Array();
		var util = new Array();
		for (var pmindex=0; pmindex<pm.length; pmindex++){
			dataAxis.push(pmindex);
			num.push(pm[pmindex]['VMList'].length);

			var uCPU = 1 - pm[pmindex].RestCore/pm[pmindex].PMParam.Core;
			var uMEM = 1 - pm[pmindex].RestMemory/pm[pmindex].PMParam.MEM;
			var uSTO = 1 - pm[pmindex].RestStorage/pm[pmindex].PMParam.Storage;
			util.push((uCPU+uMEM+uSTO)/3);
		}
		var echartConf = {
			dataAxis: dataAxis,
			num: num,
			util: util
		};
		return echartConf;

	}

	this.numShower = function(){
		var conf = this.globalConf();
		var globalChart = echarts.init(document.getElementById('gresult1'), 'light');
		var option = {
			title: {text:'所有物理机上虚拟机数量图'},
			xAxis: {
				data: conf.dataAxis,
				axisTick: {show: false},
				axisLine: {show: false}
			},
			yAxis: {
				axisTick: {show: false},
				axisLine: {show: false}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'},
				formatter: function(params){
					return params[0].data;
				}
			},
			dataZoom: [{type:'inside'}],
			series: [
				{
					type: 'bar',
					data:  conf.num

				}
			]
		};
		var zoomSize = 8;
		globalChart.on('click', function (params) {
			globalChart.dispatchAction({
				type: 'dataZoom',
				startValue: conf.dataAxis[Math.max(params.dataIndex-zoomSize/2, 0)],
				endValue: conf.dataAxis[Math.min(params.dataIndex+zoomSize/2, conf.data.length-1)]
			});
		});
		globalChart.setOption(option);
	}

	this.utilShower = function(){
		var conf = this.globalConf();
		var globalChart = echarts.init(document.getElementById('gresult2'), 'light');
		var option = {
			title: {text:'所有物理机资源利用率图'},
			xAxis: {
				data: conf.dataAxis,
				axisTick: {show: false},
				axisLine: {show: false}
			},
			yAxis: {
				axisTick: {show: false},
				axisLine: {show: false}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'},
				formatter: function(params){
					var content = (String((params[0].data*100).toFixed(2))+' %');
					return content;
				}
			},
			dataZoom: [{type:'inside'}],
			series: [
				{
					type: 'bar',
					data:  conf.util
				}
			]
		};
		var zoomSize = 8;
		globalChart.on('click', function (params) {
			globalChart.dispatchAction({
				type: 'dataZoom',
				startValue: conf.dataAxis[Math.max(params.dataIndex-zoomSize/2, 0)],
				endValue: conf.dataAxis[Math.min(params.dataIndex+zoomSize/2, conf.num.length-1)]
			});
		});
		globalChart.setOption(option);
	}

	this.globalShower = function(){
		this.numShower();
		this.utilShower();
	}
} 

Vplacer = new Vplacer();
