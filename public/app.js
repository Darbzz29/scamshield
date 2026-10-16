const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const COLORS = { "Likely scam": "var(--scam)", "Suspicious": "var(--warn)", "Looks safe": "var(--safe)" };
const LABELS = { urltoken: "suspicious link", longnumber: "long phone number" };

const EX_SCAM = "URGENT: Your SBI account will be blocked today. Update your KYC at http://sbi-kyc-update.xyz and share the OTP to avoid suspension.";
const EX_SAFE = "Hey, the hackathon registration closes on Sunday. Please submit your team details through the official form before then.";

function highlight(text, flags) {
  const parts = [];
  if (flags.includes("urltoken")) parts.push("https?:\\/\\/[^\\s<]+|www\\.[^\\s<]+");
  if (flags.includes("longnumber")) parts.push("\\d{10,}");
  const words = flags.filter((f) => !LABELS[f]);
  if (words.length) parts.push("\\b(?:" + words.join("|") + ")\\b");
  const safe = esc(text);
  if (!parts.length) return safe;
  return safe.replace(new RegExp(parts.join("|"), "gi"), (m) => "<mark>" + m + "</mark>");
}

function render(text, r) {
  const color = COLORS[r.verdict];
  const chips = r.redFlags.length
    ? r.redFlags.map((f) => `<span class="chip">${esc(LABELS[f] || f)}</span>`).join("")
    : '<span class="none">No strong scam words found.</span>';
  $("result").innerHTML = `
    <div class="verdict">
      <span class="badge" style="--c:${color}">${r.verdict}</span>
      <div class="pct">${r.risk}%<small>scam risk</small></div>
    </div>
    <div class="meter"><i id="bar" style="--c:${color}"></i></div>
    <div class="section-label">Red flags</div>
    <div class="chips">${chips}</div>
    <div class="section-label">Your message</div>
    <div class="msgbox">${highlight(text, r.redFlags)}</div>
    <p class="note">Demo model trained on a small labelled set. Treat the score as a hint, and never share an OTP or card details whatever the score says.</p>`;
  requestAnimationFrame(() => { $("bar").style.width = r.risk + "%"; });
}

async function check() {
  const text = $("msg").value.trim();
  if (!text) { $("msg").focus(); return; }
  $("checkBtn").disabled = true;
  $("checkBtn").textContent = "Checking...";
  try {
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    render(text, data);
  } catch (err) {
    $("result").innerHTML = `<div class="empty"><b>Couldn't check this message</b><span class="err">${esc(err.message)}</span></div>`;
  } finally {
    $("checkBtn").disabled = false;
    $("checkBtn").textContent = "Check message";
  }
}

$("checkBtn").addEventListener("click", check);
$("msg").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) check(); });
$("clearBtn").addEventListener("click", () => {
  $("msg").value = "";
  $("result").innerHTML = '<div class="empty"><b>No result yet</b>Paste a message and press Check message.</div>';
  $("msg").focus();
});
$("exScam").addEventListener("click", () => { $("msg").value = EX_SCAM; check(); });
$("exSafe").addEventListener("click", () => { $("msg").value = EX_SAFE; check(); });

// ===== Report to the community =====
const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Chandigarh","Puducherry"];

function addReportBox(text, r) {
  const box = document.createElement("div");
  box.className = "report-box";
  box.innerHTML = `
    <div class="section-label">Help others</div>
    <div class="row" style="margin-top:0">
      <select id="repState"><option value="">Your state</option>${STATES.map((s) => `<option>${s}</option>`).join("")}</select>
      <button class="btn" id="repBtn" type="button">Report this message</button>
    </div>
    <p class="note" id="repMsg" style="margin-top:8px"></p>`;
  $("result").appendChild(box);

  $("repBtn").addEventListener("click", async () => {
    const state = $("repState").value;
    if (!state) { $("repMsg").textContent = "Choose your state first."; return; }
    $("repBtn").disabled = true;
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, state, verdict: r.verdict, risk: r.risk, redFlags: r.redFlags })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      $("repMsg").innerHTML = 'Thanks, your report was saved. <a href="/dashboard.html">See the dashboard</a>';
    } catch (err) {
      $("repMsg").textContent = "Couldn't save the report: " + err.message;
      $("repBtn").disabled = false;
    }
  });
}

const _render = render;
render = function (text, r) { _render(text, r); addReportBox(text, r); };
