import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { convertSecondsToClockText, convertClockTextToTime, startTimer, endTimer, pauseTimer, resumeTimer } from "@/functions/timer";
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

function IntervalTimePicker(
    { duration, setDuration, }: { duration: number, setDuration: Function }) {

    const [userInput, setUserInput] = useState("000000");

    function handleTimerInput(e: React.KeyboardEvent<HTMLInputElement>, timeUnit: string) {
        const isNumber = /^[0-9]$/i.test(e.key);
        let newInput;

        if (e.key === "Esc" || e.key === "Escape") {
            setUserInput("000000");
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

    return (
        <div>
            <input
                readOnly
                value={userInput.slice(0, 2)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleTimerInput(e, "hours")}
            />
            <text>h</text>
            <input
                readOnly
                value={userInput.slice(2, 4)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleTimerInput(e, "minutes")}
            />
            <text>m</text>
            <input
                readOnly
                value={userInput.slice(4, 6)}
                className="text-black"
                type="text"
                onKeyDown={(e) => handleTimerInput(e, "seconds")}
            />
            <text>s</text>
        </div>
    )
}

function Timer({ id, deleteTimer }: { id: number, deleteTimer: (id: number) => void }) {
    const [duration, setDuration] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [repetitions, setRepetitions] = useState(0);
    const [paused, setPaused] = useState(true);
    const [active, setActive] = useState(false);
    const [intervals, setIntervals] = useState([{ duration: 0, repetitions: 1 }]);

    const startTime = useRef(0);
    const intervalID = useRef<NodeJS.Timer>();
    const repeatCounter = useRef(0);

    useEffect(() => {
        if (remainingTime < 0 && intervalID.current) {
            repeatCounter.current = repeatCounter.current + 1;
            console.log(`Timer has run ${repeatCounter.current} repetition(s)`);

            if (repetitions === 0 || repeatCounter.current === repetitions) {
                endTimer(intervalID.current, setRemainingTime, sound);

            } else {
                clearInterval(intervalID.current);

                startTime.current = Date.now();
                intervalID.current = startTimer(startTime, duration, setRemainingTime);

                setPaused(false);
                setActive(true);
                console.log("Repeating timer for the " + (repeatCounter.current) + "st/nd/th time");
            }
        }
    }, [remainingTime])

    const intervalTimer = intervals.map((item, index) => {
        return (
            <div key={index}>
                <IntervalTimePicker
                    duration={item.duration}
                    setDuration={(newDuration: number) => {
                        const newIntervals = intervals;
                        newIntervals[index].duration = newDuration;
                        setIntervals(newIntervals);
                    }}
                />
                <button onClick={() => {
                    let newIntervals = [...intervals];
                    newIntervals.splice(index, 1);
                    setIntervals(newIntervals);
                }}>
                    Delete Interval
                </button>
            </div>
        )
    })

    return (
        <div>
            <h1>{`Timer ${id}`}</h1>
            <button onClick={() => {
                const newIntervals = intervals.concat({ duration: 0, repetitions: 1 });
                setIntervals(newIntervals);
            }}>
                Add Interval
            </button>

            {intervalTimer}

            <TimePicker
                setDuration={setDuration}
                remainingTime={remainingTime}
                intervalID={intervalID.current}
                startTimer={() => {
                    if (intervalID.current) {
                        clearInterval(intervalID.current);
                    }

                    startTime.current = Date.now();
                    repeatCounter.current = 0;

                    intervalID.current = startTimer(startTime, duration, setRemainingTime);
                    setPaused(false);
                    setActive(true);

                    console.log("Starting timer of " + duration + "milliseconds with " + repetitions + " repetitions");
                }}
                active={active}
                setActive={setActive}
            />

            <button onClick={() => {
                startTime.current = Date.now();
                intervalID.current = startTimer(startTime, duration, setRemainingTime);
                repeatCounter.current = 0;

                setPaused(false);
                setActive(true);
            }}
            >{active ? "Restart" : "Start"}</button>

            <button
                onClick={() => {
                    if (intervalID.current) {
                        if (paused) {
                            resumeTimer(intervalID, duration, startTime, remainingTime, setRemainingTime, setPaused);
                        } else {
                            pauseTimer(intervalID.current, setPaused);
                        }
                    }

                }}>
                {paused ? "Resume" : "Pause"}
            </button>
            {
                repetitions === 0
                    ? <button onClick={() => setRepetitions(2)}>Add Repetitions</button>
                    : (
                        <div>
                            <input
                                className="text-black"
                                type="number"
                                min="2"
                                defaultValue={2}
                                onChange={(e) => setRepetitions(Number(e.target.value))}
                            />
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