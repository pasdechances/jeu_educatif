// ======================================================
// CONFIGURATION
// ======================================================

const detenteData = window.__DETENTE_VIDEO_DATA__;

const STORAGE_UNLOCKS = "detenteUnlockedEpisodes";


// ======================================================
// POINTS
// ======================================================

function getPoints() {
    return parseInt(
        localStorage.getItem("points") ||
        document.getElementById("ptsVal")?.textContent ||
        "0"
    );
}

function setPoints(value) {

    localStorage.setItem("points", value);

    const ptsEl = document.getElementById("ptsVal");

    if (ptsEl) {
        ptsEl.textContent = value;
    }
}

function spendPoints(cost) {

    const current = getPoints();

    if (current < cost) {
        return false;
    }

    setPoints(current - cost);

    return true;
}


// ======================================================
// DEBLOCAGE
// ======================================================

function getUnlockedEpisodes() {

    return JSON.parse(
        localStorage.getItem(STORAGE_UNLOCKS) || "[]"
    );
}

function isEpisodeUnlocked(id) {

    return getUnlockedEpisodes().includes(id);
}

function unlockEpisode(id) {

    const unlocked = getUnlockedEpisodes();

    if (!unlocked.includes(id)) {

        unlocked.push(id);

        localStorage.setItem(
            STORAGE_UNLOCKS,
            JSON.stringify(unlocked)
        );
    }
}


// ======================================================
// CREATION DES CATEGORIES
// ======================================================

function createCollapsibleCategory(
    title,
    items,
    isGameCategory = false
) {

    const wrapper = document.createElement("div");
    wrapper.className = "category-wrapper";

    const header = document.createElement("div");
    header.className = "category-header";

    header.innerHTML = `
        <h3>${title}</h3>
        <span class="toggle-icon">▼</span>
    `;

    const content = document.createElement("div");
    content.className = "category-content";

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "items-container";


    items.forEach(item => {

        itemsContainer.appendChild(
            createItemElement(
                item,
                isGameCategory
            )
        );

    });

    content.appendChild(itemsContainer);

    header.addEventListener("click", () => {

        content.classList.toggle("open");

        header.querySelector(
            ".toggle-icon"
        ).textContent =
            content.classList.contains("open")
                ? "▲"
                : "▼";
    });

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    return wrapper;
}


// ======================================================
// CREATION ITEMS
// ======================================================

function createItemElement(
    item,
    isGameCategory = false
) {

    const itemElement =
        document.createElement("div");

    itemElement.className =
        isGameCategory
            ? "item game"
            : "item";

    const header =
        document.createElement("div");

    header.className = "item-header";

    header.innerHTML = `
        <h4>${item.title}</h4>
        <span class="item-toggle">▼</span>
    `;

    const content =
        document.createElement("div");

    content.className = "item-content";

    if (item.description) {

        const desc =
            document.createElement("p");

        desc.textContent =
            item.description;

        content.appendChild(desc);
    }

    if (
        item.episodes &&
        item.episodes.length
    ) {

        const list =
            document.createElement("ul");

        list.className =
            "episodes-list";

        item.episodes.forEach(
            episode => {

                const uniqueId =
                    `${item.id}-${episode.id}`;

                const li =
                    document.createElement("li");

                li.className =
                    "episode";

                renderEpisode(
                    li,
                    episode,
                    uniqueId
                );

                list.appendChild(li);

            }
        );

        content.appendChild(list);
    }

    header.addEventListener(
        "click",
        () => {

            content.classList.toggle(
                "open"
            );

            header.querySelector(
                ".item-toggle"
            ).textContent =
                content.classList.contains(
                    "open"
                )
                    ? "▲"
                    : "▼";
        }
    );

    itemElement.appendChild(header);
    itemElement.appendChild(content);

    return itemElement;
}


// ======================================================
// AFFICHAGE EPISODE
// ======================================================

function renderEpisode(
    container,
    episode,
    uniqueId
) {

    const unlocked =
        isEpisodeUnlocked(
            uniqueId
        );

    if (unlocked) {

        container.innerHTML = `
            <div class="episode-title">
                ${episode.title}
            </div>

            <div class="episode-cost unlocked">
                ✅ Débloqué
            </div>

            <a
                class="episode-link"
                href="${episode.embedUrl}"
                target="_blank"
            >
                ▶ Ouvrir
            </a>
        `;

        return;
    }

    container.innerHTML = `
        <div class="episode-title">
            ${episode.title}
        </div>

        <div class="episode-cost">
            🪙 ${episode.cost} points
        </div>

        <button class="unlock-btn">
            🔓 Débloquer
        </button>
    `;

    const btn =
        container.querySelector(
            ".unlock-btn"
        );

    btn.addEventListener(
        "click",
        () => {

            if (
                !spendPoints(
                    episode.cost
                )
            ) {

                alert(
                    "❌ Pas assez de points."
                );

                return;
            }

            unlockEpisode(
                uniqueId
            );

            renderEpisode(
                container,
                episode,
                uniqueId
            );
        }
    );
}


// ======================================================
// INITIALISATION
// ======================================================

function initializeDetenteUI() {

    const container =
        document.getElementById(
            "articlesGrid"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        detenteData.series
    ) {

        container.appendChild(
            createCollapsibleCategory(
                "📺 Séries",
                detenteData.series
            )
        );
    }

    if (
        detenteData.Jeu
    ) {

        container.appendChild(
            createCollapsibleCategory(
                "🎮 Jeux",
                detenteData.Jeu,
                true
            )
        );
    }
}

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDetenteUI
    );

} else {

    initializeDetenteUI();
}