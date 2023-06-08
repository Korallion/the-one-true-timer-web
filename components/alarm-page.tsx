import { useState, useRef, useEffect } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";

function Alarm({id, deleteAlarm}: {id: number, deleteAlarm: () => void}) {
    return (
        <div>
            {`Alarm ${id}`}
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