import { ICoordinate } from "./index.models";

export const directions: Array<ICoordinate> = [
   { x: 0, y: -1, name: "⇐" },
   { x: -1, y: 0, name: "⇑" },
   { x: 0, y: 1, name: "⇒" },
   { x: 1, y: 0, name: "⇓" },
];

export const size = 3;

export const production = true;

export const CLEAN_RESULT = {
   currentState: null,
   moves: 0,
   settled: 0,
   dropped: 0,
   depth: 0,
   haveSolution: false,
};
