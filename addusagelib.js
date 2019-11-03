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


function clickedaddusage(){
	console.log("clickedaddusage")
	usedamount = getInputValue("usage")
	reason = getInputValue("category")
	if (usedamount != "" || usedamount != null) {
		prevbalance = returnbalance()
		nowbalance = parseInt(prevbalance) - parseInt(usedamount)
		commitmyusage(usedamount, reason, nowbalance)
		Toastify({
		  text: "Commited!",
		  duration: 5000,
		  newWindow: true,
		  close: true,
		  gravity: "top", // `top` or `bottom`
		  position: 'right', // `left`, `center` or `right`
		  backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
		  stopOnFocus: true // Prevents dismissing of toast on hover
		}).showToast();
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
		 //$.notify("追加しました!", "success");

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
    querySnapshot.forEach(function(doc) {
      useds.push(doc.data().used);
			created_ats.push(doc.data().created_at)
			currentbalances.push(doc.data().currentbalance)
    });
		var x = document.getElementById("balancestore")
		x.innerHTML = currentbalances[0]
  });
