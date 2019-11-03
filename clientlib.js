function clientupdate(name, updateto) {
  if (name == "tu") { //Today's usage
    var tu = document.getElementById("todayusage");
    tu.innerHTML = "￥" + updateto + "";
  }
  if (name == "bpd") { //Budget per day, Likely be divided by Total balance divided by remaining number of 平日
    var bpd = document.getElementById("budgetperday")
    bpd.innerHTML = "￥" + updateto + "";
  }
	if (name == "remainingb") { //Total Balance
		var bpd = document.getElementById("remainingbalance")
		bpd.innerHTML = "￥" + updateto + "";
	}
  //if (name == "totalb") { //Total Balance
  //  var bpd = document.getElementById("totalbalance")
  //  bpd.innerHTML = "￥" + updateto + "";
  //}
}


function returnbalance(){
	return currentbalances[0];
}

function getInputValue(id){
	// Selecting the input element and get its value
	console.log(id)
	var inputVal = document.getElementById(id).value;
	console.log(inputVal)
	return inputVal;
}


function clickedaddusage(){
	console.log("clickedaddusage")
	usedamount = getInputValue("usage")
	reason = getInputValue("category")
	if (usedamount != "" || usedamount != null) {
		prevbalance = returnbalance()
		nowbalance = parseInt(prevbalance) - parseInt(usedamount)
		commitmyusage(usedamount, reason, nowbalance)
	}
}

function commitmyusage(used, reason, currentbalance) {
	//Sepcify sec in normal sec. I'm done with mili sec.
		timestamp = Math.floor(Date.now()/1000); //秒単位でのタイムスタンプの保存
		db.collection("usage").add({
				 currentbalance: currentbalance,
				 used: used,
				 reason: reason,
				 created_at: timestamp
		 })
		 .then(function(docRef) {
				 console.log("Document written with ID: ", docRef.id);
		 })
		 .catch(function(error) {
				 console.error("Error adding document: ", error);
		 });
		 $.notify("追加しました!", "success");

}

function sum(input){
 if (toString.call(input) !== "[object Array]")
  return false;

  var total =  0;
  for(var i=0;i<input.length;i++)
    {
      if(isNaN(input[i])){
    		continue;
      }
      total += Number(input[i]);
    }
	return total;
}

var latestrecieve = 0 //初回はここでdefineすることによってundefined variableエラーを回避
function upclientusagelog(used, reason, created_at) {
	var timestamp = Math.floor(Date.now()/1000);
	var x = document.getElementById("usagelog")
	console.log("updateclientusagelog")
	console.log(created_at)
	var created_at = parseInt(created_at)
	console.log(created_at)
	var csrmili = Math.floor(created_at*1000); //標準ではミリ秒ではなく秒でtimestampになっているので
	var csr = new Date(csrmili)
	console.log(csr)
	var csrmonth = csr.getMonth() + 1
	var csrdate = csr.getFullYear() + "/" + csrmonth + "/"+ csr.getDate()
  var toadd = '<li class="list-group-item">\
		<div class="row align-items-center no-gutters"> <div>\
    <h6> <strong> ￥' + used + ' </strong></h6> <span class = "text-xs"> ' + reason + ', ' + csrdate + '  </span></div>\
    </div> </li>'
	var old = x.innerHTML
	if (latestrecieve != timestamp){ //こうすることによって一緒の追加セッションでここに来たかそれとも別のセッション(リッスン)でここに来たかを判別。
		//普通にelseのやつのみでやると重複が出てくるので。処理速度が遅い端末だとバグる可能性?
		//この↓のやつだけでいいと思うかもしれないけどこれだと一つの要素しか入ってくれない。(既存の要素を新規要素受診時に消してしまう)
		x.innerHTML = toadd
	} else {
		x.innerHTML = toadd + old
	}
	latestrecieve = timestamp
	//x.innerHTML = toadd //本来なら↑のコメントアウトされてるやつのほうがいいんだけどsnapshotからaddする方法がうーん
}

function usagelogadder(useds, reasons, created_ats){
	//リバースしないとめんどくさい。具体的に言うと古→新順にログが並んでしまうため一回リバース(反転)。
	var useds = useds.reverse();
	var reasons = reasons.reverse();
	var created_ats = created_ats.reverse();
	for (var i = 0; i < useds.length; i++) { //Suppose that all the element are fullfilled
	 console.log(useds[i])
	 upclientusagelog(useds[i], reasons[i], created_ats[i])
	 todayusageupdater(useds, created_ats)
	}
}


function balanceupdater(currentbalances){
	var len = currentbalances.length
	var i = len - 1
	clientupdate("remainingb", currentbalances[i])
}

function isittoday(timestamp){
	var timestamp = parseInt(timestamp)
	var csrmili = Math.floor(timestamp*1000);
	var today = new Date().setHours(0, 0, 0, 0);
	var thatDay = new Date(csrmili).setHours(0, 0, 0, 0);

	if(today === thatDay){
    return "true";
	}else {
		return "false";
	}
}

function todayusageupdater(useds, created_ats){
	todayusage = [0]; //Initialize by having 0. This way, no undefined occur.
	for (var i = 0; i < created_ats.length; i++) {
	 var cs = created_ats[i]
	 var used = useds[i]
	 var re = isittoday(cs)
	 if (re=="true"){
		 todayusage.push(used);
	 }else {
	 }
	}
	clientupdate("tu", sum(todayusage))
}

db.collection("usage").orderBy("created_at", "desc").limit(10)
  .onSnapshot(function(querySnapshot) {
    var useds = [];
    var created_ats = [];
		currentbalances = []; //Removed var to make it global
		var reasons = [];
    querySnapshot.forEach(function(doc) {
      useds.push(doc.data().used);
			created_ats.push(doc.data().created_at)
			currentbalances.push(doc.data().currentbalance)
			reasons.push(doc.data().reason)
    });
    var toprint = currentbalances.join(", ");
		console.log(reasons)
		console.log(useds)
		console.log(currentbalances)
		console.log(created_ats)
		usagelogadder(useds, reasons, created_ats)
		balanceupdater(currentbalances)
  });
