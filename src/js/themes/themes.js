import DefaultDark from "./DefaultDark"
import DefaultWhite from "./DefaultWhite"

let themes = {};
themes["DefaultDark"] = DefaultDark;
themes["DefaultWhite"] = DefaultWhite;

class Theme {

    constructor (theme) {        
        if (typeof themes[theme] === "undefined")
            throw new Error(`Theme ${theme} not found`);
        for (let key in themes[theme]) {
            if (themes[theme].hasOwnProperty(key))
                this[key] = themes[theme][key];
        }        
    }

}


export default Theme;
