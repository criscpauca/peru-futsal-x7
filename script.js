// ⚽ PERÚ FUTSAL x7 - HaxBall Host Script
// Futsal 7v7 con estadísticas, comandos admin, rotación de equipos y más

// ==================== CONFIGURACIÓN ====================
const CONFIG = {
  ROOM_NAME: "⚽ PERÚ FUTSAL x7",
  ROOM_PASSWORD: "", // Dejar vacío para sala pública
  MAX_PLAYERS: 16, // 14 jugadores (7v7) + 2 espectadores
  TEAM_SIZE: 7,
  MAP: "Big", // "Big", "Medium", "Small", "Rounded", "Hockey"
};

// ==================== VARIABLES GLOBALES ====================
let stats = {}; // Estadísticas de jugadores
let playerBans = []; // Lista de baneados
let adminPlayers = []; // Admins del servidor
let gameActive = false;

// ==================== INICIALIZACIÓN ====================

room.setDefaultStadium(CONFIG.MAP);
room.setScoreLimit(0);
room.setTimeLimit(0);

room.sendChat(`🟢 Servidor ⚽ PERÚ FUTSAL x7 iniciado correctamente!`);
room.sendChat(`📋 Escribe !ayuda para ver comandos disponibles.`);

// ==================== FUNCIONES PRINCIPALES ====================

// Evento: Jugador entra
room.onPlayerJoin = function (player) {
  // Verificar si está baneado
  if (playerBans.includes(player.id)) {
    room.kickPlayer(player.id, "🚫 Estás baneado de esta sala", false);
    return;
  }

  // Crear estadísticas si no existen
  if (!stats[player.id]) {
    stats[player.id] = {
      name: player.name,
      goals: 0,
      assists: 0,
      games: 0,
    };
  }

  // Primer jugador es admin
  if (adminPlayers.length === 0) {
    adminPlayers.push(player.id);
  }

  room.sendChat(
    `✅ ¡Bienvenido ${player.name} a ⚽ PERÚ FUTSAL x7! Escribe !ayuda para comandos.`
  );
  updateScoreboard();
};

// Evento: Jugador sale
room.onPlayerLeave = function (player) {
  updateScoreboard();
};

// Evento: Mensaje en chat
room.onPlayerChat = function (player, message) {
  const args = message.trim().split(" ");
  const command = args[0].toLowerCase();

  // ===== COMANDOS DE USUARIO =====
  if (command === "!ayuda") {
    showHelp(player);
    return false;
  }

  if (command === "!stats") {
    showStats(player);
    return false;
  }

  if (command === "!ranking") {
    showRanking();
    return false;
  }

  // ===== COMANDOS DE ADMIN =====
  if (isAdmin(player.id)) {
    if (command === "!kick") {
      if (args.length < 2) {
        room.sendChat("❌ Uso: !kick [nombre]");
        return false;
      }
      const targetName = args.slice(1).join(" ");
      handleKick(player, targetName);
      return false;
    }

    if (command === "!ban") {
      if (args.length < 2) {
        room.sendChat("❌ Uso: !ban [nombre]");
        return false;
      }
      const targetName = args.slice(1).join(" ");
      handleBan(player, targetName);
      return false;
    }

    if (command === "!unban") {
      if (args.length < 2) {
        room.sendChat("❌ Uso: !unban [id]");
        return false;
      }
      handleUnban(args[1]);
      return false;
    }

    if (command === "!admin") {
      if (args.length < 2) {
        room.sendChat("❌ Uso: !admin [nombre]");
        return false;
      }
      const targetName = args.slice(1).join(" ");
      handleAdminToggle(player, targetName);
      return false;
    }

    if (command === "!reiniciar") {
      room.stopGame();
      setTimeout(() => room.startGame(), 500);
      room.sendChat("🔄 Juego reiniciado!");
      return false;
    }

    if (command === "!clear") {
      playerBans = [];
      room.clearBans();
      room.sendChat("🗑️ Todos los bans fueron limpiados!");
      return false;
    }

    if (command === "!reset") {
      stats = {};
      room.sendChat("📊 Estadísticas reseteadas!");
      return false;
    }
  }

  return true;
};

// Evento: Gol anotado
room.onGoal = function (player) {
  if (player && stats[player.id]) {
    stats[player.id].goals++;
    room.sendChat(
      `⚽ ¡${player.name} METIÓ GOL! | Total: ${stats[player.id].goals} goles`
    );
  }
};

// ==================== FUNCIONES DE COMANDOS ====================

