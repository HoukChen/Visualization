function echartTest(){
	var myChart = echarts.init(document.getElementById('main'));

	var option = {
		grid3D: {
			show: true,
			axisTick: {show: false},
			axisPointer: {show: false},
			splitLine: {show: true, lineStyle:{color:'w'}},
			splitArea: {show: true}
		},
		xAxis3D: {
			type: 'value',
			name: '核心数',
			nameTextStyle: {fontSize:12},
			min: 0,
			max: 64,
			interval: 16
		},
		yAxis3D: {
			type: 'value',
			name: '内存(GB)',
			nameTextStyle: {fontSize:12},
			min: 0,
			max: 128,
			splitNumber: 3
		},
		zAxis3D: {
			type: 'value',
			name: '存储(GB)',
			nameTextStyle: {fontSize:12},
			min: 0,
			max: 5000,
			splitNumber: 3
		},
		series: [
			{
				type: 'bar3D',
				itemStyle: {
					opacity: 0.5
				},
				data: [
					{
						name: 'vm1',
						value: [0,0,1000],
						itemStyle: {
							color: 'black',
							opacity: 1
						}
					},
					{
						name: 'vm2',
						value: [27,27,1500],
						itemStyle: {
							color: 'red',
							opacity: 1
						}
					}
				]
			}
		]
	};
	myChart.setOption(option);
}