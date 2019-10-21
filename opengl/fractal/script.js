"use strict";

let options = {
    translation: [0, 0],
    scale: [1, 1],
    c: [-0.74543, 0.11301],
    R: 1.70197192317588,
    depth: 200,
};

function main() {
    // Get A WebGL context
    let canvas = document.getElementById("canvas");
    let gl = initWebGL(canvas);
    let program = createProgramFromScriptsByUrl(gl, "shaders/vertex-shader.vert", "shaders/fragment-shader.frag");

    // load locations
    let locations = {
        attributes: {},
        uniform: {}
    };
    locations.attributes.position = gl.getAttribLocation(program, "a_position");
    locations.uniform.c = gl.getUniformLocation(program, "u_c");
    locations.uniform.distance = gl.getUniformLocation(program, "u_distance");
    locations.uniform.depth = gl.getUniformLocation(program, "u_depth");
    locations.uniform.texture = gl.getUniformLocation(program, "u_texture");
    locations.uniform.translation = gl.getUniformLocation(program, "u_translation");
    locations.uniform.scale = gl.getUniformLocation(program, "u_scale");

    // init buffer
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    runProgram(gl, program);

    // set up texture
    bindTexture(gl);
    gl.uniform1i(locations.uniform.texture, 0);

    gl.enableVertexAttribArray(locations.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(locations.attributes.position, 2, gl.FLOAT, false, 0, 0);
    drawScene(gl, locations);

    initUi(gl, locations);
}

function bindTexture(gl) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    let size = 128;
    let textureData = createTextureData(size);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function createTextureData(size) {
    let colors = generateColors(size);
    let data = [];
    for(let i = 0; i < colors.length; i++) {
        data = data.concat(colors[i]);
    }
    return new Uint8Array(data);
}

function generateColors(numberOfColors) {
     let colors = [];
     for (let i = 0; i <= numberOfColors - 1; i++) {
         let rate = 255.0 / (numberOfColors - 1) * i;
         colors.push([rate, 255.0 - rate, 255 - rate, 255]);
     }
     return colors;
}

function drawScene(gl, locations) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform2fv(locations.uniform.c, options.c);
    gl.uniform1fv(locations.uniform.distance, [options.R]);
    gl.uniform1i(locations.uniform.depth, options.depth);

    gl.uniform2fv(locations.uniform.translation, options.translation);
    gl.uniform2fv(locations.uniform.scale, options.scale);

    drawRectangle(gl,-1, -1, 1, 1);
}

function drawRectangle(gl, x1, y1, x2, y2) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initUi(gl, locations) {
    function updateR(event, ui) {
        options.R = ui.value;
        drawScene(gl, locations);
    }

    function updateDepth(event, ui) {
        options.depth = ui.value;
        drawScene(gl, locations);
    }

    function updateCX(event, ui) {
        options.c[0] = ui.value;
        drawScene(gl, locations);
    }

    function updateCY(event, ui) {
        options.c[1] = ui.value;
        drawScene(gl, locations);
    }

    function updateScale(event, ui) {
        options.scale = [ui.value, ui.value];
        drawScene(gl, locations);
    }

    function updateTranslation(newX, newY) {
        options.translation = [newX, newY];
        console.log(options.translation);
        drawScene(gl, locations);
    }

    setupSlider("#scale", {value: options.scale[0], slide: updateScale, min: 0.5, max: 50, step: 0.01, precision: 2});
    setupSlider("#cx", {value: options.c[0], slide: updateCX, min: -1, max: 1, step: 0.01, precision: 2});
    setupSlider("#cy", {value: options.c[1], slide: updateCY, min: -1, max: 1, step: 0.01, precision: 2});
    setupSlider("#R", {value: options.R, slide: updateR, min: 0, max: 5, step: 0.01, precision: 2});
    setupSlider("#depth", {value: options.depth, slide: updateDepth, min: 0, max: 300, step: 1, precision: 0});

    let canvas = document.getElementById("canvas");
    let mousedown = false;
    let initX;
    let initY;
    canvas.addEventListener('mousedown', function (e) {
        // mouse state set to true
        mousedown = true;
        // subtract offset
        initX = options.translation[0] + e.clientX / getWidth(canvas);
        initY = options.translation[1] - e.clientY / getHeight(canvas);
    }, true);
    canvas.addEventListener('mouseup', function (e) {
        mousedown = false;
    }, true);
    canvas.addEventListener('mousemove', function (e) {
        if (mousedown) {
            const newX = initX - e.clientX / getWidth(canvas);
            const newY = initY + e.clientY / getHeight(canvas);
            updateTranslation(newX, newY);
        }
    }, true);
}

function getWidth(canvas) {
    return canvas.width * options.scale[0] / 2;
}

function getHeight(canvas) {
    return canvas.height * options.scale[1] / 2;
}

main();
