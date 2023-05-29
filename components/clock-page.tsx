import { useState, useRef } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";

export function Clock({id, deleteClock}: {id: number, deleteClock: (id: number) => void}) {
    const [today, setToday] = useState<Date>(new Date());

    const timeZone = useRef(0);

    setInterval(() => {
        setToday(new Date() );
    }, 10);

    const date = today.toDateString();
    const timeString = today.toLocaleTimeString();

    return (
        <div>
            {`Clock ${id}`}
            {`The date is ${date} and the time is ${timeString}`}
            <input 
                className="bg-black border-white" 
                type="number" 
                min={-12}  
                max={14} 
                defaultValue={0}
                onChange={(e) => {timeZone.current = Number(e.target.value)}}/>
            <button onClick={() => deleteClock(id)}>Delete</button>
        </div>
    )
}

export function ClockPage({className}: {className: string}) {
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