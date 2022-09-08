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

const BFS = function (
   initial: IState,
   final: IState,
   states: Array<{ state: IState; index: number }>
) {
   const db: Map<string, boolean> = new Map();
   db.set(initial.toString(), true);
   const queue = [new Node(initial, null, null, 0, 0)];

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

      if (statesAreEqual(currentState.getState(), final)) {
         results.haveSolution = true;
         return states;
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
            [
               copyState[emptyCell.x][emptyCell.y],
               copyState[coords.x][coords.y],
            ] = [
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
               states.push({ state: copyState, index: moves + 2 });
            } else {
               droppedStates++;
            }

            moves++;
         }
      });
   }

   // displayBoard(states[states.length - 1].state, 112);

   return states;
};

(() => {
   let allStates: Array<{ state: IState; index: number }> = [
      { state: initialState, index: 1 },
   ];

   if (production) {
      const nextStateButton = document.querySelector(
         ".next"
      ) as HTMLButtonElement;
      const resultButton = document.querySelector(
         ".result"
      ) as HTMLButtonElement;
      const findButton = document.querySelector(".find") as HTMLButtonElement;

      nextStateButton.setAttribute("disabled", "true");
      resultButton.setAttribute("disabled", "true");

      const resultsWrapper = document.getElementById("results") as Element;

      let index = 0;
      nextStateButton?.addEventListener("click", () => {
         // Add next new state table to the view
         const table = document.createElement("table");
         table.className +=
            "table table-primary table-hover table-bordered table-sm align-middle caption-top";
         table.style.width = "200px";
         table.style.height = "200px";
         table.style.textAlign = "center";

         table.insertAdjacentHTML(
            "afterbegin",
            `
               <caption class="fw-bold text-primary">Index of the state is ${allStates[index].index}</caption>
            `
         );

         const tbody = document.createElement("tbody");
         for (let row of allStates[index].state) {
            const tableRow = tbody.insertRow();

            for (let col of row) {
               const td = tableRow.insertCell();
               td.classList.add("align-middle");
               if (!col) {
                  td.innerHTML = " ";
               } else {
                  td.innerHTML = String(col);
               }
            }
         }

         table.appendChild(tbody);
         resultsWrapper?.appendChild(table);

         resultsWrapper.scrollTop = resultsWrapper.scrollHeight;

         // print results to the console
         displayBoard(allStates[index].state, allStates[index].index);

         index++;
      });

      resultButton?.addEventListener("click", () => {
         printResults();
      });

      findButton?.addEventListener("click", () => {
         const getTableState = (table: HTMLTableElement): IState => {
            const state: IState = [];
            for (let row of table.rows) {
               const stateRow = [];
               for (let cell of row.cells) {
                  const cellData = parseInt(cell.innerHTML);

                  Number.isNaN(cellData)
                     ? stateRow.push(null)
                     : stateRow.push(cellData);
               }
               state.push(stateRow);
            }

            return state;
         };

         const initialStateTable = document.querySelector(".initial-state");
         const finalStateTable = document.querySelector(".final-state");
         const initial = getTableState(initialStateTable as HTMLTableElement);
         const final = getTableState(finalStateTable as HTMLTableElement);

         // reset step by step results output
         const states = [{ state: initial, index: 1 }];
         index = 0;
         (resultsWrapper as any).innerHTML = null;
         nextStateButton.disabled = true;
         resultButton.disabled = true;

         allStates = BFS(initial, final, states);

         nextStateButton.disabled = false;
         resultButton.disabled = false;
      });
   } else {
      const timer = getExecutionTime();

      timer.next();
      BFS(initialState, finalState, allStates);
      timer.next();

      printResults();
   }
})();
