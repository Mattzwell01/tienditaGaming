import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../src/Components/CartContext/CartContext";
import Cart from "../src/Components/Cart/Cart";

function CarritoConProducto({ producto }) {
  const { agregarAlCarrito } = useCart();

  return (
    <div>
      <button onClick={() => agregarAlCarrito(producto)}>agregar al carrito</button>
      <Cart />
    </div>
  );
}

describe("Componente Cart", () => {
  it("muestra el mensaje cuando el carrito esta vacio", () => {
    render(
      <CartProvider>
        <Cart />
      </CartProvider>
    );

    expect(screen.getByText("Tu carrito esta vacio")).toBeTruthy();
  });

  it("calcula el subtotal, el envio y el total de la compra", () => {
    const producto = {
      id: 3,
      nombre: "Producto de prueba",
      precio: 20000,
      imagen: "",
      cantidad: 1,
    };

    render(
      <CartProvider>
        <CarritoConProducto producto={producto} />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("agregar al carrito"));

    expect(screen.queryByText("Tu carrito esta vacio")).toBeNull();
    expect(screen.getByText("Producto de prueba")).toBeTruthy();
    expect(screen.getAllByText("$20000.00").length).toBe(3);
    expect(screen.getByText("$10000.00")).toBeTruthy();
    expect(screen.getByText("$30000.00")).toBeTruthy();
  });
});
