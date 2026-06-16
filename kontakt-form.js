const STORAGE_KEY = "natrzecisemestr-komentarze";

const menuButton = document.querySelector(".header-menu-btn");
const menu = document.querySelector(".header-menu");

const form = document.getElementById("comment-form");
const nameInput = document.getElementById("comment-name");
const emailInput = document.getElementById("comment-email");
const messageInput = document.getElementById("comment-message");
const consentInput = document.getElementById("comment-consent");
const messageCounter = document.getElementById("message-counter");
const submitButton = document.getElementById("submit-comment");
const cancelEditButton = document.getElementById("cancel-edit");
const formStatus = document.getElementById("form-status");
const commentsList = document.getElementById("comments-list");
const emptyComments = document.getElementById("empty-comments");
const commentsCount = document.getElementById("comments-count");

let editedCommentId = null;

menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("active");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.classList.contains("active")) {
        menu.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
    }
});

messageInput.addEventListener("input", () => {
    messageCounter.textContent = `${messageInput.value.length}/500`;
    clearFieldError("message");
});

[nameInput, emailInput, consentInput].forEach(field => {
    field.addEventListener("input", () => clearFieldError(field.name || "consent"));
    field.addEventListener("change", () => clearFieldError(field.name || "consent"));
});

document.querySelectorAll('input[name="rating"]').forEach(input => {
    input.addEventListener("change", () => clearFieldError("rating"));
});

function getComments() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveComments(comments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function setFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(fieldName) {
    setFieldError(fieldName, "");
}

function clearErrors() {
    ["name", "email", "rating", "message", "consent"].forEach(clearFieldError);
    formStatus.textContent = "";
    formStatus.className = "form-status";
}

function getSelectedRating() {
    const checkedRating = document.querySelector('input[name="rating"]:checked');
    return checkedRating ? checkedRating.value : "";
}

function validateForm() {
    clearErrors();

    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const rating = getSelectedRating();
    const message = messageInput.value.trim();

    if (name.length < 2) {
        setFieldError("name", "Imię musi mieć co najmniej 2 znaki.");
        isValid = false;
    }

    if (name.length > 40) {
        setFieldError("name", "Imię może mieć maksymalnie 40 znaków.");
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        setFieldError("email", "Podaj prawidłowy adres e-mail.");
        isValid = false;
    }

    if (!rating) {
        setFieldError("rating", "Wybierz ocenę od 1 do 5.");
        isValid = false;
    }

    if (message.length < 10) {
        setFieldError("message", "Komentarz musi mieć co najmniej 10 znaków.");
        isValid = false;
    }

    if (message.length > 500) {
        setFieldError("message", "Komentarz może mieć maksymalnie 500 znaków.");
        isValid = false;
    }

    if (!consentInput.checked) {
        setFieldError("consent", "Zaznacz zgodę na zapis komentarza.");
        isValid = false;
    }

    return isValid;
}

function createCommentCard(comment) {
    const article = document.createElement("article");
    article.className = "comment-card";

    const header = document.createElement("div");
    header.className = "comment-card-header";

    const author = document.createElement("strong");
    author.textContent = comment.name;

    const date = document.createElement("time");
    date.dateTime = comment.createdAt;
    date.textContent = new Date(comment.createdAt).toLocaleString("pl-PL");

    header.append(author, date);

    const meta = document.createElement("p");
    meta.className = "comment-meta";
    meta.textContent = `Ocena: ${comment.rating}/5`;

    const message = document.createElement("p");
    message.className = "comment-message";
    message.textContent = comment.message;

    const actions = document.createElement("div");
    actions.className = "comment-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edytuj";
    editButton.addEventListener("click", () => startEditing(comment.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Usuń";
    deleteButton.className = "delete-comment";
    deleteButton.addEventListener("click", () => deleteComment(comment.id));

    actions.append(editButton, deleteButton);
    article.append(header, meta, message, actions);

    return article;
}

function renderComments() {
    const comments = getComments();

    commentsList.replaceChildren();
    commentsCount.textContent = `${comments.length} ${comments.length === 1 ? "komentarz" : "komentarzy"}`;
    emptyComments.hidden = comments.length > 0;

    comments
        .slice()
        .reverse()
        .forEach(comment => commentsList.appendChild(createCommentCard(comment)));
}

function startEditing(commentId) {
    const comment = getComments().find(item => item.id === commentId);

    if (!comment) {
        return;
    }

    editedCommentId = comment.id;
    nameInput.value = comment.name;
    emailInput.value = comment.email;
    messageInput.value = comment.message;
    consentInput.checked = true;

    const ratingInput = document.querySelector(`input[name="rating"][value="${comment.rating}"]`);

    if (ratingInput) {
        ratingInput.checked = true;
    }

    messageCounter.textContent = `${messageInput.value.length}/500`;
    submitButton.textContent = "Zapisz zmiany";
    cancelEditButton.hidden = false;
    formStatus.textContent = "Edytujesz zapisany komentarz.";
    formStatus.className = "form-status info";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    nameInput.focus();
}

function resetForm() {
    form.reset();
    editedCommentId = null;
    messageCounter.textContent = "0/500";
    submitButton.textContent = "Wyślij komentarz";
    cancelEditButton.hidden = true;
    clearErrors();
}

function deleteComment(commentId) {
    const comments = getComments().filter(comment => comment.id !== commentId);

    saveComments(comments);
    renderComments();

    if (editedCommentId === commentId) {
        resetForm();
    }

    formStatus.textContent = "Komentarz został usunięty.";
    formStatus.className = "form-status success";
}

cancelEditButton.addEventListener("click", resetForm);

form.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateForm()) {
        formStatus.textContent = "Popraw zaznaczone pola.";
        formStatus.className = "form-status error";

        const firstError = form.querySelector(".field-error:not(:empty)");

        if (firstError) {
            firstError.closest(".form-field")?.querySelector("input, select, textarea")?.focus();
        }

        return;
    }

    const comments = getComments();

    const commentData = {
        id: editedCommentId || crypto.randomUUID(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        rating: getSelectedRating(),
        message: messageInput.value.trim(),
        createdAt: new Date().toISOString()
    };

    if (editedCommentId) {
        const commentIndex = comments.findIndex(comment => comment.id === editedCommentId);

        if (commentIndex !== -1) {
            commentData.createdAt = comments[commentIndex].createdAt;
            comments[commentIndex] = commentData;
        }
    } else {
        comments.push(commentData);
    }

    saveComments(comments);
    renderComments();

    const wasEdited = Boolean(editedCommentId);
    resetForm();

    formStatus.textContent = wasEdited
        ? "Zmiany zostały zapisane."
        : "Komentarz został zapisany w przeglądarce.";

    formStatus.className = "form-status success";
});

renderComments();
