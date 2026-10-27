// Gioco dell'impostore: tutto nel browser, niente server.
// Impostazioni e parole già uscite restano nel browser (localStorage); la partita in corso
// in sessionStorage, così un ricaricamento della pagina non la fa perdere.

const MIN_GIOCATORI = 3;
const MAX_GIOCATORI = 20;
const CHIAVE_IMPOSTAZIONI = "impostore-impostazioni";
const CHIAVE_USATE = "impostore-usate";
const CHIAVE_PARTITA = "impostore-partita";

// Da "Parola: indizio, indizio" a { parola, indizi }
const PAROLE = CATEGORIE.map((c) => ({
  ...c,
  parole: c.parole.split("\n").map((r) => r.trim()).filter(Boolean).map((r) => {
    const [parola, indizi] = r.split(":");
    return { parola: parola.trim(), indizi: indizi.split(",").map((i) => i.trim()).filter(Boolean) };
  }),
}));

const $ = (id) => document.getElementById(id);

// --- Memoria del browser (può mancare: navigazione privata, dati bloccati) ---

function leggi(memoria, chiave, predefinito) {
  try {
    const v = memoria.getItem(chiave);
    return v ? JSON.parse(v) : predefinito;
  } catch {
    return predefinito;
  }
}

function scrivi(memoria, chiave, valore) {
  try {
    if (valore === null) memoria.removeItem(chiave);
    else memoria.setItem(chiave, JSON.stringify(valore));
  } catch {
    // Senza memoria il gioco funziona lo stesso
  }
}

// --- Caso ---

function caso(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}

function mescola(lista) {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = caso(i + 1);
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

// --- Impostazioni ---

const salvate = leggi(localStorage, CHIAVE_IMPOSTAZIONI, {});
const imp = {
  giocatori: Array.isArray(salvate.giocatori) && salvate.giocatori.length >= MIN_GIOCATORI
    ? salvate.giocatori.slice(0, MAX_GIOCATORI).map(String)
    : ["", "", "", ""],
  impostori: Number(salvate.impostori) || 1,
  categorie: Array.isArray(salvate.categorie)
    ? salvate.categorie.filter((id) => PAROLE.some((c) => c.id === id))
    : PAROLE.map((c) => c.id),
  indizio: salvate.indizio !== false,
  // Spenta di base: con l'indizio a volte svela la parola (es. "tasti" + "Musica" = pianoforte)
  categoriaImpostore: salvate.categoriaImpostore === true,
};

function salvaImpostazioni() {
  scrivi(localStorage, CHIAVE_IMPOSTAZIONI, imp);
}

function maxImpostori(n) {
  return Math.max(1, Math.floor((n - 1) / 2));
}

function nomeGiocatore(i) {
  return imp.giocatori[i].trim() || `Giocatore ${i + 1}`;
}

function disegnaGiocatori() {
  const lista = $("giocatori");
  lista.textContent = "";
  imp.giocatori.forEach((nome, i) => {
    const li = document.createElement("li");

    const input = document.createElement("input");
    input.type = "text";
    input.value = nome;
    input.placeholder = `Giocatore ${i + 1}`;
    input.maxLength = 20;
    input.autocomplete = "off";
    input.enterKeyHint = "next";
    input.setAttribute("aria-label", `Nome del giocatore ${i + 1}`);
    input.addEventListener("input", () => {
      imp.giocatori[i] = input.value;
      salvaImpostazioni();
      nascondiErrore();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const prossimo = lista.querySelectorAll("input")[i + 1];
      if (prossimo) prossimo.focus();
      else input.blur();
    });

    const togli = document.createElement("button");
    togli.type = "button";
    togli.className = "remove";
    togli.textContent = "✕";
    togli.setAttribute("aria-label", `Togli ${nomeGiocatore(i)}`);
    togli.disabled = imp.giocatori.length <= MIN_GIOCATORI;
    togli.addEventListener("click", () => {
      imp.giocatori.splice(i, 1);
      aggiornaImpostazioni();
    });

    li.append(input, togli);
    lista.append(li);
  });
  $("n-giocatori").textContent = imp.giocatori.length;
  $("aggiungi").disabled = imp.giocatori.length >= MAX_GIOCATORI;
}

function disegnaImpostori() {
  const max = maxImpostori(imp.giocatori.length);
  imp.impostori = Math.min(Math.max(imp.impostori, 1), max);
  $("n-impostori").textContent = imp.impostori;
  $("meno").disabled = imp.impostori <= 1;
  $("piu").disabled = imp.impostori >= max;
  $("nota-impostori").textContent = max === 1
    ? `Con ${imp.giocatori.length} giocatori c'è un solo impostore. Dai 5 giocatori se ne possono avere di più.`
    : `Con ${imp.giocatori.length} giocatori al massimo ${max} impostori. Gli impostori non sanno chi sono gli altri.`;
}

function disegnaCategorie() {
  const box = $("categorie");
  box.textContent = "";
  PAROLE.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    const scelta = imp.categorie.includes(c.id);
    b.setAttribute("aria-pressed", scelta);
    b.textContent = `${c.icona} ${c.nome}`;
    b.addEventListener("click", () => {
      imp.categorie = scelta ? imp.categorie.filter((id) => id !== c.id) : [...imp.categorie, c.id];
      aggiornaImpostazioni();
    });
    box.append(b);
  });
  $("tutte").textContent = imp.categorie.length === PAROLE.length ? "Nessuna" : "Tutte";
}

