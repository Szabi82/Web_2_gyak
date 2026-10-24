require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const Cinema = require("./models/Cinema");
const Screening = require("./models/Screening");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/web2_mozi";

async function seedDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Adatbázis csatlakozva");

       
        await Movie.deleteMany({});
        await Cinema.deleteMany({});
        await Screening.deleteMany({});

        
        await Movie.insertMany([
            { fkod: 4, filmcim: "Amelie csodálatos élete", szines: -1, szinkron: "mb", szarmazas: "francia-német", mufaj: "vígjáték", hossz: 117 },
            { fkod: 5, filmcim: "Annie Hall", szines: -1, szinkron: "mb", szarmazas: "amerikai", mufaj: "vígjáték", hossz: 89 },
            { fkod: 18, filmcim: "Charlie és a csokigyár", szines: -1, szinkron: "mb", szarmazas: "amerikai-angol", mufaj: "vígjáték", hossz: 106 },
            { fkod: 48, filmcim: "Harry Potter és a Tűz Serlege", szines: -1, szinkron: "mb", szarmazas: "amerikai", mufaj: "fantasy", hossz: 157 },
            { fkod: 73, filmcim: "Kontroll", szines: -1, szinkron: "", szarmazas: "magyar", mufaj: "thriller", hossz: 102 },
            { fkod: 107, filmcim: "Ponyvaregény - Pulp Fiction", szines: -1, szinkron: "fel", szarmazas: "amerikai", mufaj: "filmszatíra", hossz: 150 }
        ]);

       
        await Cinema.insertMany([
            { moziazon: 6, mozinev: "Cinema City Csepel Plaza", irszam: 1212, cim: "Rákóczi F. út 154-170.", telefon: "4258111" },
            { moziazon: 9, mozinev: "Corvin Budapest Filmpalota", irszam: 1082, cim: "Corvin köz 1.", telefon: "4595050" },
            { moziazon: 24, mozinev: "Művész", irszam: 1066, cim: "Teréz krt. 30.", telefon: "3326726" },
            { moziazon: 32, mozinev: "Puskin", irszam: 1053, cim: "Kossuth L. u. 18.", telefon: "4296080" }
        ]);

   
        await Screening.insertMany([
            { fkod: 4, moziazon: 21 },
            { fkod: 5, moziazon: 27 },
            { fkod: 18, moziazon: 3 },
            { fkod: 48, moziazon: 6 },
            { fkod: 73, moziazon: 21 },
            { fkod: 107, moziazon: 24 }
        ]);

        console.log("Az adatbázis sikeresen feltöltve tesztadatokkal!");
        process.exit();
    } catch (err) {
        console.error("Hiba a seedelés során:", err);
        process.exit(1);
    }
}

seedDB();
