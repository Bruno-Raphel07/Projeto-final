const Computador = require("../src/Computador");

describe("Computador", () => {
  test("cria computador válido", () => {
    const c = new Computador(1, "Dell", "XPS");
    expect(c.id).toBe(1);
    expect(c.marca).toBe("Dell");
  });

  test("rejeita ID inválido", () => {
    expect(() => new Computador(0, "Dell", "XPS")).toThrow("ID do computador inválido.");
  });

  test("rejeita marca e modelo vazios", () => {
    expect(() => new Computador(1, "", "XPS")).toThrow("Marca é obrigatória.");
    expect(() => new Computador(1, "Dell", " ")).toThrow("Modelo é obrigatório.");
  });
});