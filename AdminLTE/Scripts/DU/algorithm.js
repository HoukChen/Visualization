function DU(){
	/*
		Class to implement DU algorithm

		Attribute:
		* pieces_modes: @size 5*4, resource pieces and cell modes table
		* p_to_p: @size 6*6, baseband bandwidth matrix
		* mode_flow: @size 4, bandwidth for each kind of cell mode
		* users: @size n*3, users infomation list
		* permunation: permunation for basebands' pieces and modes
		* baseband: @size 6, baseband modes information
		* flow_scheme: @size 6*6, the final result of transfering flow
		* band_scheme: @size 2, the placement final reuslt of baseband 2 and 3
	*/
	this.pieces_modes = new Array();
	this.p_to_p = new Array();
	this.mode_flow = new Array();
	this.users =  new Array();
	
	this.permunation = new Array();
	this.baseband = new Array();
	this.flow_scheme = new Array();
	this.band_scheme = new Array();

	this.REPEAT = 20000;

	this.initParams = function(){
		var Params = JSON.parse(sessionStorage.getItem("du_parameter"));
		this.pieces_modes = Params.pieces_modes;
		this.p_to_p = Params.p_to_p;
		this.mode_flow = Params.mode_flow;
		for (var uind = 0; uind < Params.users.length; uind++){
			var users = Params.users;
			for(var num = 0; num < users[uind][2]; num++){
				var user = [users[uind][0], users[uind][1], this.mode_flow[users[uind][1]]];
				this.users.push(user);
			}
		}
		console.log(this.pieces_modes);
		console.log(this.p_to_p);
		console.log(this.mode_flow);
		console.log(this.users);
	}

	this.initPerm = function(){
		// (1,3), (2,2)
		for (var m1 = 0; m1 < 4; m1++){
			for (var m2 = 0; m2 < 4; m2++){
				if (m1 != m2){
					var perm13 = [0, 0, 0, 0];
					perm13[m1] = 1;
					perm13[m2] = 3;
					this.permunation.push(perm13);
					var perm22 = [0, 0, 0, 0];
					perm22[m1] = 2;
					perm22[m2] = 2;
					this.permunation.push(perm22);
				}
			}
		}

		// (1,1,2)
		for (var m1 = 0; m1 < 4; m1++){
			for (var m2 = 0; m2 < 4; m2++)
				if (m1 != m2){
					for (var m3 = 0; m3 < 4; m3++){
						if (m3 != m2 && m3 != m1){
							var perm112 = [0, 0, 0, 0];
							perm112[m1] = 1;
							perm112[m2] = 1;
							perm112[m3] = 2;
							this.permunation.push(perm112);
						}
					}
				}
		}
		//  (4)
		for (var m1 = 0; m1 < 4; m1++){
			var perm4 = [0, 0, 0, 0];
			perm4[m1] = 4;
			this.permunation.push(perm4);
		}
		
		// (1,1,1,1)
		this.permunation.push([1,1,1,1]);
	}

	this.initBaseband = function(){
		this.baseband = new Array();
		this.band_scheme = new Array();
		this.flow_scheme = new Array();
		for (var bind = 0; bind < 6; bind++){
			var randnum = Math.floor(Math.random()*this.permunation.length);
			var mode_piece = this.permunation[randnum].slice();
			var mode_user = new Array();
			for (var mode = 0; mode < 4; mode++){
				var piece = mode_piece[mode];
				if (piece == 0){
					mode_user.push(0);
				}
				else{
					var piece_ = piece - 1;
					mode_user.push(this.pieces_modes[piece_][mode])
				}
			}
			this.baseband.push(mode_user);
		}

		for (var in_ = 0; in_ < 6; in_++){
			var in_array = new Array();
			for (var out = 0; out < 6; out++){
				var flow = {
					"mode_num": [0, 0, 0, 0],
					"used": 0,
					"total": this.p_to_p[in_][out],
				};
				in_array.push(flow);
			}
			this.flow_scheme.push(in_array);
		}

		for (var bind = 0; bind < 6; bind++){
			this.band_scheme.push([0, 0, 0, 0]);
		}

		// console.log(this.permunation)
		// console.log(this.baseband)
		// console.log(this.flow_scheme)
		// console.log(this.band_scheme)
	}

	this.checkNode = function(node_to, user){
		var node_from = user[0];
		var mode = user[1];
		var flow = user[2];
		// check node capicity
		if (this.baseband[node_to][mode] < this.band_scheme[node_to][mode] + 1){
			return false;
		}
		// check path flow
		if (node_to != 2 && node_to != 3){
			if (this.flow_scheme[node_from][node_to].used + flow > this.p_to_p[node_from][node_to]){
				return false;
			}
		}
		return true;
	}

	this.calcUtil = function(nodeT, nodeU){
		var total = 0;
		var used = 0;
		for (var mode = 0; mode < 4; mode++){
			total += nodeT[mode];
			used += nodeU[mode];
		}
		return used/total;
	}

	this.calcStd = function(util_list){
		var sum = 0
		for (var uind = 0; uind < util_list.length; uind++){
			sum += util_list[uind];
		}
		var average = sum/util_list.length;
		var count = 0;
		for (var uind = 0; uind < util_list.length; uind++){
			count += Math.pow(util_list[uind]-average, 2);
		}
		return Math.sqrt(count);
	} 

	this.nodeStd = function(node_to, user){
		var util_list = new Array();
		for (var nind = 0; nind < 6; nind++){
			var nodeU = this.band_scheme[nind].slice();
			if (nind == node_to){
				nodeU[user[1]] += 1;
			}
			var nodeT = this.baseband[nind].slice();
			var node_util = this.calcUtil(nodeT, nodeU);
			util_list.push(node_util);
		}
		return this.calcStd(util_list);
	}

	this.chooseNode = function(user){
		var std_list = [0, 0, 0, 0, 0, 0];
		for (var node_to = 0; node_to < 6; node_to++){
			if (this.checkNode(node_to, user) == false){
				std_list[node_to] = 100000000;
			}
			else{
				std_list[node_to] = this.nodeStd(node_to, user);
			}
		}
		var min_std = 100000000;
		var node_ind = -1;
		for (var sind = 0; sind < 6; sind++){
			if (std_list[sind] < min_std){
				min_std = std_list[sind];
				node_ind = sind;
			}
		}
		if (min_std == 100000000){
			return false;
		}
		else {
			return {
				"node_ind": node_ind,
				"min_std": min_std
			};
		}
	}

	this.placeUser = function(node_to, user){
		var node_from = user[0];
		var mode = user[1];
		var flow = user[2];
		// place user on node, fill band_scheme
		this.band_scheme[node_to][mode] += 1;

		// place flow on path, fill flow_scheme
		if (node_to != 2 && node_to != 3){
			this.flow_scheme[node_from][node_to].mode_num[mode] += 1;
			this.flow_scheme[node_from][node_to].used += flow;
		} 
	}

	this.deepCopyFlow = function(){
		var flow_scheme = new Array();
		for (var node_from = 0; node_from < 6; node_from++){
			var flow_array = new Array();
			for (var node_to = 0; node_to < 6; node_to++){
				var flow = {
					"mode_num": this.flow_scheme[node_from][node_to].mode_num.slice(),
					"used": this.flow_scheme[node_from][node_to].used,
					"total": this.flow_scheme[node_from][node_to].total,
				};
				flow_array.push(flow);
			}
			flow_scheme.push(flow_array);
		}
		return flow_scheme;
	}

	this.deepCopyBand = function(){
		var band_scheme = new Array();
		for (var nind = 0; nind < 6; nind++){
			band_scheme.push(this.band_scheme[nind].slice());
		}
		return band_scheme;
	}

	this.deepCopyBase = function(){
		var baseband = new Array();
		for (var nind = 0; nind < 6; nind++){
			baseband.push(this.baseband[nind].slice());
		}
		return baseband;
	}

	this.countFlow = function(){
		var flow_sum = 0;
		for (var in_node = 0; in_node < 6; in_node++){
			for (var out_node = 0; out_node < 6; out_node++){
				flow_sum += this.flow_scheme[in_node][out_node].used;
			}
		}
		return flow_sum;
	}

	this.run = function(){
		this.initParams();
		this.initPerm();

		var best_std = 100000000;
		var best_flow_scheme = new Array();
		var best_band_scheme = new Array();
		var best_baseband = new Array();

		var min_flow = 100000000;
		var min_flow_scheme = new Array();
		var min_band_scheme = new Array();
		var min_baseband = new Array();

		for (var re = 0; re < this.REPEAT; re++){
			// progress bar controller
			var ratio = (re+1)/this.REPEAT;
			var proDiv = document.getElementById("progressbar");
			var progress = Number(ratio*100).toFixed(2);
			progress += "%";
			proDiv.style.width = progress;
			// progress bar end

			this.initBaseband();
			var min_std = -1;
			var success = true;
			for (var uind = 0; uind < this.users.length; uind++){
				var user = this.users[uind];
				var result = this.chooseNode(user);
				var node_to = result.node_ind;
				var min_std = result.min_std;
				if (result == false){
					// console.log("break");
					success = false;
					break;
				}
				else {
					this.placeUser(node_to, user);
				}
			}
			// decide the best_std scheme
			if (success && min_std < best_std){
				best_std = min_std;
				best_flow_scheme = this.deepCopyFlow();
				best_band_scheme = this.deepCopyBand();
				best_baseband = this.deepCopyBase();
			}
			// decide the minimum flow scheme
			if (success && this.countFlow() < min_flow){
				min_flow = this.countFlow();
				min_flow_scheme = this.deepCopyFlow();
				min_band_scheme = this.deepCopyBand();
				min_baseband = this.deepCopyBase();
			}
		}

		console.log(best_band_scheme);
		console.log(best_flow_scheme);
		console.log(min_band_scheme);
		console.log(min_flow_scheme);

		if (best_band_scheme.length == 0){
			alert("Cannot find a proper solution for the given data!");
			return false
		}
		// stophere();
		
		// construct best_std result for visualization
		var net_limit2 = [
			this.p_to_p[2][0], 
			this.p_to_p[2][1], 
			this.p_to_p[2][4], 
			this.p_to_p[2][5]
		];
		var net_limit3 = [
			this.p_to_p[3][0], 
			this.p_to_p[3][1], 
			this.p_to_p[3][4], 
			this.p_to_p[3][5]
		];
		var net_node2 = [
			best_flow_scheme[2][0].used,
			best_flow_scheme[2][1].used,
			best_flow_scheme[2][4].used, 
			best_flow_scheme[2][5].used
		];
		var net_node3 = [
			best_flow_scheme[3][0].used,
			best_flow_scheme[3][1].used,
			best_flow_scheme[3][4].used, 
			best_flow_scheme[3][5].used
		];
		var node2_flow_out = [
			best_flow_scheme[2][0].mode_num,
			best_flow_scheme[2][1].mode_num,
			best_flow_scheme[2][4].mode_num, 
			best_flow_scheme[2][5].mode_num
		];
		var node3_flow_out = [
			best_flow_scheme[3][0].mode_num,
			best_flow_scheme[3][1].mode_num,
			best_flow_scheme[3][4].mode_num, 
			best_flow_scheme[3][5].mode_num
		];
		var util = new Array();
		for (var nind = 0; nind < 6; nind++){
			var nodeU = best_band_scheme[nind].slice();
			var nodeT = best_baseband[nind].slice();
			util.push(this.calcUtil(nodeT, nodeU).toFixed(4));
		}
		var num =  [
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0]
		];
		for (var nind = 0; nind < 6; nind++){
			for (var mode = 0; mode < 4; mode++){
				num[mode][nind] = best_band_scheme[nind][mode];
			}
		}
		var parameters_best_std = {
			"net_node2": net_node2,
			"net_node3": net_node3,
			"node2_flow_out": node2_flow_out,
			"node3_flow_out": node3_flow_out,
			"net_limit2": net_limit2,
			"net_limit3": net_limit3,
			"util": util,
			"num": num,
		}

		// construct best_std result for visualization
		var net_limit2 = [
			this.p_to_p[2][0], 
			this.p_to_p[2][1], 
			this.p_to_p[2][4], 
			this.p_to_p[2][5]
		];
		var net_limit3 = [
			this.p_to_p[3][0], 
			this.p_to_p[3][1], 
			this.p_to_p[3][4], 
			this.p_to_p[3][5]
		];
		var net_node2 = [
			min_flow_scheme[2][0].used,
			min_flow_scheme[2][1].used,
			min_flow_scheme[2][4].used, 
			min_flow_scheme[2][5].used
		];
		var net_node3 = [
			min_flow_scheme[3][0].used,
			min_flow_scheme[3][1].used,
			min_flow_scheme[3][4].used, 
			min_flow_scheme[3][5].used
		];
		var node2_flow_out = [
			min_flow_scheme[2][0].mode_num,
			min_flow_scheme[2][1].mode_num,
			min_flow_scheme[2][4].mode_num, 
			min_flow_scheme[2][5].mode_num
		];
		var node3_flow_out = [
			min_flow_scheme[3][0].mode_num,
			min_flow_scheme[3][1].mode_num,
			min_flow_scheme[3][4].mode_num, 
			min_flow_scheme[3][5].mode_num
		];
		var util = new Array();
		for (var nind = 0; nind < 6; nind++){
			var nodeU = min_band_scheme[nind].slice();
			var nodeT = min_baseband[nind].slice();
			util.push(this.calcUtil(nodeT, nodeU).toFixed(4));
		}
		var num =  [
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0],
			[0,0,0,0,0,0]
		];
		for (var nind = 0; nind < 6; nind++){
			for (var mode = 0; mode < 4; mode++){
				num[mode][nind] = min_band_scheme[nind][mode];
			}
		}
		var parameters_min_flow = {
			"net_node2": net_node2,
			"net_node3": net_node3,
			"node2_flow_out": node2_flow_out,
			"node3_flow_out": node3_flow_out,
			"net_limit2": net_limit2,
			"net_limit3": net_limit3,
			"util": util,
			"num": num,
		}

		var parameters = {
			"BEST_STD": parameters_best_std,
			"MIN_FLOW": parameters_min_flow
		};
		sessionStorage.setItem("du_result", JSON.stringify(parameters));
		console.log("Finished!")
		alert("Finish algorithm!")
		return true;
	}
}

DU = new DU();