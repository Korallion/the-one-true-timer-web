import { useRef, useState } from "react";

function Stopwatch ({id, deleteStopwatch}: {id:number, deleteStopwatch: (id: number) => void}) {
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalID = useRef<NodeJS.Timer>();

    function startStopwatch () {
        setStartTime(Date.now);

        const id = setInterval(() => {
            setDuration(Date.now);
        }, 10);

        intervalID.current = id;
        setPaused(false);
    }

    function pauseStopwatch () {
        if (!paused){
            clearInterval(intervalID.current);
            setPaused(true);
        } else {
            setStartTime(Date.now() - (duration - startTime));

            const id = setInterval(() => {
                setDuration(Date.now);
            }, 10);
    
            intervalID.current = id;
            setPaused(false);
        }
    }

    let displayTime = Math.round((duration - startTime)/10)/100;

    return (
        <div>
            <h1>Stopwatch</h1>
            <h2>Duration: {displayTime}</h2>
            <button
                onClick={() => startStopwatch()}
            >{ duration === 0 ? "Start" : "Restart"}</button>
            <button
                onClick={() => pauseStopwatch()}
            >{paused ? "Resume" : "Pause"}</button>
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