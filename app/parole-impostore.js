// Parole del gioco, divise per categoria.
// Una riga per parola: "Parola: indizio, indizio". A ogni partita l'impostore riceve uno dei due
// indizi, scelto a caso: deve avvicinarlo alla parola senza svelarla.
// Per aggiungere una parola basta una riga nuova; per aggiungere una categoria, un blocco nuovo.
const CATEGORIE = [
  {
    id: "cibo", nome: "Cibo e bevande", icona: "🍕", parole: `
Pizza: forno, Napoli
Spaghetti: forchetta, grano
Lasagna: forno, strati
Gelato: estate, freddo
Caffè: mattina, bar
Cioccolato: Pasqua, dolce
Panettone: Natale, Milano
Hamburger: America, panino
Sushi: Giappone, riso
Mela: albero, rosso
Banana: giallo, scimmia
Pane: fornaio, farina
Formaggio: latte, topo
Uovo: gallina, colazione
Patatine: olio, sacchetto
Insalata: verde, orto
Popcorn: cinema, mais
Tiramisù: dolce, cucchiaio
Limonata: estate, aspro
Cornetto: colazione, crema
Minestrone: verdure, inverno
Torta: compleanno, candeline
Miele: api, dolce
Anguria: estate, semi
Fragola: rosso, panna
Nutella: colazione, barattolo
Biscotto: latte, croccante
Kebab: notte, spiedo
` },
  {
    id: "animali", nome: "Animali", icona: "🐾", parole: `
Cane: guinzaglio, fedele
Gatto: fusa, divano
Elefante: grande, Africa
Giraffa: macchie, savana
Leone: savana, coraggio
Delfino: mare, intelligente
Squalo: pinna, paura
Pinguino: freddo, smoking
Cavallo: galoppo, fattoria
Mucca: latte, prato
Coniglio: carota, orecchie
Serpente: veleno, strisciare
Aquila: cielo, artigli
Ape: miele, fiore
Farfalla: colori, bruco
Tartaruga: lentezza, guscio
Scimmia: banana, albero
Orso: miele, letargo
Pappagallo: parlare, colori
Lupo: luna, branco
Ragno: zampe, paura
Canguro: Australia, salto
Gallina: uova, fattoria
Polpo: mare, inchiostro
Formica: piccola, lavoro
Zanzara: estate, prurito
Panda: Cina, bianco e nero
Coccodrillo: fiume, denti
` },
  {
    id: "casa", nome: "Casa e oggetti", icona: "🏠", parole: `
Frigorifero: freddo, cucina
Divano: salotto, comodo
Letto: notte, cuscino
Specchio: riflesso, bagno
Ombrello: pioggia, aprire
Forbici: tagliare, carta
Telecomando: divano, canali
Lampada: luce, comodino
Orologio: tempo, polso
Chiave: porta, tasca
Candela: fiamma, cera
Sedia: gambe, tavolo
Lavatrice: panni, centrifuga
Spazzolino: denti, mattina
Cuscino: morbido, testa
Tappeto: pavimento, volante
Pentola: cucina, coperchio
Telefono: chiamare, schermo
Zaino: scuola, spalle
Bicchiere: acqua, vetro
Libro: pagine, biblioteca
Scopa: pulire, strega
Termometro: febbre, gradi
Ventilatore: estate, aria
Sveglia: mattina, suono
Asciugamano: bagno, spiaggia
Martello: chiodo, attrezzo
` },
  {
    id: "luoghi", nome: "Luoghi", icona: "🌍", parole: `
Spiaggia: sabbia, estate
Ospedale: medico, ambulanza
Scuola: lezione, campanella
Aeroporto: valigia, volo
Supermercato: carrello, cassa
Cinema: film, buio
Biblioteca: silenzio, libri
Museo: quadri, biglietto
Zoo: animali, gabbia
Stazione: binario, treno
Montagna: neve, vetta
Parco giochi: bambini, all'aperto
Ristorante: menù, cameriere
Chiesa: campane, domenica
Palestra: sudore, pesi
Piscina: cloro, tuffo
Discoteca: musica, notte
Farmacia: medicine, croce verde
Stadio: tifosi, partita
Castello: re, torre
Deserto: caldo, cammello
Isola: mare, naufrago
Luna park: giostre, zucchero filato
Venezia: canali, maschere
Parigi: Francia, torre
Roma: capitale, antica
New York: grattacieli, America
Egitto: piramidi, deserto
Hotel: camera, vacanza
Carcere: sbarre, guardia
Banca: soldi, sportello
Fattoria: animali, campagna
` },
  {
    id: "mestieri", nome: "Mestieri", icona: "👷", parole: `
Medico: camice, ospedale
Pompiere: fuoco, sirena
Cuoco: cucina, cappello
Insegnante: scuola, lavagna
Poliziotto: divisa, multa
Pilota: aereo, cielo
Astronauta: spazio, casco
Parrucchiere: capelli, forbici
Idraulico: tubi, perdita
Contadino: campo, trattore
Dentista: denti, trapano
Veterinario: animali, cura
Muratore: mattoni, cantiere
Postino: lettere, bicicletta
Cameriere: vassoio, mancia
Pescatore: mare, pazienza
Calciatore: pallone, gol
Giornalista: notizie, intervista
Elettricista: fili, corrente
Avvocato: tribunale, difesa
Fotografo: scatto, obiettivo
Panettiere: notte, farina
Cantante: microfono, palco
Mago: cilindro, trucco
Meccanico: officina, motore
Infermiere: siringa, turno
Giardiniere: prato, piante
Bagnino: spiaggia, fischietto
` },
  {
    id: "sport", nome: "Sport e tempo libero", icona: "⚽", parole: `
Calcio: pallone, squadra
Tennis: racchetta, rete
Nuoto: piscina, cuffia
Sci: neve, montagna
Basket: alto, palleggio
Pallavolo: rete, schiacciata
Ciclismo: pedali, Giro
Pesca: canna, lago
Boxe: guantoni, ring
Golf: buca, mazza
Scacchi: re, mosse
Surf: onda, tavola
Yoga: respiro, tappetino
Corsa: scarpe, fiato
Equitazione: cavallo, sella
Pattinaggio: ghiaccio, giravolta
Karate: cintura, Giappone
Bowling: birilli, pista
Campeggio: tenda, natura
Puzzle: pezzi, pazienza
Carte da gioco: mazzo, partita
Videogiochi: console, livello
Escursionismo: sentiero, zaino
Ping pong: pallina, tavolo
Formula 1: velocità, Ferrari
Danza: musica, tutù
Karaoke: canzone, microfono
Paracadutismo: aereo, salto
` },
  {
    id: "trasporti", nome: "Mezzi di trasporto", icona: "🚗", parole: `
Automobile: volante, benzina
Bicicletta: pedali, catena
Treno: binari, stazione
Aereo: ali, decollo
Nave: porto, crociera
Motorino: casco, traffico
Autobus: fermata, biglietto
Elicottero: eliche, volo
Metropolitana: sottoterra, città
Taxi: giallo, tassametro
Sottomarino: profondità, periscopio
Razzo: spazio, conto alla rovescia
Mongolfiera: aria calda, cesto
Trattore: campi, lento
Ambulanza: sirena, urgenza
Gondola: Venezia, remo
Monopattino: elettrico, marciapiede
Camion: merci, autostrada
Funivia: montagna, cavo
Canoa: pagaia, fiume
Skateboard: rotelle, acrobazie
Carrozza: cavalli, principessa
Tram: rotaie, città
Slitta: neve, Babbo Natale
Barca a vela: vento, mare
` },
  {
    id: "natura", nome: "Natura e tempo", icona: "🌳", parole: `
Arcobaleno: colori, pioggia
Vulcano: fuoco, montagna
Neve: inverno, bianco
Temporale: tuoni, nuvole
Fiume: acqua, ponte
Cascata: acqua, rumore
Foresta: alberi, ombra
Sole: caldo, giorno
Luna: notte, crateri
Stella: notte, desiderio
Girasole: giallo, estate
Rosa: spine, profumo
Fulmine: luce, cielo
Terremoto: scossa, paura
Ghiacciaio: freddo, montagna
Oceano: blu, enorme
Nebbia: grigio, autunno
Vento: aria, aquilone
Albero: radici, foglie
Fungo: bosco, autunno
Conchiglia: spiaggia, mare
Grotta: buio, roccia
Tramonto: sera, arancione
Lago: calmo, barca
Cactus: spine, deserto
Eclissi: buio, sole
` },
  {
    id: "vestiti", nome: "Vestiti e accessori", icona: "👕", parole: `
Cappello: testa, sole
Sciarpa: collo, inverno
Guanti: mani, freddo
Cravatta: nodo, elegante
Costume da bagno: mare, estate
Pigiama: notte, letto
Stivali: pioggia, alti
Occhiali da sole: estate, lenti
Jeans: blu, tasche
Calzini: piedi, coppia
Borsa: spalla, chiavi
Anello: dito, matrimonio
Collana: collo, perle
Cintura: pantaloni, fibbia
Felpa: cappuccio, sport
Ciabatte: casa, piedi
Vestito da sposa: bianco, matrimonio
Cappotto: inverno, bottoni
Tuta: sport, comoda
Gonna: pieghe, estate
Grembiule: cucina, scuola
Parrucca: capelli, finto
Tacchi: alti, eleganti
Bretelle: pantaloni, elastico
Orecchini: orecchie, gioielli
` },
  {
    id: "feste", nome: "Feste e occasioni", icona: "🎉", parole: `
Natale: albero, regali
Capodanno: mezzanotte, brindisi
Carnevale: maschere, coriandoli
Pasqua: uova, primavera
Halloween: zucca, paura
Compleanno: torta, candeline
Matrimonio: sposi, anelli
Ferragosto: estate, mare
San Valentino: amore, cuori
Befana: calza, scopa
Laurea: università, alloro
Battesimo: bambino, chiesa
Pic-nic: prato, cestino
Festa a sorpresa: segreto, urlo
Concerto: palco, folla
Sagra: paese, cibo
Grigliata: carne, fumo
Gita scolastica: pullman, classe
Pigiama party: amici, notte
Vacanza: valigia, relax
Festa della mamma: fiori, regalo
Luna di miele: viaggio, sposi
Cenone: tavola, famiglia
Pesce d'aprile: scherzo, primavera
Tombola: numeri, Natale
` },
  {
    id: "spettacolo", nome: "Musica e spettacolo", icona: "🎸", parole: `
Chitarra: corde, falò
Pianoforte: tasti, bianco e nero
Batteria: tamburi, rumore
Violino: archetto, orchestra
Tromba: fiato, jazz
Microfono: voce, palco
Circo: clown, tendone
Teatro: sipario, attori
Sanremo: festival, canzoni
Opera lirica: Verdi, voce
Flauto: fiato, scuola
Arpa: corde, angeli
Fisarmonica: mantice, liscio
Orchestra: direttore, musicisti
Cartone animato: bambini, disegni
Fumetto: disegni, edicola
Film horror: paura, buio
Telegiornale: notizie, sera
Applauso: mani, fine
Ballerina: punte, tutù
DJ: console, discoteca
Mimo: silenzio, gesti
Marionetta: fili, legno
` },
];
