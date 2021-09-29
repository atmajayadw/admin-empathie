import React from "react";
import Logo from "../assets/icons/logo.png";

const Navbar = ({ user }) => {
  const showNavbar = () => {
    const span = document.querySelectorAll(".hamburger span");
    const sidebar = document.querySelector(".sidebar");

    sidebar.classList.toggle("active");
    span[0].classList.toggle("show1");
    span[1].classList.toggle("show2");
    span[2].classList.toggle("show3");
  };

  return (
    <>
      <section id="topbar">
        <div className="container topbar">
          <div className="logo">
            <div className="hamburger" onClick={() => showNavbar()}>
              <span className="line1"></span>
              <span className="line2"></span>
              <span className="line3"></span>
            </div>

            <img src={Logo} className="img-fluid img-logo" alt="" />
          </div>

          <div className="user">
            <h5>
              Hallo, <span>{user}</span>
            </h5>
          </div>
        </div>
      </section>

      <section id="sidebar">
        <div className="sidebar">
          <div className="logo">
            <img src={Logo} className="img-fluid img-logo" alt="" />
          </div>

          <div className="menu">
            <ul>
              <li>
                <a href="/dashboard" className="active">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Navbar;
