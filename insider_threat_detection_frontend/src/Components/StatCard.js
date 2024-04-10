import React, { useEffect, useState } from 'react';
import './StatCard.css';
import { Card } from 'react-bootstrap';

function StatCard() {
  const [numberOfThreats, setNumberOfThreats] = useState();
  const [numberOfEmployees, setNumberOfEmployees] = useState();

  useEffect(() => {
    fetch("http://localHost:1900/api/stats")
      .then((res) => {
        if(!res.ok) {
          throw new Error("Failed to get the stats");
        }
        return res.json();
      })
      .then(data => {
        const stats = data[0];
        setNumberOfThreats(stats.totalNumberOfAlerts);
        setNumberOfEmployees(stats.numberOfEmployeesTriggeringAlerts);
      })
      .catch(error => {
        console.error('Failed to fetch stats:', error);
      });
  }, []);
  return (
    <div className='stat-card'>
      <Card className='card'>
        <Card.Body>
          <Card.Title className='title'>
            {String(numberOfThreats)}
          </Card.Title>
          <Card.Text>Number of total alerts</Card.Text>
        </Card.Body>
      </Card>
      <Card className='card'>
        <Card.Body>
          <Card.Title className='title'>
            {String(numberOfEmployees)}
          </Card.Title>
          <Card.Text>Number of employees triggered the alert in the past month</Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default StatCard
