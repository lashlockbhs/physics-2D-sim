import {sigma} from "../public/math.js";

const arithmeticCheck = (thunk, expected) => {
    let got = thunk();
    if (got === expected) {
        console.log("ok");
    } else {
        console.log(`${thunk} returned ${got}; expected ${expected}`);
    };
};

arithmeticCheck(() => sigma(1, 5, i => i), 15);
arithmeticCheck(() => sigma(1, 3.4, i => i), 1);