import bluePip from "./pips/suits/no-variant/blue.svg"
import redPip from "./pips/suits/no-variant/red.svg"
import greenPip from "./pips/suits/no-variant/green.svg"
import yellowPip from "./pips/suits/no-variant/yellow.svg"
import purplePip from "./pips/suits/no-variant/purple.svg"
import blackPip from "./pips/suits/variants/black.svg"
import tealPip from "./pips/suits/variants/teal.svg"
import pinkPip from "./pips/suits/variants/pink.svg"
import brownPip from "./pips/suits/variants/brown.svg"

type Color = {
  name: string,
  fill: string,
  back?: string,
  pip?: string,


}

const colors: Record<string, Color> = {
  Red: {
    "name": "Red",
    "fill": "#e60000",
    "back": "#f2b4b4",
    "pip": redPip
  },
  Yellow: {
    "name": "Yellow",
    "fill": "#e6e600",
    "back": "#f2f2b4",
    "pip": yellowPip
  },
  Green: {
    "name": "Green",
    "fill": "#02ec00",
    "back": "#b4f5b4",
    "pip": greenPip
  },
  Blue: {
    "name": "Blue",
    "fill": "#0037ff",
    "back": "#b4b8ff",
    "pip": bluePip
  },
  Purple: {
    "name": "Purple",
    "fill": "#6600cc",
    "back": "#c2b4e6",
    "pip": purplePip
  },
  Teal: {
    "name": "Teal",
    "fill": "#00cccc",
    "back": "#b4e6e6",
    "pip": tealPip
  },
  Black: {
    "name": "Black",
    "fill": "#111111",
    "back": "#b4b4b4",
    "pip": blackPip
  },
  Pink: {
    "name": "Pink",
    "fill": "#ff69b4",
    "back": "#ffc3dc",
    "pip": pinkPip
  },
  Brown: {
    "name": "Brown",
    "fill": "#654321",
    "back": "#c1bab5",
    "pip": brownPip
  }
}

export default colors;
