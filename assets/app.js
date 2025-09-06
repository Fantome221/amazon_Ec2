
(function(){
  // Build TOC
  const toc = document.querySelector("#toc-list");
  const heads = [...document.querySelectorAll("h2, h3")];
  const map = new Map();
  heads.forEach(h => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#"+h.id; a.textContent = h.textContent; li.appendChild(a); toc.appendChild(li);
    map.set(h.id, a);
  });
  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ map.forEach(a=>a.classList.remove("active")); const a = map.get(e.target.id); if(a) a.classList.add("active"); }
    });
  },{rootMargin:"-40% 0px -55% 0px", threshold:[0,1]});
  heads.forEach(h => spy.observe(h));

  // Search
  const input = document.getElementById("search");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll("main section.card").forEach(sec => {
      if(!q) { sec.style.display=""; return; }
      sec.style.display = sec.innerText.toLowerCase().includes(q) ? "":"none";
    });
  });

  // Progress + backtop
  const pb = document.getElementById("progress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop)/(h.scrollHeight - h.clientHeight);
    pb.style.width = (scrolled*100).toFixed(2)+"%";
    document.getElementById("backtop").style.display = (h.scrollTop>400) ? "block":"none";
  });
  document.getElementById("backtop").addEventListener("click", ()=>window.scrollTo({top:0,behavior:"smooth"}));

  // Lightbox for images
  const lb = document.getElementById("lightbox");
  document.querySelectorAll(".figure img").forEach(img => img.addEventListener("click", () => {
    lb.querySelector("img").src = img.src; lb.style.display = "grid";
  }));
  lb.addEventListener("click", () => lb.style.display = "none");

  // Copy buttons in code blocks
  document.querySelectorAll("pre").forEach(pre => {
    const btn = document.createElement("span");
    btn.className = "copy"; btn.textContent = "copier";
    btn.addEventListener("click", () => {
      const text = pre.innerText;
      navigator.clipboard.writeText(text);
      btn.textContent = "copié ✓"; setTimeout(()=>btn.textContent="copier",1200);
    });
    pre.prepend(btn);
  });

  // Visit logging
  fetch("/api/visit", {
    method: "POST", headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      path: location.pathname,
      referrer: document.referrer || null,
      event: "pageview",
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ua: navigator.userAgent
    })
  }).catch(()=>{});

  // QCM logic
  const quiz = document.getElementById("qcm");
  if(quiz){
    quiz.addEventListener("click", (e) => {
      if(e.target.matches("button.validate")){
        const blocks = quiz.querySelectorAll(".q");
        let score=0, total=0, answers=[];
        blocks.forEach((q,idx)=>{
          total++;
          const correct = q.dataset.answer;
          const selected = q.querySelector("input[type=radio]:checked");
          const ok = selected && selected.value===correct;
          if(ok) score++;
          answers.push({id: idx+1, answer: selected?selected.value:null, ok});
          q.style.borderColor = ok ? "rgba(34,197,94,.7)" : "rgba(239,68,68,.7)";
        });
        const out = quiz.querySelector("#score");
        if(out){ out.textContent = `Score : ${score} / ${total}`; }
        // send to backend
        fetch("/api/quiz", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ when: new Date().toISOString(), score, total, answers })
        }).catch(()=>{});
      }
    });
  }
})();
