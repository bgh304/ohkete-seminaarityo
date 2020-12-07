const express = require('express');
const app = express();
const fetch = require('node-fetch');
const delay = require('delay');
'use strict'

function getLevyyhtioLevyt() {
    return fetch(process.argv[2] + "/releases").then(response => response.json());
    //ESIM. https://api.discogs.com/labels/153
}

function getLevyyhtioLevyt2() {
    return fetch(process.argv[3] + "/releases").then(response => response.json());
    //ESIM. https://api.discogs.com/labels/123
}

function getLevyyhtio() {
    return fetch(process.argv[2]).then(response => response.json());
}

function getLevyyhtio2() {
    return fetch(process.argv[3]).then(response => response.json());
}

let levyyhtio = [];
let levyyhtio2 = [];

async function taulukoksi(levyyhtioP) {
    if (levyyhtioP == levyyhtio) {
        this.levyyhtio = await getLevyyhtioLevyt();
        return this.levyyhtio.releases.map(levy => levy.id);
    }

    if (levyyhtioP == levyyhtio2) {
        this.levyyhtio2 = await getLevyyhtioLevyt2();
        return this.levyyhtio2.releases.map(levy => levy.id);
    }
}

function getLevy(id) {
    return fetch('https://api.discogs.com/releases/' + id).then(response => response.json());
}

let nimi = "";
let nimi2 = "";
let levyjenKeskiarvo = 0;
let levyjenKeskiarvo2 = 0;

async function keskiarvo(levyyhtioP) {
    let idTaulukko = await taulukoksi(levyyhtioP);
    let levy = "";
    let hinnat = 0;
    let kpl = 0;
    let levyyhtioNimi = "";

    if (levyyhtioP == levyyhtio) {
        levyyhtioNimi = await getLevyyhtio();
        nimi = levyyhtioNimi.name;
    } else {
        levyyhtioNimi = await getLevyyhtio2();
        nimi2 = levyyhtioNimi.name;
    }

    for (let i = 15; i < 22; i++) {
        levy = await getLevy(idTaulukko[i]);
        await delay(1500);
        if (levy.lowest_price > 0) {
            hinnat += levy.lowest_price;
            kpl++;
        }
        console.log(levy.lowest_price + "\t" + levy.title + " / " + levyyhtioNimi.name.toUpperCase());
    }

    console.log(levyyhtioNimi.name.toUpperCase() + " levyjen hintojen keskiarvo on: " + hinnat / kpl);

    if (levyyhtioP == levyyhtio) {
        levyjenKeskiarvo = hinnat / kpl;
    } else {
        levyjenKeskiarvo2 = hinnat / kpl;
    }
}

keskiarvo(levyyhtio);
keskiarvo(levyyhtio2);

let prosentti = null;

async function vertaa() {
    await delay(21000);
        if (levyjenKeskiarvo > levyjenKeskiarvo2) {
            prosentti = Math.round(((levyjenKeskiarvo * 100) / levyjenKeskiarvo2) - 100);
            console.log(nimi + "-levyt on " + prosentti + "% kalliimpia kuin " + nimi2 + "-levyt.");
        } else {
            prosentti = Math.round(((levyjenKeskiarvo2 * 100) / levyjenKeskiarvo) - 100);
            console.log(nimi2 + "-levyt on " + prosentti + "% kalliimpia kuin " + nimi + "-levyt.");
        }
}

vertaa();

app.listen(3000, () => console.log('pyörii'));