import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import DetalleProducto from "./Components/DetalleProducto/DetalleProducto";
import { CartProvider } from "./Components/CartContext/CartContext";
import Cart from "./Components/Cart/Cart";
import { useState } from "react";
import Search from "./Components/Search/Search";
import Admin from "./Components/Admin/Admin";
import Dashboard from "./Components/Admin/Dashboard";
import AdminProductos from "./Components/Admin/AdminProductos";
import AdminCostos from "./Components/Admin/AdminCostos";
import AdminPedidos from "./Components/Admin/AdminPedidos";

function App() {
  const [buscarTermino, setBuscarTermino] = useState(null);
  const handleBuscar = (termino) => {
    setBuscarTermino(termino.toLowerCase())
  }
  return (
    <>
      <CartProvider>
        <Router>
          <Navbar/>
            <Routes>
            <Route path="/" element={<Home buscarTermino={buscarTermino} />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/search" element={<Search onSearch={ handleBuscar} />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="costos" element={<AdminCostos />} />
              <Route path="pedidos" element={<AdminPedidos />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}
export default App;
