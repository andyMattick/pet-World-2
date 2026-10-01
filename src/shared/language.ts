export type Language = 'en' | 'es';

const coreTranslations: Record<string, string> = {
  'Almost there': 'Ya casi', 'Sign in': 'Iniciar sesión', 'Create an account': 'Crear una cuenta',
  'Email': 'Correo electrónico', 'Password': 'Contraseña', 'Classes': 'Clases', 'No classes yet.': 'Aún no hay clases.',
  'Add class': 'Añadir clase', 'Sign out': 'Cerrar sesión', 'Dashboard': 'Panel', 'Roster': 'Lista', 'Settings': 'Configuración',
  'Class code': 'Código de clase', 'How students join': 'Cómo se unen los estudiantes', 'Class settings': 'Configuración de la clase',
  'Add students': 'Añadir estudiantes', 'Student': 'Estudiante', 'PIN': 'PIN',
  'New PIN': 'PIN nuevo', 'Reset': 'Restablecer', 'Remove': 'Eliminar', 'Print': 'Imprimir', 'Close': 'Cerrar', 'Cancel': 'Cancelar',
  'Save': 'Guardar', 'Copied!': '¡Copiado!', 'Select text': 'Seleccionar texto', 'Loading…': 'Cargando…',
  'No students yet.': 'Aún no hay estudiantes.', 'No students yet. Add your roster on the Roster tab.': 'Aún no hay estudiantes. Añade la lista en la pestaña Lista.',
  'New PINs': 'PIN nuevos', 'Print PIN cards': 'Imprimir tarjetas con PIN', 'Add and make PINs': 'Añadir y crear PIN',
  'Copy class list': 'Copiar lista de la clase', 'Print all PIN cards': 'Imprimir todas las tarjetas con PIN',
  'Station quizzes': 'Pruebas de estación', 'Unit tests': 'Pruebas de unidad', 'Quizzes and tests': 'Pruebas y exámenes',
  'Practice pop-ups': 'Prácticas emergentes', 'Enable practice pop-ups': 'Activar prácticas emergentes',
  'Missed answer': 'Respuesta incorrecta', 'Slow answer': 'Respuesta lenta', 'End of sprint': 'Fin de la carrera',
  'Arcade': 'Salón recreativo', 'Back to town': 'Volver al pueblo', 'Play free': 'Jugar gratis', 'Leave game': 'Salir del juego',
  'Free Play': 'Juego gratis', 'Today': 'Hoy', 'This week': 'Esta semana', 'Last 7 days': 'Últimos 7 días',
  'Mastered': 'Dominado', 'Practicing': 'Practicando', 'Struggling': 'Necesita práctica', 'Not started': 'Sin empezar',
  'Ideas': 'Razonamiento', 'Arithmetic': 'Aritmética', 'Problems': 'Problemas', 'Last active': 'Última actividad',
  'Last signed in': 'Último inicio de sesión', 'Top mix-up': 'Confusión más común', 'Status': 'Estado', 'Score': 'Puntuación',
  'Date': 'Fecha', 'Shop': 'Tienda', 'Station': 'Estación', 'Quiz': 'Prueba', 'Unit Test': 'Examen de unidad',
  'Passed': 'Aprobado', 'In review': 'En repaso', 'Review cleared': 'Repaso completado', 'Excused': 'Eximido',
  'Excuse quiz': 'Eximir de la prueba', 'Clear review': 'Completar repaso', 'Undo': 'Deshacer', 'History': 'Historial',
  'Overrides': 'Excepciones', 'Advanced': 'Avanzado', 'Mode': 'Modo', 'Use class settings': 'Usar configuración de la clase',
  'Reset everything': 'Restablecer todo', 'Reset town': 'Restablecer el pueblo', 'Reset everything also erases learning history.': 'Restablecer todo también borra el historial de aprendizaje.',
  'Welcome to Pet Town!': '¡Te damos la bienvenida a Pet Town!', 'Your first name': 'Tu nombre', 'Move in': 'Entrar al pueblo',
  'My grade': 'Mi grado', 'Close the café early': 'Cerrar la cafetería temprano',
  'Next customer': 'Siguiente cliente', 'Close up for the day': 'Cerrar por hoy', 'Keep going': 'Continuar',
  'Stop and go back': 'Detener y volver', 'Start the sprint': 'Empezar la carrera', 'Check': 'Comprobar',
  'Your answer': 'Tu respuesta', 'Answer': 'Respuesta', 'Correct!': '¡Correcto!', 'Try again.': 'Inténtalo de nuevo.',
  'Choose a pet': 'Elige una mascota', 'Choose your helper': 'Elige tu ayudante', 'Choose a decoration': 'Elige una decoración',
  'Pet Shop & Sticker Book': 'Tienda de mascotas y álbum de pegatinas', 'Town Hall': 'Ayuntamiento',
  'Sticker Book': 'Álbum de pegatinas', 'My Pet Room': 'Mi habitación', 'Music': 'Música', 'Music on': 'Música activada',
  'Volume': 'Volumen', 'Track': 'Pista', 'Unlock the café through': 'Desbloquear la cafetería hasta',
  'Enable Arcade games for this class': 'Activar los juegos del salón recreativo para esta clase',
  'Free Play: no 100-coin admission and no Arcade tickets': 'Juego gratis: sin entrada de 100 monedas ni boletos',
  'Students still need math practice to unlock Arcade minutes. Free Play disables Pet Town coin admission and ticket prizes.': 'Los estudiantes necesitan practicar matemáticas para desbloquear minutos de juego. El modo gratis no cobra monedas ni entrega boletos.',
  'Enable Arcade games': 'Activar juegos recreativos', 'Available games': 'Juegos disponibles',
  'Ticket rewards (paid-entry mode)': 'Premios en boletos (modo de pago)',
  'Delete class': 'Eliminar clase', 'Delete this class': 'Eliminar esta clase', 'Quizzes and tests for': 'Pruebas y exámenes de',
  'Copy join instructions': 'Copiar instrucciones para entrar',
  'One per line. First name and last initial works well (Maya M.). No emails needed.': 'Escribe un nombre por línea. Usa el nombre y la inicial del apellido (Maya M.). No se necesitan correos.',
  'Khan practice:': 'Práctica de Khan Academy:', 'Assign on Khan Academy': 'Asignar en Khan Academy',
  'Suggested small groups': 'Grupos pequeños sugeridos', 'In review after a quiz': 'En repaso después de una prueba',
  'Practice time this week': 'Tiempo de práctica esta semana', 'Skill grid': 'Tabla de habilidades',
  'Skills to reteach or assign': 'Habilidades para volver a enseñar o asignar', 'Most-triggered practice pop-ups': 'Prácticas emergentes más frecuentes',
  'Download CSV': 'Descargar CSV', 'No mix-ups spotted yet.': 'Aún no se han detectado confusiones.',
  'No students are in review after a quiz.': 'Ningún estudiante está repasando después de una prueba.',
  'No times-table trouble yet.': 'Aún no hay dificultades con las tablas de multiplicar.',
  'None spotted.': 'No se detectaron.', 'No drill history yet.': 'Aún no hay historial de prácticas.',
  'No drills need reteaching right now.': 'No hay prácticas que necesiten volver a enseñarse.',
  'not yet': 'todavía no', 'never': 'nunca', 'just now': 'ahora mismo',
  'not yet.': 'todavía no.', 'Click again: erases their progress': 'Haz clic otra vez: borrará su progreso',
  'Click again to erase all of': 'Haz clic otra vez para borrar todo el historial de',
  'Reset town clears the town but keeps learning history. Reset everything also erases learning history.': 'Restablecer el pueblo lo vacía, pero conserva el historial de aprendizaje. Restablecer todo también borra ese historial.'
};

