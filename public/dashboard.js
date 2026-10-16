const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LABELS = { urltoken: "suspicious link", longnumber: "long phone number" };
const COLORS = { "Likely scam": "var(--scam)", "Suspicious": "var(--warn)", "Looks safe": "var(--safe)" };

function bars(rows, label) {
  if (!rows.length) return '<p class="none">No reports yet.</p>';
  const max = Math.max(...rows.map((r) => r.count), 1);
  return rows.map((r) =>
    `<div class="bar-row"><span>${esc(label(r))}</span><span class="bar"><i style="width:${(r.count / max) * 100}%"></i></span><b>${r.count}</b></div>`
  ).join("");
}

async function loadStats() {
  const res = await fetch("/api/reports/stats");
  const s = await res.json();
  const src = Object.fromEntries(s.bySource.map((x) => [x.source, x.count]));
  $("kTotal").textContent = s.total;
  $("kTotal").nextElementSibling.textContent = "Reports (" + (src.user || 0) + " from users, " + (src.sample || 0) + " samples)";
  $("kStates").textContent = s.byState.length;
  $("kTopState").textContent = s.byState.length ? s.byState[0].state : "-";
  $("kTopFlag").textContent = s.topFlags.length ? (LABELS[s.topFlags[0].word] || s.topFlags[0].word) : "-";
  $("stateBars").innerHTML = bars(s.byState, (r) => r.state);
  $("flagBars").innerHTML = bars(s.topFlags, (r) => LABELS[r.word] || r.word);
}

async function loadList() {
  const res = await fetch("/api/reports?q=" + encodeURIComponent($("q").value.trim()));
  const rows = await res.json();
  $("list").innerHTML = rows.length
    ? rows.map((r) => {
        const when = new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        const text = r.text.length > 170 ? r.text.slice(0, 170) + "..." : r.text;
        const tag = r.source === "sample" ? '<span class="tag">Sample</span>' : '<span class="tag user">User report</span>';
        return `<div class="rep"><div class="rep-top"><span class="badge" style="--c:${COLORS[r.verdict] || "var(--scam)"}">${esc(r.verdict)}</span><span>${esc(r.state)}</span><span>${when}</span>${tag}</div><p>${esc(text)}</p></div>`;
      }).join("")
    : '<p class="none">No reports found.</p>';
}

let timer;
$("q").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(loadList, 250); });

loadStats();
loadList();
