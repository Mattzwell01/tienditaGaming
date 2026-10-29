import { Link } from "react-router-dom";
import "./Navbar.css"
import { useCart } from "../CartContext/CartContext";
const Navbar = () => {
  const { carrito } = useCart();
  const totalProductos = carrito.reduce((acc, producto) =>
    acc+producto.cantidad, 0)

  return (
    <section className="header">
      <h1 className="logo">
        Tiendita<span>Gaming</span>
      </h1>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to = "/">Home</Link>
          </li>
          <li>
            <Link to = "/admin">Admin</Link>
          </li>
        </ul>
      </nav>
      <div className="icons">
        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
        <Link to="/carrito" className="icon-button">
          <i className="fas fa-shopping-cart "></i>
          <span className="counter">{totalProductos}</span>
        </Link>
      </div>
    </section>
  )
}

export default Navbar
