import { useRef, useState } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";

function Stopwatch({ stopwatchId, deleteStopwatch }: { stopwatchId: number, deleteStopwatch: () => void }) {
  const [startTime, setStartTime] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState<Array<{ value: string, deletable: boolean }>>([]);

  const intervalID = useRef<NodeJS.Timer>();

  function startStopwatch() {
    if (intervalID.current) {
      clearInterval(intervalID.current)
      if (paused) {
        const timeSincePause = convertToDisplayString(Date.now() - Number(now))
        addHistoryEntry(`RESTARTED AFTER ${timeSincePause}s`, false)
      } else {
        addHistoryEntry(`RESTARTED AT ${displayTime}s`, false)
      }
    }

    setStartTime(Date.now());
    intervalID.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
    setPaused(false);
  }

  function pauseStopwatch() {
    if (!paused) {
      clearInterval(intervalID.current);
      setPaused(true);
      addHistoryEntry(`PAUSED AT ${displayTime}s`, false)
    } else {
      const timeSincePause = convertToDisplayString(Date.now() - Number(now))
      addHistoryEntry(`RESUMED AFTER ${timeSincePause}s`, false)
      setStartTime(Date.now() - (now - startTime));

      intervalID.current = setInterval(() => {
        setNow(Date.now());
      }, 10);
      setPaused(false);
    }
  }

  function addHistoryEntry(value: string, deletable: boolean) {
    let newHistory = [...history, { value, deletable }];
    setHistory(newHistory);
  }

  function removeHistoryEntry(index: number) {
    let newHistory = history;
    newHistory.splice(index, 1);
    setHistory(newHistory);
  }

  function clearAndResetTimer() {
    clearInterval(intervalID.current);
    intervalID.current = undefined;
    setStartTime(0);
    setNow(0);
    setPaused(false);
    setHistory([]);
  }

  function convertToDisplayString(milliseconds: number) {
    return (Math.round((milliseconds) / 10) / 100).toFixed(2);
  }

  let displayTime = convertToDisplayString(now - startTime)

  return (
    <div>
      <input type='text' defaultValue={`Stopwatch ${stopwatchId}`}></input>
      <h2>Duration: {displayTime}s</h2>
      <button
        onClick={startStopwatch}
      >{intervalID.current === undefined ? "Start" : "Restart"}</button>
      <button
        disabled={intervalID.current === undefined}
        onClick={pauseStopwatch}
      >{paused ? "Resume" : "Pause"}</button>
      <button
        onClick={deleteStopwatch}
      >Delete</button>
      <button
        disabled={paused}
        onClick={() => addHistoryEntry(displayTime, true)}>Lap</button>
      <StopwatchHistory history={history} removeHistoryEntry={removeHistoryEntry}/>
      {(history.length !== 0 || intervalID.current !== undefined) && <button onClick={clearAndResetTimer}
      >Clear and Reset</button>}
    </div>
  )
}

export function StopwatchPage({ className }: { className: string }) {
  const [watchIds, setWatchIds] = useState([1]);

  const stopwatches = watchIds.map((id) => {
    return (
      <Stopwatch
        stopwatchId={id}
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

function StopwatchHistory({ history, removeHistoryEntry }: { history: { value: string, deletable: boolean }[], removeHistoryEntry: (index: number) => void }) {
  return <ul>
      {
        history.map((entry, index) => {
          return (
            <li key={index}>
              {entry.value}
              {entry.deletable && <button onClick={() => {
                removeHistoryEntry(index)
              }}>Delete Lap</button>}
            </li>
          )
        })
      }
    </ul>
}