let midiKeyIndex = {
  21: '1w',
  22: '1b',
  23: '2w',
  24: '3w',
  25: '3b',
  26: '4w',
  27: '4b',
  28: '5w',
  29: '6w',
  30: '6b',
  31: '7w',
  32: '7b',
  33: '8w',
  34: '8b',
  35: '9w',
  36: '10w',
  37: '10b',
  38: '11w',
  39: '11b',
  40: '12w',
  41: '13w',
  42: '13b',
  43: '14w',
  44: '14b',
  45: '15w',
  46: '15b',
  47: '16w',
  48: '17w',
  49: '17b',
  50: '18w',
  51: '18b',
  52: '19w',
  53: '20w',
  54: '20b',
  55: '21w',
  56: '21b',
  57: '22w',
  58: '22b',
  59: '23w',
  60: '24w',
  61: '24b',
  62: '25w',
  63: '25b',
  64: '26w',
  65: '27w',
  66: '27b',
  67: '28w',
  68: '28b',
  69: '29w',
  70: '29b',
  71: '30w',
  72: '31w',
  73: '31b',
  74: '32w',
  75: '32b',
  76: '33w',
  77: '34w',
  78: '34b',
  79: '35w',
  80: '35b',
  81: '36w',
  82: '36b',
  83: '37w',
  84: '38w',
  85: '38b',
  86: '39w',
  87: '39b',
  88: '40w',
  89: '41w',
  90: '41b',
  91: '42w',
  92: '42b',
  93: '43w',
  94: '43b',
  95: '44w',
  96: '45w',
  97: '45b',
  98: '46w',
  99: '46b',
  100: '47w',
  101: '48w',
  102: '48b',
  103: '49w',
  104: '49b',
  105: '50w',
  106: '50b',
  107: '51w',
  108: '52w'
};

function addPressedClass(key) {
    if(midiKeyIndex[key]) {
        if (midiKeyIndex[key].indexOf('w') > -1)
        {
            $(`#${midiKeyIndex[key]}`).addClass('white-key-pressed');
        } else {
            $(`#${midiKeyIndex[key]}`).addClass('black-key-pressed');
        }
    }
}

function removePressedClass(key) {
    if(midiKeyIndex[key]) {
        if (midiKeyIndex[key].indexOf('w') > -1)
        {
            $(`#${midiKeyIndex[key]}`).removeClass('white-key-pressed');
        } else {
            $(`#${midiKeyIndex[key]}`).removeClass('black-key-pressed');
        }
    }
}