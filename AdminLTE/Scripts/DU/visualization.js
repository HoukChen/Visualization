function VDU(){
	this.params = new Array();
	this.optimization = "BEST_STD";
	this.initParams = function(){
		if (this.optimization == "0"){
			this.params = JSON.parse(sessionStorage.getItem("du_result")).BEST_STD;
		}
		else if (this.optimization == "1"){
			this.params = JSON.parse(sessionStorage.getItem("du_result")).MIN_FLOW;
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
						symbolSize: 40,							//图形的大小（示例中的圆的大小）
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
				data: ['制式1', '制式2','制式3','制式4'],
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

	this.globalShower = function(){
		var selectDiv = document.getElementById("optiSelect");
		var index = parseInt(selectDiv.selectedIndex);
		var choice = selectDiv.options[index].value;
		this.optimization = choice;

		this.initParams();
		this.netShower();
		this.utilShower();
		this.numShower();
	}
}

VDU = new VDU();
