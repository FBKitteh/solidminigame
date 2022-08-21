import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";
import { createStore } from "solid-js/store"

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
type Neighbor = {row: number, column:number}
type Plop = {color: typeof colorOptions, isHighlighted: boolean}

const [store, setStore] = createStore({
  count: 30,
  columns: 6,
  plops: [] as Plop[]
})

const updateGame = {
  incrementCount() {
    setStore("count", store.count + 1)
  },
  decrementCount() {
    setStore("count", store.count - 1)
  },
  incrementColumns() {
    setStore("columns", store.columns + 1)
  },
  decrementColumns() {
    setStore("columns", store.columns - 1)
  },
  clearHighlight() {
    for (const i in store.plops) {
      setStore("plops", i, "isHighlighted", false)
    }
  },
  highlightPlop(plopIndex: number) {
    setStore("plops", plopIndex, "isHighlighted", true)
  },
  highlightPlops(cache=[] as Neighbor[]) {
    updateGame.clearHighlight()
    console.log(cache)
    for (const n of cache){
      const index = rowColumnToId(n.row, n.column)
      updateGame.highlightPlop(index)
    }
  },
  removePlop(plopIndex: number) {
    const temp = store.plops.slice()
    temp.splice(plopIndex, 1)
    setStore("plops", temp)
  },
  removePlops(cache=[] as Neighbor[]) {
    for (const n of cache){
      const index = rowColumnToId(n.row, n.column)
      updateGame.removePlop(index)
    }
  }
}
createMemo(() => {
  const p = [] as Plop[];
  for (let i = 0; i < store.count; i++) {
    const color = randFromArray(colorOptions)
    const isHighlighted = false
    p.push({color, isHighlighted});
  }
  setStore("plops", p)
})

function idToRowColumn(id: number) {
  const row = id / store.columns | 0
  const column = id % store.columns
  return { row, column }
}
function rowColumnToId(row: number, column: number) {
  const id = row * store.columns + column | 0
  return id
}
function index(row: number, column: number) {
    try {
      const plop = store.plops[rowColumnToId(row, column)]
      return plop.color
    } catch {
      return ""
    }
}

function getNeighbors(row:number, column:number, cache=[] as Neighbor[]) {
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
        Plops: {store.plops.length}
        <br />
        Columns: {store.columns}
        <br />
        Rows: {store.count / store.columns}
        <br />
        <button onClick={updateGame.incrementColumns}>Add Column</button>
        <button onClick={updateGame.decrementColumns}>Remove Column</button>{" "}
        <br />
        <button onClick={updateGame.incrementCount}>Add Plop</button>
        <button onClick={updateGame.decrementCount}>Remove Plop</button>
      </div>
      <div
        style={`display: grid; grid-template-columns: repeat(${store.columns}, 1fr)`}
      >
        <For each={store.plops}>{(plop, id) => <Plop color={plop.color} isHighlighted={plop.isHighlighted} size={3} id={id()}/>}</For>
      </div>
    </div>
  );
}

function Plop(props: { color: string; isHighlighted: boolean, size: number, id:number }) {
  return (
    <p
    onClick={clickPlop}
      style={`background-color: ${props.color}; width: ${props.size}em; border: ${+props.isHighlighted * 4}px solid white; height: ${props.size}em; border-radius: ${props.size}em`}
    ></p>
  );
  function clickPlop() {
    if (props.isHighlighted) {
      const { row, column } = idToRowColumn(props.id)
      updateGame.removePlops(getNeighbors(row, column))
    }
    else {
      const { row, column } = idToRowColumn(props.id)
      updateGame.highlightPlops(getNeighbors(row, column))
    }
    
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