const extendedTranslations: Record<string, string> = {
  'Pet Town for Teachers': 'Pet Town para docentes', 'Unit 1: Ratios. Step-level diagnostics, mix-ups, and times tables, live as your class plays.': 'Unidad 1: razones. Diagnóstico por pasos, confusiones y tablas de multiplicar mientras la clase juega.',
  'This build has no Supabase settings. Copy .env.example to .env, fill in your project URL and anon key, and rebuild. See the README.': 'Esta versión no tiene la configuración de Supabase. Copia .env.example a .env, agrega la URL del proyecto y la clave anónima, y vuelve a compilar. Consulta el README.',
  'Create an account': 'Crear una cuenta', 'No classes yet.': 'Aún no hay clases.', 'New class name, e.g. Period 3': 'Nombre de la clase, por ejemplo, Grupo 3',
  'Add your first class on the left to get a class code.': 'Añade tu primera clase a la izquierda para obtener un código de clase.',
  'Live. Updates as students finish problems, quizzes, and tests. Last updated': 'En vivo. Se actualiza cuando los estudiantes terminan problemas y pruebas. Última actualización',
  'New PINs': 'PIN nuevos', 'PINs are shown only now. Print the cards before leaving this page. You can reset a PIN any time.': 'Los PIN solo se muestran ahora. Imprime las tarjetas antes de salir de esta página. Puedes restablecer un PIN cuando quieras.',
  'Roster (': 'Lista (', 'Add and make PINs': 'Añadir y crear PIN', 'Print all PIN cards': 'Imprimir todas las tarjetas con PIN',
  'Show steps': 'Mostrar pasos', 'Answer only': 'Solo respuestas', 'Passing a station quiz opens the next station': 'Aprobar la prueba de una estación abre la siguiente',
  'Reset to defaults': 'Restablecer valores predeterminados', 'Quiz style': 'Estilo de prueba', 'Pass mark (%)': 'Porcentaje para aprobar (%)',
  'Problems per skill': 'Problemas por habilidad', 'Minimum quiz problems': 'Cantidad mínima de problemas de la prueba',
  'Maximum quiz problems': 'Cantidad máxima de problemas de la prueba', 'Perfect review problems per missed skill': 'Problemas correctos de repaso por habilidad fallada',
  'Enable music': 'Permitir música', 'Allow music': 'Permitir música', 'Enable Arcade games for this class': 'Activar juegos recreativos para esta clase',
  'Unlock the café through': 'Desbloquear la cafetería hasta', 'Home grade': 'Grado inicial',
  'Later stations still open on their own: after 6 orders at the one before, or after its quiz when quizzes open stations. Skipped stations are open right away. The unit test still needs every station quiz passed, or excused on a student\'s page.': 'Las estaciones siguientes se abren después de 6 pedidos en la estación anterior o al aprobar su prueba, si las pruebas desbloquean estaciones. Las estaciones omitidas se abren de inmediato. Para aprobar el examen de unidad, se deben aprobar todas las pruebas de estación o eximir al estudiante desde su página.',
  'Signing in on a new computer brings their town with them.': 'Al iniciar sesión en otra computadora, su pueblo estará disponible.',
  'Open the Arcade': 'Abrir el salón recreativo', 'Open Arcade': 'Abrir salón recreativo', 'Arcade admission costs': 'La entrada cuesta',
  'Do math to unlock play': 'Practica matemáticas para desbloquear tiempo de juego', 'Do math to unlock play time': 'Practica matemáticas para desbloquear tiempo de juego',
  'math time unlocked today': 'minutos de práctica de hoy', 'arcade time left': 'tiempo de juego restante', 'no coins or rewards': 'sin monedas ni premios',
  'Free Play is on: no Pet Town coins or Arcade tickets. Math practice still unlocks play time.': 'El modo de juego gratis está activado: no se usan monedas ni se ganan boletos. La práctica de matemáticas desbloquea tiempo de juego.',
  'Today\'s arcade time is used up.': 'Ya se usó todo el tiempo de juego de hoy.', 'Leave game': 'Salir del juego', 'min left': 'min restantes',
  'Choose a pet': 'Elige una mascota', 'Empty display slot': 'Espacio de exhibición vacío', 'Earn more in the café!': '¡Gana más en la cafetería!',
  'Add a decoration': 'Añadir una decoración', 'My helper': 'Mi ayudante', 'orders served': 'pedidos atendidos',
  'Sprint Track': 'Carrera relámpago', '60-second times tables': 'Tablas de multiplicar en 60 segundos', 'tips powered up ×': 'propinas potenciadas ×',
  'Closed by your teacher': 'Cerrado por tu docente', 'Opening soon': 'Próximamente', 'Pass the': 'Aprueba',
  'Choose your helper': 'Elige tu ayudante', 'Remove from display': 'Quitar de la exhibición', 'Choose a decoration': 'Elige una decoración',
  'My Pet Room': 'Mi habitación', 'Decorations': 'Decoraciones', 'All your decorations are in the room.': 'Todas tus decoraciones están en la habitación.',
  'In the room': 'En la habitación', 'No stickers placed yet.': 'Aún no has colocado pegatinas.', 'Dress-up': 'Disfraces',
  'Wear': 'Ponérselo', 'Claim': 'Reclamar', 'Keep my town safe': 'Protege mi pueblo', 'Make a backup code': 'Crear un código de respaldo',
  'Copy backup code': 'Copiar código de respaldo', 'Restore from a backup code': 'Restaurar desde un código de respaldo',
  'Restore my town': 'Restaurar mi pueblo', 'For grown-ups': 'Para adultos', 'Open the progress report': 'Abrir el informe de progreso',
  'Progress report:': 'Informe de progreso:', 'Ideas or arithmetic?': '¿Razonamiento o aritmética?', 'Counting and reading the picture:': 'Contar e interpretar el dibujo:',
  'Longest perfect streak:': 'Racha más larga de respuestas perfectas:', 'Mix-ups we\'ve spotted': 'Confusiones detectadas',
  'Khan Academy skills (Unit 1: Ratios)': 'Habilidades de Khan Academy (Unidad 1: razones)',
  'Mastered means at least 4 tries and 75% of the last 8 perfect.': 'Dominado significa al menos 4 intentos y 75% de respuestas perfectas en los últimos 8 problemas.',
  'Multiplying': 'Multiplicación', 'Dividing': 'División', 'Solid': 'Sólido', 'Getting there': 'Casi listo', 'Needs practice': 'Necesita práctica',
  'Not seen yet': 'Aún no visto', 'Reset all progress': 'Restablecer todo el progreso', 'Click again to erase everything': 'Haz clic otra vez para borrar todo',
  'Type your name first': 'Primero escribe tu nombre', 'Town restored!': '¡Pueblo restaurado!', 'Paste a backup code first': 'Primero pega un código de respaldo',
  'That doesn\'t look like a complete backup code.': 'Ese código de respaldo parece incompleto.', 'Decoration taken off display.': 'Se quitó la decoración de la exhibición.',
  'Decoration is on display!': '¡La decoración está en exhibición!', 'Your display case is full.': 'La vitrina está llena.',
  'Go to:': 'Ir a:', 'Class code:': 'Código de clase:', 'Password': 'Contraseña', 'Use a password with at least 8 characters.': 'Usa una contraseña de al menos 8 caracteres.',
  'Check your email to confirm your account, then sign in.': 'Revisa tu correo para confirmar la cuenta y luego inicia sesión.',
  'No students yet. Add your roster on the Roster tab.': 'Aún no hay estudiantes. Añade la lista desde la pestaña Lista.',
  'Loading…': 'Cargando…',
  'Student': 'Estudiante', 'Last 7 days': 'Últimos 7 días', 'Misses after': 'Errores posteriores', 'Pop-ups': 'Prácticas emergentes',
  'Khan skill': 'Habilidad de Khan Academy', 'Steps (right first try / tried)': 'Pasos (correctos al primer intento / intentos)',
  'Finding the multiplier (dividing)': 'Encontrar el multiplicador (división)', 'Times tables': 'Tablas de multiplicar',
  'Practice time': 'Tiempo de práctica', 'Recent sessions': 'Sesiones recientes', 'Started': 'Inicio', 'Active': 'Activo', 'Device': 'Dispositivo',
  'today': 'hoy', 'yesterday': 'ayer', 'in the last 7 days': 'en los últimos 7 días', 'last signed in': 'último inicio de sesión',
  'Active minutes per day, last 4 weeks': 'Minutos activos por día, últimas 4 semanas', 'No sessions yet.': 'Aún no hay sesiones.',
  'Students grouped by the mix-up the game spotted. Counts show how many times it happened.': 'Estudiantes agrupados por la confusión detectada. El número indica cuántas veces ocurrió.',
  'Numbers are problems tried.': 'Los números indican problemas intentados.', 'Last active': 'Última actividad', 'Last signed in': 'Último inicio de sesión',
  'Last active ': 'Última actividad ', 'perfect. About': 'perfectos. Aproximadamente', 'minutes played. Best sprint:': 'minutos jugados. Mejor carrera:',
  'Status': 'Estado', 'Missed skills': 'Habilidades falladas', 'No quizzes or tests yet.': 'Aún no hay pruebas ni exámenes.',
  'Review cleared': 'Repaso completado', 'In review': 'En repaso', 'Excused': 'Eximido', 'No trouble': 'Sin dificultades',
  'Extra time ×1.5': 'Tiempo adicional ×1.5', 'Extra time ×2': 'Tiempo adicional ×2', 'Pop-ups off': 'Prácticas emergentes desactivadas',
  'Custom override': 'Configuración personalizada', 'Use class settings': 'Usar configuración de la clase', 'Practice pop-ups for': 'Prácticas emergentes para',
  'Quizzes and tests for': 'Pruebas y exámenes de', 'Excuse quiz': 'Eximir de la prueba', 'Clear review': 'Completar repaso',
  'Undo': 'Deshacer', 'Reset town': 'Restablecer el pueblo', 'Reset everything': 'Restablecer todo', 'Cancel': 'Cancelar'
};

