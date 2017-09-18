// Enables draggable to white chess pieces
$(".wht-king, .wht-queen, .wht-rook, .wht-pawn, .wht-knight, .wht-bishop").draggable({
    revert: "invalid",
    scope: "accept"
});

// Enables draggable to black chess pieces
$(".blk-king, .blk-queen, .blk-rook, .blk-pawn, .blk-knight, .blk-bishop").draggable({
    revert: "invalid",
    scope: "accept"
});

$(".wht, .blk").droppable({
    scope: "default",
    drop: drop1
});

$(document).ready(function () {
    //initial state of the board
    $(".blk-king, .blk-queen, .blk-bishop, .blk-rook, .blk-pawn").draggable("option","disabled",true);
});

//used to store the ids of the divs the selected piece can move;
var moveable_blocks = new Array();

//used to store the currently selected piece
var currentPiece;

//Will remove the block highlighting and scope as soon as the mouse is released.
$("#board").mouseup(function (event) {
    setTimeout(resetBlocks,200);
});

function drop1(event,ui){
    onDrop(this,ui,false);
}

function drop2(event, ui) {
    onDrop(this,ui,true);
}

//Action to be excuted once a drop is detected
function onDrop(block, piece, capture){
    if (capture) {
        var existingPiece=$(block).children();
        existingPiece.detach();
        existingPiece.css("top",0);
        existingPiece.css("left",0);
        if (existingPiece.attr("class").includes("blk")){
            $("#black-capture-pices").append(existingPiece);
        }else{
            $("#white-capture-pices").append(existingPiece);
        }
    }
    $(piece.draggable).detach();
    // var cp=$(piece.draggable[0]).clone();
    var id = $(block).attr("id");
    console.log(id);
    currentPiece.css("top",0);
    currentPiece.css("left",0);
    $("#"+id).append(currentPiece);

    if($(".blk-king, .blk-queen, .blk-bishop, .blk-rook, .blk-pawn").draggable("option","disabled")){
        $(".blk-king, .blk-queen, .blk-bishop, .blk-rook, .blk-pawn").draggable("option","disabled",false);
        $(".wht-king, .wht-queen, .wht-bishop, .wht-rook, .wht-pawn").draggable("option","disabled",true);
    }else{
        $(".blk-king, .blk-queen, .blk-bishop, .blk-rook, .blk-pawn").draggable("option","disabled",true);
        $(".wht-king, .wht-queen, .wht-bishop, .wht-rook, .wht-pawn").draggable("option","disabled",false);
    }
}

function resetBlocks() {
    console.log("reset_blocks");
    for (var x = 0; x < moveable_blocks.length; x++) {
        $('#' + moveable_blocks[x]).removeClass("capture-block")
            .droppable("option", "scope", "reject")
            .droppable("option","drop",drop1);
        if ($('#' + moveable_blocks[x]).attr("class").includes("movable-block-blk")) {
            // console.log("1");
            $('#' + moveable_blocks[x]).removeClass("movable-block-blk")
                .droppable("option", "scope", "reject");
        } else if ($('#' + moveable_blocks[x]).attr("class").includes("movable-block-wht")) {
            // console.log("2");
            $('#' + moveable_blocks[x]).removeClass("movable-block-wht")
                .removeClass("capture-block")
                .droppable("option", "scope", "reject");
        }
    }
    moveable_blocks = new Array();
}

//checks whether the destination block is vacant
function isEmpty(id){
    var check=$("#"+id).children();
    // console.log(check.length);
    return !(check.length>0);
}

//initial positions of pawns
var wht_pawn_init = [9,10,11,12,13,14,15,16];
var blk_pawn_init = [49,50,51,52,53,54,55,56];

//handels the movement of the pawns
$(".wht-pawn").mousedown(function () {
    pawnMovement(this,"wht");
});

$(".blk-pawn").mousedown(function () {
    pawnMovement(this,"blk");
});

function pawnMovement(piece,color){
    var id = $(piece).parent().attr("id");
    captureMovementPawn(id,color);
    currentPiece = $('#'+id).children();
    console.log(currentPiece);
    var empty=isEmpty(Number(id)+8);
    if (color=="blk"){
        empty=isEmpty(Number(id)-8);
    }
    if (empty) {
        for (var x=0;x<8;x++){
            if (wht_pawn_init[x]==id || blk_pawn_init[x]==id) {
                empty=isEmpty(Number(id)+16);
                if (color=="blk"){
                    empty=isEmpty(Number(id)-16);
                    if (wht_pawn_init[x]==id){
                        break;
                    }
                }else{
                    if (blk_pawn_init[x]==id){
                        break;
                    }
                }
                if (empty) {
                    var temp = (Number(id) + 16).toString();
                    if (color == "blk") {
                        temp = (Number(id) - 16).toString();
                    }
                    setMovableTo(temp);

                    moveable_blocks.push(temp);
                    break;
                }
            }
        }

        if (color==="blk"){
            id=(Number(id)-8).toString();
        }else{
            id=(Number(id)+8).toString();
        }

        setMovableTo(id)
        moveable_blocks.push(id);
    }
}

function captureMovementPawn(id,color){
    var checkId=Number(id)+7;
    if (color=="blk"){
        checkId=Number(id)-7;
    }
    var empty=isEmpty(checkId);
    if(!empty){
        checkEnemy(checkId,color)
    }
    checkId=Number(id)+9;
    if (color=="blk"){
        checkId=Number(id)-9;
    }
    empty=isEmpty(checkId);
    if(!empty){
        checkEnemy(checkId,color)
    }

}

function checkEnemy(id,color){
    if (!($('#' + id).children().attr("class").includes(color))){
        $('#'+id).addClass("capture-block")
            .droppable("option","scope","accept")
            .droppable("option","drop",drop2);
        moveable_blocks.push(id);
    }
}

