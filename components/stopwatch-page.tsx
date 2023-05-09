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

    let displayTime = Math.round((duration - startTime)/10)/100;

    return (
        <div>
            <h1>Stopwatch</h1>
            <h2>Duration: {displayTime}</h2>
            <button
                onClick={()=>StartStopwatch()}
            >Start</button>
        </div>
    )
}

export function StopwatchPage () {
    const [numWatches, setNumWatches] = useState([1]);

    const stopwatches = numWatches.map((number) => {
        return (<Stopwatch/>)
    });

    return (
        <>
            <button onClick={() => {
                const newItem = numWatches[-1] + 1;
                let newNumber = [...numWatches, newItem ];
                setNumWatches(newNumber);
            }}>Add Stopwatch</button>
            {stopwatches}
        </>
    )
}