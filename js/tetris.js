/*global $:false */

var tetromino = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var obj1 = { x: x1, y: y1 };
    var obj2 = { x: x2, y: y2 };
    var obj3 = { x: x3, y: y3 };
    var obj4 = { x: x4, y: y4 };
    return [obj1, obj2, obj3, obj4];
};
var O = function O() {
    return [tetromino(9, 0, 10, 0, 9, 1, 10, 1)];
};
var I = function I() {
    return [tetromino(8, 0, 9, 0, 10, 0, 11, 0), tetromino(9, 0, 9, 1, 9, 2, 9, 3)];
};

var L = function L() {
    return [tetromino(9, 0, 9, 1, 9, 2, 10, 2), tetromino(9, 0, 9, 1, 10, 0, 11, 0),
        tetromino(9, 0, 10, 0, 10, 1, 10, 2), tetromino(11, 0, 9, 1, 10, 1, 11, 1)];
};

var J = function J() {
    return [tetromino(10, 0, 10, 1, 9, 2, 10, 2), tetromino(9, 0, 9, 1, 10, 1, 11, 1),
        tetromino(9, 0, 10, 0, 9, 1, 9, 2), tetromino(9, 0, 10, 0, 11, 0, 11, 1)];
};

var Z = function Z() {
    return [tetromino(9, 0, 10, 0, 10, 1, 11, 1), tetromino(10, 0, 9, 1, 10, 1, 9, 2)];
};

var S = function S() {
    return [tetromino(10, 0, 11, 0, 9, 1, 10, 1), tetromino(9, 0, 9, 1, 10, 1, 10, 2)];
};
var T = function T() {
    return [tetromino(10, 0, 9, 1, 10, 1, 11, 1), tetromino(9, 0, 9, 1, 10, 1, 9, 2),
        tetromino(9, 0, 10, 0, 11, 0, 10, 1), tetromino(10, 0, 9, 1, 10, 1, 10, 2)];
};
var Tetrominos = {
    types: [O, I, L, J, Z, S, T],
    construct: function (t) {
        return this.types[t]();
    }
};
var rotateTypes = [1, 2, 4, 4, 2, 2, 4];

var tetrominoColour = ['#FFF59D', '#80DEEA', '#FFE0B2', '#BBDEFB', '#EF9A9A', '#E6EE9C', '#E1BEE7'];

