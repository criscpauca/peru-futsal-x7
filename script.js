// ⚽ PERÚ FUTSAL x7 - HaxBall Host Script
// Futsal 7v7 con estadísticas, comandos admin, rotación de equipos y más

// ==================== CONFIGURACIÓN ====================
const CONFIG = {
  ROOM_NAME: "⚽ PERÚ FUTSAL x7",
  ROOM_PASSWORD: "", // Dejar vacío para sala pública
  MAX_PLAYERS: 16, // 14 jugadores (7v7) + 2 espectadores
  TEAM_SIZE: 7,
  SCOREBOARD_WIDTH: 100,
  SCOREBOARD_HEIGHT: 100,
  MAP: "Big", // "Big", "Medium", "Small", "Rounded", "Hockey"
};

// ==================== VARIABLES GLOBALES ====================
let stats = {}; // Estadísticas de jugadores
let playerBans = []; // Lista de baneados
let playerKicks = []; // Registro de kicks
let adminPlayers = []; // Admins del servidor

// ==================== INICIALIZACIÓN ====================
room.setDefaultStadium(CONFIG.MAP);
room.setScoreLimit(0);
room.setTimeLimit(0);
room.setCustomStadium(getCustomStadium());

// ==================== FUNCIONES PRINCIPALES ====================

// Obtener estadio personalizado (futsal x7)
function getCustomStadium() {
  return `
{
 "name": "PERÚ FUTSAL x7",
 "width": 105,
 "height": 68,
 "spawnDistance": 300,
 "bg": { "type": "grass", "width": 105, "height": 68, "kickOffRadius": 20 },
 "vertexes": [
  { "x": -52.5, "y": -34, "trait": "ballArea" },
  { "x": 52.5, "y": -34, "trait": "ballArea" },
  { "x": 52.5, "y": 34, "trait": "ballArea" },
  { "x": -52.5, "y": 34, "trait": "ballArea" }
 ],
 "segments": [
  { "v0": 0, "v1": 1, "trait": "line" },
  { "v0": 1, "v1": 2, "trait": "line" },
  { "v0": 2, "v1": 3, "trait": "line" },
  { "v0": 3, "v1": 0, "trait": "line" }
 ],
 "goals": [
  { "p0": [-52.5, -17], "p1": [-52.5, 17], "trait": "goal" },
  { "p0": [52.5, -17], "p1": [52.5, 17], "trait": "goal" }
 ],
 "playerPhysics": { "bplayer": { "acceleration": 0.08, "kickpower": 7, "kickAccuracy": 0.04, "deceleration": 0.96, "velocityFactor": 0.96, "radius": 0.15 } },
 "ballPhysics": { "radius": 0.075, "carryingCoef": 0.015, "damping": 0.99, "downSpeedCoef": 0.99, "accelCoef": 0.11 }
}
  `;
}

// ==================== MANEJO DE JUGADORES ====================

room.onPlayerJoin = function (player) {
  if (playerBans.includes(player.id)) {
    room.kickPlayer(player.id, "Estás baneado de esta sala", false);
    return;
  }

  if (!stats[player.id]) {
    stats[player.id] = {
      name: player.name,
      goals: 0,
      assists: 0,
      games: 0,
      team: null,
    };
  }

  room.sendChat(
    `✅ Bienvenido ${player.name} a ⚽ PERÚ FUTSAL x7! Escribe !ayuda para ver comandos.`
  );
  updatePlayerCount();
};

room.onPlayerLeave = function (player) {
  updatePlayerCount();
};

room.onPlayerChat = function (player, message) {
  const args = message.split(" ");
  const command = args[0].toLowerCase();

  // Comandos de usuario
  if (command === "!ayuda") {
    showHelp(player);
    return false;
  }

  if (command === "!stats") {
    showStats(player);
    return false;
  }

  if (command === "!ranking") {
    showRanking(player);
    return false;
  }

  // Comandos de admin
  if (isAdmin(player)) {
    if (command === "!kick") {
      handleKick(player, args);
      return false;
    }

    if (command === "!ban") {
      handleBan(player, args);
      return false;
    }

    if (command === "!unban") {
      handleUnban(player, args);
      return false;
    }

    if (command === "!admin") {
      handleAdminCommand(player, args);
      return false;
    }

    if (command === "!reiniciar") {
      room.startGame();
      room.sendChat("🔄 Juego reiniciado!");
      return false;
    }

    if (command === "!clear") {
      room.clearBans();
      playerBans = [];
      room.sendChat("🗑️ Bans limpiados!");
      return false;
    }
  }

  return true;
};

// ==================== MANEJO DE GOLES ====================

room.onGoal = function (player) {
  if (player) {
    stats[player.id].goals++;
    room.sendChat(
      `⚽ ${player.name} metió gol! Total: ${stats[player.id].goals}`
    );
  }
};

// ==================== FUNCIONES DE COMANDOS ====================

