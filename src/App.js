import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [cities, setCities] = useState([]);

  const fetchCities = () => {
    axios.get('http://localhost:3001/cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => console.error('Error fetching cities:', error));
  };

  return (
    <div>
      <h1>City Information</h1>
      <button onClick={fetchCities}>Load Cities</button>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>{city}</li>  // Display city names
        ))}
      </ul>
    </div>
  );
}

export default App;
