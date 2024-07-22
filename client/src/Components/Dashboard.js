
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
    const [appliedOppurtunites, setAppliedOppurtunities] = useState([]);
    const [personalDetails, setPersonalDetails] = useState({
        name: '',
        age: '',
        dob: '',
        image: '',
        other: ''
    });
    const [isDetailsSaved, setIsDetailsSaved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/auth/verify").then((res) => {
            if (!res.data.status) {
                navigate("/login");
            } else {
                fetchAppliedOppurtunities();
                loadPersonalDetailsFromStorage();
            }
        });
    }, [navigate]);

    const fetchAppliedOppurtunities = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/applied-oppurtunities");
            setAppliedOppurtunities(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadPersonalDetailsFromStorage = () => {
        const savedDetails = localStorage.getItem('personalDetails');
        if (savedDetails) {
            setPersonalDetails(JSON.parse(savedDetails));
            setIsDetailsSaved(true); // Hide form if details are already saved
        } else {
            setIsDetailsSaved(false); // Show form if no details are saved
        }
    };

    const handleLogout = () => {
        // Clear personal details from local storage on logout
        localStorage.removeItem('personalDetails');
        axios.get("http://localhost:3000/auth/logout")
            .then((res) => {
                if (res.data.status) {
                    navigate("/login");
                }
            }).catch((err) => {
                console.log(err);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPersonalDetails(prevDetails => ({
                ...prevDetails,
                image: reader.result
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
        setIsDetailsSaved(true); // Hide form after saving details
        try {
            await axios.post("http://localhost:3000/auth/personal-details", personalDetails);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <h2 className="applied-opportunities-title">Applied Opportunities</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <div className="xyz">
                {appliedOppurtunites.map((opportunity, index) => (
                    <div className="opportunity-card" key={index}>
                        <h1 className="opportunity-title">{opportunity.profile_name}</h1>
                        <p className="opportunity-detail"><strong>Company: </strong> {opportunity.company_name}</p>
                        <p className="opportunity-detail"><strong>Stipend: </strong> {opportunity.stipend}</p>
                        <p className="opportunity-detail"><strong>Duration: </strong> {opportunity.duration}</p>
                    </div>
                ))}
            </div>
            <h2 className="personal-details-title">Personal Details</h2>
            {!isDetailsSaved && (
                <form className="personal-details-form" onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={personalDetails.name} onChange={handleInputChange} />
                    </label>
                    <label>
                        Age:
                        <input type="number" name="age" value={personalDetails.age} onChange={handleInputChange} />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" name="dob" value={personalDetails.dob} onChange={handleInputChange} />
                    </label>
                    <label>
                        Image:
                        <input type="file" name="image" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <label>
                        Other Details:
                        <textarea name="other" value={personalDetails.other} onChange={handleInputChange}></textarea>
                    </label>
                    <button type="submit">Save Details</button>
                </form>
            )}
            {isDetailsSaved && (
                <div className="personal-details-display">
                    <h3>Personal Information</h3>
                    <p><strong>Name:</strong> {personalDetails.name}</p>
                    <p><strong>Age:</strong> {personalDetails.age}</p>
                    <p><strong>Date of Birth:</strong> {personalDetails.dob}</p>
                    {personalDetails.image && <img src={personalDetails.image} alt="Profile" />}
                    <p><strong>Other Details:</strong> {personalDetails.other}</p>
                </div>
            )}
        </div>
    );
}
