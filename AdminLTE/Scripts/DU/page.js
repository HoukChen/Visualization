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

function addRow(){
	var table = document.getElementById("pos_mode_num");
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

function deleteRow(dRow){
	if(confirm("确定删除?")){
		var di = dRow.parentNode.rowIndex;
		document.getElementById("pos_mode_num").deleteRow(di);
	}
}

function calculate(){
	var para = Parser.parameters;
	for (var row=0; row<para.pieces_modes.length; row++){
		for (var col=0; col<para.pieces_modes[0].length; col++){
			var id = "rc"+row.toString()+col.toString();
			para.pieces_modes[row][col] = document.getElementById(id).value;
		}
	}
	for (var row=0; row<para.p_to_p.length; row++){
		for (var col=0; col<para.p_to_p[0].length; col++){
			var id = "bd"+row.toString()+col.toString();
			para.p_to_p[row][col] = document.getElementById(id).value;
		}
	}
	for (var col=0; col<para.mode_flow.length; col++){
		var id = "cb"+col.toString();
		para.mode_flow[col] = document.getElementById(id).value;
	}

	var table = document.getElementById("pos_mode_num");
	trows = table.rows;

	para.users = [];
	for (var i = 1; i < trows.length; i++){
		var trow = trows.item(i);
		var tobj = [
			trow.cells.item(0).innerHTML,
			trow.cells.item(1).innerHTML,
			trow.cells.item(2).innerHTML
		];
		para.users.push(tobj);
	}
	DU.run();
	window.location.href = "baseband.html"	
}