const moreTranslations: Record<string, string> = {
  'Copy join instructions': 'Copiar instrucciones para entrar', 'Class name': 'Nombre de la clase',
  'Open the café for everyone': 'Abrir la cafetería para todos', 'Allow music': 'Permitir música',
  'When it\'s off, background music never plays for this class. Students keep control of sound effects.': 'Si se desactiva, la música no sonará para esta clase. Los estudiantes podrán controlar los efectos de sonido.',
  'Unlock the': 'Desbloquear', 'through': 'hasta', 'Open the': 'Abrir', 'for everyone': 'para todos',
  'Otherwise each student opens it by passing the': 'De lo contrario, cada estudiante lo desbloquea al aprobar el examen de unidad de',
  'Corsair\'s Cove points per ticket': 'Puntos de Corsair\'s Cove por boleto',
  'Tickets per completed Whack-a-Mole round': 'Boletos por ronda completada de Whack-a-Mole',
  'Maximum Arcade tickets per student each day': 'Máximo de boletos recreativos por estudiante al día',
  'Bonus tickets for completing the Game of the Day': 'Boletos extra por completar el juego del día',
  'The bonus is deterministic, counts toward the daily ticket cap, and is disabled in Free Play.': 'El bono es fijo, cuenta para el límite diario de boletos y se desactiva en el modo de juego gratis.',
  'Removes the roster and all progress for this class.': 'Elimina la lista y todo el progreso de esta clase.',
  'Quiz style': 'Estilo de prueba', 'Pass mark (%)': 'Porcentaje para aprobar (%)', 'Minimum quiz problems': 'Cantidad mínima de problemas de la prueba',
  'Maximum quiz problems': 'Cantidad máxima de problemas de la prueba', 'Minimum test problems': 'Cantidad mínima de problemas del examen',
  'Maximum test problems': 'Cantidad máxima de problemas del examen', 'Problems per skill': 'Problemas por habilidad',
  'Perfect review problems per missed skill': 'Problemas correctos de repaso por habilidad fallada',
  'Enable practice pop-ups': 'Activar prácticas emergentes', 'Drill types': 'Tipos de práctica', 'Triggers': 'Activadores',
  'Slow timing': 'Tiempo para respuestas lentas', 'Idea seconds': 'Segundos para razonamiento', 'Arithmetic seconds': 'Segundos para aritmética',
  'Sprint seconds': 'Segundos para la carrera', 'Reading time before the tip timer starts': 'Tiempo de lectura antes de iniciar el temporizador',
  'Max pop-ups per shift': 'Máximo de prácticas emergentes por turno', 'Adaptive': 'Adaptable', 'Fixed': 'Fijo',
  'Add students': 'Añadir estudiantes', 'No students yet.': 'Aún no hay estudiantes.', 'Add and make PINs': 'Añadir y crear PIN',
  'Copy class list': 'Copiar lista de la clase', 'Print all PIN cards': 'Imprimir todas las tarjetas con PIN',
  'Name': 'Nombre', 'Locked': 'Bloqueado', 'locked': 'bloqueado', '(click New PIN to show)': '(haz clic en PIN nuevo para mostrarlo)',
  'New PIN': 'PIN nuevo', 'Reset everything also erases learning history.': 'Restablecer todo también borra el historial de aprendizaje.',
  'Cancel': 'Cancelar', 'Reset town': 'Restablecer el pueblo', 'Reset everything': 'Restablecer todo',
  'Suggested small groups': 'Grupos pequeños sugeridos', 'No mix-ups spotted yet.': 'Aún no se han detectado confusiones.',
  'In review after a quiz': 'En repaso después de una prueba', 'Practice time this week': 'Tiempo de práctica esta semana',
  'Pop-ups that aren\'t helping': 'Prácticas emergentes que no ayudan', 'No drills need reteaching right now.': 'Ninguna práctica necesita volver a enseñarse por ahora.',
  'Skill grid': 'Tabla de habilidades', 'Ideas': 'Razonamiento', 'Arithmetic': 'Aritmética', 'Top mix-up': 'Confusión más común',
  'Problems': 'Problemas', 'Last active': 'Última actividad', 'Last signed in': 'Último inicio de sesión', 'Today': 'Hoy', 'This week': 'Esta semana',
  'Mastered': 'Dominado', 'Practicing': 'Practicando', 'Struggling': 'Necesita práctica', 'Not started': 'Sin empezar',
  'Skills to reteach or assign': 'Habilidades para volver a enseñar o asignar', 'Nobody is struggling on a skill right now.': 'Nadie tiene dificultades con una habilidad ahora.',
  'Assign on Khan Academy': 'Asignar en Khan Academy', 'Most-triggered practice pop-ups': 'Prácticas emergentes más frecuentes',
  'No times-table trouble yet.': 'Aún no hay dificultades con las tablas de multiplicar.', 'Download CSV': 'Descargar CSV',
  'Print': 'Imprimir', 'Class code': 'Código de clase', 'Shop': 'Tienda', 'Station': 'Estación', 'Quiz': 'Prueba',
  'Unit Test': 'Examen de unidad', 'Status': 'Estado', 'Score': 'Puntuación', 'Date': 'Fecha', 'Student': 'Estudiante',
  'Missed skills': 'Habilidades falladas', 'History': 'Historial', 'Overrides': 'Excepciones', 'Advanced': 'Avanzado', 'Mode': 'Modo',
  'Use class settings': 'Usar configuración de la clase', 'Excuse quiz': 'Eximir de la prueba', 'Clear review': 'Completar repaso',
  'Review cleared': 'Repaso completado', 'In review': 'En repaso', 'Excused': 'Eximido', 'Undo': 'Deshacer',
  'Add a decoration': 'Añadir una decoración', 'Back to town': 'Volver al pueblo', 'Next customer': 'Siguiente cliente',
  'Close up for the day': 'Cerrar por hoy', 'Stop and go back': 'Detener y volver', 'Start the sprint': 'Empezar la carrera',
  'Make it my helper': 'Elegir como ayudante', 'Put it on display': 'Poner en exhibición', 'Go to the shop': 'Ir a la tienda',
  'Keep playing': 'Seguir jugando', 'Keep going': 'Continuar', 'Close the café early': 'Cerrar la cafetería temprano',
  'Power up your tips': 'Potencia tus propinas', 'Your first name': 'Tu nombre', 'Move in': 'Entrar al pueblo',
  'Choose a pet': 'Elige una mascota', 'Close': 'Cerrar', 'Choose a decoration': 'Elige una decoración', 'Remove from display': 'Quitar de la exhibición'
};

