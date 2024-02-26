import { KeyboardEvent, useState } from "react";
import { handleTimeInput, convertClockTextToTime } from "@/functions/general";

export function TimePicker({ setTime, stopTimer = () => null }: { setTime: (input: number) => void, stopTimer?: Function }) {
  const [userInput, setUserInput] = useState("000000");

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>, value: string) {
    stopTimer()
    let newInput = handleTimeInput(e, value, userInput);
    setUserInput(newInput);
    setTime(convertClockTextToTime(newInput));
  }

  const timerInputs = ["hours", "minutes", "seconds"].map((value, index) => {
    return (
      <div key={index} className="inline">
        <input
          readOnly
          value={userInput.slice(index * 2, index * 2 + 2)}
          className="text-black"
          type="text"
          onKeyDown={(e) => handleKeyPress(e, value)}
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