import { useState } from "react";
import { start } from "repl";


function Stopwatch () {
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(0);

    function StartStopwatch () {
        setStartTime(Date.now);

        setInterval(() => {
            setDuration(Date.now);
        }, 10);
    }

    return (
        <div>
            <h1>Stopwatch</h1>
            <h2>Duration: {duration - startTime}</h2>
            <button
                onClick={()=>StartStopwatch()}
            >Start</button>
        </div>
    )
}

export function StopwatchPage () {
    const [stopwatches, setStopwatches] = useState();

    return (
        <>
            <Stopwatch />
        </>

    )
}