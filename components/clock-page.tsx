import { useState, useRef, useEffect } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";

export function Clock({ id, deleteClock }: { id: number, deleteClock: (id: number) => void }) {
    const [date, setDate] = useState<string>();
    const [time, setTime] = useState<string>();
    const timeZone = useRef(0);

    useEffect(() => {
        const currentTime = Date.now()
        const timeZoneAddition = timeZone.current * 60 * 60 * 1000;
        const currentDate = new Date(Date.now() + timeZone.current * 60 * 60 * 1000);
        setTime(currentDate.toLocaleTimeString());
        setDate(currentDate.toDateString());

        setInterval(() => {
            const currentTime = Date.now()
            const timeZoneAddition = timeZone.current * 60 * 60 * 1000;
            const currentDate = new Date(Date.now() + timeZone.current * 60 * 60 * 1000);
            setTime(currentDate.toLocaleTimeString());
            setDate(currentDate.toDateString());
        }, 50)
    }, []);

    return (
        <div>
            {`Clock ${id}`}
            {`The date is ${date} and the time is ${time}`}
            <input
                className="bg-black border-white"
                type="number"
                min={-12}
                max={14}
                defaultValue={0}
                onChange={(e) => { timeZone.current = Number(e.target.value) }}
            />
            <button onClick={() => deleteClock(id)}>Delete</button>
        </div>
    )
}

export function ClockPage({ className }: { className: string }) {
    const [clocks, setClocks] = useState([0]);

    const clockComponents = clocks.map((id) => {
        return (
            <div>
                <Clock
                    id={id}
                    key={id}
                    deleteClock={(id) => setClocks(deleteIdFromArray(id, clocks))}
                />
            </div>
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