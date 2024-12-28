const textarea = document.getElementById("textbox");

function f1(e) {
	let value = e.value;
	textarea.style.fontSize = value + "px";
}

function f2(e) {
	if (textarea.style.fontWeight == "bold") {
		textarea.style.fontWeight = "normal";
		e.classList.remove("active");
	} else {
		textarea.style.fontWeight = "bold";
		e.classList.add("active");
	}
}

function f3(e) {
	if (textarea.style.fontStyle == "italic") {
		textarea.style.fontStyle = "normal";
		e.classList.remove("active");
	} else {
		textarea.style.fontStyle = "italic";
		e.classList.add("active");
	}
}

function f4(e) {
	if (textarea.style.textDecoration == "underline") {
		textarea.style.textDecoration = "none";
		e.classList.remove("active");
	} else {
		textarea.style.textDecoration = "underline";
		e.classList.add("active");
	}
}

function f5(e) {
	textarea.style.textAlign = "left";
}

function f6(e) {
	textarea.style.textAlign = "center";
}

function f7(e) {
	textarea.style.textAlign = "right";
}

function f8(e) {
	if (textarea.style.textTransform == "uppercase") {
		textarea.style.textTransform = "none";
		e.classList.remove("active");
	} else {
		textarea.style.textTransform = "uppercase";
		e.classList.add("active");
	}
}

function f9() {
	textarea.style.fontWeight = "normal";
	textarea.style.textAlign = "left";
	textarea.style.fontStyle = "normal";
	textarea.style.textTransform = "capitalize";
	textarea.value = "";
}

function f10(e) {
	let value = e.value;
	textarea.style.color = value;
}

function f11() {
	navigator.clipboard.writeText(textarea.value);
	alert("Copied the text: " + textarea.value);
}

function f12() {
	navigator.clipboard.readText().then((text) => {
        // Get the current cursor position
        const textarea = document.getElementById("textbox");
        const cursorPos = textarea.selectionStart;

        // Get the text before and after the cursor
        const beforeCursor = textarea.value.substring(0, cursorPos);
        const afterCursor = textarea.value.substring(cursorPos);

        // Insert the clipboard text at the cursor position
        textarea.value = beforeCursor + text + afterCursor;

        // Optionally, reset the cursor to the position after the pasted text
        textarea.selectionStart = textarea.selectionEnd = beforeCursor.length + text.length;
    }).catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
    });
}

window.addEventListener('load', () => {
	textarea.value = "";
});