import { Link } from "react-router-dom"

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">T</div>
        <h1>Welcome back</h1>
        <p>Log in to continue tracking your progress.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Email<input type="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" placeholder="Enter your password" required /></label>
          <button className="primary-button" type="submit">Log in</button>
        </form>
        <span className="auth-footer">Don't have an account? <Link to="/signup">Create one</Link></span>
      </div>
    </div>
  )
}
export default Login
