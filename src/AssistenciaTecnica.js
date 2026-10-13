const Computador = require("./Computador");
const Tecnico = require("./Tecnico");
const OrdemServico = require("./OrdemServico");
const { STATUS } = OrdemServico;

class AssistenciaTecnica {
  constructor() {
    this.computadores = [];
    this.tecnicos = [];
    this.ordens = [];
    this.proximoIdOrdem = 1;
  }

  // ---- Computadores ----
  cadastrarComputador(computador) {
    if (!(computador instanceof Computador)) {
      throw new Error("Objeto Computador inválido.");
    }
    if (this.computadores.some((c) => c.id === computador.id)) {
      throw new Error("Já existe um computador com este ID.");
    }
    this.computadores.push(computador);
    return computador;
  }

  buscarComputador(id) {
    const computador = this.computadores.find((c) => c.id === id);
    if (!computador) throw new Error("Computador não encontrado.");
    return computador;
  }

  // ---- Técnicos ----
  cadastrarTecnico(tecnico) {
    if (!(tecnico instanceof Tecnico)) {
      throw new Error("Objeto Tecnico inválido.");
    }
    if (this.tecnicos.some((t) => t.id === tecnico.id)) {
      throw new Error("Já existe um técnico com este ID.");
    }
    this.tecnicos.push(tecnico);
    return tecnico;
  }

  buscarTecnico(id) {
    const tecnico = this.tecnicos.find((t) => t.id === id);
    if (!tecnico) throw new Error("Técnico não encontrado.");
    return tecnico;
  }

  atualizarTecnico(id, dados) {
    const tecnico = this.buscarTecnico(id);
    tecnico.atualizar({
      nome: dados.nome ?? tecnico.nome,
      especialidade: dados.especialidade ?? tecnico.especialidade,
    });
    return tecnico;
  }

  removerTecnico(id) {
    const tecnico = this.buscarTecnico(id);
    const temOrdemAtiva = this.ordens.some(
      (o) => o.tecnico === tecnico && !o.estaFinalizada()
    );
    if (temOrdemAtiva) {
      throw new Error("Técnico possui ordens ativas e não pode ser removido.");
    }
    this.tecnicos = this.tecnicos.filter((t) => t.id !== id);
  }

  // ---- Ordens de serviço ----
  abrirOrdem(idComputador, defeito) {
    const computador = this.buscarComputador(idComputador);
    const ordem = new OrdemServico(this.proximoIdOrdem, computador, defeito);
    this.proximoIdOrdem++;
    this.ordens.push(ordem);
    return ordem;
  }

  buscarOrdem(id) {
    const ordem = this.ordens.find((o) => o.id === id);
    if (!ordem) throw new Error("Ordem de serviço não encontrada.");
    return ordem;
  }

  atribuirTecnico(idOrdem, idTecnico) {
    const ordem = this.buscarOrdem(idOrdem);
    ordem.atribuirTecnico(this.buscarTecnico(idTecnico));
    return ordem;
  }

  iniciarOrdem(idOrdem) {
    const ordem = this.buscarOrdem(idOrdem);
    ordem.iniciar();
    return ordem;
  }

  concluirOrdem(idOrdem, laudo, valor) {
    const ordem = this.buscarOrdem(idOrdem);
    ordem.concluir(laudo, valor);
    return ordem;
  }

  cancelarOrdem(idOrdem) {
    const ordem = this.buscarOrdem(idOrdem);
    ordem.cancelar();
    return ordem;
  }

  listarOrdens(status) {
    if (!status) return [...this.ordens];
    return this.ordens.filter((o) => o.status === status);
  }

  excluirOrdem(id) {
    const ordem = this.buscarOrdem(id);
    if (ordem.status === STATUS.EM_ANDAMENTO) {
      throw new Error("Não é possível excluir uma ordem em andamento.");
    }
    this.ordens = this.ordens.filter((o) => o.id !== id);
  }

  // ---- Relatório ----
  gerarRelatorio() {
    const porStatus = {};
    for (const s of Object.values(STATUS)) porStatus[s] = 0;

    const porTecnico = {};
    let faturamento = 0;

    for (const ordem of this.ordens) {
      porStatus[ordem.status]++;
      if (ordem.tecnico) {
        porTecnico[ordem.tecnico.nome] =
          (porTecnico[ordem.tecnico.nome] || 0) + 1;
      }
      if (ordem.status === STATUS.CONCLUIDA) faturamento += ordem.valor;
    }

    return {
      totalOrdens: this.ordens.length,
      porStatus,
      porTecnico,
      faturamento,
    };
  }
}

module.exports = AssistenciaTecnica;