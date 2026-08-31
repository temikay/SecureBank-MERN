import { Link } from "react-router-dom";


function Home() {

    return (

        <div className="app">

            <nav className="navbar">

                <div className="logo">
                    <span className="logo-icon">
                        🛡️
                    </span>

                    SecureBank
                </div>


                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="nav-button"
                    >
                        Create Account
                    </Link>

                </div>

            </nav>


            <main className="hero">

                <section className="hero-content">

                    <div className="security-badge">
                        🛡️ Security-First Banking
                    </div>


                    <h1>
                        Banking protected
                        <br />
                        by <span>security.</span>
                    </h1>


                    <p>
                        SecureBank is a demonstration
                        financial platform designed to
                        identify, prevent and respond to
                        common cybersecurity threats.
                    </p>


                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="primary-button"
                        >
                            Create Account
                        </Link>


                        <Link
                            to="/login"
                            className="secondary-button"
                        >
                            Login
                        </Link>

                    </div>

                </section>


                <section className="security-card">

                    <div className="card-header">

                        <div>

                            <span className="status-dot">
                            </span>

                            System Protected

                        </div>


                        <span>
                            LIVE
                        </span>

                    </div>


                    <div className="shield">
                        🛡️
                    </div>


                    <h2>
                        Threat Protection Active
                    </h2>


                    <p>
                        Multiple security controls
                        protect this application.
                    </p>


                    <div className="security-items">

                        <div>
                            <span>✓</span>
                            Secure Authentication
                        </div>


                        <div>
                            <span>✓</span>
                            Brute-Force Protection
                        </div>


                        <div>
                            <span>✓</span>
                            Input Validation
                        </div>


                        <div>
                            <span>✓</span>
                            Security Monitoring
                        </div>

                    </div>

                </section>

            </main>


            <section className="features">

                <div className="feature">

                    <div className="feature-icon">
                        🔐
                    </div>


                    <h3>
                        Secure Authentication
                    </h3>


                    <p>
                        Protected account access
                        using modern authentication
                        mechanisms.
                    </p>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        🚨
                    </div>


                    <h3>
                        Threat Detection
                    </h3>


                    <p>
                        Suspicious activity is
                        detected and recorded.
                    </p>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        🛡️
                    </div>


                    <h3>
                        Attack Mitigation
                    </h3>


                    <p>
                        Security controls actively
                        reduce common attack risks.
                    </p>

                </div>

            </section>

        </div>

    );

}


export default Home;