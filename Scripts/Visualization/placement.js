function Vplacer(){
	/*
		Class to visualize the placement algorithm's result.

		Attributes:
		*... 
		Methods:
		* dataProcessor: generate data suitable for echart from the original result.
		* echartShower: show the placement result by echart.
	*/

	this.dataProcessor = function(index){
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
		var echartParam = {
			series: series,
			legend: {data: legend},
			pm: pm
		};
		return echartParam;
	}

	this.echartShower = function(){
		var param = this.dataProcessor(1);
		var vmlist = param.pm['VMList'];
		var pm = param.pm;
		var myChart = echarts.init(document.getElementById('result'), 'light');
		var option = {
			title: {text:'物理机资源分布图'},
			legend: param.legend,
			xAxis: {
				type: 'value',
				axisLabel:{formatter:function(value){return (String(value*100)+' %')}}
			},
			yAxis: {type: 'category', data: ['核心数','内存大小','存储容量']},
			tooltip: {
				trigger: 'axis',
				axisPointer: {type: 'shadow'},
				formatter: function(params){
					var content = params[0].name+'信息: <br/>';
					var pmResource = '';
					var pmRatio = '';
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
			series: param.series
		};
		myChart.setOption(option);
	}
} 

Vplacer = new Vplacer();
