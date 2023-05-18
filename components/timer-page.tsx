import { FormEvent, useRef, useState } from "react";

function TimePicker() {
    const [userInput, setUserInput] = useState("000000");

    function handleInput(e: KeyboardEvent<HTMLInputElement>, timeUnit: string) {
        const isNumber = /^[0-9]$/i.test(e.key);

        if (e.key === "Esc" || e.key === "Escape") {
            setUserInput("000000");
            return;
        }

        if (!isNumber) {
            e.stopPropagation();
            return;
        }

        let newInput;

        if (timeUnit === "hours")
                newInput = userInput.slice(1, 2) + e.key + userInput.slice(2, 6);

        else if (timeUnit === "minutes")
                newInput = userInput.slice(1, 4) + e.key + userInput.slice(4, 6);

        else 
                newInput = userInput.slice(-5) + e.key;

        setUserInput(newInput);
    }


    return (
        <div>
            <input value={userInput[0] + userInput[1]} className="text-black" type="text" onKeyDown={(e) => handleInput(e, "hours")} />
            <text>h</text>
            <input value={userInput[2] + userInput[3]} className="text-black" type="text" onKeyDown={(e) => handleInput(e, "minutes")} />
            <text>m</text>
            <input value={userInput[4] + userInput[5]} className="text-black" type="text" onKeyDown={(e) => handleInput(e, "seconds")} />
            <text>s</text>
        </div>
    )
}

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

    let displayTime = Math.round((endTime.current - Date.now()) / 10) / 100;

    if (displayTime <= 0) {
        displayTime = 0;
        endTimer();
    }

    return (
        <div>
            <h1>Timer</h1>
            <TimePicker />
            <h2>{displayTime.toFixed(2)}</h2>
            <button onClick={startTimer}>Start</button>
        </div>
    )
}

export function TimerPage() {
    let [timers, setTimers] = useState();

    return (
        <div>
            <Timer />
        </div>
    )
}