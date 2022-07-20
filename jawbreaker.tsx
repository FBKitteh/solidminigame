import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";

const colorOptions = [
  "red",
  "orange",
  "purple",
  "blue",
  "yellow",
  "green",
  "pink",
  "brown",
] as const;

const [count, setCount] = createSignal(15);
const [columns, setColumns] = createSignal(5);
const plops = () => {
  const p = [];
  for (let i = 0; i < count(); i++) {
    p.push(randFromArray(colorOptions));
  }
  return p;
};
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
        <For each={plops()}>{(plop) => <Plop color={plop} size={3} />}</For>
      </div>
    </div>
  );
}

function Plop(props: { color: string; size: number }) {
  return (
    <p
      style={`background-color: ${props.color}; width: ${props.size}em; height: ${props.size}em; border-radius: ${props.size}em`}
    ></p>
  );
}

/** @ts-ignore */
render(App, app);

function randFromArray<T>(a: T[]): T {
  const maxNum = a.length;
  const rand = Math.random() * maxNum;
  const noDecimal = rand | 0;
  return a[noDecimal];
}
