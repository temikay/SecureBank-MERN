import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function Register() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });


    const [message, setMessage] = useState({
        type: "",
        text: ""
    });


    const [loading, setLoading] =
        useState(false);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({
            ...formData,
            [name]: value
        });

    };


    const validateForm = () => {

        const {
            name,
            email,
            password,
            confirmPassword
        } = formData;


        if (!name.trim()) {

            return "Full name is required.";

        }


        if (
            name.trim().length < 2 ||
            name.trim().length > 100
        ) {

            return "Name must be between 2 and 100 characters.";

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            return "Please enter a valid email address.";

        }


        if (
            password.length < 8 ||
            password.length > 128
        ) {

            return "Password must be between 8 and 128 characters.";

        }


        if (!/[A-Z]/.test(password)) {

            return "Password must contain an uppercase letter.";

        }


        if (!/[a-z]/.test(password)) {

            return "Password must contain a lowercase letter.";

        }


        if (!/[0-9]/.test(password)) {

            return "Password must contain a number.";

        }


        if (password !== confirmPassword) {

            return "Passwords do not match.";

        }


        return null;

    };


    const handleSubmit = async (event) => {

        event.preventDefault();


        setMessage({
            type: "",
            text: ""
        });


        const validationError =
            validateForm();


        if (validationError) {

            setMessage({
                type: "error",
                text: validationError
            });

            return;

        }


        setLoading(true);


        try {

            const response =
                await api.post(
                    "/auth/register",
                    {
                        name:
                            formData.name.trim(),

                        email:
                            formData.email
                                .trim()
                                .toLowerCase(),

                        password:
                            formData.password
                    }
                );


            if (response.data.success) {

                setMessage({
                    type: "success",
                    text:
                        `Account created successfully. Your account number is ${response.data.accountNumber}.`
                });


                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });


                setTimeout(() => {

                    navigate("/login");

                }, 3000);

            }

        }

        catch (error) {

            const serverMessage =
                error.response?.data?.message;


            setMessage({

                type: "error",

                text:
                    serverMessage ||
                    "Unable to create your account. Please try again."

            });

        }

        finally {

            setLoading(false);

        }

    };


    const password =
        formData.password;


    return (

        <main className="page-container">

            <div className="auth-card">

                <div className="auth-icon">
                    🛡️
                </div>


                <h1>
                    Create Secure Account
                </h1>


                <p>
                    Your account is protected by
                    multiple security controls.
                </p>


                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            autoComplete="name"
                            maxLength={100}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            maxLength={254}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            maxLength={128}
                        />


                        <div className="password-requirements">

                            <div>
                                {password.length >= 8
                                    ? "✓"
                                    : "○"}{" "}
                                At least 8 characters
                            </div>

                            <div>
                                {/[A-Z]/.test(password)
                                    ? "✓"
                                    : "○"}{" "}
                                One uppercase letter
                            </div>

                            <div>
                                {/[a-z]/.test(password)
                                    ? "✓"
                                    : "○"}{" "}
                                One lowercase letter
                            </div>

                            <div>
                                {/[0-9]/.test(password)
                                    ? "✓"
                                    : "○"}{" "}
                                One number
                            </div>

                        </div>

                    </div>


                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                        />

                    </div>


                    {message.text && (

                        <div
                            className={`form-message ${message.type}`}
                        >
                            {message.text}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Secure Account"}

                    </button>


                </form>


                <p className="auth-footer">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </main>

    );

}


export default Register;