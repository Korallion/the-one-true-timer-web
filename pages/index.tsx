import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react';
import Head from 'next/head';
import { StopwatchPage } from '@/components/stopwatch-page';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [activeTab, setActiveTab] = useState('Stopwatch');

  const setTab = (name: string) => {
    setActiveTab(name);
    return;
  }

  return (
    <>
      <Head>
        <title>TOTT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body>
        <h1 className='menu-title'>The One True Timer</h1>
        <div className='menu-bar'>
          <button
            className='menu-button'
            onClick={() => { setActiveTab("Stopwatches") }}
          >Stopwatches</button>

          <button
            className='menu-button'
            onClick={() => { setActiveTab("Timers") }}
          >Timers</button>

          <button
            className='menu-button'
            onClick={() => { setActiveTab("Alarms") }}
          >Alarms</button>

          <button
            className='menu-button'
            onClick={() => { setActiveTab("Clocks") }}
          >Clocks</button>
        </div>

        <div className='content'>
          {activeTab === "Stopwatches" ? <StopwatchPage /> : activeTab}
        </div>
      </body>
    </>
  )
}
