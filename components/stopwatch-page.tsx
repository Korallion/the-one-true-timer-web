import { useRef, useState } from "react";

function Stopwatch({ id, deleteStopwatch }: { id: number, deleteStopwatch: (id: number) => void }) {
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
                onClick={() => { deleteStopwatch(id) }}
            >Delete</button>
            <button
                onClick={() => { addLap(displayTime) }}>Lap</button>
            <ul>
                {LapDisplay()}
            </ul>
        </div>
    )
}

export function StopwatchPage() {
    const [watchIds, setWatchIds] = useState([1]);

    function addStopwatch() {
        if (watchIds.length !== 0) {
            const newItem = watchIds[watchIds.length - 1] + 1;
            let newNumber = [...watchIds, newItem];
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
        )
    });

    return (
        <>
            <button onClick={() => addStopwatch()}>Add Stopwatch</button>
            {stopwatches}
        </>
    )
}