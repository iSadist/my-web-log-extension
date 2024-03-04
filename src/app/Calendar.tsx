'use client'

import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
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

  const updateSessionIdFromCookie = useCallback(() => {
    const sessionId = getCookie('MWLSESSID');
    if (sessionId) {
      setSessionId(sessionId);
    }
  }, []);

  useEffect(() => {
    setCookie('mwl_cookie_language', 'se', 365);
    setCookie('_ga_S4P9ZYLNP0', 'GS1.1.1709535426.3.1.1709537717.0.0.0', 365);
    setStartTime('08:00');
    setEndTime('12:00');
    updateSessionIdFromCookie();
  },[updateSessionIdFromCookie]);

  const handleDateChange = (value: Value) => {
    setDates(value);
  }

  const validateTime = (time: string) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  const handleSessionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCookie('MWLSESSID', event.target.value, 365);
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

  const toURLEncoded = (element: string) => {
    return encodeURIComponent(element);
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

    const proxyurl = 'http://localhost:3001/c_flightInstructionNew.php'
    const url = proxyurl
    // const url = 'https://www.myweblog.se/c_flightInstructionNew.php';

    const body = new URLSearchParams({
        add: '',
        lore: 'e',
        comment: '',
        confadd: 'ok',
        startdatum: date,
        slutdatum: date,
        startTid: toURLEncoded(startTime),
        slutTid: toURLEncoded(endTime),
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://www.myweblog.se',
      'Referer': 'https://www.myweblog.se/c_flightInstructionNew.php?add&lore=e',
      'Sec-Ch-Ua': '"Not A(Brand";v="99", "Brave";v="121", "Chromium";v="121"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    }

    const options = {
        method: 'POST',
        headers: headers,
        body: body,
        credentials: 'same-origin'
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
  }

  const setCookie = (name: string, value: string, days: number) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  const getCookie = (name: string) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
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