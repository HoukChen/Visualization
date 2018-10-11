
function DU(){

	/*
		@ SIZE: 5 * 4
		@ NOTE: 资源块-制式小区数表， 存放资源块数对应的可承载每个制式的小区数量
	*/
	this.pieces_modes = new Array()

	/* 
		@ SIZE: 6 * 6
		@ NOTE: 单板之间的背板带宽矩阵 
	*/
	this.p_to_p = new Array()

	/* 
		@ SIZE: 6 * 6
		@ NOTE: 单板之间当前可用的背板带宽矩阵 
	*/
	this.p_to_p_now = new Array()

	/* 	
		@ SIZE: 11 * 2
		@ NOTE: 用于控制考虑负载均衡和背板带宽的权重 
	*/
	this.accuracy = new Array()

	/* 
		@ SIZE: 4
		@ NOTE: 存放每个制式每个小区所消耗的背板带宽 
	*/
	this.mode_flow = new Array()

	/* 
		@NOTE: 存放所有小区的信息
	*/
	this.users = new Array()

	/* 
		@ SIZE: 6 * 4
		@ NOTE: 存放各个制式在各个单板的初始分配情况 
	*/
	this.users_num = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];

	/* @NOTE: 存放一个单板的划分方案 */
	this.Node = function(){
		this.divide_pieces = 0;
		this.res_pieces = 4;
		this.pieces = [0,0,0,0];
		this.users_num = [0,0,0,0]; 
	}

	/* @NOTE: 存放一个小区的信息 */
	this.User = function(user_id, start_node, mode){
		this.user_id = user_id;
		this.start_node = start_node;
		this.mode = mode;
		this.node_id = -1;
		this.f = false;
	}

	/* @NOTE: 存放Find_Node函数的返回值 */
	this.Find_Node_Result = function(){
		this.node_id;
		this.stad;
		this.res;
	}

	/* @NOTE: 存放Traverse_Divrdes函数的返回值 */
	this.Traverse_Divides_Result = function(){
		this.stad = 0;
		this.users = new Array();
		this.nodes = new Array();
	}

	this.initialize = function(){
		var Params = JSON.parse(sessionStorage.getItem("du_parameter"));
		DU.p_to_p = Params.p_to_p;
		DU.mode_flow = Params.mode_flow;
		DU.accuracy = Params.accuracy;
		DU.pieces_modes = [[0,0,0,0]];
		for (var i = 0; i < 6; i++){
			DU.p_to_p_now[i] = new Array();
			for (var j = 0; j < 6; j++){
				DU.p_to_p_now[i][j] = DU.p_to_p[i][j];
			}
		} 
		for (var index = 0; index <Params.pieces_modes.length; index++){
			DU.pieces_modes.push(Params.pieces_modes[index]);
		}
		for (var index = 0; index < Params.users.length; index++){
			for (var re=0; re<Params.users[index][2]; re++){
				start = Params.users[index][0];
				mode = Params.users[index][1];
				var user = {
					"user_id": 0,
					"start_node": start,
					"mode": mode,
					"node_id": -1,
					"f": false
				}
				DU.users.push(user);
				DU.users_num[start][mode] += 1;
			}
		}
	}

	/* 
		@NOTE: 判断一个单板还能否承载一个新小区 
	*/
	this.can_serve = function(node, user_mode){
		if (DU.pieces_modes[node.pieces[user_mode]][user_mode] >= node.users_num[user_mode] + 1){
			return true;
		}
		else{
			return false;
		}
	}

	this.fit = function(node, node_id){
		node.res_pieces = 4;
		var max_mode = 2;
		var max_mode_2 = 3;
		var max_flow = 0;
		var max_flow_2 = 0;
		for(var i = 0; i < 4; i++){
			if (DU.users_num[node_id][i] * DU.mode_flow[i] > max_flow){
				max_flow_2 = max_flow;
				max_flow = DU.users_num[node_id][i] * DU.mode_flow[i];
				max_mode_2 = max_mode;
				max_mode = i;
			}
			else if (DU.users_num[node_id][i] * DU.mode_flow[i] > max_flow_2){
				max_flow_2 = DU.users_num[node_id][i] * DU.mode_flow[i];
				max_mode_2 = i;
			}
		}
		if (DU.pieces_modes[4][max_mode] <= DU.users_num[node_id][max_mode]){
				node.pieces[max_mode] = 4;
		}
		else if (DU.pieces_modes[3][max_mode] <= DU.users_num[node_id][max_mode])
		{
			node.pieces[max_mode] = 3;
			node.pieces[max_mode_2] = 1;
		}
		else
		{
			node.pieces[max_mode] = 2;
			node.pieces[max_mode_2] = 2;
		}
		console.log(node);
		/*根据已划分好的制式对小区进行分配*/
		for(var index = 0; index < DU.users.length; index++){
			var user = DU.users[index]; 
			if ((user.node_id == -1) && (user.start_node == node_id)){
				if (DU.can_serve(node, user.mode))
				{
					user.node_id = node_id;
					node.users_num[user.mode]++;
				}
			}		
		}
	}

	this.initialize_node = function(node){
		node.res_pieces = 4;
		for (var k = 0; k < 4; k++)
		{
			node.pieces[k] = 0;
			node.users_num[k] = 0;
		}
	}


	/* 
		@NOTE: 将一个单板所有的划分方式加入一个数组 
	*/
	this.divide = function(x)
	{
		var nodestatus = {
			divide_pieces: 0,
			res_pieces: 4,
			pieces: [0,0,0,0],
			users_num: [0,0,0,0]
		}

		
		/* (1,3)和(2,2)和(0,4) */
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				if (i == j){
					continue;
				}
				else
				{
					DU.initialize_node(nodestatus);
					for (var k = 0; k < 5; k++)
					{
						nodestatus.pieces[i] = 4 - k;
						nodestatus.pieces[j] = k;
						x.push(nodestatus);
					}
				}
			}
		}

		/* (1,1,2) */
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				if (i != j){
					for (var k = 0; k < 4; k++){
						if ((k != i) && (k != j)){
							nodestatus.pieces[i] = 2;
							nodestatus.pieces[j] = 1;
							nodestatus.pieces[k] = 1;
							nodestatus.pieces[6 - i - j - k] = 0;
							x.push(nodestatus);
						}
					}		
				}
			}
		}
		
		/* (0,0,0,0) */
		nodestatus.pieces[0] = 1;
		nodestatus.pieces[1] = 1;
		nodestatus.pieces[2] = 1;
		nodestatus.pieces[3] = 1;
		x.push(nodestatus);
	}


	/* 
		@NOTE: 计算单板资源利用率 
	*/
	this.get_usage = function(node)
	{
		var usage = 0;
		var usage_total = 0;
		for (var i = 0; i < 4; i++)
		{
			if (DU.pieces_modes[node.pieces[i]][i] != 0)
			{
				usage = node.users_num[i] / DU.pieces_modes[node.pieces[i]][i];
				usage *= node.pieces[i];
				usage_total += usage;
			}
		}
		usage_total = usage_total/4;
		return (usage_total);
	}


	/* 
		@NOTE: 计算各单板利用率的标准差,用来衡量负载均衡 
	*/
	this.get_std = function(usage)
	{
		var ave = (usage[0] + usage[1] + usage[2] + usage[3] + usage[4] + usage[5])/6;
		var vari = ((usage[0]-ave)*(usage[0]-ave) + (usage[1]-ave)*(usage[1]-ave) +
					(usage[2]-ave)*(usage[2]-ave) +(usage[3]-ave)*(usage[3]-ave) +
					(usage[4]-ave)*(usage[4]-ave) + (usage[5]-ave)*(usage[5]-ave))/6;
		var std_dev = Math.sqrt(vari);
		return std_dev;
	}

	this.find_node = function(user, node_status, p1, p2)
	{
		var mix = [-1, -1, -1, -1, -1, -1];

		/* 列举所有可能的小区转移方式 */
		for (var i = 0; i < 6; i++)
		{	
			if (!DU.can_serve(node_status[i], user.mode)){
				continue;
			}
			//console.log(user.mode)
			//console.log(DU.p_to_p[user.start_node][i])
			//console.log(DU.mode_flow[user.mode])
			if ((i != user.start_node) && (DU.p_to_p_now[user.start_node][i] < DU.mode_flow[user.mode])){
				continue;
			}
			mix[i] = 0;
		}
		/*for (var i = 0; i < 3; i++)
		{	
			//console.log(node_status[i])
			if (!DU.can_serve(node_status[i], user.mode)){
				continue;
			}
			//console.log(user.mode)
			//console.log(user.start_node)
			//console.log(DU.p_to_p[user.start_node][i])
			//console.log(DU.mode_flow[user.mode])
			if ((i != user.start_node) && (DU.p_to_p_now[user.start_node][i] < DU.mode_flow[user.mode])){
				continue;
			}
			mix[i] = 0;
		}
		
		for (var i = 4; i < 6; i++)
		{	
			if (!DU.can_serve(node_status[i], user.mode)){
				continue;
			}
			if ((i != user.start_node) && (DU.p_to_p_now[user.start_node][i] < DU.mode_flow[user.mode])){
				continue;
			}
			mix[i] = 0;
		}*/

		/*for (var i = 0; i < 6; i++)
		{	
			if (mix[i] == 0){
				console.log('sdf')
			}
		}*/

		var value1 = [0, 0, 0, 0, 0, 0];
		var usage = [0, 0, 0, 0, 0, 0];
		var value2 = [0, 0, 0, 0, 0, 0];

		/* 计算标准差，负载均衡性能 */
		for (var i = 0; i < 6; i++){
			usage[i] = DU.get_usage(node_status[i]);
		}

		for (var i = 0; i < 6; i++){
			if (mix[i] == 0){
				var usage_tmp = usage[i];
				node_status[i].divide_pieces++;
				usage[i] = DU.get_usage(node_status[i]);
				value1[i] = DU.get_std(usage);
				node_status[i].divide_pieces--;
				usage[i] = usage_tmp;
			}
		}

		/* 计算背板带宽使用 */
		for (var i = 0; i < 6; i++){
			if (mix[i] == 0){
				value2[i] = DU.p_to_p[user.start_node][i] / DU.mode_flow[user.mode];
			}
		}
		
		/* 计算综合性能 */
		var minres = 1000;
		var res = 0;
		var min_node = -1;
		for (var i = 0; i < 6; i++){
			if (mix[i] == 0){
				res = value1[i] * p1 + value2[i] * p2;
				if (res < minres){
					minres = res;
					min_node = i;
				}
			}
		}
		var find_node_result = {
			"node_id": 0,
			"stad": 0,
			"res": 0
		};
		find_node_result.node_id = min_node;
		if (minres != 1000){
			find_node_result.stad = value1[min_node];
		}
		else{
			find_node_result.stad = 1000;
		}
		find_node_result.res = minres;
		if (find_node_result.node_id != -1){
		//	console.log(1)
		//	console.log(user.start_node)
		//	console.log(find_node_result.node_id)
		//	console.log(DU.p_to_p_now[user.start_node][find_node_result.node_id])
			DU.p_to_p_now[user.start_node][find_node_result.node_id] -= DU.mode_flow[user.mode];
		//	console.log(DU.p_to_p_now[user.start_node][find_node_result.node_id])
		//	console.log(DU.p_to_p_now);
		}
		return find_node_result;
	}


	/* 
		@NOTE: 此函数现将各个单板进行不同的划分， 再通过多重循环对所有的划分方式组合进行遍历 
	*/
	this.traverse_divides = function(){
		var node_status = new Array();
		for (var re = 0;  re < 6; re++){
			var node = {
				divide_pieces: 0,
				res_pieces: 4,
				pieces: [0,0,0,0],
				users_num: [0,0,0,0]
			}
			node_status.push(node);
		}

		var find_node_result = new Array();
		var traverse_divides_result = {
			"stad": 0,
			"users": new Array(),
			"nodes": new Array()
		};
		var min_result = {
			"stad": 0,
			"users": new Array(),
			"nodes": new Array()
		};

		var minSTD = 1000;

		/* 由于小区初始单板的限制条件 优先分配2号和3号单板 */
		DU.fit(node_status[2], 2); 
		DU.fit(node_status[3], 3);

		/* 将其余单板所有的划分方式存入数组中 */
		var divides_node0 = new Array();
		var divides_node1 = new Array(); 
		var divides_node4 = new Array();
		var divides_node5 = new Array();
		DU.divide(divides_node0);
		DU.divide(divides_node1);
		DU.divide(divides_node4);
		DU.divide(divides_node5);

		console.log(divides_node0);
		/* 遍历所有的划分方式 */
		for (var ind0 = 0; ind0 < divides_node0.length; ind0+=2){
			
			// progressbar controller
			var ratio = ind0 / divides_node0.length-1;
			var proDiv = document.getElementById("progressbar");
			var progress = Number(ratio*100).toFixed(2);
			progress += "%"
			proDiv.style.width = progress;
			console.log(ind0);
			// progressbar end!

			var node_status0 = divides_node0[ind0];
			for (var ind1 = 1; ind1 < divides_node1.length; ind1+=2){
				var node_status1 = divides_node1[ind1];
				for (var ind4 = 2; ind4 < divides_node4.length; ind4+=2){
					var node_status4 = divides_node4[ind4];
					for (var ind5 = 0; ind5 < divides_node5.length; ind5+=2){
						var node_status5 = divides_node5[ind5];

						node_status5 = divides_node5[ind5];
						node_status[0] = node_status0;
						node_status[1] = node_status1;	
						node_status[4] = node_status4;
						node_status[5] = node_status5;
						for (var i = 0; i < 1; i++){
							var f = false;
							for (var k = 0; k< 6; k++){
								for (var j = 0; j < 6; j++){
									DU.p_to_p_now[k][j] = DU.p_to_p[k][j];
								}
							} 
							//console.log(DU.p_to_p_now)
							for (var uind = 0; uind < DU.users.length; uind++){
								var user = DU.users[uind];
								if (user.node_id == -1){
									find_node_result = DU.find_node(user, node_status, DU.accuracy[i][0], DU.accuracy[i][1]);
									if (find_node_result.node_id == -1){
										f = true;
										break;
									}
									user.node_id = find_node_result.node_id;
									node_status[user.node_id].users_num[user.mode]++;
									user.f = true;
								}
							}
							//console.log(DU.p_to_p_now)
							if (f){
								for (var uind = 0; uind < DU.users.length; uind++){
									var user = DU.users[uind];
									if (user.f){
										user.f = false;
										node_status[user.node_id].users_num[user.mode]--;
										user.node_id = -1;
									}
								}
								break;
							}

							//找到合理的分配方案后，对其评分进行比较，选择最优方案
							if (find_node_result.stad < minSTD){
								minSTD = find_node_result.stad;
								traverse_divides_result.stad = minSTD;
								traverse_divides_result.users = [];

								for(var uind = 0; uind < DU.users.length; uind ++){
									var user = DU.users[uind];
									traverse_divides_result.users.push(user.node_id);
								}
								traverse_divides_result.nodes[0] = node_status[0];
								traverse_divides_result.nodes[1] = node_status[1];
								traverse_divides_result.nodes[2] = node_status[2];
								traverse_divides_result.nodes[3] = node_status[3];
								traverse_divides_result.nodes[4] = node_status[4];
								traverse_divides_result.nodes[5] = node_status[5];
							}
							for (var uind = 0; uind < DU.users.length; uind++){
								var user = DU.users[uind];
								if (user.f){
									user.f = false;
									node_status[user.node_id].users_num[user.mode]--;
									user.node_id = -1;
								}
							}	
						}
					}
				}
			}
		}
		console.log(traverse_divides_result);
		return traverse_divides_result;
	}

	this.print_result = function(result)
	{
		var parameters = {
			"util": new Array(),
			"net_limit2": [DU.p_to_p[2][0], DU.p_to_p[2][1], DU.p_to_p[2][4], DU.p_to_p[2][5]],
			"net_limit3": [DU.p_to_p[2][0], DU.p_to_p[2][1], DU.p_to_p[2][4], DU.p_to_p[2][5]],
			"net_node2": new Array(),
			"net_node3": new Array(),
			"num": new Array()
		};
		if (result.nodes.length == 0){
			console.log('Cannot find a transfer plan');
			return -1;
		}

		var usage = [0, 0, 0, 0, 0, 0];
		for (var i = 0; i < 6; i++){
			usage[i] = DU.get_usage(result.nodes[i]);
		}
		parameters.util = usage;

		for (var mode = 0; mode < 4; mode++){
			var modearray = new Array();
			for (var i = 0; i < 6; i++){
				modearray.push(result.nodes[i].pieces[mode])
			}
			parameters.num.push(modearray);
		}	
					
		var flow = 
			[
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0]
			];
		
		for (var i = 0; i < result.users.length; i++){
			if (result.users[i] != DU.users[i].start_node){
				flow[result.users[i]][DU.users[i].start_node] += DU.mode_flow[DU.users[i].mode];
				flow[DU.users[i].start_node][result.users[i]] += DU.mode_flow[DU.users[i].mode];
			}
		}
		
		parameters.net_node2 = [flow[2][0], flow[2][1], flow[2][4], flow[2][5]];
		parameters.net_node3 = [flow[3][0], flow[3][1], flow[3][4], flow[3][5]];
		console.log(parameters);
		return parameters;
	}

	this.run = function(){
	    DU.initialize();
	    var result = DU.traverse_divides();
	    var parameters = DU.print_result(result);
		
	   // stopithere();
	   /*
	    var parameters = new Array();
	    parameters = {
	    	"net_node2": [3, 6, 7, 4],
	    	"net_node3": [8, 2, 5, 6],
	    	"net_limit2": [20, 20, 20, 20],
	    	"net_limit3": [20, 20, 20, 20],
	    	"util": [0.45, 0.68, 0.74, 0.54, 0.77, 0.55],
	    	"num": [[2,0,3,1,3,3],[2,4,3,2,2,1],[3,2,2,1,2,4],[3,1,4,3,3,4]]
	    }
		*/
	    sessionStorage.setItem("du_result", JSON.stringify(parameters));
	    console.log("Finished!");
		if(parameters == -1){
			alert(“没有找到分配方案”);
		}
		
	}
}

DU = new DU();