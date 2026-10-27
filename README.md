# impostore

Il gioco dell'impostore da giocare con un telefono solo, passandolo di mano in mano. Pagina statica servita da nginx in un container Docker sul Raspberry Pi: tutto il gioco gira nel browser, niente server, niente account, niente dati salvati sul Pi.

- Pagina: `https://impostore.<tailnet>.ts.net` dalla tailnet (indirizzo della repo `ingressi-https`), oppure `http://IP-DEL-PI:8089` (o `http://vito:8089`) come riserva.
- Si apre anche dal riquadro **Impostore** della homepage.

## Come si gioca

1. Si scrivono i nomi dei giocatori (almeno 3, nell'ordine in cui si è seduti), si sceglie quanti impostori (1, oppure di più dai 5 giocatori in su) e le categorie di parole.
2. L'app sceglie a caso una parola segreta e l'impostore.
3. Il telefono passa di mano in mano: ognuno tocca "Sono io: mostra la carta", legge e nasconde. Tutti vedono la parola e la categoria, l'impostore vede in rosso **Sei l'impostore** e solo **un indizio**. Due interruttori nelle impostazioni: **Indizio per l'impostore** (acceso di base) e **Categoria per l'impostore** (spento di base: insieme all'indizio a volte svela la parola, es. "tasti" + "Musica" = pianoforte).
4. L'app dice chi inizia: a turno ognuno dice una parola collegata a quella segreta, senza svelarla.
5. Si vota a voce e si tocca il nome di chi ha preso più voti. L'app dice se era l'impostore; poi l'impostore prova a indovinare la parola e infine si mostra la parola segreta.
6. "Gioca ancora" rifà la partita con gli stessi giocatori: nuova parola, nuovo impostore.

Dettagli:
- Le parole già uscite non si ripetono finché non sono uscite tutte quelle delle categorie scelte (memoria del browser).
- Nomi, impostori, categorie e interruttori restano salvati nel browser per la volta dopo.
- Se la pagina si ricarica a metà partita, la partita riprende da "Passa il telefono a…", mai da una carta aperta.
- Aperto in HTTPS, lo schermo resta acceso durante la partita.

## Aggiungere parole o categorie

Le parole sono in `app/parole-impostore.js`, una riga per parola con due indizi per l'impostore (a ogni partita ne esce uno a caso):

```
Pizza: forno, Napoli
```

Un buon indizio è collegato alla parola ma va bene anche per altre cose (per "Pizza", "forno" e non "margherita"). Per una categoria nuova basta copiare un blocco (`id`, `nome`, `icona`, `parole`). Si può fare anche da GitHub (matita sul file, conferma su `main`): entro 5 minuti il Pi si aggiorna da solo.

## Installazione sul Raspberry Pi

```bash
cd ~
git clone https://github.com/Vito-Pepe/impostore.git
cd impostore
docker compose up -d --build
curl -I http://127.0.0.1:8089
```

Risposta attesa: `HTTP/1.1 200 OK`.

Aggiornamento automatico ogni 5 minuti (senza sudo):

```bash
(crontab -l 2>/dev/null; echo "*/5 * * * * cd $HOME/impostore && ./update.sh >> $HOME/impostore/update.log 2>&1") | crontab -
```

Indirizzo HTTPS senza porta: servizio `impostore` nella repo `ingressi-https` (vedi il suo README).

## Sicurezza

Il container è in sola lettura (`read_only`, con le cartelle temporanee di nginx in memoria), senza capacità di Linux tranne le tre che servono a nginx per partire con l'utente `nginx`, `no-new-privileges` e limite di processi. La pagina non chiama nessun indirizzo esterno (Content-Security-Policy `default-src 'self'`), non usa cookie e niente esce su Internet.

## Porte

| Uso | Porta |
|---|---|
| Pagina (LAN e tailnet, http) | 8089 (8080–8088 sono di altre app) |
