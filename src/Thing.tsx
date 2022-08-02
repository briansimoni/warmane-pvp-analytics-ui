import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { incremented, amountAdded } from './features/counter/counter-slice'
import { crawl, getMatchData } from './api/warmane-analytics'

export function Thing() {
    crawl('Dumpster', 'Blackrock')
    const value = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()

    function handleClick() {
        dispatch(amountAdded(4))
    }

    return (
        <div>
            <h2 onClick={handleClick}>{value}</h2>
        </div>
    )
}