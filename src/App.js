import React, { useState, useEffect } from 'react';
import './App.css';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import arrow from './assets/icon-arrow.svg'

function App() {
  const [ip, setIp] = useState('')
  const [location, setLocation] = useState('')
  const [position, setPosition] = useState([0, 0])
  const [List, setList] = useState([])
  
  const key = process.env.REACT_APP_LEAFLET_API_KEY;
  const url = `https://geo.ipify.org/api/v1?apiKey=${key}&ipAddress=${ip}`;

  async function fetchmap() 
  {
    fetch(url)
    .then(response => response.json())
    .then(json => {
      setLocation(json.location.city + `, ${json.location.region} `+ json.location.postalCode);
      setPosition([json.location.lat, json.location.lng]);
      const tab = [json.ip, json.location.city + `, ${json.location.region} `+ json.location.postalCode, json.location.timezone, json.isp];
      const desc = ["IP ADDRESS", "LOCATION", "TIMEZONE", "ISP"];
      const ret = []
      for(let i = 0; i < 4; i++) {
        let utc = "";
        if (i === 2)
          utc = "UTC "
        ret.push(<li key={i} className="info__ul__li"><h1 className="info__ul__li__title">{desc[i]}</h1><p className={"info__ul__li__subtitle " + desc[i]}>{utc + tab[i]}</p></li>);
      }
      setList(ret);
    });
  }

  useEffect(() => {
    fetchmap();
    // eslint-disable-next-line
  }, []);

  const findAdress = (e) => {
    let nbr = 0;
    let point = 0;
    let save = 0;
    for(let i = 0; i < ip.length ; i++) {
      if (Number.isInteger(parseInt(ip[i], 10)) && (save || i === 0))
        nbr++;
      if (ip[i] === '.') {
        point++;
        save++;
      }
      else
        save = 0;
    }
    if (nbr === 4 && point === 3) {
      fetchmap();
      setIp('');
    }
    else
      alert('Invalid Adress IP')
    e.preventDefault();
  }

  return (
    <div className="App">
      <div className="info">
        <h1 className="info__title">IP Address Tracker</h1>
        <form className="info__form" onSubmit={findAdress}>
          <input className="info__form__input" value={ip} onChange={e => setIp(e.target.value)}/>
          <button className="info__form__button"><img className="info__form__button_arrow" alt="arrow" src={arrow}></img></button>
        </form>
        <ul className="info__ul">
          {List}
        </ul>
      </div>
      <Map className="map" center={position} minZoom={5} zoom={12} maxZoom={19}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>{location}</Popup>
        </Marker>
      </Map>
    </div>
  );
}

export default App;
