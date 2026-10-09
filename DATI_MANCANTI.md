# Feltrin: dati mancanti e scelte inferite

Fonte dei dati: feltrin.it (Home, Chi siamo, Lavorazioni, Contatti), letto il 9 ottobre 2026.
Il titolo della pagina "Chi siamo" sul sito contiene "OLD": potrebbe non essere aggiornata.

## 1. Dati verificati sul sito e usati nella pagina

| Dato | Valore | Dove |
|---|---|---|
| Payoff | "Il metallo in tutte le sue forme" | footer |
| Fondazione | "Nata nel 1991", "Lavoriamo il metallo dal 1991" | hero, numeri |
| Specializzazione | prodotti di alta qualità e design per l'arredamento domestico e commerciale | meta description |
| Lavorazioni | laser tubo, laser lamiera, piegatura automatizzata, saldatura, pulitura, pressatura, maschere e stampi | card Lavorazioni |
| Robot | "robot specializzati" per saldatura e pulitura; "parco macchine completo e all'avanguardia" | Lavorazioni, capitolo 3 hero |
| Processo | supporto dalle prime fasi, test di fattibilità, prove iniziali, collaudo, maschere e stampi, produzione in larga scala | step "Per chi produce" |
| Tempi | "tempi di consegna più rapidi" | card saldatura |
| Garanzia | "La nostra migliore garanzia è la prova del tempo…" | citazione |
| Indirizzo | Via Asolana 168, 31010 Onè di Fonte (TV) | contatti, footer |
| Telefoni | 0423 950142 e 335 5467238 | contatti, footer |
| Email | info@feltrin.it | contatti, footer, form |
| Orari | Lun–Ven 8:00–12:00 / 13:00–17:00, sabato e domenica chiuso | contatti, footer |
| P. IVA | 02324470265 | footer, privacy |

## 2. Dati che NON ci sono sul sito (non inventati)

Per ciascuno la sezione regge anche senza.

| Dato mancante | Impatto | Cosa serve |
|---|---|---|
| **Ragione sociale completa** (srl, spa…), capitale sociale, REA | Il footer riporta solo "Feltrin Arredamenti" e la P. IVA | Visura camerale |
| **PEC** | Non mostrata | Indirizzo PEC |
| **LinkedIn**: URL della pagina aziendale | Il link non viene mostrato finché `CONFIG.linkedinUrl` è vuoto | URL ufficiale; compilare `linkedinUrl` in `Homepage.jsx` |
| **Endpoint del form** | Senza `CONFIG.formEndpoint` il form apre il client di posta (mailto) e lo dice nel messaggio di successo | Account Formspree o simile, oppure un endpoint interno; in alternativa la prop `onSubmit` |
| **Informativa privacy ufficiale** | La finestra "Privacy" contiene un testo sintetico scritto da me | Testo legale (e cookie policy se si aggiungono analytics) |
| **Metri quadri** dello stabilimento, numero di macchine | Nessun numero di capacità mostrato | Dati reali |
| **Numero di addetti**, volumi annui, capacità produttiva | Nessun numero mostrato | Dati reali |
| **Certificazioni** (ISO 9001, ISO 3834, EN 1090…) | Nessuna sezione dedicata a certificazioni | Certificati in corso di validità |
| **Materiali lavorati** (acciaio inox, acciaio al carbonio, alluminio…) | Il sito parla di "metallo", "tubo" e "lamiera". Nel copy uso "metallo"; l'acciaio compare solo nelle immagini | Elenco materiali, spessori e diametri massimi |
| **Marche e tipologia delle macchine** (potenza laser, tonnellaggio presse, formati lamiera) | Nessuna scheda tecnica | Scheda macchine |
| **Settori e dimensione dei clienti** | Volutamente assenti (NDA). Resta solo "arredamento domestico e commerciale" | Nessuno: va bene così |
| **Loghi/foto reali** dello stabilimento | Tutte le immagini sono generate | Foto reali del reparto, se si vuole sostituirle |
| **Logo in alta risoluzione o vettoriale** | Il PNG fornito è 250×84 px: l'ho reso trasparente e ingrandito, ma a schermi 3x si nota la morbidezza | SVG o PNG ad alta risoluzione |
| **Dominio e hosting** | Il sito non è pubblicato | Decisione |

