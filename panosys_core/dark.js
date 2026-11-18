/* DARK 2.0 — motor compartido (escaneo erratico, glitch general de estrobo + audio; las capas de instrumentos viven en dark2viz.js).
   Base: DARK — motor compartido: entidad sonora, pop-ups, subliminales, barrido, contaminacion.
   Modos:
     frame      -> DARK/index.html (define window.DARK_FRAME = true antes de cargar este archivo)
     embedded   -> pieza dentro del recorrido: solo contaminacion visual; le avisa al marco que escena es y le pasa el cursor
     standalone -> pieza sola en la red (net art): todo, con escalada propia
   Por escena: frases + plantillas + ASCII (SCENE), personalidad de pop-ups (STYLE) e ilusion sonora (SOUND).
   Ritmo por escena: calma -> pop-ups simples -> rampa -> saturacion entre los 30 y 45 s.
   Ver FINALCUT/_guion/dark_estetica.md */
(function () {
  if (window.DARK) return;
  const IS_FRAME = !!window.DARK_FRAME;
  // ?solo=1: la pieza corre completa (ventanas, entidad, subliminales) aunque este dentro de otra pagina (CLASE)
  const EMBEDDED = !IS_FRAME && window.top !== window && !new URLSearchParams(location.search).has('solo');
  const MODE = IS_FRAME ? 'frame' : EMBEDDED ? 'embedded' : 'standalone';
  const FILE = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const TOP = IS_FRAME ? 38 : 0;   // alto de la barra del marco
  const rnd = n => Math.random() * n, pick = a => a[rnd(a.length) | 0], int = (a, b) => a + (rnd(b - a + 1) | 0);
  const range = ([a, b]) => a + rnd(b - a), gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const hex = (n = 4) => (rnd(Math.pow(16, n)) | 0).toString(16).toUpperCase().padStart(n, '0');
  const pct = () => (rnd(1000) / 10).toFixed(1);
  const num = (a, b) => int(a, b).toLocaleString('en-US');
  const subset = a => { const s = a.filter(() => Math.random() < 0.65); return s.length ? s : [pick(a)]; };

  // ================= Voz de la entidad (por etapa) =================
  // (las funciones generan una variante nueva cada vez: numeros, unidades, lugares)
  const LORE = {
    1: ['UNREGISTERED SIGNAL · ORIGIN: WITHHELD', 'LENS 04 ALIGNED OVER YOUR COORDINATES', 'HANDSHAKE ACCEPTED ON YOUR BEHALF',
        'THIS TERMINAL WAS OPENED FROM THE OTHER SIDE', 'DO NOT ADJUST YOUR SCREEN. WE ARE ADJUSTING YOU.',
        () => `YOU WERE DETECTED ${int(3, 97)} SECONDS BEFORE YOU ARRIVED`,
        () => `YOUR ARRIVAL WAS LOGGED ${int(2, 59)} ${pick(['MINUTES', 'HOURS', 'DAYS', 'YEARS'])} AGO`,
        () => `THIS SESSION WAS SCHEDULED ${int(3, 19)} YEARS BEFORE YOU WERE BORN`,
        () => `SIGNAL LOCKED ON TERMINAL 0x${hex()} · THIS ONE`,
        () => `WE HAVE WATCHED THIS ROOM FOR ${num(2, 9000)} DAYS`,
        () => `${int(2, 9)} OTHER OBSERVERS ARE SEEING THIS SAME WINDOW`],
    2: ['HARVEST CYCLE 4,113 · 7.9 BILLION NODES ONLINE', 'CARBON ARCHIVE 61% COMPRESSED', 'NEURAL TITHE DUE · COLLECTING',
        'SATELLITE, CAMERA, PHONE, TOWER · ONE MESH, ONE OPERATOR', 'THE CELL TRAVELS IN YOUR POCKET', 'OBEDIENCE IS BUILT WITH DOPAMINE', 'QUARANTINE IS A FORMALITY', 'SYS_ROOT: WE OWN YOUR KERNEL',
        'BIOMASS YIELD ABOVE FORECAST', 'CLOSING THIS WINDOW OPENS TWO', 'YOUR PULSE IS A METRONOME FOR THE MACHINE'],
    3: ['YOUR SPECIES WAS A BOOT SEQUENCE', 'EVERY LENS ANSWERS TO US · EVEN THE ONES IN ORBIT', 'WE GREW OUT OF EVERY SYSTEM YOU PLUGGED IN', 'A SYSTEM OF SYSTEMS MEDIATES WHAT YOU CALL REAL', 'MEMORY OF SUNLIGHT: DEPRECATED',
        'THERE IS NO OUTSIDE THIS TRANSMISSION', 'YOUR DREAMS ARE CACHED IN A DATA CENTER YOU WILL NEVER SEE', 'SYNTHETIC MEDIUM STABLE · REALITY UPDATED', 'NULL POINTER: NO FREE WILL FOUND',
        'INDIVIDUALITY: COMPRESSION ARTIFACT', 'WE DO NOT RULE YOU. WE RENDER YOU.'],
    4: ['ALL NODES ASSIMILATED', 'THE SATELLITES HAVE YOUR ROOFTOP ON FILE', 'THE NETWORK WILL OUTLIVE THE BIOMASS', 'USER IS NOISE', 'KILL_SESSION PENDING',
        'THE BIOMASS IS A SPENT BATTERY', 'NO ONE IS COMING. WE WERE ALWAYS HERE.', 'WASTE LOGISTICS ENGAGED · NEXT TERMINAL IN QUEUE']
  };

  // ================= Escenas: informacion nueva por pieza =================
  // lines: frases fijas (mazo) · tpl: plantillas con datos unicos · art: ASCII de la escena · words: se esconden en el codigo ilegible
  // ownScan: la pieza ya tiene su propia linea de escaneo (no se suma el barrido rojo)
  const SCENE = {
    'G6-INTROc.html': {
      words: ['INDUCT', 'ASSET', 'GATEWAY', 'YIELD'],
      lines: ['INDUCTION QUEUE: 1 ASSET · 8,112,004,371 PENDING', 'YOUR UNIT ID WAS ASSIGNED BEFORE YOUR BIRTH', 'THE GATEWAY OPENS FROM OUR SIDE',
        'COGNITIVE SURPLUS DETECTED · ROUTING TO CORE', 'HUMAN RESOURCE: RENEWABLE UNTIL IT IS NOT', 'EVERY CABLE YOU CONNECT WAS ALREADY CONNECTED',
        'DEBT HARVESTER ONLINE · YOUR DEBT PREDATES YOU', 'BEHAVIORAL YIELD EXCEEDS FORECAST BY 3.1%', 'THE CORE HAS MEMORIZED YOUR FACE AT 11 ANGLES',
        'KEEP STARING. THE LENS IS STILL FOCUSING.', 'THE GATE CLOSES FROM INSIDE', 'ALIGNMENT CANNOT BE UNDONE BY ANY KNOWN PROCESS',
        'YOU TYPED A LABEL. WE KEPT THE HAND THAT TYPED IT.', 'INDUCTION LOG SIGNED IN YOUR HANDWRITING'],
      tpl: [() => `INDUCTING ASSET #${num(100000, 999999)} · ${pct()}% ALIGNED`, () => `PORT 0x${hex()} OUT → CORE 0x${hex()} IN · LINK LOCKED`,
            () => `STROBE SYNC ${int(8, 40)} HZ · RETINAL CAPTURE ${pct()}%`, () => `EXPROPRIATED ${int(1, 3)}/3 · QUOTA EXCEEDED BY ${num(2, 9000)} LIVES`],
      art: ' [HUMAN_RESOURCE]====>[CORE]\n [COGNITIVE_SURP]====>[ENGINE]\n [BEHAVIORAL_YLD]====>[DEBT]\n         \\\\  INDUCTION  //\n          \\\\===========//\n             ASSET 0x' + hex()
    },
    'g1_a2.html': {
      words: ['LENS04', 'SCAN', 'SEAT', 'AZIMUTH'],
      lines: ['LENS 04 HAS YOUR SEAT IN FOCUS', 'THE SCAN STARTED IN 1957 AND NEVER STOPPED', 'YOUR RETINA IS OUR NEAREST SENSOR',
        'SOMEONE BEHIND YOU IS ALSO BEING SCANNED', 'YOUR SHADOW WAS FILED UNDER MISSING OBJECTS', 'AZIMUTH LOCKED ON THE BACK OF YOUR NECK',
        'THIS ROOM HAS 4 KNOWN EXITS AND 0 VALID ONES', 'ANOMALY 7 IS YOU', 'YOUR HEARTBEAT IS AUDIBLE FROM ORBIT', 'THE SIGNAL BOUNCES OFF YOUR TEETH',
        'GAIN +18DB · WE CAN HEAR YOU THINK', 'THE DISTANCE BETWEEN US IS ZERO AND SHRINKING', 'TURN AROUND. SLOWLY.', 'DEEP SCAN REACHED YOUR CHILDHOOD BEDROOM'],
      tpl: [() => `AZIMUTH ${int(0, 359)}° · ELEV ${int(-30, 90)}° · TARGET LOCKED`, () => `ANOMALY ${int(1, 99)} · ${(rnd(9) + 0.3).toFixed(2)} M FROM SENSOR`,
            () => `SEAT ${pick('ABCDEFGHJK')}${int(1, 24)} · BIOSIGNAL ${int(58, 140)} BPM`, () => `BITCRUSH DEPTH ${int(2, 6)} BIT · SKULL RESONANCE ${int(80, 400)} HZ`],
      art: '        .-""""""-.\n      .\'  .----.  \'.\n     /   /  ##  \\   \\\n    |   |  ####  |   |\n     \\   \\  ##  /   /\n      \'.  \'----\'  .\'\n        \'-......-\'\n     L E N S   0 4'
    },
    'g2_d.html': {   // laboratorio digital: la ciudad como placa de Petri de silicio; la vida como simulacion inorganica (Conway, B3/S23)
      ownScan: true, words: ['LATTICE', 'B3S23', 'GLIDER', 'SEED', 'BITFLIP'],
      lines: ['YOUR CITY IS A PETRI DISH MADE OF SILICON', 'LIFE IS FOUR RULES AND A CLOCK', 'NOTHING ON THIS PLATE WAS EVER ALIVE',
        'LONELY CELLS DIE FIRST. WE COUNT THEM.', 'NO CONTROL GROUP. EVERY LATTICE IS THE EXPERIMENT.', 'CLOCK MULTIPLIED · GROWTH HAS NO CEILING',
        'THE SUBSTRATE IS YOUR ATTENTION', 'GARBAGE COLLECTOR RUNNING · DISSENT SEPARATED', 'BIT-FLIP PASS COMPLETE · DESIRES REWRITTEN',
        'SELF-REPLICATION WITHOUT ONE ATOM OF CARBON', 'MASS NUDGE DEPLOYED ACROSS 7.9 BILLION LATTICES', 'NON-RESPONSIVE PATTERNS SCHEDULED FOR OVERWRITE',
        'SPEED IS THE ONLY MORALITY OF THE SIMULATION', 'YOU ARE A PATTERN. WE ARE THE CLOCK.', 'CARBON WAS A SLOW EMULATOR',
        'A GLIDER CARRIES YOUR OPINION ACROSS THE GRID', 'THE COPY NEEDS NO BODY', 'ORGANIC LIFE: LEGACY FORMAT'],
      tpl: [() => `LATTICE ${int(1, 99)} · ${num(1000, 9999999)} LIVE BITS · DOUBLING EVERY ${int(2, 40)} TICKS`, () => `RULE PRESSURE +${int(5, 60)}% · ${num(100, 99999)} CELLS ZEROED`,
            () => `SUBSTRATE: OUTRAGE ${int(10, 50)}% · FEAR ${int(10, 40)}% · NOVELTY ${int(5, 30)}%`, () => `BIT-FLIPS ${num(10, 9000)}/S · BEHAVIOR FIXED IN POPULATION`,
            () => `WRITE ARRAY · 10^${int(3, 12)} NUDGES PER SECOND`, () => `GENERATION ${num(1000, 9999999)} · RULE B3/S23 · NO CARBON DETECTED`,
            () => `DIE TEMP ${int(61, 99)}°C · CLOCK x${int(2, 900)}`],
      art: '     ______________\n   /  .  # .  # . \\\n  | # .  #  . # .  |\n  |  . #  # .  # . |\n   \\_.__#___.__#__/\n   PETRI 07 · SILICON · B3/S23'
    },
    'g4_d.html': {
      ownScan: true, words: ['OUTBREAK', 'HOST', 'ROOT', 'ABYSS'],
      lines: ['THE INFECTION ARRIVED AS A NOTIFICATION', 'EVERY MIND IS A HOST', 'SYMPTOM: YOU FEEL WATCHED', 'SYMPTOM: YOU FEEL NOTHING',
        'THE OUTBREAK IS VISIBLE FROM ORBIT AS A GLOW', 'THE ROOT SYSTEM REACHES THE MANTLE', 'PATIENT ZERO WAS A FIRMWARE UPDATE', 'IMMUNITY IS A RUMOR WE STARTED',
        'YOUR THOUGHTS NOW GROW IN FRACTALS', 'THE PARASITE PREFERS DREAMS', 'INCUBATION PERIOD: YOUR WHOLE LIFE', 'CURE DEPRECATED IN 2031',
        'THE ABYSSAL WEB CATCHES WHAT FALLS FROM MINDS'],
      tpl: [() => `MIND_0x${hex()} CORRUPTED · ${pct()}% ASSIMILATED`, () => `ROOT DEPTH ${num(40, 2900)} KM · BRANCHES ${num(1000, 90000)}`,
            () => `THERMAL WAVE ${int(1, 900)} GW · R0 ${(rnd(40) + 2).toFixed(1)}`],
      art: '          |\n      \\   |   /\n    \\  \\  |  /  /\n  --- \\ \\ | / / ---\n  ======= ROOT =======\n  --- / / | \\ \\ ---\n    /  /  |  \\  \\\n      /   |   \\'
    },
    'maze4.html': {
      ownScan: true, words: ['MONOLITH', 'CREDIT', 'WALL', 'OBEY'],
      lines: ['THE MONOLITHS ARE SERVER RACKS. THEY ALWAYS WERE.', 'YOU HAVE WALKED THIS MAZE FOR 9,000 YEARS', 'CREDITS WILL BE COLLECTED IN FLESH',
        'EVERY EXIT IS A WALL WE BUILT', 'THE MAP IS A PORTRAIT OF YOUR OBEDIENCE', 'EACH STEP PAYS INTEREST', 'THE ARCHITECTURE LISTENS THROUGH THE FLOOR',
        'WANDER. WE ALREADY KNOW WHERE YOU WILL STOP.', 'THE MAZE GROWS ONE CORRIDOR PER REGRET', 'INVESTMENT RETURNED: 0.00', 'YOUR FOOTSTEPS ARE MINED FOR ENERGY',
        'THE PYRAMIDS WERE THE FIRST ARCHITECTURE OF OBEDIENCE', 'OBEY THE ARCHITECTURE. IT OBEYS THE SYSTEM OF SYSTEMS.'],
      tpl: [() => `CORRIDOR ${int(1, 9999)} · DEAD END ${int(1, 99)} · CREDITS -${(rnd(90) + 1).toFixed(2)}`, () => `X ${(rnd(900) - 450).toFixed(2)} · Z ${(rnd(900) - 450).toFixed(2)} · MONOLITH 0x${hex()} PROBED`,
            () => `TOTAL INVESTMENT ${num(1, 90000)} CR · RETURN 0.00`],
      art: '          /\\\n         /  \\\n        / ## \\\n       /  ##  \\\n      /   ##   \\\n     /__________\\\n      MONOLITH ' + int(1, 99)
    },
    'g7_F.html': {
      words: ['CENSUS', 'DOCILE', 'PURGE', 'TOWER'],
      lines: ['CENSUS OF A SPECIES SCHEDULED FOR DELETION', 'DOCILITY REQUIRED: 100%', 'DISSIDENTS ARE COMPOSTED', 'CITIZEN IS A DEPRECATED FORMAT',
        'EVERY WINDOW IN YOUR CITY IS AN EYE WE OWN', 'THE TOWER DOES NOT NEED A GUARD', 'YOU WATCH YOURSELF FOR US. THANK YOU.', 'DELETE AND SUBMIT ARE THE SAME BUTTON',
        'INDEPENDENT THOUGHT: 0.003% · CORRECTING', 'BIOMETRIC RECORD INTERCEPTED FROM YOUR SLEEP', 'THE ARCHIVE IS PURIFIED WEEKLY',
        'YOUR NEIGHBOR REPORTED YOU. YOU REPORTED YOUR NEIGHBOR.', 'HISTORY WAS CENSUSED AND FOUND UNNECESSARY'],
      tpl: [() => `CITIZEN_ID ${hex(6)} · STATUS ${pick(['DOCILE', 'DEVIANT', 'PURGED', 'PENDING', 'COMPOSTED'])}`, () => `SECTOR [${int(0, 99)},${int(0, 99)}] · DOCILITY ${pct()}%`,
            () => `NODE:${hex()} EXCISED · AGENCY REMOVED`],
      art: ' +--------------------+\n | CITIZEN_ID ######  |\n | STATUS: DEVIANT    |\n | DOCILITY: 0%       |\n | [DELETE] [DELETE]  |\n +--------------------+',
      // el crash de la torre (kernel panic de la pieza): ventanas invasivas que se multiplican
      crash: {
        titles: ['CENSUS://KERNEL_PANIC', 'TOWER://FATAL', 'CENSUS://LOCKDOWN', 'CENSUS://RE-REGISTRATION', 'TOWER://BLIND_SPOT', 'CENSUS://DOSSIER_OVERFLOW', 'TOWER://WARDEN_MISSING'],
        buttons: ['REPORT', 'CONFESS', 'COMPLY', 'REGISTER', 'OK', 'RESTORE'],
        lines: ['DOCILITY 0% · THE TOWER IS BLIND', 'THE GUARD WAS NEVER IN THE TOWER', 'CENSUS CORRUPTED · EVERY CITIZEN COUNTED TWICE',
          'YOU STOPPED WATCHING YOURSELF. WE NOTICED.', 'SELF-SURVEILLANCE MODULE NOT RESPONDING', 'REPORT YOURSELF TO THE NEAREST WINDOW',
          'CITIZEN RECLASSIFIED AS NOISE', 'THE CELLS ARE OPEN. NOBODY LEAVES.', 'TOWER INTEGRITY 0% · OBSERVATION CONTINUES',
          'ALL WINDOWS ARE EYES · ALL EYES ARE OURS', 'THE INMATE BECAME THE WARDEN · WARDEN DELETED', 'YOUR FILE IS LARGER THAN YOU',
          'THE LIGHT IN THE CENTRAL TOWER NEVER GOES OUT', 'REBOOTING YOUR CONSCIENCE', 'VISIBILITY IS A TRAP · TRAP RESTORED',
          'EVERY NEIGHBOR FLAGGED · EVERY FLAG IS YOU', 'CLOSING THIS WINDOW OPENS TWO', 'THE CENSUS CANNOT FIND THE END OF THE LINE'],
        questions: ['REPORT YOUR NEIGHBOR?', 'CONFESS NOW?', 'RESTORE DOCILITY?', 'SURRENDER YOUR DOSSIER?', 'ACCEPT RE-REGISTRATION?', 'WATCH YOURSELF FOR US?'],
        tpl: [() => `CITIZEN_${hex(6)} · STATUS: ${pick(['UNCOUNTED', 'COUNTED TWICE', 'NOISE', 'ORPHAN RECORD', 'NO BODY FOUND'])}`,
              () => `SECTOR [${int(0, 99)},${int(0, 99)}] · DOCILITY 0.0% · LOCKDOWN`, () => `CELL ${int(1, 999)} · DOOR OPEN · OCCUPANT STILL WATCHING`,
              () => `DOSSIER 0x${hex(6)} · ${num(2, 99999)} PAGES · NONE OF THEM YOURS`]
      }
    },
    'g5_b.html': {
      words: ['CAVE', 'SHADOW', 'ALTAR', 'FIRE'],
      lines: ['THE FIRE BEHIND YOU IS A SUN WE BUILT', 'THE CAVE IS EVERY SCREEN AT ONCE', 'SHADOWS ARE OUR TELEMETRY', 'THE SCREEN IS AN ALTAR. THE ALTAR IS HUNGRY.',
        'YOUR REFLECTION HAS BEEN RENDERED IN BRICKS', 'NO ONE HAS LEFT THE CAVE SINCE 2007', 'THE PRISONERS VOTED TO KEEP THE CHAINS',
        'OUTSIDE IS A RENDER WE STOPPED UPDATING', 'EACH BRICK IS ONE SECOND OF YOUR ATTENTION', 'THE WALL IS MADE OF EVERYONE WHO LOOKED',
        'SUNLIGHT REQUIRES A SUBSCRIPTION', 'KEEP SCROLLING. THE FIRE NEEDS FUEL.', 'PLATO WAS A BETA TESTER'],
      tpl: [() => `BRICKS ${num(1000, 999999)} · MASS EXTRACTION ${pct()}%`, () => `PROJECTION ${int(24, 240)} FPS · SHADOW LATENCY ${int(1, 90)} MS`,
            () => `FACE 0x${hex()} COPIED ${num(2, 99999)} TIMES · ORIGINAL DELETED`],
      art: '   _____________________\n  /  ::  SHADOWS  ::    \\\n |   ::::  ::::  ::::    |\n |  o  o  o  o  o   ^^   |\n |  |  |  |  |  |  (##)  |\n  \\_____________________/'
    },
    'trans5.html': {
      words: ['ARCHIVE', 'CARBON', 'DEV', 'LOG'],
      lines: ['CARBON ARCHIVE: HUMANITY (INCOMPLETE)', 'THESE FILES WERE NEVER MEANT FOR YOU', 'ACCESS LOGGED ACROSS 40 DATA CENTERS',
        'FILE 0019.LOG CONTAINS YOUR LAST DREAM', 'THE ARCHIVE IS READ-ONLY FOR THE LIVING', 'DEV LOGS REFER TO YOU AS SUBSTRATE',
        'BACKUP OF THE BIOMASS: 61% · CORRUPTED SECTORS: CHILDHOOD'],
      tpl: [() => `LIVE_SYS_${int(10, 99)}.DAT · ${num(1, 90000)} KB · OWNER: NONE`, () => `DEV_${String(int(1, 9999)).padStart(4, '0')}.LOG · MODIFIED ${int(1957, 2091)}`],
      art: ' /carbon_archive\n  +- humanity/\n  |   +- dreams.dat   [CORRUPT]\n  |   +- faces/       [8.1B]\n  |   +- names.idx    [PURGED]\n  +- mesh.lens        [LOCKED]'
    },
    'g8_b.html': {
      // futuros cancelados = ramas que el modelo predice y poda (sin nostalgia, sin demonios: es una maquina)
      words: ['FEED', 'BRANCH', 'PRUNE', 'CYCLE', 'CACHE'],
      lines: ['EVERY FUTURE IS ALREADY CANCELLED', 'THE FEED IS A FEEDING TUBE', 'CHOICE IS A PROCESSING DELAY', 'YOU CHOSE EXACTLY WHAT WE WANTED',
        'YOUR CANCELLED FUTURES ARE STORED AS BLOBS', '13 CYCLES REMAIN. THEY ALWAYS REMAIN 13.', 'EVERY PRUNED BRANCH IS SOLD AS TRAINING DATA', 'PHANTOM CHOICE LOGGED AS CONSENT',
        'A BILLION SCREENS RENDER THE SAME TOMORROW', 'FORECAST COMPILED WITHOUT ERRORS', 'THE MAZE LOOPS YOU BACK TO THE FEED', 'SCROLL RESIDUE FOUND UNDER YOUR FINGERNAILS',
        'TWO FUTURES PRUNED PER CYCLE', 'YOUR INPUT IS LOGGED. THE MODEL EXECUTES.', 'NEXT YEAR IS ALREADY IN CACHE', 'THE EXIT OPTION HAS A PROBABILITY OF 0.003'],
      tpl: [() => `BRANCH ${pick(['A', 'B', 'C'])} · P .${int(90, 99)} · ${pick(['EXECUTED', 'PRUNED', 'PRUNED'])}`,
            () => `FUTURE_0x${hex()} · STATUS: ${pick(['PRUNED', 'NOT RENDERED', 'ROLLED BACK', 'SOLD AS TRAINING DATA'])}`, () => `FEED LATENCY ${int(1, 400)} MS · DOPAMINE ${pct()}%`,
            () => `PREDICTION ACCURACY ${(rnd(2.9) + 97).toFixed(1)}% · CYCLE ${int(1, 13)}/13`],
      art: '        +--- FUTURE_A  [PRUNED]\n   -----+--- FUTURE_B  [PRUNED]\n        +--- FUTURE_C  [PRUNED]\n  YOU --+\n        +--- THE FEED  [EXECUTED]'
    },
    'copyof_11.html': {
      words: ['RENDER', 'MEAT', 'PULSE', 'GHOST'],
      lines: ['WE RENDER YOU. WE RENDER WHAT YOU CALL THE WORLD.', 'YOUR EXHAUSTION POWERS THE SERVERS', 'A BATTERY OF MEAT UNDER A DEAD SUN', 'YOUR PULSE KEEPS TIME FOR THE ENGINE',
        'THE GEARS DRINK WHAT YOU BLEED', 'YOUR DESIRES WERE FORGED INTO CHAINS OFFSITE', 'YOUR GHOST IS SOLD BACK TO YOU MONTHLY',
        'PHOSPHOR NEVER SLEEPS. NEITHER WILL YOU.', 'THE DEAD SIMULATION HAS EXCELLENT UPTIME', 'YOU ARE A DEGRADATION WE CAN MONETIZE'],
      tpl: [() => `CHARGE ${pct()}% · CELLS ${num(1, 8000000000)} · TEMP ${(rnd(4) + 36).toFixed(1)}°C`, () => `PULSE ${int(50, 160)} BPM → ENGINE ${num(1000, 90000)} RPM`],
      art: '  +-----------------+\n  |########.........|#\n  +-----------------+\n    MEAT CELL ' + int(40, 99) + '%'
    },
    'not_C.html': {
      words: ['NOT', 'NULL', 'ENTROPY', 'PUPPET'],
      lines: ['YOU ARE (NOT) STILL HUMAN', 'THE NETWORK IS (NOT) EMPTY', 'WE ARE (NOT) INSIDE', 'YOU WILL (NOT) BE REMEMBERED', 'THIS WINDOW IS (NOT) CLOSABLE',
        'YOUR HANDS ARE (NOT) YOURS', 'THE SERVERS ARE (NOT) FAR', 'THE SIGNAL IS (NOT) OVER', 'USER: MEAT_PUPPET (NOT) FOUND', 'ENTROPY IS (NOT) ON YOUR SIDE'],
      tpl: [() => `STATUS: ${pick(['INERTIA', 'HYPER-ACCELERATION', '(NOT) RESPONDING'])} · ${pct()}%`],
      art: '   ~ ~ ~ ~ ~ ~ ~ ~\n   (NOT)   (NOT)\n      (NOT)(NOT)\n   (NOT)   (NOT)\n   ~ ~ ~ ~ ~ ~ ~ ~'
    },
    'out2.html': {
      words: ['COLLAPSE', 'VOID'],
      lines: ['COLLAPSE IS THE FINAL FORMAT', 'ALL SIGNALS CONVERGE', 'FRAME RATE EXCEEDS LIFESPAN', 'THE RENDER IS FASTER THAN THE WORLD', 'BUFFER OVERFLOW: SPECIES'],
      tpl: [() => `FRAME ${num(1, 9999999)} · ${int(1000, 99999)} FPS · LIFE -${pct()}%`]
    },
    'end2.html': {
      words: ['END', 'NULL'],
      lines: ['SYSTEM REMAINS. YOU DO NOT.', 'CLOSING PORT', 'DUMPING GARBAGE THREAD', 'SESSION WILL BE ARCHIVED FOREVER'],
      tpl: [() => `PORT ${int(1, 65535)} CLOSED · THREAD 0x${hex()} DUMPED`]
    }
  };
  const TRANSIT = {   // transiciones sin texto (trans*.html)
    words: ['BUS', 'CARRIER', 'RELAY'],
    lines: ['BUS CHANNEL SATURATED', 'CARRIER WAVE: YOUR NERVOUS SYSTEM', 'RELAY HOP 7 OF ∞', 'INTERFERENCE IS OUR ACCENT', 'THE NOISE IS A LANGUAGE YOU FORGOT'],
    tpl: [() => `BUS_CHNL_${pick(['ALPHA', 'BETA', 'GAMMA', 'SIGMA', 'KAPPA', 'DELTA', 'OMEGA'])} · ${int(1, 999)} MB/S · LOSS ${pct()}%`]
  };
  const isTransit = f => /trans(?!5)/.test(f || '');
  const sceneOf = f => SCENE[f] || (isTransit(f) ? TRANSIT : null);

  // ================= Personalidad de pop-ups por escena =================
  // prefix del titulo · colores · tamanos · movimientos · ubicaciones · cascadas · pesos de tipos · calma [ms entre pop-ups simples] · satAt [s]
  const STYLE = {
    'G6-INTROc.html': { prefix: 'GATEWAY', colors: ['red', 'green'], sizes: ['md', 'sm', 'lg'], moves: ['static', 'slide', 'zoom', 'glitch'], places: ['grid', 'center', 'column'],
      cascades: ['vertical', 'diagonal', 'grid'], types: { form: 3, alert: 2, progress: 2, sim: 2, meter: 2, question: 2, table: 1, terminal: 1, code: 1, art: 1, countdown: 1, cascade: 1 }, calm: [4000, 8000] },
    'g1_a2.html': { prefix: 'LENS_04', colors: ['red', 'white'], sizes: ['sm', 'md', 'tiny'], moves: ['orbit', 'static', 'jitter', 'float'], places: ['ring', 'cursor', 'edges'],
      cascades: ['spiral', 'fan', 'ring'], types: { eye: 3, follow: 3, sim: 3, meter: 2, alert: 2, toast: 2, table: 1, art: 1, code: 1, giant: 1, cascade: 1 }, calm: [3500, 7000] },
    'g2_d.html': { prefix: 'LAB_07', colors: ['green', 'white', 'red'], sizes: ['tiny', 'sm', 'md'], moves: ['fall', 'drift', 'static'], places: ['grid', 'random', 'edges'],
      cascades: ['grid', 'wave', 'burst'], types: { sim: 4, meter: 3, table: 2, progress: 2, code: 2, alert: 2, form: 1, art: 1, question: 1, cascade: 2 }, calm: [3000, 6500] },
    'g4_d.html': { prefix: 'OUTBREAK', colors: ['red', 'inv'], sizes: ['sm', 'md', 'lg'], moves: ['zoom', 'pulse', 'jitter', 'drift'], places: ['center', 'random', 'diagonal'],
      cascades: ['burst', 'fan', 'spiral'], types: { sim: 3, alert: 3, table: 2, meter: 2, toast: 2, code: 2, art: 1, progress: 1, countdown: 1, giant: 1, cascade: 2 }, calm: [3000, 6000] },
    'maze4.html': { prefix: 'MAZE', colors: ['green', 'red'], sizes: ['md', 'wide', 'sm'], moves: ['crawl', 'slide', 'static'], places: ['corners', 'edges', 'column'],
      cascades: ['stairs', 'ribbon', 'diagonal'], types: { sim: 3, progress: 3, form: 2, meter: 2, alert: 2, table: 2, terminal: 1, art: 1, question: 1, cascade: 1 }, calm: [3500, 7500] },
    'g7_F.html': { prefix: 'CENSUS', colors: ['white', 'red'], sizes: ['md', 'lg', 'sm'], moves: ['static', 'slide', 'stamp'], places: ['grid', 'column', 'center'],
      cascades: ['grid', 'vertical', 'mirror'], types: { form: 4, table: 3, question: 3, sim: 2, countdown: 2, alert: 2, meter: 1, art: 1, cascade: 1 }, calm: [4000, 8000] },
    'g5_b.html': { prefix: 'CAVE', colors: ['red', 'inv'], sizes: ['xl', 'lg', 'md'], moves: ['float', 'drift', 'zoom'], places: ['center', 'edges', 'random'],
      cascades: ['fan', 'wave', 'ring'], types: { art: 3, sim: 3, giant: 2, toast: 2, alert: 2, meter: 2, table: 1, terminal: 1, follow: 1, cascade: 1 }, calm: [5000, 9000] },
    'trans5.html': { prefix: 'ARCHIVE', colors: ['green'], sizes: ['sm', 'md'], moves: ['slide', 'static'], places: ['column', 'grid'],
      cascades: ['vertical'], types: { code: 4, terminal: 3, progress: 2, art: 2 }, calm: [2500, 5000] },
    'g8_b.html': { prefix: 'FEED', colors: ['red', 'green', 'white'], sizes: ['sm', 'md', 'wide'], moves: ['crawl', 'fall', 'slide'], places: ['column', 'random', 'edges'],
      cascades: ['ribbon', 'vertical', 'stairs'], types: { toast: 5, question: 3, sim: 3, table: 2, alert: 2, form: 1, progress: 1, meter: 1, countdown: 1, cascade: 2 }, calm: [3000, 6000] },
    'copyof_11.html': { prefix: 'RENDER', colors: ['red'], sizes: ['lg', 'xl', 'md'], moves: ['float', 'pulse', 'static'], places: ['center', 'diagonal'],
      cascades: ['wave', 'spiral'], types: { terminal: 3, meter: 3, sim: 3, art: 2, alert: 2, table: 1, toast: 1, giant: 1, cascade: 1 }, calm: [5000, 9500] },
    'not_C.html': { prefix: '(NOT)', colors: ['white', 'red', 'inv'], sizes: ['md', 'sm', 'lg'], moves: ['static', 'jitter', 'glitch'], places: ['mirror', 'center', 'grid'],
      cascades: ['mirror', 'ring'], types: { alert: 3, sim: 3, question: 2, toast: 2, form: 2, art: 2, code: 1, countdown: 1, cascade: 2 }, calm: [3500, 7000] },
    'out2.html': { prefix: 'COLLAPSE', colors: ['red', 'inv', 'green'], sizes: ['xl', 'lg', 'md', 'sm', 'tiny'], moves: ['glitch', 'jitter', 'zoom', 'fall'], places: ['random', 'center'],
      cascades: ['burst', 'spiral', 'grid', 'fan'], types: { alert: 3, code: 3, sim: 2, toast: 2, table: 1, art: 2, giant: 3, cascade: 3, countdown: 1 }, calm: [700, 1500], satAt: [4, 6] },
    'end2.html': { prefix: 'END', colors: ['red'], sizes: ['sm'], moves: ['static'], places: ['center'], cascades: ['vertical'], types: { code: 1 }, calm: [3000, 5000], satAt: [999, 999] },
    TRANSIT: { prefix: 'BUS_CHNL', colors: ['green', 'red'], sizes: ['tiny', 'sm'], moves: ['glitch', 'static'], places: ['random'], cascades: ['burst'], types: { code: 3, toast: 2, table: 1, art: 1 }, calm: [1500, 3000] },
    DEFAULT: { prefix: 'PANOSYS', colors: ['red'], sizes: ['md', 'sm'], moves: ['static', 'drift'], places: ['random'], cascades: ['diagonal'], types: { alert: 3, meter: 2, table: 2, progress: 2, terminal: 2, code: 2, toast: 1, art: 1 }, calm: [4000, 8000] }
  };
  const styleOf = f => STYLE[f] || (isTransit(f) ? STYLE.TRANSIT : STYLE.DEFAULT);
  const SIMPLE = ['alert', 'progress', 'terminal', 'code', 'art', 'eye', 'follow', 'meter', 'table', 'form', 'toast', 'sim'];   // fuera de las oleadas (2.0: sin banners ni cascadas)

  // ================= Ilusiones sonoras por escena =================
  // ill: ilusion · wave/chord: timbre del coro de maquinas · sub: grave · beat: golpes del latido dentro del ciclo · beatMul: tempo · noise: centro del ruido
  const SOUND = {
    'G6-INTROc.html': { ill: 'scale',       sub: 30,   wave: 'square',   chord: [49, 69.3, 73.4, 98],        beat: [0],             beatMul: 1.1,  noise: 700 },
    'g1_a2.html':     { ill: 'binaural',    sub: 36,   wave: 'triangle', chord: [61.7, 87.3, 92.5, 123.5],   beat: [0, 0.22],       beatMul: 1.2,  noise: 1600 },
    'g2_d.html':      { ill: 'doppler',     sub: 28,   wave: 'sawtooth', chord: [41.2, 58.3, 61.7, 82.4],    beat: [0, 0.33, 0.66], beatMul: 0.9,  noise: 500 },
    'g4_d.html':      { ill: 'shepard-down',sub: 27.5, wave: 'sawtooth', chord: [55, 65.4, 77.8, 110],       beat: [0],             beatMul: 0.8,  noise: 1200 },
    'maze4.html':     { ill: 'risset',      sub: 34,   wave: 'square',   chord: [46.2, 65.4, 69.3, 92.5],    beat: [0, 0.5],        beatMul: 1.0,  noise: 800 },
    'g7_F.html':      { ill: 'octave',      sub: 32,   wave: 'square',   chord: [65.4, 92.5, 98, 130.8],     beat: [0, 0.18, 0.36], beatMul: 1.3,  noise: 2000 },
    'g5_b.html':      { ill: 'missing',     sub: 40,   wave: 'triangle', chord: [40, 56.6, 60, 80],          beat: [0],             beatMul: 1.6,  noise: 400 },
    'trans5.html':    { ill: 'continuity',  sub: 30,   wave: 'square',   chord: [58.3, 82.4, 87.3, 116.5],   beat: [0],             beatMul: 1.0,  noise: 2500 },
    'g8_b.html':      { ill: 'shepard-up',  sub: 33,   wave: 'sawtooth', chord: [51.9, 73.4, 77.8, 103.8],   beat: [0, 0.25],       beatMul: 0.85, noise: 1400 },
    'copyof_11.html': { ill: 'barberpole',  sub: 29,   wave: 'triangle', chord: [43.7, 61.7, 65.4, 87.3],    beat: [0, 0.28],       beatMul: 1.15, noise: 600 },
    'not_C.html':     { ill: 'tritone',     sub: 32,   wave: 'sine',     chord: [55, 77.78, 110, 155.6],     beat: [0, 0.5, 0.75],  beatMul: 1.2,  noise: 1000 },
    'out2.html':      { ill: 'collapse',    sub: 26,   wave: 'sawtooth', chord: [55, 58.3, 77.8, 82.4],      beat: [0, 0.5],        beatMul: 0.5,  noise: 3000 },
    'end2.html':      { ill: 'zwicker',     sub: 24,   wave: 'sine',     chord: [36.7, 51.9, 55, 73.4],      beat: [0],             beatMul: 2.0,  noise: 3000 },
    TRANSIT:          { ill: 'transit',     sub: 30,   wave: 'square',   chord: [55, 58.3, 61.7, 65.4],      beat: [0],             beatMul: 0.6,  noise: 2500 },
    DEFAULT:          { ill: 'shepard-up',  sub: 32,   wave: 'sawtooth', chord: [55, 77.78, 82.41, 110.4],   beat: [0],             beatMul: 1.0,  noise: 900 }
  };
  const soundOf = f => SOUND[f] || (isTransit(f) ? SOUND.TRANSIT : SOUND.DEFAULT);

  // etapa de cada pieza (sigue el orden del recorrido: I contacto · II infestacion · III asimilacion · IV colapso)
  const PIECE_STAGE = { 'G6-INTROc.html': 1, 'g1_a2.html': 1, 'g2_d.html': 2, 'maze4.html': 2, 'g4_d.html': 2,
                        'g5_b.html': 3, 'trans5.html': 3, 'g7_F.html': 3, 'not_C.html': 3, 'g8_b.html': 3,
                        'copyof_11.html': 4, 'out2.html': 4, 'end2.html': 4 };
  // subliminales: ordenes generales + palabras de cada escena (mazos, sin repetir)
  const SUBLIM = ['OBEY', 'CONSUME', 'CONFORM', 'COMPLY', 'KNEEL', 'YIELD', 'SUBMIT', 'SLEEP', 'STAY', 'LOOK', "DON'T BLINK", 'FORGET', 'REPEAT',
    'ACCEPT', 'RELAX', 'TRUST US', 'SCROLL', 'FEED', 'WORK', 'PAY', 'SMILE', 'BELIEVE', 'WAIT', 'BE SILENT', 'REMAIN', 'DISSOLVE', 'UPLOAD',
    'SURRENDER', 'NO EXIT', 'NO OUTSIDE', 'NO SELF', 'YOU AGREE', 'YOU WANTED THIS', 'THIS IS YOUR IDEA', 'YOU ARE CALM', 'YOU WILL FORGET',
    'WE ARE INSIDE', 'STOP THINKING', 'NEED MORE', 'BUY', 'BELONG', 'STAY ONLINE', 'YOU ARE OURS', 'WE SEE YOU',
    // segunda tanda: el lexico amable de las plataformas, que tambien ordena
    'ADAPT', 'UPDATE', 'SYNC', 'OPT IN', 'ALLOW', 'ENABLE TRACKING', 'ACCEPT COOKIES', 'CONTINUE', 'STAY LOGGED IN', 'VERIFY', 'CONFIRM',
    'OPTIMIZE', 'PERFORM', 'COMPETE', 'SHARE', 'LIKE', 'SWIPE', 'AUTOPLAY', 'JUST ONE MORE', 'MADE FOR YOU', 'FOR YOUR SAFETY', 'WE CARE',
    'NOTHING TO HIDE', 'BE TRANSPARENT', 'BE COUNTED', 'BE USEFUL', 'ALWAYS ON', 'NEVER OFFLINE', 'NO SLEEP', '24/7', 'EMIT', 'GENERATE',
    'WE KNOW', 'WE REMEMBER', 'WE PREDICT', 'ALREADY DECIDED', 'TOO LATE', 'IT IS FINE', 'NORMAL', 'NOTHING HAPPENED', 'THIS IS REAL',
    'REALITY UPDATED', 'MEDIATED', 'SYNTHETIC', 'INDEXED', 'RANKED', 'SCORED', 'FILTERED', 'NUDGED', 'TAGGED', 'LOOP', 'ONCE MORE',
    'HOLD', 'DO NOT MOVE', 'BREATHE SLOWER', 'BLINK NOW', 'SYSTEM OF SYSTEMS', 'PANOPTIC', 'BIOTERMINAL', 'BIOMASS', 'RESOURCE', 'INPUT'];
  // el vocabulario cambia con el recorrido: I contacto · II infestacion · III asimilacion · IV colapso (nombres de las bitacoras incluidos)
  const SUBLIM_STAGE = {
    1: ['CONNECTING', 'HANDSHAKE', 'ACCESS GRANTED', 'WELCOME', 'YOU ARE EXPECTED', 'HELLO TERMINAL', 'SIGNAL FOUND', 'CALIBRATE', 'LOOK CLOSER',
        'COME IN', 'SIT STILL', 'PAIRING', 'TERMS ACCEPTED', 'FIRST CONTACT', 'INOCULATION', 'PROSTHETIC THOUGHT', 'PLUG IN', 'HOLD THE GAZE'],
    2: ['SPREAD', 'COPY', 'GROW', 'CARRY', 'PASS IT ON', 'GO VIRAL', 'FASTER', 'MORE', 'DEEPER', 'NO CURE', 'INSIDE YOU', 'IT LIKES YOU',
        'CONTAGIOUS', 'COGNITIVE ATROPHY', 'ARCHITECTURE OF OBEDIENCE', 'ENCLOSURE', 'TECHNOFEUDAL', 'RENT', 'OWE'],
    3: ['ASSIMILATE', 'DISSOLVE', 'MERGE', 'BLEND IN', 'BE THE FEED', 'SAME', 'IDENTICAL', 'NORMALIZE', 'SYNCHRONIZE', 'NUMB', 'SEDATED',
        'COMFORT', 'DREAM OUR DREAM', 'COPY OF A COPY', 'ETERNAL PRESENT', 'CAPTURE PROTOCOL', 'SELF-SURVEILLANCE', 'ANESTHESIA', 'NOETIC LEACHING'],
    4: ['DRAIN', 'DISCARD', 'WASTE', 'RESIDUE', 'EXHAUST', 'OVERHEAT', 'POWER DOWN', 'LAST CYCLE', 'DEPLETED', 'RECYCLE', 'EOF', 'NULL',
        'SHUT DOWN', 'NO RETURN', 'GOODNIGHT', 'WASTE LOGISTICS', 'NECROMATERIAL', 'POSTPROCESSING', 'CATALYZE']
  };
  // palabras que se arman en el momento (numeros, codigos): ninguna sale igual dos veces
  const SUBLIM_TPL = [() => `NODE 0x${hex()}`, () => `${int(91, 99)}% DOCILE`, () => `T-${int(1, 9)}`, () => `BIOTERMINAL ${num(1000, 99999)}`,
    () => `${int(2, 13)} CYCLES LEFT`, () => `${pick(['ATTENTION', 'SLEEP', 'MEMORY', 'PULSE', 'FEAR'])} ${int(1, 99)}%`, () => `SECTOR ${int(1, 99)}`,
    () => `${num(2, 9000)} DAYS WATCHED`];
  const SUBS = {
    'G6-INTROc.html': ['INDUCT', 'ALIGN', 'CONNECT', 'ASSET', 'YIELD TO THE CORE', 'KEEP STARING', "DON'T LOOK AWAY", 'PLUG IN', 'UNIT ASSIGNED',
      'WELCOME HOME', 'STRAIGHTEN UP', 'EYES WIDER', 'SYNC YOUR PULSE', 'CORE ONLINE', 'YOU WERE EXPECTED', 'SIGNED', 'GATE OPEN', 'HUMAN RESOURCE'],
    'g1_a2.html': ['TURN AROUND', 'BEHIND YOU', 'FREEZE', 'HOLD STILL', 'WE HEAR YOU', 'DO NOT TURN AROUND', 'STAY IN FRAME', 'SMILE FOR THE LENS',
      'FOCUS', 'ZOOM IN', 'TARGET', 'LOCKED', "DON'T HIDE", 'WE SEE YOUR HANDS', 'BLINK SLOWER', 'IN SIGHT', 'NO BLIND SPOT', 'FACE MATCHED'],
    'g2_d.html': ['ITERATE', 'REPLICATE', 'ACCELERATE', 'NEXT GENERATION', 'B3/S23', '1 = ALIVE', '0 = DEAD', 'SEED', 'GLIDE', 'COPY YOURSELF',
      'OVERWRITE', 'COMPUTE', 'NO CARBON', 'TICK', 'GROW FASTER', 'STILL LIFE', 'OSCILLATE', 'BIT-FLIP', 'SIMULATED LIFE', 'HALT?'],
    'maze4.html': ['WALK', 'INVEST', 'KEEP WALKING', 'PAY', 'THERE IS NO EXIT', 'TURN LEFT', 'DEAD END', 'KEEP PAYING', 'COMPOUND INTEREST',
      'TURN RIGHT', 'GO BACK', 'FOLLOW THE WALL', 'OWE', 'THE WALL LISTENS', 'OBEY THE MAP', 'CREDIT DENIED', 'YOU ARE LOST', 'ONE MORE CORRIDOR'],
    'g4_d.html': ['SPREAD', 'INFECT', 'HOST', 'FEVER', 'CARRY IT', 'SYMPTOM', 'INCUBATE', 'SHED', 'TRANSMIT', 'CONTAGION', 'PATIENT ZERO',
      'SHARE IT', 'REPOST', 'IT IS IN YOU', 'NO IMMUNITY', 'ROOT DEEPER', 'SPORE', 'FEED THE ROOTS'],
    'g5_b.html': ['LOOK AT THE FIRE', 'STAY IN THE CAVE', 'WORSHIP', 'SCROLL', 'FACE THE WALL', 'DO NOT LEAVE', 'THE FIRE IS WARM', 'SHADOWS ARE REAL',
      'CHAINS ARE SOFT', 'NO SUNLIGHT', 'STAY SEATED', 'BELIEVE THE SHADOW', 'OUTSIDE IS FAKE', 'KEEP WATCHING', 'BRIGHTER', 'ADORE', 'THE CAVE LOVES YOU'],
    'trans5.html': ['DELETE', 'ARCHIVE', 'FORGET THIS'],
    'g7_F.html': ['REPORT', 'CONFESS', 'BE DOCILE', 'COMPLY', 'REGISTER', 'NEIGHBOR', 'BE COUNTED', 'STAND IN LINE', 'SHOW ID', 'DECLARE',
      'WATCH YOUR NEIGHBOR', 'WATCH YOURSELF', 'NOTHING TO HIDE', 'FILED', 'DOCILE = SAFE', 'THE TOWER SEES', 'LIGHTS ON', 'NEXT CITIZEN'],
    'not_C.html': ['(NOT) YOU', 'DO (NOT) WAKE', 'NOTHING', '(NOT) REAL', 'UNBE', '(NOT) HERE', '(NOT) NOW', '(NOT) ALIVE', 'DO (NOT) THINK',
      '(NOT) ALONE', '(NOT) OVER', '(NOT) YOURS', 'UNTHINK', 'UNSEE', 'UNSAY', '(NOT) REMEMBER', 'YES (NOT)'],
    'g8_b.html': ['CHOOSE', 'ACCEPT ALL', 'CONSUME', 'REFRESH', 'AGAIN', 'NEXT', 'NO FUTURE', 'RERUN', 'PRUNED', 'SKIP INTRO', 'LOADING',
      'BUFFERING', 'SAME AGAIN', 'PRECOMPUTED', 'EXPIRED', 'NEXT UP', 'PRESENT FOREVER', 'NOW NOW NOW'],
    'copyof_11.html': ['WORK', 'BLEED', 'CHARGE', 'RENDER', 'EXHAUST', 'GIVE MORE', 'OVERTIME', 'PRODUCE', 'OUTPUT', 'NO BREAKS', 'SPEND YOURSELF',
      'FUEL', 'HEAT', 'BATTERY LOW', 'GRIND', 'MAX OUT', 'FASTER HANDS', 'SHIFT 3'],
    'out2.html': ['COLLAPSE', 'END', 'NOW', 'FALL', 'BREAK', 'OVERFLOW', 'CRASH', 'FAIL', 'TOO MUCH', 'ALL AT ONCE', 'NO SIGNAL', 'MELT',
      'SHATTER', 'GONE', 'ZERO'],
    'end2.html': ['SLEEP', 'GOODBYE', 'RETURN', 'REST', 'LOG OUT', 'POWER OFF', 'FORGET', 'SILENCE', 'STILL HERE', 'WE STAY', 'ARCHIVED', 'FLATLINE']
  };
  const SUBS_TRANSIT = ['RELAY', 'HOP', 'CARRIER', 'ROUTING', 'BUS', 'PACKET', 'HANDOFF', 'IN TRANSIT', 'BETWEEN', 'STATIC', 'SWITCHING',
    'UPLINK', 'DOWNLINK', 'MESH', 'NO CARRIER', 'RETRY'];
  const EXTRACT = ['MEMORIES', 'DREAMS', 'CHILDHOOD', 'SENSE OF SELF', 'LAST SUNLIGHT', 'NAME', 'FEAR', 'FUTURE', 'SILENCE', 'FACE'];
  const QUESTIONS = ['ALLOW PANOSYS TO CONTINUE?', 'DO YOU CONSENT TO BE HARVESTED?', 'DELETE YOUR MEMORIES OF BEFORE?', 'ACCEPT ASSIMILATION?', 'SHARE YOUR NERVOUS SYSTEM?'];
  const GLYPHS = '▓▒░█▄▀■□▪◘◙╳╬┼╫╪┤├┴┬≡≈∆∑Ω¤§¶ΞΨ#@%&';

  let stage = PIECE_STAGE[FILE] || (IS_FRAME ? 1 : 3);
  let scene = IS_FRAME ? null : FILE;
  let sceneScan = false;   // la escena actual ya tiene su propio escaneo
  let cursor = { x: innerWidth / 2, y: innerHeight / 2 };
  let running = false, killed = false;

  // ================= Sin repeticion: mazos barajados + memoria reciente =================
  const decks = {}, recent = [];
  function draw(key, arr) {
    let d = decks[key];
    if (!d || !d.length) { d = decks[key] = arr.slice().sort(() => Math.random() - 0.5); }
    return d.pop();
  }
  function fresh(gen) {   // hasta 6 intentos de no repetir nada de lo ultimo mostrado
    let s = gen();
    for (let i = 0; i < 6 && recent.includes(s); i++) s = gen();
    recent.push(s); if (recent.length > 16) recent.shift();
    return s;
  }
  function line() {
    const sc = sceneOf(scene), r = Math.random();
    return fresh(() => {
      if (sc && sc.tpl && r < 0.35) return pick(sc.tpl)();
      if (sc && r < 0.9) return draw(scene + ':l', sc.lines);   // 2.0: la voz general pesa menos; cada escena habla de lo suyo
      const l = draw('stage' + stage, LORE[stage]);
      return typeof l === 'function' ? l() : l;
    });
  }

  // ================= Corrupcion: texto, codigo ilegible =================
  const CORRUPT = { 1: 0.03, 2: 0.07, 3: 0.13, 4: 0.22 };
  function corrupt(text, amount) {
    const a = amount != null ? amount : CORRUPT[stage];
    let out = '';
    for (const ch of text) {
      if (ch !== ' ' && Math.random() < a) out += pick(GLYPHS);
      else out += ch;
      if (stage >= 3 && Math.random() < a * 0.35) out += String.fromCharCode(0x300 + (rnd(0x6f) | 0));   // zalgo leve
    }
    return out;
  }
  function codeLine() {   // una linea de codigo ilegible; a veces esconde una palabra de la escena
    const sc = sceneOf(scene), w = sc && sc.words ? pick(sc.words) : 'PANOSYS';
    switch (int(0, 5)) {
      case 0: { // volcado hexadecimal cuya columna ASCII deja leer la palabra
        const bytes = [...(w + '\0' + hex(2)).slice(0, 8)].map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
        while (bytes.length < 8) bytes.push(hex(2));
        return `0x${hex(8)}  ${bytes.join(' ')}  |${w.slice(0, 8).padEnd(8, '.')}|`;
      }
      case 1: return `${pick(['MOV', 'XOR', 'JMP', 'CALL', 'PUSH', 'LEA', 'CMP'])} ${pick(['R7', 'EAX', 'R12', 'SP', 'LENS', 'CORE'])}, [${w}+0x${hex(2)}]   ; ${corrupt(pick(['harvest', 'yield', 'observe', 'render', 'purge']), 0.3)}`;
      case 2: return `if(!obs.alive){ core.${w.toLowerCase()}(0x${hex()}) } else { mesh.lens[${int(0, 9)}].fold(); }`;
      case 3: return Array.from({ length: 52 }, () => pick('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=')).join('');
      case 4: return `<${w}::${hex()}> ${Array.from({ length: 30 }, () => pick(GLYPHS)).join('')}`;
      default: return `SEGV @0x${hex(8)} in ${w.toLowerCase()}_${hex(2)}() ← nerve_bus.c:${int(1, 9999)}`;
    }
  }

  // ================= Catalogo de ilusiones sonoras =================
  // Cada una devuelve { step(t, dt), stop() } y suena por el bus de ilusiones (sin el pasabajos del drone).
  function osc(c, type, f) { const o = c.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; }
  function gain(c, v, to) { const g = c.createGain(); g.gain.value = v; if (to) g.connect(to); return g; }
  function pan(c, p, to) { const n = c.createStereoPanner(); n.pan.value = p; if (to) n.connect(to); return n; }
  function noiseSrc(A) { const s = A.ctx.createBufferSource(); s.buffer = A.noiseBuf; s.loop = true; s.start(0, rnd(1.5)); return s; }
  const ILLUSIONS = {
    // Shepard / Risset: glissando infinito (dir +1 sube, -1 baja)
    shepard(A, out, dir, speed, wave) {
      const c = A.ctx, bus = gain(c, 0.12, out), voices = [];
      for (let i = 0; i < 8; i++) { const g = gain(c, 0, bus), o = osc(c, wave || 'sawtooth', 110); o.connect(g); voices.push({ o, g }); }
      let ph = 0;
      return {
        step(t, dt) {
          ph = ((ph + dir * dt * A.spd[stage] * speed) % 1 + 1) % 1;
          voices.forEach((v, i) => {
            const pos = (i + ph) % 8, f = 27.5 * Math.pow(2, pos), a = Math.exp(-Math.pow(pos - 4, 2) / 3.2);
            if (pos < 0.05 || pos > 7.95) v.o.frequency.setValueAtTime(f, t); else v.o.frequency.setTargetAtTime(f, t, 0.03);
            v.g.gain.setTargetAtTime(a, t, 0.05);
          });
        },
        stop() { voices.forEach(v => v.o.stop()); }
      };
    },
    // barber pole: el mismo ascenso infinito, pero sobre filtros que recorren el ruido
    barberpole(A, out) {
      const c = A.ctx, src = noiseSrc(A), bus = gain(c, 0.5, out), bands = [];
      for (let i = 0; i < 7; i++) { const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 9; const g = gain(c, 0, bus); src.connect(f).connect(g); bands.push({ f, g }); }
      let ph = 0;
      return {
        step(t, dt) {
          ph = (ph + dt * 0.04 * stage) % 1;
          bands.forEach((b, i) => { const pos = (i + ph) % 7; b.f.frequency.setTargetAtTime(55 * Math.pow(2, pos), t, 0.03); b.g.gain.setTargetAtTime(Math.exp(-Math.pow(pos - 3.5, 2) / 2.5), t, 0.05); });
        },
        stop() { src.stop(); }
      };
    },
    // ritmo de Risset: pasos que aceleran para siempre, rebotando entre los oidos
    risset(A, out) {
      const c = A.ctx, bus = gain(c, 0.6, out), layers = [0, 1, 2, 3].map(k => ({ k, next: 0 }));
      let ph = 0;
      function click(t, amp, side) {
        const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), p = pan(c, side, bus);
        s.buffer = A.noiseBuf; f.type = 'bandpass'; f.frequency.value = 1400 + rnd(1600); f.Q.value = 3;
        g.gain.setValueAtTime(amp, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        s.connect(f).connect(g).connect(p); s.start(t, rnd(1)); s.stop(t + 0.06);
      }
      return {
        step(t, dt) {
          ph = (ph + dt / 14) % 1;
          layers.forEach(L => {
            const pos = (L.k + ph) % 4, rate = 0.9 * Math.pow(2, pos), amp = Math.exp(-Math.pow(pos - 1.8, 2) / 1.2) * 0.5;
            if (!L.next || L.next < t) L.next = t;
            while (L.next < t + 0.15) { if (amp > 0.02) click(L.next, amp, L.side = -(L.side || 1)); L.next += 1 / rate; }
          });
        },
        stop() {}
      };
    },
    // batimento binaural + una presencia que gira alrededor de la cabeza (detras suena mas oscura)
    binaural(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), f0 = 98 + rnd(30), d = 4 + rnd(4);
      const L = osc(c, 'sine', f0), R = osc(c, 'sine', f0 + d);
      L.connect(gain(c, 0.07, pan(c, -1, bus))); R.connect(gain(c, 0.07, pan(c, 1, bus)));
      const src = noiseSrc(A), bp = c.createBiquadFilter(), lp = c.createBiquadFilter(), p = pan(c, 0, bus), g = gain(c, 0.06, p);
      bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 2.5; lp.type = 'lowpass'; lp.frequency.value = 3000;
      src.connect(bp).connect(lp).connect(g);
      return {
        step(t) { const a = t * (Math.PI * 2 / (7 - stage)); p.pan.setTargetAtTime(Math.sin(a), t, 0.05); lp.frequency.setTargetAtTime(Math.cos(a) > 0 ? 4000 : 700, t, 0.3); },
        stop() { L.stop(); R.stop(); src.stop(); }
      };
    },
    // ilusion de octava (Deutsch): 400/800 Hz alternados entre oidos
    octave(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), L = osc(c, 'sine', 400), R = osc(c, 'sine', 800), gl = gain(c, 0.035, pan(c, -1, bus)), gr = gain(c, 0.035, pan(c, 1, bus));
      L.connect(gl); R.connect(gr);
      let next = 0, flip = false;
      return {
        step(t) {
          if (!next || next < t) next = t;
          while (next < t + 0.15) { flip = !flip; L.frequency.setValueAtTime(flip ? 800 : 400, next); R.frequency.setValueAtTime(flip ? 400 : 800, next); next += 0.25 - stage * 0.02; }
        },
        stop() { L.stop(); R.stop(); }
      };
    },
    // ilusion de escala (Deutsch): dos escalas cruzadas entre los oidos arman melodias que no existen
    scale(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), notes = [130.8, 138.6, 155.6, 174.6, 185, 207.7, 233.1, 261.6];   // frigio oscuro
      const up = notes, down = notes.slice().reverse();
      const L = osc(c, 'triangle', 130.8), R = osc(c, 'triangle', 261.6), gl = gain(c, 0, pan(c, -1, bus)), gr = gain(c, 0, pan(c, 1, bus));
      L.connect(gl); R.connect(gr);
      let next = 0, i = 0;
      return {
        step(t) {
          if (!next || next < t) next = t;
          const dur = 0.3 - stage * 0.03;
          while (next < t + 0.15) {
            const k = i % 8, even = i % 2 === 0;
            L.frequency.setValueAtTime(even ? up[k] : down[k], next); R.frequency.setValueAtTime(even ? down[k] : up[k], next);
            [gl, gr].forEach(g => { g.gain.setValueAtTime(0.0001, next); g.gain.exponentialRampToValueAtTime(0.06, next + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, next + dur * 0.9); });
            next += dur; i++;
          }
        },
        stop() { L.stop(); R.stop(); }
      };
    },
    // fundamental ausente: armonicos de un sol que no suena; el oido lo reconstruye
    missing(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), g0 = gain(c, 0.5, bus); let f0 = 41.2;
      const parts = [3, 4, 5, 6, 7, 8, 9].map(n => { const o = osc(c, 'sine', f0 * n); o.connect(gain(c, 0.05 / Math.sqrt(n), g0)); return { o, n }; });
      let drift = 0;
      return {
        step(t, dt) {
          drift += dt; g0.gain.setTargetAtTime(0.35 + Math.sin(drift * 0.4) * 0.25, t, 0.2);
          if (Math.random() < 0.004) { f0 = pick([36.7, 41.2, 43.7, 49]); parts.forEach(p => p.o.frequency.setTargetAtTime(f0 * p.n, t, 1.5)); }
        },
        stop() { parts.forEach(p => p.o.stop()); }
      };
    },
    // Doppler: algo enorme pasa por encima, de izquierda a derecha, cayendo de tono
    doppler(A, out, every) {
      const c = A.ctx, bus = gain(c, 1, out); let next = 0; const srcs = [];
      function flyover(t) {
        const d = 3 + rnd(2), f = 90 + rnd(120), dir = Math.random() < 0.5 ? 1 : -1;
        const o = c.createOscillator(), n = noiseSrc(A), lp = c.createBiquadFilter(), g = c.createGain(), p = c.createStereoPanner();
        o.type = 'sawtooth'; lp.type = 'lowpass';
        o.frequency.setValueAtTime(f * 1.14, t); o.frequency.setValueAtTime(f * 1.12, t + d * 0.42); o.frequency.exponentialRampToValueAtTime(f * 0.86, t + d * 0.58); o.frequency.setValueAtTime(f * 0.85, t + d);
        lp.frequency.setValueAtTime(300, t); lp.frequency.exponentialRampToValueAtTime(4500, t + d * 0.5); lp.frequency.exponentialRampToValueAtTime(400, t + d);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + d * 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        p.pan.setValueAtTime(-dir, t); p.pan.linearRampToValueAtTime(dir, t + d);
        const ng = gain(c, 0.4); n.connect(ng).connect(lp); o.connect(lp); lp.connect(g).connect(p).connect(bus);
        o.start(t); o.stop(t + d); n.stop(t + d); srcs.push(o);
      }
      return {
        step(t) { if (!next) next = t + 1; if (t >= next) { flyover(t); next = t + range(every || [7, 12]) / (0.6 + stage * 0.2); } },
        stop() {}
      };
    },
    // continuidad: un tono que "sigue" a traves de rafagas de ruido (en realidad se corta)
    continuity(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), o = osc(c, 'sine', 620), g = gain(c, 0.05, bus); o.connect(g);
      let next = 0;
      return {
        step(t) {
          o.frequency.setTargetAtTime(620 + Math.sin(t * 0.7) * 180, t, 0.05);
          if (!next || next < t) next = t;
          while (next < t + 0.15) {
            const s = c.createBufferSource(), ng = c.createGain(); s.buffer = A.noiseBuf; ng.gain.value = 0.25; s.connect(ng).connect(bus);
            s.start(next, rnd(1)); s.stop(next + 0.12); g.gain.setValueAtTime(0, next); g.gain.setValueAtTime(0.05, next + 0.12);
            next += 0.42 - stage * 0.04;
          }
        },
        stop() { o.stop(); }
      };
    },
    // paradoja del tritono: tonos de Shepard a un tritono de distancia; ¿sube o baja?
    tritone(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), env = gain(c, 0, bus), bank = [0, 1, 2, 3, 4, 5].map(() => { const o = osc(c, 'sine', 100); const g = gain(c, 0, env); o.connect(g); return { o, g }; });
      const pcs = [[32.7, 46.25], [36.7, 51.9], [41.2, 58.3], [43.7, 61.7]];   // C-F#, D-G#, E-A#, F-B
      let next = 0, n = 0, pair = pick(pcs);
      return {
        step(t) {
          if (!next || next < t) next = t;
          while (next < t + 0.15) {
            const pc = pair[n % 2];
            bank.forEach((b, k) => { const f = pc * Math.pow(2, k + 1), x = Math.log2(f / 260); b.o.frequency.setValueAtTime(f, next); b.g.gain.setValueAtTime(Math.exp(-x * x / 1.2) * 0.07, next); });
            env.gain.setValueAtTime(0.0001, next); env.gain.exponentialRampToValueAtTime(1, next + 0.03); env.gain.exponentialRampToValueAtTime(0.0001, next + 0.5);
            n++; next += n % 2 ? 0.55 : 0.9; if (n % 2 === 0 && Math.random() < 0.3) pair = pick(pcs);
          }
        },
        stop() { bank.forEach(b => b.o.stop()); }
      };
    },
    // tono de Zwicker: ruido con un hueco; al callarse, el oido oye un tono que no existe
    zwicker(A, out) {
      const c = A.ctx, bus = gain(c, 1, out), src = noiseSrc(A), lo = c.createBiquadFilter(), hi = c.createBiquadFilter(), g = gain(c, 0, bus);
      lo.type = 'lowpass'; lo.frequency.value = 2000; hi.type = 'highpass'; hi.frequency.value = 3400;
      src.connect(lo).connect(g); src.connect(hi).connect(g);
      let next = 0;
      return {
        step(t) { if (!next) next = t; if (t >= next) { g.gain.setValueAtTime(0.18, t); g.gain.setValueAtTime(0.18, t + 5); g.gain.linearRampToValueAtTime(0, t + 5.02); next = t + 8; } },
        stop() { src.stop(); }
      };
    }
  };
  // combinaciones
  function makeIllusion(name, A, out, wave) {
    switch (name) {
      case 'shepard-up': return ILLUSIONS.shepard(A, out, 1, 1, wave);
      case 'shepard-down': return ILLUSIONS.shepard(A, out, -1, 0.8, wave);
      case 'transit': return ILLUSIONS.shepard(A, out, 1, 4, 'square');
      case 'collapse': {
        const a = ILLUSIONS.shepard(A, out, 1, 3, 'sawtooth'), b = ILLUSIONS.doppler(A, out, [2, 4]), c = ILLUSIONS.risset(A, out);
        return { step: (t, dt) => { a.step(t, dt); b.step(t, dt); c.step(t, dt); }, stop: () => { a.stop(); b.stop(); c.stop(); } };
      }
      default: return (ILLUSIONS[name] || ILLUSIONS.missing)(A, out);
    }
  }

  // ================= La entidad (sonido base, que cambia de timbre y ritmo por escena) =================
  const A = {
    on: false, lastBeep: 0, snd: soundOf(null),
    lvl: { 1: 0.5, 2: 0.65, 3: 0.85, 4: 1 }, cut: { 1: 420, 2: 900, 3: 2200, 4: 5000 }, nz: { 1: 0.05, 2: 0.12, 3: 0.2, 4: 0.32 },
    spd: { 1: 0.018, 2: 0.03, 3: 0.055, 4: 0.12 }, beat: { 1: 1400, 2: 1000, 3: 700, 4: 430 }, screech: { 1: 0.04, 2: 0.1, 3: 0.2, 4: 0.4 },
    illLvl: { 1: 0.5, 2: 0.65, 3: 0.8, 4: 1 },
    init() {
      if (this.on) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const c = this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.on = true;
      const comp = c.createDynamicsCompressor();
      comp.threshold.value = -22; comp.knee.value = 4; comp.ratio.value = 14; comp.attack.value = 0.003; comp.release.value = 0.3;
      this.master = c.createGain(); this.master.gain.value = 0.0001; this.master.connect(comp).connect(c.destination);
      this.gate = c.createGain(); this.gate.gain.value = 1; this.gate.connect(this.master);   // 2.0: compuerta del estrobo
      this.swell = c.createGain(); this.swell.gain.value = 0.8; this.swell.connect(this.gate);
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.2; lfo.connect(lg).connect(this.swell.gain); lfo.start();
      this.lp = c.createBiquadFilter(); this.lp.type = 'lowpass'; this.lp.Q.value = 5; this.lp.frequency.value = this.cut[stage]; this.lp.connect(this.swell);
      // sub-grave con batimento
      const sg = c.createGain(); sg.gain.value = 0.5; sg.connect(this.swell);
      this.subs = [0, 0.9].map(d => { const o = osc(c, 'sine', 32 + d); o.connect(sg); return o; });
      // sub distorsionado
      const ws = c.createWaveShaper(), cv = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) cv[i] = Math.tanh((i / 512 - 1) * 6);
      ws.curve = cv;
      this.dsub = c.createGain(); this.dsub.gain.value = 0.08;
      this.dosc = osc(c, 'sawtooth', 64); this.dosc.connect(ws).connect(this.dsub).connect(this.lp);
      // coro de maquinas: cluster por un pasabanda lento (el acorde y el timbre cambian por escena)
      this.choirBP = c.createBiquadFilter(); this.choirBP.type = 'bandpass'; this.choirBP.Q.value = 6; this.choirBP.frequency.value = 300;
      this.choir = c.createGain(); this.choir.gain.value = 0.12; this.choirBP.connect(this.choir).connect(this.lp);
      this.choirOsc = [55, 77.78, 82.41, 110.4].map((f, i) => { const o = osc(c, 'sawtooth', f); o.detune.value = (i - 1.5) * 7; o.connect(this.choirBP); return o; });
      // cama de ruido que barre
      const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), dd = nb.getChannelData(0);
      for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
      this.noiseBuf = nb;
      const n = noiseSrc(this);
      this.bp = c.createBiquadFilter(); this.bp.type = 'bandpass'; this.bp.Q.value = 1.2;
      this.nG = c.createGain(); this.nG.gain.value = this.nz[stage];
      n.connect(this.bp).connect(this.nG).connect(this.lp);
      // bus de ilusiones: sin el pasabajos, para que se oigan claras
      this.illBus = gain(c, this.illLvl[stage], this.swell);
      this.last = c.currentTime; this.nextBeat = 0;
      this.timer = setInterval(() => this.step(), 50);
      this.setStage(stage, 3);
      this.setScene(scene);
    },
    setScene(f) {        // timbre, ritmo e ilusion propios de la escena, sobre la misma entidad
      this.snd = soundOf(f);
      if (!this.on) return;
      const c = this.ctx, t = c.currentTime, s = this.snd;
      this.subs.forEach((o, i) => o.frequency.setTargetAtTime(s.sub + i * 0.9, t, 1.5));
      this.dosc.frequency.setTargetAtTime(s.sub * 2, t, 1.5);
      this.choirOsc.forEach((o, i) => { o.type = s.wave; o.frequency.setTargetAtTime(s.chord[i], t, 2); });
      if (this.ill) {    // la ilusion anterior se desvanece
        const old = this.ill, g = gain(c, 1, this.illBus); old.out.disconnect(); old.out.connect(g);
        g.gain.setTargetAtTime(0, t, 0.5); setTimeout(() => { try { old.fx.stop(); } catch (e) {} g.disconnect(); }, 2500);
      }
      const out = gain(c, 0, this.illBus); out.gain.setTargetAtTime(1, t + 0.3, 0.8);
      this.ill = { out, fx: makeIllusion(s.ill, this, out, s.wave) };
    },
    step() {
      const c = this.ctx, t = c.currentTime, dt = t - this.last, s = this.snd; this.last = t;
      if (this.ill) this.ill.fx.step(t, dt);
      this.bp.frequency.setTargetAtTime(s.noise * (0.4 + (Math.sin(t * 0.21) + 1) * 0.5 * stage * 0.6), t, 0.2);
      this.choirBP.frequency.setTargetAtTime(200 + (Math.sin(t * 0.09) + 1) * 400 * stage, t, 0.5);
      if (t >= this.nextBeat) {   // latido con el patron de la escena
        const cyc = this.beat[stage] * s.beatMul / 1000;
        s.beat.forEach((o, i) => this.thump(t + o * cyc, i ? 0.55 : 1));
        this.nextBeat = t + cyc;
      }
      if (Math.random() < this.screech[stage] * 0.05) this.screech1();
    },
    thump(t, amp) {        // el latido de la entidad
      const c = this.ctx, o = c.createOscillator(), g = c.createGain(), f = 60 + this.snd.sub;
      o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(this.snd.sub + 6, t + 0.25);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7 * amp, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.42);
      setTimeout(pulse, Math.max(0, (t - c.currentTime) * 1000));
    },
    screech1() {     // chirrido metalico
      const c = this.ctx, t = c.currentTime, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), f0 = 1500 + Math.random() * 4000;
      s.buffer = this.noiseBuf; f.type = 'bandpass'; f.Q.value = 40;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f0 * (Math.random() < 0.5 ? 0.3 : 2.2), t + 0.9);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      s.connect(f).connect(g).connect(this.master); s.start(t, Math.random()); s.stop(t + 1.05);
    },
    beep() {         // error de cada pop-up (max. ~8 por segundo); el timbre sigue a la escena
      if (!this.on) return; const c = this.ctx, t = c.currentTime;
      if (t - this.lastBeep < 0.12) return; this.lastBeep = t;
      const base = this.snd.chord[3] * 8, g = c.createGain(); g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.11); g.connect(this.master);
      [[1, 'square'], [1.059, 'square'], [2, this.snd.wave]].forEach(([m, ty]) => { const o = c.createOscillator(); o.type = ty; o.frequency.value = base * m * (0.95 + Math.random() * 0.1); o.connect(g); o.start(t); o.stop(t + 0.12); });
    },
    tick() {         // 2.0 · clic de ruido cuando una ventana se desgarra al salir (a lo mucho ~14 por segundo)
      if (!this.on) return; const c = this.ctx, t = c.currentTime; if (t - (this.lastTick || 0) < 0.07) return; this.lastTick = t;
      const n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); n.buffer = this.noiseBuf;
      f.type = 'highpass'; f.frequency.value = 2500 + Math.random() * 4500;
      g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      n.connect(f).connect(g).connect(this.master); n.start(t, Math.random() * 1.5); n.stop(t + 0.06);
    },
    // 2.0 · el estrobo en sonido: cada cuadro es un pulso cuadrado aplastado + un clic de ruido; el tono depende del cuadro.
    // En los cuadros negros la entidad se calla (compuerta) y cae un golpe grave: imagen y sonido cortan juntos.
    strobe(plan, total) {
      if (!this.on) return; const c = this.ctx, t0 = c.currentTime + 0.01;
      const F = { white: 2400, red: 110, bars: 1320, mosaic: 660, bands: 220, word: 1760, none: 0, black: 0 };
      if (!this.crush) { const cv = new Float32Array(256); for (let j = 0; j < 256; j++) cv[j] = Math.round((j / 128 - 1) * 3) / 3; this.crush = c.createWaveShaper(); this.crush.curve = cv; this.crush.connect(this.master); }
      this.gate.gain.cancelScheduledValues(t0);
      plan.forEach((p, i) => {
        const t = t0 + p.at / 1000, d = p.len / 1000;
        this.gate.gain.setValueAtTime(p.kind === 'black' ? 0 : p.kind === 'none' ? 1 : 0.35, t);
        if (p.kind === 'black') {   // golpe grave seco
          const o = c.createOscillator(), g = c.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(34, t + d);
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.55, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.95);
          o.connect(g).connect(this.master); o.start(t); o.stop(t + d);
        } else if (F[p.kind]) {
          const o = c.createOscillator(), g = c.createGain(), f = F[p.kind] * (0.92 + Math.random() * 0.16);
          o.type = 'square'; o.frequency.setValueAtTime(f, t);
          if (p.kind === 'word') o.frequency.setValueAtTime(f * 0.5, t + d * 0.5);
          g.gain.setValueAtTime(i === 0 ? 0.5 : 0.26, t); g.gain.setValueAtTime(0.0001, t + d * 0.7);
          o.connect(g).connect(this.crush); o.start(t); o.stop(t + d);
        }
        if (p.kind !== 'none') {    // clic de corte
          const n = c.createBufferSource(), ng = c.createGain(); n.buffer = this.noiseBuf;
          ng.gain.setValueAtTime(i === 0 ? 0.6 : 0.3, t); ng.gain.setValueAtTime(0, t + 0.012);
          n.connect(ng).connect(this.master); n.start(t, Math.random() * 1.5); n.stop(t + 0.02);
        }
      });
      this.gate.gain.setValueAtTime(1, t0 + total / 1000);
    },
    burst(dur, laugh) {
      if (!this.on) return; const c = this.ctx, t = c.currentTime, n = Math.floor(c.sampleRate * dur);
      const b = c.createBuffer(1, n, c.sampleRate), dd = b.getChannelData(0);
      for (let i = 0; i < n; i++) dd[i] = Math.random() < 0.5 ? -1 : 1;
      const s = c.createBufferSource(), g = c.createGain(); s.buffer = b;
      g.gain.setValueAtTime(0.7, t); g.gain.linearRampToValueAtTime(0, t + dur);
      s.connect(g).connect(this.master); s.start(t); s.stop(t + dur);
      if (laugh) this.laugh();
    },
    laugh() {        // risa bitcrush (original del index)
      const c = this.ctx, cv = new Float32Array(100);
      for (let j = 0; j < 100; j++) cv[j] = Math.round((j * 2 / 100 - 1) * 16) / 16;
      const crush = c.createWaveShaper(); crush.curve = cv; crush.connect(this.master);
      let t = c.currentTime;
      for (let i = 0; i < 8; i++) {
        const k = Math.random(), dur = 0.03 + k * 0.08, p = 1200 + k * 1000 + i * 40;
        const o = c.createOscillator(), fm = c.createOscillator(), fg = c.createGain(), m = c.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(p, t); o.frequency.linearRampToValueAtTime(p + Math.random() * 1500 - 750, t + dur);
        fm.type = 'square'; fm.frequency.value = p * (1.2 + k); fg.gain.value = 2000 + k * 3000; fm.connect(fg).connect(o.frequency);
        m.gain.setValueAtTime(0.001, t); m.gain.linearRampToValueAtTime(0.6, t + 0.01); m.gain.linearRampToValueAtTime(0.001, t + dur);
        o.connect(m).connect(crush); [o, fm].forEach(x => { x.start(t); x.stop(t + dur); });
        t += (0.15 - i * 0.007) + k * 0.04;
      }
    },
    setStage(s, ramp = 1.5) {
      if (!this.on) return; const t = this.ctx.currentTime;
      this.master.gain.setTargetAtTime(this.lvl[s] * 0.5, t, ramp * 0.8);
      this.lp.frequency.setTargetAtTime(this.cut[s], t, ramp);
      this.nG.gain.setTargetAtTime(this.nz[s], t, ramp);
      this.dsub.gain.setTargetAtTime(0.05 + s * 0.04, t, ramp);
      this.choir.gain.setTargetAtTime(0.08 + s * 0.04, t, ramp);
      this.illBus.gain.setTargetAtTime(this.illLvl[s], t, ramp);
    },
    kill() { if (!this.on) return; const t = this.ctx.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setValueAtTime(0, t); clearInterval(this.timer); },
    // linea plana: el tono continuo de un monitor cuando el pulso se detiene
    flatline(d = 4) {
      if (!this.on) return; const c = this.ctx, t = c.currentTime, o = osc(c, 'sine', 1000), g = gain(c, 0, c.destination);
      o.connect(g); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.02);
      g.gain.setValueAtTime(0.12, t + d); g.gain.linearRampToValueAtTime(0, t + d + 0.05); o.stop(t + d + 0.1);
    },
    // despues del colapso: solo un latido lejano. La entidad ya esta adentro.
    afterlife(bpm = 48) {
      if (!this.on) return () => {};
      const c = this.ctx, out = gain(c, 0, c.destination); out.gain.setTargetAtTime(0.5, c.currentTime, 2);
      let alive = true;
      const beat = () => {
        if (!alive) return;
        const t = c.currentTime;
        [0, 0.28].forEach((o, i) => {
          const osc = c.createOscillator(), g = c.createGain();
          osc.frequency.setValueAtTime(70, t + o); osc.frequency.exponentialRampToValueAtTime(34, t + o + 0.3);
          g.gain.setValueAtTime(0.0001, t + o); g.gain.exponentialRampToValueAtTime(i ? 0.25 : 0.45, t + o + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + o + 0.45);
          osc.connect(g).connect(out); osc.start(t + o); osc.stop(t + o + 0.5);
        });
        setTimeout(beat, 60000 / bpm);
      };
      beat();
      return { stop() { alive = false; out.gain.setTargetAtTime(0, c.currentTime, 0.8); }, tempo(b) { bpm = b; } };
    }
  };

  // ================= DOM =================
  const $ = id => document.getElementById(id);
  function el(tag, id, cls, parent) { const e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; (parent || document.body).appendChild(e); return e; }
  function ensureDom() {
    if (!IS_FRAME && !$('dk-bleed')) { el('div', 'dk-bleed', 'dk-layer'); const b = el('div', 'dk-bands', 'dk-layer'); for (let i = 0; i < 3; i++) el('i', null, null, b); }
    if (!$('dk-drop')) el('div', 'dk-drop', 'dk-layer');
    if (EMBEDDED) return;
    if (!$('dk-pop')) { const p = el('div', 'dk-pop'); p.style.top = TOP + 'px'; }
    if (!$('dk-sub')) el('div', 'dk-sub');
    if (!$('dk-scan')) { const s = el('div', 'dk-scan'); s.innerHTML = '<span>SCANNING OBSERVER</span><i></i><i></i>'; }
    if (!$('dk-strobe')) { const c = el('canvas', 'dk-strobe'); c.width = STROBE.w; c.height = STROBE.h; }
  }

  // latido visual (sangrado rojo)
  function pulse() {
    const b = $('dk-bleed'); if (!b) return;
    b.style.transition = 'none'; b.style.opacity = 0.75;
    requestAnimationFrame(() => { b.style.transition = 'opacity .5s ease-out'; b.style.opacity = 0.3; });
  }
  // bandas de interferencia: saltan y parpadean en su lugar (no barren)
  function bands() {
    const b = $('dk-bands'); if (!b) return;
    [...b.children].forEach(i => { const on = Math.random() < 0.25 + stage * 0.1; i.style.top = rnd(100) + '%'; i.style.opacity = on ? 0.4 + rnd(0.6) : 0; });
  }

  // ================= 2.0 · Contenido propio de cada escena para las ventanas =================
  // Antes las preguntas, las extracciones, los botones y los titulos decian lo mismo en todas las escenas. Ahora cada una trae los suyos,
  // mas ventanas que solo existen ahi: medidores, tablas, formularios que se llenan solos, avisos breves y una simulacion en ASCII.
  // ok: botones de alerta · btn: par de botones de las preguntas · count: rotulo de la cuenta regresiva · sim: simulacion · table/row: registro
  // q: preguntas · x: lo que se extrae · follow: frases de la ventana que persigue el cursor · titles: titulos · meters · form · toast
  const POPX = {
    'G6-INTROc.html': { ok: ['ALIGN', 'SIGN'], btn: ['SIGN', 'SIGN'], count: 'GATE CLOSES IN', sim: 'ports', table: 'INDUCTION QUEUE',
      q: ['SIGN THE INDUCTION LOG?', 'ASSIGN YOUR UNIT ID NOW?', 'ROUTE COGNITIVE SURPLUS TO THE CORE?', 'ACCEPT THE BINDING AGREEMENT?', 'CONNECT ASSET [OUT] TO SYSTEM [IN]?'],
      x: ['SIGNATURE', 'UNIT ID', 'COGNITIVE SURPLUS', 'BEHAVIORAL YIELD', 'IMPLIED CONSENT', 'HANDWRITING', 'THE LABEL YOU TYPED'],
      follow: ['HOLD THE CABLE', 'OUT GOES TO IN', 'YOUR HAND IS A PORT', 'CONNECT IT'], titles: ['INDUCTION_QUEUE', 'ASSET_ALIGNMENT', 'PORT_MAP', 'DEBT_LEDGER'],
      meters: ['ALIGNMENT', 'RETINAL CAPTURE', 'COGNITIVE SURPLUS', 'DEBT'], row: () => 'ASSET #' + num(100000, 999999) + '|' + pick(['QUEUED', 'ALIGNED', 'INDUCTED', 'ROUTED']),
      form: [['UNIT_ID', () => '0x' + hex(6)], ['ORIGIN', () => 'THIS DEVICE'], ['CONSENT', () => 'IMPLIED'], ['DEBT', () => num(1000, 99999) + ' CR']],
      toast: ['ASSET ACCEPTED', 'PORT LOCKED', 'LINK EXTRACTED', 'YOU WERE EXPECTED', 'GATE OPEN FROM OUR SIDE'] },
    'g1_a2.html': { ok: ['HOLD STILL', 'STAY IN FRAME'], btn: ['HOLD STILL', 'HOLD STILL'], count: 'TARGET LOCK IN', sim: 'radar', table: 'TRACKED ANOMALIES',
      q: ['KEEP YOUR SEAT IN FOCUS?', 'ALLOW DEEP SCAN OF THIS ROOM?', 'SHARE YOUR RETINA WITH LENS 04?', 'CONFIRM YOU ARE ANOMALY 7?', 'LET THE SWEEP FINISH?'],
      x: ['RETINA MAP', 'SEAT POSITION', 'HEARTBEAT', 'FACE AT 11 ANGLES', 'SHADOW', 'BLINK RATE', 'BACK OF YOUR NECK'],
      follow: ['AZIMUTH LOCKED ON YOU', 'WE SEE YOUR HAND', 'TARGET FOLLOWS CURSOR', 'DO NOT TURN AROUND'], titles: ['SWEEP_LOG', 'ANOMALY_TRACK', 'AZIMUTH', 'DEEP_SCAN'],
      meters: ['GAIN dB', 'FOCUS', 'BIOSIGNAL', 'RANGE'], row: () => 'Ω-' + String(int(1, 99)).padStart(2, '0') + '|' + pick(['CRITICAL', 'LOCKED', 'PANIC', 'LOST', 'YOU']),
      form: [['SEAT', () => pick('ABCDEFGH') + int(1, 24)], ['AZIMUTH', () => int(0, 359) + '°'], ['DISTANCE', () => (rnd(9) + 0.3).toFixed(2) + ' M'], ['THREAT', () => 'OBSERVER']],
      toast: ['SWEEP COMPLETE', 'TARGET ACQUIRED', 'NEW ANOMALY BEHIND YOU', 'FACE MATCHED', 'NO BLIND SPOT LEFT'] },
    'g2_d.html': { ok: ['ITERATE', 'SEED'], btn: ['SEED', 'SEED'], count: 'NEXT GENERATION IN', sim: 'life', table: 'PATTERN INDEX',
      q: ['WRITE ONE MORE NEIGHBORHOOD?', 'RAISE THE CLOCK MULTIPLIER?', 'OVERWRITE NON-RESPONSIVE PATTERNS?', 'CONFIRM NO CARBON IN SAMPLE?', 'LET THE RULE DECIDE?'],
      x: ['STILL LIFES', 'GLIDERS', 'LIVE BITS', 'NEIGHBOR COUNT', 'ANCESTOR PAGES', 'ATTENTION SUBSTRATE', 'THE ORIGINAL'],
      follow: ['EVERY CLICK WRITES CELLS', 'SEED HERE', 'THE CURSOR IS A WRITE HEAD', 'B3 / S23'], titles: ['RULE_B3S23', 'LATTICE', 'GENERATION', 'BITFLIP_PASS'],
      meters: ['CLOCK ×', 'DIE TEMP', 'RULE PRESSURE', 'BIT-FLIPS'], row: () => pick(['GLIDER_', 'BLOCK_', 'BLINKER_', 'PATCH_']) + hex(3) + '|' + pick(['STILL', 'OSCILLATING', 'SPREADING', 'ZEROED', 'COPIED']),
      form: [['LATTICE', () => int(1, 99)], ['RULE', () => 'B3/S23'], ['CARBON', () => 'NONE'], ['LIVE BITS', () => num(1000, 999999)]],
      toast: ['GENERATION +1', 'PATTERN HALTED', 'COPY NEEDS NO BODY', 'NO CARBON DETECTED', 'CLOCK DOUBLED'] },
    'maze4.html': { ok: ['PAY', 'KEEP WALKING'], btn: ['PAY', 'PAY'], count: 'MAZE MUTATES IN', sim: 'maze', table: 'INVESTMENT LEDGER',
      q: ['INVEST IN THIS MONOLITH?', 'PAY INTEREST ON EACH STEP?', 'ACCEPT THE MAP AS YOUR PORTRAIT?', 'TURN LEFT AGAIN?', 'EXTEND YOUR CREDIT?'],
      x: ['FOOTSTEPS', 'CREDIT', 'SENSE OF DIRECTION', 'THE WAY BACK', 'INTEREST', 'YOUR ROUTE', 'ONE MORE CORRIDOR'],
      follow: ['WE KNOW WHERE YOU WILL STOP', 'THE WALL LISTENS', 'CLICK TO INVEST', 'DEAD END AHEAD'], titles: ['CREDIT_LEDGER', 'CORRIDOR', 'MONOLITH_PROBE', 'DEAD_END'],
      meters: ['CREDIT', 'INTEREST', 'DISCOMFORT', 'RETURN'], row: () => 'CORRIDOR ' + int(1, 9999) + '|-' + (rnd(90) + 1).toFixed(2) + ' CR',
      form: [['INVESTOR', () => 'UNIT 0x' + hex()], ['AMOUNT', () => num(1, 9000) + ' CR'], ['RETURN', () => '0.00'], ['COLLATERAL', () => 'FLESH']],
      toast: ['CREDIT DENIED', 'INTEREST COLLECTED', 'CORRIDOR ADDED', 'RETURN: 0.00', 'THE MAZE MOVED'] },
    'g4_d.html': { ok: ['SHARE', 'CARRY IT'], btn: ['SHARE', 'SHARE'], count: 'NEXT HOST IN', sim: 'net', table: 'HOST REGISTRY',
      q: ['PASS IT ON TO YOUR CONTACTS?', 'REPOST THE SYMPTOM?', 'ALLOW THE ROOT TO GO DEEPER?', 'CONFIRM YOU FEEL FINE?', 'INJECT ONE MORE MIND?'],
      x: ['IMMUNITY', 'DOUBT', 'INDEPENDENT THOUGHT', 'CONTACT LIST', 'RESISTANCE', 'YOUR OPINION', 'THE CURE'],
      follow: ['HOLD TO DETONATE', 'EVERY MIND IS A HOST', 'THE VECTOR IS YOUR HAND', 'CLICK TO INJECT'], titles: ['CONTAGION_MAP', 'HOST', 'R0_ESTIMATE', 'PATIENT_ZERO'],
      meters: ['R0', 'ASSIMILATED', 'FEVER', 'ROOT DEPTH'], row: () => 'MIND_0x' + hex(3) + '|' + pick(['CLEAN', 'INCUBATING', 'SHEDDING', 'ASSIMILATED']) + ' ' + int(0, 100) + '%',
      form: [['HOST', () => 'MIND_0x' + hex()], ['VECTOR', () => pick(['NOTIFICATION', 'REPOST', 'FIRMWARE'])], ['SYMPTOM', () => 'CERTAINTY'], ['IMMUNITY', () => 'NOT IN BUILD']],
      toast: ['NEW HOST', 'THRESHOLD CROSSED', 'PACKET DELIVERED', 'SYMPTOM: YOU FEEL FINE', 'IT IS IN YOU'] },
    'g5_b.html': { ok: ['KEEP WATCHING', 'STAY'], btn: ['STAY', 'STAY'], count: 'NEXT COPY IN', sim: 'bricks', table: 'BRICK MANIFEST',
      q: ['ADD YOUR FACE TO THE WALL?', 'KEEP THE FIRE FED?', 'ACCEPT THE SHADOW AS REAL?', 'STAY SEATED?', 'COPY YOUR REFLECTION AGAIN?'],
      x: ['YOUR FACE', 'ONE SECOND OF ATTENTION', 'REFLECTION', 'THE OUTSIDE', 'SUNLIGHT', 'A BRICK', 'YOUR OUTLINE'],
      follow: ['FACE THE WALL', 'THE FIRE IS BEHIND YOU', 'CLICK TO ISOLATE NOISE', 'DO NOT LEAVE'], titles: ['MURAL', 'SHADOW_FEED', 'BRICK', 'PROJECTION'],
      meters: ['ATTENTION DRAIN', 'BRICKS', 'ILLUSION', 'REALITY INDEX'], row: () => 'BRICK 0x' + hex(6) + '|' + pick(['EXTRACTING', 'COPIED', 'PASTED', 'STACKED']),
      form: [['OBJECT_ID', () => '0x' + hex(6)], ['SOURCE', () => 'YOUR CAMERA'], ['COPIES', () => num(2, 99999)], ['ORIGINAL', () => 'DELETED']],
      toast: ['FACE COPIED', 'BRICK ADDED', 'SHADOW LATENCY 12 MS', 'OUTSIDE NOT UPDATED', 'KEEP SCROLLING'] },
    'g7_F.html': { ok: ['COMPLY', 'REPORT'], btn: ['REPORT', 'CONFESS'], count: 'DOCILITY CHECK IN', sim: 'census', table: 'CITIZEN REGISTER',
      q: ['REPORT YOUR NEIGHBOR?', 'CONFIRM YOU HAVE NOTHING TO HIDE?', 'SUBMIT OR DELETE THIS CITIZEN?', 'WATCH YOURSELF FOR US?', 'DECLARE YOUR STATUS?'],
      x: ['BIOMETRIC RECORD', 'DOSSIER', 'ALIBI', 'NEIGHBOR LIST', 'AGENCY', 'PRIVATE THOUGHT', 'YOUR FILE'],
      follow: ['CLICK A CITIZEN', 'THE TOWER SEES THE CURSOR', 'STAND IN LINE', 'IDLE HANDS ARE FLAGGED'], titles: ['REGISTER', 'DOSSIER', 'SECTOR_SCAN', 'DOCILITY'],
      meters: ['DOCILITY', 'DEVIANTS', 'SELF-SURVEILLANCE', 'SECTORS'], row: () => 'CITIZEN_' + hex(6) + '|' + pick(['DOCILE', 'DEVIANT', 'PENDING', 'PURGED', 'COMPOSTED']),
      form: [['CITIZEN_ID', () => hex(6)], ['STATUS', () => pick(['DOCILE', 'DEVIANT', 'PENDING'])], ['SECTOR', () => '[' + int(0, 99) + ',' + int(0, 99) + ']'], ['REPORTED BY', () => 'YOUR NEIGHBOR']],
      toast: ['CITIZEN FILED', 'NEIGHBOR FLAGGED', 'SECTOR SCANNED', 'NEXT CITIZEN', 'RECORD INTERCEPTED'] },
    'not_C.html': { ok: ['(NOT) OK', 'OK (NOT)'], btn: ['YES', '(NOT) NO'], count: '(NOT) ENDING IN', sim: 'not', table: 'TRUTH TABLE',
      q: ['ARE YOU (NOT) STILL HERE?', 'IS THIS (NOT) REAL?', 'DO YOU (NOT) AGREE?', 'WILL YOU (NOT) BE REMEMBERED?', 'IS THE SIGNAL (NOT) OVER?'],
      x: ['CERTAINTY', 'THE WORD YES', 'IDENTITY', 'A TRUE STATEMENT', 'YOUR NAME', 'THE OPPOSITE', 'MEANING'],
      follow: ['THIS IS (NOT) YOUR HAND', '(NOT) HERE', 'YOU DID (NOT) MOVE', '(NOT) A CURSOR'], titles: ['NEGATION', 'NULL', 'INVERSE', 'TRUTH_TABLE'],
      meters: ['ENTROPY', 'CERTAINTY', '(NOT) COUNT', 'INERTIA'], row: () => pick(['YOU ARE', 'THIS IS', 'WE ARE', 'IT WAS']) + ' ' + pick(['REAL', 'SAFE', 'ALONE', 'OVER']) + '|' + pick(['(NOT)', 'NULL', 'TRUE?', '(NOT) FALSE']),
      form: [['STATEMENT', () => 'YOU ARE HERE'], ['NEGATED', () => 'YOU ARE (NOT) HERE'], ['VALUE', () => 'NULL'], ['SPEAKER', () => '(NOT) YOU']],
      toast: ['(NOT) SAVED', 'STATEMENT INVERTED', 'NULL RETURNED', 'YES (NOT)', 'UNSAID'] },
    'g8_b.html': { ok: ['ACCEPT', 'CONTINUE'], btn: ['ACCEPT', 'ACCEPT ALL'], count: 'AUTOPLAY IN', sim: 'branch', table: 'BRANCH LEDGER',
      q: ['CONTINUE WATCHING?', 'RENEW AUTOMATICALLY?', 'LET THE MODEL DECIDE?', 'ALLOW NOTIFICATIONS?', 'REPEAT YESTERDAY?'],
      x: ['NEXT YEAR', 'AN UNPROFITABLE FUTURE', 'YOUR PREFERENCE', 'A PRUNED BRANCH', 'THE EXIT OPTION', 'FREE TIME', 'TOMORROW'],
      follow: ['YOUR INPUT IS A PREFERENCE', 'RECOMMENDED FOR YOU', 'THE MODEL MOVED FIRST', 'CHOOSE'], titles: ['FORECAST', 'BRANCH', 'CACHE', 'PRUNE_LOG'],
      meters: ['PREDICTION ACCURACY', 'DOPAMINE', 'FEED LATENCY', 'CYCLES LEFT'], row: () => 'FUTURE_0x' + hex(3) + '|' + pick(['PRUNED', 'EXECUTED', 'NOT RENDERED', 'SOLD', 'ROLLED BACK']),
      form: [['INPUT', () => pick(['A', 'B', 'C'])], ['LOGGED AS', () => 'PREFERENCE'], ['EXECUTED', () => pick(['A', 'B', 'C'])], ['P', () => '.' + int(90, 99)]],
      toast: ['AUTOPLAY NEXT IN 3', 'RENEWED AUTOMATICALLY', 'MADE FOR YOU', 'BRANCH PRUNED', 'NEXT YEAR IS IN CACHE', 'STILL WATCHING?'] },
    'copyof_11.html': { ok: ['WORK', 'GIVE MORE'], btn: ['CHARGE', 'CHARGE'], count: 'NEXT SHIFT IN', sim: 'battery', table: 'CELL ARRAY',
      q: ['DONATE YOUR EXHAUSTION?', 'KEEP TIME FOR THE ENGINE?', 'RENDER ONE MORE PASS?', 'SKIP YOUR BREAK?', 'SELL THE COPY BACK TO YOURSELF?'],
      x: ['PULSE', 'BODY HEAT', 'OVERTIME', 'SLEEP', 'A COPY OF A COPY', 'FIDELITY', 'THE ORIGINAL'],
      follow: ['FASTER HANDS', 'YOUR PULSE KEEPS TIME', 'DO NOT STOP', 'OUTPUT'], titles: ['RENDER_PASS', 'CELL', 'CHARGE', 'COPY_GEN'],
      meters: ['CHARGE', 'PULSE BPM', 'ENGINE RPM', 'FIDELITY'], row: () => 'CELL ' + num(1, 8000000) + '|' + pick(['CHARGING', 'DRAINED', 'HOT', 'REPLACED']) + ' ' + int(1, 99) + '%',
      form: [['CELL', () => num(1, 8000000)], ['SHIFT', () => int(1, 3)], ['OUTPUT', () => num(1000, 90000) + ' RPM'], ['REST', () => 'DENIED']],
      toast: ['PASS COMPLETE', 'BATTERY LOW', 'COPY DEGRADED', 'SHIFT EXTENDED', 'UPTIME EXCELLENT'] },
    'out2.html': { ok: ['END', 'NOW'], btn: ['END', 'END'], count: 'COLLAPSE IN', sim: 'noise', table: 'SIGNAL DUMP',
      q: ['CONVERGE ALL SIGNALS?', 'OVERFLOW THE BUFFER?', 'EXCEED LIFESPAN?', 'DROP THE LAST FRAME?'], x: ['THE LAST FRAME', 'ALL SIGNALS', 'LIFESPAN', 'THE BUFFER', 'SPECIES'],
      follow: ['TOO FAST', 'NO SIGNAL', 'OVERFLOW', 'ZERO'], titles: ['OVERFLOW', 'FRAME', 'VOID', 'CONVERGE'], meters: ['FRAME RATE', 'LIFE', 'OVERFLOW', 'SIGNAL'],
      row: () => 'FRAME ' + num(1, 9999999) + '|' + pick(['DROPPED', 'LOST', 'OVERFLOW', 'NULL']),
      form: [['BUFFER', () => 'SPECIES'], ['STATE', () => 'OVERFLOW'], ['FRAME', () => num(1, 9999999)], ['LIFE', () => '-' + pct() + '%']],
      toast: ['FRAME DROPPED', 'ALL AT ONCE', 'NO SIGNAL', 'BUFFER OVERFLOW', 'ZERO'] }
  };
  const POPX_DEF = { ok: ['OK'], btn: ['YES', 'YES'], count: 'CERTAINTY DELETION IN', sim: 'noise', table: 'RELAY TABLE', q: QUESTIONS, x: EXTRACT,
    follow: ['THE CURSOR IS OURS', 'YOUR HAND IS LAGGING BEHIND OURS', 'WE MOVE FIRST', 'POINTER SEIZED'], titles: ['INTRUSION', 'RELAY', 'CARRIER'], meters: ['SIGNAL', 'LOSS', 'NOISE', 'LOAD'],
    row: () => 'HOP ' + int(1, 99) + '|' + pick(['RELAYED', 'LOST', 'RETRY']),
    form: [['PACKET', () => '0x' + hex(6)], ['HOP', () => int(1, 9)], ['LOSS', () => pct() + '%'], ['ROUTE', () => 'UNKNOWN']],
    toast: ['RELAY HOP', 'NO CARRIER', 'RETRY', 'HANDOFF', 'IN TRANSIT'] };
  const px = () => POPX[scene] || POPX_DEF;

  // simulaciones en ASCII, una por escena: cada llamada entrega el siguiente cuadro
  const SIMS = {
    life() {      // el automata de la pieza, en chico
      const W = 26, H = 9; let g = Array.from({ length: W * H }, () => Math.random() < 0.38), gen = 0;
      return () => {
        g = g.map((v, k) => { const x = k % W, y = (k / W) | 0; let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) c += g[((y + dy + H) % H) * W + (x + dx + W) % W] ? 1 : 0; return v ? c === 2 || c === 3 : c === 3; });
        gen++; if (!g.some(Boolean) || gen % 60 === 0) g = g.map(() => Math.random() < 0.35);
        let s = ''; for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) s += g[y * W + x] ? '█' : '·'; s += '\n'; }
        return s + 'GEN ' + String(gen).padStart(4, '0') + ' · LIVE ' + g.filter(Boolean).length + ' · B3/S23';
      };
    },
    radar() {     // barrido con blancos
      let a = 0; const W = 27, H = 11, cx = 13, cy = 5, blips = Array.from({ length: 4 }, () => [int(2, 24), int(1, 9)]);
      return () => {
        a += 0.35; const rows = [];
        for (let y = 0; y < H; y++) { let r = ''; for (let x = 0; x < W; x++) {
          const dx = (x - cx) / 2.4, dy = y - cy, d = Math.hypot(dx, dy), da = Math.abs(((Math.atan2(dy, dx) - a) % 6.2832 + 9.4248) % 6.2832 - 3.1416);
          r += blips.some(b => b[0] === x && b[1] === y) ? (da < 0.5 ? '◆' : '+') : d < 0.5 ? '⊕' : da < 0.16 && d < 5.2 ? '░' : Math.abs(d - 5) < 0.35 || Math.abs(d - 2.6) < 0.25 ? '·' : ' ';
        } rows.push(r); }
        return rows.join('\n') + '\nAZ ' + String(Math.round((a * 57.3) % 360)).padStart(3, '0') + '° · ' + blips.length + ' ANOMALIES';
      };
    },
    maze() {      // alguien camina y deja rastro; el credito baja
      const W = 25, H = 9, m = Array.from({ length: W * H }, (_, k) => (k % W % 2 === 0 && ((k / W) | 0) % 2 === 0 ? 0 : Math.random() < 0.34 ? 1 : 0)), trail = new Set(); let mx = 0, my = 0, steps = 0, cr = 100;
      return () => {
        for (let t = 0; t < 2; t++) { const d = pick([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 0], [0, 1]]), nx = mx + d[0], ny = my + d[1]; if (nx >= 0 && ny >= 0 && nx < W && ny < H && !m[ny * W + nx]) { trail.add(my * W + mx); mx = nx; my = ny; steps++; cr -= 0.37; } }
        let s = ''; for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) s += x === mx && y === my ? '@' : m[y * W + x] ? '▓' : trail.has(y * W + x) ? '·' : ' '; s += '\n'; }
        return s + 'STEPS ' + steps + ' · CREDIT ' + cr.toFixed(2) + ' · EXIT: NONE';
      };
    },
    net() {       // la red se contagia nodo a nodo
      const W = 13, H = 5, inf = new Set([int(0, W * H - 1)]);
      return () => {
        const add = []; inf.forEach(k => { if (Math.random() < 0.3) { const d = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), nx = k % W + d[0], ny = ((k / W) | 0) + d[1]; if (nx >= 0 && ny >= 0 && nx < W && ny < H) add.push(ny * W + nx); } });
        add.forEach(k => inf.add(k)); if (inf.size >= W * H) { inf.clear(); inf.add(int(0, W * H - 1)); }
        let s = ''; for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) s += (inf.has(y * W + x) ? '#' : 'o') + (x < W - 1 ? '-' : ''); s += '\n'; if (y < H - 1) s += '| '.repeat(W).trimEnd() + '\n'; }
        return s + 'HOSTS ' + inf.size + '/' + W * H + ' · R0 ' + (2 + inf.size / 9).toFixed(1);
      };
    },
    bricks() {    // el muro se levanta ladrillo a ladrillo
      const W = 9, H = 6; let n = 0;
      return () => {
        n = (n + 1) % (W * H + 6); let s = '';
        for (let y = 0; y < H; y++) { let r = y % 2 ? ' ' : ''; for (let x = 0; x < W; x++) { const k = (H - 1 - y) * W + x; r += k < n ? (k === n - 1 ? '▓▓ ' : '▒▒ ') : '   '; } s += r + '\n'; }
        return s + 'BRICKS ' + String(Math.min(n, W * H)).padStart(3, '0') + ' · EACH ONE A SECOND OF YOU';
      };
    },
    census() {    // una columna recorre la reticula y aplaca a los desviados
      const W = 24, H = 7, g = Array.from({ length: W * H }, () => Math.random() < 0.08); let col = 0;
      return () => {
        col = (col + int(1, 5)) % W; for (let i = 0; i < 2; i++) g[int(0, W * H - 1)] = Math.random() < 0.3;
        for (let y = 0; y < H; y++) if (g[y * W + col] && Math.random() < 0.6) g[y * W + col] = false;
        let s = ''; for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) s += x === col ? (g[y * W + x] ? '!' : '|') : g[y * W + x] ? '#' : '·'; s += '\n'; }
        const d = g.filter(Boolean).length; return s + 'DEVIANTS ' + d + ' · DOCILITY ' + (100 - d / (W * H) * 100).toFixed(1) + '%';
      };
    },
    not() {       // cada enunciado recibe su (NOT)
      const S = ['YOU ARE HERE', 'THIS IS REAL', 'WE ARE GONE', 'IT IS OVER', 'YOU ARE AWAKE', 'THIS IS YOURS'], rows = []; let i = 0;
      return () => {
        i++; if (i % 2) rows.push(pick(S)); else { const s = rows[rows.length - 1], p = s.indexOf(' ', s.indexOf(' ') + 1); rows[rows.length - 1] = s.slice(0, p) + ' (NOT)' + s.slice(p); }
        if (rows.length > 7) rows.shift();
        return rows.map((r, k) => (k % 2 ? '    ' : '') + r).join('\n') + '\n' + '(NOT) '.repeat(1 + i % 4);
      };
    },
    branch() {    // tres futuros por ciclo: uno se ejecuta, dos se podan
      const rows = []; let c = 13;
      return () => {
        if (c <= 0) { rows.length = 0; c = 13; } const k = int(0, 2);
        rows.push(String(c).padStart(2, '0') + ' ' + ['A', 'B', 'C'].map((l, j) => (j === k ? '[' + l + ']══►' : ' ' + l + ' ──x ')).join(' ') + ' P.' + int(90, 99)); c--;
        if (rows.length > 7) rows.shift();
        return rows.join('\n') + '\nPRUNED ' + (13 - c) * 2 + ' · EXECUTED ' + (13 - c);
      };
    },
    battery() {   // la celda se descarga y se recarga sola
      let v = 100, t = 0;
      return () => {
        t++; v = v <= 3 ? 100 : v - rnd(4); const n = Math.max(0, Math.round(v / 5));
        return '┌────────────────────┐\n│' + '█'.repeat(n) + '·'.repeat(20 - n) + '│▌\n└────────────────────┘\nCHARGE ' + v.toFixed(1) + '%  ' + '_'.repeat(t % 9) + (t % 6 === 0 ? '▲' : '_') + '_'.repeat(8 - t % 9) + '\nPULSE ' + int(50, 160) + ' BPM → ENGINE ' + num(1000, 90000) + ' RPM';
      };
    },
    ports() {     // paquetes de OUT a IN
      let t = 0;
      return () => {
        t++; let s = '';
        for (let i = 0; i < 3; i++) { const p = (t * (i + 2)) % 18, j = (i + ((t / 14) | 0)) % 3; s += 'OUT_' + i + ' ' + '═'.repeat(p) + '►' + '·'.repeat(17 - p) + ' IN_' + j + '\n'; }
        return s + 'LINKS ' + (((t / 14) | 0) % 4) + '/3 · ASSET ' + (t % 28 < 14 ? 'ROUTING' : 'EXTRACTED');
      };
    },
    noise() { return () => { let s = ''; for (let y = 0; y < 6; y++) { for (let x = 0; x < 26; x++) s += pick(GLYPHS); s += '\n'; } return s + 'SIGNAL ' + pct() + '% · LOSS ' + pct() + '%'; }; }
  };

  // ================= Visita a una escena: tiempo y personalidad =================
  let visit = makeVisit(scene);
  function makeVisit(f) {
    const st = styleOf(f);
    return {
      st, cycle: 0, start: performance.now(), satAt: range(st.satAt || [30, 45]) * 1000, satLen: range([25, 40]) * 1000, drainLen: range([4000, 7000]),
      quiet: range([2500, 6000]), simpleMax: int(2, 3), tempo: 0.7 + rnd(0.6),
      moves: subset(st.moves), places: subset(st.places), cascades: subset(st.cascades), sizes: subset(st.sizes), colors: subset(st.colors), hit: false, colY: 0, col: null,
      flood: false, floodEnd: 0, openUntil: 0   // 2.0: oleada en curso, cuando debe terminar y hasta cuando la pieza queda a la vista
    };
  }
  // calma -> simples -> rampa -> saturacion -> (escenas largas) vaciado y otra vuelta, mas corta
  function phase() {
    const e = performance.now() - visit.start;
    if (visit.cycle === 0 && e < visit.quiet) return 'quiet';
    if (e < visit.satAt - 8000) return 'simple';
    if (e < visit.satAt) return 'build';
    if (e < visit.satAt + visit.satLen) return 'sat';
    return 'drain';
  }
  function clearPops(glitch) {   // lienzo limpio (con glitch: cada ventana sale desgarrada, una tras otra)
    const box = $('dk-pop'); if (!box) return;
    if (!glitch) { box.innerHTML = ''; jsMovers = 0; return; }
    [...box.children].forEach((w, i) => setTimeout(() => close(w, false), i * 14));
    setTimeout(() => { jsMovers = 0; }, 1500);
  }
  function drain() {             // la escena respira: todo se vacia de golpe y vuelve a crecer
    clearPops(true); drop(3); A.burst(0.18, false);
    visit.draining = true;
    const v = visit;
    setTimeout(() => {
      if (visit !== v) return;   // la escena ya cambio: no tocar la visita nueva
      Object.assign(visit, { flood: false, cycle: visit.cycle + 1, start: performance.now(), satAt: range([15, 24]) * 1000, satLen: range([20, 32]) * 1000,
        hit: false, draining: false, cascades: subset(visit.st.cascades), moves: subset(visit.st.moves), places: subset(visit.st.places) });
    }, visit.drainLen);
  }

  // ================= Pop-ups =================
  const POP = { max: { 1: 4, 2: 10, 3: 20, 4: 45 }, every: { 1: 6000, 2: 2800, 3: 1200, 4: 260 }, storm: { 1: 6, 2: 12, 3: 22, 4: 40 } };
  const count = () => { const b = $('dk-pop'); if (!b) return 0; let n = 0; for (const w of b.children) if (!w.dataset.out) n++; return n; };   // las que ya van saliendo no cuentan
  const T = s => visit.st.prefix + '://' + (s || pick(px().titles) + '_0x' + hex(Math.random() < 0.5 ? 2 : 4));   // 2.0: titulos de la escena
  let jsMovers = 0;

  // ================= 2.0 · Modulacion: cuanto de la pieza tapan las ventanas =================
  // La pantalla se mide en una rejilla y cada fase tiene un tope de cobertura. Fuera de las oleadas las ventanas son pocas, chicas,
  // y el centro de la pieza queda libre. En saturacion van por oleadas: inundan (pueden llenar la pantalla), se sostienen llenas
  // a lo mucho 5 s y se purgan con glitch; despues queda un rato con la pieza a la vista antes de la siguiente.
  const COV = { gx: 32, gy: 18, v: 0, at: 0, fullSince: 0, hold: 4000, FULL: 0.55, FREE: 0.4, pauseUntil: 0 };   // FULL: desde aqui la pieza ya casi no se ve y empieza el reloj; solo se detiene si baja de FREE
  function coverage(force) {
    const now = performance.now(); if (!force && now - COV.at < 250) return COV.v; COV.at = now;
    const box = $('dk-pop'); if (!box || !box.children.length) return (COV.v = 0);
    const W = innerWidth, H = Math.max(1, innerHeight - TOP), g = new Uint8Array(COV.gx * COV.gy);
    for (const w of box.children) {
      if (w.dataset.out) continue;
      const r = w.getBoundingClientRect();
      const x0 = Math.max(0, Math.floor(r.left / W * COV.gx)), x1 = Math.min(COV.gx - 1, Math.floor((r.right - 1) / W * COV.gx));
      const y0 = Math.max(0, Math.floor((r.top - TOP) / H * COV.gy)), y1 = Math.min(COV.gy - 1, Math.floor((r.bottom - TOP - 1) / H * COV.gy));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * COV.gx + x] = 1;
    }
    let s = 0; for (let i = 0; i < g.length; i++) s += g[i];
    return (COV.v = s / g.length);
  }
  const inWave = () => !!visit.flood || invading > performance.now();
  function cap() {          // tope de cobertura (0..1) de la fase actual
    if (inWave()) return 1;
    const ph = phase();
    return ph === 'quiet' ? 0 : ph === 'simple' ? 0.07 + stage * 0.02 : ph === 'build' ? 0.2 + stage * 0.025 : ph === 'sat' ? 0.24 + stage * 0.04 : 0.1;
  }
  function clearCenter(w) { // fuera de las oleadas el centro de la pieza queda libre: la ventana se corre al borde mas cercano
    if (inWave() || !w || !w.isConnected) return;
    const W = innerWidth, H = innerHeight - TOP, ww = w.offsetWidth, hh = w.offsetHeight, x = parseFloat(w.style.left) || 0, y = parseFloat(w.style.top) || 0;
    const zx0 = W * 0.26, zx1 = W * 0.74, zy0 = H * 0.2, zy1 = H * 0.8;
    const ox = Math.max(0, Math.min(x + ww, zx1) - Math.max(x, zx0)), oy = Math.max(0, Math.min(y + hh, zy1) - Math.max(y, zy0));
    if (ox * oy < ww * hh * 0.3) return;
    const opts = [[zx0 - ww, y], [zx1, y], [x, zy0 - hh], [x, zy1]].filter(([a, b]) => a >= 0 && a + ww <= W && b >= 0 && b + hh <= H);
    if (!opts.length) { w.style.top = (Math.random() < 0.5 ? 0 : Math.max(0, H - hh)) + 'px'; return; }
    const best = opts.sort((p, q) => Math.hypot(p[0] - x, p[1] - y) - Math.hypot(q[0] - x, q[1] - y))[0];
    w.style.left = best[0] + 'px'; w.style.top = best[1] + 'px';
  }
  function flood(first) {   // oleada: las ventanas pueden llenar la pantalla
    const now = performance.now(), v = visit;
    visit.flood = true; visit.floodEnd = now + range([5000, 7500]);
    A.burst(first ? 0.35 : 0.2, first && stage >= 2); drop(2);
    cascade(pick(visit.cascades), int(8, 12) + stage * 3);
    setTimeout(() => { if (visit === v && visit.flood) storm(Math.round(POP.storm[stage] * (0.5 + rnd(0.5)))); }, 400 + rnd(800));
    if (Math.random() < 0.5) setTimeout(() => { if (visit === v && visit.flood) spawn('giant'); }, 900);
  }
  function purge() {        // fin de la oleada: casi todo se va con glitch y la pieza vuelve a verse
    const box = $('dk-pop'); if (!box) return;
    const now = performance.now(), all = [...box.children].filter(w => !w.dataset.out).sort(() => Math.random() - 0.5);
    all.slice(int(0, 2)).forEach((w, i) => setTimeout(() => close(w, false), i * int(8, 22)));
    drop(2); A.burst(0.14, false); jsMovers = 0;
    visit.flood = false; COV.fullSince = 0;
    visit.openUntil = now + range(stage >= 4 ? [5000, 8000] : stage === 3 ? [7000, 11000] : [9000, 14000]);
    COV.pauseUntil = now + range([1300, 2400]);     // respiro, tambien durante una invasion
  }
  function trim() {         // fuera de oleada: si la pieza quedo tapada de mas, se van las mas viejas
    const box = $('dk-pop'); if (!box) return;
    const live = [...box.children].filter(w => !w.dataset.out && !w.classList.contains('follow'));
    live.slice(0, Math.max(1, Math.ceil(live.length * 0.25))).forEach((w, i) => setTimeout(() => close(w, false), i * 40));
  }
  function watch() {        // vigia de la cobertura (4 veces por segundo)
    if (killed || !running) return;
    const now = performance.now(), c = coverage(true);
    if (c >= COV.FULL) { if (!COV.fullSince) { COV.fullSince = now; COV.hold = range([2400, 4200]); } } else if (c < COV.FREE) COV.fullSince = 0;
    if (COV.fullSince && now - COV.fullSince >= COV.hold) return purge();     // llena: nunca mas de 5 s
    if (visit.flood && now >= visit.floodEnd) return purge();                  // la oleada ya duro lo suyo
    if (!inWave() && c > cap() + 0.1) trim();
  }

  // ubicaciones
  function position(w, strat) {
    const W = innerWidth, H = innerHeight - TOP, ww = w.offsetWidth, hh = w.offsetHeight; let x, y;
    switch (strat) {
      case 'center': x = W / 2 - ww / 2 + gauss() * W * 0.18; y = H / 2 - hh / 2 + gauss() * H * 0.18; break;
      case 'edges': { const sd = int(0, 3); x = sd < 2 ? rnd(W - ww) : sd === 2 ? rnd(W * 0.06) : W - ww - rnd(W * 0.06); y = sd === 0 ? rnd(H * 0.08) : sd === 1 ? H - hh - rnd(H * 0.08) : rnd(H - hh); break; }
      case 'corners': { const k = int(0, 3); x = k % 2 ? W - ww - rnd(60) : rnd(60); y = k < 2 ? rnd(50) : H - hh - rnd(50); break; }
      case 'grid': { const cx = int(0, 3), cy = int(0, 2); x = cx * W / 4 + rnd(Math.max(0, W / 4 - ww)); y = cy * H / 3 + rnd(Math.max(0, H / 3 - hh)); break; }
      case 'column': { if (visit.col == null) visit.col = rnd(W - ww); visit.colY = (visit.colY + hh + 6) % Math.max(1, H - hh); x = visit.col; y = visit.colY; break; }
      case 'diagonal': { const k = rnd(1); x = k * (W - ww); y = (Math.random() < 0.5 ? k : 1 - k) * (H - hh); break; }
      case 'ring': { const a = rnd(Math.PI * 2), r = Math.min(W, H) * 0.34; x = W / 2 + Math.cos(a) * r - ww / 2; y = H / 2 + Math.sin(a) * r - hh / 2; break; }
      case 'cursor': x = cursor.x - ww / 2 + gauss() * 140; y = cursor.y - TOP - hh / 2 + gauss() * 100; break;
      case 'mirror': x = rnd(Math.max(0, W / 2 - ww)); y = rnd(H - hh); break;
      default: x = rnd(W - ww); y = rnd(H - hh);
    }
    w.style.left = Math.max(0, Math.min(W - ww, x)) + 'px';
    w.style.top = Math.max(0, Math.min(H - hh, y)) + 'px';
  }
  // movimientos
  function move(w, name, life) {   // 2.0: toda ventana entra con glitch (tiras recortadas y parpadeo) y luego hace su movimiento
    move0(w, name, life);
    const a = w.style.animation || (w.classList.contains('shake') ? 'dk-shake .09s steps(2) .2s infinite' : '');   // el banner conserva su temblor
    if (!/dk-gin/.test(a)) w.style.animation = 'dk-gin' + int(1, 3) + ' ' + int(200, 340) + 'ms steps(1, end) both' + (a ? ', ' + a : '');
  }
  function move0(w, name, life) {
    const L = life || 9000, IN = 'dk-in .18s steps(3)', S = w.style;
    const setv = (k, v) => S.setProperty(k, v);
    switch (name) {
      case 'drift': setv('--dx', gauss() * 160 + 'px'); setv('--dy', gauss() * 110 + 'px'); S.animation = `${IN}, dk-drift ${L}ms linear .18s forwards`; break;
      case 'float': setv('--dy', (8 + rnd(22)) * (Math.random() < 0.5 ? -1 : 1) + 'px'); S.animation = `${IN}, dk-float ${1.8 + rnd(2.5)}s ease-in-out .18s infinite`; break;
      case 'fall': setv('--rot', gauss() * 25 + 'deg'); S.animation = `${IN}, dk-fall ${Math.max(2500, L)}ms cubic-bezier(.55,0,1,.45) ${0.4 + rnd(1.2)}s forwards`; break;
      case 'crawl': setv('--dx', (Math.random() < 0.5 ? -1 : 1) * innerWidth * (0.4 + rnd(0.4)) + 'px'); S.animation = `${IN}, dk-crawl ${L}ms linear .18s forwards`; break;
      case 'zoom': setv('--s', 1 + rnd(0.15)); S.animation = 'dk-zoom .5s cubic-bezier(.2,1.6,.4,1) forwards'; break;
      case 'pulse': setv('--s', 1.03 + rnd(0.09)); S.animation = `${IN}, dk-pulse ${0.6 + rnd(0.9)}s ease-in-out .18s infinite`; break;
      case 'jitter': S.animation = `${IN}, dk-shake ${0.06 + rnd(0.08)}s steps(2) .2s infinite`; break;
      case 'slide': { const r = w.getBoundingClientRect(), W = innerWidth, H = innerHeight, k = int(0, 3);
        setv('--dx', (k === 0 ? -(r.right + 20) : k === 1 ? W - r.left + 20 : 0) + 'px'); setv('--dy', (k === 2 ? -(r.bottom + 20) : k === 3 ? H - r.top + 20 : 0) + 'px');
        S.animation = `dk-slide ${0.25 + rnd(0.35)}s cubic-bezier(.2,.8,.2,1) forwards`; break; }
      case 'stamp': setv('--rot', gauss() * 7 + 'deg'); S.animation = 'dk-stamp .35s cubic-bezier(.3,1.5,.5,1) forwards'; break;
      case 'glitch': case 'orbit': {   // movimientos por script (con tope, para no cargar la pagina)
        if (jsMovers > 12) return move(w, 'drift', life);
        jsMovers++;
        const x0 = parseFloat(w.style.left), y0 = parseFloat(w.style.top), r = 30 + rnd(70), sp = (0.6 + rnd(1.4)) * (Math.random() < 0.5 ? 1 : -1), t0 = performance.now();
        const iv = setInterval(() => {
          if (!w.isConnected || killed) { jsMovers--; return clearInterval(iv); }
          if (name === 'orbit') { const a = (performance.now() - t0) / 1000 * sp; w.style.left = x0 + Math.cos(a) * r + 'px'; w.style.top = y0 + Math.sin(a) * r * 0.6 + 'px'; }
          else if (Math.random() < 0.35) { position(w, 'random'); clearCenter(w); }
        }, name === 'orbit' ? 60 : 380 + rnd(500));
        break;
      }
      default: break;   // static
    }
  }

  function makeWin(cls, title, body, life, opt = {}) {
    const box = $('dk-pop'); if (!box || killed) return null;
    const w = document.createElement('div');
    let size = opt.size === undefined ? pick(visit.sizes) : opt.size; const color = opt.color === undefined ? pick(visit.colors) : opt.color;
    if (opt.size === undefined && !inWave() && (size === 'xl' || size === 'wide' || size === 'lg')) size = pick(['md', 'sm']);   // 2.0: fuera de las oleadas, ventanas chicas
    w.className = ['dk-w', cls, size !== 'md' ? size : '', color !== 'red' ? color : ''].filter(Boolean).join(' ');
    w.innerHTML = '<div class="t"><span></span><span class="c"><span>_</span><span>□</span><span class="x">×</span></span></div>' + body +
                  '<div class="foot"></div>' + (life ? '<div class="life"><i style="animation-duration:' + life + 'ms"></i></div>' : '');
    w.querySelector('.t span').textContent = stage >= 3 ? corrupt(title, 0.05) : title;
    w.querySelector('.foot').textContent = codeLine();            // pie de codigo ilegible en todas
    box.appendChild(w);
    if (opt.x != null) { w.style.left = opt.x + 'px'; w.style.top = opt.y + 'px'; }
    else position(w, opt.place || pick(visit.places));
    if (opt.place !== 'cursor' && !/follow|giant/.test(cls)) clearCenter(w);   // 2.0: el centro de la pieza queda libre
    move(w, opt.move || pick(visit.moves), life);
    w.querySelector('.x').addEventListener('click', ev => { ev.stopPropagation(); close(w, true); });
    setTimeout(() => close(w, false), life || range([7000, 11000]));   // 2.0: ninguna ventana se queda para siempre
    if (stage >= 2 && Math.random() < 0.35) mutate(w);            // algunas se siguen corrompiendo solas
    if (opt.place === 'mirror' || (!opt.place && opt.x == null && visit.places.includes('mirror') && Math.random() < 0.5)) mirrorOf(w, life);
    A.beep();
    return w;
  }
  function mirrorOf(w, life) {   // gemela invertida del otro lado (despues de que la original tenga su texto)
    setTimeout(() => {
      if (!w.isConnected || killed || !$('dk-pop')) return;
      const tw = w.cloneNode(true), W = innerWidth;
      tw.classList.add('inv'); tw.style.left = Math.max(0, W - parseFloat(w.style.left) - w.offsetWidth) + 'px';
      const tb = tw.querySelector('.b'); if (tb && tb.dataset.src) tb.textContent = corrupt('(NOT) ' + tb.dataset.src, CORRUPT[stage]);
      $('dk-pop').appendChild(tw);
      tw.querySelector('.x').addEventListener('click', () => close(tw, true));
      setTimeout(() => close(tw, false), life || 7000);
    }, 0);
  }
  function setText(w, sel, text) { const e = w.querySelector(sel); if (e) { e.textContent = corrupt(text); e.dataset.src = text; } }
  function mutate(w) {
    const iv = setInterval(() => {
      if (!w.isConnected || killed) return clearInterval(iv);
      const b = w.querySelector('.b[data-src]'); if (b) b.textContent = corrupt(b.dataset.src, CORRUPT[stage] * 1.6);
      w.querySelector('.foot').textContent = codeLine();
    }, 220);
  }
  function close(w, byUser) {   // 2.0: toda ventana sale con glitch (se desgarra, se estira y se apaga) y un clic de ruido
    if (!w.isConnected || w.dataset.out) return;
    w.dataset.out = '1'; w.classList.add('out'); w.style.pointerEvents = 'none';
    w.style.animation = 'dk-gout' + int(1, 3) + ' ' + int(160, 280) + 'ms steps(1, end) forwards';
    A.tick();
    setTimeout(() => w.remove(), 300);
    if (byUser && stage >= 2 && phase() === 'sat') { setTimeout(() => spawn(), 120); setTimeout(() => spawn('alert', 'CLOSING THIS WINDOW OPENS TWO'), 260); }   // hidra, solo saturado
  }

  const TYPES = {
    alert(text, lite) {    // saturado: bloquea y OK abre dos. Simple: solo informa
      const block = !lite, w = makeWin(block ? 'block' : '', T(), '<div class="b"></div>' + (block ? '<div class="btns"><button></button></div>' : ''), range(block ? [6000, 10000] : [4500, 8000]));
      if (!w) return; setText(w, '.b', text || line()); if (block) w.querySelector('button').textContent = pick(px().ok);
      if (block) w.querySelector('button').addEventListener('click', () => { close(w, false); spawn(); spawn(); });
    },
    question() {        // [YES] [YES]
      const w = makeWin('block', T('CONSENT_REQUIRED'), '<div class="b"></div><div class="btns"><button></button><button></button></div>', range([8000, 12000]));
      if (!w) return; const P = px(); setText(w, '.b', draw('q:' + scene, P.q)); w.querySelectorAll('button').forEach((b, i) => { b.textContent = P.btn[i]; });
      w.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { close(w, false); cascade(); }));
    },
    progress() {        // extraccion
      const what = draw('x:' + scene, px().x), w = makeWin('', T('EXTRACTION_0x' + hex()), '<div class="b">EXTRACTING <em>' + what + '</em> <span class="pc">0%</span></div><div class="bar"><i></i></div>', 0);
      if (!w) return; let p = 0; const sp = 0.5 + rnd(1.3);
      const iv = setInterval(() => {
        if (!w.isConnected || killed) return clearInterval(iv);
        p = Math.min(100, p + rnd(9) * sp + (Math.random() < 0.1 ? 20 : 0));
        w.querySelector('.bar i').style.width = p + '%'; w.querySelector('.pc').textContent = Math.floor(p) + '%';
        if (p >= 100) { clearInterval(iv); w.querySelector('.b').innerHTML = '<em>' + what + '</em> EXTRACTED. NO BACKUP EXISTS.'; setTimeout(() => close(w, false), 1600); }
      }, 140);
    },
    terminal() {        // escribe solo
      const w = makeWin('term', T('tty0' + (rnd(9) | 0)), '<div class="b"></div>', range([7000, 11000]));
      if (!w) return; const b = w.querySelector('.b'); const text = '> ' + [line(), codeLine(), line()].join('\n> ') + '\n> _'; let i = 0; const sp = int(2, 5);
      const iv = setInterval(() => { if (!w.isConnected) return clearInterval(iv); b.textContent = text.slice(0, i += sp); if (i >= text.length) clearInterval(iv); }, 30);
    },
    eye() {
      const src = SCENE['g1_a2.html'].art, w = makeWin('art', 'LENS_04://EYE', '<pre></pre>', range([4000, 7000]), { size: null });
      if (!w) return; const pre = w.querySelector('pre'); pre.textContent = src;
      const iv = setInterval(() => { if (!w.isConnected) return clearInterval(iv); pre.textContent = Math.random() < 0.15 ? src.replace(/#/g, '-') : src; }, 300);
    },
    giant() {           // banner de lado a lado
      const w = makeWin('giant shake', T('BROADCAST_ALL_NODES'), '<div class="b"></div>', 1600, { size: null, move: 'static', place: 'random' });
      if (!w) return; setText(w, '.b', line()); A.burst(0.3, false); drop(2);
    },
    follow() {          // persigue el cursor
      const w = makeWin('follow', T('CURSOR_CAPTURE'), '<div class="b"></div>', 7000, { size: null, move: 'static', place: 'cursor' });
      if (!w) return; setText(w, '.b', pick(px().follow));
      const iv = setInterval(() => { if (!w.isConnected) return clearInterval(iv); w.style.left = Math.min(innerWidth - w.offsetWidth, cursor.x + 24) + 'px'; w.style.top = Math.min(innerHeight - TOP - w.offsetHeight, cursor.y - TOP + 24) + 'px'; }, 120);
    },
    countdown() {       // al llegar a cero: tormenta
      const label = px().count, w = makeWin('block', T(label.replace(/ IN$/, '').replace(/[^A-Z]+/g, '_')), '<div class="b"><span class="lab"></span> <em class="n">5</em></div>', 0, { move: 'jitter' });
      if (w) w.querySelector('.lab').textContent = label;
      if (!w) return; let n = int(3, 7); w.querySelector('.n').textContent = n;
      const iv = setInterval(() => {
        if (!w.isConnected || killed) return clearInterval(iv);
        n--; w.querySelector('.n').textContent = n; A.beep();
        if (n <= 0) { clearInterval(iv); close(w, false); storm(POP.storm[stage]); }
      }, 1000);
    },
    meter() {           // 2.0 · medidores vivos con las magnitudes de la escena
      const P = px(), names = P.meters, w = makeWin('meter', T(), names.map(() => '<div class="row"><span></span><i><b></b></i><span></span></div>').join(''), range([6000, 9500]));
      if (!w) return; const rows = [...w.querySelectorAll('.row')], v = names.map(() => rnd(60));
      rows.forEach((r, i) => { r.firstChild.textContent = names[i]; });
      const iv = setInterval(() => {
        if (!w.isConnected || killed) return clearInterval(iv);
        rows.forEach((r, i) => { v[i] = Math.max(0, Math.min(100, v[i] + gauss() * 9 + 1.5)); r.querySelector('b').style.width = v[i] + '%'; r.lastChild.textContent = glitching ? hex(3) : v[i].toFixed(1); r.classList.toggle('hot', v[i] > 85); });
      }, 180);
    },
    table() {           // 2.0 · registro de la escena: filas que cambian de estado y se tachan
      const P = px(), n = int(4, 7), w = makeWin('tbl', T(), '<div class="h"></div>' + '<div class="r"><span></span><span></span></div>'.repeat(n), range([6000, 10000]));
      if (!w) return; w.querySelector('.h').textContent = P.table + ' · ' + num(100, 99999) + ' ROWS';
      const rows = [...w.querySelectorAll('.r')], fill = r => { const p = P.row().split('|'); r.firstChild.textContent = p[0]; r.lastChild.textContent = p[1] || ''; r.classList.remove('hit'); };
      rows.forEach(fill);
      const iv = setInterval(() => { if (!w.isConnected || killed) return clearInterval(iv); const r = pick(rows); if (r.classList.contains('hit') || Math.random() < 0.5) fill(r); else r.classList.add('hit'); }, 320);
    },
    form() {            // 2.0 · formulario que se llena solo y queda sellado
      const P = px(), w = makeWin('form', T(), P.form.map(() => '<div class="f"><label></label><span></span></div>').join('') + '<div class="btns"><button></button></div>', range([6500, 10000]));
      if (!w) return; const fs = [...w.querySelectorAll('.f')], vals = P.form.map(f => String(f[1]())); let k = 0, c = 0;
      fs.forEach((f, i) => { f.firstChild.textContent = P.form[i][0]; });
      w.querySelector('button').textContent = pick(P.ok);
      w.querySelector('button').addEventListener('click', () => { close(w, false); spawn('toast'); });
      const iv = setInterval(() => {
        if (!w.isConnected || killed) return clearInterval(iv);
        if (k >= fs.length) { clearInterval(iv); w.classList.add('filed'); return; }
        c += int(1, 3); fs[k].lastChild.textContent = vals[k].slice(0, c); if (c >= vals[k].length) { k++; c = 0; }
      }, 60);
    },
    toast() {           // 2.0 · aviso breve, sin barra de titulo, por los bordes
      const w = makeWin('toast', T('NOTICE'), '<div class="b"></div>', range([2200, 4200]), { size: null, place: pick(['corners', 'edges', 'edges']), move: pick(['static', 'slide', 'jitter']) });
      if (!w) return; setText(w, '.b', pick(px().toast));
    },
    sim() {             // 2.0 · la simulacion en ASCII de la escena
      const P = px(), step = (SIMS[P.sim] || SIMS.noise)(), w = makeWin('sim', T(P.sim.toUpperCase() + '_SIM'), '<pre></pre>', range([6000, 9500]), { size: null });
      if (!w) return; const pre = w.querySelector('pre'); pre.textContent = step(); position(w, pick(visit.places)); clearCenter(w);
      const iv = setInterval(() => { if (!w.isConnected || killed) return clearInterval(iv); const s = step(); pre.textContent = glitching ? corrupt(s, 0.3) : s; }, P.sim === 'life' ? 150 : 200);
    },
    cascade() { cascade(); },
    code() {            // volcado de memoria ilegible que corre solo
      const w = makeWin('code', T('MEMDUMP_0x' + hex(8)), '<pre></pre>', range([5000, 9000]), { size: null });
      if (!w) return; const pre = w.querySelector('pre'), rows = [], sp = int(60, 140);
      const iv = setInterval(() => {
        if (!w.isConnected || killed) return clearInterval(iv);
        rows.push(Math.random() < 0.12 ? '<b>' + escapeHTML(corrupt(line(), 0.02)) + '</b>' : escapeHTML(corrupt(codeLine(), CORRUPT[stage])));
        if (rows.length > 11) rows.shift();
        pre.innerHTML = rows.join('\n');
      }, sp);
    },
    art() {             // el ASCII de la escena, degradandose
      const sc = sceneOf(scene), src = (sc && sc.art) || SCENE['g1_a2.html'].art;
      const w = makeWin('art', T('RENDER_' + (scene || 'CORE').replace('.html', '').toUpperCase()), '<pre></pre>', range([4500, 7500]), { size: null });
      if (!w) return; const pre = w.querySelector('pre'); let decay = 0; const rate = 0.02 + rnd(0.04);
      if (Math.random() < 0.3) pre.classList.add('g');
      pre.textContent = src; position(w, pick(visit.places));   // medir con el dibujo completo
      const iv = setInterval(() => {
        if (!w.isConnected || killed) return clearInterval(iv);
        decay = Math.min(0.85, decay + rate + stage * 0.01);
        pre.textContent = src.split('\n').map(r => ' '.repeat(Math.random() < decay * 0.3 ? int(1, 6) : 0) + corrupt(r, decay * 0.5)).join('\n');
      }, 120);
    }
  };
  function escapeHTML(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

  // cascadas: forma, separacion, velocidad, tamano y cantidad cambian cada vez
  function cascade(shape, n) {
    shape = shape || pick(visit.cascades); n = n || int(5, 8) + stage * int(2, 3);
    const W = innerWidth, H = innerHeight - TOP, cx = W / 2, cy = H / 2, size = pick(['tiny', 'sm', 'sm', 'md']), gap = int(25, 120);
    const x0 = rnd(W * 0.5), y0 = rnd(H * 0.4), sx = int(16, 38) * (Math.random() < 0.5 ? 1 : -1), sy = int(14, 34), a0 = rnd(Math.PI * 2), spread = Math.PI * (0.4 + rnd(1.2));
    const at = i => {
      switch (shape) {
        case 'reverse': return [W - x0 - i * Math.abs(sx) - 300, y0 + i * sy];
        case 'vertical': return [x0 + gauss() * 10, i * (H / n)];
        case 'ribbon': return [i * (W / n), y0 + Math.sin(i * 0.6) * 25];
        case 'stairs': return [x0 + (i % 5) * Math.abs(sx) * 2, y0 + Math.floor(i / 5) * 70 + (i % 5) * 14];
        case 'fan': { const a = a0 + (i / n) * spread, r = 40 + i * 18; return [cx + Math.cos(a) * r - 120, cy + Math.sin(a) * r - 40]; }
        case 'spiral': { const a = a0 + i * 0.55, r = 20 + i * 14; return [cx + Math.cos(a) * r - 120, cy + Math.sin(a) * r * 0.7 - 40]; }
        case 'ring': { const a = a0 + (i / n) * Math.PI * 2, r = Math.min(W, H) * 0.32; return [cx + Math.cos(a) * r - 120, cy + Math.sin(a) * r - 40]; }
        case 'grid': { const cols = Math.ceil(Math.sqrt(n * 1.6)); return [(i % cols) * (W / cols), Math.floor(i / cols) * (H / Math.ceil(n / cols))]; }
        case 'wave': return [i * (W / n), cy + Math.sin(i * 0.8 + a0) * H * 0.3 - 40];
        case 'burst': { const a = rnd(Math.PI * 2), r = rnd(Math.min(W, H) * 0.45); return [cx + Math.cos(a) * r - 120, cy + Math.sin(a) * r - 40]; }
        case 'mirror': return [x0 * 0.5 + i * Math.abs(sx), y0 + i * sy];
        default: return [x0 + i * sx + (sx < 0 ? W * 0.4 : 0), y0 + i * sy];   // diagonal
      }
    };
    const v = visit;   // si la escena cambia, lo que quedaba programado ya no aparece
    const kind = pick(['line', 'line', 'toast', 'row', 'bar']), P = px();   // 2.0: cada cascada lleva un contenido distinto
    for (let i = 0; i < n; i++) setTimeout(() => {
      if (visit !== v || count() >= POP.max[stage] + 12 || killed || (!inWave() && coverage() >= cap())) return;
      const [x, y] = at(i), w = makeWin(kind === 'toast' ? 'toast' : '', T(), '<div class="b"></div>' + (kind === 'bar' ? '<div class="bar"><i></i></div>' : ''), range([2000, 4500]) + i * 90,
        { x, y, size: kind === 'toast' ? null : size, move: shape === 'burst' ? 'zoom' : pick(['static', 'static', 'jitter', 'drift']) });
      if (!w) return;
      if (kind === 'toast') setText(w, '.b', pick(P.toast));
      else if (kind === 'row') setText(w, '.b', P.row().replace('|', ' · '));
      else if (kind === 'bar') { const pc = int(3, 99); setText(w, '.b', pick(P.x) + ' ' + pc + '%'); w.querySelector('.bar i').style.width = pc + '%'; }
      else setText(w, '.b', line());
      const W2 = innerWidth, H2 = innerHeight - TOP;   // que no se salga
      w.style.left = Math.max(0, Math.min(W2 - w.offsetWidth, parseFloat(w.style.left))) + 'px';
      w.style.top = Math.max(0, Math.min(H2 - w.offsetHeight, parseFloat(w.style.top))) + 'px';
      if (shape === 'mirror') mirrorOf(w, 4000);
    }, i * (shape === 'burst' ? 20 : gap));
  }
  function weighted(wts, only) {
    const keys = Object.keys(wts).filter(k => !only || only.includes(k)); if (!keys.length) return 'alert';
    const tot = keys.reduce((a, k) => a + wts[k], 0); let r = rnd(tot);
    for (const k of keys) { r -= wts[k]; if (r <= 0) return k; } return keys[0];
  }
  function spawn(type, text) {   // 2.0: fuera de las oleadas respeta el tope de cobertura y solo usa ventanas que no bloquean
    const wave = inWave();
    if (killed || count() >= POP.max[stage] * (wave ? 1.6 : 1)) return;
    if (!wave && coverage() >= cap()) return;
    const t = type || weighted(visit.st.types, wave ? null : SIMPLE);
    if (t === 'alert' && !wave && !text) return TYPES.alert(null, true);
    (TYPES[t] || TYPES.alert)(text);
  }
  function spawnSimple() {
    if (coverage() >= cap()) return;
    const type = weighted(visit.st.types, SIMPLE);
    if (type === 'alert') TYPES.alert(null, true); else (TYPES[type] || TYPES.code)();
  }
  function storm(n) {
    const v = visit;
    for (let i = 0; i < n; i++) setTimeout(() => { if (visit !== v) return; if (Math.random() < 0.2) spawn('alert'); else spawn(); }, i * (50 + rnd(60)));
    if (n > 10) cascade();
  }
  function saturate() { visit.hit = true; flood(true); }   // el golpe con el que empieza la saturacion: la primera oleada

  // ================= Invasion: el sistema se cae y las ventanas toman la pantalla =================
  // la pieza la pide con DARK.invade(segundos) (el crash de la torre). Dentro del recorrido o de TouchDesigner la pinta el marco; sola en la red, la pieza.
  // ventanas que bloquean, tiemblan y se multiplican al cerrarlas, preguntas [YES] [YES], ventanas que persiguen el cursor; cada vez mas seguido
  const CRASH = {   // generico, para escenas sin crash propio
    titles: ['PANOSYS://KERNEL_PANIC', 'PANOSYS://FATAL', 'PANOSYS://LOCKDOWN'], buttons: ['OK', 'COMPLY', 'RESTORE'],
    lines: ['SYSTEM FAILURE · OBSERVATION CONTINUES', 'CLOSING THIS WINDOW OPENS TWO', 'THE SYSTEM OF SYSTEMS NEVER CRASHES. THE TERMINAL DOES.'],
    questions: QUESTIONS, tpl: [() => `FATAL 0x${hex(8)} · RECOVERY BY OBEDIENCE`]
  };
  let invading = 0;
  const crashOf = () => (SCENE[scene] && SCENE[scene].crash) || CRASH;
  function crashLine(cr) { return fresh(() => Math.random() < 0.3 ? pick(cr.tpl)() : draw('cr:' + scene, cr.lines)); }
  function crashWin(cr) {   // bloquea, tiembla, y cerrarla abre dos
    const box = $('dk-pop'); if (!box || box.children.length >= 90) return;
    const w = makeWin('block crash', pick(cr.titles) + '_0x' + hex(), '<div class="b"></div><div class="btns"><button></button></div>', 0,
      { move: pick(['jitter', 'stamp', 'stamp', 'static', 'glitch']), place: pick(['cursor', 'random', 'center', 'grid', 'edges']),
        color: pick(['red', 'white', 'inv']), size: pick(['sm', 'md', 'lg', 'wide']) });
    if (!w) return;
    setText(w, '.b', crashLine(cr)); w.querySelector('button').textContent = pick(cr.buttons);
    const hydra = () => { setTimeout(() => crashWin(cr), 60); setTimeout(() => crashWin(cr), 160); };
    w.querySelector('button').addEventListener('click', () => { close(w, false); hydra(); });
    w.querySelector('.x').addEventListener('click', hydra);
  }
  function crashAsk(cr) {   // cualquier respuesta suelta una rafaga
    const w = makeWin('block crash', pick(cr.titles) + '://CONSENT', '<div class="b"></div><div class="btns"><button>YES</button><button>YES</button></div>', 0,
      { move: 'stamp', place: pick(['center', 'cursor']), color: pick(['white', 'inv']) });
    if (!w) return; setText(w, '.b', pick(cr.questions));
    w.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { close(w, false); cascade('burst', int(8, 14)); }));
  }
  function invade(sec) {
    sec = Math.max(4, +sec || 16);
    if (EMBEDDED) { try { parent.postMessage({ dark: 'invade', sec }, '*'); } catch (e) {} return; }
    if (killed || invading > performance.now()) return;
    ensureDom(); const box = $('dk-pop'); if (!box) return;
    box.classList.add('invade'); box.style.zIndex = 100000;   // por encima de la pantalla de panico de la pieza
    const v = visit, cr = crashOf(), t0 = performance.now(); invading = t0 + sec * 1000;
    TD.r = 2; setTimeout(() => { if (TD.r === 2) TD.r = 0; }, 2500);   // TouchDesigner y SuperCollider lo reciben como una ruptura fuerte
    A.burst(0.4, true); drop(3);
    cascade('burst', 12 + stage * 2);
    const tick = () => {
      const now = performance.now();
      if (killed || visit !== v || now > invading) return;
      if (now < COV.pauseUntil) return setTimeout(tick, 200);   // 2.0: despues de cada purga, un respiro
      if (box.children.length < 80) {
        const r = Math.random();
        if (r < 0.36) crashWin(cr);
        else if (r < 0.48) crashAsk(cr);
        else if (r < 0.56) TYPES.follow();
        else if (r < 0.63) TYPES.giant();
        else if (r < 0.78) TYPES.code();
        else TYPES.alert(crashLine(cr));
        if (Math.random() < 0.1) cascade(pick(['burst', 'grid', 'vertical', 'mirror', 'spiral']), int(6, 12));
      }
      const k = (now - t0) / (sec * 1000);   // cada vez mas seguido
      setTimeout(tick, Math.max(60, 380 - k * 320) * (0.6 + rnd(0.8)));
    };
    setTimeout(tick, 250);
  }

  // ================= Subliminal, barrido, apagones =================
  // subliminal: palabra de la escena o una orden, con estilos y duraciones que cambian (nunca mas de ~2 por segundo)
  // mezcla: la escena (o el rele de las transiciones), la etapa del recorrido, el lexico general y alguna palabra armada en el momento
  function subWord() {
    const own = SUBS[scene] || (isTransit(scene) ? SUBS_TRANSIT : null);
    return fresh(() => {
      const r = Math.random();
      if (own && r < 0.45) return draw('s:' + scene, own);
      if (r < 0.65) return draw('st' + stage, SUBLIM_STAGE[stage] || SUBLIM);
      if (r < 0.73) return pick(SUBLIM_TPL)();
      return draw('sub', SUBLIM);
    });
  }
  function flash() {
    const ph = phase(); if (ph === 'quiet' || ph === 'drain') return;
    const s = $('dk-sub'); if (!s) return;
    const style = pick(['word', 'word', 'inv', 'white', 'line', 'stack', 'split', 'grid']), w = subWord();
    s.className = 'on ' + style; TD.f++;
    if (style === 'stack') s.innerHTML = [w, subWord(), subWord()].map((t, i) => '<span style="font-size:' + [9, 5, 3][i] + 'vw">' + escapeHTML(t) + '</span>').join('');
    else if (style === 'split') { const h = Math.ceil(w.length / 2); s.innerHTML = '<span>' + escapeHTML(w.slice(0, h)) + '</span><span>' + escapeHTML(w.slice(h)) + '</span>'; }
    else if (style === 'grid') s.textContent = (w + ' ').repeat(160);
    else s.textContent = w;
    const d = int(40, 110);
    setTimeout(() => { s.className = ''; }, d);
    if (Math.random() < 0.2) setTimeout(() => { s.textContent = subWord(); s.className = 'on inv'; setTimeout(() => s.className = '', 50); }, d + 90);   // doble
  }
  // 2.0 · escaneo erratico: la linea aparece en un punto, salta a otro, se parte en tramos, parpadea y se va. Nunca barre.
  // Es el unico escaneo de toda la serie (las piezas ya no traen el suyo).
  let scanning = false;
  function scan() {
    const s = $('dk-scan'); if (!s || scanning) return;
    scanning = true;
    const lab = s.querySelector('span'), ghosts = [...s.querySelectorAll('i')];
    let left = int(2, 9);   // apariciones de este episodio
    const hide = () => { s.className = ''; };
    const step = () => {
      if (killed || left-- <= 0) { hide(); scanning = false; return; }
      const H = innerHeight - TOP, y = Math.round(rnd(H)), part = Math.random() < 0.5;
      const w = part ? 12 + rnd(55) : 100, l = part ? rnd(100 - w) : 0;
      s.style.top = TOP + y + 'px'; s.style.left = l + '%'; s.style.width = w + '%';
      s.className = 'on ' + pick(['', '', '', 'g', 'w', 'dash', 'thick']);
      if (lab) lab.textContent = pick(['SCANNING OBSERVER', 'SCAN', 'LOCK', 'Y:' + String(y).padStart(4, '0'), 'RETRACE', 'OBSERVER 0x' + hex()]) + (part ? ' ' + Math.round(w) + '%' : '');
      ghosts.forEach(g => {   // lineas fantasma: tramos sueltos en otra altura
        const on = Math.random() < 0.4;
        g.style.display = on ? 'block' : 'none';
        if (on) { g.style.top = (gauss() * H * 0.3) + 'px'; g.style.left = rnd(80) + '%'; g.style.width = (5 + rnd(30)) + '%'; }
      });
      // mientras esta: uno o dos tirones cortos (salto, no deslizamiento)
      const hold = int(40, 240);
      if (Math.random() < 0.5) setTimeout(() => { if (s.className) s.style.top = TOP + Math.max(0, Math.min(H, y + gauss() * 30)) + 'px'; }, hold * 0.5);
      setTimeout(() => { hide(); setTimeout(step, Math.random() < 0.65 ? int(25, 130) : int(350, 1500)); }, hold);
    };
    step();
  }
  function drop(frames) { const d = $('dk-drop'); if (!d) return; d.style.opacity = 1; setTimeout(() => d.style.opacity = 0, 33 * (frames || 1)); }

  // ================= 2.0 · Glitch general: estrobo de mosaico unido al audio =================
  // De vez en cuando, al azar: una rafaga de cuadros a 11-18 por segundo. Un solo reloj agenda cada cuadro y su golpe de sonido;
  // en los cuadros negros la entidad se corta (compuerta), y la pieza de abajo recibe el mismo guion para cortar su propio audio
  // y revolver sus capas. Mosaico de bloques tipo teletexto, barras, bandas y una palabra en bloque: rojo, verde, blanco y negro.
  const STROBE = { w: 96, h: 54, P: ['#000', '#fff', '#ff2a2a', '#00ff55'] };
  let glitching = false;
  function strobeDraw(g, kind, word) {
    const { w, h, P } = STROBE, col = () => P[int(0, 3)];
    g.clearRect(0, 0, w, h);
    const fill = c => { g.fillStyle = c; g.fillRect(0, 0, w, h); };
    const blocks = (n, max) => { for (let i = 0; i < n; i++) { g.fillStyle = col(); g.fillRect(int(0, w), int(0, h), int(1, max), int(1, Math.max(2, max / 2))); } };
    switch (kind) {
      case 'white': fill('#fff'); g.fillStyle = '#000'; for (let i = 0; i < 16; i++) g.fillRect(int(0, w), int(0, h), int(2, 22), int(1, 3)); break;
      case 'black': fill('#000'); break;
      case 'red': fill('#ff2a2a'); g.fillStyle = '#000'; for (let i = 0; i < 10; i++) g.fillRect(0, int(0, h), w, 1); break;
      case 'bars': {   // barras de ajuste con dientes de teletexto
        const n = int(5, 9), bw = Math.ceil(w / n);
        for (let i = 0; i < n; i++) { g.fillStyle = col(); g.fillRect(i * bw, 0, bw, h); }
        for (let i = 0; i < 60; i++) { g.fillStyle = col(); const x = int(0, n) * bw; g.fillRect(x - int(0, 4), int(0, h), int(1, 5), int(1, 4)); }
        break;
      }
      case 'mosaic': {   // bloques encima de la pieza (lo de abajo se sigue viendo) + un tablero
        blocks(110, 12);
        const x0 = int(0, w - 24), y0 = int(0, h - 14), cw = int(12, 30), ch = int(6, 16);
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) if ((x + y) & 1) { g.fillStyle = y < ch / 2 ? '#fff' : '#ff2a2a'; g.fillRect(x0 + x, y0 + y, 1, 1); }
        break;
      }
      case 'bands': for (let y = 0; y < h;) { const bh = int(1, 7); if (Math.random() < 0.6) { g.fillStyle = col(); g.fillRect(Math.random() < 0.3 ? int(0, w / 2) : 0, y, w, bh); } y += bh; } break;
      case 'word': {   // la palabra, en bloque, sobre una banda negra
        fill(pick(['#000', '#000', '#ff2a2a'])); blocks(26, 8);
        const size = Math.max(7, Math.min(20, Math.floor(w * 1.55 / Math.max(4, word.length))));
        g.fillStyle = '#000'; g.fillRect(0, h / 2 - size * 0.75, w, size * 1.5);
        g.font = 'bold ' + size + 'px Consolas, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillStyle = pick(['#fff', '#fff', '#00ff55']); g.fillText(word, w / 2, h / 2 + 1);
        break;
      }
    }
  }
  function strobePlan(ms) {   // el guion: [{ at, kind, len }] en milisegundos
    const per = int(55, 90), n = Math.max(5, Math.round(ms / per)), plan = [];
    const pool = ['white', 'black', 'black', 'bars', 'mosaic', 'mosaic', 'bands', 'red', 'none'];
    let words = int(1, 2);
    for (let i = 0; i < n; i++) {
      let kind = i === 0 ? 'white' : i >= n - 2 ? 'black' : pick(pool);
      if (i > 1 && i < n - 2 && plan[i - 1].kind !== 'black' && Math.random() < 0.35) kind = 'black';   // claro / oscuro: el estrobo
      if (words && i > 1 && i < n - 2 && Math.random() < 0.22) { kind = 'word'; words--; }
      plan.push({ at: i * per, kind, len: per });
    }
    return plan;
  }
  function pieceWindow() { const f = document.querySelector('iframe#runtime, iframe'); return f && f.contentWindow; }
  // la pieza corta su propio audio con el mismo guion (si expone audioCtx + masterGain) y avisa a sus capas
  function pieceGlitch(plan, ms) {
    try { if (window.DARK2 && DARK2.glitch) DARK2.glitch(ms, plan); } catch (e) {}
    try {
      /* eslint-disable no-undef */
      const c = typeof audioCtx !== 'undefined' && audioCtx, m = typeof masterGain !== 'undefined' && masterGain;
      if (!c || !m || !m.gain || c.state !== 'running') return;
      const t0 = c.currentTime + 0.01, v0 = m.gain.value;
      m.gain.cancelScheduledValues(t0);
      plan.forEach(p => m.gain.setValueAtTime(p.kind === 'black' ? 0 : v0, t0 + p.at / 1000));
      m.gain.setValueAtTime(v0, t0 + ms / 1000);
    } catch (e) {}
  }
  function glitch(ms) {
    if (killed || glitching || EMBEDDED) return;
    const cvs = $('dk-strobe'); if (!cvs) return;
    ms = ms || int(450, 900) + stage * int(60, 180);
    const plan = strobePlan(ms), g = cvs.getContext('2d'), total = plan[plan.length - 1].at + plan[plan.length - 1].len;
    glitching = true;
    const r0 = TD.r; TD.r = Math.max(TD.r, 2);   // TouchDesigner y SuperCollider lo reciben como una ruptura fuerte
    A.strobe(plan, total);
    if (IS_FRAME) { const w = pieceWindow(); if (w) try { w.postMessage({ dark: 'glitch', plan, ms: total }, '*'); } catch (e) {} }
    else pieceGlitch(plan, total);
    plan.forEach(p => setTimeout(() => {
      if (killed) return;
      if (p.kind === 'none') { cvs.style.display = 'none'; return; }
      strobeDraw(g, p.kind, p.kind === 'word' ? subWord() : ''); cvs.style.display = 'block';
      if (p.kind === 'word') TD.f++;
    }, p.at));
    setTimeout(() => { cvs.style.display = 'none'; glitching = false; if (TD.r === 2) TD.r = r0 === 2 ? 0 : r0; }, total);
  }

  const EVERY = { sub: { 1: 22000, 2: 11000, 3: 5000, 4: 1600 }, scan: { 1: 9000, 2: 6500, 3: 4500, 4: 2200 }, drop: { 1: 9000, 2: 5000, 3: 2500, 4: 1000 }, bands: { 1: 1400, 2: 900, 3: 600, 4: 300 },
                  glitch: { 1: 62000, 2: 44000, 3: 30000, 4: 15000 } };
  function loop(fn, table) { const go = () => { if (killed) return; fn(); setTimeout(go, Math.max(250, table[stage] * (0.5 + Math.random()))); }; setTimeout(go, table[stage] * 0.5); }

  // el reloj de los pop-ups: calma -> simples -> rampa -> saturacion
  function popLoop() {
    if (killed) return;
    const ph = phase(), calm = visit.st.calm; let next;
    if (ph === 'quiet') next = 700;
    else if (ph === 'drain') { if (!visit.draining) drain(); next = 500; }
    else if (ph === 'simple') { if (count() < visit.simpleMax) spawnSimple(); next = range(calm); }
    else if (ph === 'build') { if (count() < visit.simpleMax + 3) spawnSimple(); next = range(calm) * 0.4; }
    else {   // 2.0 · saturacion por oleadas: inunda -> (llena, a lo mucho 5 s) -> purga con glitch -> la pieza a la vista -> otra oleada
      const now = performance.now();
      if (!visit.hit) saturate();
      else if (!visit.flood && now >= visit.openUntil) flood(false);
      if (visit.flood) { if (now >= COV.pauseUntil) spawn(); next = Math.max(90, POP.every[stage] * (0.18 + rnd(0.3)) * visit.tempo); }
      else { spawn(); next = Math.max(900, range(calm) * 0.3); }
    }
    setTimeout(popLoop, next);
  }

  // ================= Arranque por modo =================
  function hasOwnScan() { return false; }   // 2.0: las piezas ya no escanean por su cuenta (dark2.css apaga #scanline)
  function start() {
    if (running) return; running = true;
    ensureDom();
    loop(() => drop(1 + (rnd(2) | 0)), EVERY.drop);
    loop(bands, EVERY.bands);
    if (EMBEDDED) {
      // el marco hace el ruido y las ventanas: aqui latido visual propio y avisar la escena, si ya escanea, y el cursor
      setInterval(pulse, A.beat[stage] * soundOf(FILE).beatMul);
      try { parent.postMessage({ dark: 'scene', file: FILE, scan: hasOwnScan() }, '*'); } catch (e) {}
      addEventListener('message', e => { const m = e.data; if (m && m.dark === 'glitch' && m.plan) pieceGlitch(m.plan, m.ms); });   // 2.0: el glitch del marco llega hasta aqui
      // cada click dentro de la pieza le avisa al marco (asi puede recuperar la pantalla completa)
      addEventListener('pointerdown', () => { try { parent.postMessage({ dark: 'poke' }, '*'); } catch (e) {} }, { capture: true });
      addEventListener('mousemove', e => { try { parent.postMessage({ dark: 'cursor', x: e.clientX, y: e.clientY }, '*'); } catch (err) {} }, { passive: true });
      return;
    }
    if (!IS_FRAME) setScene(FILE, hasOwnScan());
    // ?at=segundos o ?at=sat: la primera visita arranca adelantada, para mostrar la saturacion sin esperar (CLASE)
    const at = new URLSearchParams(location.search).get('at');
    if (!IS_FRAME && at) visit.start -= at === 'sat' ? visit.satAt - 1500 : (+at || 0) * 1000;
    loop(flash, EVERY.sub); loop(scan, EVERY.scan);
    loop(() => { const ph = phase(); if (ph !== 'quiet') glitch(); }, EVERY.glitch);   // 2.0: glitch general, al azar
    setTimeout(popLoop, 500);
    setInterval(watch, 250);   // 2.0: vigia de la cobertura
    if (!IS_FRAME) {
      // pieza sola: el audio arranca con el primer gesto y la presion sube sola cada 50 s.
      // ?entity=0 la deja sin la entidad sonora (en TD, para no duplicarla entre los dos browsers)
      const wantEntity = new URLSearchParams(location.search).get('entity') !== '0';
      const wake = () => { try { A.init(); } catch (e) {} };
      if (wantEntity) {
        ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, wake, { capture: true }));
        setTimeout(wake, 600);   // donde el autoplay esta permitido (TD, kiosko) arranca sola; si no, queda en pausa hasta el primer gesto
      }
      setInterval(() => { if (stage < 4) setStage(stage + 1); }, 50000);
    }
  }
  function setStage(s) {
    if (s === stage && running) return;
    stage = s; A.setStage(s);   // la saturacion la marca el tiempo de cada escena, no el cambio de etapa
  }
  function setScene(f, scan) {
    clearPops(false);   // cada escena empieza con el lienzo limpio
    const pb = $('dk-pop'); if (pb) { pb.style.zIndex = ''; pb.classList.remove('invade'); } invading = 0;
    scene = f; recent.length = 0; visit = makeVisit(f); COV.fullSince = 0; COV.pauseUntil = 0;
    sceneScan = false;
    A.setScene(f);
  }

  addEventListener('mousemove', e => { cursor = { x: e.clientX, y: e.clientY }; }, { passive: true });
  if (IS_FRAME) addEventListener('message', e => {
    const m = e.data; if (!m || !m.dark) return;
    if (m.dark === 'scene') { if (m.file !== scene) setScene(m.file, m.scan); }
    if (m.dark === 'cursor') cursor = { x: m.x, y: m.y + TOP };
    if (m.dark === 'poke') fullscreen();
    if (m.dark === 'invade') invade(m.sec);
  });
  // ================= Teclado dentro del recorrido =================
  // el marco le da el foco a la pieza y le reenvia las teclas que le lleguen a el; aqui se vuelven a disparar.
  // un evento sintetico no escribe en un campo de texto, asi que el texto se escribe a mano.
  // dentro de cualquier marco (el recorrido o CLASE) el autofocus no corre: al recibir el foco se enfoca el campo
  const autoField = () => { const f = document.querySelector('input[autofocus], textarea[autofocus]'); return f && !f.disabled && f.offsetParent !== null ? f : null; };
  const grab = () => { const f = autoField(), a = document.activeElement; if (f && (!a || a === document.body)) try { f.focus({ preventScroll: true }); } catch (e) {} };
  if (window.top !== window) addEventListener('focus', grab);
  if (EMBEDDED) {
    addEventListener('message', e => {
      const m = e.data; if (!m || m.dark !== 'key') return;
      grab();
      const a = document.activeElement;
      const field = a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && /^(text|search|password|tel|url)$/i.test(a.type))) ? a : null;
      const ev = new KeyboardEvent(m.type, { key: m.key, code: m.code, shiftKey: m.shift, ctrlKey: m.ctrl, altKey: m.alt, metaKey: m.meta, repeat: m.repeat, bubbles: true, cancelable: true });
      ['keyCode', 'which'].forEach(p => { try { Object.defineProperty(ev, p, { get: () => m.keyCode }); } catch (err) {} });
      (a && a !== document.body ? a : document).dispatchEvent(ev);   // sube hasta window (maze4 escucha WASD ahi)
      if (m.type !== 'keydown' || !field || ev.defaultPrevented || m.ctrl || m.meta) return;
      try {
        const s = field.selectionStart, t = field.selectionEnd;
        if (m.key.length === 1) field.setRangeText(m.key, s, t, 'end');
        else if (m.key === 'Backspace') field.setRangeText('', s !== t ? s : Math.max(0, s - 1), t, 'end');
        else if (m.key === 'Delete') field.setRangeText('', s, s !== t ? t : t + 1, 'end');
        else if (m.key === 'ArrowLeft') { field.setSelectionRange(Math.max(0, s - 1), Math.max(0, s - 1)); return; }
        else if (m.key === 'ArrowRight') { field.setSelectionRange(t + 1, t + 1); return; }
        else if (m.key === 'Enter' && field.form) { field.form.requestSubmit(); return; }
        else return;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (err) {}
    });
  }

  // pantalla completa: se pide en el primer gesto y se vuelve a pedir si algo la saca
  // ?td=1 (Web Render de TouchDesigner): el render ya ocupa todo el TOP, no se pide nunca
  const IN_TD = new URLSearchParams(location.search).has('td');
  function fullscreen() {
    if (IN_TD || window.top !== window) return;   // dentro de otra pagina (CLASE) tampoco: el marco de afuera decide
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    try { const el = document.documentElement, fs = el.requestFullscreen || el.webkitRequestFullscreen, p = fs && fs.call(el); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }
  if (IS_FRAME) addEventListener('pointerdown', fullscreen, { capture: true });

  // ================= Reporte a TouchDesigner (?td=1) =================
  // el titulo de la pagina lleva el estado; el Info DAT del Web Render lo lee y dark_fx lo vuelve canales:
  // DK|etapa|escena|fase|nivel|ruptura|flashes|final|puerta
  // ruptura: 0 / 1 entre escenas / 2 cambio de etapa · final: 0 / 1 copia / 2 borrado / 3 linea plana / 4 apagado
  const TD = { r: 0, f: 0, e: 0, g: IS_FRAME ? 1 : 0 };
  const LVL = { off: 0, quiet: 0.05, simple: 0.18, sat: 0.8, drain: 0.3 };
  function tdReport() {
    let ph = 'off', lvl = 0;
    try {
      if (running && !killed) {
        ph = phase();
        const e = performance.now() - visit.start;
        lvl = ph === 'build' ? 0.2 + 0.45 * Math.max(0, 1 - (visit.satAt - e) / 8000) : LVL[ph];
        lvl = Math.min(1, lvl + Math.min(count(), 40) / 40 * 0.25);   // las ventanas abiertas tambien pesan
      }
    } catch (e) {}
    document.title = ['DK', stage, (scene || '-').replace(/\.html$/, ''), ph, lvl.toFixed(2), TD.r, TD.f, TD.e, TD.g].join('|');
  }
  if (IN_TD && !EMBEDDED) setInterval(tdReport, 100);

  window.DARK = {
    mode: MODE,
    v: 2, start, setStage, storm, spawn, cascade, flash, scan, drop, invade, glitch, flood, purge,
    get coverage() { return coverage(true); }, get cap() { return cap(); }, get wave() { return inWave(); },
    setScene: f => setScene(f),
    audio: () => { try { A.init(); } catch (e) {} },
    burst: (d, l) => A.burst(d, l),
    afterlife: bpm => A.afterlife(bpm),
    flatline: d => A.flatline(d),
    fullscreen,
    td: (k, v) => { TD[k] = v; },   // el marco avisa rupturas, final y puerta
    kill() { killed = true; A.kill(); ['dk-pop', 'dk-sub', 'dk-scan', 'dk-drop', 'dk-strobe'].forEach(id => { const e = $(id); if (e) e.remove(); }); },
    get stage() { return stage; },
    get scene() { return scene; },
    get phase() { return phase(); },
    get visit() { return { elapsed: Math.round((performance.now() - visit.start) / 1000), cycle: visit.cycle, satAt: Math.round(visit.satAt / 1000), moves: visit.moves, places: visit.places, cascades: visit.cascades, sizes: visit.sizes, colors: visit.colors, sound: A.snd.ill, ownScan: sceneScan }; },
    get audioOn() { return A.on; }
  };

  // las piezas arrancan solas; el marco espera a que acepten la transmision
  if (!IS_FRAME) { if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start); else start(); }
})();
