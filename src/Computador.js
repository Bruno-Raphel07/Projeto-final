class Computador {
  constructor(id, marca, modelo) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID do computador inválido.");
    }
    if (typeof marca !== "string" || !marca.trim()) {
      throw new Error("Marca é obrigatória.");
    }
    if (typeof modelo !== "string" || !modelo.trim()) {
      throw new Error("Modelo é obrigatório.");
    }
    this.id = id;
    this.marca = marca.trim();
    this.modelo = modelo.trim();
  }
}

module.exports = Computador;