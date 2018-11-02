function VDU(){
	this.params = new Array();
	this.optimization = "BEST_STD";
	this.scale = 0;
	this.initParams = function(){
		if (this.optimization == "0"){
			this.params = JSON.parse(sessionStorage.getItem("du_result")).BEST_STD;
		}
		else if (this.optimization == "1"){
			this.params = JSON.parse(sessionStorage.getItem("du_result")).MIN_FLOW;
		}
		// set flow_transfer graph scale
		var opt1 = JSON.parse(sessionStorage.getItem("du_result")).BEST_STD;
		var opt2 = JSON.parse(sessionStorage.getItem("du_result")).MIN_FLOW;

		for (var ind = 0; ind < 4; ind++){
			if (opt1.net_node2[ind] > this.scale){
				this.scale = opt1.net_node2[ind];
			}
			if (opt1.net_node3[ind] > this.scale){
				this.scale = opt1.net_node3[ind];
			}
			if (opt2.net_node2[ind] > this.scale){
				this.scale = opt2.net_node2[ind];
			}
			if (opt2.net_node3[ind] > this.scale){
				this.scale = opt2.net_node3[ind];
			}
		}
		console.log(this.params);
	}

	this.netShower = function(){
		var netChart = echarts.init(document.getElementById('net'), 'light');
		var data = new Array();
		var links = new Array();
		var endp = ['单板0', '单板1', '单板4', '单板5'];
		var sum_used_flow = 0;
		var sum_total_flow = 0;
		for (var re=0; re<4; re++){
			links.push({
				source:'单板2',
				target: endp[re],
				islink:true,
				name:'链路1',
				bandwith: this.params.net_limit2[re],
				timeout: this.params.net_node2[re],
				PacketLossRate: Math.ceil(100*this.params.net_node2[re]/this.params.net_limit2[re])/100
			});
			sum_used_flow += this.params.net_node2[re];
			sum_total_flow += this.params.net_limit2[re];
		}
		for (var re=0; re<4; re++){
			links.push({
				source:'单板3',
				target: endp[re],
				islink:true,
				name:'链路1',
				bandwith: this.params.net_limit3[re],
				timeout: this.params.net_node3[re],
				PacketLossRate: Math.ceil(100*this.params.net_node3[re]/this.params.net_limit3[re])/100
			});
			sum_used_flow += this.params.net_node3[re];
			sum_total_flow += this.params.net_limit3[re];
		}

		var globalinfo = "总带宽"+sum_total_flow.toString()+"MB    总流量"+sum_used_flow.toString()+"MB    利用率"
					+(sum_used_flow*100/sum_total_flow).toFixed(2).toString()+"%";
		data = [
					{
						name:'单板1',
						ip:'10.108.50.101',
						isnode:true,
						x:100,
						y:300,
						// symbol:'image://服务器-20.png',
					},
					{
						name:'单板2',
						ip:'10.108.50.102',
						isnode:true,
						x:200,
						y:470,
						// symbol:'image://服务器-20.png',
					},
					{
						name:'单板3',
						ip:'10.108.50.103',
						isnode:true,
						x:400,
						y:470,
						// symbol:'image://服务器-20.png',
					},
					{
						name:'单板4',
						ip:'10.108.50.104',
						isnode:true,
						x:500,
						y:300,
						// symbol:'image://服务器-20.png',
					},
					{
						name:'单板5',
						ip:'10.108.50.105',
						isnode:true,
						x:400,
						y:130,
						// symbol:'image://服务器-20.png',
					},
					{
						name:'单板0',
						ip:'10.108.50.106',
						isnode:true,
						x:200,
						y:130,
						// symbol:'image://服务器-20.png',
					},
				];
		var netoption = {
				title: { text: '网络拓扑信息图               '+globalinfo},
				tooltip: {formatter: "Hello, world"},
				animationDurationUpdate: 1500,
				animationEasingUpdate: 'quinticInOut',
				// xAxis: {
				// 	name:"背板总带宽："+sum_total_flow.toString()+"背板总流量："+sum_used_flow.toString()+"带宽综合利用率："
				// 	+(sum_used_flow*100/sum_total_flow).toFixed(2).toString()+"%",
				// 	nameLocation: "middle"
				// },
				series : 
				[
					{
						type: 'graph',
						layout: 'none',
						symbolSize: 30,							//图形的大小（示例中的圆的大小）
						roam: false,							//鼠标缩放及平移
						focusNodeAdjacency: true,				//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点
						edgeSymbol: ['circle', 'arrow'],
						edgeSymbolSize: [1, 10],    			//箭头的大小
						label: {
							normal: {
								show: true ,  					//控制非高亮时节点名称是否显示
								position:'left',
								fontSize:20
							}
						},
						edgeLabel: {
							normal: {show:false},
							emphasis: {
								textStyle: {fontSize: 20}  		//边节点显示的字体大小
							}
						},
						data: data,
						links: links,
						lineStyle: {
							normal: {
								show:true,
								color: {       
									type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
									colorStops: [ {offset: 0, color: 'red'}, {offset: 1, color: 'blue'}],
									globalCoord: false
								},
							},
							emphasis:{
								color:'red',
								width:3,
								type:'dashed',
							}
						},
			   
						tooltip: {
							show: true,
							position:'bottom',
							backgroundColor:'green',
							textStyle:{fontSize: 18},
							formatter: function(params){
							   if (params.data.islink) {return '带宽限制：&nbsp'+params.data.bandwith+'MB<br />'+'带宽使用：&nbsp'+params.data.timeout+'MB<br />'+'带宽使用率：'+params.data.PacketLossRate;}
							   else if (params.data.isnode) {return params.data.name;}
							},
						}
					}
				]
			};
		netChart.setOption(netoption);
	}

	this.utilShower =function(){
		var utilChart = echarts.init(document.getElementById('util'), 'light');
		var utiloption = {
			title: {
				text: '单板利用率'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				boundaryGap: [0, 0.01],
				max: 1,
				name: "利用率",
				nameLocation: "middle"
			},
			yAxis: {
				type: 'category',
				data: ['单板0','单板1','单板2','单板3','单板4','单板5']
			},
			series: [
				{
					name: '资源利用率',
					type: 'bar',
					data: this.params.util
				}
			]
		};
		utilChart.setOption(utiloption);
	}

	this.numShower = function(){
		var numChart = echarts.init(document.getElementById('num'), 'light');
		var series = new Array();
		for (var re=1; re<5; re++){
			series.push({
				name: '制式'+re.toString(),
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: false,
					}
				},
				data: this.params.num[re-1]
			});
		}
		var numoption = {
			title: {
				text: '单板上各制式业务数量图'
			},
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				show: true,
				data: ['制式0', '制式1','制式2','制式3'],
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis:  {
				type: 'value',
				name: "数量",
				nameLocation: "middle"
			},
			yAxis: {
				type: 'category',
				data: ['单板0','单板1','单板2','单板3','单板4','单板5']
			},
			series: series
		};
		numChart.setOption(numoption);
	}

	this.nodeShower = function(nodeIndex){
		var nodeChart = echarts.init(document.getElementById('node'+nodeIndex.toString()), 'light');
		var data = new Array();
		for (var cellind = 0; cellind < 4; cellind++){
			data.push(this.params.num[cellind][nodeIndex]);
		}
		var nodeoption = {
			title: {
				text: '单板'+nodeIndex.toString()+'上各制式小区数量图'
			},
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				show: true,
				data: ['制式0', '制式1','制式2','制式3'],
			},
			xAxis:  {
				type: 'category',
				data: ['制式0', '制式1','制式2','制式3'],
				name: "\n小区制式",
				nameLocation: "middle"
			},
			yAxis: {
				type: 'value',
				minInterval: 1,
				name: '小区数量'
			},
			series: [
				{
					type: 'bar',
					barWidth: '60%',
					data: data
				}
			]
		};
		nodeChart.setOption(nodeoption);
	}

	this.node2_flow_outShower = function(){
		var nodeoutChart = echarts.init(document.getElementById("flow_transfer"), 'light');
		var series = new Array();
		
		series.push({
			name: '单板0',
			type: 'bar',
			data: [this.params.net_node2[0], this.params.net_node3[0]]
		})
		series.push({
			name: '单板1',
			type: 'bar',
			data: [this.params.net_node2[1], this.params.net_node3[1]]
		})
		series.push({
			name: '单板4',
			type: 'bar',
			data: [this.params.net_node2[2], this.params.net_node3[2]]
		})
		series.push({
			name: '单板5',
			type: 'bar',
			data: [this.params.net_node2[3], this.params.net_node3[3]]
		})
		
		var nodeoutoption = {
			title: {
				text: '流量转移信息图'
			},
			legend: {
				show: true,
				data: ['单板0', '单板1','单板4','单板5'],
			},
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis:  {
				type: 'category',
				data: ['单板2','单板3'],
				name: "\n发送小区任务的单板",
				nameLocation: "middle"
			},
			yAxis: {
				type: 'value',
				minInterval: 1,
				max: this.scale,
				name: '流量大小(MB)'
			},
			series: series
		};
		nodeoutChart.setOption(nodeoutoption);

	}

	this.globalShower = function(){
		var selectDiv = document.getElementById("optiSelect");
		var index = parseInt(selectDiv.selectedIndex);
		var choice = selectDiv.options[index].value;
		this.optimization = choice;

		this.initParams();
		this.netShower();
		this.utilShower();
		// this.numShower();
		for (var nodeind = 0; nodeind < 6; nodeind++){
			this.nodeShower(nodeind);
		}
		this.node2_flow_outShower();
	}
}

VDU = new VDU();