function aggiornaImpostazioni() {
  disegnaGiocatori();
  disegnaImpostori();
  disegnaCategorie();
  $("indizio").checked = imp.indizio;
  $("categoria-impostore").checked = imp.categoriaImpostore;
  salvaImpostazioni();
  nascondiErrore();
}

function mostraErrore(testo) {
  $("errore").textContent = testo;
  $("errore").hidden = false;
}

function nascondiErrore() {
  $("errore").hidden = true;
}

$("aggiungi").addEventListener("click", () => {
  if (imp.giocatori.length >= MAX_GIOCATORI) return;
  imp.giocatori.push("");
  aggiornaImpostazioni();
  const inputs = $("giocatori").querySelectorAll("input");
  inputs[inputs.length - 1].focus();
});

$("meno").addEventListener("click", () => {
  imp.impostori--;
  aggiornaImpostazioni();
});

$("piu").addEventListener("click", () => {
  imp.impostori++;
  aggiornaImpostazioni();
});

$("tutte").addEventListener("click", () => {
  imp.categorie = imp.categorie.length === PAROLE.length ? [] : PAROLE.map((c) => c.id);
  aggiornaImpostazioni();
});

$("indizio").addEventListener("change", () => {
  imp.indizio = $("indizio").checked;
  salvaImpostazioni();
});

$("categoria-impostore").addEventListener("change", () => {
  imp.categoriaImpostore = $("categoria-impostore").checked;
  salvaImpostazioni();
});

// --- Scelta della parola: prima quelle non ancora uscite ---

function scegliParola() {
  const pool = [];
  PAROLE.filter((c) => imp.categorie.includes(c.id)).forEach((c) => {
    c.parole.forEach((p) => pool.push({ ...p, categoria: c.id, chiave: `${c.id}/${p.parola}` }));
  });
  let usate = leggi(localStorage, CHIAVE_USATE, []);
  if (!Array.isArray(usate)) usate = [];
  let libere = pool.filter((p) => !usate.includes(p.chiave));
  if (!libere.length) {
    // Uscite tutte: si ricomincia, senza ripetere subito l'ultima
    const chiavi = new Set(pool.map((p) => p.chiave));
    const ultima = usate[usate.length - 1];
    usate = usate.filter((k) => !chiavi.has(k));
    libere = pool.length > 1 ? pool.filter((p) => p.chiave !== ultima) : pool;
  }
  const scelta = libere[caso(libere.length)];
  usate.push(scelta.chiave);
  scrivi(localStorage, CHIAVE_USATE, usate.slice(-1000));
  return scelta;
}

// --- Partita ---

let partita = leggi(sessionStorage, CHIAVE_PARTITA, null);

function salvaPartita() {
  scrivi(sessionStorage, CHIAVE_PARTITA, partita);
}

function categoria(id) {
  return PAROLE.find((c) => c.id === id) || { nome: "", icona: "" };
}

