const nav = document.querySelector(".navigation");
const authLinks = document.getElementById("auth-links");
const logoutBtn = document.getElementById("logout-btn");
const content = document.querySelector(".content");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const notesList = document.getElementById("notes");

function hideOrShow() {
    if (!localStorage.getItem("token")) {
        content.classList.add("hide");
        authLinks.classList.remove("hide");
        logoutBtn.classList.add("hide");
    } else {
        content.classList.remove("hide");
        authLinks.classList.add("hide");
        logoutBtn.classList.remove("hide");
    }
}

function logout() {
    localStorage.removeItem("token");
    alert("logged out!");
    window.location.href = "/";
}

hideOrShow();
async function getNotes() {
    const response = await fetch("/notes", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const data = await response.json();
    data.notes.map((n) => {
        const ele = document.createElement("li");
        ele.innerText = `${n.title} - ${n.desc}`;
        notesList.appendChild(ele);
    });
}
getNotes();

async function addNote() {
    const t = title.value;
    const d = desc.value;
    if (!t && !d) {
        alert("fill the data first.");
        return;
    }
    const res = await fetch("/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: t, desc: d }),
    });
    const data = await res.json();
    if (data.msg) {
        title.value = "";
        desc.value = "";
        const ele = document.createElement("li");
        ele.innerText = `${t} - ${d}`;
        notesList.appendChild(ele);
        return;
    }
}
