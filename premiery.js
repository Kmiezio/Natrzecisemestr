const RAWG_API_KEY = "771fdf2bdf0d42afa9fd23d435b26eab";
const RAWG_API_URL = "https://api.rawg.io/api/games";
const DAYS_AHEAD = 120;
const PAGE_SIZE = 40;

const calendar = document.getElementById("release-calendar");
const statusBox = document.getElementById("release-status");
const rangeBox = document.getElementById("release-range");
const filters = document.getElementById("release-filters");
const previousButton = document.getElementById("release-prev");
const nextButton = document.getElementById("release-next");
const searchForm = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");

let upcomingGames = [];
let activePlatform = "all";
let searchPhrase = "";

function toApiDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatFullDate(dateString) {
    return new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(`${dateString}T12:00:00`));
}

function formatCalendarDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    const day = new Intl.DateTimeFormat("pl-PL", { day: "2-digit" }).format(date);
    const month = new Intl.DateTimeFormat("pl-PL", { month: "short" })
        .format(date)
        .replace(".", "")
        .toUpperCase();

    return { day, month };
}

function getPlatformSlugs(game) {
    const parentPlatforms = game.parent_platforms || [];
    return parentPlatforms.map(item => item.platform.slug);
}

function matchesPlatform(game) {
    if (activePlatform === "all") return true;
    return getPlatformSlugs(game).includes(activePlatform);
}

function matchesSearch(game) {
    if (!searchPhrase) return true;
    return game.name.toLocaleLowerCase("pl-PL").includes(searchPhrase);
}

function createPlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.className = "release-cover-placeholder";
    placeholder.textContent = "BRAK OKŁADKI";
    return placeholder;
}

function createPlatformBadges(game) {
    const slugs = getPlatformSlugs(game);
    const labels = {
        pc: "PC",
        playstation: "PS",
        xbox: "XBOX",
        nintendo: "SWITCH"
    };

    const badges = document.createElement("div");
    badges.className = "release-platforms";

    Object.entries(labels).forEach(([slug, label]) => {
        if (!slugs.includes(slug)) return;
        const badge = document.createElement("span");
        badge.textContent = label;
        badges.appendChild(badge);
    });

    return badges;
}

function createGameCard(game) {
    const card = document.createElement("a");
    card.className = "release-card";
    card.href = `szczegoly-premiery.html?id=${encodeURIComponent(game.id)}`;
    card.title = `${game.name} — zobacz szczegóły premiery ${formatFullDate(game.released)}`;

    const cover = document.createElement("div");
    cover.className = "release-cover";

    if (game.background_image) {
        const image = document.createElement("img");
        image.src = game.background_image;
        image.alt = `Okładka gry ${game.name}`;
        image.loading = "lazy";
        image.addEventListener("error", () => image.replaceWith(createPlaceholder()));
        cover.appendChild(image);
    } else {
        cover.appendChild(createPlaceholder());
    }

    cover.appendChild(createPlatformBadges(game));

    const title = document.createElement("h2");
    title.textContent = game.name;

    const date = formatCalendarDate(game.released);
    const releaseDate = document.createElement("p");
    releaseDate.className = "release-date";

    const day = document.createElement("strong");
    day.textContent = date.day;

    const month = document.createElement("span");
    month.textContent = date.month;

    releaseDate.append(day, month);
    card.append(cover, title, releaseDate);

    return card;
}

function renderGames() {
    calendar.replaceChildren();

    const visibleGames = upcomingGames
        .filter(matchesPlatform)
        .filter(matchesSearch);

    if (visibleGames.length === 0) {
        statusBox.hidden = false;
        statusBox.textContent = "Brak premier pasujących do wybranego filtra.";
        return;
    }

    statusBox.hidden = true;
    visibleGames.forEach(game => calendar.appendChild(createGameCard(game)));
    calendar.scrollTo({ left: 0, behavior: "smooth" });
}

async function loadUpcomingGames() {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + DAYS_AHEAD);

    const start = toApiDate(today);
    const end = toApiDate(endDate);

    rangeBox.textContent = `${formatFullDate(start)} – ${formatFullDate(end)}`;

    const params = new URLSearchParams({
        key: RAWG_API_KEY,
        dates: `${start},${end}`,
        ordering: "released",
        page_size: String(PAGE_SIZE)
    });

    try {
        const response = await fetch(`${RAWG_API_URL}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`RAWG API zwróciło kod ${response.status}`);
        }

        const data = await response.json();
        upcomingGames = (data.results || [])
            .filter(game => game.released && !game.tba)
            .sort((a, b) => a.released.localeCompare(b.released));

        renderGames();
    } catch (error) {
        console.error("Nie udało się pobrać premier:", error);
        statusBox.hidden = false;
        statusBox.textContent = "Nie udało się pobrać premier. Sprawdź połączenie, klucz API i uruchom stronę przez lokalny serwer.";
    }
}

filters.addEventListener("click", event => {
    const button = event.target.closest(".release-filter");
    if (!button) return;

    document.querySelectorAll(".release-filter").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");
    activePlatform = button.dataset.platform;
    renderGames();
});

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchPhrase = searchInput.value.trim().toLocaleLowerCase("pl-PL");
    renderGames();
});

searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") return;
    searchPhrase = "";
    renderGames();
});

previousButton.addEventListener("click", () => {
    calendar.scrollBy({ left: -calendar.clientWidth * 0.8, behavior: "smooth" });
});

nextButton.addEventListener("click", () => {
    calendar.scrollBy({ left: calendar.clientWidth * 0.8, behavior: "smooth" });
});

loadUpcomingGames();
