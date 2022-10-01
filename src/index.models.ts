import { INode } from "./node";

export interface ICoordinate {
   name: string;
   x: number;
   y: number;
}

export type IState = Array<Array<number | null>>;

export interface IResult {
   currentState: INode | null;
   moves: number;
   settled: number;
   dropped: number;
   depth: number;
   haveSolution: boolean;
}