const studentScreenTranslations: Record<string, string> = {
  'Pet Town': 'Pet Town', 'Opening Pet Town…': 'Abriendo Pet Town…', 'tips': 'propinas', 'tips powered up': 'propinas potenciadas',
  'Customers served': 'Clientes atendidos', 'Speedy service earns a bigger tip': 'Atender rápido da una propina mayor',
  'No speed bonus, but take your time!': 'No hay bono por rapidez, ¡pero tómate tu tiempo!', 'Speed bonus running': 'Bono por rapidez activo',
  'Close the café early': 'Cerrar la cafetería temprano', 'Back to town': 'Volver al pueblo', 'Leave the game': 'Salir del juego',
  'Back to the order': 'Volver al pedido', 'Keep going': 'Continuar', 'Make it my helper': 'Elegir como ayudante',
  'Put it on display': 'Poner en exhibición', 'Go to the shop': 'Ir a la tienda', 'Keep playing': 'Seguir jugando',
  'The café is closed for the day': 'La cafetería cerró por hoy', 'Another shift': 'Otro turno', 'Perfect orders:': 'Pedidos perfectos:',
  'No mistakes today. Amazing!': '¡Hoy no hubo errores! ¡Increíble!', 'Keep practicing': 'Sigue practicando',
  'Open the progress report': 'Abrir el informe de progreso', 'Pet Town coins': 'Monedas de Pet Town',
  'Unlock every station and shop': 'Desbloquear todas las estaciones y tiendas', 'Progress reset': 'Progreso restablecido',
  'Station quiz passed': 'Prueba de estación aprobada', 'Unit Test passed': 'Examen de unidad aprobado',
  'Answer saved': 'Respuesta guardada', 'Your teacher has not opened the Arcade.': 'Tu docente no ha abierto el salón recreativo.',
  'Do math to unlock play time': 'Practica matemáticas para desbloquear tiempo de juego', 'Your teacher has not enabled any Arcade games.': 'Tu docente no ha activado juegos recreativos.',
  'Free Play is on: no Pet Town coins or Arcade tickets. Math practice still unlocks play time.': 'El juego gratis está activado: no se usan monedas ni se ganan boletos. La práctica de matemáticas desbloquea tiempo de juego.',
  'Coins': 'Monedas', 'seconds': 'segundos', 'orders': 'pedidos', 'customers': 'clientes',
  'Easy': 'Fácil', 'Medium': 'Medio', 'Hard': 'Difícil', 'Done': 'Listo', 'Yes!': '¡Sí!', 'Nice!': '¡Bien!', 'You got it!': '¡Lo lograste!',
  'Choose a pet': 'Elige una mascota', 'Close': 'Cerrar', 'Switch player': 'Cambiar de estudiante', 'Not you? Switch player': '¿No eres tú? Cambiar de estudiante',
  'Change name': 'Cambiar nombre', 'Restore my town': 'Restaurar mi pueblo', 'Make a backup code': 'Crear un código de respaldo',
  'Set complete!': '¡Colección completa!', 'New pet!': '¡Nueva mascota!', 'New decoration!': '¡Nueva decoración!'
};

