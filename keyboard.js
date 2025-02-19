let shift = false;
let caps = false;

let lngleft = false;
let lngright = false;

let mode = false; // latin mode = false, askaoza mode when no caps and no shift and mode= true, bai mode when caps and shift and mode = true

const capslock = document.getElementById("capsstat");
const shiftkey = document.getElementById("shiftstat");
const language = document.getElementById("lngstat");
const latinmode = document.getElementById("latinstat");
const askaozamode = document.getElementById("askoazastat");
const baimode = document.getElementById("baistat");

const textbox = document.getElementById("textbox");

const doublerule = ['ü', 'Ü', 'e', 'E', 'a', 'A', 'd', 'D', 'u', 'U', 'i', 'I', 'o', 'O', '[', ']'];

let keyData = null;

fetch('keys.json')
    .then(response => response.json())
    .then(data => {
        keyData = data;
        keyUpdates();
        latinmode.setAttribute("fill", "#86A788");
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });

const debounce = (callback, delay) => {
    let debounceTimer;
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => callback(...args), delay);
    };
};

const onkey = (event) => {
    statusUpdates(event);
    keyUpdates();

    const element = document.getElementById(event.code);
    if (element) element.setAttribute('fill', event.type === 'keyup' ? '' : '#86A788');

    if (event.type === 'keydown') {
        const isControlKey = event.ctrlKey || event.altKey || event.metaKey;

        if (isControlKey) return;

        if (!["Tab", "Backspace", "Enter"].includes(event.key)) {
            event.preventDefault();
            debounce(() => textboxupdate(event), 10)();
        }
    }
};

addEventListener('keydown', onkey);
addEventListener('keyup', onkey);

function textboxupdate(event) {
    if (!keyData) return;

    let cursorPos = textbox.selectionStart;
    let chartoadd = "";
    let upper = (shift && !caps) || (!shift && caps);
    let lng = lngleft || lngright;
    let textLeft = textbox.value.slice(0, cursorPos);
    let textRight = textbox.value.slice(cursorPos);

    if ((lngleft == true) && (lngright == true)){
        mode = !mode;
    }

    if (keyData[event.code].outputwith === false) {
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

    if (mode && keyData[event.code].askaoza !== null) {
        chartoadd = keyData[event.code].askaoza;
    }
    else {
        chartoadd = upper
            ? lng
                ? keyData[event.code].languageshift
                : keyData[event.code].latinshift
            : lng
            ? keyData[event.code].language
            : keyData[event.code].latin;
    }

    if (
        chartoadd === textbox.value.charAt(cursorPos - 1) &&
        doublerule.includes(chartoadd)
    ) {
        chartoadd = upper
            ? keyData[event.code].languageshift
            : keyData[event.code].language;
        textLeft = textLeft.slice(0, -1);
    }

    textbox.value = textLeft + chartoadd + textRight;
    textbox.selectionStart = textbox.selectionEnd = textLeft.length + chartoadd.length;
}

function keyUpdates() {
    if (!keyData) return;

    for (let key in keyData) {
        if (keyData.hasOwnProperty(key)) {
            let char;
            let upper = (shift && !caps) || (!shift && caps);
            let lng = lngleft || lngright;

            if (mode && keyData[key].askaoza !== null) {
                char = keyData[key].askaoza;
                document.getElementById(key).nextElementSibling.textContent = char;
            }
            else {
                if (!upper) {
                    char = !lng ? keyData[key].latin : keyData[key].language;
                } else {
                    char = !lng ? keyData[key].latinshift : keyData[key].languageshift;
                }

                document.getElementById(key).nextElementSibling.textContent = char;

                if (doublerule.includes(char)) {
                    document.getElementById(key).nextElementSibling.setAttribute('fill', '#FDFD96');
                } else {
                    document.getElementById(key).nextElementSibling.setAttribute('fill', 'white');
                }
            }

            //console.log("mode:" + mode + ", " + keyData[key].askaoza);
        }
    }
}

function statusUpdates(event) {
    if (event.getModifierState('CapsLock')) {
        caps = true;
        capslock.setAttribute("fill", "#86A788");
    } else {
        caps = false;
        capslock.setAttribute("fill", "");
    }

    if (event.key === 'Shift') {
        shift = event.type === 'keydown';
    }

    shiftkey.setAttribute("fill", shift ? "#86A788" : "");

    if (event.key === 'z' || event.key === 'Z') {
        lngleft = event.type === 'keydown';
    }

    if (event.key === '/' || event.key === '?') {
        lngright = event.type === 'keydown';
    }

    language.setAttribute("fill", lngleft || lngright ? "#86A788" : "");
}
