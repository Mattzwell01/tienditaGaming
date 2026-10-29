import { useState, createContext, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoAnterior) => {
      const exiteProducto = carritoAnterior.findIndex(
        (articulo) => articulo.id === producto.id
      );
      if (exiteProducto >= 0) {
        const carritoActualizado = [...carritoAnterior];
        carritoActualizado[exiteProducto].cantidad += 1;
        return carritoActualizado;
      } else {
        return[...carritoAnterior, {...producto, cantidad: 1}]
      }
    })
  }

  const actualizarCantidad = (productoId, cantidad) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.map((producto) =>
        producto.id === productoId
      ? {...producto, cantidad: producto.cantidad + cantidad}
        : producto
      )
    )
  }

  const eliminarProducto = (productoId) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.filter((producto) =>
        producto.id !== productoId))
  }

  return (
    <CartContext.Provider value={{carrito, agregarAlCarrito, actualizarCantidad, eliminarProducto}}>
      {children}
    </CartContext.Provider>
  )
}
export const useCart = () => useContext(CartContext);
