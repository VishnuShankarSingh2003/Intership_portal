import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './Login.css'; 

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill all the fields");
            return;
        }
        Axios.post("http://localhost:3000/auth/login", {
            email,
            password
        }).then(response => {
            if (response.data.status) {
                navigate("/");
            }
        }).catch(err => {
            setError("Error occurred, please try later");
        });
    }

    return (
        <div className="wrapper">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <div className="signup-link">
                        <p className="signup-text">Don't have an account?</p>
                        <button type="button" onClick={() => navigate("/signup")} className="signup-button">SignUp</button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

