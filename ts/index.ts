import { directions, finalState, initialState, production } from "./constants";
import { ICoordinate, IState } from "./index.models";
import {
  displayBoard,
  getEmpyCellCoords,
  getExecutionTime,
  isOutOfBorder,
  statesAreEqual,
} from "./helpers";
import { Node } from "./node";

const db: Map<string, boolean> = new Map();
db.set(initialState.toString(), true);
const queue = [new Node(initialState, null, null, 0, 0)];
const allStates: IState[] = [initialState];

let results: {
  currentState: Node | null;
  moves: number;
  settled: number;
  dropped: number;
  depth: number;
  haveSolution: boolean;
} = {
  currentState: null,
  moves: 0,
  settled: 0,
  dropped: 0,
  depth: 0,
  haveSolution: false,
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
    let currentState: Node | null = queue.shift() as Node;

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
      const copyState: IState | null = currentState
        ?.getState()
        ?.map((row) => [...row]) as IState;

      // coords cell to switch
      const coords: ICoordinate = {
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
              currentState!.getDepth() + 1,
              0
            )
          );

          db.set(copyState.toString(), true);
          allStates.push(copyState as IState);
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
    displayBoard(allStates[index] as IState);

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
