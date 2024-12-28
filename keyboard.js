let shift = false;
let caps = false;

let lngleft = false;
let lngright = false;

let mode = false; // false = latin, true = ask/bai :D

const capslock = document.getElementById("capsstat");
const shiftkey = document.getElementById("shiftstat");
const language = document.getElementById("lngstat");
const latinmode = document.getElementById("latinstat");
const askaozamode = document.getElementById("askoazastat");
const baimode = document.getElementById("baistat");

const textbox = document.getElementById("textbox");

const doublerule = ['ü', 'Ü', 'e', 'E', 'a', 'A', 'd', 'D', 'u', 'U', 'i', 'I', 'o', 'O', '[', ']'];

keyUpdates();

latinmode.setAttribute("fill", "#86A788");

const onkey = event => {
    statusUpdates(event);
    keyUpdates()

    event.preventDefault();
    const element = document.getElementById(event.code);
    if (element) element.setAttribute('fill', event.type === 'keyup' ? '' : '#86A788');

    if (event.type === 'keydown'){
        textboxupdate(event);
    }

};

addEventListener('keydown', onkey);
addEventListener('keyup', onkey);

function textboxupdate(event) {
    let textbox = document.getElementById("textbox");
    let cursorPos = textbox.selectionStart;

    fetch('keys.json').then(response => response.json()).then(data => {
            let chartoadd = "";
            let upper = ((!shift && caps) || (shift && !caps));
            let lng = (lngleft || lngright);
            let textLeft = textbox.value.slice(0, cursorPos);
            let textRight = textbox.value.slice(cursorPos);

            if (data[event.code].outputwith === false) {
                if (event.code === "Backspace" && cursorPos > 0) {
                    textLeft = textLeft.slice(0, -1);
                } else if (event.code === "Tab") {
                    textLeft += "  ";
                } else if (event.code === "Enter") {
                    textLeft += "\n";
                }

                textbox.value = textLeft + textRight;
                textbox.selectionStart = textbox.selectionEnd = textLeft.length;
                return;
            }

            if (!upper) {
                if (!lng) {
                    chartoadd = data[event.code].latin;
                } else {
                    chartoadd = data[event.code].language;
                }

            } else {
                if (!lng) {
                    chartoadd = data[event.code].latinshift;
                } else {
                    chartoadd = data[event.code].languageshift;
                }
            }

            if (chartoadd === textbox.value.charAt(cursorPos - 1) && doublerule.includes(chartoadd)){
                if (!upper){
                    chartoadd = data[event.code].language;
                } else {
                    chartoadd = data[event.code].languageshift;
                }

                textLeft = textLeft.slice(0, -1);
            }

            textbox.value = textLeft + chartoadd + textRight;
            textbox.selectionStart = textbox.selectionEnd = textLeft.length + chartoadd.length;
        });
}


function keyUpdates(){
    fetch('keys.json').then(response => response.json()).then(data => {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                //document.getElementById(key).nextElementSibling.textContent = data[key].latin;

                let char;
                let upper = ((!shift && caps) || (shift && !caps));
                let lng = (lngleft || lngright)
                
                if (!upper){
                    if (!lng){
                        char = data[key].latin
                        document.getElementById(key).nextElementSibling.textContent = char;
                    }
                    else {
                        char = data[key].language
                        document.getElementById(key).nextElementSibling.textContent = char;
                    }
                }
                else {
                    if (!lng){
                        char = data[key].latinshift
                        document.getElementById(key).nextElementSibling.textContent = char;
                    }
                    else {
                        char = data[key].languageshift
                        document.getElementById(key).nextElementSibling.textContent = char;
                    }
                }
                if (doublerule.includes(char)){
                    document.getElementById(key).nextElementSibling.setAttribute('fill', '#FDFD96');
                } else {
                    document.getElementById(key).nextElementSibling.setAttribute('fill', 'white');
                }
            }
        }
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });
}

function statusUpdates(event){
    if (event.getModifierState('CapsLock')) {
        capslock.setAttribute("fill", "#86A788")
        caps = true;
    } else {
        capslock.setAttribute("fill", "")
        caps = false;
    }

    if (event.key === 'Shift') {
        shift = event.type === 'keydown';
    }

    if (event.key === 'z' || event.key === 'Z') {
        lngleft = event.type === 'keydown';
    }

    if (shift) {
        shiftkey.setAttribute("fill", "#86A788");
    } 
    else {
        shiftkey.setAttribute("fill", "");
    }

    if (event.key === '/' || event.key === '?') {
        lngright = event.type === 'keydown';
    }

    if (lngleft || lngright) {
        language.setAttribute("fill", "#86A788");
    } 
    else {
        language.setAttribute("fill", "");
    }
}