//handels the movement of the knights
$(".wht-knight").mousedown(function () {
    patternMovement2(this,"wht",knight_move_pattern);
});

$(".blk-knight").mousedown(function () {
    patternMovement2(this,"blk",knight_move_pattern);
});

//handels the movement of the kings
$(".wht-king").mousedown(function () {
    patternMovement2(this,"wht",king_move_pattern);
});

$(".blk-king").mousedown(function () {
    patternMovement2(this,"blk",king_move_pattern);
});


var knight_move_pattern=[10,17,15,6];
var king_move_pattern=[1,7,8,9];

function patternMovement2(piece,color,pattern){
    var id = $(piece).parent().attr("id");
    currentPiece = $('#'+id).children();
    var empty;
    for (var x=0;x<pattern.length;x++){
        var nextId=Number(id)+pattern[x];
        if (!(nextId>64 || nextId<0)) {
            empty = isEmpty(nextId);
            if (empty) {
                setMovableTo(nextId);
            } else {
                checkEnemy(nextId,color);
            }
        }
        nextId=Number(id)-pattern[x];
        if (!(nextId>64 || nextId<0)) {
            empty = isEmpty(nextId);
            if (empty) {
                setMovableTo(nextId);
            } else {
                checkEnemy(nextId,color);
            }
        }
    }
}

var firstColoumn=[1,9,17,25,33,41,49,57];
var lastColoumn=[8,16,24,32,40,48,56,64];

//handels the movement of the bishops
$(".wht-bishop").mousedown(function () {
    bishopMovement(this,"wht");
});

$(".blk-bishop").mousedown(function () {
    bishopMovement(this,"blk");
});

function bishopMovement(piece,color){
    var id = $(piece).parent().attr("id");
    currentPiece = $('#'+id).children();
    var nextId,empty,end=false,cornerPiece=false;

    for (var x=0;x<8;x++) {
        if (id == firstColoumn[x]) {
            cornerPiece = true;
            break;
        }
    }
    if (!cornerPiece) {
        patternMovement(7,id,color);
        patternMovement(-9,id,color);
    }

    cornerPiece=false;
    for (var x=0;x<8;x++){
        if (id==lastColoumn[x]){
            cornerPiece=true;
            break;
        }
    }

    if (!cornerPiece) {
        patternMovement(9,id,color);
        patternMovement(-7,id,color);
    }
}

//handels the movement of the bishops
$(".wht-rook").mousedown(function () {
    rookMovement(this,"wht");
});

$(".blk-rook").mousedown(function () {
    rookMovement(this,"blk");
});

function rookMovement(piece,color){
    var id = $(piece).parent().attr("id");
    currentPiece = $('#'+id).children();
    var nextId,empty,end=false,cornerPiece=false;

    for (var x=0;x<8;x++) {
        if (id == firstColoumn[x]) {
            cornerPiece = true;
            break;
        }
    }
    if (!cornerPiece) {
        patternMovement(-1,id,color);
    }

    cornerPiece=false;
    for (var x=0;x<8;x++){
        if (id==lastColoumn[x]){
            cornerPiece=true;
            break;
        }
    }

    if (!cornerPiece) {
        patternMovement(1,id,color);
    }

    cornerPiece=false;
    for (var x=0;x<8;x++){
        if (id==wht_pawn_init[x]-8){
            cornerPiece=true;
            break;
        }
    }

    if (!cornerPiece) {
        patternMovementVertical(-8,id,color);
    }

    cornerPiece=false;
    for (var x=0;x<8;x++){
        if (id==blk_pawn_init[x]+8){
            cornerPiece=true;
            break;
        }
    }

    if (!cornerPiece) {
        patternMovementVertical(8,id,color);
    }
}

function patternMovement(pattern,id,color){
    var nextId = Number(id) + pattern;
    var end = false;
    while (!(nextId > 64 || nextId < 0)) {
        var empty = isEmpty(nextId);
        if (empty) {
            setMovableTo(nextId);
            nextId = nextId + pattern;
        } else {
            checkEnemy(nextId, color);
            break;
        }
        if (end) {
            break;
        }
        for (var x = 0; x < 8; x++) {
            if ((nextId == firstColoumn[x]) || (nextId == lastColoumn[x])) {
                end = true;
                break;
            }
        }
    }
}

function patternMovementVertical(pattern,id,color){
    var nextId = Number(id) + pattern;
    var end = false;
    while (!(nextId > 64 || nextId < 0)) {
        var empty = isEmpty(nextId);
        if (empty) {
            setMovableTo(nextId);
            nextId = nextId + pattern;
        } else {
            checkEnemy(nextId, color);
            break;
        }
        if (end) {
            break;
        }
        for (var x = 0; x < 8; x++) {
            if ((nextId == wht_pawn_init[x]-8) || (nextId == blk_pawn_init[x]+8)) {
                end = true;
                break;
            }
        }
    }
}

//handels the movement of the queen
$(".wht-queen").mousedown(function () {
    queenMovement(this,"wht");
});

$(".blk-queen").mousedown(function () {
    queenMovement(this,"blk");
});

function queenMovement(piece,color){
    rookMovement(piece,color);
    bishopMovement(piece,color);
}

function setMovableTo(nextId){
    // console.log(nextId);
    console.log('#' + nextId);
    if ($('#' + nextId).attr("class").includes("blk")) {
        $('#' + nextId).addClass("movable-block-blk")
            .droppable("option", "scope", "accept");
    } else if ($('#' + nextId).attr("class").includes("wht")) {
        $('#' + nextId).addClass("movable-block-wht")
            .droppable("option", "scope", "accept");
    }
    moveable_blocks.push(nextId);
}