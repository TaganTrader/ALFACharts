"use strict";

let theme = {
    name: "DefaultWhite",
    colors: {
        workarea_bg: "#FFF",        
        axe_lines: "#F5F5F5",
        axe_texts: "rgba(0, 0, 0, 0.6)",

        candles: {
            bull: {
                body:       "rgba(102, 204, 102, 1)",
                price_line: "rgba(102, 204, 102, 1)",
                price_text: "rgba(0, 0, 0, 1)",
            },
            bear: {
                body:       "rgba(237, 104, 74, 1)",
                price_line: "rgba(237, 104, 74, 1)",
                price_text: "rgba(255, 255, 255, 1)",
            }
        },

        crosshair_lines: "rgba(0, 0, 0, 0.3)",
        crosshair_price: "rgba(255, 255, 255, 1)",
        crosshair_price_bg: "rgba(100, 100, 100, 0.9)",

        orders: {
            buy: {
                lines: "rgba(102, 204, 102, 1)",
                label: "rgba(102, 204, 102, 0.5)",
                label_text: "rgba(0, 0, 0)",
                price_text:  "rgba(0, 0, 0, 1)",
            },
            sell: {
                lines: "rgba(237, 104, 74, 1)",
                label: "rgba(237, 104, 74, 0.5)",
                label_text: "rgba(0, 0, 0)",
                price_text:  "rgba(255, 255, 255, 1)",
            }
        },

        positions: {
            long: {
                lines: "rgba(102, 204, 102, 1)",
                label: "rgba(102, 204, 102, 1)",
                label_text: "rgba(255, 255, 255)",
                price_text:  "rgba(0, 0, 0, 1)",
            },
            short: {
                lines: "rgba(237, 104, 74, 1)",
                label: "rgba(237, 104, 74, 1)",
                label_text: "rgba(255, 255, 255)",
                price_text:  "rgba(255, 255, 255, 1)",
            }
        }

    }
}

export default theme;