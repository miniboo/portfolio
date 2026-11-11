const expectedDigest = "5138a960e3e13f6079c227e6f5f1f16f2ea935ca4732f5f3208a554fffc3ab7c";
const storageKey = `chloe-entry:${import.meta.env.BASE_URL}`;
const form = document.querySelector(".entry-form");
const input = form.querySelector("input");
const button = form.querySelector("button");
const errorMessage = document.querySelector("#entry-error");
const notice = document.querySelector("#entry-notice");

function storageNotice(error) {
  console.warn("The entry screen cannot remember access in this tab.", error);
  notice.textContent = "Your browser cannot remember access. You may need to enter the password again when changing pages.";
  notice.hidden = false;
}

function reveal(focus) {
  document.documentElement.removeAttribute("data-entry-gate");
  form.reset();
  if (focus) {
    const main = document.querySelector("main");
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
  }
}

let remembered = false;
try {
  remembered = sessionStorage.getItem(storageKey) === "open";
} catch (error) {
  storageNotice(error);
}

if (remembered) {
  reveal(false);
} else {
  input.disabled = false;
  button.disabled = false;
  input.focus({ preventScroll: true });
}

input.addEventListener("input", () => {
  errorMessage.hidden = true;
  input.removeAttribute("aria-invalid");
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.focus({ preventScroll: true });
  input.select();
}

let checking = false;
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (checking) return;
  checking = true;
  button.disabled = true;
  form.setAttribute("aria-busy", "true");
  let digest;
  try {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.value));
    digest = [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("The entry screen could not check the password.", error);
    showError("The password could not be checked. Please use HTTPS and try again.");
    return;
  } finally {
    checking = false;
    button.disabled = false;
    form.removeAttribute("aria-busy");
  }
  if (digest !== expectedDigest) {
    showError("That password is not right. Please try again.");
    return;
  }
  try {
    sessionStorage.setItem(storageKey, "open");
  } catch (error) {
    storageNotice(error);
  }
  reveal(true);
});
