import { useState } from "react";
import { deleteIdFromArray, addIdToArray } from "@/functions/general";


export function Clock({id, deleteClock}: {id: number, deleteClock: (id: number) => void}) {
    return (
        <div>
            {`Clock ${id}`}
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