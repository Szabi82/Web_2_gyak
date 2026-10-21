# Mozi Projekt (Film Adatbázis & Admin Felület)

Egy modern, Node.js és Express alapú webalkalmazás filmek nyilvántartására, adminisztrációjára, statisztikák megjelenítésére és kapcsolati üzenetek kezelésére, Darkpan sötét témájú felülettel.

---

## Főbb funkciók és modulok

- **Felhasználói kezelés:** Regisztráció, bejelentkezés, kijelentkezés és szerepkör-alapú jogosultságkezelés (`admin` / `user`).
- **Film Adatbázis (CRUD):** 
  - Filmek listázása és részletes megjelenítése.
  - Új film felvétele (`fkod`, cím, színes, szinkron, származás, műfaj, hossz).
  - Meglévő filmek szerkesztése és törlése.
- **Kapcsolati űrlap (Contact Form):** Szerver oldali validációval ellátott üzenetküldő felület, amely az adatokat MongoDB-be menti.
- **Üzenetek nézet:** Beküldött üzenetek listázása az adminisztrátorok számára fordított időrendi sorrendben (`createdAt: -1`).
- **Statisztikai diagram:** Chart.js alapú vizuális adatelemzés / diagram nézet.

---

## Szerver & Adatbázis Működés (Architektúra)

### Szerver (Backend)
- **Környezet:** Node.js futtatókörnyezet Express.js keretrendszerrel.
- **Munkamenet-kezelés (Session):** `express-session` modul felel az azonosításért és a felhasználói állapot (bejelentkezett/admin) megőrzéséért a sütiken (cookies) keresztül.
- **Köztes szoftverek (Middleware):** Custom middleware-ek (`isLoggedIn`, `isAdmin`) gondoskodnak a védett útvonalak és az admin funkciók jogosultság-ellenőrzéséről.
- **Szerver oldali validáció:** A kapcsolati űrlapnál regex alapon ellenőrizzük az e-mail formátumát, valamint a kötelező mezők jelenlétét még az adatbázis-művelet előtt.

### Adatbázis (MongoDB & Mongoose)
- **Adatbázis:** MongoDB cloud adatbázis (MongoDB Atlas) vagy lokális MongoDB szerver.
- **ORM / Modellezés:** Mongoose schemák (sémák) segítségével strukturáltuk az adatokat:
  - `Movie`: Filmek adatai (`fkod` egyedi azonosítóval, `filmcim`, `szines`, `szinkron`, `szarmazas`, `mufaj`, `hossz`).
  - `Message`: Kapcsolati üzenetek (`name`, `email`, `message`, `createdAt` időbélyeggel).
  - `User`: Felhasználói fiókok adatai és szerepkörei.
- **Aszinkron adatkezelés:** A szerver az adatbázis-műveleteket `async/await` szerkezettel, hibakezelő `try-catch` blokkokban végzi.

---

## Használt technológiák

- **Backend:** Node.js, Express.js
- **Adatbázis & ORM:** MongoDB, Mongoose
- **Sablonmotor:** EJS (Embedded JavaScript Templates)
- **Stílus / UI:** Bootstrap 5 alapú Darkpan admin sablon
- **Munkamenet kezelés:** express-session
- **Környezeti változók:** dotenv

---

## Telepítés és helyi futtatás

1. Klónozd a repozitóriumot vagy töltsd le a projektet:
      
   git clone <https://github.com/Szabi82/Web_2_gyak.git>