export function* getExecutionTime() {
    const startTime = new Date();
    yield 1;
    const endTime = new Date();
    const diff = new Date(endTime - startTime);
    const execution = diff.getSeconds() + 0.001 * diff.getMilliseconds();
    console.log(`Execution time: ${execution} seconds`);
}
export const displayBoard = (state, debug = true) => {
    let display = "";
    for (let row of state) {
        const cells = row.map((item) => (!item ? " " : item));
        display += "-------------\n";
        display += `| ${cells[0]} | ${cells[1]} | ${cells[2]} |\n`;
    }
    display += "-------------\n";
    if (debug)
        console.log(display);
    return display;
};
