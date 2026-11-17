import { NavLink, useNavigate } from "react-router-dom";
import BrandMark from "./BrandMark";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="public-navbar">
      <nav className="public-navbar__inner" aria-label="Main navigation">
        <button
          type="button"
          className="public-navbar__brand"
          onClick={() => navigate("/home")}
          aria-label="Shortly home"
        >
          <BrandMark />
        </button>
        <div className="public-navbar__links">
          <NavLink to="/restaurants" className="public-navbar__link">
            Restaurants
          </NavLink>
          <NavLink to="/cart" className="public-navbar__link">
            Cart
          </NavLink>
          <NavLink to="/profile" className="public-navbar__link">
            Profile
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
