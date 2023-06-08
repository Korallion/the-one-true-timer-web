import { useState, useRef, useEffect } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";
import { timeZones } from "@/public/data/timezones";

export function Clock({ id, deleteClock }: { id: number, deleteClock: () => void }) {
    const [date, setDate] = useState<string>();
    const [time, setTime] = useState<string>();
    const textTimeZone = useRef(Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(() => {

        const currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: textTimeZone.current }));
        setTime(currentTime.toLocaleTimeString());
        setDate(currentTime.toDateString());

        setInterval(() => {
            const currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: textTimeZone.current }));
            setTime(currentTime.toLocaleTimeString());
            setDate(currentTime.toDateString());

        }, 50);
    }, []);

    const timeZoneSelect = timeZones.map((value) => {
        return (
            <option key={value} value={value} >{value}</option>
        )
    })

    return (
        <div>
            {`Clock ${id}`}
            {`The date is ${date} and the time is ${time}`}
            <select
                className="bg-black"
                defaultValue={textTimeZone.current}
                onChange={(e) => { textTimeZone.current = e.target.value }}
            >
                {timeZoneSelect}
            </select>
            <button onClick={deleteClock}>Delete</button>
        </div>
    )
}

export function ClockPage({ className }: { className: string }) {
    const [clocks, setClocks] = useState([1]);

    const clockComponents = clocks.map((id) => {
        return (
            <Clock
                id={id}
                key={id}
                deleteClock={() => setClocks(deleteIdFromArray(id, clocks))}
            />
        )
    });

    return (
        <div className={className}>
            <button
                onClick={() => setClocks(addIdToArray(clocks))}
            >Add Clock</button>
            {clockComponents}
        </div>
    )
}