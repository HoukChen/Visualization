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
		var result = JSON.parse(sessionStorage.getItem("placement_result"));
		var pm = result.pmRecord[index];
		var vmlist = pm['VMList'];
		var series = new Array();
		var legend = new Array();
		for (var vmindex=0; vmindex<vmlist.length; vmindex++){
			var data = [ (vmlist[vmindex].VMCore/pm.PMParam.Core), 
						 (vmlist[vmindex].VMMemory/pm.PMParam.MEM), 
						 (vmlist[vmindex].VMStorage/pm.PMParam.Storage)
						];

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
		}
		var echartConf = {
			series: series,
			legend: {data: legend},
			pm: pm
		};
		return echartConf;
	}

	

	this.pmShower = function(){

		var content = document.getElementById("pmrange").value;
		var index = content.indexOf("-");
		var start = parseInt(content.slice(0,index));
		var end = parseInt(content.slice(index+1, content.length));
		var result = JSON.parse(sessionStorage.getItem("placement_result"));
		for (var pmind=Math.max(start, 0); pmind<=Math.min(end, result.pmRecord.length); pmind++){

			var conf = this.pmConf(parseInt(pmind));
			var vmlist = conf.pm['VMList'];
			var pm = conf.pm;
			var PMParam = conf.pm.PMParam;
			// echarts.dispose(document.getElementById("pmresult"));
			// var pmChart = echarts.init(document.getElementById('pmresult'), 'light');
			var divTag = document.createElement("div");
			/*
			divTag.style.width = "40%";
			divTag.style.height = "300px";
			*/
			divTag.setAttribute("class","wljbox");
			document.getElementById("pmresult").appendChild(divTag);
			var pmChart = echarts.init(divTag, 'light');
			var ttitle = 'No.' + pmind;
			var option = {
				title: {text:ttitle},
				legend: conf.legend,
				xAxis: {
					type: 'value',
					axisTick: {show: false},
					axisLine: {show: false},
					axisLabel: {formatter: function(value){return (String(value*100)+' %')}}
				},
				yAxis: {
					type: 'category', 
					axisTick: {show: false},
					axisLine: {show: false},
					data: ['核心数:'+PMParam.Core+' 个','内存大小:'+PMParam.MEM+' GB','存储容量:'+PMParam.Storage+' GB'],
					axisLabel: {formatter: function(value){return (value.slice(0, value.indexOf(':')))}}
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {type: 'shadow'},
					formatter: this.pmFormatter = function(params){
						var resinfo = params[0].name;
						var rescate = resinfo.slice(0, resinfo.indexOf(':'));
						var restotal = parseInt(resinfo.slice(resinfo.indexOf(':')+1, resinfo.indexOf(' ')));
						var content = (rescate +'信息: <br/>');
						var ultRatio = 0;
						for (var index=0; index<params.length; index++){
							content += ('* ' + params[index].seriesName + ': ');
							var resvm = Math.round(restotal * params[index].data);
							content += (resvm.toString()+resinfo.slice(resinfo.indexOf(' '),resinfo.length)+'<br/>');
							ultRatio += params[index].data;
						}
						var ultStr = (ultRatio.toFixed(4)*100).toString();

						ultStr = ultStr.slice(0,ultStr.indexOf('.')+3);
						content += ('物理机'+rescate+'总量: '+resinfo.slice(resinfo.indexOf(':')+1, resinfo.length)+
							'  利用率: ' + ultStr +'%');
						return content;
					}
				},
				series: conf.series
			};
			pmChart.setOption(option);
		}
	}

	this.globalConf = function(){
		var result = JSON.parse(sessionStorage.getItem("placement_result"));
		var pm = result.pmRecord;
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
		var globalChart1 = echarts.init(document.getElementById('gresult1'), 'light');
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
		globalChart1.on('click', function (params) {
			globalChart1.dispatchAction({
				type: 'dataZoom',
				startValue: conf.dataAxis[Math.max(params.dataIndex-zoomSize/2, 0)],
				endValue: conf.dataAxis[Math.min(params.dataIndex+zoomSize/2, conf.data.length-1)]
			});
		});
		globalChart1.setOption(option);
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
/*
window.onresize = function(){
	window.addEventListener("resize", function () {
          Vplacer.pmShower.pmChart.resize();
		  Vplacer.numShower.globalChart1.resize();
		  Vplacer.utilShower.globalChart.resize();
	});
}
*/

