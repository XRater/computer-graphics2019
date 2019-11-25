"use strict";

let options = {
    translation: [0, 0, 0],
    rotation: [45, 45, 0],
    scale: [1, 1, 1],

    radius: 500,
    theta: 0,
    phi: 0
};

function main() {
    // Get A WebGL context
    let canvas = document.getElementById("canvas");
    let gl = initWebGL(canvas);
    let program = createProgramFromScriptsByUrl(gl, "shaders/vertex-shader.vert", "shaders/fragment-shader.frag");

    // load locations
    let locations = {
        attributes: {},
        uniform: {},
        buffers: {}
    };
    locations.attributes.position = gl.getAttribLocation(program, "a_position");
    locations.attributes.normals = gl.getAttribLocation(program, "a_normal");
    locations.uniform.worldViewProjection = gl.getUniformLocation(program, "u_worldViewProjection");
    locations.uniform.world = gl.getUniformLocation(program, "u_world");
    locations.uniform.color = gl.getUniformLocation(program, "u_color");
    locations.uniform.lightDirection = gl.getUniformLocation(program, "u_reverseLightDirection");

    runProgram(gl, program);

    locations.buffers.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, locations.buffers.position);
    setGeometry(gl, locations);

    locations.buffers.normals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, locations.buffers.normals);
    setNormals(gl, locations);

    drawScene(gl, locations);
    initUi(gl, locations);
}

function setGeometry(gl, locations) {
    setCube(gl, [100, 100, 100], [-100, -100, -100])
}

function setCube(gl, a, b) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        a[0], a[1], a[2],
        b[0], b[1], a[2],
        a[0], b[1], a[2],
        b[0], a[1], a[2],
        b[0], b[1], a[2],
        a[0], a[1], a[2],

        a[0], a[1], b[2],
        a[0], b[1], b[2],
        b[0], b[1], b[2],
        a[0], a[1], b[2],
        b[0], b[1], b[2],
        b[0], a[1], b[2],

        a[0], a[1], a[2],
        a[0], b[1], a[2],
        a[0], b[1], b[2],
        a[0], a[1], a[2],
        a[0], b[1], b[2],
        a[0], a[1], b[2],

        b[0], a[1], a[2],
        b[0], b[1], b[2],
        b[0], b[1], a[2],
        b[0], a[1], b[2],
        b[0], b[1], b[2],
        b[0], a[1], a[2],

        b[0], a[1], b[2],
        b[0], a[1], a[2],
        a[0], a[1], a[2],
        a[0], a[1], b[2],
        b[0], a[1], b[2],
        a[0], a[1], a[2],

        b[0], b[1], b[2],
        a[0], b[1], a[2],
        b[0], b[1], a[2],
        a[0], b[1], b[2],
        a[0], b[1], a[2],
        b[0], b[1], b[2],


        0, 0, 0,
        b[0], b[1], 0,
        0, b[1], 0,
        b[0], 0, 0,
        b[0], b[1], 0,
        0, 0, 0,

        0, 0, b[2],
        0, b[1], b[2],
        b[0], b[1], b[2],
        0, 0, b[2],
        b[0], b[1], b[2],
        b[0], 0, b[2],

        0, 0, 0,
        0, b[1], 0,
        0, b[1], b[2],
        0, 0, 0,
        0, b[1], b[2],
        0, 0, b[2],

        b[0], 0, 0,
        b[0], b[1], b[2],
        b[0], b[1], 0,
        b[0], 0, b[2],
        b[0], b[1], b[2],
        b[0], 0, 0,

        b[0], 0, b[2],
        b[0], 0, 0,
        0, 0, 0,
        0, 0, b[2],
        b[0], 0, b[2],
        0, 0, 0,

        b[0], b[1], b[2],
        0, b[1], 0,
        b[0], b[1], 0,
        0, b[1], b[2],
        0, b[1], 0,
        b[0], b[1], b[2],
    ]), gl.STATIC_DRAW);
}

function setColor(gl, locations) {
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,

        255, 255, 0,
        255, 255, 0,
        255, 255, 0,
        255, 255, 0,
        255, 255, 0,
        255, 255, 0,

        255, 0, 255,
        255, 0, 255,
        255, 0, 255,
        255, 0, 255,
        255, 0, 255,
        255, 0, 255,

        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,

        0, 255, 255,
        0, 255, 255,
        0, 255, 255,
        0, 255, 255,
        0, 255, 255,
        0, 255, 255,

        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,


        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,
        255, 0, 0,

        255, 255, 0,
        255, 255, 0,
        255, 255, 0,
        255, 255, 0,
        255, 255, 0,
        255, 255, 0,

        255, 0, 255,
        255, 0, 255,
        255, 0, 255,
        255, 0, 255,
        255, 0, 255,
        255, 0, 255,

        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,

        0, 255, 255,
        0, 255, 255,
        0, 255, 255,
        0, 255, 255,
        0, 255, 255,
        0, 255, 255,

        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
        0, 255, 0,
    ]), gl.STATIC_DRAW);
}

function setNormals(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,


        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ]), gl.STATIC_DRAW);
}

