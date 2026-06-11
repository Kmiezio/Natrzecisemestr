const API_URL = "https://www.cheapshark.com/api/1.0/deals?storeID=1";

const wyszukiwarka = document.getElementById("search-box");
const wpisane = document.getElementById("search-input");
const glownykontener = document.getElementById("kontener-gier");
const przyciskWiecej = document.getElementById("load-more-btn");

let pobraneGry = [];
let aktualnyFiltr = "all";
let limitGier = 20;

wyszukiwarka.addEventListener("submit", (event) => {
    event.preventDefault();
    const wpisanyTekst = wpisane.value.trim();
    if(wpisanyTekst !== "") {
        const SZUKANA = `https://www.cheapshark.com/api/1.0/deals?title=${wpisanyTekst}`;
        limitGier = 20;
        PobierzDaneZApi(SZUKANA);
    }
});

function PobierzDaneZApi(ZmiennyApi) {
    fetch(ZmiennyApi)
        .then(response => {
            if (!response.ok) {
                throw new Error("Błąd ładowania danych z API");
            }
            return response.json();
        })
        .then(gryZApi => {
            pobraneGry = gryZApi;
            RenderujGry();
        })
        .catch(error => {
            console.error("Szczegóły błędu:", error);
            WyswietlBlad();
        });
}

function RenderujGry() {
    if (!glownykontener) return;

    while (glownykontener.firstChild) {
        glownykontener.removeChild(glownykontener.firstChild);
    }

    const przefiltrowane = pobraneGry.filter(gra => {
        const cena = parseFloat(gra.salePrice);
        const oszczednosc = parseFloat(gra.savings);
        if (aktualnyFiltr === "cheap") return cena < 3.00;
        if (aktualnyFiltr === "sale") return oszczednosc > 80.00;
        return true;
    });

    if (przefiltrowane.length === 0) {
        const brakWynikow = document.createElement("p");
        brakWynikow.textContent = "Brak gier spełniających kryteria.";
        brakWynikow.style.textAlign = "center";
        glownykontener.appendChild(brakWynikow);
        if (przyciskWiecej) przyciskWiecej.style.display = "none";
        return;
    }

    const doWyswietlenia = przefiltrowane.slice(0, limitGier);

    doWyswietlenia.forEach(jednaGra => {
        const kartagier = document.createElement("a");
        kartagier.className = "game-card";
        kartagier.href = `artykuly.html?dealID=${jednaGra.dealID}`;
        kartagier.style.textDecoration = "none"; 

        const elObrazek = document.createElement("img");
        elObrazek.src = jednaGra.thumb;
        elObrazek.alt = jednaGra.title;
        elObrazek.style.width = "120px";
        elObrazek.style.height = "75px";
        elObrazek.style.objectFit = "contain";
        elObrazek.style.backgroundColor = "#101010";
        elObrazek.style.borderRadius = "4px";

        const tekst = document.createElement("div");
        tekst.style.display = "flex";
        tekst.style.flexDirection = "column";

        const nagluowektytulu = document.createElement("h4");
        nagluowektytulu.innerText = jednaGra.title;
        nagluowektytulu.style.color = "#00ff66";
        nagluowektytulu.style.margin = "0 0 5px 0";

        const akapitopisu = document.createElement("p");
        akapitopisu.style.margin = "0";
        akapitopisu.style.fontSize = "14px";
        akapitopisu.style.color = "#ccc";

        const tekstCena = document.createTextNode("Cena: ");
        
        const staraCena = document.createElement("span");
        staraCena.textContent = jednaGra.normalPrice + " $";
        staraCena.style.textDecoration = "line-through";
        staraCena.style.color = "#ff5555";

        const spacja = document.createTextNode(" ");

        const nowaCena = document.createElement("span");
        nowaCena.textContent = jednaGra.salePrice + " $";
        nowaCena.style.fontWeight = "bold";
        nowaCena.style.color = "#ffffff";

        akapitopisu.appendChild(tekstCena);
        akapitopisu.appendChild(staraCena);
        akapitopisu.appendChild(spacja);
        akapitopisu.appendChild(nowaCena);

        tekst.appendChild(nagluowektytulu);
        tekst.appendChild(akapitopisu);

        kartagier.appendChild(elObrazek);
        kartagier.appendChild(tekst);

        glownykontener.appendChild(kartagier);
    });

    if (przyciskWiecej) {
        if (limitGier >= przefiltrowane.length) {
            przyciskWiecej.style.display = "none"; 
        } else {
            przyciskWiecej.style.display = "inline-block"; 
        }
    }
}

if (przyciskWiecej) {
    przyciskWiecej.onclick = () => {
        limitGier += 20; 
        RenderujGry();         
    };
}

const filtrKontener = document.querySelector(".filter-container");
if (filtrKontener) {
    filtrKontener.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-btn")) {
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            
            aktualnyFiltr = e.target.getAttribute("data-price");
            limitGier = 20; 
            RenderujGry();
        }
    });
}

function WyswietlBlad() {
    if (!glownykontener) return;
    while (glownykontener.firstChild) {
        glownykontener.removeChild(glownykontener.firstChild);
    }
    if (przyciskWiecej) przyciskWiecej.style.display = "none";

    const napisBledu = document.createElement("p");
    napisBledu.textContent = "Wystąpił błąd podczas ładowania gier z API!";
    napisBledu.style.color = "#ff3333";
    napisBledu.style.textAlign = "center";
    napisBledu.style.fontWeight = "bold";
    napisBledu.style.padding = "20px";
    glownykontener.appendChild(napisBledu);
}

document.addEventListener("DOMContentLoaded", () => { 
    PobierzDaneZApi(API_URL);
});s