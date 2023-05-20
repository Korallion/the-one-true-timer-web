import { Inter } from 'next/font/google'
import { useState } from 'react';
import Head from 'next/head';
import { StopwatchPage } from '@/components/stopwatch-page';
import { TimerPage } from '@/components/timer-page';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [activeTab, setActiveTab] = useState('Stopwatches');

  let pageComponent;

  switch(activeTab){
    case "Stopwatches":
      pageComponent = <StopwatchPage/>;
      break;
    case "Timers":
      pageComponent = <TimerPage/>;
      break;
    default:
      pageComponent = activeTab;
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
          { pageComponent }
        </div>
      </div>
    </>
  )
}