function setMatrix(gl, locations) {
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix = matrix4.perspective(degToRad(60), aspect, 1, 2000);

    const st = Math.sin(options.theta * Math.PI / 360);
    const ct = Math.cos(options.theta * Math.PI / 360);
    const sp = Math.sin(options.phi * Math.PI / 360);
    const cp = Math.cos(options.phi * Math.PI / 360);

    let cameraMatrix = matrix4.init();
    cameraMatrix = matrix4.multiply(cameraMatrix, [
        (1 - cp) * ct * ct + cp, sp * st, -(1 - cp) * ct * st, 0,
        -sp * st, cp, -sp * ct, 0,
        -(1 - cp) * st * ct, sp * ct, cp + (1 - cp) * st * st, 0,
        0, 0, 0, 1,
    ]);
    cameraMatrix = matrix4.yRotate(cameraMatrix, degToRad(options.theta));
    cameraMatrix = matrix4.translate(cameraMatrix,0, 0, options.radius);

    const viewMatrix = matrix4.inverse(cameraMatrix);
    let viewProjectionMatrix = matrix4.multiply(projectionMatrix, viewMatrix);

    let worldMatrix = matrix4.translation(options.translation[0], options.translation[1], options.translation[2]);
    worldMatrix = matrix4.xRotate(worldMatrix, degToRad(options.rotation[0]));
    worldMatrix = matrix4.yRotate(worldMatrix, degToRad(options.rotation[1]));
    worldMatrix = matrix4.zRotate(worldMatrix, degToRad(options.rotation[2]));

    // Multiply the matrices.
    const worldViewProjectionMatrix = matrix4.multiply(viewProjectionMatrix, worldMatrix);

    // Set the matrices
    gl.uniformMatrix4fv(locations.uniform.worldViewProjection, false, worldViewProjectionMatrix);
    gl.uniformMatrix4fv(locations.uniform.world, false, worldMatrix);
}

function drawScene(gl, locations) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    setUniforms(gl, locations);
    setAttributes(gl, locations);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function setUniforms(gl, locations) {
    setMatrix(gl, locations);
    gl.uniform3fv(locations.uniform.lightDirection, normalize([0.5, 0.7, 1]));
    gl.uniform4fv(locations.uniform.color, [0.2, 1, 0.2, 1]);
}

function setAttributes(gl, locations) {
    gl.enableVertexAttribArray(locations.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, locations.buffers.position);
    gl.vertexAttribPointer(locations.attributes.position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(locations.attributes.normals);
    gl.bindBuffer(gl.ARRAY_BUFFER, locations.buffers.normals);
    gl.vertexAttribPointer(locations.attributes.normals, 3, gl.FLOAT, false, 0, 0);
}

function initUi(gl, locations) {
    function updateTX(event, ui) {
        options.translation[0] = ui.value;
        drawScene(gl, locations);
    }

    function updateTY(event, ui) {
        options.translation[1] = ui.value;
        drawScene(gl, locations);
    }

    function updateTZ(event, ui) {
        options.translation[2] = ui.value;
        drawScene(gl, locations);
    }

    function updateCX(event, ui) {
        options.rotation[0] = ui.value;
        drawScene(gl, locations);
    }

    function updateCY(event, ui) {
        options.rotation[1] = ui.value;
        drawScene(gl, locations);
    }

    function updateCZ(event, ui) {
        options.rotation[2] = ui.value;
        drawScene(gl, locations);
    }

    function updateRadius(event, ui) {
        options.radius = ui.value;
        drawScene(gl, locations);
    }

    function updateCamera() {
        drawScene(gl, locations);
    }

    setupSlider("#tx", {value: options.translation[0], slide: updateTX, min: -360, max: 360});
    setupSlider("#ty", {value: options.translation[1], slide: updateTY, min: -360, max: 360});
    setupSlider("#tz", {value: options.translation[2], slide: updateTZ, min: -360, max: 360});
    setupSlider("#cx", {value: options.rotation[0], slide: updateCX, min: -360, max: 360});
    setupSlider("#cy", {value: options.rotation[1], slide: updateCY, min: -360, max: 360});
    setupSlider("#cz", {value: options.rotation[2], slide: updateCZ, min: -360, max: 360});

    let canvas = document.getElementById("canvas");
    let mousedown = false;
    let onMouseDownPosition;
    let onMouseDownTheta;
    let onMouseDownPhi;
    canvas.addEventListener('mousedown', function (e) {
        mousedown = true;
        onMouseDownPosition = { x: e.clientX, y: e.clientY };
        onMouseDownTheta = options.theta;
        onMouseDownPhi = options.phi;
    }, true);
    canvas.addEventListener('mouseup', function (e) {
        mousedown = false;
    }, true);
    canvas.addEventListener('mousemove', function (e) {
        if ( mousedown ) {
            let theta = -(e.clientX - onMouseDownPosition.x) * 0.5 + onMouseDownTheta;
            let phi = (e.clientY - onMouseDownPosition.y) * 0.5 + onMouseDownPhi;

            const camera = [];
            options.theta = theta;
            options.phi = phi;
            updateCamera()
        }
    }, true);
    canvas.addEventListener('wheel', event => {
        const delta = event.deltaY || event.detail || event.wheelDelta;
        if (delta !== 0) {
            var newRadius = options.radius;
            if (delta > 0) {
                if (newRadius < 1000) {
                    newRadius += 10;
                }
            } else {
                if (newRadius > 250) {
                    newRadius -= 10;
                }
            }
            updateRadius({}, { value: newRadius });
        }
        event.preventDefault()
    });
    window.addEventListener("resize", function(event) {
        drawScene(gl, locations)
    });
}

main();
