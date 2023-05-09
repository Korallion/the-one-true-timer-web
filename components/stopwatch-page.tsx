import { useState } from "react";
import { start } from "repl";


function Stopwatch ({id, deleteStopwatch}: {id:number, deleteStopwatch: (id: number) => void}) {
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(0);

    function startStopwatch () {
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
                onClick={() => startStopwatch()}
            >Start</button>
            <button
                onClick={() => {deleteStopwatch(id)}}
            >Delete</button>
        </div>
    )
}

export function StopwatchPage () {
    const [numWatches, setNumWatches] = useState([1]);

    function deleteStopwatch(id: number) {
        const index = numWatches.findIndex((value: number) => value === id);
        const newStopwatches = [...numWatches];
        newStopwatches.splice(index, 1);

        setNumWatches(newStopwatches);
    }

    const stopwatches = numWatches.map((number) => {
        return (
            <Stopwatch
                id={number}
                deleteStopwatch={deleteStopwatch}
            />
        )});

    return (
        <>
            <button onClick={() => {
                if (numWatches.length !== 0) {
                    const newItem = numWatches[numWatches.length-1] + 1;
                    let newNumber = [...numWatches, newItem ];
                    setNumWatches(newNumber);
                    return;
                }

                setNumWatches([1]);
                
            }}>Add Stopwatch</button>
            {stopwatches}
            {numWatches.toString()}
        </>
    )
}