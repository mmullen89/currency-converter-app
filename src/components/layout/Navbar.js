import React from 'react';
import { Link } from "react-router-dom";
import '../../style/Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
        <Link className="navbar-brand" to="/">Currency Converter</Link>
    </nav>
  )
}

export default Navbar;
