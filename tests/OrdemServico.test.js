const OrdemServico = require("../src/OrdemServico");
const Computador = require("../src/Computador");
const Tecnico = require("../src/tecnico");
const { STATUS } = OrdemServico;

let pc, tec;
beforeEach(() => {
  pc = new Computador(1, "Dell", "XPS");
  tec = new Tecnico(1, "Carlos", "Hardware");
});

describe("OrdemServico", () => {
  test("cria ordem com status Aberta", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    expect(os.status).toBe(STATUS.ABERTA);
  });

  test("rejeita defeito vazio", () => {
    expect(() => new OrdemServico(1, pc, "")).toThrow("Descrição do defeito é obrigatória.");
  });

  test("fluxo completo: atribuir, iniciar e concluir", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    os.atribuirTecnico(tec);
    os.iniciar();
    expect(os.status).toBe(STATUS.EM_ANDAMENTO);
    os.concluir("Fonte trocada", 150);
    expect(os.status).toBe(STATUS.CONCLUIDA);
    expect(os.valor).toBe(150);
  });

  test("não inicia sem técnico", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    expect(() => os.iniciar()).toThrow("Atribua um técnico antes de iniciar.");
  });

  test("não conclui sem laudo ou com valor inválido", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    os.atribuirTecnico(tec);
    os.iniciar();
    expect(() => os.concluir("", 100)).toThrow("O laudo técnico é obrigatório.");
    expect(() => os.concluir("ok", -5)).toThrow("Valor inválido.");
  });

  test("cancela ordem e impede nova alteração", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    os.cancelar();
    expect(os.status).toBe(STATUS.CANCELADA);
    expect(() => os.cancelar()).toThrow("Ordem já finalizada.");
    expect(() => os.atualizarDefeito("outro")).toThrow();
  });

  test("atualiza defeito de ordem aberta", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    os.atualizarDefeito("Liga e desliga");
    expect(os.defeito).toBe("Liga e desliga");
  });

  test("não atribui técnico inativo", () => {
    const os = new OrdemServico(1, pc, "Não liga");
    tec.desativar();
    expect(() => os.atribuirTecnico(tec)).toThrow("Técnico inválido ou inativo.");
  });
});