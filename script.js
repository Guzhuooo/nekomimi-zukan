/* 猫娘完全图鉴 —— 画廊渲染 / 灯箱 / 吸猫计数器 */

const grid = document.getElementById("galleryGrid");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbNo = document.getElementById("lbNo");
const lbArtist = document.getElementById("lbArtist");

function renderGallery() {
  const frag = document.createDocumentFragment();
  GALLERY.forEach((item) => {
    const fig = document.createElement("figure");
    fig.className = "shot";

    const tape = document.createElement("span");
    tape.className = "tape";
    tape.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = "assets/" + item.f;
    img.alt = "观测样本 No." + String(item.no).padStart(3, "0") + "：猫娘插画";
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "放大查看观测样本 No." + String(item.no).padStart(3, "0"));

    const cap = document.createElement("figcaption");
    const no = document.createElement("span");
    no.className = "no";
    no.textContent = "No." + String(item.no).padStart(3, "0");
    const credit = document.createElement("span");
    credit.className = "credit";
    const a = document.createElement("a");
    a.href = item.href || item.src;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = item.artist;
    a.addEventListener("click", (e) => e.stopPropagation());
    credit.append("画师 ", a);

    cap.append(no, credit);
    fig.append(tape, img, cap);

    // 每六只盖一个「稀有」章
    if (item.no % 6 === 0) {
      const rare = document.createElement("span");
      rare.className = "rare";
      rare.textContent = "稀有";
      fig.append(rare);
    }

    const open = () => {
      lbImg.src = "assets/" + item.f;
      lbImg.alt = img.alt;
      lbNo.textContent = "No." + String(item.no).padStart(3, "0");
      lbArtist.href = a.href;
      lbArtist.textContent = "画师：" + item.artist;
      if (typeof lb.showModal === "function") lb.showModal();
      else lb.setAttribute("open", "");
    };
    fig.addEventListener("click", open);
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    frag.append(fig);
  });
  grid.append(frag);
}

function closeLightbox() {
  if (typeof lb.close === "function") lb.close();
  else lb.removeAttribute("open");
}
document.getElementById("lbClose").addEventListener("click", closeLightbox);
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLightbox();
});

/* ---------- 吸猫计数器 ---------- */
const MEOWS = ["喵！", "喵呜～", "呼噜呼噜", "喵——？", "purr…", "喵♪"];
const petBtn = document.getElementById("petBtn");
const petCount = document.getElementById("petCount");
const KEY = "nekomimi-pet-count";

function todayKey() {
  const d = new Date();
  return KEY + "-" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function petCountNow() {
  return parseInt(localStorage.getItem(todayKey()) || "0", 10);
}

function renderCount() {
  const n = petCountNow();
  const tail = n >= 99 ? "（猫已被吸秃，请注意节制）" : "";
  petCount.textContent = "今日已吸猫 " + n + " 次" + tail;
}

petBtn.addEventListener("click", () => {
  localStorage.setItem(todayKey(), petCountNow() + 1);
  renderCount();

  const corner = petBtn.parentElement;
  const meow = document.createElement("span");
  meow.className = "meow-float";
  meow.textContent = MEOWS[Math.floor(Math.random() * MEOWS.length)];
  meow.style.left = 20 + Math.random() * 120 + "px";
  meow.style.top = -14 - Math.random() * 20 + "px";
  meow.style.fontSize = 17 + Math.random() * 10 + "px";
  corner.append(meow);
  meow.addEventListener("animationend", () => meow.remove());
});

renderGallery();
renderCount();
