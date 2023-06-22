function isASCII(str) {
    return /^[0-9,A-Z,a-z,@,.,+,\-,_]*$/.test(str);
}

function isNum(str){
    return /^[0-9]{8,}$/.test(str);
}

export {isASCII};
export {isNum};