## 3. Scelte che sono una MIA inferenza (da confermare)

Etichettate come tali, non sono dati del sito né richieste del brief.

**Copy**
- "Dal disegno al componente, in metallo": headline e tutti i testi dei capitoli del hero, scritti da me sul tono richiesto.
- I benefici delle sei card sono miei, tranne due ripresi dal sito (saldatura: tempi di consegna più rapidi; pressatura/stampi: efficienza e precisione in larga scala).
- "Il tubo arriva già pronto per saldatura e assemblaggio": inferenza di processo, non scritta sul sito.
- "Accanto a chi lo ha disegnato" (step Progettazione): inferenza dal "supportiamo i clienti fin dalle prime fasi".
- Raggruppamento in 4 step (progettazione, ingegnerizzazione, collaudo e attrezzature, produzione in serie): ordine e nomi sono miei, i contenuti vengono dalla pagina Lavorazioni (che titola "Progettazione", "Ingegnerizzazione", "Lavorazione automatizzata").
- "Attrezzature su misura: maschere e stampi nascono per il vostro pezzo": inferenza dal fatto che il sito li realizza per i clienti.
- Blocco riservatezza (nessun cliente citato, NDA, attrezzature dedicate): ripreso dal brief, non dal sito. Verificare che "collaborazioni sotto NDA" sia vero per tutte.
- "Fissiamo un incontro, senza impegno, nel pieno riserbo" e "Il vostro progetto resta vostro": promesse commerciali da validare con la proprietà.
- Numero "6 lavorazioni": conteggio delle voci elencate sul sito (laser tubo, laser lamiera, piegatura, saldatura, pulitura, pressatura). Se si contano diversamente, cambiare il numero.
- "8–17 · ci trovate in azienda": derivato dagli orari Lun–Ven.
- "1991 · lavoriamo il metallo da allora": uso solo l'anno, senza calcolare "35 anni".

**Design**
- Colore **#7BA3FF** (`accentSoft`): tinta chiara dell'accento #0052FF, usata solo per testo e link su fondi scuri. Il #0052FF su #1E222A ha contrasto circa 2,7:1, sotto la soglia AA.
- Gradiente di testo sulle sezioni chiare: da #1E222A a #0052FF (il bianco→blu del brief non si legge su sfondo chiaro).
- Rosso errore #B3261E nel form (non è un colore del brand).
- Zoom 1,1 con ancoraggio a destra e scorrimento laterale del 9% nel capitolo finale: serve per tenere il componente lontano dal testo.
- Immagini: stile "acciaio satinato, luce blu sui bordi" in coerenza con la palette. Nessuna immagine ritrae macchinari o lavorazioni reali di Feltrin.
- "Sei card uguali" in griglia 3×2: scelta per simmetria, nessuna lavorazione è presentata come principale.
- Navigazione desktop da 1024 px in su, hamburger sotto.
- Slow device: oltre ai 5 gate della skill, hero statico se `saveData`, rete ≤3G o `deviceMemory` ≤ 2 GB.

**Tecnica**
- Sequenza: 300 frame WebP 1280×720 (q62, circa 17 KB l'uno, 5,3 MB totali), da 4 clip Kling 2.5 1080p tagliate nelle code ferme, con dissolvenza tra frame vicini e preload progressivo (1 frame ogni 16, poi 4, 2, 1).
- Il form usa `mailto:` quando non c'è un endpoint: lo stato "successo" in quel caso dice che si è aperta la posta, non che il messaggio è partito.
- Privacy: testo sintetico generico (titolare, dati, finalità, diritti), da far rivedere.
