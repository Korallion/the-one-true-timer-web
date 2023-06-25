import { Inter } from 'next/font/google'
import { useState } from 'react';
import Head from 'next/head';
import { StopwatchPage } from '@/components/stopwatch-page';
import { TimerPage } from '@/components/timer-page';
import { AlarmPage } from '@/components/alarm-page';
import { ClockPage } from '@/components/clock-page';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [activeTab, setActiveTab] = useState('Stopwatches');

  let pageIndex = 0;

  switch (activeTab) {
    case "Stopwatches":
      pageIndex = 0;
      break;
    case "Timers":
      pageIndex = 1;
      break;
    case "Alarms":
      pageIndex = 2;
      break;
    case "Clocks":
      pageIndex = 3;
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

      <div className='content'>
        <div className='menu-bar'>
          <h1 className='menu-title'>The One True Timer</h1>
          <div className='navigation-container'>
            <button
              className={activeTab === "Stopwatches" ? 'menu-button-selected' : 'menu-button'}
              onClick={() => setActiveTab("Stopwatches")}
            >Stopwatches</button>

            <button
              className={activeTab === "Timers" ? 'menu-button-selected' : 'menu-button'}
              onClick={() => setActiveTab("Timers")}
            >Timers</button>

            <button
              className={activeTab === "Alarms" ? 'menu-button-selected' : 'menu-button'}
              onClick={() => setActiveTab("Alarms")}
            >Alarms</button>

            <button
              className={activeTab === "Clocks" ? 'menu-button-selected' : 'menu-button'}
              onClick={() => setActiveTab("Clocks")}
            >Clocks</button>
          </div>
        </div>

        <div className='feature-pages'>
          <StopwatchPage className={"" + (pageIndex === 0 ? "" : " hidden")} />
          <TimerPage className={"" + (pageIndex === 1 ? "" : " hidden")} />
          <AlarmPage className={"" + (pageIndex === 2 ? "" : " hidden")} />
          <ClockPage className={"" + (pageIndex === 3 ? "" : " hidden")} />
        </div>
      </div>
    </>
  )
}