function elencoNomi(nomi) {
  return nomi.length === 1 ? nomi[0] : `${nomi.slice(0, -1).join(", ")} e ${nomi[nomi.length - 1]}`;
}

function nuovaPartita() {
  const giocatori = imp.giocatori.map((_, i) => nomeGiocatore(i));
  const p = scegliParola();
  partita = {
    giocatori,
    impostori: mescola(giocatori.map((_, i) => i)).slice(0, imp.impostori).sort((a, b) => a - b),
    parola: p.parola,
    categoria: p.categoria,
    indizio: imp.indizio ? p.indizi[caso(p.indizi.length)] : "",
    categoriaImpostore: imp.categoriaImpostore,
    primo: caso(giocatori.length),
    turno: 0,
    votato: null,
    schermata: "passa",
  };
  salvaPartita();
  tieniAcceso();
  vai("passa");
}

$("inizia").addEventListener("click", () => {
  if (!imp.categorie.length) {
    mostraErrore("Scegli almeno una categoria.");
    return;
  }
  const nomi = imp.giocatori.map((_, i) => nomeGiocatore(i).toLocaleLowerCase("it"));
  const doppio = nomi.find((n, i) => nomi.indexOf(n) !== i);
  if (doppio) {
    mostraErrore(`Il nome "${nomeGiocatore(nomi.indexOf(doppio))}" è usato due volte: aggiungi un'iniziale per distinguerli.`);
    return;
  }
  nuovaPartita();
});

// --- Schermate ---

const SCHERMATE = ["impostazioni", "passa", "carta", "discussione", "voto", "verdetto", "fine"];

function vai(nome) {
  if (partita) {
    partita.schermata = nome;
    salvaPartita();
  }
  const disegna = { passa: disegnaPassa, carta: disegnaCarta, discussione: disegnaDiscussione, voto: disegnaVoto, verdetto: disegnaVerdetto, fine: disegnaFine }[nome];
  if (disegna) disegna();
  SCHERMATE.forEach((s) => { $(`s-${s}`).hidden = s !== nome; });
  window.scrollTo(0, 0);
}

function disegnaPassa() {
  const nome = partita.giocatori[partita.turno];
  $("progresso").textContent = `Carta ${partita.turno + 1} di ${partita.giocatori.length}`;
  $("passa-nome").textContent = nome;
  $("mostra").textContent = `Sono ${nome}: mostra la carta`;
}

function disegnaCarta() {
  const c = categoria(partita.categoria);
  const impostore = partita.impostori.includes(partita.turno);
  $("carta-nome").textContent = partita.giocatori[partita.turno];
  $("carta-ruolo").hidden = !impostore;
  $("carta-categoria").hidden = impostore && !partita.categoriaImpostore;
  $("carta-categoria").textContent = `${c.icona} ${c.nome}`;
  $("carta-parola").hidden = impostore && !partita.indizio;
  if (!impostore) {
    $("carta-titolo").textContent = "La parola segreta è";
    $("carta-parola").textContent = partita.parola;
    $("carta-nota").textContent = "Non farla vedere a nessuno.";
  } else if (partita.indizio) {
    $("carta-titolo").textContent = "Il tuo indizio è";
    $("carta-parola").textContent = partita.indizio;
    $("carta-nota").textContent = "Non conosci la parola segreta: mimetizzati e cerca di capirla.";
  } else {
    $("carta-titolo").textContent = "Nessun indizio";
    $("carta-parola").textContent = "";
    $("carta-nota").textContent = "Non conosci la parola segreta: ascolta gli altri, mimetizzati e cerca di capirla.";
  }
}

function disegnaDiscussione() {
  const n = partita.giocatori.length;
  $("primo").textContent = partita.giocatori[partita.primo];
  const ordine = partita.giocatori.map((_, i) => partita.giocatori[(partita.primo + i) % n]);
  $("ordine").textContent = `Ordine: ${ordine.join(" → ")}`;
}

function disegnaVoto() {
  const box = $("votabili");
  box.textContent = "";
  partita.giocatori.forEach((nome, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "vote";
    b.textContent = nome;
    b.addEventListener("click", () => {
      partita.votato = i;
      vai("verdetto");
    });
    box.append(b);
  });
}

