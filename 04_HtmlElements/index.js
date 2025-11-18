document.addEventListener("DOMContentLoaded", () => pageLoaded());

let txt1;
let txt2;
let btn;
let lblRes;




function pageLoaded() {
    txt1 = document.getElementById("txt1");
    txt2 = document.querySelector("#txt2"); // basically same as getElementById
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");
    
    btn.addEventListener("click", () => {
        calculate();
    });
    
    

}

function calculate() {
    if (txt1 && txt2) {
        let num1 = parseFloat(txt1.value);
        let num2 = parseFloat(txt2.value);
        let result = num1 + num2;
        lblRes.innerText = result;
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
    out += "\nMap x2 → " + arr.map(x=>x*2).join(", ");

    // Functions as variables
    const add = function(a,b){ return a+b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3,4);

    // Callback
    function calc(a,b,fn){ return fn(a,b); }
    const result = calc(10,20,(x,y)=>x+y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    print(out);
}

function print(msg) {
    const ta = document.getElementById("output");
    if (ta) ta.value = msg;
    else console.log(msg);
}