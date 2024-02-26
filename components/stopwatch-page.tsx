import { useRef, useState } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";

function Stopwatch({ id, deleteStopwatch }: { id: number, deleteStopwatch: () => void }) {
  const [startTime, setStartTime] = useState(0);
  const [now, setNow] = useState(0);
  const [paused, setPaused] = useState(false);
  const [laps, setLaps] = useState<Array<string>>([]);

  const intervalID = useRef<NodeJS.Timer>();

  function startStopwatch() {
    setStartTime(Date.now);

    const id = setInterval(() => {
      setNow(Date.now);
    }, 10);

    intervalID.current = id;
    setPaused(false);
  }

  function pauseStopwatch() {
    if (!paused) {
      clearInterval(intervalID.current);
      setPaused(true);
    } else {
      setStartTime(Date.now() - (now - startTime));

      const id = setInterval(() => {
        setNow(Date.now);
      }, 10);

      intervalID.current = id;
      setPaused(false);
    }
  }

  function addLap(lapTime: string) {
    let newLaps = [...laps, lapTime];
    setLaps(newLaps);
  }

  function removeLap(index: number) {
    let newLaps = laps;
    newLaps.splice(index, 1);
    setLaps(newLaps);
  }

  function LapDisplay() {
    return laps.map((value, index) => {
      return (
        <li key={index}>
          {value}
          <button onClick={() => { removeLap(index) }}>Delete Lap</button>
        </li>
      )
    })
  };

  let displayTime = (Math.round((now - startTime) / 10) / 100).toFixed(2);

  return (
    <div>
      <h1>{`Stopwatch ${id}`}</h1>
      <h2>Duration: {displayTime}</h2>
      <button
        onClick={() => startStopwatch()}
      >{now === 0 ? "Start" : "Restart"}</button>
      <button
        onClick={() => pauseStopwatch()}
      >{paused ? "Resume" : "Pause"}</button>
      <button
        onClick={() => { deleteStopwatch() }}
      >Delete</button>
      <button
        onClick={() => { addLap(displayTime) }}>Lap</button>
      <ul>
        {LapDisplay()}
      </ul>
    </div>
  )
}

export function StopwatchPage({ className }: { className: string }) {
  const [watchIds, setWatchIds] = useState([1]);

  const stopwatches = watchIds.map((id) => {
    return (
      <Stopwatch
        id={id}
        key={id}
        deleteStopwatch={() => setWatchIds(deleteIdFromArray(id, watchIds))}
      />
    )
  });

  return (
    <div className={className}>
      <button onClick={() => setWatchIds(addIdToArray(watchIds))}>Add Stopwatch</button>
      {stopwatches}
    </div>
  )
}