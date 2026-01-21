 Návod na spustenie aplikácie

1 Požiadavky

Pred spustením aplikácie musí byť nainštalované:

Node.js (verzia 18 alebo novšia)

npm

PostgreSQL

Visual Studio Code (odporúčané)

Overenie:

node -v
npm -v

2 Stiahnutie projektu

Projekt sa otvorí vo Visual Studio Code.

3 Inštalácia závislostí

Pred prvým spustením je nutné nainštalovať závislosti zvlášť pre backend aj frontend.

Backend
cd backend
npm install

Frontend
cd frontend
npm install

4 Spustenie backendu

V priečinku backend:

npm run dev


Backend server sa spustí na adrese:

http://localhost:5000

5 Spustenie frontendu

V novom termináli vo frontend priečinku:

npm run dev


Frontend aplikácia bude dostupná na:

http://localhost:5173

6 Používanie aplikácie

Aplikácia sa používa v prehliadači

Používateľ sa musí zaregistrovať alebo prihlásiť

Neprihlásený používateľ nemá prístup k chráneným častiam aplikácie

 Poznámka

Backend aj frontend bežia samostatne a musia byť spustené súčasne
(v dvoch termináloch).