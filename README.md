# ToDoList - API 

## Descrizione

Il progetto prevede la progettazione e lo sviluppo di una API RESTful dedicata alla gestione di task personali. E' prevista la possibilità di autenticarsi al servizio, e successivamente di svolgere le CRUD relative alle task.

## Stack tecnologico

- **Node.js**: Runtime JavaScript utilizzato per lo sviluppo lato server.
- **Express.js**: Framework web leggero e minimalista per la creazione di API e applicazioni backend con Node.js.
- **JWT (JSON Web Token)**: Sistema sicuro per autenticazione e autorizzazione basato su token.
- **Prisma**: ORM di nuova generazione per la gestione e l’interazione con il database.
- **PostgreSQL**: Database relazionale open source potente, affidabile e scalabile.
- **Zod**: Libreria di validazione schema orientata a TypeScript per il controllo dei dati.
- **Vitest**: Framework moderno e performante per il testing di applicazioni JavaScript e TypeScript.
- **JSDoc**: Strumento per la generazione automatica della documentazione del codice tramite commenti strutturati.

### Motivazioni
Non avendo particolare familiarità con lo sviluppo di API in Node.js, lo stack tecnologico è stato definito tenendo conto di diversi fattori. In particolare, trattandosi di un servizio web di dimensioni ridotte, le tecnologie sono state scelte privilegiando l’**efficienza**, **semplicità d'implementazione** e **la popolarità**. Quest’ultimo aspetto ha permesso di reperire facilmente documentazione e risorse utili per l’implementazione delle funzionalità richieste, incluse eventuali estensioni.

## Esecuzione
### Esecuzione API
L'esecuzione è stata unificata grazie all'implementazione di Docker, grazie al quale è possibile eseguire il servizio con un solo comando:
```
docker compose --build
```
Il servizio sarà raggiungibile al seguente indirizzo:
```
http://localhost:8080
```
con la documentazione dell'API a questo link una volta avviato il Docker:
```
http://localhost:8080/docs
```
### Esecuzione Test
I test sono stati svolti utilizzando Vitest, e per eseguirli è necessario eseguire i seguenti passaggi: 
- **Installare le dipendenza**
```
npm install
```
- **Generare i file Prisma**
```
npx prisma generate
```
- **Eseguire lo scipt**
```
npm run coverage
```
È stato possibile testare gran parte dell’API, ad eccezione delle casistiche relative agli errori interni. 

![Sceen test](test_coverage.png)
Come mostrato nell’immagine seguente, è stata raggiunta una buona percentuale di copertura dei test del servizio.

Progettato da Ossama Nadifi per Mr. Apps