import { Inter } from 'next/font/google'
import { useState } from 'react';
import Head from 'next/head';
import { StopwatchPage } from '@/components/stopwatch-page';
import { TimerPage } from '@/components/timer-page';
import { AlarmPage } from '@/components/alarm-page';
import { ClockPage } from '@/components/clock-page';

const inter = Inter({ subsets: ['latin'] })

enum TAB {
  STOPWATCHES,
  TIMERS,
  ALARMS,
  CLOCKS
}

const clickColor = '#35194f'

export default function Home() {
  const [activeTab, setActiveTab] = useState(TAB.STOPWATCHES);

  return (
    <>
      <Head>
        <title>TOTT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='content'>
        <h1 className='menu-title'>The One True Timer</h1>
        <div className='menu-bar'>
          <button
            className='menu-button'
            onClick={() => setActiveTab(TAB.STOPWATCHES)}
            style={activeTab === TAB.STOPWATCHES ? { backgroundColor: clickColor} : {}}
          >Stopwatches</button>

          <button
            className='menu-button'
            onClick={() => setActiveTab(TAB.TIMERS)}
            style={activeTab === TAB.TIMERS ? { backgroundColor: clickColor} : {}}
          >Timers</button>

          <button
            className='menu-button'
            onClick={() => setActiveTab(TAB.ALARMS)}
            style={activeTab === TAB.ALARMS ? { backgroundColor: clickColor} : {}}
          >Alarms</button>

          <button
            className='menu-button'
            onClick={() => setActiveTab(TAB.CLOCKS)}
            style={activeTab === TAB.CLOCKS ? { backgroundColor: clickColor} : {}}
          >Clocks</button>
        </div>

        <div className='content'>
          <StopwatchPage className={"" + (activeTab === TAB.STOPWATCHES ? "" : " hidden")} />
          <TimerPage className={"" + (activeTab === TAB.TIMERS ? "" : " hidden")} />
          <AlarmPage className={"" + (activeTab === TAB.ALARMS ? "" : " hidden")} />
          <ClockPage className={"" + (activeTab === TAB.CLOCKS ? "" : " hidden")} />
        </div>
      </div>
    </>
  )
}
