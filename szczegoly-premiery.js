const RAWG_API_KEY = "771fdf2bdf0d42afa9fd23d435b26eab";
const RAWG_GAMES_API_URL = "https://api.rawg.io/api/games";

const detailsContainer = document.getElementById("premiere-details");
const statusContainer = document.getElementById("premiere-details-status");

function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (textContent !== undefined && textContent !== null) {
        element.textContent = textContent;
    }

    return element;
}

function formatDate(dateString, isTba = false) {
    if (isTba || !dateString) return "Data premiery nie została jeszcze potwierdzona";

    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return "Brak prawidłowej daty premiery";

    return new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function joinNames(items, fallback = "Brak danych") {
    if (!Array.isArray(items) || items.length === 0) return fallback;
    return items.map(item => item.name).filter(Boolean).join(", ") || fallback;
}

function getPlatformNames(game) {
    if (!Array.isArray(game.platforms)) return "Brak danych";
    return game.platforms
        .map(item => item.platform?.name)
        .filter(Boolean)
        .join(", ") || "Brak danych";
}

function createInfoRow(label, value) {
    const row = createElement("div", "premiere-info-row");
    row.append(
        createElement("dt", "premiere-info-label", label),
        createElement("dd", "premiere-info-value", value)
    );
    return row;
}

function createStat(label, value) {
    const stat = createElement("div", "premiere-stat");
    stat.append(
        createElement("span", "premiere-stat-label", label),
        createElement("strong", "premiere-stat-value", value)
    );
    return stat;
}

function createTagList(items) {
    const list = createElement("div", "premiere-detail-tags");

    if (!Array.isArray(items) || items.length === 0) {
        list.appendChild(createElement("span", "premiere-detail-tag muted", "Brak danych"));
        return list;
    }

    items.forEach(item => {
        if (!item?.name) return;
        list.appendChild(createElement("span", "premiere-detail-tag", item.name));
    });

    return list;
}

function createSafeExternalLink(url, text, className) {
    try {
        const parsedUrl = new URL(url);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) return null;

        const link = createElement("a", className, text);
        link.href = parsedUrl.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return link;
    } catch {
        return null;
    }
}

function renderGameDetails(game) {
    detailsContainer.replaceChildren();

    const hero = createElement("section", "premiere-details-hero");
    const coverBox = createElement("div", "premiere-details-cover");

    if (game.background_image) {
        const image = document.createElement("img");
        image.src = game.background_image;
        image.alt = `Okładka gry ${game.name}`;
        image.loading = "eager";
        image.addEventListener("error", () => {
            image.replaceWith(createElement("div", "premiere-details-placeholder", "BRAK OKŁADKI"));
        });
        coverBox.appendChild(image);
    } else {
        coverBox.appendChild(createElement("div", "premiere-details-placeholder", "BRAK OKŁADKI"));
    }

    const summary = createElement("div", "premiere-details-summary");
    summary.appendChild(createElement("p", "premiere-details-kicker", "NADCHODZĄCA PREMIERA"));
    summary.appendChild(createElement("h1", "premiere-details-title", game.name || "Nieznana gra"));
    summary.appendChild(
        createElement("p", "premiere-details-release-date", `Premiera: ${formatDate(game.released, game.tba)}`)
    );

    const genresSection = createElement("div", "premiere-detail-tag-section");
    genresSection.append(
        createElement("h2", "premiere-detail-small-heading", "Gatunki"),
        createTagList(game.genres)
    );
    summary.appendChild(genresSection);

    hero.append(coverBox, summary);

    const stats = createElement("section", "premiere-stats", null);
    const rating = game.ratings_count > 0 ? `${Number(game.rating || 0).toFixed(1)} / 5` : "Brak ocen";
    const metacritic = game.metacritic ? `${game.metacritic} / 100` : "Brak danych";
    const playtime = game.playtime ? `${game.playtime} godz.` : "Brak danych";
    const ageRating = game.esrb_rating?.name || "Brak danych";

    stats.append(
        createStat("Ocena graczy", rating),
        createStat("Metacritic", metacritic),
        createStat("Średni czas gry", playtime),
        createStat("Klasyfikacja wiekowa", ageRating)
    );

    const descriptionSection = createElement("section", "premiere-description-section");
    descriptionSection.appendChild(createElement("h2", "premiere-details-heading", "Opis gry"));

    const description = createElement(
        "p",
        "premiere-details-description",
        game.description_raw?.trim() || "Producent nie udostępnił jeszcze opisu tej gry."
    );
    descriptionSection.appendChild(description);

    const informationSection = createElement("section", "premiere-information-section");
    informationSection.appendChild(createElement("h2", "premiere-details-heading", "Informacje"));

    const informationList = createElement("dl", "premiere-information-list");
    informationList.append(
        createInfoRow("Platformy", getPlatformNames(game)),
        createInfoRow("Twórcy", joinNames(game.developers)),
        createInfoRow("Wydawcy", joinNames(game.publishers)),
        createInfoRow("Data premiery", formatDate(game.released, game.tba)),
        createInfoRow("Liczba ocen", String(game.ratings_count || 0))
    );
    informationSection.appendChild(informationList);

    const actions = createElement("div", "premiere-details-actions");
    const rawgLink = createSafeExternalLink(
        `https://rawg.io/games/${encodeURIComponent(game.slug || game.id)}`,
        "Zobacz źródło danych w RAWG",
        "premiere-action secondary"
    );
    const websiteLink = game.website
        ? createSafeExternalLink(game.website, "Oficjalna strona gry", "premiere-action primary")
        : null;

    if (websiteLink) actions.appendChild(websiteLink);
    if (rawgLink) actions.appendChild(rawgLink);

    const sourceNote = createElement("p", "premiere-source-note");
    sourceNote.append("Dane pochodzą z ");
    const sourceLink = createSafeExternalLink(
        "https://rawg.io/",
        "RAWG Video Games Database",
        "premiere-source-link"
    );
    if (sourceLink) sourceNote.appendChild(sourceLink);
    sourceNote.append(".");

    detailsContainer.append(
        hero,
        stats,
        descriptionSection,
        informationSection,
        actions,
        sourceNote
    );

    document.title = `${game.name || "Gra"} - szczegóły premiery`;
    statusContainer.hidden = true;
    detailsContainer.hidden = false;
}

function showError(message) {
    statusContainer.replaceChildren();
    statusContainer.classList.add("error");

    const text = createElement("p", "premiere-error-message", message);
    const backLink = createElement("a", "premiere-action secondary", "Wróć do kalendarza premier");
    backLink.href = "premiery.html";

    statusContainer.append(text, backLink);
    statusContainer.hidden = false;
    detailsContainer.hidden = true;
}

async function loadGameDetails() {
    const parameters = new URLSearchParams(window.location.search);
    const gameId = parameters.get("id");

    if (!gameId || !/^\d+$/.test(gameId)) {
        showError("Nie wybrano prawidłowej gry. Wróć do kalendarza i kliknij wybraną premierę.");
        return;
    }

    try {
        const requestUrl = `${RAWG_GAMES_API_URL}/${encodeURIComponent(gameId)}?key=${encodeURIComponent(RAWG_API_KEY)}`;
        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error(`RAWG API zwróciło kod ${response.status}`);
        }

        const game = await response.json();
        renderGameDetails(game);
    } catch (error) {
        console.error("Nie udało się pobrać szczegółów premiery:", error);
        showError("Nie udało się pobrać informacji o tej grze. Sprawdź połączenie internetowe i spróbuj ponownie później.");
    }
}

loadGameDetails();
