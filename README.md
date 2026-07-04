## ⚽ PERÚ FUTSAL x7

Script de HaxBall para un host de futsal 7v7 peruana con estadísticas, comandos de admin, rotación automática de equipos y más.

---

## 🎮 Características

✅ **Futsal 7v7** - Configuración optimizada para futsal  
✅ **Sistema de Estadísticas** - Tracking de goles y asistencias por jugador  
✅ **Comandos de Admin** - Kick, ban, unban, y más  
✅ **Rotación Automática de Equipos** - Equilibrio dinámico cada 3 minutos  
✅ **Límite de Jugadores** - Máximo 16 jugadores (14 jugadores + 2 espectadores)  
✅ **Mensajes Personalizados en Chat** - Bienvenidas y anuncios temáticos  
✅ **Ranking de Goleadores** - Visualización del top 10  

---

## 🚀 Instalación

### Requisitos
- Acceso a [HaxBall](https://www.haxball.com/creator) (cuenta gratuita)
- Copiar el contenido de `script.js`

### Pasos
1. Ve a [HaxBall Creator](https://www.haxball.com/creator)
2. Crea una nueva sala
3. Ve a "Scripting" → "Script del servidor"
4. Copia todo el contenido de `script.js` y pégalo
5. Haz clic en "Start room"

---

## 📋 Comandos Disponibles

### Comandos Generales
| Comando | Descripción |
|---------|-------------|
| `!ayuda` | Muestra todos los comandos disponibles |
| `!stats` | Ver tus estadísticas personales |
| `!ranking` | Ver el top 10 de goleadores |

### Comandos de Admin 🛡️
| Comando | Descripción | Uso |
|---------|-------------|-----|
| `!kick` | Expulsar a un jugador | `!kick [nombre]` |
| `!ban` | Banear a un jugador | `!ban [nombre]` |
| `!unban` | Desbanear a un jugador | `!unban [id]` |
| `!admin` | Dar/quitar derechos de admin | `!admin [nombre]` |
| `!reiniciar` | Reiniciar el juego | `!reiniciar` |
| `!clear` | Limpiar todos los bans | `!clear` |

**Nota:** El primer jugador en conectarse es admin automáticamente.

---

## ⚙️ Configuración

Edita el objeto `CONFIG` en `script.js`:

```javascript
const CONFIG = {
  ROOM_NAME: "⚽ PERÚ FUTSAL x7",      // Nombre de la sala
  ROOM_PASSWORD: "",                   // Contraseña (vacío = pública)
  MAX_PLAYERS: 16,                     // Máximo de jugadores
  TEAM_SIZE: 7,                        // Jugadores por equipo
  MAP: "Big",                          // Tipo de cancha
};
```

**Opciones de mapa:** `"Big"`, `"Medium"`, `"Small"`, `"Rounded"`, `"Hockey"`

---

## 📊 Sistema de Estadísticas

Cada jugador tiene:
- **Goles** - Se registran automáticamente con `!stats`
- **Asistencias** - Rastreadas por el sistema
- **Partidos jugados** - Contador de juegos

Ver ranking: `!ranking`

---

## 🔄 Rotación de Equipos

Los equipos se rotan automáticamente cada **3 minutos** para mantener equilibrio y mantener el juego dinámico.

Para modificar el intervalo, edita esta línea en el script:
```javascript
setInterval(function () { ... }, 180000); // 180000ms = 3 minutos
```

---

## 🛡️ Sistema de Bans

- **Banear:** `!ban [nombre]`
- **Desbanear:** `!unban [id]`
- **Listar bans:** Se guardan en la variable `playerBans`
- **Limpiar bans:** `!clear`

Los jugadores baneados no pueden reconectarse a la sala.

---

## 📝 Ejemplo de Uso

```
[Admin]: !kick Juan
[Sistema]: 🚪 Juan fue expulsado por [Admin]

[Player]: !stats
[Sistema]: 📊 Player | Goles: 5 | Asistencias: 2 | Partidos: 10

[Player]: !ranking
[Sistema]: 🏆 TOP 10 GOLEADORES:
1. CarlOS - 25 goles
2. Juan - 18 goles
...
```

---

## 🎨 Personalización

### Cambiar nombre del servidor
```javascript
ROOM_NAME: "Mi Sala Futsal x7",
```

### Cambiar colores de equipos
Edita la sección de `playerPhysics` en la función `getCustomStadium()`

### Agregar más comandos
Añade nuevas condiciones en `room.onPlayerChat`:
```javascript
if (command === "!tucomando") {
  // Tu código aquí
  return false; // Evita que se muestre el mensaje en chat
}
```

---

## 🐛 Solución de Problemas

**P: El script no funciona**
- A: Verifica que hayas copiado TODO el código en la sección de scripting

**P: Los comandos no funcionan**
- A: Asegúrate de escribir correctamente (ej: `!stats` no `!stat`)

**P: No soy admin**
- A: Solo el primer jugador en conectarse es admin automáticamente. Pídele que te haga admin con `!admin [tunombre]`

**P: ¿Cómo agrego más admins?**
- A: El primer admin usa `!admin [nombre]` para promover jugadores

---

## 📢 Soporte y Mejoras

¿Sugerencias o bugs? Abre un issue en este repositorio.

---

## 📜 Licencia

Este proyecto es de código abierto. ¡Siéntete libre de usarlo y modificarlo!

---

**¡Bienvenido a ⚽ PERÚ FUTSAL x7!** 🇵🇪⚽
