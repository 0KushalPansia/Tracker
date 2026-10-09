import { Link } from "react-router-dom";

export default function MobileHeader() {
  return (
    <header className="mobile-header">
      <Link to="/dashboard" className="brand">
        <span className="brand-mark">T</span>
        <span>Tracker</span>
      </Link>
    </header>
  );
}
