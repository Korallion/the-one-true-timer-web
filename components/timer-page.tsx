import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { convertSecondsToClockText, convertClockTextToTime, startTimer, endTimer, pauseTimer, resumeTimer } from "@/functions/timer";
import { Howl } from 'howler';

const sound = new Howl({
    src: ["/alarm_2.mp3"],
});

function handleTimerInput(e: React.KeyboardEvent<HTMLInputElement>, timeUnit: string, oldInput: string) {
    const isNumber = /^[0-9]$/i.test(e.key);
    let newInput;

    if (e.key === "Esc" || e.key === "Escape") {
        return "000000";
    }

    if (!isNumber && e.key !== "Backspace") {
        e.stopPropagation();
        return oldInput;
    }

    if (e.key === "Backspace") {
        if (timeUnit === "hours")
            newInput = '0' + oldInput[0] + oldInput.slice(2, 6);

        else if (timeUnit === "minutes")
            newInput = '0' + oldInput.slice(0, 3) + oldInput.slice(4, 6);

        else
            newInput = '0' + oldInput.slice(0, 5);

    } else {
        if (timeUnit === "hours")
            newInput = oldInput.slice(1, 2) + e.key + oldInput.slice(2, 6);

        else if (timeUnit === "minutes")
            newInput = oldInput.slice(1, 4) + e.key + oldInput.slice(4, 6);

        else
            newInput = oldInput.slice(-5) + e.key;
    }

    return newInput;
}

function TimePicker(
    { setDuration, }: { setDuration: Function }) {

    const [userInput, setUserInput] = useState("000000");

    const timerInputs = ["hours", "minutes", "seconds"].map((value, index) => {
        return (
            <div key={index} className="inline">
                <input
                    readOnly
                    value={userInput.slice(index * 2, index * 2 + 2)}
                    className="text-black"
                    type="text"
                    onKeyDown={(e) => {
                        let newInput = handleTimerInput(e, value, userInput);
                        setUserInput(newInput);
                        setDuration(convertClockTextToTime(newInput));
                    }}
                />
                <text>{value[0]}</text>
            </div>

        )
    })

    return (
        <div>
            {timerInputs}
        </div>
    )
}

function Timer({ id, deleteTimer }: { id: number, deleteTimer: (id: number) => void }) {
    const [remainingTime, setRemainingTime] = useState(0);
    const [repetitions, setRepetitions] = useState(0);
    const [paused, setPaused] = useState(true);
    const [active, setActive] = useState(false);
    const [intervals, setIntervals] = useState([{ duration: 0, repetitions: 1 }]);

    const startTime = useRef(0);
    const intervalID = useRef<NodeJS.Timer>();
    const currentInterval = useRef(0);
    const timerRepeatCounter = useRef(0);
    const intervalRepeatCounter = useRef(0);

    useEffect(() => {
        if (remainingTime < 0 && intervalID.current) {
            intervalRepeatCounter.current = intervalRepeatCounter.current + 1;
            const intervalCompleted = (intervalRepeatCounter.current === intervals[currentInterval.current].repetitions);

            if (intervalCompleted) {
                currentInterval.current = currentInterval.current + 1;
                const allIntervalsCompleted = (currentInterval.current === intervals.length);

                if (allIntervalsCompleted) {
                    timerRepeatCounter.current = timerRepeatCounter.current + 1;
                    const allRepetitionsCompleted = (timerRepeatCounter.current === repetitions);

                    if (allRepetitionsCompleted) {
                        console.log(`Timer finished`)
                        endTimer(intervalID.current, setRemainingTime, sound);
                        
                    } else {
                        console.log(`Timer repeating`);

                        clearInterval(intervalID.current);
                        currentInterval.current = 0;
                        intervalRepeatCounter.current = 0;
                        startTime.current = Date.now();
                        intervalID.current = startTimer(startTime, intervals[currentInterval.current].duration, setRemainingTime);
                    }
                } else {
                    const intervalDuration = intervals[currentInterval.current].duration;
                    const intervalRepetitions = intervals[currentInterval.current].repetitions;

                    console.log(`Starting interval ${currentInterval.current} of ${intervalRepetitions} reps of ${intervalDuration}s`)
                    clearInterval(intervalID.current);

                    intervalRepeatCounter.current = 0;
                    startTime.current = Date.now();
                    intervalID.current = startTimer(startTime, intervals[currentInterval.current].duration, setRemainingTime);
                }
            } else {
                const intervalDuration = intervals[currentInterval.current].duration;

                console.log(`Starting repetition ${intervalRepeatCounter.current} of interval ${currentInterval.current} for a duration of ${intervalDuration}s`)
                clearInterval(intervalID.current);

                startTime.current = Date.now();
                intervalID.current = startTimer(startTime, intervals[currentInterval.current].duration, setRemainingTime);
            }
        }
    }, [remainingTime]);

    const intervalInputs = intervals.map((item, index) => {
        return (
            <div key={index}>
                <TimePicker
                    setDuration={(newDuration: number) => {
                        const newIntervals = intervals;
                        newIntervals[index].duration = newDuration;
                        setIntervals(newIntervals);
                    }}
                />
                <input
                    className="text-black"
                    type="number"
                    min="1"
                    defaultValue={1}
                    onChange={(e) => {
                        const newIntervals = intervals;
                        newIntervals[index].repetitions = Number(e.target.value);
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
    });

    const displayTime = convertSecondsToClockText(remainingTime);

    const hours = displayTime.slice(0, 2);
    const minutes = displayTime.slice(2, 4);
    const seconds = displayTime.slice(4, 6);

    return (
        <div>
            <h1>{`Timer ${id}`}</h1>
            <button onClick={() => {
                const newIntervals = intervals.concat({ duration: 0, repetitions: 1 });
                setIntervals(newIntervals);
            }}>
                Add Interval
            </button>

            {intervalInputs}

            <p className="inline">{hours}</p>
            <p className="inline">h</p>
            <p className="inline">{minutes}</p>
            <p className="inline">m</p>
            <p className="inline">{seconds}</p>
            <p className="inline">s</p>

            <button onClick={() => {
                if (intervalID.current) clearInterval(intervalID.current);

                startTime.current = Date.now();
                currentInterval.current = 0;
                intervalRepeatCounter.current = 0;
                timerRepeatCounter.current = 0;

                intervalID.current = startTimer(startTime, intervals[currentInterval.current].duration, setRemainingTime);

                setPaused(false);
                setActive(true);
            }}
            >{active ? "Restart" : "Start"}</button>

            <button
                onClick={() => {
                    if (intervalID.current) {
                        if (paused) {
                            const duration = intervals[currentInterval.current].duration;

                            resumeTimer(intervalID, duration, startTime, remainingTime, setRemainingTime, setPaused);
                        } else {
                            pauseTimer(intervalID.current, setPaused);
                        }
                    }

                }}>
                {paused ? "Resume" : "Pause"}
            </button>
            {
                repetitions === 1
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
                            <button onClick={() => setRepetitions(1)}>Remove Repetitions</button>
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