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
