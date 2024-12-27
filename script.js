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

keyUpdates();

latinmode.setAttribute("fill", "lime");

const onkey = event => {
    statusUpdates();
    keyUpdates()

    event.preventDefault();
    const element = document.getElementById(event.code);
    if (element) element.setAttribute('fill', event.type === 'keyup' ? 'lightgrey' : 'red');
};

addEventListener('keydown', onkey);
addEventListener('keyup', onkey);

function keyUpdates(){
    fetch('keys.json').then(response => response.json()).then(data => {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                //document.getElementById(key).nextElementSibling.textContent = data[key].latin;

                let upper = ((!shift && caps) || (shift && !caps));
                let lng = (lngleft || lngright)
                
                if (!upper){
                    if (!lng){
                        document.getElementById(key).nextElementSibling.textContent = data[key].latin;
                    }
                    else {
                        document.getElementById(key).nextElementSibling.textContent = data[key].language;
                    }
                }
                else {
                    if (!lng){
                        document.getElementById(key).nextElementSibling.textContent = data[key].latinshift;
                    }
                    else {
                        document.getElementById(key).nextElementSibling.textContent = data[key].languageshift;
                    }
                }

            }
          }
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });
}

function statusUpdates(){
    if (event.getModifierState('CapsLock')) {
        capslock.setAttribute("fill", "lime")
        caps = true;
    } else {
        capslock.setAttribute("fill", "lightgrey")
        caps = false;
    }

    if (event.key === 'Shift') {
        shift = event.type === 'keydown';
    }

    if (event.key === 'z' || event.key === 'Z') {
        lngleft = event.type === 'keydown';
    }

    if (shift) {
        shiftkey.setAttribute("fill", "lime");
    } 
    else {
        shiftkey.setAttribute("fill", "lightgrey");
    }

    if (event.key === '/' || event.key === '?') {
        lngright = event.type === 'keydown';
    }

    if (lngleft || lngright) {
        language.setAttribute("fill", "lime");
    } 
    else {
        language.setAttribute("fill", "lightgrey");
    }
}