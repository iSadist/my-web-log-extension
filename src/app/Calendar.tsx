'use client'

import React, { useState, ChangeEvent } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const SessionCalendar = () => {
  const [sessionId, setSessionId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dates, setDates] = useState<Value>();

  const handleDateChange = (value: Value) => {
    setDates(value);
  }

  const validateTime = (time: string) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  const handleSessionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSessionId(event.target.value);
  };

  const handleStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!validateTime(event.target.value)) {
        console.log('invalid time');
    }

    setStartTime(event.target.value);
  }

  const handleEndTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!validateTime(event.target.value)) {
        console.log('invalid time');
    }

    setEndTime(event.target.value);
  }

  const submit = () => {
    console.log('submitting', sessionId, dates, startTime, endTime);
  }

  return (
    <div>
        <label>
            Session ID:
            <input
                className='bg-black'
                type="text"
                value={sessionId}
                onChange={handleSessionChange}
            />
        </label>
        <Calendar
            onChange={handleDateChange}
            value={dates}
        />

        {dates && <p>Selected date: {dates.toString()}</p>}

        <label>
            Start Time:
            <input
                className='bg-black'
                type="text"
                value={startTime}
                onChange={handleStartTimeChange}
            />
        </label>
        <label>
            End Time:
            <input
                className='bg-black'
                type="text"
                value={endTime}
                onChange={handleEndTimeChange}
            />
        </label>
        <button
            className='bg-black'
            onClick={submit}
        >
            Submit
        </button>
    </div>
  );
};

export default SessionCalendar;