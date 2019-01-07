const MIDITYPEON = 1;
const MIDITYPEOFF = 2;
const MIDITYPESUSTAIN = 3;

var roomUrl = window.location.href;
console.log(roomUrl);
$("#roomUrl").val(roomUrl);

var roomId = window.location.pathname.split('/')[2];

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
    socket.emit('join', {roomId}, function(isComposer) {
        if(isComposer) {
            //Show piano
            $("#pianoHandle").show();
        }
    });
});

socket.on('midiKeyPressed', (data) => {
    switch (data.t) {
        case MIDITYPEOFF:
            openWebPiano.noteOff(data.n);
            break;
        case MIDITYPEON:
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