import { render, screen, fireEvent } from "@testing-library/react";
import Search from "../src/Components/Search/Search";

describe("Componente Search", () => {
  it("avisa el termino que se esta buscando", () => {
    const espia = jasmine.createSpy("onSearch");

    render(<Search onSearch={espia} />);

    const input = screen.getByPlaceholderText("Buscar");
    fireEvent.change(input, { target: { value: "ps5" } });

    expect(espia).toHaveBeenCalledWith("ps5");
    expect(input.value).toBe("ps5");
  });
});
