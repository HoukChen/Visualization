function du_loadPage(){
	alert("Load parameters for DU algorihtm");
	var para = Parser.parameters;
	for (var row=0; row<para.pieces_modes.length; row++){
		for (var col=0; col<para.pieces_modes[0].length; col++){
			var id = "rc"+row.toString()+col.toString();
			document.getElementById(id).value = para.pieces_modes[row][col];
		}
	}
	for (var row=0; row<para.p_to_p.length; row++){
		for (var col=0; col<para.p_to_p[0].length; col++){
			var id = "bd"+row.toString()+col.toString();
			document.getElementById(id).value = para.p_to_p[row][col];
		}
	}
	for (var col=0; col<para.mode_flow.length; col++){
		var id = "cb"+col.toString();
		document.getElementById(id).value = para.mode_flow[col];
	}
	for (var row=0; row<para.users.length; row++){
		var table = document.getElementById("pos_mode_num");
		var tr = table.insertRow(1);
		var td0 = tr.insertCell(0);
		var td1 = tr.insertCell(1);
		var td2 = tr.insertCell(2);
		var td3 = tr.insertCell(3);
		td0.innerHTML = para.users[row][0];
		td1.innerHTML = para.users[row][1];
		td2.innerHTML = para.users[row][2];
		td3.innerHTML = "删除";
		td3.setAttribute("onclick","deleteRow(this)");
	}
}
function Du_verify(){
	this.para_v = function(){
		var errormsg = "以下参数有误：\n";var correct = true;
		for (var row=0; row<Parser.parameters.pieces_modes.length; row++){
			for (var col=0; col<Parser.parameters.pieces_modes[0].length; col++){
				if(Parser.parameters.pieces_modes[row][col]==null||Parser.parameters.pieces_modes[row][col] == ""||isNaN(Parser.parameters.pieces_modes[row][col])){
					errormsg += "pieces_mode矩阵";
					errormsg += (1+row);errormsg += "行";
					errormsg += (1+col);errormsg += "列\n";
					correct = false;
				}
			}
		}
		for (var row=0; row<Parser.parameters.p_to_p.length; row++){
			for (var col=0; col<Parser.parameters.p_to_p[0].length; col++){
				if(Parser.parameters.p_to_p[row][col]==null||Parser.parameters.p_to_p[row][col] == ""||isNaN(Parser.parameters.p_to_p[row][col])){
					errormsg += "p_to_p矩阵";
					errormsg += (1+row);errormsg += "行";
					errormsg += (1+col);errormsg += "列\n";
					correct = false;
				}
			}
		}
		for (var col=0; col<Parser.parameters.mode_flow.length; col++){
			if(Parser.parameters.mode_flow[col]==null||Parser.parameters.mode_flow[col] == ""||isNaN(Parser.parameters.mode_flow[col])){
				errormsg += "p_to_p矩阵";errormsg += (1+col);errormsg += "列\n";
				correct = false;
			}
		}
		if(Parser.parameters.users==null){
			errormsg += "users用户列表\n";
			correct = false;
		}
		if(correct == false){
			errormsg += "请检查参数输入是否正确,如：输入格式不正确，有输入为空等";
			alert(errormsg);
			return -1;
		}
		return 0;
	}
	this.addn_v = function(){
		if(document.getElementById("ci0").value != 2 && document.getElementById("ci0").value != 3){
			alert("初始单板数输入非法");
			return -1;
		}
		if(document.getElementById("ci1").value != 0 && document.getElementById("ci1").value != 1 && document.getElementById("ci1").value != 2 &&document.getElementById("ci1").value != 3 ){
			alert("制式号输入非法");
			return -1;
		}
		if(document.getElementById("ci2").value == ""||document.getElementById("ci2").value == null||isNaN(document.getElementById("ci2").value)){
			alert("小区数量输入非法");
			return -1;
		}
		return 0;
	}
}
var pv = new Du_verify();

function addRow(){
	var table = document.getElementById("pos_mode_num");
	if(pv.addn_v()==0){
		var tr = table.insertRow(1);
		var td0 = tr.insertCell(0);
		var td1 = tr.insertCell(1);
		var td2 = tr.insertCell(2);
		var td3 = tr.insertCell(3);
		td0.innerHTML = document.getElementById("ci0").value;
		td1.innerHTML = document.getElementById("ci1").value;
		td2.innerHTML = document.getElementById("ci2").value;
		td3.innerHTML = "删除";
		td3.setAttribute("onclick","deleteRow(this)");
	}
}
function clearRow(){
	document.getElementById("ci0").value = "";
	document.getElementById("ci1").value = "";
	document.getElementById("ci2").value = "";
}
function deleteRow(dRow){
	if(confirm("确定删除?")){
		var di = dRow.parentNode.rowIndex;
		document.getElementById("pos_mode_num").deleteRow(di);
	}
}

function calculate(){
	Parser.parameters = JSON.parse(du_para_text);
	for (var row=0; row<Parser.parameters.pieces_modes.length; row++){
		for (var col=0; col<Parser.parameters.pieces_modes[0].length; col++){
			var id = "rc"+row.toString()+col.toString();
			Parser.parameters.pieces_modes[row][col] = parseInt(document.getElementById(id).value);
		}
	}
	for (var row=0; row<Parser.parameters.p_to_p.length; row++){
		for (var col=0; col<Parser.parameters.p_to_p[0].length; col++){
			var id = "bd"+row.toString()+col.toString();
			Parser.parameters.p_to_p[row][col] = parseInt(document.getElementById(id).value);
		}
	}
	for (var col=0; col<Parser.parameters.mode_flow.length; col++){
		var id = "cb"+col.toString();
		Parser.parameters.mode_flow[col] = parseInt(document.getElementById(id).value);
	}

	var table = document.getElementById("pos_mode_num");
	trows = table.rows;

	Parser.parameters.users = [];
	for (var i = 1; i < trows.length; i++){
		var trow = trows.item(i);
		var tobj = [
			parseInt(trow.cells.item(0).innerHTML),
			parseInt(trow.cells.item(1).innerHTML),
			parseInt(trow.cells.item(2).innerHTML)
		];
		Parser.parameters.users.push(tobj);
	}
	if(pv.para_v() == 0){
		sessionStorage.setItem("du_parameter", JSON.stringify(Parser.parameters));
		if (DU.run()){
			window.location.href = "baseband.html";
		}
		else{
			return false;
		}
	}

	
}
