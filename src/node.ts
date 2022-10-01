import { displayBoard } from "./helpers";
import { IState } from "./index.models";

export class INode {
   state: IState | null;
   parent: INode | null;
   operator: string | null;
   depth: number;
   cost: number;

   constructor(
      state: IState | null,
      parent: INode | null,
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
      let currentNode: INode | null = this as INode;

      do {
         stateList.push(currentNode?.getState() as IState);
         moveList.push(currentNode?.getMoves() as string);

         currentNode = currentNode?.parent as INode;
      } while (currentNode?.getDepth());

      stateList.reverse();
      moveList.reverse();

      let index = 1;
      for (const item of stateList) {
         displayBoard(item, index);
         index++;
      }

      console.log(`Кількість переміщень: ${moveList.length}`);
      console.log(`Переміщення по порядку: ${moveList.join(", ")}\n`);

      return moveList;
   };
}
