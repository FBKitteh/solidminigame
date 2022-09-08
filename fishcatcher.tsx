import { render } from "solid-js/web";
import { createSignal, untrack } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);
  
  const [pressed, setPressed] = createSignal(false);

  const increment = () => setPressed(!pressed());
  const [cot, setCot] = createSignal(0);

  const [gameTick, setGameTick] = createSignal(0);
  setInterval(() => (setGameTick(gameTick()+ 1)), 100)

  const [fishOffset, setFishOffset] = createSignal(0)

  const fishingHook = {
    size: () => 20,
    top: () => count()*2,
    left: () => 180,
    right: () => fishingHook.left() + fishingHook.size(),
    bottom: () => fishingHook.top() + fishingHook.size()
  }
  const fish = {
    size: () => 10,
    top: () => fishOffset(),
    left: () => gameTick() * 2,
    right: () => fish.left() + fish.size(),
    bottom: () => fish.top() + fish.size()
  }
  const canvas = {
    height: () => 300,
    width: () => 400
  }

  function respawnFish() {
    setGameTick(0)
    setFishOffset(Math.random() * canvas.height())
  }

  function hookTick() {
    gameTick()
    untrack(() => {

      if (pressed()) {
        setCount(count() + 1)
      }
      else {
        setCount(count() - 1)
      }
    })
  }

  function didFishCollideWithHook() {
    const hookLeft = fishingHook.left()
    const fishLeft = fish.left()
    const hookRight = fishingHook.right()
    const fishRight = fish.right()
    const hookTop = fishingHook.top()
    const fishTop = fish.top()
    const hookBottom = fishingHook.bottom()
    const fishBottom = fish.bottom()

    const didCollide = fishLeft > hookLeft && fishRight < hookRight && fishTop >= hookTop && fishBottom < hookBottom
    if (didCollide) {
      respawnFish()
      setCot(cot() + 1)
      // return "cot"
    } 
  }

  function didFishOverSwim() {
    const fishLeft = fish.left()
    const canvasWidth = canvas.width()
    
    const didCollide = fishLeft >= canvasWidth
    if (didCollide) {
      respawnFish()
      // return "overswam"
    }
  }

  function FishingHook() {
    return (
      <div style={`width: ${fishingHook.size()}px; height: ${fishingHook.size()}px; background-color: red; position: absolute; top: ${fishingHook.top()}px; left: 180px;`}>
        
      </div>
    )
  }

  function Fish() {
    return (
      <div style={`width: ${fish.size()}px; height: ${fish.size()}px; background-color: blue; position: absolute; left:${fish.left()}px; top:${fish.top()}px`}>

      </div>
    )
  }

  function GameCanvas(props: {children: any}) {
    return (
      <div style={`position: relative; width: ${canvas.width()}px; height: ${canvas.height()}px; background: gray;`}>
        {props.children}
      </div>
    )
  }
  return (
    <>
    <button type="button" onClick={increment}>
      {count()}
    </button>
    <h1>{cot()}</h1>
    <p>{hookTick()}</p>
    <p>{didFishCollideWithHook()}</p>
    <p>{didFishOverSwim()}</p>
      <GameCanvas>
        <FishingHook/>
        <Fish/>
      </GameCanvas>
    </>
  );
}

render(() => <Counter />, document.getElementById("app")!);
