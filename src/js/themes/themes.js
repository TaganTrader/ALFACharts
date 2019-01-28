import DefaultDark from "./DefaultDark"

let themes = {};
themes["DefaultDark"] = DefaultDark;

class Theme {

    constructor (theme) {        
        if (typeof themes[theme] === "undefined")
            throw new Error(`Theme ${theme} not found`);
        this.colors = themes[theme].colors;
    }

}


export default Theme;
