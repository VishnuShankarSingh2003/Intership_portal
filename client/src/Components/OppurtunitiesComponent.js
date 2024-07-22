
import React, { useEffect, useState } from 'react';
import oppurtunitiesData from "../opportunities.json";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './OppurtunitiesComponent.css'; // Import the CSS file

export default function OppurtunitiesComponent() {
  const [appliedOppurtunities, setAppliedOppurtunities] = useState([]);

  useEffect(() => {
    fetchAppliedOppurtunities();
  }, []);

  const fetchAppliedOppurtunities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/applied-oppurtunities");
      setAppliedOppurtunities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="oppurtunities-container">
      <h1 className="oppurtunities-title">Internship Opprtunities</h1>
      <div>
        {Object.values(oppurtunitiesData.internships_meta).map(oppurtunity => (
          <OppurtunityCard
            key={oppurtunity.id}
            oppurtunity={oppurtunity}
            appliedOppurtunities={appliedOppurtunities}
          />
        ))}
      </div>
    </div>
  );
}

const OppurtunityCard = ({ oppurtunity, appliedOppurtunities }) => {
  const navigate = useNavigate();
  const {
    id,
    profile_name,
    company_name,
    stipend,
    start_date,
    locations,
    duration
  } = oppurtunity;

  const isApplied = Array.isArray(appliedOppurtunities) && appliedOppurtunities.some(item => item.id === id);

  const applyForOppurtunity = async (oppurtunity) => {
    try {
      await axios.post("http://localhost:3000/auth/apply", { oppurtunity });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="oppurtunity-card">
      <h1>{profile_name}</h1>
      <p><strong>Company: </strong> {company_name}</p>
      <p><strong>Stipend: </strong> {stipend.salary}</p>
      <p><strong>Location: </strong> {locations.map(location => location.string).join(', ')}</p>
      <p><strong>Duration: </strong> {duration}</p>
      <p><strong>Start Date: </strong> {start_date}</p>
      {isApplied ? (
        <button disabled>Applied</button>
      ) : (
        <button onClick={() => applyForOppurtunity(oppurtunity)}>Apply Now</button>
      )}
    </div>
  );
};