function disegnaVerdetto() {
  const nomiImpostori = partita.impostori.map((i) => partita.giocatori[i]);
  const piu = nomiImpostori.length > 1;
  const erano = piu
    ? `Gli impostori erano ${elencoNomi(nomiImpostori)}.`
    : `L'impostore era ${nomiImpostori[0]}.`;
  const v = partita.votato;
  let icona;
  let testo;
  let dettaglio = erano;
  let ultima;
  if (v === null) {
    icona = "🕵️";
    testo = "Nessun voto";
    ultima = `${elencoNomi(nomiImpostori)}, ${piu ? "sapreste" : "sapresti"} dire la parola segreta?`;
  } else if (partita.impostori.includes(v)) {
    const nome = partita.giocatori[v];
    icona = "🎯";
    testo = piu ? `Preso! ${nome} era un impostore.` : `Preso! ${nome} era l'impostore.`;
    if (!piu) dettaglio = "";
    ultima = `${nome}, ultima possibilità: prova a dire la parola segreta. Se la indovini, vinci lo stesso!`;
  } else {
    icona = "😈";
    testo = `${partita.giocatori[v]} non era l'impostore!`;
    ultima = `${piu ? "Gli impostori hanno" : "L'impostore ha"} vinto. ${elencoNomi(nomiImpostori)}, ${piu ? "avevate" : "avevi"} capito la parola segreta? Ditela prima di guardare.`;
  }
  $("verdetto-icona").textContent = icona;
  $("verdetto").textContent = testo;
  $("impostori-erano").textContent = dettaglio;
  $("impostori-erano").hidden = !dettaglio;
  $("ultima-possibilita").textContent = ultima;
}

function disegnaFine() {
  const c = categoria(partita.categoria);
  const nomiImpostori = partita.impostori.map((i) => partita.giocatori[i]);
  $("fine-parola").textContent = partita.parola;
  $("fine-categoria").textContent = `${c.icona} ${c.nome}`;
  $("fine-indizio").textContent = partita.indizio
    ? `Indizio dell'impostore: ${partita.indizio}`
    : "Partita senza indizio per l'impostore";
  $("fine-impostori").textContent = `${nomiImpostori.length > 1 ? "Impostori" : "Impostore"}: ${elencoNomi(nomiImpostori)}`;
}

$("mostra").addEventListener("click", () => vai("carta"));

$("nascondi").addEventListener("click", () => {
  partita.turno++;
  vai(partita.turno < partita.giocatori.length ? "passa" : "discussione");
});

$("al-voto").addEventListener("click", () => vai("voto"));

$("salta-voto").addEventListener("click", () => {
  partita.votato = null;
  vai("verdetto");
});

$("mostra-parola").addEventListener("click", () => vai("fine"));

$("ancora").addEventListener("click", nuovaPartita);

function tornaAlleImpostazioni() {
  partita = null;
  salvaPartita();
  lasciaSpegnere();
  aggiornaImpostazioni();
  vai("impostazioni");
}

$("cambia").addEventListener("click", tornaAlleImpostazioni);

document.querySelectorAll("[data-esci]").forEach((b) => b.addEventListener("click", () => {
  if (confirm("Uscire dalla partita? La parola e l'impostore andranno persi.")) tornaAlleImpostazioni();
}));

// --- Schermo sempre acceso durante la partita (solo in https, dove il browser lo permette) ---

let blocco = null;

async function tieniAcceso() {
  try {
    if ("wakeLock" in navigator && !blocco) {
      blocco = await navigator.wakeLock.request("screen");
      blocco.addEventListener("release", () => { blocco = null; });
    }
  } catch {
    blocco = null;
  }
}

function lasciaSpegnere() {
  if (blocco) blocco.release().catch(() => {});
  blocco = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && partita) tieniAcceso();
});

// --- Avvio ---

aggiornaImpostazioni();
if (partita && Array.isArray(partita.giocatori) && SCHERMATE.includes(partita.schermata)) {
  // Dopo un ricaricamento non si riapre mai una carta: si torna a "passa il telefono"
  tieniAcceso();
  vai(partita.schermata === "carta" ? "passa" : partita.schermata);
} else {
  partita = null;
  salvaPartita();
  vai("impostazioni");
}
