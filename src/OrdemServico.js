const STATUS = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

class OrdemServico {
  constructor(id, computador, defeito) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID da ordem inválido.");
    }
    if (!computador) {
      throw new Error("Computador é obrigatório.");
    }
    if (typeof defeito !== "string" || !defeito.trim()) {
      throw new Error("Descrição do defeito é obrigatória.");
    }
    this.id = id;
    this.computador = computador;
    this.defeito = defeito.trim();
    this.tecnico = null;
    this.status = STATUS.ABERTA;
    this.dataAbertura = new Date();
    this.dataConclusao = null;
    this.laudo = "";
    this.valor = 0;
  }

  estaFinalizada() {
    return this.status === STATUS.CONCLUIDA || this.status === STATUS.CANCELADA;
  }

  atribuirTecnico(tecnico) {
    if (this.estaFinalizada()) {
      throw new Error("Não é possível alterar uma ordem finalizada.");
    }
    if (!tecnico || !tecnico.ativo) {
      throw new Error("Técnico inválido ou inativo.");
    }
    this.tecnico = tecnico;
  }

  iniciar() {
    if (this.status !== STATUS.ABERTA) {
      throw new Error("Apenas ordens abertas podem ser iniciadas.");
    }
    if (!this.tecnico) {
      throw new Error("Atribua um técnico antes de iniciar.");
    }
    this.status = STATUS.EM_ANDAMENTO;
  }

  concluir(laudo, valor) {
    if (this.status !== STATUS.EM_ANDAMENTO) {
      throw new Error("Apenas ordens em andamento podem ser concluídas.");
    }
    if (typeof laudo !== "string" || !laudo.trim()) {
      throw new Error("O laudo técnico é obrigatório.");
    }
    if (typeof valor !== "number" || Number.isNaN(valor) || valor < 0) {
      throw new Error("Valor inválido.");
    }
    this.laudo = laudo.trim();
    this.valor = valor;
    this.dataConclusao = new Date();
    this.status = STATUS.CONCLUIDA;
  }

  cancelar() {
    if (this.estaFinalizada()) {
      throw new Error("Ordem já finalizada.");
    }
    this.status = STATUS.CANCELADA;
  }

  atualizarDefeito(novoDefeito) {
    if (this.estaFinalizada()) {
      throw new Error("Não é possível alterar uma ordem finalizada.");
    }
    if (typeof novoDefeito !== "string" || !novoDefeito.trim()) {
      throw new Error("Descrição do defeito é obrigatória.");
    }
    this.defeito = novoDefeito.trim();
  }
}

module.exports = OrdemServico;
module.exports.STATUS = STATUS;