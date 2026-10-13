const AssistenciaTecnica = require("../src/AssistenciaTecnica");
const Computador = require("../src/Computador");
const Tecnico = require("../src/Tecnico.js")

let sistema;
beforeEach(() => {
  sistema = new AssistenciaTecnica();
  sistema.cadastrarComputador(new Computador(101, "Dell", "XPS"));
  sistema.cadastrarTecnico(new Tecnico(1, "Carlos", "Hardware"));
});

describe("Cadastros", () => {
  test("não permite computador com ID duplicado", () => {
    expect(() =>
      sistema.cadastrarComputador(new Computador(101, "HP", "Pavilion"))
    ).toThrow("Já existe um computador com este ID.");
  });

  test("não permite técnico duplicado", () => {
    expect(() =>
      sistema.cadastrarTecnico(new Tecnico(1, "Outro", "Redes"))
    ).toThrow("Já existe um técnico com este ID.");
  });

  test("atualiza técnico", () => {
    sistema.atualizarTecnico(1, { nome: "Carlos Silva" });
    expect(sistema.buscarTecnico(1).nome).toBe("Carlos Silva");
  });

  test("remove técnico sem ordens ativas", () => {
    sistema.removerTecnico(1);
    expect(() => sistema.buscarTecnico(1)).toThrow("Técnico não encontrado.");
  });

  test("não remove técnico com ordem ativa", () => {
    const os = sistema.abrirOrdem(101, "Não liga");
    sistema.atribuirTecnico(os.id, 1);
    expect(() => sistema.removerTecnico(1)).toThrow();
  });
});

describe("Ordens de serviço", () => {
  test("abre ordem para computador existente", () => {
    const os = sistema.abrirOrdem(101, "Não liga");
    expect(os.id).toBe(1);
    expect(sistema.listarOrdens()).toHaveLength(1);
  });

  test("erro ao abrir ordem para computador inexistente", () => {
    expect(() => sistema.abrirOrdem(999, "Teste")).toThrow("Computador não encontrado.");
  });

  test("consulta ordens por status", () => {
    sistema.abrirOrdem(101, "A");
    const os2 = sistema.abrirOrdem(101, "B");
    sistema.cancelarOrdem(os2.id);
    expect(sistema.listarOrdens("Aberta")).toHaveLength(1);
    expect(sistema.listarOrdens("Cancelada")).toHaveLength(1);
  });

  test("exclui ordem", () => {
    const os = sistema.abrirOrdem(101, "Não liga");
    sistema.excluirOrdem(os.id);
    expect(() => sistema.buscarOrdem(os.id)).toThrow("Ordem de serviço não encontrada.");
  });

  test("não exclui ordem em andamento", () => {
    const os = sistema.abrirOrdem(101, "Não liga");
    sistema.atribuirTecnico(os.id, 1);
    sistema.iniciarOrdem(os.id);
    expect(() => sistema.excluirOrdem(os.id)).toThrow("Não é possível excluir uma ordem em andamento.");
  });
});

describe("Relatório", () => {
  test("calcula totais, faturamento e ordens por técnico", () => {
    const os1 = sistema.abrirOrdem(101, "A");
    sistema.abrirOrdem(101, "B");
    sistema.atribuirTecnico(os1.id, 1);
    sistema.iniciarOrdem(os1.id);
    sistema.concluirOrdem(os1.id, "Resolvido", 200);

    const r = sistema.gerarRelatorio();
    expect(r.totalOrdens).toBe(2);
    expect(r.porStatus["Concluída"]).toBe(1);
    expect(r.porStatus["Aberta"]).toBe(1);
    expect(r.faturamento).toBe(200);
    expect(r.porTecnico["Carlos"]).toBe(1);
  });
});