function showHelp(player) {
  room.sendChat("=== 📋 COMANDOS DISPONIBLES ===");
  room.sendChat("!stats - Ver tus estadísticas");
  room.sendChat("!ranking - Ver ranking de goles");
  room.sendChat("!ayuda - Ver este mensaje");

  if (isAdmin(player)) {
    room.sendChat("--- 🛡️ COMANDOS ADMIN ---");
    room.sendChat("!kick [nombre] - Expulsar jugador");
    room.sendChat("!ban [nombre] - Banear jugador");
    room.sendChat("!unban [id] - Desbanear jugador");
    room.sendChat("!admin [nombre] - Hacer admin a jugador");
    room.sendChat("!reiniciar - Reiniciar juego");
    room.sendChat("!clear - Limpiar bans");
  }
}

function showStats(player) {
  const playerStats = stats[player.id];
  room.sendChat(
    `📊 ${playerStats.name} | Goles: ${playerStats.goals} | Asistencias: ${playerStats.assists} | Partidos: ${playerStats.games}`
  );
}

function showRanking(player) {
  const sorted = Object.values(stats)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  room.sendChat("🏆 TOP 10 GOLEADORES:");
  sorted.forEach((s, i) => {
    room.sendChat(`${i + 1}. ${s.name} - ${s.goals} goles`);
  });
}

function handleKick(player, args) {
  if (args.length < 2) {
    room.sendChat("❌ Uso: !kick [nombre]");
    return;
  }

  const targetName = args.slice(1).join(" ");
  const targetPlayer = room.getPlayer(findPlayerByName(targetName));

  if (!targetPlayer) {
    room.sendChat("❌ Jugador no encontrado");
    return;
  }

  room.kickPlayer(
    targetPlayer.id,
    `Expulsado por ${player.name}`,
    false
  );
  room.sendChat(`🚪 ${targetPlayer.name} fue expulsado por ${player.name}`);
}

function handleBan(player, args) {
  if (args.length < 2) {
    room.sendChat("❌ Uso: !ban [nombre]");
    return;
  }

  const targetName = args.slice(1).join(" ");
  const targetId = findPlayerByName(targetName);
  const targetPlayer = room.getPlayer(targetId);

  if (!targetPlayer) {
    room.sendChat("❌ Jugador no encontrado");
    return;
  }

  if (!playerBans.includes(targetId)) {
    playerBans.push(targetId);
  }

  room.kickPlayer(
    targetId,
    `Baneado por ${player.name}`,
    true
  );
  room.sendChat(`🚫 ${targetPlayer.name} fue baneado por ${player.name}`);
}

function handleUnban(player, args) {
  if (args.length < 2) {
    room.sendChat("❌ Uso: !unban [id]");
    return;
  }

  const targetId = parseInt(args[1]);
  playerBans = playerBans.filter((id) => id !== targetId);
  room.sendChat(`✅ Jugador ID ${targetId} fue desbaneado`);
}

function handleAdminCommand(player, args) {
  if (args.length < 2) {
    room.sendChat("❌ Uso: !admin [nombre]");
    return;
  }

  const targetName = args.slice(1).join(" ");
  const targetId = findPlayerByName(targetName);
  const targetPlayer = room.getPlayer(targetId);

  if (!targetPlayer) {
    room.sendChat("❌ Jugador no encontrado");
    return;
  }

  if (!adminPlayers.includes(targetId)) {
    adminPlayers.push(targetId);
    room.sendChat(`👑 ${targetPlayer.name} es ahora admin`);
  } else {
    adminPlayers = adminPlayers.filter((id) => id !== targetId);
    room.sendChat(`📉 ${targetPlayer.name} ya no es admin`);
  }
}

// ==================== FUNCIONES DE UTILIDAD ====================

function isAdmin(player) {
  // Primer jugador en conectar es admin por defecto
  const allPlayers = room.getPlayer(null);
  if (!allPlayers || allPlayers.length === 0) return false;

  return (
    adminPlayers.includes(player.id) || allPlayers[0].id === player.id
  );
}

function findPlayerByName(name) {
  const players = room.getPlayer(null);
  const found = players.find(
    (p) => p.name.toLowerCase().includes(name.toLowerCase())
  );
  return found ? found.id : null;
}

function updatePlayerCount() {
  const players = room.getPlayer(null);
  const redTeam = players.filter((p) => p.team === 1).length;
  const blueTeam = players.filter((p) => p.team === 2).length;
  room.setScoreBoard(`⚽ PERÚ FUTSAL x7 | Rojos: ${redTeam} | Azules: ${blueTeam}`);
}

// ==================== ROTACIÓN AUTOMÁTICA DE EQUIPOS ====================

// Rotar equipos cada 3 minutos (180 segundos)
setInterval(function () {
  const players = room.getPlayer(null);
  if (players.length >= 2) {
    // Cambiar aleatoriamente a algunos jugadores de equipo
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];

    if (randomPlayer && randomPlayer.team !== 0) {
      // Si está en equipo rojo, cambiar a azul, y viceversa
      const newTeam = randomPlayer.team === 1 ? 2 : 1;
      room.setPlayerTeam(randomPlayer.id, newTeam);
    }
  }
}, 180000);

// ==================== INICIAR ====================

room.setDefaultStadium(CONFIG.MAP);
room.sendChat(`🟢 Servidor ⚽ PERÚ FUTSAL x7 iniciado correctamente!`);
room.sendChat(`⚙️ Escribe !ayuda para ver comandos disponibles.`);
