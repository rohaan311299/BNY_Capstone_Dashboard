import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

function Threat() {
  const { id: threatId } = useParams();
  console.log("received", threatId);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch(`http://localHost:1900/api/predictions/${threatId}`)
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.error('Error fetching data:', error));
}, []);
  return (
    <div>
      <div>
        <h1>Threat ID: {threatId}</h1>
        <p>Date: {data.date}</p>
        <p>User ID: {data.userId}</p>
        <p>User: {data.user}</p>
        <p>Role: {data.role}</p>
        <p>Prediction: {data.prediction === -1 ? 'Not a Threat' : 'Threat'}</p>
        <p>Assigned To: {data.assignedTo}</p>
        <p>Progress: {data.progress}</p>
      </div>
    </div>
  )
}

export default Threat
