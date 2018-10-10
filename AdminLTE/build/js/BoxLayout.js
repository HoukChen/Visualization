
function dobalance(){
	var tt = Balance.TASKS;
	Balance.LBFT.length = 0;
	Balance.WLCT.length = 0;
	Balance.WRRT.length = 0;
	Balance.LOAD.length = 0;
	var tvar = JSON.parse(sessionStorage.getItem("balance_parameter"));
	console.log(tvar);

	for(var i = 1;i < 10; i++ ){
		Balance.LBFT.push(Math.round((0.1 * i + 0.05 * Math.random())*100)/100);
		Balance.WLCT.push(Math.round((Balance.LBFT[i-1] + (0.04 + Math.random()* 0.02) * i)*100)/100);
		Balance.WRRT.push(Math.round((Balance.WLCT[i-1] + (0.05 + Math.random()* 0.04) * i)*100)/100);
	}
	Balance.LOAD.push(0);
	var bl = Balance.TASKS.length;
	var thh = (tvar.vmstorage.large * tvar.vmnumber.large/tvar.vmcapacity.large + tvar.vmstorage.middle * tvar.vmnumber.middle/tvar.vmcapacity.middle +tvar.vmstorage.small * tvar.vmnumber.small/tvar.vmcapacity.small)/10;
	
	for(var i = 0; i < bl + 5; i++ ){
		var coin = Math.random();
		if( Balance.LOAD[i] > thh|| coin > 0.85 || i >= bl){
			Balance.LOAD.push(Balance.LOAD[i] * (0.8 + Math.random() * 0.1));
		}else{
			var cost = (Math.random()*0.2 + 0.5) * 100 * (0.7+ Math.random()*0.1);
			Balance.LOAD.push(Balance.LOAD[i] + Balance.TASKS[i] * (0.8 + Math.random()*0.2) * 10 - cost);
		}
		if(Balance.LOAD[i+1] < 0){
			Balance.LOAD[i+1] = 0;
		}
	}
	//console.log(Balance.LBFT);
	//console.log(Balance.WLCT);
	//console.log(Balance.WRRT);
	//console.log(Balance.TASKS);
	//console.log(Balance.LOAD);
}
