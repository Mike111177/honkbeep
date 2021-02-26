type Color = {
  name: string;
  fill: string;
  back?: string;
}

const colors: Record<string, Color> = {
  Red: {
    "name": "Red",
    "fill": "#e60000",
    "back": "#f2b4b4"
  },
  Yellow: {
    "name": "Yellow",
    "fill": "#e6e600",
    "back": "#f2f2b4"
  },
  Green: {
    "name": "Green",
    "fill": "#02ec00",
    "back": "#b4f5b4"
  },
  Blue: {
    "name": "Blue",
    "fill": "#0037ff",
    "back": "#b4b8ff"
  },
  Purple: {
    "name": "Purple",
    "fill": "#6600cc",
    "back": "#c2b4e6"
  },
  Teal: {
    "name": "Teal",
    "fill": "#00cccc",
    "back": "#b4e6e6"
  },
  Black: {
    "name": "Black",
    "fill": "#111111",
    "back": "#b4b4b4"
  },
  Pink: {
    "name": "Pink",
    "fill": "#ff69b4",
    "back": "#ffc3dc"
  },
  Brown: {
    "name": "Brown",
    "fill": "#654321",
    "back": "#c1bab5"
  }
};

export default colors;
