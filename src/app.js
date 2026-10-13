const AssistenciaTecnica = require("./AssistenciaTecnica");
const Computador = require("./Computador");
const Tecnico = require("./Tecnico");

const sistema = new AssistenciaTecnica();

// Dados simulados
const computadores = [
  new Computador(101, "Dell", "Inspiron 15"),
  new Computador(102, "Lenovo", "ThinkPad E14"),
  new Computador(103, "Acer", "Aspire 5"),
];
const tecnicos = [
  new Tecnico(1, "Carlos Silva", "Hardware"),
  new Tecnico(2, "Ana Souza", "Software"),
];

for (const c of computadores) sistema.cadastrarComputador(c);
for (const t of tecnicos) sistema.cadastrarTecnico(t);

console.log("=== TechFix: Assistência Técnica ===\n");

try {
  const os1 = sistema.abrirOrdem(101, "Não liga");
  const os2 = sistema.abrirOrdem(102, "Sistema operacional travando");
  sistema.abrirOrdem(103, "Tela quebrada");

  sistema.atribuirTecnico(os1.id, 1);
  sistema.iniciarOrdem(os1.id);
  sistema.concluirOrdem(os1.id, "Fonte substituída", 180);

  sistema.atribuirTecnico(os2.id, 2);
  sistema.iniciarOrdem(os2.id);

  // Erro proposital para demonstrar o tratamento
  sistema.abrirOrdem(999, "Computador inexistente");
} catch (erro) {
  console.log("Erro tratado:", erro.message, "\n");
}

console.log("--- Ordens abertas ---");
for (const o of sistema.listarOrdens("Aberta")) {
  console.log(`OS #${o.id} | PC ${o.computador.id} (${o.computador.marca}) | ${o.defeito}`);
}

console.log("\n--- Relatório ---");
console.log(sistema.gerarRelatorio());