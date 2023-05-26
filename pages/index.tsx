import { Inter } from 'next/font/google'
import { useState } from 'react';
import Head from 'next/head';
import { StopwatchPage } from '@/components/stopwatch-page';
import { TimerPage } from '@/components/timer-page';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [activeTab, setActiveTab] = useState('Stopwatches');

  let pageIndex = 0;

  switch(activeTab){
    case "Stopwatches":
      pageIndex = 0;
      break;
    case "Timers":
      pageIndex = 1;
      break;
    default:
      pageIndex = 0;
  }

  return (
    <>
      <Head>
        <title>TOTT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className='menu-title'>The One True Timer</h1>
        <div className='menu-bar'>
          <button
            className='menu-button'
            onClick={() => setActiveTab("Stopwatches") }
          >Stopwatches</button>

          <button
            className='menu-button'
            onClick={() => setActiveTab("Timers") }
          >Timers</button>

          <button
            className='menu-button'
            onClick={() => setActiveTab("Alarms") }
          >Alarms</button>

          <button
            className='menu-button'
            onClick={() => setActiveTab("Clocks") }
          >Clocks</button>
        </div>

        <div className='content'>
            <StopwatchPage className={"" + (pageIndex === 0 ? "" : " hidden")}/> 
            <TimerPage className={"" + (pageIndex === 1 ? "" : " hidden")}/>
          
        </div>
      </div>
    </>
  )
}
