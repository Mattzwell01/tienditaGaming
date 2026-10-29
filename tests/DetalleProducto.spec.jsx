import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DetalleProducto from "../src/Components/DetalleProducto/DetalleProducto";
import { CartProvider } from "../src/Components/CartContext/CartContext";
import productos from "../src/Components/Productos/productos.json";

describe("Componente DetalleProducto", () => {
  beforeEach(() => {
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productos),
      })
    );
  });

  async function montar(ruta) {
    await act(async () => {
      render(
        <CartProvider>
          <MemoryRouter initialEntries={[ruta]}>
            <Routes>
              <Route path="/producto/:id" element={<DetalleProducto />} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      );
    });
  }

  it("muestra los datos del producto segun el id de la url", async () => {
    await montar("/producto/1");

    expect(screen.getByText("PlayStation 5 Slim")).toBeTruthy();
    expect(screen.getByText("$549990")).toBeTruthy();
  });

  it("muestra un aviso cuando el producto no existe", async () => {
    await montar("/producto/999");

    expect(screen.getByText("Producto no disponible")).toBeTruthy();
  });
});
