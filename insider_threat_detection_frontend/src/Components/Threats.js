import React, {useState, useEffect} from 'react';
import './Threats.css';
import { useNavigate } from 'react-router-dom';

function Threats() {
    const [threatsData, setThreatsData] = useState([]);
    const [selectedThreatId, setSelectedThreatId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localHost:1900/api/predictions')
        .then(response => response.json())
        .then(data => setThreatsData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAssignedToUpdate = (index, assignedTo) => {
        const threatToUpdate = threatsData[index];
        updateThreat(index, { assignedTo });
    };

    const handleProgressUpdate = (index, progress) => {
        updateThreat(index, { progress });
    };

    const updateThreat = (index, updates) => {
        const threatToUpdate = threatsData[index];
        fetch('http://localhost:1900/api/predictions/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: threatToUpdate._id,
                ...updates,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Ideally, update your state here to reflect the change immediately
            // For simplicity, this example will refetch all data. For optimization, consider updating the item in the state directly.
            fetch('http://localHost:1900/api/predictions')
            .then(response => response.json())
            .then(data => setThreatsData(data))
            .catch(error => console.error('Error refetching data:', error));
        })
        .catch(error => console.error('Failed to update threat:', error));
    };

    const handleRowClick = (id) => {
        navigate(`/threat/${id}`); // Navigate to the Threat detail page
    };
    

    return (
        <div className='threats'>
            <div className='scrollable'>
                <table>
                    <tr>
                        <th>Date</th>
                        <th>User ID</th>
                        <th>Role</th>
                        <th>Prediction</th>
                        <th>Assigned To</th>
                        <th>Progress</th>
                    </tr>
                    <tbody>
                        {threatsData.map((threat, index) => (
                            <tr key={index}>
                                <td onClick={() => handleRowClick(threat._id)}>{threat.date}</td>
                                <td>{threat.user}</td>
                                <td>{threat.role}</td>
                                <td>{threat.predictions === -1 ? "Not A Threat":"Threat"}</td>
                                <td>
                                    <select value={threat.assignedTo ? threat.assignedTo : "na"} onChange={(e) => handleAssignedToUpdate(index, e.target.value)}>
                                        <option value="na">Not Assigned</option>
                                        <option value="rohan">Rohan</option>
                                        <option value="kevin">Kevin</option>
                                    </select>
                                </td>
                                <td>
                                    <select value={threat.progress ? threat.progress : "open"} onChange={(e) => handleProgressUpdate(index, e.target.value)}>
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default Threats


//Filter: date time filter, policy name, user or device, rohans laptop
// note down time stamps for when a user updates it 