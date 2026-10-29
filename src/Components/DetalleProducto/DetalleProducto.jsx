import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetalleProducto.css";
import { consultarProductos } from "../Productos/consultaProductos";
import { useCart } from "../CartContext/CartContext";

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    consultarProductos()
      .then((datos) => {
        setProducto(datos.find((p) => p.id === Number(id)));
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [id]);

  const { agregarAlCarrito } = useCart();
  const handleAgregarCarrito = () => {
    if (producto) {
      agregarAlCarrito({
        id: producto.id,
        imagen: producto.imagen,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }
  }

  return (
    <div className="product-details">
      {
        producto ? (
          <>
            <img src={producto.imagen} alt={producto.nombre} className="image-small" />
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="product-infos">
              <h1>{producto.nombre}</h1>
              <p className="price">${producto.precio}</p>
              <p className="description">{producto.descripcion}</p>
              <button className="add-to-cart" onClick={handleAgregarCarrito}> Añadir al carrito</button>
            <p className="note"> pura calidad papá</p>
            </div>
          </>
        ) : (
          <p>{cargando ? "Cargando producto ..." : "Producto no disponible"}</p>
        )
      }
    </div>
  )
}
export default DetalleProducto
