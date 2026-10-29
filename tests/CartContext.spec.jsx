import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../src/Components/CartContext/CartContext";

const PRODUCTO = {
  id: 7,
  nombre: "Teclado de prueba",
  precio: 10000,
  imagen: "",
};

function CarritoDePrueba() {
  const { carrito, agregarAlCarrito, eliminarProducto } = useCart();

  return (
    <div>
      <span data-testid="productos">{carrito.length}</span>
      <span data-testid="unidades">
        {carrito.reduce((acc, producto) => acc + producto.cantidad, 0)}
      </span>
      <button onClick={() => agregarAlCarrito(PRODUCTO)}>agregar</button>
      <button onClick={() => eliminarProducto(PRODUCTO.id)}>eliminar</button>
    </div>
  );
}

describe("Contexto del carrito", () => {
  it("agrega un producto al carrito", () => {
    render(
      <CartProvider>
        <CarritoDePrueba />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("agregar"));

    expect(screen.getByTestId("productos").textContent).toBe("1");
    expect(screen.getByTestId("unidades").textContent).toBe("1");
  });

  it("suma la cantidad cuando el producto ya estaba en el carrito", () => {
    render(
      <CartProvider>
        <CarritoDePrueba />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("agregar"));
    fireEvent.click(screen.getByText("agregar"));

    expect(screen.getByTestId("productos").textContent).toBe("1");
    expect(screen.getByTestId("unidades").textContent).toBe("2");
  });

  it("elimina un producto del carrito", () => {
    render(
      <CartProvider>
        <CarritoDePrueba />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("agregar"));
    fireEvent.click(screen.getByText("eliminar"));

    expect(screen.getByTestId("productos").textContent).toBe("0");
    expect(screen.getByTestId("unidades").textContent).toBe("0");
  });
});
