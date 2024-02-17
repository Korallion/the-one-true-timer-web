import { useState, useRef } from "react";
import { deleteIdFromArray, addIdToArray, convertMillisecondsToClockTextWithLetters, convertMillisecondsToClockText } from "@/functions/general";
import { TimePicker } from "./common-components";

import { Howl } from 'howler';

// What is still needed?
// - repeat alarm / choice of days
// - "tomorrow" alarm
// - snooze function
// - if time is set for before "current" time, set for tomorrow

const alarmSound = new Howl({
    src: ["/tott_timer_end.mp3"],
})

function Alarm({ id, deleteAlarm }: { id: number, deleteAlarm: () => void }) {
    const [endTime, setEndTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const intervalID = useRef<NodeJS.Timer>();
    const buttonText = isActive ? "Deactivate" : "Activate"

    function activateAlarm() {
        intervalID.current = setInterval(() => {
            const now = new Date().getTime();

            if (endTime - now <= 0) {
                alarmSound.play();
                setRemainingTime(0);
                clearInterval(intervalID.current);
            } else {
                setRemainingTime(endTime - now);
            }

        }, 100);
        setIsActive(true)
    }

    function deactivateAlarm() {
        clearInterval(intervalID.current);
        setRemainingTime(0);
        setIsActive(false)
    }

    function toggleAlarmActivation() {
        if (isActive) {
            deactivateAlarm()
        } else {
            activateAlarm()
        }
    }

    return (
        <div>
            {`Alarm ${id}`}
            <TimePicker
                setTime={(input: number) => {
                    const today = new Date();
                    const beginningOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    let newEndTime = 0

                    if (endTime !== 0 && endTime <= today.getTime()) {
                        newEndTime = input + beginningOfDay.getTime() + 24 * 60 * 60 * 1000
                    } else {
                        newEndTime = input + beginningOfDay.getTime()
                    }

                    setEndTime(newEndTime)
                }}
            />
            {`Time until alarm: ${convertMillisecondsToClockText(remainingTime)}`}
            <button onClick={toggleAlarmActivation}
            >{buttonText}</button>
            <button onClick={deleteAlarm}>Delete</button>
        </div >
    )
}

export function AlarmPage({ className }: { className: string }) {
    const [alarmIds, setAlarmIds] = useState([1]);

    const alarms = alarmIds.map((id) =>
        <Alarm
            id={id}
            key={id}
            deleteAlarm={() => setAlarmIds(deleteIdFromArray(id, alarmIds))}
        />
    );

    return (
        <div className={className}>
            <button onClick={() => setAlarmIds(addIdToArray(alarmIds))}>Add Alarm</button>
            {alarms}
        </div>
    )
}