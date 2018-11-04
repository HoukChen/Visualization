function Vbalance(){
	
	this.initParams = function(){
		var cdata = sessionStorage.getItem("balance_result");

		var balancedata = JSON.parse(sessionStorage.getItem("balance_result"));
		console.log(balancedata);
		this.TASKS = new Array();
		this.HLOAD = new Array();
		this.MLOAD = new Array();
		this.LLOAD = new Array();
		for(var ind = 0; ind < balancedata.tasks.length ; ind++){
			this.TASKS.push([ind,balancedata.tasks[ind]]);
			this.HLOAD.push([ind,balancedata.hloads[ind]]);
			this.MLOAD.push([ind,balancedata.mloads[ind]]);
			this.LLOAD.push([ind,balancedata.sloads[ind]]);
		}
		
		/*
		for (var ind = 0; ind < 10; ind++){
			this.WRRT.push([ind,balancedata.wrrt[ind]]);
			
		}
		console.log("wrrt");
		console.log(this.WRRT);
		*/
	}
	
	this.globalShower = function(){
		//this.initParams();
		var initLen = 20;
		this.initParams();
		//algorithm comparation graph
		var algocomparation = echarts.init(document.getElementById("algocom"));
		var app = {};
		var cdata = JSON.parse(sessionStorage.getItem("balance_result"));
		var arr1 = cdata.wrrt;
		var arr2 = cdata.lbft;
		var arr3 = cdata.wlct;
		//alert(cdata);
		var data = {
			id: 'echarLines',
			title: '对比算法平均响应时间对比',
			legend: ['负载均衡算法', '最小连接数算法', '轮询算法' ],
			xAxis: ['1000', '2000', '3000', '4000',
				'5000', '6000', '7000', '8000', '9000'
			],
			color:['#3399ff', '#e68a00', '#ff0000' ],
			yAxis: [
				arr2,
				arr3,
				arr1,
			]
		}

		let legend = data.legend || []
		let seriesArr = []
		let legendSele = {}
		data.yAxis && data.yAxis.forEach((item, index) => {
			let name = legend[index]
			index === 0 ? legendSele[name] = true : legendSele[name] = false //将第一个设置为默认展示
			seriesArr.push({
				name: name,
				type: 'line',
				data: item,
				smooth: false,
				symbol: 'circle',
				hoverAnimation: true,
				showAllSymbol: true,
				symbolSize: '8',
				label: {
					normal: {
						show: index === 0 ? true : false,
						position: 'top',
					}
				},
			})
		})

		option = {
			backgroundColor:'#fff',
			title: {
				text: '算法与对比算法性能比较(平均相应时间，单位ms)'
			},
			grid: {
				x: 30,
				y: 80,
				x2: 150,
				y2: 60,
			},
			color: data.color,
			tooltip: {
				trigger: 'axis',
				formatter: function(params) {
					let time = '';
					let str = '';
					for (var i of params) {
						time = i.name + '<br/>';
						if (i.data == 'null' || i.data == null) {
							str += i.seriesName + ' :  无数据' + '<br/>'
						} else {
							str += i.seriesName + ' : ' + i.data + '<br/>'
						}

					}
					return time + str;
				}
			},
			legend: {
				icon: 'rect',
				orient: 'vertical',
				right: 14,
				y: 'center',
				top: 12,
				itemWidth: 10,
				itemHeight: 10,
				itemGap: 10,
				borderRadius: 2,
				data: legend,
				textStyle: {
					fontSize: 14,
				},
				selected: legendSele
			},
			xAxis: {
				data: data.xAxis || [],
				axisLine: { // 坐标轴线
					lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
						color: 'black',
						type: 'solid'
					},
				},
				axisTick: { // 坐标轴小标记
					show: false, // 属性show控制显示与否，默认不显示
				},
				axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
					show: true,
					interval: '0',
					color: '#687284',
				},
				name: "100毫秒内任务数量",
				nameTextStyle:{
					color: 'black',
				}
			},
			yAxis: {
				type: 'value',
				
				axisTick: { // 坐标轴小标记
					show: false, // 属性show控制显示与否，默认不显示
				},
				splitLine: {
					show: true,
					lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
						color: '#F1F3F5',
						type: 'solid'
					},
				},
				axisLine: { // 坐标轴线
					lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
						color: 'black',
						type: 'solid'
					},
					show: true, // 默认显示，属性show控制显示与否
				},
				axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
					show: true,
				},
				name: "\t\t\t\t\t\t\t\t\t\t平均响应时间(ms)",
				//nameLocation: "middle"
			},

			series: seriesArr
		}
		algocomparation.setOption(option, true);
		
		
		//Taskgraph
		
		var taskChart = echarts.init(document.getElementById('taskgraph'), 'light');
		var taskarr = this.TASKS;
		console.log(this.TASKS);
        var taskdata = taskarr.slice(0, Math.min(initLen, taskarr.length));
		taskoption = {
			title: {text:'任务到来时间图'},
			legend: {data: ['任务数']},
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                axisTick: {show: false},
				name: '\n时间（ms）',
				nameLocation: 'middle'
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                /*min: function(value) {
                	return Math.ceil(0.5*value.min);
                }*/
				name: '\t\t\t任务总大小（Gb）',
            },
            series: [{
                type: 'line',
                name: '任务数',
                data: taskdata
            }]
        };
        taskChart.setOption(taskoption);

		
		//LoadGraph
		var loadChart = echarts.init(document.getElementById('loadgraph'), 'light');
		var hloadarr = this.HLOAD;
        var hloaddata = hloadarr.slice(0, Math.min(initLen, hloadarr.length));
		var mloadarr = this.MLOAD;
        var mloaddata = mloadarr.slice(0, Math.min(initLen, mloadarr.length));
		var lloadarr = this.LLOAD;
        var lloaddata = lloadarr.slice(0, Math.min(initLen, lloadarr.length));
		loadoption = {
			title: {text:'虚拟机负载情况变化图'},
			legend: {data: ['高负载虚拟机个数','中负载虚拟机个数','低负载虚拟机个数']},
            xAxis: {
                type: 'value',
                min: 'dataMin',
                max: 'dataMax',
                axisTick: {show: false},
				name: '\n时间（ms）',
				nameLocation: 'middle'
            },
            yAxis: {
                type: 'value',
                axisTick: {show: false},
                /*min: function(value) {
                	return Math.ceil(0.5*value.min);
                }*/
				name: '\t\t\t虚拟机个数',
            },
            series: [{
                type: 'line',
                name: '高负载虚拟机个数',
                data: hloaddata
            },{
				type: 'line',
				name: '中负载虚拟机个数',
				data: mloaddata
			},{
				type: 'line',
				name: '低负载虚拟机个数',
				data: lloaddata
			}]
        };
        loadChart.setOption(loadoption);
		
        if (cdata.tasks.length > initLen){
        	count = initLen;
	        var intervalID = setInterval(function () {
	            taskdata.shift();
				hloaddata.shift();
				mloaddata.shift();
				lloaddata.shift();
	            taskdata.push(taskarr[count]);
				hloaddata.push(hloadarr[count]);
				mloaddata.push(mloadarr[count]);
				lloaddata.push(lloadarr[count]);
	            count += 1;
	            taskChart.setOption({
	            	series: [{data: taskdata}]
	            });
				loadChart.setOption({
	            	series: [{data: hloaddata},{data: mloaddata},{data: lloaddata}]
	            });
		        if (count == taskarr.length){
					taskChart.setOption({
						series: [{data: taskarr}]
					});
					loadChart.setOption({
						series: [{data: hloadarr},{data: mloadarr},{data: lloadarr}]
					});
					clearInterval(intervalID);
				}
	        }, 1000);
        }
	}
	
}

Vbalance = new Vbalance();