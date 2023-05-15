import { useRef, useState } from "react";

function Timer() {
    const [duration, setDuration] = useState(3000);
    const [now, setNow] = useState(0); 
    const [paused, setPaused] = useState(true);
    let endTime = useRef(0);
    let intervalID = useRef<NodeJS.Timer>();

    function startTimer() {
        endTime.current = Date.now() + duration;

        const id = setInterval(() => {
            setNow(Date.now());
        }, 10)

        intervalID.current = id;
        setPaused(false);
    }

    function endTimer() {
        clearInterval(intervalID.current);

    }

    let displayTime = Math.round( (endTime.current - Date.now()) / 10 ) / 100;

    if (displayTime <= 0) {
        displayTime = 0;
        endTimer();
    }

    return(
        <div>
            <h1>Timer</h1>
            <h2>{displayTime.toFixed(2)}</h2>
            <button onClick={() => startTimer()}>Start</button>
        </div>
    )
}

export function TimerPage() {
    let [timers, setTimers] = useState();

    return (
        <div>
            <Timer/>
        </div>
    )
}