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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

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
    sendRequest();
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }

  const sendRequest = () => {
    // Send a POST request to the server with the session ID, date, start time, and end time.
    const date = formatDate(dates as Date);

    const url = 'http://localhost:3000/api/sessions';

    const body = {
        startDatum: date,
        slutDatum: date,
        startTid: startTime,
        slutTid: endTime
    }

    const headers = {
      'Content-Type': 'application/json',
      'SESSION_ID': sessionId,
      // More headers as needed
    }

    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    }

    fetch(url, options)
      .then(response => {
        if (response.ok) {
          setResponse(true);
        } else {
          setResponse(false);
        }
      })
      .catch(error => {
      });

    console.log('sending request', body);
  }

  const setResponse = (success: boolean) => {
    if (success) {
      setMessage('Request was successful!');
      setSuccess(true);
    } else {
      setMessage('Request was not successful!');
      setError(true);
    }

    setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 3000);
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

        {dates && <p>Selected date: {formatDate(dates as Date)}</p>}

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
        <div>
            {success && <p>{message}</p>}
            {error && <p>{message}</p>}
        </div>
    </div>
  );
};

export default SessionCalendar;