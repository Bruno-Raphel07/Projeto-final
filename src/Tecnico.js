class Tecnico {
  constructor(id, nome, especialidade) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID do técnico inválido.");
    }
    this.id = id;
    this.ativo = true;
    this.atualizar({ nome, especialidade });
  }

  atualizar({ nome, especialidade }) {
    if (typeof nome !== "string" || !nome.trim()) {
      throw new Error("Nome do técnico é obrigatório.");
    }
    if (typeof especialidade !== "string" || !especialidade.trim()) {
      throw new Error("Especialidade é obrigatória.");
    }
    this.nome = nome.trim();
    this.especialidade = especialidade.trim();
  }

  desativar() {
    this.ativo = false;
  }
}

module.exports = Tecnico;