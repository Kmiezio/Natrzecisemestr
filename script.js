const API_URL = "https://www.cheapshark.com/api/1.0/deals?storeID=1";

function WyswietlanieGier() {
    const glownykontener = document.querySelector(".main-section-center");

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Błąd ładowania danych z API");
            }
            return response.json();
        })
        .then(gryZApi => {
            glownykontener.innerHTML = ""; 

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
                akapitopisu.innerHTML = `Cena: <span style="text-decoration: line-through; color: #ff5555;">${jednaGra.normalPrice} $</span> <span style="font-weight: bold; color: #ffffff;">${jednaGra.salePrice} $</span>`;
                akapitopisu.style.margin = "0";
                akapitopisu.style.fontSize = "14px";

                tekst.appendChild(nagluowektytulu);
                tekst.appendChild(akapitopisu);

                kartagier.appendChild(elObrazek);
                kartagier.appendChild(tekst);

                glownykontener.appendChild(kartagier);
            });
        })
        .catch(error => {
            console.error("Szczegóły błędu:", error);
            const glownykontener = document.querySelector(".main-section-center");
            if (glownykontener) {
                glownykontener.innerHTML = `
                    <div style="color: #ff3333; padding: 30px; text-align: center; font-family: Arial; width: 100%;">
                        <h3>Problem z załadowaniem API!</h3>
                        <p>Komunikat błędu: ${error.message}</p>
                        <p style="color: #aaa; font-size: 12px;">Sprawdź, czy masz połączenie z internetem lub czy adres URL jest poprawny.</p>
                    </div>
                `;
            }
        });
}

document.addEventListener("DOMContentLoaded", WyswietlanieGier);