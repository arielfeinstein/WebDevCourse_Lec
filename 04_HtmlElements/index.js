document.addEventListener("DOMContentLoaded", () => pageLoaded());

let txt1;
let txt2;
let btn;
let lblRes;
let txtAppend;
let btnAppend;




function pageLoaded() {
    txt1 = document.getElementById("txt1");
    txt2 = document.querySelector("#txt2"); // basically same as getElementById
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");

    btn.addEventListener("click", () => {
        calculate();
    });

    // validate inputs on-the-fly
    if (txt1) txt1.addEventListener("input", validateInputs);
    if (txt2) txt2.addEventListener("input", validateInputs);
    const opEl = document.getElementById("op");
    if (opEl) opEl.addEventListener("change", validateInputs);
    // run initial validation to clear/set initial message
    validateInputs();

    // append input/button (added in HTML)
    txtAppend = document.getElementById("txtAppend");
    btnAppend = document.getElementById("btnAppend");
    if (btnAppend) {
        btnAppend.addEventListener("click", () => {
            if (txtAppend) {
                print(txtAppend.value, true);
                txtAppend.value = "";
            }
        });
    }



}

function validateInputs() {
    if (!txt1 || !txt2 || !lblRes || !btn) return true;

    const opEl = document.getElementById("op");
    const op = opEl ? opEl.value : "+";
    const num1 = parseFloat(txt1.value);
    const num2 = parseFloat(txt2.value);

    let valid = true;
    if (isNaN(num1) || isNaN(num2)) {
        lblRes.innerText = "Invalid input";
        lblRes.style.color = "red";
        valid = false;
    }
    else if (op === "/" && num2 === 0) {
        lblRes.innerText = "Division by zero";
        lblRes.style.color = "red";
        valid = false;
    }
    else {
        lblRes.innerText = "Valid inputs";
        lblRes.style.color = "green";
        valid = true;
    }

    // enable/disable calculate button based on validity
    try {
        btn.disabled = !valid;
    }
    catch (e) {
        // ignore if btn isn't available for any reason
    }

    return valid;
}

function calculate() {
    if (txt1 && txt2) {
        const opEl = document.getElementById("op");
        const op = opEl ? opEl.value : "+";
        const num1 = parseFloat(txt1.value);
        const num2 = parseFloat(txt2.value);

        if (isNaN(num1) || isNaN(num2)) {
            lblRes.innerText = "Invalid input";
            lblRes.style.color = "red";
            return;
        }

        let result;
        switch (op) {
            case "+":
                result = num1 + num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "/":
                if (num2 === 0) {
                    lblRes.innerText = "Division by zero";
                    lblRes.style.color = "red";
                    return;
                }
                result = num1 / num2;
                break;
            default:
                lblRes.innerText = "Unknown operator";
                lblRes.style.color = "red";
                return;
        }

        // show result (neutral color)
        lblRes.innerText = result;
        lblRes.style.color = "black";
    }
}

const btn2 = document.getElementById("btn2");
btn2.addEventListener("click", () => {
    print(`btn2 clicked: id=${btn2.id}, innerText=${btn2.innerText}`);
});

function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) { return fn(a, b); }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    print(out);
}

function print(msg, append = false) {
    const ta = document.getElementById("output");
    if (ta) {
        if (append) {
            ta.value += "\n" + msg;
        }
        else {
            ta.value = msg;
        }
        // print everything to log anyway
        console.log(msg);
    }
}