
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
		this.mode = DU.mode_flow[mode];
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
		console.log(Params);
		
		DU.p_to_p = Params.p_to_p;
		DU.mode_flow = Params.mode_flow;
		DU.pieces_modes = [[0,0,0,0]];
		for (var index = 0; index <Params.pieces_modes.length; index++){
			DU.pieces_modes.push(Params.pieces_modes[index]);
		}
		for (var index = 0; index < Params.users.length; index++){
			for (var re=0; re<Params.users[index][2]; re++){
				start = Params.users[index][0];
				mode = Params.users[index][1];
				var user = new DU.User(0, start, mode);
				DU.users.push(user);
				DU.users_num[start][mode] += 1;
			}
		}
	}

	/* 
		@NOTE: 判断一个单板还能否承载一个新小区 
	*/
	this.can_serve = function(node, user_mode){
		console.log(node.pieces[user_mode]);
		console.log(DU.pieces_modes);
		if (DU.pieces_modes[node.pieces[user_mode]][user_mode] >= node.users_num[user_mode] + 1){
			return true;
		}
		else{
			return false;
		}
	}

	this.fit = function(node, node_id){
		node.res_pieces = 4;
		var max_mode = -1;
		var max_mode_2 = -1;
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
			nod.pieces[max_mode_2] = 2;
		}
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
		var nodestatus = new DU.Node();
		
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
			if (pieces_modes[node.pieces[i]][i] != 0)
			{
				usage = node.users_num[i] / pieces_modes[node.pieces[i]][i];
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
		var std_dev = sqrt(vari);
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
			if ((i != user.start_node) && (p_to_p[user.start_node][i] < mode_flow[user.mode])){
				continue;
			}
			mix[i] = 0;
		}

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
				value2[i] = p_to_p[user.start_node][i] / mode_flow[user.mode];
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
		var find_node_result = new Find_Node_Result();
		find_node_result.node_id = min_node;
		if (minres != 1000){
			find_node_result.stad = value1[min_node];
		}
		else{
			find_node_result.stad = 1000;
		}
		find_node_result.res = minres;
		return find_node_result;
	}


	/* 
		@NOTE: 此函数现将各个单板进行不同的划分， 再通过多重循环对所有的划分方式组合进行遍历 
	*/
	this.traverse_divides = function(){
		var node_status = new Array();
		for (var re = 0;  re < 6; re++){
			node_status.push(new DU.Node());
		}
		var find_node_result = new DU.Find_Node_Result();
		var traverse_divides_result = new DU.Traverse_Divides_Result()
		var min_result = new DU.Traverse_Divides_Result();

		var minSTD = 1000;

		/* 由于小区初始单板的限制条件 优先分配2号和3号单板 */
		DU.fit(node_status[2], 2); 
		DU.fit(node_status[3], 3);

		/* 将其余单板所有的划分方式存入数组中 */
		var divides_node0 = new Array();
		var divides_node1 = new Array(); 
		var divides_node4 = new Array();
		var divides_node5 = new Array();
		divide(divides_node0);
		divide(divides_node1);
		divide(divides_node4);
		divide(divides_node5);

		/* 遍历所有的划分方式 */
		for (var ind0 = 0; ind0 < divides_node0.length; ind0++){
			var node_status0 = divides_node0[ind0];
			for (var ind1 = 0; ind1 < divides_node1.length; ind1++){
				var node_status1 = divides_node1[ind1];
				for (var ind4 = 0; ind4 < divides_node4.length; ind4++){
					var node_status4 = divides_node4[ind4];
					for (var ind5 = 0; ind5 < divides_node5[ind5]; ind5++){
						node_status5 = divides_node5[ind5];
						node_status[0] = node_status0;
						node_status[1] = node_status1;
						node_status[4] = node_status4;
						node_status[5] = node_status5;
						for (var i = 0; i < 11; i++){
							var f = false;
							for (var uind = 0; uind < users.length; uind++){
								var user = users[uind];
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
							if (f){
								for (var uind = 0; uind < users.length; uind++){
									var user = users[uind];
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

								for(var uind = 0; uind < users.length; uind ++){
									var user = users[uind];
									traverse_divides_result.users.push(user.node_id);
								}
								traverse_divides_result.nodes[0] = node_status[0];
								traverse_divides_result.nodes[1] = node_status[1];
								traverse_divides_result.nodes[2] = node_status[2];
								traverse_divides_result.nodes[3] = node_status[3];
								traverse_divides_result.nodes[4] = node_status[4];
								traverse_divides_result.nodes[5] = node_status[5];
							}
							for (var uind = 0; uind < users.length; uind++){
								var user = users[uind];
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
		return traverse_divides_result;
	}

	this.print_result = function(result)
	{
		if (result.users.empty()){
			console.log("None");
			return;
		}
		var usage = [0, 0, 0, 0, 0, 0];
		for (var i = 0; i < 6; i++){
			usage[i] = get_usage(result.nodes[i]);
			console.log(i);
			console.log(usage[i]);
		}
		var stad = get_std(usage);
		console.log("std == ");
		console.log(stad);
		for (var i = 0; i < result.users.length; i++){
			console.log("user : node"); 
			console.log(i);
			console.log(result.users[i]);
		}
		for (var i = 0; i < 6; i++){
			console.log("node");
			console.log(i);
			console.log(result.nodes[i].pieces[0]);
			console.log(result.nodes[i].pieces[1]);
			console.log(result.nodes[i].pieces[2]);
			console.log(result.nodes[i].pieces[3]);
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
			if (result.users[i] != users[i].start_node){
				flow[result.users[i]][users[i].start_node] += mode_flow[users[i].mode];
				flow[users[i].start_node][result.users[i]] += mode_flow[users[i].mode];
			}
		}
		
		for (var i = 0; i < 6; i++){
			for (var j = 0; j < 6; j++){
				console.log(flow[i][j]);
			}
		}	
	}

	this.run = function(){
	    DU.initialize();
	    var result = new DU.Traverse_Divides_Result();
	    result = DU.traverse_divides();
	    print_result(result);
	    return 0;
	    /*var parameters = new Array();
	    parameters = {
	    	"net_node2": [3, 6, 7, 4],
	    	"net_node3": [8, 2, 5, 6],
	    	"net_limit2": [20, 20, 20, 20],
	    	"net_limit3": [20, 20, 20, 20],
	    	"util": [0.45, 0.68, 0.74, 0.54, 0.77, 0.55],
	    	"num": [[2,0,3,1,3,3],[2,4,3,2,2,1],[3,2,2,1,2,4],[3,1,4,3,3,4]]
	    }
	    sessionStorage.setItem("du_result", JSON.stringify(parameters));
	    console.log("Finished!")*/
	}
}

DU = new DU();