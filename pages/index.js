import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Home from '../components/Home.js'

export default function TheIndex() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Word Parachute Game</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to Word Parachute Game!
                </h1>

                <Home/>
            </main>
        </div>
    )
}