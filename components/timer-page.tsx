import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { convertSecondsToClockText, convertClockTextToTime } from "@/functions/timer";
import { Howl } from 'howler';

const sound = new Howl({
    src: ["/alarm_2.mp3"],
});

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

    function handleTimerInput(e: React.KeyboardEvent<HTMLInputElement>, timeUnit: string) {
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
        setDuration(convertClockTextToTime(newInput));
    }

    let clockText: string;

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
                readOnly
                value={clockText.slice(0, 2)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleTimerInput(e, "hours")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setActive(false);
                }}
            />
            <text>h</text>
            <input
                readOnly
                value={clockText.slice(2, 4)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleTimerInput(e, "minutes")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setActive(false);
                }}
            />
            <text>m</text>
            <input
                readOnly
                value={clockText.slice(4, 6)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleTimerInput(e, "seconds")}
                onFocus={() => {
                    clearInterval(intervalID);
                    setActive(false);
                }}
            />
            <text>s</text>
        </div>
    )
}

function Timer({ id, deleteTimer }: { id: number, deleteTimer: (id: number) => void }) {
    const [duration, setDuration] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [paused, setPaused] = useState(true);
    const [active, setActive] = useState(false);
    const [repetitions, setRepetitions] = useState(0);
    
    

    const startTime = useRef(0);
    const pausedTime = useRef(0);
    const intervalID = useRef<NodeJS.Timer>();
    const repeatCounter = useRef(0);

    useEffect(() => {
        if (remainingTime < 0) {
            repeatCounter.current = repeatCounter.current + 1;
            console.log(`Timer completed ${repeatCounter.current} times`)

            if (repetitions === 0) {
                clearInterval(intervalID.current);
                setRemainingTime(0);
                sound.play();
                console.log("Timer ended with no repetitions");

            } else if (repeatCounter.current === repetitions) {
                clearInterval(intervalID.current);
                setRemainingTime(0);
                sound.play();
                console.log("Timer ended with " + repeatCounter.current + " repetitions");

            } else {
                clearInterval(intervalID.current);

                startTime.current = Date.now();

                setRemainingTime(duration);

                const id = setInterval(() => {
                    let newValue = startTime.current + duration - Date.now();
                    setRemainingTime(newValue);
                }, 10);

                intervalID.current = id;
                setPaused(false);
                setActive(true);
                console.log("Repeating timer for the " + (repeatCounter.current) + "st/nd/th time");
            }
        }
    }, [remainingTime])

    function startTimer() {
        if (intervalID.current !== undefined) {
            clearInterval(intervalID.current);
        }

        startTime.current = Date.now();
        repeatCounter.current = 0;

        setRemainingTime(duration);

        const id = setInterval(() => {
            let newValue = startTime.current + duration - Date.now();
            setRemainingTime(newValue);
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
                setRemainingTime(newValue);
            }, 10);

            intervalID.current = id;
            setPaused(false);
            setActive(true);
        }
    }

    return (
        <div>
            <h1>{`Timer ${id}`}</h1>
            <TimePicker
                setDuration={setDuration}
                remainingTime={remainingTime}
                intervalID={intervalID.current}
                startTimer={startTimer}
                active={active}
                setActive={setActive}
            />
            <button onClick={() => { startTimer() }}>{active ? "Restart" : "Start"}</button>
            <button onClick={togglePause}>{paused ? "Resume" : "Pause"}</button>
            {
                repetitions === 0
                    ? <button onClick={() => setRepetitions(2)}>Add Repetitions</button>
                    : (
                        <div>
                            <input className="text-black" type="number" min="2" defaultValue={2} onChange={(e) => setRepetitions(Number(e.target.value))} />
                            <button onClick={() => setRepetitions(0)}>Remove Repetitions</button>
                        </div>
                    )
            }
            <button onClick={() => { deleteTimer(id) }}>Delete</button>
        </div>
    )
}

export function TimerPage() {
    const [timerIds, setTimerIds] = useState<Array<number>>([1]);

    function addTimer() {
        if (timerIds.length) {
            const newId = timerIds[timerIds.length - 1] + 1;
            const newTimerSet = [...timerIds, newId];

            setTimerIds(newTimerSet);

        } else {
            setTimerIds([1]);
        }
    }

    function deleteTimer(id: number) {
        const index = timerIds.findIndex((item: number) => item === id);
        const newIds = [...timerIds];

        newIds.splice(index, 1);
        setTimerIds(newIds);
    }

    const timers = timerIds.map((id) => {
        return (
            <Timer
                id={id}
                key={id}
                deleteTimer={deleteTimer}
            />
        )
    });

    return (
        <div>
            <button onClick={addTimer}>Add Timer</button>
            {timers}
        </div>
    )
}