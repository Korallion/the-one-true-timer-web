import { Dispatch, SetStateAction, useRef, useState } from "react";
import { convertSecondsToClockText } from "@/functions/timer";

function TimePicker(
    { setDuration, remainingTime, intervalID, startTimer, active, setActive }:
        {
            setDuration: Dispatch<SetStateAction<number>>,
            remainingTime: number,
            intervalID: NodeJS.Timer | undefined,
            startTimer: Function,
            active: boolean,
            setActive: Dispatch<SetStateAction<boolean>>
        }) {

    const [userInput, setUserInput] = useState("000000");

    function handleInput(e: React.KeyboardEvent<HTMLInputElement>, timeUnit: string) {
        const isNumber = /^[0-9]$/i.test(e.key);
        let newInput;

        if (e.key === "Esc" || e.key === "Escape") {
            setUserInput("000000");
            return;
        }

        if (e.key === "Enter") {
            startTimer();
            setActive(true);
            return;
        }

        if (!isNumber && e.key !== "Backspace") {
            e.stopPropagation();
            return;
        }


        if (e.key === "Backspace") {
            if (timeUnit === "hours")
                newInput = '0' + userInput[0] + userInput.slice(2, 6);

            else if (timeUnit === "minutes")
                newInput = '0' + userInput.slice(0, 3) + userInput.slice(4, 6);

            else
                newInput = '0' + userInput.slice(0, 5);

        } else {
            if (timeUnit === "hours")
                newInput = userInput.slice(1, 2) + e.key + userInput.slice(2, 6);

            else if (timeUnit === "minutes")
                newInput = userInput.slice(1, 4) + e.key + userInput.slice(4, 6);

            else
                newInput = userInput.slice(-5) + e.key;
        }

        setUserInput(newInput);

        let hours = Number(newInput.slice(0, 2));
        let minutes = Number(newInput.slice(2, 4));
        let seconds = Number(newInput.slice(-2));

        setDuration((hours * 60 * 60 + minutes * 60 + seconds) * 1000);
    }

    let clockText : string;

    if (active && remainingTime === 0) {
        clockText = "000000";

    } else if (active) {
        clockText = convertSecondsToClockText(remainingTime);

    } else {
        clockText = userInput;
    }

    return (
        <div>
            <input
                value={clockText.slice(0,2)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleInput(e, "hours")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setActive(false);
                }}
            />
            <text>h</text>
            <input
                value={clockText.slice(2,4)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleInput(e, "minutes")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setActive(false);
                }}
            />
            <text>m</text>
            <input
                value={clockText.slice(4,6)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleInput(e, "seconds")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setActive(false);
                }}
            />
            <text>s</text>
        </div>
    )
}

function Timer() {
    const [duration, setDuration] = useState(0);
    const [remainingTime, setRemaingingTime] = useState(0);
    const [paused, setPaused] = useState(true);
    const [active, setActive] = useState(false);
    const [repetitions, setRepetitions] = useState(0);

    const startTime = useRef(0);
    const pausedTime = useRef(0);
    const intervalID = useRef<NodeJS.Timer>();
    const repeatCounter = useRef(0);

    function startTimer() {
        if (intervalID.current !== undefined) {
            clearInterval(intervalID.current);
        }

        startTime.current = Date.now();
        repeatCounter.current = 0;

        setRemaingingTime(duration);

        const id = setInterval(() => {
            let newValue = startTime.current + duration - Date.now();
            setRemaingingTime(newValue);
        }, 10);

        intervalID.current = id;
        setPaused(false);
        setActive(true);

        console.log("Starting timer of " + duration + "milliseconds with " + repetitions + " repetitions");
    }

    function togglePause() {
        if (!paused) {
            pausedTime.current = Date.now();
            clearInterval(intervalID.current);
            setPaused(true);

        } else {
            startTime.current = Date.now() + remainingTime - duration;

            const id = setInterval(() => {
                let newValue = startTime.current + duration - Date.now();
                setRemaingingTime(newValue);
            }, 10);

            intervalID.current = id;
            setPaused(false);
            setActive(true);
        }
    }

    if (remainingTime <= 0 && active) {
        repeatCounter.current = repeatCounter.current + 1;

        if (repetitions === 0) {
            clearInterval(intervalID.current);
            console.log("Timer ended with no repetitions");
        } else if (repetitions <= repeatCounter.current) {
            clearInterval(intervalID.current);
            console.log("Timer ended with " + repeatCounter.current + " repetitions");
        } else {
            clearInterval(intervalID.current);

            startTime.current = Date.now();

            setRemaingingTime(duration);

            const id = setInterval(() => {
                let newValue = startTime.current + duration - Date.now();
                setRemaingingTime(newValue);
            }, 10);

            intervalID.current = id;
            setPaused(false);
            setActive(true);
            console.log("Repeating timer for the " + (repeatCounter.current) + "st/nd/th time")
        }
    }

    return (
        <div>
            <h1>Timer</h1>
            <TimePicker
                setDuration={setDuration}
                remainingTime={remainingTime}
                intervalID={intervalID.current}
                startTimer={startTimer}
                active={active}
                setActive={setActive}
            />
            <button onClick={() => {
                startTimer();
            }}>{active ? "Restart" : "Start"}</button>
            <button onClick={togglePause}>{paused ? "Resume" : "Pause"}</button>
            {
                repetitions === 0
                    ? <button onClick={() => setRepetitions(1)}>Add Repetitions</button>
                    : (
                        <div>
                            <input className="text-black" type="number" min="2" defaultValue={2} onChange={(e) => setRepetitions(Number(e.target.value))} />
                            <button onClick={() => setRepetitions(0)}>Remove Repetitions</button>
                        </div>
                    )
            }
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