import { Dispatch, SetStateAction, useRef, useState } from "react";

function TimePicker(
    { setDuration, remainingTime, intervalID, startTimer, isActive, setIsActive }:
        {
            setDuration: Dispatch<SetStateAction<number>>,
            remainingTime: number,
            intervalID: NodeJS.Timer | undefined,
            startTimer: Function,
            isActive: boolean,
            setIsActive: Dispatch<SetStateAction<boolean>>
        }) {

    const [userInput, setUserInput] = useState("000000");

    function handleInput(e: KeyboardEvent<HTMLInputElement>, timeUnit: string) {
        const isNumber = /^[0-9]$/i.test(e.key);
        let newInput;

        if (e.key === "Esc" || e.key === "Escape") {
            setUserInput("000000");
            return;
        }

        if (e.key === "Enter") {
            startTimer();
            setIsActive(true);
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

    function padZeros(inputString: string, places: number) {
        return inputString
    }

    let displayHours;
    let displayMinutes;
    let displaySeconds;

    if (isActive && remainingTime === 0) {
        displayHours = "00";
        displayMinutes = "00";
        displaySeconds = "00";

    } else if (isActive) {
        let displayTime = Math.round((remainingTime) / 10) / 100;

        displayHours = Math.floor(displayTime / 3600);
        displayMinutes = Math.floor(displayTime % 3600 / 60);
        displaySeconds = Math.ceil(displayTime % 60);

        displayHours = String(displayHours).padStart(2, '0');
        displayMinutes = String(displayMinutes).padStart(2, '0');
        displaySeconds = String(displaySeconds).padStart(2, '0');


    } else {
        displayHours = userInput[0] + userInput[1];
        displayMinutes = userInput[2] + userInput[3];
        displaySeconds = userInput[4] + userInput[5];
    }

    return (
        <div>
            <input
                value={displayHours}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleInput(e, "hours")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setIsActive(false);
                }}
            />
            <text>h</text>
            <input
                value={displayMinutes}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleInput(e, "minutes")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setIsActive(false);
                }}
            />
            <text>m</text>
            <input
                value={displaySeconds}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleInput(e, "seconds")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setIsActive(false);
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
    const [isActive, setIsActive] = useState(false);

    let startTime = useRef(0);
    let pausedTime = useRef(0);
    let intervalID = useRef<NodeJS.Timer>();

    function startTimer() {
        if (intervalID.current !== undefined) {
            clearInterval(intervalID.current);
        }

        startTime.current = Date.now();
        let newValue = startTime.current + duration - Date.now();
        setRemaingingTime(newValue);

        const id = setInterval(() => {
            let newValue = startTime.current + duration - Date.now();
            setRemaingingTime(newValue);
        }, 10);

        intervalID.current = id;
        setPaused(false);
        setIsActive(true);

        console.log("Timer started");
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
            setIsActive(true);
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
                isActive={isActive}
                setIsActive={setIsActive}
            />
            <button onClick={() => {
                startTimer();
            }}>Start</button>
            <button onClick={togglePause}>{paused ? "Resume" : "Pause"}</button>
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