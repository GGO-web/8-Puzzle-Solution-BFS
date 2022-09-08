import { size } from "./constants.js";
export function* getExecutionTime() {
  const startTime = new Date();
  yield 1;
  const endTime = new Date();
  const diff = new Date(endTime - startTime);
  const execution = diff.getSeconds() + 0.001 * diff.getMilliseconds();
  console.log(`Execution time: ${execution} seconds`);
}
export const displayBoard = (state, index, debug = true) => {
  console.log(`Index of the state ${index}`);
  let display = "";
  for (let row of state) {
    const cells = row.map((item) => (!item ? " " : item));
    display += "-------------\n";
    display += `| ${cells[0]} | ${cells[1]} | ${cells[2]} |\n`;
  }
  display += "-------------\n";
  if (debug) console.log(display);
  return display;
};
export const getEmpyCellCoords = (state) => {
  let coordinates = { x: 0, y: 0, name: "empty" };
  outer: for (let i = 0; i < state[0].length; ++i) {
    for (let j = 0; j < state.length; ++j) {
      if (state[i][j] === null) {
        coordinates.x = i;
        coordinates.y = j;
        break outer;
      }
    }
  }
  return coordinates;
};
export const statesAreEqual = (state, secondState) => {
  return state?.toString() === secondState?.toString();
};
export const isOutOfBorder = (coords) => {
  if (coords.x >= size || coords.x < 0) return true;
  if (coords.y >= size || coords.y < 0) return true;
  return false;
};
