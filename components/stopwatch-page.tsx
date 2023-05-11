import { useState } from "react";

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
    const [watchIds, setWatchIds] = useState([1]);

    function addStopwatch() {
        if (watchIds.length !== 0) {
            const newItem = watchIds[watchIds.length-1] + 1;
            let newNumber = [...watchIds, newItem ];
            setWatchIds(newNumber);
            return;
        }

        setWatchIds([1]);
    }

    function deleteStopwatch(id: number) {
        const index = watchIds.findIndex((value: number) => value === id);
        const newStopwatches = [...watchIds];
        newStopwatches.splice(index, 1);

        setWatchIds(newStopwatches);
    }

    const stopwatches = watchIds.map((id) => {
        return (
            <Stopwatch
                id={id}
                key={id}
                deleteStopwatch={deleteStopwatch}
            />
        )});

    return (
        <>
            <button onClick={() => addStopwatch()}>Add Stopwatch</button>
            {stopwatches}
            {watchIds.toString()}
        </>
    )
}