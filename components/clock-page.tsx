import { useState, useRef, useEffect } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";

export function Clock({id, deleteClock}: {id: number, deleteClock: (id: number) => void}) {
    const [today, setToday] = useState(new Date());

    const timeZone = useRef(0);
    const intervalID = useRef<NodeJS.Timer>();

    useEffect(() => {
        intervalID.current = setInterval(() => {
            const newDate = new Date(today.getTime() + timeZone.current * 60 * 60 * 1000);
            console.log(newDate.toLocaleDateString());
            setToday(newDate);
        }, 10);
    },[]);

    return (
        <div>
            {`Clock ${id}`}
            {`The date is ${today.toDateString()} and the time is ${today.toLocaleTimeString()}`}
            <input 
                className="bg-black border-white" 
                type="number" 
                min={-12}  
                max={14} 
                defaultValue={0}
                onChange={(e) => {timeZone.current = Number(e.target.value)}}/>
            <button 
                onClick={() => {
                    clearInterval(intervalID.current);
                    deleteClock(id);
                }
                }>Delete</button>
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