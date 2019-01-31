import DefaultDark from "./DefaultDark"
import DefaultWhite from "./DefaultWhite"

let themes = {};
themes["DefaultDark"] = DefaultDark;
themes["DefaultWhite"] = DefaultWhite;

class Theme {

    constructor (theme) {        
        if (typeof themes[theme] === "undefined")
            throw new Error(`Theme ${theme} not found`);
        this.colors = themes[theme].colors;
    }

}


export default Theme;
