import React from 'react';
import './TopThreats.css';
import Table from 'react-bootstrap/Table';

function TopThreatTypes() {
  return (
    <div className='top-threats-table'>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Top Threat Type</th>
                    <th>Number of Alerts</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Failed Login</td>
                    <td>48</td>
                </tr>
                <tr>
                    <td>Unathorized access</td>
                    <td>39</td>
                </tr>
                <tr>
                    <td>Data Exfilteration</td>
                    <td>11</td>
                </tr>
            </tbody>
        </Table>
    </div>
  )
}

export default TopThreatTypes
