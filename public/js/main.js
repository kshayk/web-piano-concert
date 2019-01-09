const MIDITYPEON = 1;
const MIDITYPEOFF = 2;
const MIDITYPESUSTAIN = 3;

var roomUrl = window.location.href;
console.log(roomUrl);
$("#roomUrl").val(roomUrl);

var roomId = window.location.pathname.split('/')[2];

var isComposer = false;

$('.welcome-modal').modal({
    backdrop: 'static',
    keyboard: false
});

$(".welcome-modal").modal('show');

$("#hearButtonComposer").on('click', () => {
    hearPiano = (hearPiano === false);

    if(hearPiano) {
        $("#hearButtonComposer").removeClass("btn-default");
        $("#hearButtonComposer").addClass("btn-success");
    } else {
        $("#hearButtonComposer").removeClass("btn-success");
        $("#hearButtonComposer").addClass("btn-default");
    }
});

var audioCtx = new AudioContext();

$("#hearButtonUser").on('click', () => {
    audioCtx.resume();
    $(".welcome-modal").modal('hide');
});

$("#inviteButton").on('click', () => {
    $(".invite-modal").modal('show');
});

$("#closeInviteModal").click(() => {
    $(".invite-modal").modal('hide');
});

openWebPiano.init(audioCtx);

let socket = io();

socket.on('connect', function() {
    socket.emit('join', {roomId}, function(checkComposer) {
        isComposer = checkComposer;

        if(checkComposer) {
            //Show piano
            $("#pianoHandle").show();
        }
    });

    setTimeout(() => {
        socket.emit('requestListenerAmount', {roomId}, (listenersAmount) => {
            $("#listeners").text(listenersAmount);
        });
    }, 2000)
});

socket.on('midiKeyPressed', (data) => {
    switch (data.t) {
        case MIDITYPEOFF:
            removePressedClass(data.n);
            openWebPiano.noteOff(data.n);
            break;
        case MIDITYPEON:
            addPressedClass(data.n);
            openWebPiano.noteOn(data.n, data.v);
            break;
        case MIDITYPESUSTAIN:
            openWebPiano.sustain(data.v);
            break;
        default:
            console.log('Unrecognized event type, should not reach here');

    }
});

socket.on('composerLeft', () => {
    alert('Composer left the room, so it will now be closed.');

    window.location.href = '/';
});

socket.on('updateListeners', (listeners) => {
    $("#listeners").text(listeners);
});