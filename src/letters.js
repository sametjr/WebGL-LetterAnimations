
var gl;
var numPoints;
var thetaLoc;
var colorLocation;
var vPosition;
var xShiftPos, yShiftPos;
var xShift = 0.0, yShift = 0.0;
var canvas;
var vertices;
var isClockwise = false;
var isRotating = true;
var speed = .01;

var shiftValue = .05;

var red = 1.0;
var green = 0.0;
var blue = 0.0;
var op = 1.0;



window.onload = function main() {
    // Get the element from HTML
    canvas = document.querySelector("#glcanvas");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // console.log(width, height);
    // Initialize the GL context
    gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may notsupport it.");
        return;
    }

    let program = initShaders(gl, "vertex-shader", "fragment-shader");


    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Shader program failed to link!");
        return -1;
    }

    gl.useProgram(program);

    // I am making pixel calculations,
    //then I will divide all vector 2 instances
    //by width and height

    //#region points 
    const p1 = vec2(-20, 350);
    const p2 = vec2(-20, 330);
    const p3 = vec2(-350, 350);
    const p4 = vec2(-350, 330);
    const p5 = vec2(-350, -10);
    const p6 = vec2(-330, -10);
    const p7 = vec2(-330, 350);
    const p8 = vec2(-350, 10);
    const p9 = vec2(-20, 10);
    const p10 = vec2(-20, -10);
    const p11 = vec2(-20, -350);
    const p12 = vec2(-40, -350);
    const p13 = vec2(-40, 10);
    const p14 = vec2(-350, -350);
    const p15 = vec2(-350, -330);
    const p16 = vec2(-20, -330);
    const p17 = vec2(20, -350);
    const p18 = vec2(40, -350);
    const p19 = vec2(185, 350);
    const p20 = vec2(185, 280);
    const p21 = vec2(330, -350);
    const p22 = vec2(350, -350);
    const p23 = vec2(260, 10);
    const p24 = vec2(110, 10);
    const p25 = vec2(120, 30);
    const p26 = vec2(250, 30);
    //#endregion

    vertices = [
        p1, p2, p4,
        [...p1], p3, [...p4],

        [...p3], p5, p6,
        [...p3], [...p6], p7,

        [...p5], p8, p9,
        [...p5], [...p9], p10,

        [...p9], p11, p13,
        [...p11], p12, [...p13],

        [...p11], p14, p16,
        [...p14], p15, [...p16],

        //-------- S ------- //

        p17, p18, p19,
        [...p18], [...p19], p20,

        [...p19], [...p20], p21,
        [...p19], [...p21], p22,

        p24, p25, p26,
        p23, [...p24], [...p26]
    ];


    //Divide x parameter of vector by width
    //y parameter of vector by height
    //to get ins equilavent value between 0-1
    vertices.forEach(i => {
        i[0] /= width;
        i[1] /= height;
    });



    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);



    thetaLoc = gl.getUniformLocation(program, "theta");
    colorLocation = gl.getUniformLocation(program, "u_Color");
    xShiftPos = gl.getUniformLocation(program, "xShift");
    yShiftPos = gl.getUniformLocation(program, "yShift");


    theta = 0;
    gl.uniform1f(thetaLoc, theta);

    // Clear the color buffer with specified clear color
    render();


}

function render() {
    // Set clear color to black, fully opaque
    // canvas.setAttribute("width", canvas.width += 10);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += isClockwise ? speed : -speed;
    // gl.vertexAttrib2f(vPosition, vPosition.x += 0.1, vPosition.y);
    gl.uniform1f(thetaLoc, theta);
    gl.uniform4f(colorLocation, red, green, blue, op);
    gl.uniform1f(xShiftPos, xShift);
    gl.uniform1f(yShiftPos, yShift);
    gl.drawArrays(gl.TRIANGLES, 0, 48);
    requestAnimationFrame(() => render());
}

document.querySelector("#change").addEventListener("click", () => isClockwise = !isClockwise)

var speedInput = document.querySelector("#speed");
speedInput.onchange = () => { speed = speedInput.value / 50000; }


document.querySelector("#submit").addEventListener("click", () => {
    switch (document.querySelector("#color").value) {
        case "red":
            red = 1;
            green = 0;
            blue = 0;
            break;
        case "green":
            red = 0;
            green = 1;
            blue = 0;
            break;
        case "blue":
            red = 0;
            green = 0;
            blue = 1;
            break;
        default:
            break;
    }
})

var opacity = document.querySelector("#opacity");
opacity.onchange = () => {
    op = opacity.value;
}

window.onkeydown = e => {
    console.log(e.keyCode);
    if (e.keyCode == 68 || e.keyCode == 100) shiftRight();
    else if (e.keyCode == 65 || e.keyCode == 97) shiftLeft();
    else if (e.keyCode == 87 || e.keyCode == 119) shiftUp();
    else if (e.keyCode == 83 || e.keyCode == 115) shiftDown();
}

function shiftRight() {
    xShift += shiftValue;
}

function shiftLeft() {
    xShift -= shiftValue;
}

function shiftUp() {
    yShift += shiftValue;
}

function shiftDown() {
    yShift -= shiftValue;
}