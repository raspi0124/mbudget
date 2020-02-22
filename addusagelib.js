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

function getrecentdocid(){
	var y = document.getElementById("docidstore")
	return y.innerHTML
}

//直前に実行されたドキュメントの削除
function undo(){
	toremove = getrecentdocid()
	deletedoc(toremove)
	notify("直前の追加アクションを取り消しました")
}

function returnbalance(){
	console.log("returnbalance")
	var x = document.getElementById("balancestore")
	var a = x.innerHTML
	return a
}

function getInputValue(id){
	// Selecting the input element and get its value
	console.log(id)
	var inputVal = document.getElementById(id).value;
	console.log(inputVal)
	return inputVal;
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

function clickedaddusage(){
	console.log("clickedaddusage")
	usedamount = getInputValue("usage")
	reason = getInputValue("category")
	if (usedamount != "" || usedamount != null) {
		prevbalance = returnbalance()
		nowbalance = parseInt(prevbalance) - parseInt(usedamount)
		if (isittoday == "true") {
			commitmyusage(usedamount, reason, nowbalance, "true")
		}
		else if (isittoday == "false") {
			commitmyusage(usedamount, reason, nowbalance, "false")
		}
		notify("追加しました!")
	}
	else {
		notify("Invalid input")
	}
}

function clickedinitbalance(){
	console.log("clickednewbalance")
	newbalance = getInputValue("newbalance")
	if (newbalance != "" || newbalance != null) {
		newbalance = parseInt(newbalance)
		initbalance(newbalance)
	}
}

function commitmyusage(used, reason, currentbalance, todayf) {
	//Sepcify sec in normal sec. I'm done with mili sec.
		timestamp = Math.floor(Date.now()/1000); //秒単位でのタイムスタンプの保存
		db.collection("usage").add({
				 currentbalance: currentbalance,
				 used: used,
				 reason: reason,
				 created_at: timestamp,
				 todayf: todayf
				 isinit: "false"
		 })
		 .then(function(docRef) {
				 console.log("Document written with ID: ", docRef.id);
		 })
		 .catch(function(error) {
				 console.error("Error adding document: ", error);
		 });

}

function initbalance(newbalance) {
	//Sepcify sec in normal sec. I'm done with mili sec.
		timestamp = Math.floor(Date.now()/1000); //秒単位でのタイムスタンプの保存
		db.collection("usage").add({
				 currentbalance: newbalance,
				 used: "0",
				 reason: "init",
				 created_at: timestamp,
				 isinit: "true"
		 })
		 .then(function(docRef) {
				 console.log("Document written with ID: ", docRef.id);
				 notify("残高を " + newbalance + " に設定しました!")
		 })
		 .catch(function(error) {
				 console.error("Error adding document: ", error);
		 });
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


db.collection("usage").orderBy("created_at", "desc").limit(1)
  .onSnapshot(function(querySnapshot) {
		currentbalances = [];
		var docids = [];
    querySnapshot.forEach(function(doc) {
			currentbalances.push(doc.data().currentbalance)
			docids.push(doc.id)
    });
		var x = document.getElementById("balancestore")
		x.innerHTML = currentbalances[0]
		var y = document.getElementById("docidstore")
		y.innerHTML = docids[0]
  });
