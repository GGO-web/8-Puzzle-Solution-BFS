import {
  directions,
  finalState,
  initialState,
  production,
  size,
} from "./constants.js";
import { displayBoard, getExecutionTime } from "./helpers.js";
import { Node } from "./node.js";
const db = new Map();
db.set(initialState.toString(), true);
const queue = [new Node(initialState, null, null, 0, 0)];
const allStates = [initialState];
let results = {
  currentState: null,
  moves: 0,
  settled: 0,
  dropped: 0,
  depth: 0,
  haveSolution: false,
};
const getEmpyCellCoords = (state) => {
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
const statesAreEqual = (state, secondState) => {
  return state?.toString() === secondState?.toString();
};
const isOutOfBorder = (coords) => {
  if (coords.x >= size || coords.x < 0) return true;
  if (coords.y >= size || coords.y < 0) return true;
  return false;
};
const printResults = () => {
  if (!results.haveSolution) {
    console.log(`Кількість відвіданих станів : ${results.moves}`);
    console.log(`Кількість станів занесених у БД : ${results.settled} `);
    console.log(`Кількість відкинутих станів : ${results.dropped}`);
    console.log("Гра у 8 немає розв'язків");
  } else {
    console.log("Порядок переміщень для розв'язку гри в 8 :");
    results?.currentState?.pathFromStart();
    console.log(`Кількість відвіданих станів : ${results.moves}`);
    console.log(`Кількість станів занесених у БД : ${results.settled} `);
    console.log(`Кількість відкинутих станів : ${results.dropped}`);
    console.log(
      `Глибина дерева пошуку на якій знайдено рішення : ${results.depth}`
    );
  }
};
const BFS = function () {
  let moves = 0,
    droppedStates = 0;
  while (queue.length) {
    let currentState = queue.shift();
    results = {
      currentState: currentState,
      moves: moves,
      settled: db.size,
      dropped: droppedStates,
      depth: currentState.getDepth(),
      haveSolution: false,
    };
    if (statesAreEqual(currentState.getState(), finalState)) {
      results.haveSolution = true;
      return;
    }
    const emptyCell = getEmpyCellCoords(currentState.getState());
    directions.forEach((direction) => {
      const copyState = currentState?.getState()?.map((row) => [...row]);
      // coords cell to switch
      const coords = {
        x: emptyCell.x + direction.x,
        y: emptyCell.y + direction.y,
        name: direction.name,
      };
      // if coords of swapped cell is not out the border of the field
      if (!isOutOfBorder(coords)) {
        // move empty cell into current direction
        [copyState[emptyCell.x][emptyCell.y], copyState[coords.x][coords.y]] = [
          copyState[coords.x][coords.y],
          copyState[emptyCell.x][emptyCell.y],
        ];
        // if swapped state is not present in database
        if (!db.get(copyState.toString())) {
          queue.push(
            new Node(
              copyState,
              currentState,
              direction.name,
              currentState.getDepth() + 1,
              0
            )
          );
          db.set(copyState.toString(), true);
          allStates.push(copyState);
        } else {
          droppedStates++;
        }
        moves++;
      }
    });
  }
};
if (production) {
  BFS();
  const nextStateButton = document.querySelector(".next");
  const resultButton = document.querySelector(".result");
  let index = 0;
  nextStateButton?.addEventListener("click", () => {
    displayBoard(allStates[index]);
    index++;
  });
  resultButton?.addEventListener("click", () => {
    printResults();
  });
} else {
  const timer = getExecutionTime();
  timer.next();
  BFS();
  timer.next();
  printResults();
}