$(document).ready(function () {
    var unit = 15;
    var canvas = $('#canvas');
    var ctx = canvas.get(0).getContext("2d");
    var coordinate;
    var width = 300;
    var height = 540;
    function adjustSize() {
        var winHeight = $(window).height();
        if (winHeight < 600) {
            width = 200;
            height = 360;
            canvas.get(0).width = 200;
            canvas.get(0).height = 360;
            unit = 10;
        }
    }

    function init() {
        coordinate = new Array(20);
        for (var i = 0; i < coordinate.length; i++) {
            var col = new Array(37);
            for (var j = 0; j < col.length; j++) {
                if (j === 36) {
                    col[j] = { value: 1 };
                }
                else {
                    col[j] = { value: 0 };
                }
            }
            coordinate[i] = col;
        }
    }
    $(window).load(function () {
        adjustSize();
        init();
    });
    $(window).resize(function () {
        adjustSize();
    });
    $('#startGameBtn').click(function () {
        startGame();
        $('#score2Wrap').css("display", "inline");
        $('.btnBlock').css("display", "none");
    });
    // $(document).on("mobileinit", function () {
    //     console.log('finish loading');
    // });
    $('#mobileClick_left').on("tab", function () {
        if (inGame === true) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                onKeyPress(37);
            }

        }
    });
    // $('#mobileClick_left').click(function () {
    //     if (inGame === true) {
    //         if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    //             onKeyPress(37);
    //         }

    //     }
    // });
    $('#mobileClick_right').click(function () {
        if (inGame === true) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                onKeyPress(39);
            }
        }
    });
    $('#mobileClick_up').click(function () {
        if (inGame === true) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                onKeyPress(38);
            }

        }
    });
    $('#mobileClick_down').click(function () {
        if (inGame === true) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                onKeyPress(40);
            }
        }
    });
    $('#mobileClick_space').click(function () {
        if (inGame === true) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                onKeyPress(32);
            }
        }
    });
    $(document).keydown(function (event) {
        if (inGame === true) {
            onKeyPress(event.which);
        }
    });
    // variables
    var totalScore = 0;
    var rowScore = [10, 30, 50, 80];
    var currentTetromino;
    var currentType;
    var hit;
    var inGame = false;
    // timer
    var timer = {
        timeInterval: 600,
        run: function () {
            this.interval = setInterval(moveTetromino, this.timeInterval);
        },
        set: function (newInterval) {
            this.timeInterval = newInterval;
        },
        stop: function (cb) {
            clearInterval(this.interval);
            cb();
        }
    };

    function startGame() {
        inGame = true;
        hit = false;
        totalScore = 0;
        currentTetromino = null;
        ctx.clearRect(0, 0, width, height);
        init();
        createTetromino();
        timer.run();
    }
    function stopGame() {
        inGame = false;
        timer.stop(function () {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(0, 0, width, height);
            $('.btnBlock button').html("Restart");
            $('.btnBlock h3 #score').html(totalScore);
            $('.btnBlock').css("display", "block");
        });
    }
    function createTetromino() {
        hit = false;
        var tetrominoType = Math.floor((Math.random() * 7));
        var rotateType = Math.floor((Math.random() * 4));
        currentTetromino = Tetrominos.construct(tetrominoType);
        rotateType = rotateType % currentTetromino.length;
        currentTetromino = currentTetromino[rotateType];
        currentType = { tetrominoType: tetrominoType, rotateType: rotateType };
        drawTetromino(currentType.tetrominoType);
        for (var i = 0; i < currentTetromino.length; i++) {
            var curx = currentTetromino[i].x;
            var cury = currentTetromino[i].y;
            if (coordinate[curx][cury].value === 1) {
                return stopGame();
            }
        }
    }
    function drawTetromino(type) {
        var colour = tetrominoColour[type];
        for (var i = 0; i < currentTetromino.length; i++) {
            drawBlock(currentTetromino[i].x, currentTetromino[i].y, colour);
        }
    }
    function drawBlock(x, y, colour) {
        ctx.fillStyle = colour;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.5;
        ctx.fillRect(x * unit, y * unit, unit, unit);
        ctx.strokeRect(x * unit + 0.5, y * unit + 0.5, unit - 1, unit - 1);
    }
    function moveTetromino() {
        if (currentTetromino && hit === false) {
            for (var i = 0; i < currentTetromino.length; i++) {
                var cur = currentTetromino[i];
                ctx.clearRect(cur.x * unit, cur.y * unit, unit, unit); //might cause problem
                currentTetromino[i].y++;
            }
            drawTetromino(currentType.tetrominoType);
            hitBotton();
        }
    }
    function rotateTetromino() {
        var tType = currentType.tetrominoType;
        var rType = currentType.rotateType;
        var xArray = [];
        var yArray = [];
        var oldTetromino = Tetrominos.construct(tType)[rType];
        for (var i = 0; i < currentTetromino.length; i++) {
            var cur = currentTetromino[i];
            xArray.push(cur.x - oldTetromino[i].x);
            yArray.push(cur.y - oldTetromino[i].y);
            ctx.clearRect(cur.x * unit, cur.y * unit, unit, unit); //might cause problem
        }
        var newrType = (rType + 1) % rotateTypes[tType];
        currentType.rotateType = newrType;
        currentTetromino = Tetrominos.construct(tType)[newrType];
        if (xArray.length === yArray.length && xArray.length === currentTetromino.length) {
            for (i = 0; i < currentTetromino.length; i++) {
                currentTetromino[i].x = currentTetromino[i].x + xArray[i];
                currentTetromino[i].y = currentTetromino[i].y + yArray[i];
            }
        }
        else {
            stopGame();
            $('.alertBox h3').html('Some error occur during rotation.');
            $('.alertBox').css("display", "block");
        }
        drawTetromino(currentType.tetrominoType);
        hitBotton();
    }
    function onKeyPress(key) {
        if (key === 13 && (hit === true || !currentTetromino)) {
            hit = false;
            createTetromino();
        }
        else if (currentTetromino) {
            if (key === 32) { // space
                var distanceFromBtn = coordinate[0].length - 1;
                for (i = 0; i < currentTetromino.length; i++) {
                    var col = currentTetromino[i].x;
                    var row = currentTetromino[i].y;
                    for (var j = 0; j < coordinate[col].length; j++) {
                        if (coordinate[col][j].value === 1) {
                            var d = j - row - 1;
                            if (d < distanceFromBtn) {
                                distanceFromBtn = d;
                            }
                        }
                    }
                }
                // console.log(distanceFromBtn);
                for (var i = 0; i < currentTetromino.length; i++) {
                    var cur = currentTetromino[i];
                    ctx.clearRect(cur.x * unit, cur.y * unit, unit, unit);
                    cur.y += distanceFromBtn;
                }
                drawTetromino(currentType.tetrominoType);
                hitBotton();
            }
            else if ([1, 38, 269].indexOf(key) >= 0 && hit === false) {//up
                rotateTetromino();
            }
            else if ([2, 40, 270].indexOf(key) >= 0 && hit === false) {//down
                moveTetromino();
            }
            else if ([3, 4, 37, 39, 271, 272].indexOf(key) >= 0 && hit === false) {
                checkEmtpy(key, function (move) {
                    var cur;
                    if ([3, 37, 271].indexOf(key) >= 0 && move.left === true) { //left
                        for (var i = 0; i < currentTetromino.length; i++) {
                            cur = currentTetromino[i];
                            ctx.clearRect(cur.x * unit, cur.y * unit, unit, unit);
                            cur.x--;
                        }
                    }
                    else if ([4, 39, 272].indexOf(key) >= 0 && move.right === true) { //right
                        for (j = 0; j < currentTetromino.length; j++) {
                            cur = currentTetromino[j];
                            ctx.clearRect(cur.x * unit, cur.y * unit, unit, unit);
                            cur.x++;
                        }
                    }
                    drawTetromino(currentType.tetrominoType);
                    hitBotton();
                });
            }
        }

    }
    function hitBotton() {
        var curx;
        var cury;
        for (var i = 0; i < currentTetromino.length; i++) {
            curx = currentTetromino[i].x;
            cury = currentTetromino[i].y;
            if (coordinate[curx][cury + 1].value === 1) {
                // console.log('hit botton ' + curx + ' ' + cury);
                hit = true;
                break;
            }
        }
        if (hit === true) {

            var rowArray = [];
            for (i = 0; i < currentTetromino.length; i++) {
                curx = currentTetromino[i].x;
                cury = currentTetromino[i].y;
                if (rowArray.indexOf(cury) < 0) {
                    rowArray.push(cury);
                }
                coordinate[curx][cury].value = 1;
                // console.log('x: ' + curx + ' y:' + cury);
                coordinate[curx][cury].colour = tetrominoColour[currentType.tetrominoType];
            }
            // printCoordinate();
            checkRow(rowArray);
            checkTop(function (stop) {
                if (stop === false) {
                    createTetromino();
                }
            });
        }
    }
    function checkTop(cb) {
        for (var i = 0; i < coordinate.length; i++) {
            if (coordinate[i][0].value === 1) {
                cb(true);
                return stopGame();
            }
        }
        cb(false);
    }
    function checkRow(rowArray) {
        // console.log('rowarray' + rowArray);
        var fill = [];
        for (var i = 0; i < rowArray.length; i++) {
            var lineFill = 0;
            for (var j = 0; j < coordinate.length; j++) {
                if (coordinate[j][rowArray[i]].value === 0) {
                    break;
                }
                else {
                    lineFill++;
                }
            }
            if (lineFill === 20 && fill.indexOf(lineFill) < 0) {
                // console.log('push' + rowArray[i]);
                fill.push(rowArray[i]);
            }
        }
        if (fill.length !== 0) {
            console.log(fill);
            timer.stop(function () {
                // for (var k = fill.length - 1; k > -1; k--) {
                for (var k = 0; k < fill.length; k++) {
                    // clear filled row
                    clearTetromino(fill[k]);
                    printCoordinate();
                    // redraw tetromino
                    redrawTetromino();
                    // calculate score
                }
                calculateScore(fill.length);
                setTimeout(function () {
                    timer.run();
                }, 300);
            });
        }
    }
    function redrawTetromino() {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < coordinate.length; i++) {
            for (var j = 0; j < coordinate[i].length - 1; j++) {
                if (coordinate[i][j].value === 1) {
                    // console.log('x: ' + i + 'y: ' + j + 'colour: ' + coordinate[i][j].colour);
                    drawBlock(i, j, coordinate[i][j].colour);
                }
            }
        }
    }

    function checkEmtpy(key, cb) {
        var distanceFromLeft = coordinate.length - 1;
        var distanceFromRight = distanceFromLeft;
        var move = { left: true, right: true };
        for (var i = 0; i < currentTetromino.length; i++) {
            var col = currentTetromino[i].x;
            var row = currentTetromino[i].y;
            if (col === 0) {
                move.left = false;
                break;
            }
            if (col === 19) {
                move.right = false;
                break;
            }
            for (var j = 0; j < coordinate.length; j++) {
                if (coordinate[j][row].value === 1) {
                    var d = col - j - 1;
                    if (d < distanceFromLeft) {
                        distanceFromLeft = d;
                    }
                }
            }
            for (j = coordinate.length - 1; j > -1; j--) {
                if (coordinate[j][row].value === 1) {
                    var d = j - col - 1;
                    if (d < distanceFromRight) {
                        distanceFromRight = d;
                    }
                }
            }
        }
        if (distanceFromLeft <= 0) {
            move.left = false;
        }
        if (distanceFromRight <= 0) {
            move.right = false;
        }
        // console.log(move);
        return cb(move);
    }

    function clearTetromino(row) {
        // var newRow = new Array(coordinate[0].length - 1);
        // for (var i = 0; i < newRow.length; i++) {
        //     newRow[i] = { value: 0 };
        // }
        for (i = 0; i < coordinate.length; i++) {
            for (var j = row; j > 0; j--) {
                coordinate[i][j] = coordinate[i][j - 1];
            }
            coordinate[i][0] = { value: 0 };
        }
    }
    function calculateScore(num) {
        if (num > 4) {
            stopGame();
            $('.alertBox h3').html('Some error occur during score calculation.');
            $('.alertBox').css("display", "block");
        }
        else {
            totalScore += rowScore[num - 1];
        }
        // console.log('Score: ' + totalScore);
        $('#score2').html(totalScore);
    }
    
    // function for testing purpose
    function printCoordinate() {
        var rows = new Array(41);
        for (var i = 0; i < rows.length; i++) {
            rows[i] = new Array(20);
        }
        for (i = 0; i < coordinate.length; i++) {
            for (var j = 0; j < coordinate[i].length; j++) {
                rows[j][i] = coordinate[i][j].value;
            }
        }
        for (i = 0; i < rows.length; i++) {
            console.log(i + ': ' + rows[i]);
        }
    }
});