function showHelp(player) {
  room.sendChat("════════════════════════════════════════");
  room.sendChat("📋 COMANDOS DISPONIBLES - ⚽ PERÚ FUTSAL");
  room.sendChat("════════════════════════════════════════");
  room.sendChat("!stats     → Ver tus estadísticas");
  room.sendChat("!ranking   → Ver top 10 goleadores");
  room.sendChat("!ayuda     → Este mensaje");

  if (isAdmin(player.id)) {
    room.sendChat("════════════════════════════════════════");
    room.sendChat("🛡️ COMANDOS ADMIN");
    room.sendChat("════════════════════════════════════════");
    room.sendChat("!kick [nombre]      → Expulsar jugador");
    room.sendChat("!ban [nombre]       → Banear jugador");
    room.sendChat("!unban [id]         → Desbanear jugador");
    room.sendChat("!admin [nombre]     → Toggle admin");
    room.sendChat("!reiniciar          → Reiniciar juego");
    room.sendChat("!reset              → Resetear stats");
    room.sendChat("!clear              → Limpiar bans");
  }
}

function showStats(player) {
  if (!stats[player.id]) {
    stats[player.id] = { name: player.name, goals: 0, assists: 0, games: 0 };
  }
  const s = stats[player.id];
  room.sendChat(
    `📊 ${s.name} | ⚽ Goles: ${s.goals} | 🤝 Asistencias: ${s.assists} | 🎮 Partidos: ${s.games}`
  );
}

function showRanking() {
  const sorted = Object.values(stats)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  if (sorted.length === 0) {
    room.sendChat("📊 No hay datos aún");
    return;
  }

  room.sendChat("🏆════════════════════════════════════════");
  room.sendChat("🏆 TOP 10 GOLEADORES - ⚽ PERÚ FUTSAL");
  room.sendChat("🏆════════════════════════════════════════");
  sorted.forEach((s, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
    room.sendChat(`${medal} ${s.name} - ${s.goals} ⚽`);
  });
}

function handleKick(admin, targetName) {
  const targetId = findPlayerByName(targetName);
  if (targetId === null) {
    room.sendChat("❌ Jugador no encontrado");
    return;
  }
  room.kickPlayer(targetId, `Expulsado por ${admin.name}`, false);
  room.sendChat(`🚪 ${targetName} fue expulsado por ${admin.name}`);
}

function handleBan(admin, targetName) {
  const targetId = findPlayerByName(targetName);
  if (targetId === null) {
    room.sendChat("❌ Jugador no encontrado");
    return;
  }
  if (!playerBans.includes(targetId)) {
    playerBans.push(targetId);
  }
  room.kickPlayer(targetId, `Baneado por ${admin.name}`, true);
  room.sendChat(`🚫 ${targetName} fue BANEADO por ${admin.name}`);
}

function handleUnban(idStr) {
  const id = parseInt(idStr);
  playerBans = playerBans.filter((bid) => bid !== id);
  room.sendChat(`✅ Jugador ID ${id} fue desbaneado`);
}

function handleAdminToggle(admin, targetName) {
  const targetId = findPlayerByName(targetName);
  if (targetId === null) {
    room.sendChat("❌ Jugador no encontrado");
    return;
  }

  const isCurrentAdmin = adminPlayers.includes(targetId);
  if (!isCurrentAdmin) {
    adminPlayers.push(targetId);
    room.sendChat(`👑 ${targetName} ahora es ADMIN`);
  } else {
    adminPlayers = adminPlayers.filter((id) => id !== targetId);
    room.sendChat(`📉 ${targetName} ya no es admin`);
  }
}

// ==================== FUNCIONES DE UTILIDAD ====================

function isAdmin(playerId) {
  return adminPlayers.includes(playerId);
}

function findPlayerByName(name) {
  const players = room.getPlayer(null) || [];
  for (let p of players) {
    if (p.name.toLowerCase().includes(name.toLowerCase())) {
      return p.id;
    }
  }
  return null;
}

function updateScoreboard() {
  const players = room.getPlayer(null) || [];
  const redTeam = players.filter((p) => p.team === 1).length;
  const blueTeam = players.filter((p) => p.team === 2).length;
  const spectators = players.filter((p) => p.team === 0).length;
  
  room.setScoreBoard(
    `⚽ PERÚ FUTSAL x7 | 🔴 Rojos: ${redTeam} | 🔵 Azules: ${blueTeam} | 👁️ Espectadores: ${spectators}`
  );
}

// ==================== ROTACIÓN AUTOMÁTICA DE EQUIPOS ====================
setInterval(function () {
  const players = room.getPlayer(null) || [];
  if (players.length >= 4) {
    // Rotar aleatoriamente algunos jugadores cada 3 minutos
    const rotateCount = Math.floor(players.length * 0.2); // 20% de los jugadores
    for (let i = 0; i < rotateCount; i++) {
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      if (randomPlayer && randomPlayer.team !== 0) {
        const newTeam = randomPlayer.team === 1 ? 2 : 1;
        room.setPlayerTeam(randomPlayer.id, newTeam);
      }
    }
    room.sendChat("🔄 Rotación de equipos realizada para equilibrio");
  }
}, 180000); // Cada 3 minutos

// ==================== FIN DE INICIALIZACIÓN ====================
updateScoreboard();