const termTranslations: Record<string, string> = {
  'double number line': 'recta numérica doble', 'decimal points': 'puntos decimales', 'decimal point': 'punto decimal',
  'whole number': 'número entero', 'whole numbers': 'números enteros', 'simplest form': 'forma más simple',
  'ratio table': 'tabla de razones', 'ratio': 'razón', 'ratios': 'razones', 'recipe': 'receta', 'recipes': 'recetas',
  'batches': 'lotes', 'batch': 'lote', 'treats': 'golosinas', 'boxes': 'cajas', 'box': 'caja', 'parts': 'partes', 'part': 'parte',
  'jumps': 'saltos', 'jump': 'salto', 'cups': 'tazas', 'cup': 'taza', 'eggs': 'huevos', 'flour': 'harina', 'sugar': 'azúcar',
  'muffins': 'panecillos', 'muffin': 'panecillo', 'cookies': 'galletas', 'apples': 'manzanas', 'pears': 'peras', 'friends': 'amistades',
  'decimal places': 'posiciones decimales', 'digits': 'dígitos', 'digit': 'dígito', 'factor': 'factor', 'multiple': 'múltiplo',
  'factors': 'factores', 'multiples': 'múltiplos', 'table': 'tabla', 'line': 'recta', 'number': 'número', 'numbers': 'números',
  'divisor': 'divisor', 'multiplier': 'multiplicador', 'equation': 'ecuación', 'equations': 'ecuaciones', 'answer': 'respuesta',
  'nearest whole number': 'entero más cercano', 'whole platter': 'bandeja completa', 'platter': 'bandeja', 'equal': 'iguales',
  'smallest': 'más pequeño', 'largest': 'más grande', 'value': 'valor', 'groups': 'grupos', 'group': 'grupo',
  'first': 'primero', 'second': 'segundo', 'right': 'derecha', 'left': 'izquierda', 'under': 'debajo de',
  'row': 'fila', 'rows': 'filas', 'town': 'pueblo', 'minute': 'minuto', 'minutes': 'minutos',
  'stations': 'estaciones', 'station': 'estación', 'skills': 'habilidades', 'skill': 'habilidad',
  'cafe': 'cafetería', 'recipe card': 'tarjeta de receta', 'ones': 'unidades', 'tens': 'decenas',
  'hundreds': 'centenas', 'thousands': 'millares', 'tenths': 'décimas', 'hundredths': 'centésimas',
  'thousandths': 'milésimas', 'ten': 'decena', 'hundred': 'centena', 'thousand': 'millar',
  'add': 'sumar', 'subtract': 'restar', 'divide': 'dividir', 'multiply': 'multiplicar',
  'addition': 'suma', 'subtraction': 'resta', 'multiplication': 'multiplicación', 'division': 'división',
  'whole': 'todo', 'equal parts': 'partes iguales', 'equal groups': 'grupos iguales', 'what is left': 'lo que queda'
};

