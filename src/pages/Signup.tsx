import { Link } from "react-router-dom"

function Signup() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">T</div>
        <h1>Create your account</h1>
        <p>Start building better habits today.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Name<input type="text" placeholder="Your name" required /></label>
          <label>Email<input type="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" placeholder="At least 8 characters" minLength={8} required /></label>
          <button className="primary-button" type="submit">Create account</button>
        </form>
        <span className="auth-footer">Already have an account? <Link to="/login">Log in</Link></span>
      </div>
    </div>
  )
}
export default Signup
