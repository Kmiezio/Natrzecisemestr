const API_URL = "https://www.cheapshark.com/api/1.0/deals?storeID=1";

const wyszukiwarka = document.getElementById("search-box");
const wpisane = document.getElementById("search-input");

wyszukiwarka.addEventListener("submit", (event) => 
{
    event.preventDefault();
    const wpisanyTekst = wpisane.value.trim();
    if(wpisanyTekst !== "")
    {
        const SZUKANA = `https://www.cheapshark.com/api/1.0/deals?title=${wpisanyTekst}`;
        WyswietlanieGier(SZUKANA);
    }
});

function WyswietlanieGier(ZmiennyApi) {
    const glownykontener = document.getElementById("kontener-gier");

    fetch(ZmiennyApi)
        .then(response => {
            if (!response.ok) {
                throw new Error("Błąd ładowania danych z API");
            }
            return response.json();
        })
        .then(gryZApi => {
            while (glownykontener.firstChild) {
                glownykontener.removeChild(glownykontener.firstChild);
            }

            gryZApi.forEach(jednaGra => {
                const kartagier = document.createElement("div");
                kartagier.className = "game-card";

                const elObrazek = document.createElement("img");
                elObrazek.src = jednaGra.thumb;
                elObrazek.alt = jednaGra.title;
                elObrazek.style.width = "120px";
                elObrazek.style.height = "70px";
                elObrazek.style.objectFit = "cover";
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
        })
        .catch(error => {
            console.error("Szczegóły błędu:", error);
            const glownykontener = document.getElementById("kontener-gier");
            if (glownykontener) {
                while (glownykontener.firstChild) {
                    glownykontener.removeChild(glownykontener.firstChild);
                }

                const napisBledu = document.createElement("p");
                napisBledu.textContent = "Wystąpił błąd podczas ładowania gier!";
                napisBledu.style.color = "#ff3333";
                napisBledu.style.textAlign = "center";
                napisBledu.style.fontWeight = "bold";
                napisBledu.style.padding = "20px";

                glownykontener.appendChild(napisBledu);
            }
        });
}

document.addEventListener("DOMContentLoaded", () => { 
    WyswietlanieGier(API_URL);
});