const translations = {...coreTranslations, ...extendedTranslations, ...moreTranslations, ...studentScreenTranslations};

const dynamicTranslations: [RegExp, (match: RegExpMatchArray) => string][] = [
  [/^Day (\d+)$/, match => `Día ${match[1]}`],
  [/^(\d+) orders served$/, match => `${match[1]} pedidos atendidos`],
  [/^(.+)'s Pet Town$/, match => `Pet Town de ${match[1]}`],
  [/^Your (.+)$/, match => `Tu ${match[1]}`],
  [/^Progress report: (.+)$/, match => `Informe de progreso: ${match[1]}`],
  [/^Quizzes and tests for (.+)$/, match => `Pruebas y exámenes de ${match[1]}`],
  [/^Practice pop-ups for (.+)$/, match => `Prácticas emergentes para ${match[1]}`],
  [/^No (.+) skills are built yet\.$/, match => `Aún no hay habilidades de ${match[1]} disponibles.`],
  [/^No students yet\. Add your roster on the Roster tab\.$/, () => 'Aún no hay estudiantes. Añade la lista desde la pestaña Lista.'],
  [/^Station (\d+): (.+)$/, match => `Estación ${match[1]}: ${match[2]}`],
  [/^Unlock the (.+) through$/, match => `Desbloquear ${match[1]} hasta`],
  [/^Open the (.+) for everyone$/, match => `Abrir ${match[1]} para todos`],
  [/^Otherwise each student opens it by passing the (.+) Unit Test\.$/, match => `De lo contrario, cada estudiante lo desbloquea al aprobar el examen de unidad de ${match[1]}.`],
  [/^Your teacher has unlocked station (\d+)\.$/, match => `Tu docente ha desbloqueado la estación ${match[1]}.`],
  [/^Your teacher has unlocked stations 1 to (\d+)\.$/, match => `Tu docente ha desbloqueado las estaciones 1 a ${match[1]}.`],
  [/^Click again to restore (.+) town$/, match => `Haz clic otra vez para restaurar el pueblo de ${match[1]}`],
  [/^(.+) was reset\.$/, match => `Se restableció el progreso de ${match[1]}.`],
  [/^(.+) earned!$/, match => `¡Ganaste ${match[1]}!`],
  [/^(.+) added to Dress-up!$/, match => `¡Se añadió ${match[1]} a los disfraces!`],
  [/^(.+) min left$/, match => `${match[1]} min restantes`],
  [/^(.+) stickers filled$/, match => `${match[1]} pegatinas completadas`],
  [/^(.+) of (.+) stickers$/, match => `${match[1]} de ${match[2]} pegatinas`],
  [/^Click again to delete (.+)$/, match => `Haz clic otra vez para eliminar ${match[1]}`],
  [/^Reset (.+)\?$/, match => `¿Restablecer el progreso de ${match[1]}?`],
  [/^Reset town clears the town but keeps learning history\. Reset everything also erases learning history\.$/, () => 'Restablecer el pueblo lo vacía, pero conserva el historial de aprendizaje. Restablecer todo también borra el historial de aprendizaje.'],
  [/^How many (.+) are there\?$/, match => `¿Qué cantidad de ${match[1]} hay?`],
  [/^How many (.+) in all\?$/, match => `¿Qué cantidad de ${match[1]} hay en total?`],
  [/^What number goes into both (.+) and (.+)\? Divide both by it\.$/, match => `¿Qué número divide a ${match[1]} y ${match[2]}? Divide ambos por ese número.`],
  [/^Which is (.+) in simplest form\?$/, match => `¿Cuál es ${match[1]} en su forma más simple?`],
  [/^Which ratio is equivalent to (.+)\?$/, match => `¿Qué razón es equivalente a ${match[1]}?`],
  [/^Which equation matches (.+)\?$/, match => `¿Qué ecuación corresponde a ${match[1]}?`],
  [/^Which equation finds (.+)\?$/, match => `¿Qué ecuación permite encontrar ${match[1]}?`],
  [/^Write (.+) as a fraction\.$/, match => `Escribe ${match[1]} como fracción.`],
  [/^What is the value of the (.+) in (.+)\?$/, match => `¿Cuál es el valor del dígito de las ${match[1]} en ${match[2]}?`],
  [/^What digit is in the (.+) place of (.+)\?$/, match => `¿Qué dígito está en las ${match[1]} de ${match[2]}?`],
  [/^Round (.+) to the nearest whole number\.$/, match => `Redondea ${match[1]} al número entero más cercano.`],
  [/^Round (.+) to the nearest (ten|hundred|thousand)\.$/, match => `Redondea ${match[1]} a la ${match[2] === 'ten' ? 'decena' : match[2] === 'hundred' ? 'centena' : 'unidad de millar'} más cercana.`],
  [/^(.+) = how many (.+)\?$/, match => `¿Cuántos ${match[2]} son ${match[1]}?`],
  [/^Row (\d+): how many (.+)\?$/, match => `Fila ${match[1]}: ¿cuántos ${match[2]}?`],
  [/^Fill in the box: how many (.+)\?$/, match => `Completa el espacio: ¿cuántos ${match[1]}?`],
  [/^How many jumps of (.+) does it take to reach (.+)\?$/, match => `¿Cuántos saltos de ${match[1]} se necesitan para llegar a ${match[2]}?`],
  [/^How many batches is that\?$/, () => '¿Cuántos lotes son?'],
  [/^Both amounts were multiplied by what number\?$/, () => '¿Por qué número se multiplicaron ambas cantidades?'],
  [/^Which one is set up correctly\?$/, () => '¿Cuál está planteado correctamente?'],
  [/^About how much will the answer be\? Round each number to the nearest whole number first\.$/, () => '¿Aproximadamente cuánto dará la respuesta? Primero redondea cada número al entero más cercano.'],
  [/^What is the rule\?$/, () => '¿Cuál es la regla?'],
  [/^Is (.+) prime or composite\?$/, match => `¿${match[1]} es primo o compuesto?`],
  [/^Which number is a factor of (.+)\?$/, match => `¿Qué número es factor de ${match[1]}?`],
  [/^Which number is a multiple of (.+)\?$/, match => `¿Qué número es múltiplo de ${match[1]}?`],
  [/^Which place is the (.+) in\?$/, match => `¿En qué posición está el dígito ${match[1]}?`],
  [/^What number do the blocks show\?$/, () => '¿Qué número muestran los bloques?'],
  [/^What number does the table show\?$/, () => '¿Qué número muestra la tabla?'],
  [/^What is the (largest|smallest) number\?$/, match => `¿Cuál es el número más ${match[1] === 'largest' ? 'grande' : 'pequeño'}?`],
  [/^Which number equals (.+)\?$/, match => `¿Qué número es igual a ${match[1]}?`],
  [/^Which words say (.+)\?$/, match => `¿Qué palabras representan ${match[1]}?`],
  [/^Write "(.+)" as a number\.$/, match => `Escribe "${match[1]}" como número.`],
  [/^Which operation answers the question\?$/, () => '¿Qué operación responde la pregunta?'],
  [/^Which one matches the story\?$/, () => '¿Cuál corresponde al problema?'],
  [/^Which equation matches the story\?$/, () => '¿Qué ecuación corresponde al problema?'],
  [/^Which story matches (.+)\?$/, match => `¿Qué problema corresponde a ${match[1]}?`],
  [/^How many boxes can we fill\?$/, () => '¿Cuántas cajas podemos llenar?'],
  [/^How many equal boxes are there in all\?$/, () => '¿Cuántas cajas iguales hay en total?'],
  [/^How many parts make up the whole platter\?$/, () => '¿Cuántas partes forman toda la bandeja?'],
  [/^What is the whole, and what is the part\?$/, () => '¿Cuál es el todo y cuál es la parte?'],
  [/^Write the ratio of (.+) to (.+)\.$/, match => `Escribe la razón de ${match[1]} a ${match[2]}.`],
  [/^Fill in the next (.+) number \((\d+) jumps\)\.$/, match => `Completa el siguiente número de ${match[1]} (${match[2]} saltos).`],
  [/^Fill in the (.+) number under (.+)\.$/, match => `Completa el número de ${match[1]} debajo de ${match[2]}.`],
  [/^Move the decimal point so (.+) becomes a whole number\.$/, match => `Mueve el punto decimal para que ${match[1]} sea un número entero.`],
  [/^How many digits are after the decimal points in (.+) altogether\?$/, match => `¿Cuántos dígitos hay en total después de los puntos decimales de ${match[1]}?`],
  [/^What do we do to both sides\?$/, () => '¿Qué hacemos en ambos lados?'],
  [/^What is the missing part\?$/, () => '¿Qué parte falta?'],
  [/^How many wholes in (.+)\?$/, match => `¿Cuántas unidades enteras hay en ${match[1]}?`],
  [/^What number goes into both (.+) and (.+)\?$/, match => `¿Qué número divide a ${match[1]} y ${match[2]}?`],
  [/^Which sentence is true\?$/, () => '¿Qué afirmación es verdadera?'],
  [/^Which number is (.+)\?$/, match => `¿Qué número es ${match[1]}?`],
  [/^How much is each box worth\?$/, () => '¿Cuánto vale cada caja?'],
  [/^How much is each part\?$/, () => '¿Cuánto vale cada parte?'],
  [/^Find a number that makes (.+) true\.$/, match => `Encuentra un número que haga verdadera la expresión ${match[1]}.`],
  [/^What is added each time\?$/, () => '¿Qué se suma cada vez?'],
  [/^What is the next number\?$/, () => '¿Cuál es el siguiente número?'],
  [/^Which shape is number (.+)\?$/, match => `¿Qué figura ocupa la posición ${match[1]}?`],
  [/^How many shapes are in the part that repeats\?$/, () => '¿Cuántas figuras hay en la parte que se repite?'],
  [/^What do you notice about the numbers\?$/, () => '¿Qué observas en los números?'],
  [/^Which equation matches the order\?$/, () => '¿Qué ecuación corresponde al pedido?'],
  [/^Pick the operation$/, () => 'Elige la operación'],
  [/^The answer is (.+)\.$/, match => `La respuesta es ${match[1]}.`],
  [/^How many (.+)\?$/, match => `¿Qué cantidad de ${match[1]}?`]
];

function translateTerms(value: string) {
  return Object.entries(termTranslations).sort((a, b) => b[0].length - a[0].length).reduce((text, [source, translated]) =>
    text.replace(new RegExp(`\\b${source}\\b`, 'gi'), translated), value);
}

export function translateText(source: string) {
  const trimmed = source.trim(), exact = translations[trimmed];
  if (exact) return source.replace(trimmed, exact);
  const match = dynamicTranslations.find(([pattern]) => pattern.test(trimmed));
  if (!match) return source;
  const captures = trimmed.match(match[0]);
  if (!captures) return source;
  return source.replace(trimmed, translateTerms(match[1](captures)));
}

interface OriginalText { source: string; rendered: string }

export function installLanguage(root: ParentNode, getLanguage: () => Language) {
  const textSources = new WeakMap<Text, OriginalText>();
  const attrSources = new WeakMap<Element, Map<string, OriginalText>>();
  const attrs = ['title', 'placeholder', 'aria-label'];

  const renderText = (node: Text) => {
    const current = node.data;
    let record = textSources.get(node);
    if (!record || current !== record.rendered) record = { source: current, rendered: current };
    const language = getLanguage();
    const value = language === 'es' ? translateText(record.source) : record.source;
    if (node.data !== value) node.data = value;
    textSources.set(node, { source: record.source, rendered: value });
  };
  const renderElement = (element: Element) => {
    for (const attr of attrs) {
      if (!element.hasAttribute(attr)) continue;
      const current = element.getAttribute(attr) || '';
      let byName = attrSources.get(element);
      if (!byName) { byName = new Map(); attrSources.set(element, byName); }
      let record = byName.get(attr);
      if (!record || current !== record.rendered) record = { source: current, rendered: current };
      const value = getLanguage() === 'es' ? translateText(record.source) : record.source;
      if (current !== value) element.setAttribute(attr, value);
      byName.set(attr, { source: record.source, rendered: value });
    }
  };
  const renderNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) renderText(node as Text);
    else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      renderElement(element);
      if (!['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) renderText(walker.currentNode as Text);
        element.querySelectorAll('*').forEach(renderElement);
      }
    }
  };
  const render = () => {
    document.documentElement.lang = getLanguage() === 'es' ? 'es' : 'en';
    renderNode(root as Node);
  };
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') renderText(record.target as Text);
      record.addedNodes.forEach(renderNode);
      if (record.type === 'attributes') renderElement(record.target as Element);
    }
  });
  observer.observe(root, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:attrs});
  render();
  return render;
}

export function languageButtons(language: Language) {
  return `<button type="button" data-language="en" aria-pressed="${language === 'en'}">English</button><button type="button" data-language="es" aria-pressed="${language === 'es'}">Español</button>`;
}