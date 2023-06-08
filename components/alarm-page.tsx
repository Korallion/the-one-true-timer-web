import { useState, useRef } from "react";
import { deleteIdFromArray, addIdToArray, convertMillisecondsToClockText } from "@/functions/general";
import { TimePicker } from "./common-components";

function Alarm({id, deleteAlarm}: {id: number, deleteAlarm: () => void}) {
    const [endTime, setEndTime] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [active, setActive] = useState(false);

    const intervalID = useRef<NodeJS.Timer>();

    return (
        <div>
            {`Alarm ${id}`}
            <TimePicker 
                setTime={(input: number) => {
                    const today = new Date();
                    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    setEndTime(input + todayStart.getTime());
                }}
            />
            {`Time until alarm: ${convertMillisecondsToClockText(remainingTime)}`}
            <button onClick={() => {
                if (!active) {
                    intervalID.current = setInterval(() => {
                        const now = new Date().getTime();

                        setRemainingTime(endTime - now);
                    }, 50);

                } else {
                    clearInterval(intervalID.current);
                    setRemainingTime(0);
                }

                setActive(!active);
            }} 
            >{active ? "Deactivate": "Activate"}</button>
            <button onClick={deleteAlarm}>Delete</button>
        </div>
    )
}

export function AlarmPage({className}: {className: string}) {
    const [alarmIds, setAlarmIds] = useState([1]);

    const alarms = alarmIds.map((id) => {
        return (
            <Alarm 
                id={id}
                key={id}
                deleteAlarm={() => setAlarmIds(deleteIdFromArray(id, alarmIds))}
            />
        )
    });

    return (
        <div className={className}>
            <button
                onClick={() => setAlarmIds(addIdToArray(alarmIds))}
            >Add Alarm</button>
            {alarms}
        </div>
    )
}