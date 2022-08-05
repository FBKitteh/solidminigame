import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";

const colorOptions = [
  "red",
  "orange",
  "purple",
  "blue",
  // "yellow",
  // "green",
  // "pink",
  // "brown",
] as const;

const [count, setCount] = createSignal(30);
const [columns, setColumns] = createSignal(6);
const plops = createMemo(() => {
  const p = [];
  for (let i = 0; i < count(); i++) {
    p.push(randFromArray(colorOptions));
  }
  return p;
})

function idToRowColumn(id: number) {
  const row = id / columns() | 0
  const column = id % columns()
  return { row, column }
}
function rowColumnToId(row: number, column: number) {
  const id = row * columns() + column | 0
  return id
}
function index(row: number, column: number) {
    try {
      const color = plops()[rowColumnToId(row, column)]
      return color
    } catch {
      return ""
    }
}

  function getNeighbors(row:number, column:number, cache=[] as {row: number, column: number}[]) {
    for(const aCell of cache) {
      if (aCell.column == column && aCell.row == row) {
        return
      }
    }
    cache.push({row, column})
    const cell = index(row,column)
    const cellBelow = index(row+1, column)
    const cellAbove = index(row-1, column)
    const cellLeft = index(row, column-1)
    const cellRight = index(row, column+1)
    if (cellAbove == cell) {
      getNeighbors(row-1, column, cache)
    }
    if (cellBelow == cell) {
      getNeighbors(row+1, column, cache)
    }
    if (cellLeft == cell) {
      getNeighbors(row, column-1, cache)
    }
    if (cellRight == cell) {
      getNeighbors(row, column+1, cache)
    }
    return cache
  }
function App() {

  return (
    <div>
      <div>
        Plops: {count()}
        <br />
        Columns: {columns()}
        <br />
        Rows: {count() / columns()}
        <br />
        <button onClick={() => setColumns(columns() + 1)}>Add Column</button>
        <button onClick={() => setColumns(columns() - 1)}>
          Remove Column
        </button>{" "}
        <br />
        <button onClick={() => setCount(count() + 1)}>Add Plop</button>
        <button onClick={() => setCount(count() - 1)}>Remove Plop</button>
      </div>
      <div
        style={`display: grid; grid-template-columns: repeat(${columns()}, 1fr)`}
      >
        <For each={plops()}>{(plop, id) => <Plop color={plop} size={3} id={id()}/>}</For>
      </div>
    </div>
  );
}

function Plop(props: { color: string; size: number, id:number }) {
  return (
    <p
    onClick={clickPlop}
      style={`background-color: ${props.color}; width: ${props.size}em; height: ${props.size}em; border-radius: ${props.size}em`}
    ></p>
  );
  function clickPlop() {
    const { row, column } = idToRowColumn(props.id)
    console.log(getNeighbors(row, column))
  }
}

/** @ts-ignore */
render(App, app);

function randFromArray<T>(a: T[]): T {
  const maxNum = a.length;
  const rand = Math.random() * maxNum;
  const noDecimal = rand | 0;
  return a[noDecimal];
}
