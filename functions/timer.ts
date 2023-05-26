import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Howl } from 'howler';

export function convertSecondsToClockText<String>(time: number) {
    time = Math.round((time) / 10) / 100;

    let hours = Math.floor(time / 3600);
    let minutes = Math.floor(time % 3600 / 60);
    let seconds = Math.ceil(time % 60);

    let hoursText = String(hours).padStart(2, '0');
    let minutesText = String(minutes).padStart(2, '0');
    let secondsText = String(seconds).padStart(2, '0');

    return hoursText + minutesText + secondsText;
}

export function convertClockTextToTime<Number>(text: string) {
    let hours = Number(text.slice(0, 2));
    let minutes = Number(text.slice(2, 4));
    let seconds = Number(text.slice(-2));

    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

export function endTimer(intervalID: NodeJS.Timer, setRemainingTime: Dispatch<SetStateAction<number>>, sound?: Howl) {
    clearInterval(intervalID);
    setRemainingTime(0);

    if (sound) sound.play();
}

export function startTimer(startTime: MutableRefObject<number>, duration: number, setRemainingTime: Dispatch<SetStateAction<number>>): NodeJS.Timer {
    setRemainingTime(duration);

    const intervalID = setInterval(() => {
        let newValue = startTime.current + duration - Date.now();
        setRemainingTime(newValue);
    }, 10);

    return intervalID;
}

export function pauseTimer(intervalID: NodeJS.Timer, setPaused: Dispatch<SetStateAction<boolean>>) {
    clearInterval(intervalID);
    setPaused(true);
}

export function resumeTimer(
    intervalID: MutableRefObject<NodeJS.Timer | undefined>,
    duration: number,
    startTime: MutableRefObject<number>,
    remainingTime: number,
    setRemainingTime: Dispatch<SetStateAction<number>>,
    setPaused: Dispatch<SetStateAction<boolean>>) {

    startTime.current = Date.now() + remainingTime - duration;
    intervalID.current = startTimer(startTime, duration, setRemainingTime);

    setPaused(false);
}

export function handleTimerInput(e: React.KeyboardEvent<HTMLInputElement>, timeUnit: string, oldInput: string) {
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