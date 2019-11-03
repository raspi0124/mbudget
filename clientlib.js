function clientupdate(name, updateto) {
  if (name == "tu") { //Today's usage
    var tu = document.getElementById("todayusage");
    tu.innerHTML = "￥" + updateto + "";
  }
  if (name == "bpd") { //Budget per day, Likely be divided by Total balance divided by remaining number of 平日
    var bpd = document.getElementById("budgetperday")
    bpd.innerHTML = "￥" + updateto + "";
  }
	if (name == "remainingb") { //Remaining Balance
		var bpd = document.getElementById("remainingbalance")
		bpd.innerHTML = "￥" + updateto + "";
	}
  //if (name == "totalb") { //Total Balance
  //  var bpd = document.getElementById("totalbalance")
  //  bpd.innerHTML = "￥" + updateto + "";
  //}
}

function getmonthend() {
		var today = new Date();
		var monthend = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		var strend = monthend.getDate()
		return strend;
}

function updatebudgetperday(currentbalance){
	var today = new Date();
	var monthend = getmonthend()
	var todaydate = today.getDate()
	var month = parseInt(today.getMonth()) + 1
	var year = today.getFullYear()
	starting = year + "-" + month + "-" + todaydate;
	ending = year + "-" + month + "-" + monthend;
	console.log("starting and ending")
	console.log(starting)
	console.log(ending)
	var remaining = koyomi.biz(starting, ending);
	console.log("Remaining weekday:", remaining)
	var divided = Math.floor(parseInt(currentbalance)/parseInt(remaining));
	clientupdate("bpd", divided)
}


function returnbalance(){
	console.log("returnbalance")
	var x = document.getElementById("balancestore")
	var a = x.innerHTML
	return a
}



function sum(numbers){
	var sum = 0;
	console.log("sum")
	console.log(numbers)
	for (var i = 0; i < numbers.length; i++) {
		var inted = parseInt(numbers[i])
  	sum += inted
	}
	console.log(sum)
	return sum
}

var latestrecieve = 0 //初回はここでdefineすることによってundefined variableエラーを回避
function upclientusagelog(used, reason, created_at, docid) {
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
	var docidforh = "'" + docid + "'"
	var delfun = "deletedoc(" + docidforh + ")"
  var toadd = '<li class="list-group-item">\
		<div class="row align-items-center no-gutters"> <div>\
    <h6> <strong> ￥' + used + ' </strong></h6> <span class = "text-xs"> ' + reason + ', ' + csrdate + '  <br><a style="visibility:hidden;">aa</a><div id="delbutton"><a onclick=' + delfun + ' class="btn-flat-simple">DELETE THIS USAGE</a></div>  </span></div>\
    </div> </li>'
	var old = x.innerHTML
	if (latestrecieve != timestamp){ //こうすることによって一緒の追加セッションでここに来たかそれとも別のセッション(リッスン)でここに来たかを判別。
		//普通にelseのやつのみでやると重複が出てくるので。処理速度が遅い端末だとバグる可能性?
		//この↓のやつだけでいいと思うかもしれないけどこれだと一つの要素しか入ってくれない。(既存の要素を新規要素受信時に消してしまう)
		x.innerHTML = toadd
	} else {
		x.innerHTML = toadd + old
	}
	latestrecieve = timestamp
	//x.innerHTML = toadd //本来なら↑のコメントアウトされてるやつのほうがいいんだけどsnapshotからaddする方法がうーん
}

function usagelogadder(useds, reasons, created_ats, docids, isinits){
	//リバースしないとめんどくさい。具体的に言うと古→新順にログが並んでしまうため一回リバース(反転)。
	var ruseds = useds.reverse();
	var rreasons = reasons.reverse();
	var rcreated_ats = created_ats.reverse();
	var rdocids = docids.reverse();
	var risinits = isinits.reverse();
	for (var i = 0; i < useds.length; i++) { //Suppose that all the element are fullfilled
	 console.log(ruseds[i])
	 if (risinits[i] != "true"){
	 	upclientusagelog(ruseds[i], rreasons[i], rcreated_ats[i], rdocids[i])
		}
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
	 var useda = useds[i]
	 var re = isittoday(cs)
	 if (re=="true"){
		 todayusage.push(useda);
	 }else {
	 }
	}
	console.log("todayusageupdater")
	console.log(sum(todayusage))
	clientupdate("tu", sum(todayusage))
}

function notify(text){
	Toastify({
		text: text,
		duration: 5000,
		newWindow: true,
		close: true,
		gravity: "top", // `top` or `bottom`
		position: 'right', // `left`, `center` or `right`
		backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
		stopOnFocus: true // Prevents dismissing of toast on hover
	}).showToast();
}

function deletedoc(id){
	db.collection("usage").doc(id).delete().then(function() {
    console.log("Succefully deleted: " + id);
		notify("正常に削除しました!")
}).catch(function(error) {
    console.error("Error removing document: ", error);
});

}

function getRemanningDays() {
				var date = new Date();
				var time = new Date(date.getTime());
				time.setMonth(date.getMonth() + 1);
				time.setDate(0);
				var days =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
				console.log("Remaining days:" + days)
				return days
}

db.collection("usage").orderBy("created_at", "desc").limit(500)
  .onSnapshot(function(querySnapshot) {
    var useds = [];
    var created_ats = [];
		currentbalances = []; //Removed var to make it global
		var reasons = [];
		var docids = [];
		var isinits = [];
    querySnapshot.forEach(function(doc) {
      useds.push(doc.data().used);
			created_ats.push(doc.data().created_at)
			currentbalances.push(doc.data().currentbalance)
			reasons.push(doc.data().reason)
			isinits.push(doc.data().isinit)
			docids.push(doc.id)
    });
    var toprint = currentbalances.join(", ");
		console.log(reasons)
		console.log(useds)
		console.log(currentbalances)
		console.log(created_ats)
		console.log(docids)
		usagelogadder(useds, reasons, created_ats, docids, isinits)
		balanceupdater(currentbalances)
		clientupdate("remainingb", currentbalances[0])
		todayusageupdater(useds, created_ats)
		updatebudgetperday(currentbalances[0])
		var x = document.getElementById("balancestore")
		x.innerHTML = currentbalances[0]
  });
