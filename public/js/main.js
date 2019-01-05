const MIDITYPEON = 'on';
const MIDITYPEOFF = 'off';
const MIDITYPESUSTAIN = 'sus';

var roomId = window.location.pathname.split('/')[2];

$(".modal").modal('show');

var hearPiano = false;

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
    $(".modal").modal('hide');
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
    switch (data.type) {
        case MIDITYPEOFF:
            openWebPiano.noteOff(data.noteNumber);
            break;
        case MIDITYPEON:
            openWebPiano.noteOn(data.noteNumber, data.velocity);
            break;
        case MIDITYPESUSTAIN:
            openWebPiano.sustain(data.velocity);
            break;
        default:
            console.log('Unrecognized event type, should not reach here');

    }
});