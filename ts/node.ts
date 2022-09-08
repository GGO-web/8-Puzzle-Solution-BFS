import { displayBoard } from "./helpers";
import { IState } from "./index.models";

export class Node {
  state: IState | null;
  parent: Node | null;
  operator: string | null;
  depth: number;
  cost: number;

  constructor(
    state: IState | null,
    parent: Node | null,
    operator: string | null,
    depth: number,
    cost: number
  ) {
    this.state = state;
    this.parent = parent;
    this.operator = operator;
    this.depth = depth;
    this.cost = cost;
  }

  getState = (): IState | null => {
    return this.state;
  };

  getMoves = (): string | null => {
    return this.operator;
  };

  getDepth = (): number => {
    return this.depth;
  };

  pathFromStart = () => {
    let stateList: IState[] = [];
    let moveList: string[] = [];
    let currentNode: Node | null = this as Node;

    do {
      stateList.push(currentNode?.getState() as IState);
      moveList.push(currentNode?.getMoves() as string);

      currentNode = currentNode?.parent as Node;

      if (!currentNode.parent) {
        stateList.push(currentNode?.getState() as IState);
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
}
