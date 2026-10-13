const Tecnico = require("../src/Tecnico");

describe("Tecnico", () => {
  test("cria técnico válido e ativo", () => {
    const t = new Tecnico(1, "Carlos", "Hardware");
    expect(t.nome).toBe("Carlos");
    expect(t.ativo).toBe(true);
  });

  test("rejeita nome vazio", () => {
    expect(() => new Tecnico(1, "", "Hardware")).toThrow("Nome do técnico é obrigatório.");
  });

  test("atualiza dados", () => {
    const t = new Tecnico(1, "Carlos", "Hardware");
    t.atualizar({ nome: "Carlos Silva", especialidade: "Redes" });
    expect(t.nome).toBe("Carlos Silva");
    expect(t.especialidade).toBe("Redes");
  });

  test("desativa técnico", () => {
    const t = new Tecnico(1, "Carlos", "Hardware");
    t.desativar();
    expect(t.ativo).toBe(false);
  });
});