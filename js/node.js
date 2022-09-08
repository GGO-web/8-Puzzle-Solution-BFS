import { displayBoard } from "./helpers.js";
export class Node {
  constructor(state, parent, operator, depth, cost) {
    this.getState = () => {
      return this.state;
    };
    this.getMoves = () => {
      return this.operator;
    };
    this.getDepth = () => {
      return this.depth;
    };
    this.pathFromStart = () => {
      let stateList = [];
      let moveList = [];
      let currentNode = this;
      do {
        stateList.push(currentNode?.getState());
        moveList.push(currentNode?.getMoves());
        currentNode = currentNode?.parent;
        if (!currentNode.parent) {
          stateList.push(currentNode?.getState());
        }
      } while (currentNode?.getDepth() !== 0);
      stateList.reverse();
      moveList.reverse();
      for (const item of stateList) {
        displayBoard(item);
      }
      console.log(`Кількість переміщень: ${moveList.length}`);
      console.log(`Переміщення по порядку: ${moveList.join(", ")}\n`);
      return moveList;
    };
    this.state = state;
    this.parent = parent;
    this.operator = operator;
    this.depth = depth;
    this.cost = cost;
  }
}
