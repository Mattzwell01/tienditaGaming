import { render, screen, waitFor } from "@testing-library/react";
import AdminProductos from "../src/Components/Admin/AdminProductos";

const PRODUCTOS_FAKE = [
  {
    id: 1,
    nombre: "Control de prueba",
    descripcion: "Control para el test",
    precio: 20000,
    costo: 12000,
    stock: 4,
    categoria: "periferico",
    imagen: "",
  },
  {
    id: 2,
    nombre: "Juego de prueba",
    descripcion: "Juego para el test",
    preco: 30000,
    precio: 30000,
    costo: 21000,
    stock: 9,
    categoria: "videojuego",
    imagen: "",
  },
];

describe("Panel de administracion de productos", () => {
  beforeEach(() => {
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(PRODUCTOS_FAKE),
      })
    );
  });

  it("carga los productos que vienen de la base de datos", async () => {
    render(<AdminProductos />);

    await waitFor(() => {
      expect(screen.getByText("Control de prueba")).toBeTruthy();
    });

    expect(window.fetch).toHaveBeenCalled();
    expect(screen.getByText("Juego de prueba")).toBeTruthy();
  });

  it("muestra cuantos productos hay en el listado", async () => {
    render(<AdminProductos />);

    await waitFor(() => {
      expect(screen.getByText("Listado de productos (2)")).toBeTruthy();
    });

    expect(screen.getByText("Nuevo producto")).toBeTruthy();
  });
});
