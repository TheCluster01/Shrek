// Szabó Mónika, Simon Etele - Shrek Öltöztetős Játék

// Szoki dolgok a JS elején
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Ruhák importálása (forrás, x, y)
const kepek = [
    { forras: '/assets/Piros felső.png', x: canvas.width / 2.2, y: 40 },
    { forras: '/assets/Kék felső.png', x: canvas.width / 1.5, y: 40 },   
    { forras: '/assets/Kék nadrág.png', x: canvas.width / 1.9, y: 370 }, 
    { forras: '/assets/Zöld nadrág.png', x: canvas.width / 1.3, y: 370 },
    { forras: '/assets/Pink cipő.png', x: canvas.width / 2.06, y: 580 }, 
    { forras: '/assets/Szürke cipő.png', x: canvas.width / 1.3, y: 580 } 
];

// Képek betöltése és méretük beállítása
kepek.forEach(ruhadarab => { // Minden ruhadarab képet végigjárunk
    const kep = new Image(); // Új képobjektumot hozunk létre
    kep.src = ruhadarab.forras; // Beállítjuk a kép forrását
    kep.onload = () => { // Miután a kép betöltődött...
        ruhadarab.szelesseg = kep.width / 3; // A kép szélességét harmadoljuk
        ruhadarab.magassag = kep.height / 3; // A kép magasságát harmadoljuk
        ctx.drawImage(kep, ruhadarab.x, ruhadarab.y, ruhadarab.szelesseg, ruhadarab.magassag); // Kirajzoljuk a képet a megadott pozícióra és méretben
    };
    ruhadarab.kep = kep; // Tároljuk a képobjektumot a ruhadarab struktúrában
});

// Ruházati képek újrarajzolása
function ujraRajzolas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Tisztítjuk a teljes canvas-t
    kepek.forEach(ruhadarab => { // Végigjárjuk a képeket
        ctx.drawImage(ruhadarab.kep, ruhadarab.x, ruhadarab.y, ruhadarab.szelesseg, ruhadarab.magassag); // Újrarajzoljuk minden képet a megadott pozícióra és méretben
    });
}

// Ellenőrzés, hogy az egér egy kép felett van-e
function kepPozicional(x, y) {
    return kepek.find(kep => // Keresünk egy olyan képet, aminél az egér az adott pozícióban van
        x >= kep.x && x <= kep.x + kep.szelesseg && // X koordináta ellenőrzése
        y >= kep.y && y <= kep.y + kep.magassag // Y koordináta ellenőrzése
    );
}

let kivalasztottKep = null; // Az éppen kiválasztott kép
let eltolX, eltolY; // Az eltolás a kép bal felső sarkától

// Húzás indítása
canvas.addEventListener('mousedown', (e) => { // 'mousedown' esemény kezelése
    const { left, top } = canvas.getBoundingClientRect(); // A canvas pozíciója az ablakban
    const x = e.clientX - left; // Az egér x koordinátája a canvason
    const y = e.clientY - top; // Az egér y koordinátája a canvason
    const kep = kepPozicional(x, y); // Megkeressük, hogy melyik képen van az egér

    if (kep) { // Ha egy kép felett van az egér...
        kivalasztottKep = kep; // Beállítjuk a kiválasztott képet
        eltolX = x - kep.x; // Eltolás az x koordináta szerint
        eltolY = y - kep.y; // Eltolás az y koordináta szerint

        // Ez arra kell, hogy a legutóbb mozgatott elemet legfelülre rajzoljuk ki!
        const index = kepek.indexOf(kep); // Az aktuális kép indexe
        if (index > -1) { // Ha a kép megtalálható a kepek tömbben...
            kepek.push(kepek.splice(index, 1)[0]); // Az aktuális képet áthelyezzük a tömb végére, hogy a legfelül legyen
        }
    }
});

// Kép mozgatása
canvas.addEventListener('mousemove', (e) => { // 'mousemove' esemény kezelése
    if (kivalasztottKep) { // Ha van kiválasztott kép...
        const { left, top } = canvas.getBoundingClientRect(); // A canvas pozíciója az ablakban
        kivalasztottKep.x = e.clientX - left - eltolX; // Az új x pozíció beállítása az eltolással
        kivalasztottKep.y = e.clientY - top - eltolY; // Az új y pozíció beállítása az eltolással
        ujraRajzolas(); // Újrarajzoljuk a képeket, hogy az elmozdulás megjelenjen
    }
});

// Húzás befejezése
canvas.addEventListener('mouseup', () => { // 'mouseup' esemény kezelése
    kivalasztottKep = null; // A kiválasztott képet töröljük, mert befejeztük a húzást
});
