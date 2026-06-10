import { useState, useEffect } from "react";

// ─── HELPER: acessa window.gymData com fallback seguro ────────────────────────
const gd = () => window.gymData || {};

const C = {
  bg: "#0A0A0F", surface: "#13131A", card: "#1C1C28", border: "#2A2A3A",
  accent: "#C8F135", red: "#FF4757", blue: "#3D91FF", purple: "#9B59FF",
  orange: "#FF7730", teal: "#00D2C8", text: "#F0F0F8", muted: "#6B6B85",
};

const ACADEMIAS = [
  { id: "fitzone", name: "FitZone Campinas", equipamentos: [
    { id: "haltere_fitzone", name: "Halteres (par)", tipo: "Livre", muscles: ["Bíceps","Tríceps","Ombros"] },
    { id: "barra_supino", name: "Banco de Supino c/ Barra", tipo: "Livre", muscles: ["Peito","Tríceps"] },
    { id: "polia_alta", name: "Polia Alta", tipo: "Cabo", muscles: ["Costas","Bíceps"] },
    { id: "polia_baixa", name: "Polia Baixa", tipo: "Cabo", muscles: ["Bíceps","Costas"] },
    { id: "leg_press", name: "Leg Press 45°", tipo: "Máquina", muscles: ["Pernas","Panturrilha"] },
    { id: "extensora", name: "Extensora", tipo: "Máquina", muscles: ["Pernas"] },
    { id: "flexora", name: "Flexora", tipo: "Máquina", muscles: ["Pernas"] },
    { id: "smith", name: "Smith Machine", tipo: "Livre", muscles: ["Peito","Pernas","Ombros"] },
    { id: "crossover", name: "Crossover", tipo: "Cabo", muscles: ["Peito","Ombros"] },
  ]},
  { id: "ironhouse", name: "Iron House SP", equipamentos: [
    { id: "haltere_ih", name: "Halteres (par)", tipo: "Livre", muscles: ["Bíceps","Tríceps","Ombros"] },
    { id: "barra_ih", name: "Barra Olímpica", tipo: "Livre", muscles: ["Peito","Costas","Pernas"] },
    { id: "cabo_ih", name: "Estação de Cabos", tipo: "Cabo", muscles: ["Peito","Costas","Bíceps","Tríceps"] },
  ]},
];

const EQUIPAMENTOS_GENERICOS = [
  { id: "haltere_g", name: "Halteres (par)", tipo: "Livre", muscles: ["Bíceps","Tríceps","Ombros","Peito"] },
  { id: "barra_g", name: "Barra + Anilhas", tipo: "Livre", muscles: ["Peito","Costas","Pernas"] },
  { id: "elastico", name: "Elástico", tipo: "Elástico", muscles: ["Todos"] },
  { id: "cabo_g", name: "Polia / Cabo", tipo: "Cabo", muscles: ["Costas","Bíceps","Tríceps"] },
  { id: "maquina_g", name: "Máquina Guiada", tipo: "Máquina", muscles: ["Vários"] },
  { id: "peso_corp", name: "Peso Corporal", tipo: "Corporal", muscles: ["Abdômen","Pernas","Peito"] },
];

const HISTORICO_EXERCICIOS = {
  "Rosca Direta": [
    { data: "20/05", aparelho: "Halteres (par)", kg: 14, reps: 12, series: 3, academia: "FitZone Campinas" },
    { data: "13/05", aparelho: "Halteres (par)", kg: 13, reps: 10, series: 3, academia: "FitZone Campinas" },
    { data: "06/05", aparelho: "Polia Baixa",    kg: 30, reps: 12, series: 3, academia: "FitZone Campinas" },
  ],
  "Supino Reto": [
    { data: "19/05", aparelho: "Banco de Supino c/ Barra", kg: 80, reps: 8, series: 4, academia: "FitZone Campinas" },
    { data: "12/05", aparelho: "Banco de Supino c/ Barra", kg: 75, reps: 8, series: 4, academia: "FitZone Campinas" },
  ],
  "Desenvolvimento": [
    { data: "21/05", aparelho: "Halteres (par)", kg: 20, reps: 10, series: 3, academia: "FitZone Campinas" },
    { data: "14/05", aparelho: "Halteres (par)", kg: 18, reps: 10, series: 3, academia: "FitZone Campinas" },
  ],
};

const TREINOS_SEMANA = [
  { day: "Seg", date: "26/05", muscles: ["Peito","Tríceps"], done: true, durMin: 62, academia: "FitZone Campinas", exercises: [
    { name: "Supino Reto", aparelho: "Banco de Supino c/ Barra", kg: 80, reps: 8, series: 4, muscle: "Peito" },
    { name: "Crucifixo", aparelho: "Halteres (par)", kg: 14, reps: 12, series: 3, muscle: "Peito" },
    { name: "Tríceps Corda", aparelho: "Polia Alta", kg: 25, reps: 12, series: 3, muscle: "Tríceps" },
    { name: "Tríceps Francês", aparelho: "Halteres (par)", kg: 10, reps: 10, series: 3, muscle: "Tríceps" },
  ]},
  { day: "Ter", date: "27/05", muscles: ["Costas","Bíceps"], done: true, durMin: 55, academia: "FitZone Campinas", exercises: [
    { name: "Puxada Frente", aparelho: "Polia Alta", kg: 60, reps: 10, series: 4, muscle: "Costas" },
    { name: "Remada Baixa", aparelho: "Polia Baixa", kg: 55, reps: 10, series: 3, muscle: "Costas" },
    { name: "Rosca Direta",  aparelho: "Halteres (par)", kg: 14, reps: 12, series: 3, muscle: "Bíceps" },
    { name: "Rosca Martelo", aparelho: "Halteres (par)", kg: 16, reps: 10, series: 3, muscle: "Bíceps" },
  ]},
  { day: "Qua", date: "28/05", muscles: [], done: false, rest: true, durMin: 0, academia: "", exercises: [] },
  { day: "Qui", date: "29/05", muscles: ["Pernas"], done: true, durMin: 70, academia: "FitZone Campinas", exercises: [
    { name: "Agachamento", aparelho: "Smith Machine", kg: 60, reps: 10, series: 4, muscle: "Pernas" },
    { name: "Leg Press", aparelho: "Leg Press 45°", kg: 120, reps: 12, series: 3, muscle: "Pernas" },
    { name: "Extensora", aparelho: "Extensora", kg: 50, reps: 15, series: 3, muscle: "Pernas" },
  ]},
  { day: "Sex", date: "30/05", muscles: ["Ombros","Abdômen"], done: false, durMin: 0, academia: "", exercises: [] },
  { day: "Sáb", date: "31/05", muscles: [], done: false, durMin: 0, academia: "", exercises: [] },
  { day: "Dom", date: "01/06", muscles: [], done: false, durMin: 0, academia: "", exercises: [] },
];

const muscleGroups = [
  { id: "biceps", name: "Bíceps", icon: "💪" }, { id: "triceps", name: "Tríceps", icon: "🦾" },
  { id: "peito", name: "Peito", icon: "🫁" }, { id: "costas", name: "Costas", icon: "🔙" },
  { id: "ombros", name: "Ombros", icon: "🙆" }, { id: "pernas", name: "Pernas", icon: "🦵" },
  { id: "abdomen", name: "Abdômen", icon: "⚡" }, { id: "panturrilha", name: "Panturrilha", icon: "🦶" },
];

const recentlyTrained = ["peito", "triceps", "costas", "biceps", "pernas"];
const evolucaoRosca = [
  { week: "S1", kg: 10 }, { week: "S2", kg: 10 }, { week: "S3", kg: 12 },
  { week: "S4", kg: 12 }, { week: "S5", kg: 13 }, { week: "S6", kg: 14 }, { week: "S7", kg: 14 },
];
const evolucaoSupino = [
  { week: "S1", kg: 60 }, { week: "S2", kg: 65 }, { week: "S3", kg: 70 },
  { week: "S4", kg: 70 }, { week: "S5", kg: 75 }, { week: "S6", kg: 80 }, { week: "S7", kg: 80 },
];

const useIsMobile = () => {
  const [mob, setMob] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mob;
};

const s = {
  h1: { fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" },
  h2: { fontSize: 18, fontWeight: 700, margin: 0 },
  h3: { fontSize: 15, fontWeight: 600, margin: 0 },
  lbl: { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px" },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 },
  g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  g3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  g4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
};

const btn = (color = C.accent, outline = false) => ({
  background: outline ? "transparent" : color,
  color: outline ? color : color === C.accent ? "#000" : "#fff",
  border: `1px solid ${color}`,
  borderRadius: 8, padding: "8px 18px", fontWeight: 700,
  fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s",
});

const tag = (color = C.accent) => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "3px 10px", borderRadius: 20,
  background: `${color}18`, color, fontSize: 12, fontWeight: 600,
  border: `1px solid ${color}30`,
});

const StatCard = ({ label, value, sub, color = C.accent, icon }) => (
  <div style={{ ...s.card, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 12, right: 14, fontSize: 24, opacity: 0.12 }}>{icon}</div>
    <div style={s.lbl}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 6 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</div>}
  </div>
);

const PBar = ({ pct, color = C.accent }) => (
  <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden", position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
  </div>
);

const Badge = ({ text, color }) => <span style={tag(color)}>{text}</span>;

const LineChart = ({ data, color = C.accent, height = 80, valField = "kg" }) => {
  const vals = data.map(d => d[valField]);
  const max = Math.max(...vals); const min = Math.min(...vals) - 1;
  const W = 280, H = height;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d[valField] - min) / (max - min || 1)) * (H - 8) - 4;
    return [x, y];
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const areaD = pathD + ` L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs><linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <path d={areaD} fill={`url(#g${color.replace("#","")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={color} stroke={C.bg} strokeWidth="2" />)}
    </svg>
  );
};

const BarChart = ({ data }) => {
  const maxVol = Math.max(...data.map(d => d.vol || 0), 1);
  const maxDur = Math.max(...data.map(d => d.durMin || 0), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
      {data.map((d, i) => {
        const realVol = d.exercises ? d.exercises.reduce((a,e)=>a+e.kg*e.reps*e.series,0) : (d.vol||0);
        const volH = d.done ? ((realVol||1) / maxVol) * 70 : 4;
        const durH = d.done && d.durMin ? (d.durMin / maxDur) * 70 : 0;
        const exCount = d.exercises ? d.exercises.length : 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%" }}>
              <div style={{ position: "relative", flex: 1, height: `${Math.max(volH, d.done ? 8 : 4)}px`, background: d.done ? C.accent : d.rest ? C.border : `${C.accent}25`, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {d.done && exCount > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: "#000", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>{exCount}</span>}
              </div>
              {d.done && durH > 0 && <div title={`${d.durMin}min`} style={{ width: 6, height: `${durH}px`, background: C.blue, borderRadius: "3px 3px 0 0", opacity: 0.85 }} />}
            </div>
            <div style={{ fontSize: 10, color: C.muted }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
};

const Modal = ({ onClose, children, title }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px" }}>
    <div style={{ ...s.card, width: "100%", maxWidth: 640, maxHeight: "92vh", overflowY: "auto", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={s.h2}>{title}</h2>
        <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const WorkoutDetailModal = ({ treino, onClose }) => (
  <Modal onClose={onClose} title={`${treino.day} — ${treino.muscles.join(" & ")}`}>
    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
      <Badge text={treino.date} color={C.muted} />
      <Badge text={`${treino.exercises.length} exercícios`} color={C.blue} />
      {treino.academia && <Badge text={treino.academia} color={C.purple} />}
      {treino.durMin > 0 && <Badge text={`⏱ ${treino.durMin} min`} color={C.teal} />}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {treino.exercises.map((ex, i) => {
        const hist = HISTORICO_EXERCICIOS[ex.name];
        const anterior = hist && hist.length > 1 ? hist[1] : null;
        const evolucao = anterior ? ex.kg - anterior.kg : 0;
        return (
          <div key={i} style={{ ...s.card, padding: 14, borderLeft: `3px solid ${C.accent}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>🏋️ {ex.aparelho} · <Badge text={ex.muscle} color={C.blue} /></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{ex.kg > 0 ? `${ex.kg}kg` : "—"}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{ex.series}×{ex.reps} reps</div>
                {evolucao > 0 && <div style={{ fontSize: 11, color: C.accent }}>↑ +{evolucao}kg</div>}
              </div>
            </div>
            {hist && hist.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                {hist.slice(0, 3).map((h, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: C.muted }}>{h.data} · {h.aparelho}</span>
                    <span style={{ color: j === 0 ? C.accent : C.text, fontWeight: j === 0 ? 700 : 400 }}>{h.kg}kg × {h.reps}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 14, padding: 14, background: C.surface, borderRadius: 10 }}>
      <div style={{ ...s.lbl, marginBottom: 8 }}>Volume Total</div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {Object.entries(treino.exercises.reduce((acc, ex) => { acc[ex.muscle] = (acc[ex.muscle]||0) + ex.kg*ex.reps*ex.series; return acc; }, {})).map(([m, vol]) => (
          <div key={m}><div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{vol.toLocaleString()}kg</div><div style={{ fontSize: 11, color: C.muted }}>{m}</div></div>
        ))}
      </div>
    </div>
  </Modal>
);

const AcademiaModal = ({ onSelect, onClose }) => (
  <Modal onClose={onClose} title="Onde você vai treinar hoje?">
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {ACADEMIAS.map(a => (
        <div key={a.id} onClick={() => onSelect(a)} style={{ ...s.card, cursor: "pointer", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: C.accent+"40" }}>
          <div><div style={{ fontWeight: 700 }}>{a.name}</div><div style={{ fontSize: 12, color: C.muted }}>{a.equipamentos.length} equipamentos</div></div>
          <span>→</span>
        </div>
      ))}
      <div onClick={() => onSelect(null)} style={{ ...s.card, cursor: "pointer", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", borderStyle: "dashed" }}>
        <div><div style={{ fontWeight: 700, color: C.muted }}>🏠 Treino Livre</div><div style={{ fontSize: 12, color: C.muted }}>Equipamentos genéricos</div></div>
        <span style={{ color: C.muted }}>→</span>
      </div>
    </div>
  </Modal>
);

const ExercisePanel = ({ ex, academia, onDone }) => {
  const [aparelho, setAparelho] = useState(ex.aparelhoId || "");
  const [timerActive, setTimerActive] = useState(false);
  const [timerSecs, setTimerSecs] = useState(ex.rest);
  const buildSeries = (n, kg, reps) => Array.from({ length: n }, () => ({ kg, reps, done: false }));
  const [series, setSeries] = useState(buildSeries(ex.sets, ex.kg, ex.reps));
  const lista = academia ? academia.equipamentos : EQUIPAMENTOS_GENERICOS;
  const listaFiltrada = lista.filter(eq => eq.muscles.includes(ex.muscle) || eq.muscles.includes("Todos") || eq.muscles.includes("Vários"));
  const hist = HISTORICO_EXERCICIOS[ex.name];
  const ultima = hist && hist[0];
  const updateSerie = (i, field, val) => setSeries(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const toggleSerieDone = (i) => setSeries(prev => prev.map((s, idx) => idx === i ? { ...s, done: !s.done } : s));
  const addSerie = () => setSeries(prev => { const last = prev[prev.length-1]; return [...prev, { kg: last?.kg||ex.kg, reps: last?.reps||ex.reps, done: false }]; });
  const removeSerie = (i) => setSeries(prev => prev.length > 1 ? prev.filter((_,idx) => idx !== i) : prev);
  const seriesDone = series.filter(s => s.done).length;
  const allDone = seriesDone === series.length && series.length > 0;

  // Fixed: useEffect-based timer with proper cleanup to prevent memory leaks
  useEffect(() => {
    if (!timerActive) return;
    if (timerSecs <= 0) { setTimerActive(false); return; }
    const iv = setInterval(() => setTimerSecs(s => { if (s <= 1) { setTimerActive(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(iv);
  }, [timerActive, timerSecs]);

  const startTimer = () => { setTimerSecs(ex.rest); setTimerActive(true); };
  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
      {ultima && (
        <div style={{ padding: 10, background: `${C.accent}10`, border: `1px solid ${C.accent}30`, borderRadius: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>💡 Última vez ({ultima.data})</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{ultima.aparelho} · <strong style={{ color: C.text }}>{ultima.kg}kg × {ultima.reps}</strong> <span style={{ color: C.accent }}>→ Sugerido: {ultima.kg+1}kg</span></div>
        </div>
      )}
      <SobrecargazPanel exercicio={ex.name} />
      <div style={{ marginBottom: 14 }}>
        <div style={{ ...s.lbl, marginBottom: 6 }}>Equipamento</div>
        <select value={aparelho} onChange={e => setAparelho(e.target.value)} style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontFamily: "inherit", fontSize: 13 }}>
          <option value="">Selecionar...</option>
          {listaFiltrada.map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.tipo})</option>)}
          {listaFiltrada.length === 0 && lista.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
        </select>
      </div>
      <div style={{ ...s.lbl, marginBottom: 10 }}>Séries ({seriesDone}/{series.length})</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        <div className="serie-row" style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 90px 36px", gap: 6, alignItems: "center", paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
          {["#","KG","REPS","DESCANSO","✓"].map(h => <div key={h} style={{ ...s.lbl, fontSize: 9 }}>{h}</div>)}
        </div>
        {series.map((ser, i) => (
          <div key={i} className="serie-row" style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 90px 36px", gap: 6, alignItems: "center", padding: "6px 8px", borderRadius: 8, background: ser.done ? `${C.accent}10` : "transparent", border: `1px solid ${ser.done ? C.accent+"40" : C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: ser.done ? C.accent : C.muted }}>{i+1}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <button onClick={() => updateSerie(i,"kg",Math.max(0,(ser.kg||0)-0.5))} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <input type="number" value={ser.kg} onChange={e => updateSerie(i,"kg",+e.target.value)} style={{ width: 36, textAlign: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 2px", color: C.accent, fontWeight: 800, fontSize: 13, fontFamily: "inherit" }} />
              <button onClick={() => updateSerie(i,"kg",(ser.kg||0)+0.5)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.accent}30`, background: "transparent", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <button onClick={() => updateSerie(i,"reps",Math.max(1,(ser.reps||1)-1))} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <input type="number" value={ser.reps} onChange={e => updateSerie(i,"reps",+e.target.value)} style={{ width: 36, textAlign: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 2px", color: C.text, fontWeight: 700, fontSize: 13, fontFamily: "inherit" }} />
              <button onClick={() => updateSerie(i,"reps",(ser.reps||1)+1)} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.blue}30`, background: "transparent", color: C.blue, cursor: "pointer", fontFamily: "inherit", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
            <div>
              {!ser.done && seriesDone === i && i > 0 ? (
                <button onClick={startTimer} style={{ ...btn(C.blue,true), padding: "4px 6px", fontSize: 10, width: "100%" }}>{timerActive ? `⏱${timerSecs}s` : `▶${ex.rest}s`}</button>
              ) : <div style={{ fontSize: 10, color: C.muted, textAlign: "center" }}>{ex.rest}s</div>}
            </div>
            <button onClick={() => toggleSerieDone(i)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${ser.done ? C.accent : C.border}`, background: ser.done ? C.accent : "transparent", color: ser.done ? "#000" : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={addSerie} style={{ ...btn(C.purple,true), fontSize: 12, padding: "6px 14px" }}>+ Série</button>
        {series.length > 1 && <button onClick={() => removeSerie(series.length-1)} style={{ ...btn(C.red,true), fontSize: 12, padding: "6px 14px" }}>− Remover última</button>}
      </div>
      {allDone && <button onClick={() => onDone({ aparelho, series })} style={{ ...btn(C.accent), width: "100%" }}>✓ Confirmar exercício ({series.length} séries)</button>}
    </div>
  );
};

const AnamneseModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ nome:"", nascimento:"", sexo:"", altura:"", peso:"", doencas:[], doencaOutra:"", medicamentos:"", cirurgias:"", lesoes:"", fumo:"", alcool:"", sono:"", estresse:"", objetivo:"", experiencia:"", frequencia:"", limitacoes:"", parq:{ cardio:null, torax:null, desmaio:null, ossos:null, pressao:null, outro:null } });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const steps = ["Identificação","Saúde","Hábitos","Fitness","PAR-Q"];
  const inp = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 13, boxSizing: "border-box" };
  const StepDot = ({ idx }) => <div style={{ width: 8, height: 8, borderRadius: "50%", background: idx <= step ? C.accent : C.border, transition: "background 0.3s" }} />;
  return (
    <Modal onClose={onClose} title="📋 Anamnese">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {steps.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flex: i < steps.length-1 ? 1 : 0 }}>
            <div onClick={() => i < step && setStep(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: i < step ? "pointer" : "default" }}>
              <StepDot idx={i} />
              <div style={{ fontSize: 9, color: i===step ? C.accent : C.muted, fontWeight: i===step ? 700 : 400, whiteSpace: "nowrap" }}>{label}</div>
            </div>
            {i < steps.length-1 && <div style={{ flex: 1, height: 1, background: i < step ? C.accent : C.border, marginBottom: 16 }} />}
          </div>
        ))}
      </div>
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="rg2" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Nome completo</div><input style={inp} placeholder="Lucas Mendes" value={form.nome} onChange={e => set("nome",e.target.value)} /></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Nascimento</div><input style={inp} type="date" value={form.nascimento} onChange={e => set("nascimento",e.target.value)} /></div>
          </div>
          <div className="rg3" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Sexo</div><select style={inp} value={form.sexo} onChange={e => set("sexo",e.target.value)}><option value="">Selecionar...</option><option>Masculino</option><option>Feminino</option><option>Prefiro não informar</option></select></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Altura (cm)</div><input style={inp} type="number" placeholder="175" value={form.altura} onChange={e => set("altura",e.target.value)} /></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Peso (kg)</div><input style={inp} type="number" placeholder="80" value={form.peso} onChange={e => set("peso",e.target.value)} /></div>
          </div>
          {form.altura && form.peso && (
            <div style={{ padding: 12, background: `${C.blue}12`, border: `1px solid ${C.blue}30`, borderRadius: 10 }}>
              <div style={s.lbl}>IMC calculado</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.blue, marginTop: 4 }}>{(form.peso/((form.altura/100)**2)).toFixed(1)}</div>
            </div>
          )}
        </div>
      )}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><div style={{ ...s.lbl, marginBottom: 8 }}>Condições de saúde</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Diabetes","Hipertensão","Cardiopatia","Asma","Artrite","Osteoporose","Depressão/Ansiedade"].map(d => {
                const sel = form.doencas.includes(d);
                return <button key={d} onClick={() => set("doencas", sel ? form.doencas.filter(x=>x!==d) : [...form.doencas,d])} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${sel?C.red:C.border}`, background:sel?`${C.red}18`:"transparent", color:sel?C.red:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12 }}>{d}</button>;
              })}
            </div>
          </div>
          <div><div style={{ ...s.lbl, marginBottom: 6 }}>Medicamentos</div><input style={inp} placeholder="Nome e dosagem, ou 'Não'" value={form.medicamentos} onChange={e => set("medicamentos",e.target.value)} /></div>
          <div className="rg2" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Cirurgias (2 anos)</div><input style={inp} placeholder="Nenhuma ou descreva..." value={form.cirurgias} onChange={e => set("cirurgias",e.target.value)} /></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Lesões/dores crônicas</div><input style={inp} placeholder="Joelho, lombar..." value={form.lesoes} onChange={e => set("lesoes",e.target.value)} /></div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="rg2" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Tabagismo</div><select style={inp} value={form.fumo} onChange={e => set("fumo",e.target.value)}><option value="">Selecionar...</option><option>Não fumo</option><option>Ex-fumante</option><option>Fumante ocasional</option><option>Fumante diário</option></select></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Álcool</div><select style={inp} value={form.alcool} onChange={e => set("alcool",e.target.value)}><option value="">Selecionar...</option><option>Não consumo</option><option>Ocasionalmente</option><option>Fins de semana</option><option>Diariamente</option></select></div>
          </div>
          <div className="rg2" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Sono/noite</div><select style={inp} value={form.sono} onChange={e => set("sono",e.target.value)}><option value="">Selecionar...</option><option>Menos de 5h</option><option>5–6h</option><option>6–7h</option><option>7–8h</option><option>Mais de 8h</option></select></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Estresse</div><select style={inp} value={form.estresse} onChange={e => set("estresse",e.target.value)}><option value="">Selecionar...</option><option>Baixo</option><option>Moderado</option><option>Alto</option><option>Muito alto</option></select></div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><div style={{ ...s.lbl, marginBottom: 8 }}>Objetivo principal</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Hipertrofia muscular","Perda de peso","Ganho de força","Condicionamento","Reabilitação","Manutenção"].map(o => (
                <button key={o} onClick={() => set("objetivo",o)} style={{ padding:"10px 12px", borderRadius:10, border:`1px solid ${form.objetivo===o?C.accent:C.border}`, background:form.objetivo===o?`${C.accent}15`:"transparent", color:form.objetivo===o?C.accent:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:13, textAlign:"left" }}>{o}</button>
              ))}
            </div>
          </div>
          <div className="rg2" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Experiência</div><select style={inp} value={form.experiencia} onChange={e => set("experiencia",e.target.value)}><option value="">Selecionar...</option><option>Iniciante (&lt;6 meses)</option><option>Intermediário (6m–2 anos)</option><option>Avançado (+2 anos)</option></select></div>
            <div><div style={{ ...s.lbl, marginBottom: 6 }}>Frequência desejada</div><select style={inp} value={form.frequencia} onChange={e => set("frequencia",e.target.value)}><option value="">Selecionar...</option><option>2x/semana</option><option>3x/semana</option><option>4x/semana</option><option>5x+/semana</option></select></div>
          </div>
          <div><div style={{ ...s.lbl, marginBottom: 6 }}>Limitações físicas</div><input style={inp} placeholder="Ex: dor no joelho ao agachar..." value={form.limitacoes} onChange={e => set("limitacoes",e.target.value)} /></div>
        </div>
      )}
      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ padding: 12, background: `${C.blue}12`, border: `1px solid ${C.blue}30`, borderRadius: 10, fontSize: 12, color: C.blue }}>ℹ️ <strong>PAR-Q</strong> — Questionário de Prontidão para Atividade Física</div>
          {[
            { key: "cardio", q: "Algum médico já disse que você possui algum problema cardíaco?" },
            { key: "torax", q: "Você sente dores no peito quando pratica atividade física?" },
            { key: "desmaio", q: "Você perdeu o equilíbrio por tontura ou já desmaiou?" },
            { key: "ossos", q: "Você tem algum problema ósseo ou articular que se agrava com exercício?" },
            { key: "pressao", q: "Você usa medicamentos para pressão arterial ou coração?" },
            { key: "outro", q: "Existe alguma outra razão para você NÃO praticar atividade física?" },
          ].map(({ key, q }) => (
            <div key={key} style={{ padding: 12, background: C.surface, borderRadius: 10 }}>
              <div style={{ fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{q}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Sim","Não"].map(opt => (
                  <button key={opt} onClick={() => set("parq",{...form.parq,[key]:opt})} style={{ padding:"6px 20px", borderRadius:8, border:`1px solid ${form.parq[key]===opt?(opt==="Sim"?C.red:C.accent):C.border}`, background:form.parq[key]===opt?(opt==="Sim"?`${C.red}18`:`${C.accent}18`):"transparent", color:form.parq[key]===opt?(opt==="Sim"?C.red:C.accent):C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:13 }}>{opt}</button>
                ))}
              </div>
            </div>
          ))}
          {Object.values(form.parq).some(v => v==="Sim") && <div style={{ padding:12, background:`${C.red}12`, border:`1px solid ${C.red}30`, borderRadius:10, fontSize:12, color:C.red, fontWeight:600 }}>⚠️ Recomendamos consultar um médico antes de iniciar.</div>}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => step > 0 ? setStep(s => s-1) : onClose()} style={{ ...btn(C.muted,true) }}>{step===0?"Cancelar":"← Anterior"}</button>
        {step < steps.length-1 ? <button onClick={() => setStep(s => s+1)} style={btn(C.accent)}>Próximo →</button> : <button onClick={async () => { if (gd().saveAnamnese) await gd().saveAnamnese(form); onClose(); }} style={btn(C.accent)}>✓ Salvar</button>}
      </div>
    </Modal>
  );
};

const EXERCICIOS_ALTERNATIVOS = {
  "Ombros": [
    { name:"Desenvolvimento c/ Halteres",aparelhoId:"haltere_fitzone",sets:4,reps:"10-12",kg:20,rest:60 },
    { name:"Desenvolvimento c/ Barra",aparelhoId:"smith",sets:4,reps:"8-10",kg:35,rest:90 },
    { name:"Elevação Lateral",aparelhoId:"haltere_fitzone",sets:3,reps:"12-15",kg:10,rest:45 },
    { name:"Elevação Frontal",aparelhoId:"haltere_fitzone",sets:3,reps:"12",kg:8,rest:45 },
    { name:"Arnold Press",aparelhoId:"haltere_fitzone",sets:3,reps:"10",kg:16,rest:60 },
    { name:"Face Pull",aparelhoId:"polia_alta",sets:3,reps:"12-15",kg:20,rest:45 },
  ],
  "Bíceps": [
    { name:"Rosca Direta c/ Barra",aparelhoId:"barra_g",sets:3,reps:"10-12",kg:30,rest:60 },
    { name:"Rosca Martelo",aparelhoId:"haltere_fitzone",sets:3,reps:"10",kg:14,rest:60 },
    { name:"Rosca Concentrada",aparelhoId:"haltere_fitzone",sets:3,reps:"12",kg:10,rest:45 },
    { name:"Rosca no Cabo",aparelhoId:"polia_baixa",sets:3,reps:"12-15",kg:15,rest:45 },
  ],
  "Abdômen": [
    { name:"Prancha Isométrica",aparelhoId:"peso_corp",sets:4,reps:"60s",kg:0,rest:30 },
    { name:"Crunch no Cabo",aparelhoId:"polia_alta",sets:4,reps:"15",kg:25,rest:45 },
    { name:"Elevação de Pernas",aparelhoId:"peso_corp",sets:3,reps:"15",kg:0,rest:30 },
    { name:"Abdominal Supra",aparelhoId:"peso_corp",sets:4,reps:"20",kg:0,rest:30 },
  ],
  "Peito": [
    { name:"Supino Reto c/ Barra",aparelhoId:"barra_supino",sets:4,reps:"8-10",kg:80,rest:90 },
    { name:"Supino Inclinado c/ Haltere",aparelhoId:"haltere_fitzone",sets:4,reps:"10-12",kg:18,rest:75 },
    { name:"Crucifixo",aparelhoId:"haltere_fitzone",sets:3,reps:"12",kg:14,rest:60 },
    { name:"Flexão de Braço",aparelhoId:"peso_corp",sets:4,reps:"15",kg:0,rest:60 },
  ],
  "Costas": [
    { name:"Puxada Frente",aparelhoId:"polia_alta",sets:4,reps:"10-12",kg:60,rest:75 },
    { name:"Remada Baixa",aparelhoId:"polia_baixa",sets:4,reps:"10",kg:55,rest:75 },
    { name:"Remada Unilateral",aparelhoId:"haltere_fitzone",sets:3,reps:"10",kg:30,rest:60 },
    { name:"Pullover",aparelhoId:"haltere_fitzone",sets:3,reps:"12",kg:20,rest:60 },
  ],
  "Pernas": [
    { name:"Agachamento Livre",aparelhoId:"smith",sets:4,reps:"10-12",kg:60,rest:90 },
    { name:"Leg Press 45°",aparelhoId:"leg_press",sets:4,reps:"12-15",kg:120,rest:90 },
    { name:"Extensora",aparelhoId:"extensora",sets:3,reps:"15",kg:50,rest:60 },
    { name:"Stiff",aparelhoId:"haltere_fitzone",sets:4,reps:"10-12",kg:30,rest:75 },
  ],
  "Tríceps": [
    { name:"Tríceps Corda",aparelhoId:"polia_alta",sets:4,reps:"12-15",kg:25,rest:45 },
    { name:"Tríceps Francês",aparelhoId:"haltere_fitzone",sets:3,reps:"10",kg:10,rest:60 },
    { name:"Mergulho no Banco",aparelhoId:"peso_corp",sets:3,reps:"15",kg:0,rest:60 },
  ],
};

const TrocaExercicioModal = ({ exercicio, modoSoAdicionar, onTrocar, onAdicionar, onClose }) => {
  const [tab, setTab] = useState(modoSoAdicionar ? "adicionar" : "trocar");
  const [muscleAdd, setMuscleAdd] = useState("Ombros");
  const alternativas = (EXERCICIOS_ALTERNATIVOS[exercicio.muscle]||[]).filter(e => e.name !== exercicio.name);
  const tabBtn = (id, label) => <button onClick={() => setTab(id)} style={{ flex:1, padding:"9px 0", border:"none", background:tab===id?C.accent:"transparent", color:tab===id?"#000":C.muted, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", borderRadius:8 }}>{label}</button>;
  return (
    <Modal onClose={onClose} title={`Exercício: ${exercicio.name}`}>
      <div style={{ display:"flex", gap:4, background:C.surface, padding:4, borderRadius:10, marginBottom:20 }}>
        {tabBtn("trocar","🔄 Trocar")} {tabBtn("adicionar","➕ Adicionar")}
      </div>
      {tab === "trocar" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ fontSize:12, color:C.muted }}>Alternativas para <strong style={{ color:C.text }}>{exercicio.muscle}</strong></div>
          {alternativas.map((alt, i) => (
            <div key={i} onClick={() => onTrocar(alt)} style={{ ...s.card, padding:14, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:700 }}>{alt.name}</div><div style={{ fontSize:12, color:C.muted }}>{alt.sets}×{alt.reps} · {alt.rest}s</div></div>
              <div style={{ textAlign:"right" }}>{alt.kg>0&&<div style={{ fontSize:16, fontWeight:800, color:C.accent }}>{alt.kg}kg</div>}<div style={{ fontSize:11, color:C.blue }}>Trocar →</div></div>
            </div>
          ))}
        </div>
      )}
      {tab === "adicionar" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {Object.keys(EXERCICIOS_ALTERNATIVOS).map(m => <button key={m} onClick={() => setMuscleAdd(m)} style={{ padding:"5px 12px", borderRadius:16, border:`1px solid ${muscleAdd===m?C.accent:C.border}`, background:muscleAdd===m?`${C.accent}18`:"transparent", color:muscleAdd===m?C.accent:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12 }}>{m}</button>)}
          </div>
          {(EXERCICIOS_ALTERNATIVOS[muscleAdd]||[]).map((ex, i) => (
            <div key={i} onClick={() => onAdicionar({ ...ex, id:Date.now()+i, muscle:muscleAdd })} style={{ ...s.card, padding:14, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:700 }}>{ex.name}</div><div style={{ fontSize:12, color:C.muted }}>{muscleAdd} · {ex.sets}×{ex.reps}</div></div>
              <div style={{ fontSize:11, color:C.accent, fontWeight:700 }}>+ Adicionar</div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

const AvatarSVG = ({ config, size = 180 }) => {
  const skins = { claro:"#FDDBB4", medio:"#E8A87C", escuro:"#8D5524", muito_escuro:"#4A2912" };
  const skinShade = { claro:"#E8C49A", medio:"#C8844A", escuro:"#6B3C12", muito_escuro:"#2E1608" };
  const skinLight = { claro:"#FFF0D8", medio:"#FFCB96", medio_light:"#F0B070", escuro:"#B0703A", muito_escuro:"#6A3520" };
  const hairs = { preto:"#1a1a1a", castanho:"#6B3A2A", loiro:"#C8920A", ruivo:"#B02820", grisalho:"#888898", branco:"#D8D8E0" };
  const cloths = { verde:C.accent, azul:C.blue, roxo:C.purple, vermelho:C.red, laranja:C.orange, cinza:"#6B6B85" };
  const skin = skins[config.pele] || skins.medio;
  const skinD = skinShade[config.pele] || skinShade.medio;
  const skinL = skinLight[config.pele] || skinLight.medio;
  const hair = hairs[config.cabelo_cor] || hairs.preto;
  const hairD = hair + "CC";
  const shirt = cloths[config.roupa_top] || cloths.verde;
  const shirtD = shirt + "BB";
  const pants = cloths[config.roupa_bottom] || cloths.azul;
  const pantsD = pants + "AA";

  // Body shape params
  const isGordo = config.corpo === "gordo";
  const isBarriga = config.corpo === "barriguinho";
  const isMagro = config.corpo === "magro";
  const isAtletico = config.corpo === "atletico";
  const bodyW = isGordo ? 58 : isBarriga ? 48 : isMagro ? 32 : 42;
  const shoulderW = isAtletico ? 64 : isGordo ? 66 : bodyW + 10;
  const waistW = isGordo ? 58 : isBarriga ? 50 : isMagro ? 28 : 36;
  const hipW = isGordo ? 62 : isBarriga ? 52 : isMagro ? 34 : 42;
  const bellyBump = isGordo ? 16 : isBarriga ? 9 : 0;
  const bx = 100 - bodyW / 2;
  const sx = 100 - shoulderW / 2;

  return (
    <svg viewBox="0 0 200 310" width={size} height={size * (310/200)} style={{ display: "block" }}>
      <defs>
        <radialGradient id="headGrad" cx="45%" cy="38%" r="55%">
          <stop offset="0%" stopColor={skinL} />
          <stop offset="100%" stopColor={skinD} />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shirt} stopOpacity="1" />
          <stop offset="100%" stopColor={shirtD} stopOpacity="1" />
        </radialGradient>
        <radialGradient id="pantGrad" cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor={pants} />
          <stop offset="100%" stopColor={pantsD} />
        </radialGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
        <linearGradient id="legL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={pantsD} />
          <stop offset="100%" stopColor={pants} />
        </linearGradient>
        <linearGradient id="legR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={pants} />
          <stop offset="100%" stopColor={pantsD} />
        </linearGradient>
        <linearGradient id="shoeL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#222" />
        </linearGradient>
        <linearGradient id="shoeR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#222" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="305" rx={bodyW * 0.75} ry="4" fill="rgba(0,0,0,0.18)" />

      {/* === LEGS === */}
      {/* Left leg */}
      <path d={`M ${100 - waistW/2} 190 Q ${100 - waistW/2 - 2} 235 ${100 - hipW/2 + 4} 270 L ${100 - hipW/2 + 14} 270 Q ${100 - waistW/2 + 6} 235 ${100 - waistW/2 + 6} 190 Z`} fill="url(#legL)" />
      {/* Right leg */}
      <path d={`M ${100 + waistW/2} 190 Q ${100 + waistW/2 + 2} 235 ${100 + hipW/2 - 4} 270 L ${100 + hipW/2 - 14} 270 Q ${100 + waistW/2 - 6} 235 ${100 + waistW/2 - 6} 190 Z`} fill="url(#legR)" />
      {/* Leg crease */}
      <line x1={100 - 2} y1="190" x2={100 - 2} y2="268" stroke={pantsD} strokeWidth="1.5" opacity="0.5" />

      {/* === SHOES === */}
      <ellipse cx={100 - hipW/2 + 9} cy="274" rx="14" ry="6" fill="url(#shoeL)" />
      <rect x={100 - hipW/2 - 4} y="268" width="26" height="8" rx="4" fill="url(#shoeL)" />
      <rect x={100 - hipW/2 + 12} y="268" width="10" height="6" rx="2" fill="#fff" opacity="0.15" />

      <ellipse cx={100 + hipW/2 - 9} cy="274" rx="14" ry="6" fill="url(#shoeR)" />
      <rect x={100 + hipW/2 - 22} y="268" width="26" height="8" rx="4" fill="url(#shoeR)" />
      <rect x={100 + hipW/2 - 22} y="268" width="10" height="6" rx="2" fill="#fff" opacity="0.15" />

      {/* === ARMS === */}
      {/* Left arm */}
      <path d={`M ${sx - 2} 118 Q ${sx - 18} 140 ${sx - 14} 172 L ${sx - 6} 173 Q ${sx - 8} 142 ${sx + 6} 120 Z`} fill={skin} />
      <ellipse cx={sx - 10} cy="174" rx="8" ry="10" fill={skin} />
      {/* Left arm shirt sleeve */}
      <path d={`M ${sx - 2} 118 Q ${sx - 16} 136 ${sx - 14} 155 L ${sx - 6} 155 Q ${sx - 8} 138 ${sx + 6} 120 Z`} fill="url(#bodyGrad)" opacity="0.95" />

      {/* Right arm */}
      <path d={`M ${sx + shoulderW + 2} 118 Q ${sx + shoulderW + 18} 140 ${sx + shoulderW + 14} 172 L ${sx + shoulderW + 6} 173 Q ${sx + shoulderW + 8} 142 ${sx + shoulderW - 6} 120 Z`} fill={skin} />
      <ellipse cx={sx + shoulderW + 10} cy="174" rx="8" ry="10" fill={skin} />
      {/* Right arm shirt sleeve */}
      <path d={`M ${sx + shoulderW + 2} 118 Q ${sx + shoulderW + 16} 136 ${sx + shoulderW + 14} 155 L ${sx + shoulderW + 6} 155 Q ${sx + shoulderW + 8} 138 ${sx + shoulderW - 6} 120 Z`} fill="url(#bodyGrad)" opacity="0.95" />

      {/* === TORSO === */}
      {/* Hip/waist band */}
      <path d={`M ${100 - hipW/2} 185 Q 100 ${185 + (isGordo?10:4)} ${100 + hipW/2} 185 L ${100 + waistW/2 + 1} 178 Q 100 ${178 + (bellyBump>0?bellyBump*0.4:2)} ${100 - waistW/2 - 1} 178 Z`} fill="url(#pantGrad)" />

      {/* Main shirt body */}
      <path d={`M ${sx} 118 Q ${sx - 2} 145 ${100 - waistW/2} 178 Q 100 ${178 + bellyBump} ${100 + waistW/2} 178 Q ${sx + shoulderW + 2} 145 ${sx + shoulderW} 118 Q 100 112 ${sx} 118 Z`} fill="url(#bodyGrad)" filter="url(#softShadow)" />

      {/* Shirt collar V-line detail */}
      <line x1="100" y1="118" x2="97" y2="130" stroke={shirtD} strokeWidth="1.2" opacity="0.6" />
      <line x1="100" y1="118" x2="103" y2="130" stroke={shirtD} strokeWidth="1.2" opacity="0.6" />

      {/* Shirt shoulder seam */}
      <path d={`M ${sx} 118 Q ${sx + 14} 114 ${sx + shoulderW/2 - 4} 115`} stroke={shirtD} strokeWidth="1" fill="none" opacity="0.5" />
      <path d={`M ${sx + shoulderW} 118 Q ${sx + shoulderW - 14} 114 ${sx + shoulderW/2 + 4} 115`} stroke={shirtD} strokeWidth="1" fill="none" opacity="0.5" />

      {/* Belly bump if present */}
      {bellyBump > 0 && <ellipse cx="100" cy={162} rx={bellyBump + 4} ry={bellyBump * 0.65} fill={shirtD} opacity="0.35" />}

      {/* Muscular chest lines for atletico */}
      {isAtletico && <>
        <path d="M 96 125 Q 90 135 88 148" stroke={shirtD} strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M 104 125 Q 110 135 112 148" stroke={shirtD} strokeWidth="1" fill="none" opacity="0.3" />
      </>}

      {/* === NECK === */}
      <rect x="93" y="95" width="14" height="24" rx="5" fill={skin} />
      <rect x="95" y="95" width="2" height="24" fill={skinD} opacity="0.25" rx="1" />
      <rect x="103" y="95" width="2" height="24" fill={skinD} opacity="0.25" rx="1" />

      {/* === HEAD === */}
      {/* Ear left */}
      <ellipse cx="73" cy="72" rx="5" ry="7" fill={skin} />
      <ellipse cx="74" cy="72" rx="3" ry="5" fill={skinD} opacity="0.4" />
      {/* Ear right */}
      <ellipse cx="127" cy="72" rx="5" ry="7" fill={skin} />
      <ellipse cx="126" cy="72" rx="3" ry="5" fill={skinD} opacity="0.4" />

      {/* Head shape */}
      <ellipse cx="100" cy="68" rx="26" ry="30" fill="url(#headGrad)" filter="url(#softShadow)" />
      {/* Jaw definition */}
      <path d="M 78 78 Q 82 96 100 100 Q 118 96 122 78" fill={skin} />
      <path d="M 78 78 Q 82 96 100 100 Q 118 96 122 78" fill="none" stroke={skinD} strokeWidth="0.5" opacity="0.3" />

      {/* Face side shadow */}
      <ellipse cx="78" cy="65" rx="6" ry="16" fill={skinD} opacity="0.12" />
      <ellipse cx="122" cy="65" rx="6" ry="16" fill={skinD} opacity="0.12" />

      {/* === HAIR === */}
      {config.cabelo_estilo === "curto" && (
        <path d="M 74 57 Q 78 36 100 32 Q 122 36 126 57 Q 120 44 100 42 Q 80 44 74 57 Z" fill={hair} />
      )}
      {config.cabelo_estilo === "medio" && (
        <path d="M 72 60 Q 74 34 100 28 Q 126 34 128 60 L 128 72 Q 124 56 122 46 Q 112 36 100 36 Q 88 36 78 46 Q 74 56 72 72 Z" fill={hair} />
      )}
      {config.cabelo_estilo === "longo" && (
        <path d="M 70 60 Q 72 30 100 24 Q 128 30 130 60 L 132 100 Q 126 80 124 60 L 124 48 Q 114 34 100 34 Q 86 34 76 48 L 76 60 Q 70 80 68 100 Z" fill={hair} />
      )}
      {config.cabelo_estilo === "coque" && <>
        <path d="M 74 57 Q 78 40 100 36 Q 122 40 126 57 Q 120 46 100 44 Q 80 46 74 57 Z" fill={hair} />
        <ellipse cx="100" cy="30" rx="8" ry="7" fill={hair} />
        <ellipse cx="100" cy="26" rx="5" ry="4" fill={hairD} />
      </>}
      {config.cabelo_estilo === "ondulado" && (
        <path d="M 72 58 Q 76 34 100 28 Q 124 34 128 58 Q 122 40 116 44 Q 110 38 104 42 Q 100 36 96 42 Q 90 38 84 44 Q 78 40 72 58 Z" fill={hair} />
      )}
      {config.cabelo_estilo !== "careca" && (
        // Hairline definition
        <path d={`M 74 57 Q 100 ${config.cabelo_estilo==="curto"?44:config.cabelo_estilo==="careca"?57:38} 126 57`} fill="none" stroke={hairD} strokeWidth="0.8" opacity="0.4" />
      )}

      {/* === EYEBROWS === */}
      <path d="M 85 57 Q 91 54 97 57" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 103 57 Q 109 54 115 57" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* === EYES === */}
      {/* Eye sockets subtle shading */}
      <ellipse cx="91" cy="66" rx="7" ry="6" fill={skinD} opacity="0.1" />
      <ellipse cx="109" cy="66" rx="7" ry="6" fill={skinD} opacity="0.1" />
      {/* Whites */}
      <ellipse cx="91" cy="66" rx="5.5" ry="5" fill="#fff" />
      <ellipse cx="109" cy="66" rx="5.5" ry="5" fill="#fff" />
      {/* Iris */}
      <circle cx="91.5" cy="66.5" r="3.2" fill="#4A7CC0" />
      <circle cx="109.5" cy="66.5" r="3.2" fill="#4A7CC0" />
      {/* Pupil */}
      <circle cx="91.5" cy="66.5" r="1.8" fill="#111" />
      <circle cx="109.5" cy="66.5" r="1.8" fill="#111" />
      {/* Catchlight */}
      <circle cx="92.5" cy="65.2" r="0.9" fill="#fff" />
      <circle cx="110.5" cy="65.2" r="0.9" fill="#fff" />
      {/* Eyelid top */}
      <path d="M 86 63 Q 91 61 96 63" stroke={skinD} strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M 104 63 Q 109 61 114 63" stroke={skinD} strokeWidth="1" fill="none" opacity="0.6" />
      {/* Lower eyelid */}
      <path d="M 86.5 69.5 Q 91 71 95.5 69.5" stroke={skinD} strokeWidth="0.7" fill="none" opacity="0.3" />
      <path d="M 104.5 69.5 Q 109 71 113.5 69.5" stroke={skinD} strokeWidth="0.7" fill="none" opacity="0.3" />

      {/* === NOSE === */}
      <path d="M 100 67 L 98 76 Q 100 78 102 76 Z" fill={skinD} opacity="0.3" />
      <path d="M 95 77 Q 98 80 100 79 Q 102 80 105 77" stroke={skinD} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="96.5" cy="77" r="2" fill={skinD} opacity="0.2" />
      <circle cx="103.5" cy="77" r="2" fill={skinD} opacity="0.2" />

      {/* === MOUTH === */}
      <path d="M 93 86 Q 97 89.5 100 89 Q 103 89.5 107 86" stroke={skinD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Lip philtrum */}
      <path d="M 98 83 Q 100 81 102 83" stroke={skinD} strokeWidth="0.8" fill="none" opacity="0.35" />

      {/* Cheek blush */}
      <ellipse cx="83" cy="75" rx="7" ry="4" fill={C.red} opacity="0.07" />
      <ellipse cx="117" cy="75" rx="7" ry="4" fill={C.red} opacity="0.07" />

      {/* === ACCESSORIES === */}
      {config.acessorio === "barba" && (
        <path d="M 80 80 Q 80 96 86 101 Q 93 106 100 106 Q 107 106 114 101 Q 120 96 120 80 Q 114 90 107 92 Q 100 93 93 92 Q 86 90 80 80 Z" fill={hair} opacity="0.9" />
      )}
      {config.acessorio === "oculos" && (
        <g>
          <rect x="83" y="62" width="15" height="11" rx="4" stroke={hair} strokeWidth="1.5" fill="rgba(160,200,255,0.1)" />
          <rect x="102" y="62" width="15" height="11" rx="4" stroke={hair} strokeWidth="1.5" fill="rgba(160,200,255,0.1)" />
          <line x1="98" y1="67" x2="102" y2="67" stroke={hair} strokeWidth="1.5" />
          <line x1="76" y1="67" x2="83" y2="67" stroke={hair} strokeWidth="1.5" />
          <line x1="117" y1="67" x2="124" y2="67" stroke={hair} strokeWidth="1.5" />
        </g>
      )}
      {config.acessorio === "bone" && (
        <>
          <path d="M 71 55 Q 74 30 100 26 Q 126 30 129 55 L 129 60 Q 118 48 100 46 Q 82 48 71 60 Z" fill={shirt} />
          <path d="M 71 55 L 62 58 Q 62 64 68 64 L 71 60 Z" fill={shirtD} />
          <path d="M 71 54 Q 100 44 129 54" fill="none" stroke={shirtD} strokeWidth="1.5" opacity="0.5" />
        </>
      )}
    </svg>
  );
};

const AvatarScreen = () => {
  const [config, setConfig] = useState({ pele:"medio", cabelo_estilo:"curto", cabelo_cor:"preto", roupa_top:"verde", roupa_bottom:"azul", acessorio:"nenhum", corpo:"atletico" });
  const set = (k, v) => setConfig(c => ({ ...c, [k]: v }));
  const Seletor = ({ label, campo, opcoes, color=C.accent }) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ ...s.lbl, marginBottom:8 }}>{label}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {opcoes.map(o => (
          <button key={o.id} onClick={() => set(campo,o.id)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${config[campo]===o.id?color:C.border}`, background:config[campo]===o.id?`${color}20`:"transparent", color:config[campo]===o.id?color:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
            {o.swatch&&<span style={{ width:10, height:10, borderRadius:"50%", background:o.swatch, display:"inline-block", border:"1px solid rgba(255,255,255,0.15)" }} />}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div><div style={s.lbl}>Personalização</div><h1 style={{ ...s.h1, marginTop:4 }}>Meu Avatar</h1></div>
      <div className="avatar-layout" style={{ gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
          <div style={{ ...s.card, padding:24, display:"flex", flexDirection:"column", alignItems:"center", gap:12, width:"100%" }}>
            <AvatarSVG config={config} size={160} />
            <div style={{ fontSize:13, fontWeight:700 }}>Lucas Mendes</div>
            <div style={{ display:"flex", gap:6 }}><Badge text="175cm" color={C.blue} /><Badge text="80kg" color={C.purple} /></div>
          </div>
          <button onClick={async () => { if (gd().saveAvatar) { await gd().saveAvatar(config); alert("Avatar salvo!"); } }} style={{ ...btn(C.accent), width:"100%", borderRadius:10 }}>💾 Salvar Avatar</button>
          <button style={{ ...btn(C.muted,true), width:"100%", borderRadius:10, fontSize:12 }} onClick={() => setConfig({ pele:"medio", cabelo_estilo:"curto", cabelo_cor:"preto", roupa_top:"verde", roupa_bottom:"azul", acessorio:"nenhum", corpo:"atletico" })}>↺ Resetar</button>
        </div>
        <div style={s.card}>
          <Seletor label="Tipo de corpo" campo="corpo" opcoes={[{id:"magro",label:"🦴 Magro"},{id:"atletico",label:"💪 Atlético"},{id:"medio",label:"🧍 Médio"},{id:"barriguinho",label:"🍺 Barriguinho"},{id:"gordo",label:"🐻 Gordinho"}]} color={C.orange} />
          <Seletor label="Tom de pele" campo="pele" opcoes={[{id:"claro",label:"Claro",swatch:"#FDDBB4"},{id:"medio",label:"Médio",swatch:"#E8A87C"},{id:"escuro",label:"Escuro",swatch:"#8D5524"},{id:"muito_escuro",label:"Muito escuro",swatch:"#4A2912"}]} color={C.orange} />
          <Seletor label="Estilo de cabelo" campo="cabelo_estilo" opcoes={[{id:"curto",label:"Curto"},{id:"medio",label:"Médio"},{id:"longo",label:"Longo"},{id:"careca",label:"Careca"},{id:"coque",label:"Coque"},{id:"ondulado",label:"Ondulado"}]} color={C.purple} />
          {config.cabelo_estilo!=="careca"&&<Seletor label="Cor do cabelo" campo="cabelo_cor" opcoes={[{id:"preto",label:"Preto",swatch:"#1a1a1a"},{id:"castanho",label:"Castanho",swatch:"#6B3A2A"},{id:"loiro",label:"Loiro",swatch:"#D4A017"},{id:"ruivo",label:"Ruivo",swatch:"#C0392B"},{id:"grisalho",label:"Grisalho",swatch:"#95A5A6"},{id:"branco",label:"Branco",swatch:"#ddd"}]} color={C.purple} />}
          <Seletor label="Cor da camiseta" campo="roupa_top" opcoes={[{id:"verde",label:"Verde",swatch:C.accent},{id:"azul",label:"Azul",swatch:C.blue},{id:"roxo",label:"Roxo",swatch:C.purple},{id:"vermelho",label:"Vermelho",swatch:C.red},{id:"laranja",label:"Laranja",swatch:C.orange},{id:"cinza",label:"Cinza",swatch:"#6B6B85"}]} color={C.accent} />
          <Seletor label="Cor da calça" campo="roupa_bottom" opcoes={[{id:"verde",label:"Verde",swatch:C.accent},{id:"azul",label:"Azul",swatch:C.blue},{id:"roxo",label:"Roxo",swatch:C.purple},{id:"vermelho",label:"Vermelho",swatch:C.red},{id:"laranja",label:"Laranja",swatch:C.orange},{id:"cinza",label:"Cinza",swatch:"#6B6B85"}]} color={C.blue} />
          <Seletor label="Acessório" campo="acessorio" opcoes={[{id:"nenhum",label:"Nenhum"},{id:"barba",label:"🧔 Barba"},{id:"oculos",label:"👓 Óculos"},{id:"bone",label:"🧢 Boné"}]} color={C.teal} />
        </div>
      </div>
    </div>
  );
};

const AlunoModal = ({ aluno, onClose }) => {
  const [aba, setAba] = useState("anamnese");
  const TREINOS_ALUNO = [
    { nome:"Treino A — Peito & Tríceps",criado:"10/05",exercicios:5,durMin:65 },
    { nome:"Treino B — Costas & Bíceps",criado:"10/05",exercicios:4,durMin:55 },
    { nome:"Treino C — Pernas",criado:"12/05",exercicios:5,durMin:70 },
    { nome:"Treino D — Ombros & Abdômen",criado:"12/05",exercicios:6,durMin:60 },
  ];
  const HISTORICO_ALUNO = [
    { day:"Seg 26/05",muscles:"Peito · Tríceps",durMin:62,exercicios:4,vol:8420 },
    { day:"Ter 27/05",muscles:"Costas · Bíceps",durMin:55,exercicios:4,vol:7680 },
    { day:"Qui 29/05",muscles:"Pernas",durMin:70,exercicios:3,vol:9360 },
  ];
  const AVATAR_ALUNO = { pele:"medio",cabelo_estilo:"curto",cabelo_cor:"castanho",roupa_top:"verde",roupa_bottom:"azul",acessorio:"nenhum",corpo:"atletico" };
  const ANAMNESE = { nome:"Lucas Mendes",nascimento:"15/03/1996",sexo:"Masculino",altura:"175",peso:"80",objetivo:"Hipertrofia muscular",experiencia:"Intermediário",frequencia:"4x/semana",lesoes:"Leve dor lombar",sono:"7–8h",estresse:"Moderado",fumo:"Não fumo",alcool:"Ocasionalmente" };
  const statusColor = aluno.status==="danger"?C.red:aluno.status==="alert"?C.orange:C.accent;
  const abas = [{id:"anamnese",label:"📋 Anamnese"},{id:"treinos",label:"🏋️ Treinos"},{id:"historico",label:"📊 Histórico"},{id:"avatar",label:"🧍 Avatar"}];
  return (
    <Modal onClose={onClose} title="">
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:`${statusColor}25`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:20, border:`2px solid ${statusColor}40` }}>{aluno.name[0]}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:18 }}>{aluno.name}</div>
          <div style={{ fontSize:12, color:C.muted }}>Último treino: {aluno.last}</div>
        </div>
        {aluno.status==="danger"?<Badge text="⚠️ Sumido" color={C.red}/>:aluno.status==="alert"?<Badge text="Irregular" color={C.orange}/>:<Badge text="✓ Regular" color={C.accent}/>}
      </div>
      <div style={{ display:"flex", gap:4, background:C.surface, padding:4, borderRadius:10, marginBottom:20 }}>
        {abas.map(a => <button key={a.id} onClick={() => setAba(a.id)} style={{ flex:1, padding:"8px 4px", border:"none", background:aba===a.id?C.purple:"transparent", color:aba===a.id?"#fff":C.muted, fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit", borderRadius:7 }}>{a.label}</button>)}
      </div>
      {aba==="anamnese"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="rg2" style={{display:"grid",gap:16}}>
            {[{l:"Nome",v:ANAMNESE.nome},{l:"Nascimento",v:ANAMNESE.nascimento},{l:"Sexo",v:ANAMNESE.sexo},{l:"Altura/Peso",v:`${ANAMNESE.altura}cm · ${ANAMNESE.peso}kg`}].map(({l,v}) => (
              <div key={l} style={{ padding:12, background:C.surface, borderRadius:10 }}><div style={s.lbl}>{l}</div><div style={{ fontWeight:600, fontSize:14, marginTop:3 }}>{v}</div></div>
            ))}
          </div>
          <div style={{ padding:12, background:C.surface, borderRadius:10 }}>
            <div style={{ ...s.lbl, marginBottom:8 }}>Objetivo & Fitness</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Badge text={ANAMNESE.objetivo} color={C.accent} /><Badge text={ANAMNESE.experiencia} color={C.blue} /><Badge text={ANAMNESE.frequencia} color={C.purple} />
            </div>
          </div>
          {ANAMNESE.lesoes&&<div style={{ padding:12, background:`${C.orange}10`, border:`1px solid ${C.orange}30`, borderRadius:10 }}><div style={{ ...s.lbl, color:C.orange, marginBottom:4 }}>⚠️ Lesões</div><div style={{ fontSize:13 }}>{ANAMNESE.lesoes}</div></div>}
        </div>
      )}
      {aba==="treinos"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {TREINOS_ALUNO.map((t,i) => (
            <div key={i} style={{ ...s.card, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:700 }}>{t.nome}</div><div style={{ fontSize:12, color:C.muted }}>{t.criado} · {t.exercicios} ex · ~{t.durMin}min</div></div>
              <div style={{ display:"flex", gap:6 }}><Badge text="Ativo" color={C.accent} /><button style={{ ...btn(C.purple,true), fontSize:11, padding:"3px 10px" }}>Editar</button></div>
            </div>
          ))}
          <button style={{ ...btn(C.purple,true), marginTop:8 }}>+ Criar treino para {aluno.name.split(" ")[0]}</button>
        </div>
      )}
      {aba==="historico"&&(
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="rg3" style={{display:"grid",gap:10}}>
            {[{v:"87",c:C.accent,l:"treinos totais"},{v:"62min",c:C.blue,l:"média/sessão"},{v:"12🔥",c:C.orange,l:"sequência"}].map(({v,c,l}) => (
              <div key={l} style={{ ...s.card, padding:12, textAlign:"center" }}><div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:11, color:C.muted }}>{l}</div></div>
            ))}
          </div>
          {HISTORICO_ALUNO.map((h,i) => (
            <div key={i} style={{ ...s.card, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontWeight:700, fontSize:13 }}>{h.day}</div><div style={{ fontSize:12, color:C.muted }}>{h.muscles} · {h.exercicios} ex</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontSize:16, fontWeight:800, color:C.accent }}>{h.vol.toLocaleString()}kg</div><div style={{ fontSize:11, color:C.blue }}>{h.durMin}min</div></div>
            </div>
          ))}
        </div>
      )}
      {aba==="avatar"&&(
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
          <AvatarSVG config={AVATAR_ALUNO} size={180} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:700, fontSize:16 }}>{aluno.name}</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:8 }}><Badge text="175cm" color={C.blue}/><Badge text="80kg" color={C.purple}/><Badge text="Atlético" color={C.accent}/></div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const AlunoDashboard = ({ setScreen }) => {
  const [modalTreino, setModalTreino] = useState(null);
  const [showAnamnese, setShowAnamnese] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showResumo, setShowResumo] = useState(false);
  const [showDeload, setShowDeload] = useState(true);
  const [showDeloadTreino, setShowDeloadTreino] = useState(false);

  // ── Dados reais via window.gymData, fallback para mocks ──
  const nomeReal    = gd().nome      || "Lucas Mendes";
  const streakReal  = gd().streak    ?? 12;
  const humorAtual  = gd().checkinHoje || null;
  const semanaReal  = gd().treinosSemana || TREINOS_SEMANA;
  const sessoesSem  = gd().sessoesSemana || TREINOS_SEMANA.filter(t=>t.done);
  const totalTreinos= gd().totalTreinos ?? 87;
  const tempoMedio  = gd().tempoMedio   ?? 62;

  const barData = semanaReal.map(t => ({ ...t, vol: t.exercises ? t.exercises.reduce((a,e) => a+e.kg*e.reps*(e.series||1), 0) : (t.vol||0) }));

  // Grupos musculares da semana (calculado a partir das sessões reais)
  const musculosTreinados = new Set(semanaReal.filter(t=>t.done).flatMap(t=>t.muscles||[]));
  const musculosSemana = {
    "Peito":    musculosTreinados.has("Peito"),
    "Tríceps":  musculosTreinados.has("Tríceps"),
    "Costas":   musculosTreinados.has("Costas"),
    "Bíceps":   musculosTreinados.has("Bíceps"),
    "Pernas":   musculosTreinados.has("Pernas"),
    "Ombros":   musculosTreinados.has("Ombros"),
    "Abdômen":  musculosTreinados.has("Abdômen"),
    "Panturrilha": musculosTreinados.has("Panturrilha"),
  };

  const humorColors = { cansado:C.muted, normal:C.blue, disposto:C.accent };
  const humorIcons  = { cansado:"😴", normal:"😐", disposto:"💪" };
  const missoesConcluidas = (gd().missoes || []).length;
  const missoesPendentes  = Math.max(0, MISSOES_SEMANA.length - missoesConcluidas);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {modalTreino&&<WorkoutDetailModal treino={modalTreino} onClose={() => setModalTreino(null)} />}
      {showAnamnese&&<AnamneseModal onClose={() => setShowAnamnese(false)} />}
      {showCheckIn&&<CheckInHumorModal onClose={() => setShowCheckIn(false)} onConfirm={async (h) => {
        if (gd().saveCheckin) await gd().saveCheckin(h);
        setShowCheckIn(false); setScreen("alunoTreino");
      }} />}
      {showResumo&&<ResumoSemanalModal onClose={() => setShowResumo(false)} />}
      {showDeloadTreino&&<DeloadTreinoModal onClose={() => setShowDeloadTreino(false)} />}

      {/* ── HERO: saudação + CTA principal — ACIMA DA DOBRA ── */}
      <div style={{ ...s.card, background:`linear-gradient(135deg,${C.accent}12,${C.teal}06)`, borderColor:`${C.accent}35`, padding:22 }}>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:2 }}>Boa tarde 👋</div>
            <h1 style={{ ...s.h1, fontSize:22, marginBottom:8 }}>{nomeReal}</h1>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
              <Badge text="Intermediário" color={C.blue} />
              <Badge text="Personal: Dr. Paulo" color={C.purple} />
              {humorAtual && <Badge text={`${humorIcons[humorAtual]} Check-in feito`} color={humorColors[humorAtual]} />}
            </div>
            <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Treino sugerido para hoje</div>
            <div style={{ fontWeight:800, fontSize:17, color:C.text, marginBottom:4 }}>Treino D — Ombros & Abdômen</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
              <Badge text="~55 min" color={C.blue} />
              <Badge text="6 exercícios" color={C.purple} />
              <Badge text="Moderado" color={C.orange} />
            </div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>💡 IA sugere: Desenvolvimento <strong style={{ color:C.text }}>20kg</strong> → <strong style={{ color:C.accent }}>21kg</strong></div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={() => setShowCheckIn(true)} style={{ ...btn(C.accent), fontSize:14, padding:"11px 26px" }}>
                {humorAtual ? "▶ Iniciar Treino" : "🧠 Check-in e Treinar"}
              </button>
              <button onClick={() => setShowAnamnese(true)} style={{ ...btn(C.muted,true), fontSize:12, padding:"11px 14px" }}>📋 Anamnese</button>
            </div>
          </div>
          <div style={{ ...s.card, textAlign:"center", minWidth:80, padding:14, flexShrink:0 }}>
            <div style={{ fontSize:26 }}>🔥</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.orange }}>{streakReal}</div>
            <div style={{ fontSize:10, color:C.muted }}>dias seguidos</div>
          </div>
        </div>
      </div>

      {/* ── Deload automático ── */}
      {showDeload && <DeloadBanner onVerTreino={()=>setShowDeloadTreino(true)} onDismiss={()=>setShowDeload(false)} />}

      {/* ── XP Banner ── */}
      <XPBanner onClick={() => setScreen("alunoGamificacao")} />

      {/* ── Quick-access strip: Resumo + atalhos ── */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
        <div onClick={() => setShowResumo(true)} style={{ flexShrink:0, cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, background:`${C.orange}12`, border:`1px solid ${C.orange}35`, minWidth:190 }}>
          <span style={{ fontSize:22 }}>🎉</span>
          <div>
            <div style={{ fontWeight:800, fontSize:12, color:C.orange }}>Resumo da Semana</div>
            <div style={{ fontSize:11, color:C.muted }}>3 treinos · 2 PRs · +480 XP</div>
          </div>
        </div>
        {[
          { label:"Ranking",   icon:"🥇", screen:"alunoRanking",   color:C.orange  },
          { label:"Horários",  icon:"⏰", screen:"alunoHorarios",  color:C.teal    },
          { label:"Personais", icon:"👤", screen:"alunoPersonais", color:C.purple  },
          { label:"Programas", icon:"📦", screen:"alunoPacotes",   color:C.blue    },
        ].map(it=>(
          <div key={it.screen} onClick={()=>setScreen(it.screen)} style={{ flexShrink:0, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 14px", borderRadius:12, background:C.card, border:`1px solid ${C.border}`, minWidth:72 }}>
            <span style={{ fontSize:22 }}>{it.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, color:it.color, whiteSpace:"nowrap" }}>{it.label}</span>
          </div>
        ))}
      </div>

      {/* Missões + Check-in strip */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <div onClick={() => setScreen("alunoGamificacao")} style={{ ...s.card, flex:1, minWidth:140, cursor:"pointer", padding:14, background:`${C.accent}08`, borderColor:`${C.accent}40` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:20 }}>🎯</span>
            <span style={{ fontWeight:700, color:C.accent, fontSize:13 }}>Missões</span>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:C.accent }}>{MISSOES_SEMANA.filter(m=>m.concluida).length}/{MISSOES_SEMANA.length}</div>
          <div style={{ fontSize:11, color:C.muted }}>{missoesPendentes} pendente{missoesPendentes!==1?"s":""}</div>
          <PBar pct={Math.round(MISSOES_SEMANA.filter(m=>m.concluida).length/MISSOES_SEMANA.length*100)} color={C.accent} />
        </div>
        <div onClick={() => setShowCheckIn(true)} style={{ ...s.card, flex:1, minWidth:140, cursor:"pointer", padding:14, background:`${C.blue}08`, borderColor:`${C.blue}30` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:20 }}>🧠</span>
            <span style={{ fontWeight:700, color:C.blue, fontSize:13 }}>Check-in</span>
          </div>
          <div style={{ fontSize:22 }}>{humorAtual ? humorIcons[humorAtual] : "—"}</div>
          <div style={{ fontSize:11, color:C.muted }}>{humorAtual ? "Feito hoje" : "Como você está?"}</div>
        </div>
        <div onClick={() => setScreen("alunoGamificacao")} style={{ ...s.card, flex:1, minWidth:140, cursor:"pointer", padding:14, background:`${ALUNO_NIVEL.cor}08`, borderColor:`${ALUNO_NIVEL.cor}40` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:20 }}>🏆</span>
            <span style={{ fontWeight:700, color:ALUNO_NIVEL.cor, fontSize:13 }}>Conquistas</span>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:ALUNO_NIVEL.cor }}>{CONQUISTAS_CATALOGO.filter(c=>c.desbloqueado).length}</div>
          <div style={{ fontSize:11, color:C.muted }}>de {CONQUISTAS_CATALOGO.length} desbloqueadas</div>
        </div>
      </div>

      <div className="rg4" style={{display:"grid",gap:16}}>
        <StatCard label="Treinos essa semana" value={sessoesSem.length} sub="Meta: 5" color={C.accent} icon="🏋️" />
        <StatCard label="Total de treinos" value={totalTreinos} sub="no GymAI" color={C.blue} icon="📈" />
        <StatCard label="Tempo médio" value={tempoMedio ? `${tempoMedio}min` : "—"} sub="por sessão" color={C.purple} icon="⏱️" />
        <StatCard label="Próximo treino" value="Hoje" sub="Configure agora" color={C.orange} icon="📅" />
      </div>
      <div className="rg2" style={{display:"grid",gap:16}}>
        <div style={s.card}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <h3 style={s.h3}>Volume da Semana</h3>
            <span style={{ fontSize:12, color:C.muted }}>3 de 5 treinos</span>
          </div>
          <div style={{ display:"flex", gap:14, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10,height:10,background:C.accent,borderRadius:2 }}/><span style={{ fontSize:10, color:C.muted }}>Volume (kg)</span></div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:6,height:10,background:C.blue,borderRadius:2 }}/><span style={{ fontSize:10, color:C.muted }}>Tempo (min)</span></div>
          </div>
          <BarChart data={barData} />
          <div style={{ marginTop:12 }}><PBar pct={60} /><div style={{ fontSize:12, color:C.muted, marginTop:6 }}>60% da meta semanal</div></div>
          <div style={{ marginTop:10, display:"flex", gap:12 }}>
            {TREINOS_SEMANA.filter(t=>t.done).map(t => <div key={t.day} style={{ textAlign:"center" }}><div style={{ fontSize:13, fontWeight:700, color:C.blue }}>{t.durMin}min</div><div style={{ fontSize:10, color:C.muted }}>{t.day}</div></div>)}
          </div>
        </div>
        <div style={s.card}>
          <h3 style={{ ...s.h3, marginBottom:4 }}>Grupos Musculares — Semana</h3>
          <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>Clique para ver detalhes do treino</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {Object.entries(musculosSemana).map(([muscle,trained]) => {
              const treino = TREINOS_SEMANA.find(t => t.done && t.muscles.includes(muscle));
              return (
                <div key={muscle} onClick={treino?()=>setModalTreino(treino):undefined} style={{ padding:"10px 12px", borderRadius:10, cursor:treino?"pointer":"default", background:treino?`${C.accent}06`:"transparent", border:`1px solid ${treino?C.accent+"20":C.border}`, transition:"all 0.15s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:trained?C.text:C.muted }}>{muscle}</span>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      {trained&&treino?<><span style={{ fontSize:11, color:C.muted }}>{treino.day} · {treino.durMin}min</span><span style={{ fontSize:11, color:C.accent, fontWeight:700 }}>✅ ver →</span></>:<span style={{ fontSize:11, color:muscle==="Panturrilha"?C.red:C.muted }}>{muscle==="Panturrilha"?"⚠️ Não treinou":"Pendente"}</span>}
                    </div>
                  </div>
                  <PBar pct={trained?100:0} color={muscle==="Panturrilha"&&!trained?C.red:C.accent} />
                  {treino&&<div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>{treino.exercises.filter(e=>e.muscle===muscle).slice(0,3).map(e => <span key={e.name} style={{ fontSize:10, color:C.muted }}>{e.name} <strong style={{ color:C.accent }}>{e.kg>0?`${e.kg}kg`:"—"}</strong></span>)}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={s.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={s.h3}>Evolução de Carga por Exercício</h3>
          <Badge text="Últimas 7 semanas" color={C.muted} />
        </div>
        <div className="rg2" style={{display:"grid",gap:16}}>
          {[
            { name:"Rosca Direta (Haltere)",data:evolucaoRosca,color:C.blue,aparelho:"Halteres (par)",ult:"14kg",delta:"+2kg" },
            { name:"Supino Reto (Barra)",data:evolucaoSupino,color:C.accent,aparelho:"Banco de Supino c/ Barra",ult:"80kg",delta:"+5kg" },
          ].map(ex => (
            <div key={ex.name} style={{ ...s.card, padding:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <div><div style={{ fontWeight:700, fontSize:13 }}>{ex.name}</div><div style={{ fontSize:11, color:C.muted }}>📍 {ex.aparelho}</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:18, fontWeight:800, color:ex.color }}>{ex.ult}</div><div style={{ fontSize:11, color:C.accent }}>{ex.delta}</div></div>
              </div>
              <LineChart data={ex.data} color={ex.color} height={60} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>{ex.data.map(d => <div key={d.week} style={{ fontSize:9, color:C.muted }}>{d.week}</div>)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TreinoAtivo = ({ treino, academia, onBack }) => {
  const [activeEx, setActiveEx] = useState(null);
  const [done, setDone] = useState({});
  const [showQR, setShowQR] = useState(null);
  const completedCount = Object.keys(done).length;
  const equipAcademia = academia ? academia.equipamentos[0] : EQUIPAMENTOS_GENERICOS[0];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {showQR && <QREquipModal equip={showQR} onClose={()=>setShowQR(null)} onScanSuccess={()=>setShowQR(null)} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>← Voltar</button>
          <h1 style={s.h1}>{treino.nome}</h1>
          <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>{treino.badges&&treino.badges.map((b,i)=><Badge key={i} text={b.text} color={b.color}/>)}</div>
        </div>
        <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
          {academia?<Badge text={`📍 ${academia.name}`} color={C.blue}/>:<Badge text="🏠 Treino Livre" color={C.muted}/>}
          <button onClick={()=>setShowQR(equipAcademia)} style={{ ...btn(C.teal,true), fontSize:11, padding:"4px 10px" }}>📷 Escanear QR</button>
          <div style={{ fontSize:28, fontWeight:800, color:C.accent }}>{completedCount}/{treino.exercises.length}</div>
        </div>
      </div>
      <PBar pct={(completedCount/treino.exercises.length)*100} />
      <div style={{ padding:10, background:`${C.purple}10`, border:`1px solid ${C.purple}30`, borderRadius:10, fontSize:12, color:C.purple }}>💡 <strong>Séries individuais:</strong> Configure kg e reps por série. Adicione quantas precisar com <strong>+ Série</strong>.</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {treino.exercises.map(ex => (
          <div key={ex.id} style={{ ...s.card, borderLeft:`4px solid ${done[ex.id]?C.accent:ex.warning?C.red:C.border}`, opacity:done[ex.id]?0.65:1 }}>
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>{ex.name}</span>
                  {ex.warning&&<Badge text="⚠️ Grupo recente" color={C.red}/>}
                  {done[ex.id]&&<Badge text={`✓ ${done[ex.id].series.length} séries`} color={C.accent}/>}
                </div>
                <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{ex.muscle} · {ex.sets}×{ex.reps} · descanso {ex.rest}s</div>
                {done[ex.id]&&<div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>{done[ex.id].series.map((sr,si)=><span key={si} style={tag(C.accent)}>{sr.kg}kg×{sr.reps}</span>)}</div>}
              </div>
              {!done[ex.id]&&<button onClick={() => setActiveEx(activeEx===ex.id?null:ex.id)} style={{ ...btn(C.blue,true), fontSize:12, padding:"6px 14px" }}>{activeEx===ex.id?"Fechar":"Executar"}</button>}
            </div>
            {activeEx===ex.id&&!done[ex.id]&&<ExercisePanel ex={ex} academia={academia} onDone={(result)=>{ setDone(d=>({...d,[ex.id]:result})); setActiveEx(null); }} />}
          </div>
        ))}
      </div>
      {completedCount===treino.exercises.length&&(
        <div style={{ ...s.card, background:`linear-gradient(145deg,#0D1F0A,#0A0A1E)`, border:`2px solid ${C.accent}50`, textAlign:"center", padding:32, position:"relative", overflow:"hidden" }}>
          {/* Confetti SVG */}
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {[
              [30,20,C.accent],[70,40,C.orange],[120,15,C.blue],[180,30,C.purple],[240,10,C.accent],
              [290,35,C.teal],[340,20,C.orange],[60,80,C.purple],[150,70,C.accent],[220,90,C.blue],
              [310,65,C.orange],[370,85,C.accent],[20,140,C.teal],[100,160,C.orange],[200,145,C.purple],
            ].map(([x,y,c],i)=>(
              <g key={i}>
                <rect x={x} y={y} width={8} height={8} rx={1} fill={c} opacity={0.7} transform={`rotate(${i*23} ${x+4} ${y+4})`}/>
                <circle cx={x+80} cy={y+120} r={4} fill={c} opacity={0.5}/>
              </g>
            ))}
          </svg>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:56, marginBottom:8 }}>🏆</div>
            <h2 style={{ ...s.h2, fontSize:24, color:C.accent, marginBottom:6 }}>Treino Concluído!</h2>
            <div style={{ fontSize:14, color:C.muted, marginBottom:24 }}>{treino.nome}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
              {[
                { icon:"💪", val:treino.exercises.length, label:"exercícios", color:C.accent },
                { icon:"📦", val:`${(treino.exercises.reduce((a,e)=>a+e.kg*e.sets*e.reps,0)/1000).toFixed(1)}t`, label:"volume", color:C.blue },
                { icon:"⚡", val:"+120 XP", label:"ganhos", color:C.purple },
              ].map((st,i)=>(
                <div key={i} style={{ padding:14, background:"rgba(255,255,255,0.05)", borderRadius:12, border:`1px solid rgba(255,255,255,0.08)` }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{st.icon}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:st.color }}>{st.val}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{st.label}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:12, background:`${C.orange}15`, border:`1px solid ${C.orange}30`, borderRadius:10, marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>🔥</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontWeight:700, color:C.orange, fontSize:13 }}>Sequência mantida!</div>
                <div style={{ fontSize:12, color:C.muted }}>13 dias seguidos. Continue amanhã para chegar a 14!</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...btn(C.muted,true), flex:1, fontSize:13 }} onClick={onBack}>← Voltar</button>
              <button style={{ ...btn(C.accent), flex:2, fontSize:13 }} onClick={async () => {
                if (gd().saveSession) {
                  const musculos = [...new Set(treino.exercises.map(e => e.muscle))];
                  await gd().saveSession({
                    titulo: treino.nome,
                    musculos,
                    duracao_min: 60,
                    metodologia: "normal",
                    foco: "hipertrofia",
                    academia_id: academia?.id || null,
                    exercises: treino.exercises.map(ex => ({
                      ...ex,
                      done: done[ex.id]?.series || [],
                    })),
                  });
                }
                onBack();
              }}>💾 Salvar treino</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultadoIA = ({ treinoIA, metodologia, onIniciar, onVoltar }) => {
  const [exercises, setExercises] = useState(treinoIA.exercises.map((e,i) => ({ ...e, _uid:i })));
  const [trocando, setTrocando] = useState(null);
  const [editando, setEditando] = useState(null);
  const updateEx = (idx,field,val) => setExercises(prev => prev.map((e,i) => i===idx?{...e,[field]:val}:e));
  const trocarEx = (idx,novo) => { setExercises(prev => prev.map((e,i) => i===idx?{...novo,id:e.id,_uid:e._uid,muscle:e.muscle}:e)); setTrocando(null); };
  const adicionarEx = (novo) => { setExercises(prev => [...prev,{...novo,_uid:Date.now()}]); setTrocando(null); };
  const removerEx = (idx) => setExercises(prev => prev.filter((_,i) => i!==idx));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {trocando!==null&&<TrocaExercicioModal exercicio={trocando>=0?exercises[trocando]:{name:"—",muscle:"Ombros"}} modoSoAdicionar={trocando<0} onTrocar={novo=>trocarEx(trocando,novo)} onAdicionar={novo=>adicionarEx(novo)} onClose={() => setTrocando(null)} />}
      <button onClick={onVoltar} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"inherit", textAlign:"left" }}>← Voltar aos filtros</button>
      <div style={{ ...s.card, borderLeft:`4px solid ${C.accent}` }}>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:14 }}>
          <div><div style={{ ...s.lbl, marginBottom:4 }}>⚡ Sugestão GymAI</div><h2 style={s.h2}>{treinoIA.nome}</h2></div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{treinoIA.badges.map((b,i)=><Badge key={i} text={b.text} color={b.color}/>)}</div>
        </div>
        <div style={{ padding:10, background:`${C.blue}10`, border:`1px solid ${C.blue}25`, borderRadius:8, marginBottom:14, fontSize:12, color:C.blue }}>✏️ Clique <strong>Editar</strong> para ajustar séries/reps/kg · <strong>Trocar</strong> para substituir</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {exercises.map((exr,i) => {
            const hist = HISTORICO_EXERCICIOS[exr.name];
            const ultima = hist&&hist[0];
            const isEdit = editando===i;
            return (
              <div key={exr._uid} style={{ padding:14, background:C.surface, borderRadius:10, border:`1px solid ${isEdit?C.accent+"50":C.border}` }}>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{exr.name}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{exr.muscle} · descanso: {exr.rest}s</div>
                    {ultima&&!isEdit&&<div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Último: {ultima.kg}kg → <span style={{ color:C.accent, fontWeight:700 }}>Sugerido: {exr.kg}kg</span></div>}
                  </div>
                  <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
                    {!isEdit&&<div style={{ textAlign:"right", marginRight:4 }}><div style={{ fontSize:16, fontWeight:800, color:C.accent }}>{exr.kg>0?`${exr.kg}kg`:"—"}</div><div style={{ fontSize:11, color:C.muted }}>{exr.sets}×{exr.reps}</div></div>}
                    <button onClick={() => setEditando(isEdit?null:i)} style={{ ...btn(isEdit?C.accent:C.blue,true), fontSize:11, padding:"4px 9px" }}>{isEdit?"✓ Ok":"✏️ Editar"}</button>
                    <button onClick={() => setTrocando(i)} style={{ ...btn(C.purple,true), fontSize:11, padding:"4px 9px" }}>🔄 Trocar</button>
                    <button onClick={() => removerEx(i)} style={{ ...btn(C.red,true), fontSize:11, padding:"4px 8px" }}>✕</button>
                  </div>
                </div>
                {isEdit&&(
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[{label:"Séries",field:"sets",type:"number"},{label:"Reps",field:"reps",type:"text"},{label:"Kg",field:"kg",type:"number"},{label:"Descanso (s)",field:"rest",type:"number"}].map(({label,field,type}) => (
                      <div key={field}>
                        <div style={{ ...s.lbl, marginBottom:4 }}>{label}</div>
                        <input type={type} value={exr[field]} onChange={e => updateEx(i,field,type==="number"?+e.target.value:e.target.value)} style={{ width:"100%", background:C.card, border:`1px solid ${C.accent}40`, borderRadius:6, padding:"7px 8px", color:C.accent, fontWeight:700, fontSize:13, fontFamily:"inherit", textAlign:"center", boxSizing:"border-box" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={() => setTrocando(-1)} style={{ ...btn(C.purple,true), width:"100%", marginTop:12, borderRadius:8 }}>➕ Adicionar exercício ao treino</button>
        <div style={{ marginTop:16, display:"flex", gap:10 }}>
          <button onClick={() => onIniciar({...treinoIA,exercises})} style={{ ...btn(C.accent), flex:1, borderRadius:10, padding:13, fontSize:14 }}>🏋️ Iniciar treino ({exercises.length} exercícios)</button>
          <button onClick={onVoltar} style={{ ...btn(C.muted,true), padding:"13px 18px", borderRadius:10 }}>Refazer filtros</button>
        </div>
      </div>
    </div>
  );
};

const AlunoTreino = ({ setScreen }) => {
  const [fase, setFase] = useState("filtros");
  const [academia, setAcademia] = useState(null);
  const [showAcademia, setShowAcademia] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [time, setTime] = useState(60);
  const [tipoTreino, setTipoTreino] = useState("forca");
  const [metodologia, setMetodologia] = useState("normal");
  const [foco, setFoco] = useState("hipertrofia");
  const [equipPrefs, setEquipPrefs] = useState([]);
  const [riskAccepted, setRiskAccepted] = useState(false);
  const toggleMuscle = id => setSelectedMuscles(p => p.includes(id)?p.filter(m=>m!==id):[...p,id]);
  const conflicted = selectedMuscles.some(m => recentlyTrained.includes(m));
  const tiposTreino = [{id:"forca",label:"💪 Força",desc:"Cargas altas, baixas reps"},{id:"resistencia",label:"🏃 Resistência",desc:"Cargas médias, altas reps"},{id:"hipertrofia",label:"📈 Hipertrofia",desc:"Foco em volume muscular"},{id:"funcional",label:"⚡ Funcional",desc:"Movimentos compostos"}];
  const metodologias = [{id:"normal",label:"Normal"},{id:"biset",label:"Bi-Set"},{id:"triset",label:"Tri-Set"},{id:"dropset",label:"Drop-Set"},{id:"piramide",label:"Pirâmide"},{id:"supersets",label:"Super-Sets"},{id:"pausas",label:"Rest-Pause"},{id:"circuito",label:"Circuito"}];
  const focos = [{id:"hipertrofia",label:"Hipertrofia"},{id:"definicao",label:"Definição"},{id:"forca_max",label:"Força Máxima"},{id:"resistencia_musc",label:"Resist. Muscular"},{id:"reabilitacao",label:"Reabilitação"},{id:"emagrecimento",label:"Emagrecimento"}];
  const equipOptions = [{id:"livre",label:"Peso Livre"},{id:"maquina",label:"Máquinas"},{id:"cabo",label:"Cabos/Polias"},{id:"corporal",label:"Peso Corporal"},{id:"elastico",label:"Elásticos"}];
  const treinoIA = {
    nome:"Treino IA — Ombros & Abdômen",
    badges:[{text:`${time}min`,color:C.blue},{text:tiposTreino.find(t=>t.id===tipoTreino)?.label,color:C.accent},{text:metodologias.find(m=>m.id===metodologia)?.label,color:C.purple},{text:focos.find(f=>f.id===foco)?.label,color:C.teal}],
    exercises:[
      {id:1,name:"Desenvolvimento c/ Halteres",muscle:"Ombros",sets:metodologia==="biset"?3:4,reps:tipoTreino==="forca"?"6-8":"10-12",kg:21,rest:60,aparelhoId:"haltere_fitzone"},
      {id:2,name:"Elevação Lateral",muscle:"Ombros",sets:3,reps:"12-15",kg:10,rest:45,aparelhoId:"haltere_fitzone"},
      {id:3,name:"Arnold Press",muscle:"Ombros",sets:3,reps:tipoTreino==="forca"?"8":"10",kg:17,rest:60,aparelhoId:"haltere_fitzone"},
      {id:4,name:"Prancha",muscle:"Abdômen",sets:3,reps:"60",kg:0,rest:30,aparelhoId:"peso_corp"},
      {id:5,name:"Crunch no Cabo",muscle:"Abdômen",sets:4,reps:"15",kg:25,rest:45,aparelhoId:"polia_alta"},
    ],
  };
  const TREINOS_BIBLIOTECA = [
    { id:"plat_1",fonte:"plataforma",nome:"Ombros Completo — GymAI Library",descricao:"Treino clássico de ombros com ênfase em desenvolvimento.",tags:["Ombros","Hipertrofia","Intermediário"],durMin:55,exerciciosCount:5,metodologia:"Normal",badges:[{text:"55min",color:C.blue},{text:"Plataforma",color:C.teal},{text:"Hipertrofia",color:C.accent}],
      exercises:[{id:1,name:"Desenvolvimento c/ Halteres",muscle:"Ombros",sets:4,reps:"10-12",kg:20,rest:60,aparelhoId:"haltere_fitzone"},{id:2,name:"Elevação Lateral",muscle:"Ombros",sets:3,reps:"15",kg:10,rest:45,aparelhoId:"haltere_fitzone"},{id:3,name:"Elevação Frontal",muscle:"Ombros",sets:3,reps:"12",kg:8,rest:45,aparelhoId:"haltere_fitzone"},{id:4,name:"Encolhimento",muscle:"Ombros",sets:3,reps:"12",kg:24,rest:45,aparelhoId:"haltere_fitzone"},{id:5,name:"Crucifixo Inverso",muscle:"Ombros",sets:3,reps:"12",kg:8,rest:45,aparelhoId:"haltere_fitzone"}]},
    { id:"personal_1",fonte:"personal",nomePersonal:"Dr. Paulo Ferreira",nome:"Treino D — Ombros & Abdômen (Dr. Paulo)",descricao:"Treino prescrito. Foco em sobrecarga progressiva.",tags:["Ombros","Abdômen","Personalizado"],durMin:60,exerciciosCount:6,metodologia:"Normal",badges:[{text:"60min",color:C.blue},{text:"Dr. Paulo",color:C.purple},{text:"Personalizado",color:C.accent}],
      exercises:[{id:1,name:"Desenvolvimento",muscle:"Ombros",sets:4,reps:10,kg:20,rest:60,aparelhoId:"haltere_fitzone"},{id:2,name:"Elevação Lateral",muscle:"Ombros",sets:3,reps:12,kg:10,rest:45,aparelhoId:"haltere_fitzone"},{id:3,name:"Arnold Press",muscle:"Ombros",sets:3,reps:10,kg:16,rest:60,aparelhoId:"haltere_fitzone"},{id:4,name:"Prancha",muscle:"Abdômen",sets:3,reps:"60",kg:0,rest:30,aparelhoId:"peso_corp"},{id:5,name:"Crunch no Cabo",muscle:"Abdômen",sets:4,reps:15,kg:25,rest:45,aparelhoId:"polia_alta"},{id:6,name:"Rosca Direta",muscle:"Bíceps",sets:3,reps:10,kg:18,rest:60,warning:true,aparelhoId:"haltere_fitzone"}]},
  ];
  if (showAcademia) return <AcademiaModal onSelect={a=>{setAcademia(a);setShowAcademia(false);}} onClose={() => setShowAcademia(false)} />;
  if (fase==="executando"&&treinoSelecionado) return <TreinoAtivo treino={treinoSelecionado} academia={academia} onBack={() => {setFase("filtros");setTreinoSelecionado(null);}} />;
  if (fase==="resultado_ia") return <ResultadoIA treinoIA={treinoIA} metodologia={metodologia} onIniciar={t=>{setTreinoSelecionado(t);setShowAcademia(true);setTimeout(()=>setFase("executando"),0);}} onVoltar={() => setFase("filtros")} />;
  if (fase==="resultado_busca") {
    const pessoal = TREINOS_BIBLIOTECA.filter(t=>t.fonte==="personal");
    const plataforma = TREINOS_BIBLIOTECA.filter(t=>t.fonte==="plataforma");
    const CardTreino = ({ t }) => (
      <div style={{ ...s.card, padding:16 }}>
        <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>{t.badges.map((b,i)=><Badge key={i} text={b.text} color={b.color}/>)}</div>
        <div style={{ fontWeight:700, fontSize:14 }}>{t.nome}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{t.descricao}</div>
        <div style={{ display:"flex", gap:6, marginTop:10 }}>
          <div style={{ flex:1,textAlign:"center",padding:8,background:C.surface,borderRadius:8 }}><div style={{ fontSize:16,fontWeight:800,color:C.blue }}>{t.durMin}min</div><div style={{ fontSize:10,color:C.muted }}>duração</div></div>
          <div style={{ flex:1,textAlign:"center",padding:8,background:C.surface,borderRadius:8 }}><div style={{ fontSize:16,fontWeight:800,color:C.accent }}>{t.exerciciosCount}</div><div style={{ fontSize:10,color:C.muted }}>exercícios</div></div>
          <div style={{ flex:1,textAlign:"center",padding:8,background:C.surface,borderRadius:8 }}><div style={{ fontSize:12,fontWeight:700,color:C.purple }}>{t.metodologia}</div><div style={{ fontSize:10,color:C.muted }}>método</div></div>
        </div>
        <button onClick={() => {setTreinoSelecionado(t);setShowAcademia(true);setTimeout(()=>setFase("executando"),0);}} style={{ ...btn(C.accent), width:"100%", marginTop:12, borderRadius:8 }}>Iniciar este treino →</button>
      </div>
    );
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <button onClick={() => setFase("filtros")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"inherit", textAlign:"left" }}>← Voltar aos filtros</button>
        <h1 style={s.h1}>Treinos Encontrados</h1>
        {pessoal.length>0&&(
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}><div style={s.lbl}>Do seu Personal — Dr. Paulo Ferreira</div><div style={{ flex:1,height:1,background:C.border }}/><Badge text={`${pessoal.length} treinos`} color={C.purple}/></div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>{pessoal.map(t=><CardTreino key={t.id} t={t}/>)}</div>
          </div>
        )}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}><div style={s.lbl}>Biblioteca GymAI</div><div style={{ flex:1,height:1,background:C.border }}/><Badge text={`${plataforma.length} treinos`} color={C.teal}/></div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>{plataforma.map(t=><CardTreino key={t.id} t={t}/>)}</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div><h1 style={s.h1}>Fazer Treino</h1><div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Configure os filtros e escolha como montar o treino</div></div>
        <button onClick={() => setShowAcademia(true)} style={{ ...btn(academia?C.blue:C.muted,true), fontSize:12 }}>{academia?`📍 ${academia.name}`:"📍 Selecionar academia"}</button>
      </div>
      <div style={s.card}>
        <h3 style={{ ...s.h3, marginBottom:12 }}>Grupos Musculares</h3>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          {muscleGroups.map(m => {
            const trained = recentlyTrained.includes(m.id);
            const sel = selectedMuscles.includes(m.id);
            return <button key={m.id} onClick={() => toggleMuscle(m.id)} style={{ padding:"8px 16px", borderRadius:20, border:`1px solid`, borderColor:sel?(trained?C.red:C.accent):C.border, background:sel?(trained?`${C.red}18`:`${C.accent}18`):"transparent", color:sel?(trained?C.red:C.accent):C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:13 }}>{m.icon} {m.name} {trained&&<span style={{ fontSize:9 }}>●rec</span>}</button>;
          })}
        </div>
        {conflicted&&!riskAccepted&&(
          <div style={{ padding:12, background:`${C.red}12`, border:`1px solid ${C.red}30`, borderRadius:8 }}>
            <div style={{ fontSize:13, color:C.red, fontWeight:600 }}>⚠️ Grupos treinados recentemente selecionados!</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Recomendamos aguardar 48h para recuperação.</div>
            <button onClick={() => setRiskAccepted(true)} style={{ ...btn(C.red,true), fontSize:11, padding:"4px 12px", marginTop:8 }}>Entendi o risco, continuar</button>
          </div>
        )}
      </div>
      <div className="rg2" style={{display:"grid",gap:16}}>
        <div style={s.card}>
          <h3 style={{ ...s.h3, marginBottom:12 }}>Tipo de Treino</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {tiposTreino.map(t => <button key={t.id} onClick={() => setTipoTreino(t.id)} style={{ padding:"10px 12px", borderRadius:10, border:`1px solid ${tipoTreino===t.id?C.accent:C.border}`, background:tipoTreino===t.id?`${C.accent}15`:"transparent", color:tipoTreino===t.id?C.accent:C.muted, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}><div style={{ fontWeight:700, fontSize:13 }}>{t.label}</div><div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{t.desc}</div></button>)}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={s.card}>
            <h3 style={{ ...s.h3, marginBottom:10 }}>Metodologia</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{metodologias.map(m => <button key={m.id} onClick={() => setMetodologia(m.id)} style={{ padding:"5px 12px", borderRadius:16, border:`1px solid ${metodologia===m.id?C.purple:C.border}`, background:metodologia===m.id?`${C.purple}18`:"transparent", color:metodologia===m.id?C.purple:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12 }}>{m.label}</button>)}</div>
          </div>
          <div style={s.card}>
            <h3 style={{ ...s.h3, marginBottom:10 }}>Objetivo / Foco</h3>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{focos.map(f => <button key={f.id} onClick={() => setFoco(f.id)} style={{ padding:"5px 12px", borderRadius:16, border:`1px solid ${foco===f.id?C.teal:C.border}`, background:foco===f.id?`${C.teal}18`:"transparent", color:foco===f.id?C.teal:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12 }}>{f.label}</button>)}</div>
          </div>
        </div>
      </div>
      <div className="rg2" style={{display:"grid",gap:16}}>
        <div style={s.card}>
          <h3 style={{ ...s.h3, marginBottom:10 }}>Tempo disponível</h3>
          <div style={{ display:"flex", gap:8 }}>{[30,45,60,90].map(t => <button key={t} onClick={() => setTime(t)} style={{ flex:1, padding:"10px 0", borderRadius:8, border:`1px solid ${time===t?C.accent:C.border}`, background:time===t?`${C.accent}18`:"transparent", color:time===t?C.accent:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:13 }}>{t}min</button>)}</div>
        </div>
        <div style={s.card}>
          <h3 style={{ ...s.h3, marginBottom:10 }}>Equipamentos preferidos</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{equipOptions.map(eq => <button key={eq.id} onClick={() => setEquipPrefs(p => p.includes(eq.id)?p.filter(e=>e!==eq.id):[...p,eq.id])} style={{ padding:"5px 12px", borderRadius:16, border:`1px solid ${equipPrefs.includes(eq.id)?C.orange:C.border}`, background:equipPrefs.includes(eq.id)?`${C.orange}18`:"transparent", color:equipPrefs.includes(eq.id)?C.orange:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12 }}>{eq.label}</button>)}</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
        <button onClick={() => setFase("resultado_ia")} style={{ background:C.accent, color:"#000", border:"none", borderRadius:14, padding:"20px 16px", cursor:"pointer", fontFamily:"inherit", textAlign:"left", position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:26, marginBottom:8 }}>⚡</div>
          <div style={{ fontSize:16, fontWeight:800 }}>Gerar com IA</div>
          <div style={{ fontSize:12, opacity:0.7, marginTop:4 }}>GymAI monta um treino com kg sugerido pelo histórico</div>
        </button>
        <button onClick={() => setFase("resultado_busca")} style={{ background:C.surface, color:C.text, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 16px", cursor:"pointer", fontFamily:"inherit", textAlign:"left", position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:26, marginBottom:8 }}>🔍</div>
          <div style={{ fontSize:16, fontWeight:800 }}>Buscar Treinos</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Treinos prontos da plataforma ou do seu personal</div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}><span style={{ ...tag(C.purple), fontSize:10 }}>Personal</span><span style={{ ...tag(C.teal), fontSize:10 }}>Plataforma</span></div>
        </button>
      </div>
    </div>
  );
};

const AlunoHistorico = () => {
  const historicoReal = gd().historicoExercicios || HISTORICO_EXERCICIOS;
  const sessoesReais  = gd().sessions || [];
  const totalReal     = gd().totalTreinos ?? 87;
  const streakMaxReal = gd().streak ?? 21;
  const exKeys        = Object.keys(historicoReal).length > 0 ? Object.keys(historicoReal) : Object.keys(HISTORICO_EXERCICIOS);
  const [exSelecionado, setExSelecionado] = useState(exKeys[0] || "Rosca Direta");
  const hist = historicoReal[exSelecionado] || HISTORICO_EXERCICIOS[exSelecionado] || [];
  const chartData = [...hist].reverse().map((h,i) => ({ week:`S${i+1}`, kg:h.kg }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <h1 style={s.h1}>Histórico & Evolução</h1>
      <div className="rg4" style={{display:"grid",gap:16}}>
        <StatCard label="Total de treinos" value={totalReal} sub="no GymAI" color={C.accent} icon="🏋️" />
        <StatCard label="Exercícios rastreados" value={exKeys.length} sub="com evolução" color={C.blue} icon="📊" />
        <StatCard label="Maior sequência" value={`${streakMaxReal} dias`} sub="🔥 sequência atual" color={C.orange} icon="🔥" />
        <StatCard label="Exercícios mapeados" value={exKeys.length} sub="com histórico" color={C.purple} icon="📊" />
      </div>
      <div style={s.card}>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:16 }}>
          <h3 style={s.h3}>Evolução de Carga</h3>
          <select value={exSelecionado} onChange={e => setExSelecionado(e.target.value)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontFamily:"inherit", fontSize:13 }}>
            {exKeys.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        {chartData.length>1&&<LineChart data={chartData} color={C.accent} height={100} />}
        <div className="rg2" style={{display:"grid",gap:16,marginTop:16}}>
          {hist.map((h,i) => (
            <div key={i} style={{ ...s.card, padding:12, borderLeft:`3px solid ${i===0?C.accent:C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div><div style={{ fontWeight:i===0?700:400, fontSize:13 }}>{h.data}{i===0&&" · Recente"}</div><div style={{ fontSize:12, color:C.muted }}>🏋️ {h.aparelho}</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:20, fontWeight:800, color:i===0?C.accent:C.text }}>{h.kg}kg</div><div style={{ fontSize:12, color:C.muted }}>{h.series}×{h.reps}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ ...s.h3, marginBottom:16 }}>Sessões Recentes</h3>
        {TREINOS_SEMANA.filter(t=>t.done).map((t,i) => (
          <div key={i} style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
              <div>
                <div style={{ fontWeight:700 }}>{t.day} {t.date} — {t.muscles.join(" & ")}</div>
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>{t.exercises.map(ex => <span key={ex.name} style={{ fontSize:12, color:C.muted }}>{ex.name} <strong style={{ color:ex.kg>0?C.accent:C.muted }}>{ex.kg>0?`${ex.kg}kg`:"—"}</strong> ·</span>)}</div>
              </div>
              <div style={{ textAlign:"right", fontSize:13, color:C.muted }}>{t.exercises.length} ex{t.durMin>0&&<div style={{ color:C.blue, fontWeight:600 }}>{t.durMin}min</div>}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ALUNOS_TODOS = [
  { name:"Lucas Mendes",   last:"Há 1 dia",  pct:80, status:"ok",     plano:"Hipertrofia",  treinos:4, risco:false },
  { name:"Ana Souza",      last:"Há 2 dias", pct:90, status:"ok",     plano:"Definição",    treinos:5, risco:false },
  { name:"Carlos Lima",    last:"Há 6 dias", pct:20, status:"alert",  plano:"Força",        treinos:2, risco:true  },
  { name:"Juliana Rocha",  last:"Há 7 dias", pct:0,  status:"danger", plano:"Reabilitação", treinos:0, risco:true  },
  { name:"Rafael Costa",   last:"Há 3 dias", pct:60, status:"ok",     plano:"Hipertrofia",  treinos:3, risco:false },
  { name:"Fernanda Lima",  last:"Há 1 dia",  pct:95, status:"ok",     plano:"Condicionamento",treinos:5,risco:false },
  { name:"Bruno Alves",    last:"Há 4 dias", pct:40, status:"alert",  plano:"Força",        treinos:2, risco:true  },
  { name:"Patricia Nunes", last:"Há 2 dias", pct:75, status:"ok",     plano:"Emagrecimento",treinos:4, risco:false },
  { name:"Diego Martins",  last:"Há 1 dia",  pct:85, status:"ok",     plano:"Hipertrofia",  treinos:5, risco:false },
  { name:"Camila Torres",  last:"Há 5 dias", pct:15, status:"danger", plano:"Manutenção",   treinos:1, risco:true  },
  { name:"Henrique Borges",last:"Há 2 dias", pct:70, status:"ok",     plano:"Força",        treinos:4, risco:false },
  { name:"Isabela Matos",  last:"Há 3 dias", pct:55, status:"ok",     plano:"Definição",    treinos:3, risco:false },
];

const TREINOS_PERSONAL = [
  { nome:"Treino A — Peito & Tríceps", aluno:"Lucas Mendes", criado:"10/05", exercicios:5, ativo:true,  novoMes:false },
  { nome:"Treino B — Costas & Bíceps", aluno:"Lucas Mendes", criado:"10/05", exercicios:4, ativo:true,  novoMes:false },
  { nome:"Treino C — Pernas",          aluno:"Ana Souza",    criado:"12/05", exercicios:5, ativo:true,  novoMes:false },
  { nome:"Treino D — Ombros",          aluno:"Rafael Costa", criado:"14/05", exercicios:6, ativo:true,  novoMes:false },
  { nome:"Treino Funcional Full",      aluno:"Fernanda Lima",criado:"20/05", exercicios:7, ativo:true,  novoMes:true  },
  { nome:"Treino Reabilitação",        aluno:"Juliana Rocha",criado:"22/05", exercicios:4, ativo:false, novoMes:true  },
  { nome:"Treino Força Base",          aluno:"Diego Martins",criado:"25/05", exercicios:5, ativo:true,  novoMes:true  },
  { nome:"Treino HIIT Cardio",         aluno:"Patricia Nunes",criado:"27/05",exercicios:6, ativo:true,  novoMes:true  },
];

// ─── GAMIFICATION DATA ───────────────────────────────────────────────────────
const XP_LEVELS = [
  { nivel:"Iniciante",  xpMin:0,    xpMax:500,  cor:C.muted,   icon:"🌱" },
  { nivel:"Dedicado",   xpMin:500,  xpMax:1500, cor:C.blue,    icon:"⚡" },
  { nivel:"Avançado",   xpMin:1500, xpMax:3000, cor:C.purple,  icon:"🔥" },
  { nivel:"Elite",      xpMin:3000, xpMax:6000, cor:C.orange,  icon:"💎" },
  { nivel:"Lendário",   xpMin:6000, xpMax:9999, cor:C.accent,  icon:"👑" },
];

const CONQUISTAS_CATALOGO = [
  { id:"primeiro_treino",  icon:"🏋️", titulo:"Primeira Rep",        desc:"Completou o primeiro treino",            xp:50,  desbloqueado:true  },
  { id:"trintaDias",       icon:"🔥", titulo:"30 dias em chamas",    desc:"30 dias seguidos de treino",             xp:500, desbloqueado:false },
  { id:"primeiro_pr",      icon:"🏆", titulo:"PR Detonado",          desc:"Bateu um recorde pessoal",               xp:100, desbloqueado:true  },
  { id:"supino100",        icon:"💪", titulo:"Clube dos 100kg",       desc:"100kg no supino reto",                   xp:300, desbloqueado:false },
  { id:"tresAcademias",    icon:"🏢", titulo:"Nômade do Ferro",       desc:"Treinou em 3 academias diferentes",      xp:150, desbloqueado:false },
  { id:"semanaCompleta",   icon:"⭐", titulo:"Semana Perfeita",       desc:"Completou todas as metas da semana",     xp:200, desbloqueado:true  },
  { id:"cincoDias",        icon:"📅", titulo:"5 dias seguidos",       desc:"Sequência de 5 treinos",                 xp:100, desbloqueado:true  },
  { id:"volumeTotal",      icon:"📊", titulo:"Tonelada",              desc:"10.000kg de volume acumulado",           xp:400, desbloqueado:false },
  { id:"madrugador",       icon:"🌅", titulo:"Madrugador",            desc:"Treinou antes das 7h",                   xp:75,  desbloqueado:false },
  { id:"consistente3meses",icon:"🗓️", titulo:"3 Meses Forte",         desc:"Ativo por 3 meses consecutivos",        xp:600, desbloqueado:false },
];

const MISSOES_SEMANA = [
  { id:"m1", titulo:"Complete 3 treinos",     meta:3,  atual:2, xp:150, badge:"⭐", concluida:false },
  { id:"m2", titulo:"Treine pernas 1x",       meta:1,  atual:1, xp:80,  badge:"🦵", concluida:true  },
  { id:"m3", titulo:"Volume > 5.000kg",       meta:5000,atual:4200,xp:120,badge:"📊",concluida:false},
  { id:"m4", titulo:"Bata 1 PR essa semana",  meta:1,  atual:0, xp:200, badge:"🏆", concluida:false },
];

const PLANOS_PERSONAL = [
  { id:"starter", nome:"Starter",    alunos:10,  preco:0,   cor:C.muted,   desc:"Ideal para começar",          features:["Até 10 alunos","Dashboard básico","Cadastro de treinos"] },
  { id:"pro",     nome:"Pro",        alunos:30,  preco:49,  cor:C.blue,    desc:"Para personais em crescimento",features:["Até 30 alunos","Relatórios mensais","Badges personalizados","Copiloto IA"] },
  { id:"elite",   nome:"Elite",      alunos:999, preco:99,  cor:C.accent,  desc:"Sem limites",                 features:["Alunos ilimitados","Pacotes vendáveis","Link de convite","Suporte prioritário","Analytics avançado"] },
];

const BADGES_PERSONAL = [
  { id:"b1", nome:"Guerreiro da Semana", icon:"⚔️", desc:"Complete todas as missões da semana", cor:C.orange, alunos:["Lucas Mendes","Ana Souza","Rafael Costa"] },
  { id:"b2", nome:"PR Destroyer",        icon:"💥", desc:"Bata um PR essa semana",              cor:C.red,    alunos:["Lucas Mendes","Diego Martins"] },
  { id:"b3", nome:"Consistência Total",  icon:"🎯", desc:"Treine 4x ou mais essa semana",       cor:C.purple, alunos:["Ana Souza","Fernanda Lima","Patricia Nunes"] },
  { id:"b4", nome:"Monstro do Volume",   icon:"📊", desc:"Volume > 8.000kg em uma sessão",      cor:C.accent, alunos:[] },
];

// XP e nível — dados reais do Supabase via window.gymData, fallback para mock
const ALUNO_XP = gd().xp ?? 1820;
const ALUNO_NIVEL = gd().nivelGamificacao || XP_LEVELS.find(l => ALUNO_XP >= l.xpMin && ALUNO_XP < l.xpMax) || XP_LEVELS[0];

// ─────────────────────────────────────────────────────────────────────────────
const PersonalStatsModal = ({ tipo, onClose }) => {
  const ativos = ALUNOS_TODOS.filter(a => a.status !== "danger");
  const emRisco = ALUNOS_TODOS.filter(a => a.risco);
  const treinosAtivos = TREINOS_PERSONAL.filter(t => t.ativo);
  const treinosNovos = TREINOS_PERSONAL.filter(t => t.novoMes);

  const titles = {
    alunos_ativos:   { title:"Alunos Ativos", color:C.purple, icon:"👥" },
    alunos_total:    { title:"Total de Alunos", color:C.blue, icon:"🎓" },
    alunos_risco:    { title:"Alunos em Risco", color:C.red, icon:"⚠️" },
    treinos_ativos:  { title:"Treinos Ativos", color:C.accent, icon:"📋" },
    treinos_total:   { title:"Total de Treinos", color:C.blue, icon:"🏋️" },
    treinos_novos:   { title:"Treinos Novos — Maio", color:C.teal, icon:"✨" },
  };
  const cfg = titles[tipo] || titles.alunos_ativos;

  const renderList = () => {
    if (tipo === "alunos_ativos") return ativos;
    if (tipo === "alunos_total")  return ALUNOS_TODOS;
    if (tipo === "alunos_risco")  return emRisco;
    return null;
  };
  const renderTreinos = () => {
    if (tipo === "treinos_ativos") return treinosAtivos;
    if (tipo === "treinos_total")  return TREINOS_PERSONAL;
    if (tipo === "treinos_novos")  return treinosNovos;
    return null;
  };

  const alunoList = renderList();
  const treinoList = renderTreinos();

  return (
    <Modal onClose={onClose} title="">
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:48, height:48, borderRadius:12, background:`${cfg.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{cfg.icon}</div>
        <div>
          <div style={{ ...s.h2 }}>{cfg.title}</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
            {alunoList ? `${alunoList.length} aluno${alunoList.length!==1?"s":""}` : `${treinoList?.length || 0} treino${(treinoList?.length||0)!==1?"s":""}`}
          </div>
        </div>
      </div>
      {alunoList && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {alunoList.map((a,i) => {
            const sc = a.status==="danger"?C.red:a.status==="alert"?C.orange:C.accent;
            return (
              <div key={i} style={{ ...s.card, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:`${sc}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,border:`2px solid ${sc}40` }}>{a.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14 }}>{a.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{a.plano} · {a.last}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:sc }}>{a.pct}%</div>
                  <div style={{ fontSize:10, color:C.muted }}>adesão</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {treinoList && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {treinoList.map((t,i) => (
            <div key={i} style={{ ...s.card, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{t.nome}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>👤 {t.aluno} · {t.exercicios} ex · criado {t.criado}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                {t.ativo ? <Badge text="Ativo" color={C.accent} /> : <Badge text="Inativo" color={C.muted} />}
                {t.novoMes && <Badge text="Novo" color={C.teal} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

// ─── GAMIFICAÇÃO: XP BANNER ──────────────────────────────────────────────────
const XPBanner = ({ onClick }) => {
  const pct = Math.round(((ALUNO_XP - ALUNO_NIVEL.xpMin) / (ALUNO_NIVEL.xpMax - ALUNO_NIVEL.xpMin)) * 100);
  const proxLevel = XP_LEVELS[XP_LEVELS.indexOf(ALUNO_NIVEL) + 1];
  return (
    <div onClick={onClick} style={{ ...s.card, cursor:"pointer", borderColor:`${ALUNO_NIVEL.cor}40`, background:`${ALUNO_NIVEL.cor}08`, padding:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:28 }}>{ALUNO_NIVEL.icon}</div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:ALUNO_NIVEL.cor }}>{ALUNO_NIVEL.nivel}</div>
            <div style={{ fontSize:11, color:C.muted }}>{ALUNO_XP} XP acumulados</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          {proxLevel && <div style={{ fontSize:11, color:C.muted }}>Próximo: <span style={{ color:proxLevel.cor, fontWeight:700 }}>{proxLevel.nivel} {proxLevel.icon}</span></div>}
          <div style={{ fontSize:12, color:ALUNO_NIVEL.cor, fontWeight:700 }}>{proxLevel ? `Faltam ${proxLevel.xpMin - ALUNO_XP} XP` : "Nível máximo!"}</div>
        </div>
      </div>
      <PBar pct={pct} color={ALUNO_NIVEL.cor} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ fontSize:10, color:C.muted }}>{ALUNO_NIVEL.xpMin} XP</span>
        <span style={{ fontSize:10, color:ALUNO_NIVEL.cor, fontWeight:700 }}>{pct}%</span>
        <span style={{ fontSize:10, color:C.muted }}>{ALUNO_NIVEL.xpMax} XP</span>
      </div>
    </div>
  );
};

// ─── GAMIFICAÇÃO: TELA CONQUISTAS + MISSÕES ───────────────────────────────────
const GamificacaoScreen = () => {
  const [aba, setAba] = useState("missoes");
  const xpReal    = gd().xp ?? ALUNO_XP;
  const nivelReal = gd().nivelGamificacao || ALUNO_NIVEL;
  const conquistasIds = gd().conquistas || [];
  const missoesIds    = gd().missoes    || [];
  const xpPct = Math.round(((xpReal - nivelReal.xpMin) / (nivelReal.xpMax - nivelReal.xpMin)) * 100);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div><div style={s.lbl}>{gd().nome || "Lucas Mendes"}</div><h1 style={s.h1}>Conquistas & Missões</h1></div>

      {/* Level card */}
      <div style={{ ...s.card, background:`${ALUNO_NIVEL.cor}10`, borderColor:`${ALUNO_NIVEL.cor}40`, padding:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ fontSize:52 }}>{nivelReal.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:22, color:nivelReal.cor }}>{nivelReal.nivel}</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>{xpReal} XP · {xpPct}% para o próximo nível</div>
            <PBar pct={xpPct} color={nivelReal.cor} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {XP_LEVELS.map((l, i) => (
              <div key={l.nivel} style={{ display:"flex", alignItems:"center", gap:6, opacity: xpReal >= l.xpMin ? 1 : 0.35 }}>
                <span style={{ fontSize:14 }}>{l.icon}</span>
                <span style={{ fontSize:11, color: xpReal >= l.xpMin ? l.cor : C.muted, fontWeight: l.nivel === nivelReal.nivel ? 800 : 400 }}>{l.nivel}</span>
                {l.nivel === nivelReal.nivel && <Badge text="atual" color={l.cor} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, background:C.surface, padding:4, borderRadius:10 }}>
        {[{id:"missoes",label:"🎯 Missões da Semana"},{id:"conquistas",label:"🏆 Conquistas"},{id:"badges",label:"🎖️ Badges"}].map(t => (
          <button key={t.id} onClick={() => setAba(t.id)} style={{ flex:1, padding:"9px 6px", border:"none", background:aba===t.id?C.accent:"transparent", color:aba===t.id?"#000":C.muted, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit", borderRadius:7 }}>{t.label}</button>
        ))}
      </div>

      {aba === "missoes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:12, color:C.muted }}>Semana atual · Reinicia domingo à meia-noite</div>
          {MISSOES_SEMANA.map(m => {
            const concluida = missoesIds.includes(m.id) || m.concluida;
            const pct = concluida ? 100 : Math.min(100, Math.round((m.atual / m.meta) * 100));
            return (
              <div key={m.id} style={{ ...s.card, padding:16, borderLeft:`4px solid ${concluida ? C.accent : C.border}`, background: concluida ? `${C.accent}08` : C.card }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{m.badge}</span>
                      <span style={{ fontWeight:700, fontSize:14 }}>{m.titulo}</span>
                      {concluida && <Badge text="✓ Concluída" color={C.accent} />}
                    </div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>
                      {typeof m.meta === "number" && m.meta > 100
                        ? `${m.atual.toLocaleString()} / ${m.meta.toLocaleString()} kg`
                        : `${m.atual} / ${m.meta}`}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:16, fontWeight:800, color: concluida ? C.accent : C.muted }}>+{m.xp} XP</div>
                  </div>
                </div>
                <PBar pct={pct} color={concluida ? C.accent : C.blue} />
              </div>
            );
          })}
        </div>
      )}

      {aba === "conquistas" && (
        <div className="rg2" style={{display:"grid",gap:12}}>
          {CONQUISTAS_CATALOGO.map(c => {
            const desbloqueado = conquistasIds.includes(c.id) || c.desbloqueado;
            return (
              <div key={c.id} style={{ ...s.card, padding:16, opacity: desbloqueado ? 1 : 0.45, borderColor: desbloqueado ? `${C.accent}40` : C.border, background: desbloqueado ? `${C.accent}06` : C.card }}>
                <div style={{ fontSize:30, marginBottom:8 }}>{c.icon}</div>
                <div style={{ fontWeight:700, fontSize:13 }}>{c.titulo}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:3, marginBottom:8 }}>{c.desc}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <Badge text={`+${c.xp} XP`} color={desbloqueado ? C.accent : C.muted} />
                  {desbloqueado ? <span style={{ fontSize:11, color:C.accent, fontWeight:700 }}>✓ Desbloqueado</span> : <span style={{ fontSize:10, color:C.muted }}>🔒 Bloqueado</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {aba === "badges" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontSize:12, color:C.muted }}>Badges são atribuídos pelo seu Personal</div>
          {BADGES_PERSONAL.filter(b => b.alunos.includes("Lucas Mendes")).length === 0
            ? <div style={{ ...s.card, textAlign:"center", padding:30, color:C.muted }}>
                <div style={{ fontSize:36, marginBottom:8 }}>🎖️</div>
                <div style={{ fontWeight:700 }}>Nenhum badge ainda</div>
                <div style={{ fontSize:12, marginTop:4 }}>Conclua missões para ganhar badges do seu Personal</div>
              </div>
            : BADGES_PERSONAL.filter(b => b.alunos.includes("Lucas Mendes")).map(b => (
              <div key={b.id} style={{ ...s.card, padding:16, display:"flex", alignItems:"center", gap:14, borderColor:`${b.cor}40`, background:`${b.cor}08` }}>
                <div style={{ width:48, height:48, borderRadius:12, background:`${b.cor}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{b.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:b.cor }}>{b.nome}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{b.desc}</div>
                </div>
                <Badge text="✓ Ganho" color={b.cor} />
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

// ─── CHECK-IN DE HUMOR PRÉ-TREINO ────────────────────────────────────────────
const CheckInHumorModal = ({ onClose, onConfirm }) => {
  const [humor, setHumor] = useState(null);
  const humores = [
    { id:"cansado",  icon:"😴", label:"Cansado",    cor:C.muted,   intensidade:"Leve",    desc:"Treino de recuperação, cargas -20%, foco em mobilidade" },
    { id:"normal",   icon:"😐", label:"Normal",     cor:C.blue,    intensidade:"Moderada",desc:"Treino padrão conforme programação" },
    { id:"disposto", icon:"💪", label:"No Pique!",  cor:C.accent,  intensidade:"Intensa", desc:"Pode forçar mais — sugestão de sobrecarga progressiva ativada" },
  ];
  const sel = humores.find(h => h.id === humor);
  return (
    <Modal onClose={onClose} title="🧠 Check-in pré-treino">
      <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Como você está hoje? A IA vai adaptar a intensidade do treino.</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        {humores.map(h => (
          <div key={h.id} onClick={() => setHumor(h.id)} style={{ ...s.card, padding:18, cursor:"pointer", display:"flex", alignItems:"center", gap:16, borderColor: humor===h.id ? h.cor : C.border, background: humor===h.id ? `${h.cor}12` : C.card, transition:"all 0.15s" }}>
            <div style={{ fontSize:36 }}>{h.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, color: humor===h.id ? h.cor : C.text }}>{h.label}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Intensidade: <strong style={{ color:h.cor }}>{h.intensidade}</strong></div>
            </div>
            {humor===h.id && <div style={{ width:20, height:20, borderRadius:"50%", background:h.cor, display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontSize:12, fontWeight:800 }}>✓</div>}
          </div>
        ))}
      </div>
      {sel && (
        <div style={{ padding:14, background:`${sel.cor}10`, border:`1px solid ${sel.cor}30`, borderRadius:10, marginBottom:20 }}>
          <div style={{ fontWeight:700, color:sel.cor, marginBottom:4 }}>⚡ IA vai ajustar:</div>
          <div style={{ fontSize:13, color:C.muted }}>{sel.desc}</div>
        </div>
      )}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ ...btn(C.muted,true), flex:1 }}>Pular</button>
        <button onClick={() => humor && onConfirm(humor)} style={{ ...btn(humor ? C.accent : C.muted), flex:2 }} disabled={!humor}>Iniciar treino →</button>
      </div>
    </Modal>
  );
};

// ─── NOTIFICAÇÕES INTELIGENTES (painel do personal) ──────────────────────────
const NotificacoesPanel = ({ onClose }) => {
  const alertas = ALUNOS_TODOS.filter(a => a.risco).map(a => ({
    aluno: a.name,
    last: a.last,
    tipo: a.status === "danger" ? "danger" : "alert",
    sugestao: `Enviar mensagem: "${a.name.split(" ")[0]}, vimos que você está sem treinar. Que tal ${a.name.split(" ")[1][0] === "M" || a.name.split(" ")[1][0] === "A" ? "amanhã" : "hoje"} às 19h?"`
  }));
  return (
    <Modal onClose={onClose} title="🔔 Alertas de Alunos">
      <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Alunos que não treinaram nos últimos 3+ dias</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {alertas.map((a, i) => (
          <div key={i} style={{ ...s.card, padding:16, borderLeft:`4px solid ${a.tipo==="danger"?C.red:C.orange}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap", marginBottom:10 }}>
              <div>
                <div style={{ fontWeight:700 }}>{a.aluno}</div>
                <div style={{ fontSize:12, color:C.muted }}>Último treino: {a.last}</div>
              </div>
              <Badge text={a.tipo==="danger"?"⚠️ Sumido":"Irregular"} color={a.tipo==="danger"?C.red:C.orange} />
            </div>
            <div style={{ padding:10, background:C.surface, borderRadius:8, fontSize:12, color:C.muted, fontStyle:"italic", marginBottom:10 }}>{a.sugestao}</div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...btn(a.tipo==="danger"?C.red:C.orange), fontSize:11, padding:"5px 14px" }}>📲 Enviar notificação</button>
              <button style={{ ...btn(C.muted,true), fontSize:11, padding:"5px 10px" }}>Ver perfil</button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

// ─── IA COPILOTO DO PERSONAL ──────────────────────────────────────────────────
const CopiloPanel = ({ onClose, onVerAluno }) => {
  const insights = [
    { aluno:"Lucas Mendes",   tipo:"estagnado",  cor:C.orange, icon:"📊", msg:"Estagnado no Supino Reto há 3 semanas (80kg). Sugestão: tente Supino Inclinado por 2 semanas para chocar o músculo." },
    { aluno:"Carlos Lima",    tipo:"risco",      cor:C.red,    icon:"⚠️", msg:"Frequência caiu 60% nas últimas 2 semanas. Considere ajustar a carga ou conversar sobre motivação." },
    { aluno:"Ana Souza",      tipo:"progresso",  cor:C.accent, icon:"🚀", msg:"Evolução consistente no Leg Press: +40kg em 6 semanas. Considere introduzir agachamento livre." },
    { aluno:"Fernanda Lima",  tipo:"pr",         cor:C.blue,   icon:"🏆", msg:"Bateu PR na Puxada Frente ontem (70kg). Ótimo momento para aumentar volume de costas." },
    { aluno:"Diego Martins",  tipo:"deload",     cor:C.purple, icon:"🔄", msg:"4 semanas consecutivas de treino intenso. Recomendamos 1 semana de deload para recuperação otimizada." },
  ];
  return (
    <Modal onClose={onClose} title="🤖 Copiloto IA — Insights dos Alunos">
      <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Análise automática baseada no histórico de treinos</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ ...s.card, padding:16, borderLeft:`4px solid ${ins.cor}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:18 }}>{ins.icon}</span>
              <span style={{ fontWeight:700 }}>{ins.aluno}</span>
              <Badge text={ins.tipo} color={ins.cor} />
            </div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{ins.msg}</div>
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <button onClick={()=>{ onVerAluno&&onVerAluno(ALUNOS_TODOS.find(a=>a.name===ins.aluno)||ALUNOS_TODOS[0]); onClose(); }} style={{ ...btn(ins.cor,true), fontSize:11, padding:"4px 12px" }}>Ver histórico</button>
              <button style={{ ...btn(C.purple,true), fontSize:11, padding:"4px 12px" }}>Ajustar treino</button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

// ─── PERSONAL: BADGES MANAGER ────────────────────────────────────────────────
const BadgesManagerScreen = ({ setScreen }) => {
  const [badges, setBadges] = useState(BADGES_PERSONAL);
  const [criando, setCriando] = useState(false);
  const [novoB, setNovoB] = useState({ nome:"", icon:"🎖️", desc:"", cor:C.accent });
  const [editandoAlunos, setEditandoAlunos] = useState(null);
  const cores = [C.accent, C.blue, C.purple, C.red, C.orange, C.teal];

  const criarBadge = () => {
    if (!novoB.nome) return;
    setBadges(prev => [...prev, { id:`b${Date.now()}`, ...novoB, alunos:[] }]);
    setNovoB({ nome:"", icon:"🎖️", desc:"", cor:C.accent });
    setCriando(false);
  };

  const toggleAluno = (badgeId, alunoName) => {
    setBadges(prev => prev.map(b => b.id === badgeId
      ? { ...b, alunos: b.alunos.includes(alunoName) ? b.alunos.filter(a => a !== alunoName) : [...b.alunos, alunoName] }
      : b
    ));
  };

  const inp = { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontFamily:"inherit", fontSize:13, boxSizing:"border-box" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {editandoAlunos && (
        <Modal onClose={() => setEditandoAlunos(null)} title={`Associar alunos — ${badges.find(b=>b.id===editandoAlunos)?.nome}`}>
          <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Selecione os alunos que receberão este badge</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {ALUNOS_TODOS.map(a => {
              const b = badges.find(b=>b.id===editandoAlunos);
              const sel = b?.alunos.includes(a.name);
              return (
                <div key={a.name} onClick={() => toggleAluno(editandoAlunos, a.name)} style={{ ...s.card, padding:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12, borderColor:sel?C.accent:C.border, background:sel?`${C.accent}08`:C.card }}>
                  <div style={{ width:32,height:32,borderRadius:"50%",background:`${C.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800 }}>{a.name[0]}</div>
                  <div style={{ flex:1, fontWeight:600 }}>{a.name}</div>
                  <div style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${sel?C.accent:C.border}`,background:sel?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontSize:11,fontWeight:800 }}>{sel?"✓":""}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setEditandoAlunos(null)} style={{ ...btn(C.accent), width:"100%", marginTop:16 }}>Confirmar seleção</button>
        </Modal>
      )}

      <div>
        <button onClick={() => setScreen("personalDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>Personal — Dr. Paulo Ferreira</div>
        <h1 style={s.h1}>Meus Badges</h1>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Crie badges e associe aos alunos que merecem reconhecimento</div>
      </div>

      <button onClick={() => setCriando(true)} style={{ ...btn(C.purple), alignSelf:"flex-start" }}>+ Criar novo Badge</button>

      {criando && (
        <div style={{ ...s.card, borderLeft:`4px solid ${C.purple}` }}>
          <h3 style={{ ...s.h3, marginBottom:14 }}>Novo Badge</h3>
          <div className="rg2" style={{display:"grid",gap:12}}>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Nome</div><input style={inp} placeholder="Ex: Guerreiro da Semana" value={novoB.nome} onChange={e=>setNovoB(p=>({...p,nome:e.target.value}))} /></div>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Ícone (emoji)</div><input style={{...inp,fontSize:22,textAlign:"center"}} value={novoB.icon} onChange={e=>setNovoB(p=>({...p,icon:e.target.value}))} /></div>
          </div>
          <div style={{ marginTop:12 }}><div style={{ ...s.lbl, marginBottom:6 }}>Descrição / critério</div><input style={inp} placeholder="O que o aluno precisa fazer para ganhar?" value={novoB.desc} onChange={e=>setNovoB(p=>({...p,desc:e.target.value}))} /></div>
          <div style={{ marginTop:12 }}>
            <div style={{ ...s.lbl, marginBottom:8 }}>Cor</div>
            <div style={{ display:"flex", gap:8 }}>
              {cores.map(c => <div key={c} onClick={() => setNovoB(p=>({...p,cor:c}))} style={{ width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:novoB.cor===c?`3px solid #fff`:"3px solid transparent",transition:"all 0.15s" }} />)}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <button onClick={criarBadge} style={btn(C.purple)}>Criar Badge</button>
            <button onClick={() => setCriando(false)} style={btn(C.muted,true)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {badges.map(b => (
          <div key={b.id} style={{ ...s.card, padding:16 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:14, flexWrap:"wrap" }}>
              <div style={{ width:52,height:52,borderRadius:12,background:`${b.cor}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>{b.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:b.cor, fontSize:15 }}>{b.nome}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2, marginBottom:8 }}>{b.desc}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {b.alunos.length > 0
                    ? b.alunos.map(a => <span key={a} style={tag(b.cor)}>{a.split(" ")[0]}</span>)
                    : <span style={{ fontSize:12, color:C.muted }}>Nenhum aluno associado ainda</span>}
                </div>
              </div>
              <button onClick={() => setEditandoAlunos(b.id)} style={{ ...btn(b.cor,true), fontSize:11, padding:"5px 12px", flexShrink:0 }}>👥 Associar alunos</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PERSONAL: PLANO DE CARTEIRA ─────────────────────────────────────────────
const PlanoPersonalScreen = ({ setScreen }) => {
  const [ciclo, setCiclo] = useState("mensal"); // mensal | anual
  const planoAtual = PLANOS_PERSONAL[1]; // Pro
  const alunos = ALUNOS_TODOS.length;
  const desc = ciclo==="anual" ? 0.8 : 1; // 20% desconto anual
  const FEATURES_COMP = [
    { label:"Limite de alunos",           vals:["10","30","Ilimitado"] },
    { label:"Dashboard de alunos",        vals:[true,true,true] },
    { label:"Cadastrar treinos",          vals:[true,true,true] },
    { label:"Relatórios mensais PDF",     vals:[false,true,true] },
    { label:"Badges personalizados",      vals:[false,true,true] },
    { label:"Copiloto IA",               vals:[false,true,true] },
    { label:"Pacotes Vendáveis",          vals:[false,false,true] },
    { label:"Link de convite + QR",       vals:[false,false,true] },
    { label:"Analytics avançado",         vals:[false,false,true] },
    { label:"Suporte prioritário",        vals:[false,false,true] },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <button onClick={() => setScreen("personalDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>Personal — Dr. Paulo Ferreira</div>
        <h1 style={s.h1}>Meu Plano</h1>
      </div>

      {/* Status atual */}
      <div style={{ ...s.card, borderColor:`${planoAtual.cor}50`, background:`${planoAtual.cor}08`, padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:`${planoAtual.cor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:planoAtual.cor }}>P</div>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ fontWeight:800,fontSize:16,color:planoAtual.cor }}>{planoAtual.nome}</span><Badge text="Plano atual" color={planoAtual.cor}/></div>
              <div style={{ fontSize:12,color:C.muted }}>Próxima cobrança: 15/06/2026 · R${planoAtual.preco}/mês</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:26,fontWeight:800,color:planoAtual.cor }}>{alunos}<span style={{ fontSize:13,fontWeight:400,color:C.muted }}>/{planoAtual.alunos}</span></div>
            <div style={{ fontSize:11,color:C.muted }}>alunos usados</div>
          </div>
        </div>
        <PBar pct={Math.round((alunos/planoAtual.alunos)*100)} color={planoAtual.cor} />
        <div style={{ fontSize:11,color:C.muted,marginTop:5 }}>{alunos} de {planoAtual.alunos} alunos · {planoAtual.alunos-alunos} restantes</div>
      </div>

      {/* Toggle mensal / anual */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
        <span style={{ fontSize:13,fontWeight:ciclo==="mensal"?700:400,color:ciclo==="mensal"?C.text:C.muted }}>Mensal</span>
        <div onClick={()=>setCiclo(c=>c==="mensal"?"anual":"mensal")} style={{ width:48,height:26,borderRadius:13,background:ciclo==="anual"?C.accent:C.border,cursor:"pointer",position:"relative",transition:"background 0.2s" }}>
          <div style={{ position:"absolute",top:3,left:ciclo==="anual"?26:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
        </div>
        <span style={{ fontSize:13,fontWeight:ciclo==="anual"?700:400,color:ciclo==="anual"?C.accent:C.muted }}>Anual <Badge text="20% OFF" color={C.accent}/></span>
      </div>

      {/* Tabela comparativa */}
      <div style={{ ...s.card, padding:0, overflow:"hidden" }}>
        {/* Header dos planos */}
        <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:0 }}>
          <div style={{ padding:"16px 18px",borderBottom:`1px solid ${C.border}` }}><div style={{ fontSize:11,color:C.muted }}>Funcionalidades</div></div>
          {PLANOS_PERSONAL.map((p,i) => (
            <div key={p.id} style={{ padding:"16px 12px",textAlign:"center",background:i===2?`${C.accent}08`:"transparent",borderBottom:`1px solid ${C.border}`,borderLeft:`1px solid ${C.border}`,position:"relative" }}>
              {i===1&&<div style={{ position:"absolute",top:-1,left:0,right:0,height:3,background:p.cor }}/>}
              {i===2&&<div style={{ position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:C.accent,color:"#000",fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:10,whiteSpace:"nowrap" }}>RECOMENDADO</div>}
              <div style={{ fontWeight:800,fontSize:15,color:p.cor,marginBottom:2 }}>{p.nome}</div>
              <div style={{ fontSize:22,fontWeight:800,color:C.text }}>
                {p.preco===0?"Grátis":`R$${Math.round(p.preco*desc)}`}
                {p.preco>0&&<span style={{ fontSize:11,fontWeight:400,color:C.muted }}>/mês</span>}
              </div>
              {ciclo==="anual"&&p.preco>0&&<div style={{ fontSize:10,color:C.accent }}>cobrado anualmente</div>}
            </div>
          ))}
        </div>
        {/* Linhas de features */}
        {FEATURES_COMP.map((f,fi) => (
          <div key={fi} style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",borderBottom:fi<FEATURES_COMP.length-1?`1px solid ${C.border}`:"none" }}>
            <div style={{ padding:"12px 18px",fontSize:12,color:C.muted,display:"flex",alignItems:"center" }}>{f.label}</div>
            {f.vals.map((v,vi) => (
              <div key={vi} style={{ padding:"12px 12px",textAlign:"center",background:vi===2?`${C.accent}04`:"transparent",borderLeft:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                {typeof v==="boolean"
                  ? <span style={{ fontSize:16,color:v?C.accent:C.border }}>{v?"✓":"—"}</span>
                  : <span style={{ fontSize:12,fontWeight:700,color:C.text }}>{v}</span>
                }
              </div>
            ))}
          </div>
        ))}
        {/* CTA row */}
        <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:0,padding:"16px 12px",gap:8 }}>
          <div/>
          {PLANOS_PERSONAL.map((p,i) => (
            <div key={p.id} style={{ padding:"0 4px" }}>
              {p.id===planoAtual.id
                ? <div style={{ textAlign:"center",padding:"8px",fontSize:11,fontWeight:700,color:p.cor,border:`1px solid ${p.cor}30`,borderRadius:8 }}>✓ Atual</div>
                : <button style={{ ...btn(p.cor,i===0), width:"100%",fontSize:11,padding:"9px 4px" }}>{i===0?"Rebaixar":"Fazer upgrade"}</button>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div style={{ ...s.card, padding:16, background:`${C.blue}08`, borderColor:`${C.blue}30` }}>
        <div style={{ fontSize:12,color:C.blue,fontWeight:700,marginBottom:8 }}>🏅 Personais no GymAI</div>
        <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
          {[{v:"12",l:"no Starter",c:C.muted},{v:"20",l:"no Pro",c:C.blue},{v:"6",l:"no Elite",c:C.accent}].map(m=>(
            <div key={m.l} style={{ textAlign:"center" }}><div style={{ fontSize:20,fontWeight:800,color:m.c }}>{m.v}</div><div style={{ fontSize:10,color:C.muted }}>{m.l}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN: GESTÃO DE PLANOS DE PERSONAL ─────────────────────────────────────
const AdminPlanosManager = () => {
  const [planos, setPlanos] = useState(PLANOS_PERSONAL.map(p => ({...p})));
  const [editando, setEditando] = useState(null);
  const [notif, setNotif] = useState(false);
  const inp = (v, onChange) => <input value={v} onChange={onChange} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontFamily:"inherit", fontSize:13, boxSizing:"border-box" }} />;

  const salvar = (id, campo, valor) => setPlanos(prev => prev.map(p => p.id===id ? {...p,[campo]:valor} : p));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <h3 style={s.h3}>💼 Gestão de Planos de Personal</h3>
        <button onClick={() => { setNotif(true); setTimeout(()=>setNotif(false),3000); }} style={{ ...btn(C.orange,true), fontSize:12 }}>📢 Notificar todos os personais</button>
      </div>
      {notif && <div style={{ ...s.card, background:`${C.accent}15`, borderColor:`${C.accent}40`, fontSize:13, color:C.accent, fontWeight:700, padding:12 }}>✅ Notificação enviada para todos os 38 personais!</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {planos.map(p => (
          <div key={p.id} style={{ ...s.card, padding:18, borderLeft:`4px solid ${p.cor}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:12 }}>
              <div style={{ fontWeight:800, fontSize:16, color:p.cor }}>{p.nome}</div>
              <button onClick={() => setEditando(editando===p.id?null:p.id)} style={{ ...btn(p.cor,true), fontSize:11, padding:"4px 12px" }}>{editando===p.id?"✓ Fechar":"✏️ Editar"}</button>
            </div>
            {editando !== p.id ? (
              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                <div><div style={s.lbl}>Preço</div><div style={{ fontWeight:700, color:p.cor }}>{p.preco===0?"Grátis":`R$${p.preco}/mês`}</div></div>
                <div><div style={s.lbl}>Limite de alunos</div><div style={{ fontWeight:700 }}>{p.alunos===999?"Ilimitado":p.alunos}</div></div>
                <div><div style={s.lbl}>Features</div><div style={{ fontSize:12, color:C.muted }}>{p.features.join(" · ")}</div></div>
              </div>
            ) : (
              <div className="rg2" style={{display:"grid",gap:12}}>
                <div><div style={{ ...s.lbl, marginBottom:6 }}>Preço (R$/mês)</div>{inp(p.preco, e=>salvar(p.id,"preco",+e.target.value))}</div>
                <div><div style={{ ...s.lbl, marginBottom:6 }}>Limite de alunos</div>{inp(p.alunos===999?"Ilimitado":p.alunos, e=>salvar(p.id,"alunos",e.target.value==="Ilimitado"?999:+e.target.value))}</div>
                <div><div style={{ ...s.lbl, marginBottom:6 }}>Descrição</div>{inp(p.desc, e=>salvar(p.id,"desc",e.target.value))}</div>
                <div><div style={{ ...s.lbl, marginBottom:6 }}>Features (separadas por vírgula)</div>{inp(p.features.join(", "), e=>salvar(p.id,"features",e.target.value.split(",").map(x=>x.trim())))}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ ...s.card, background:`${C.blue}08`, borderColor:`${C.blue}30` }}>
        <div style={{ fontWeight:700, color:C.blue, marginBottom:6 }}>📊 Distribuição atual de personais por plano</div>
        {[{nome:"Starter",count:12,cor:C.muted},{nome:"Pro",count:20,cor:C.blue},{nome:"Elite",count:6,cor:C.accent}].map(p => (
          <div key={p.nome} style={{ marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:13 }}>{p.nome}</span>
              <span style={{ fontWeight:700, color:p.cor }}>{p.count} personais</span>
            </div>
            <PBar pct={Math.round(p.count/38*100)} color={p.cor} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SOBRECARGA PROGRESSIVA IA (componente inline) ────────────────────────────
const SobrecargazPanel = ({ exercicio }) => {
  const hist = (gd().historicoExercicios || HISTORICO_EXERCICIOS)[exercicio];
  if (!hist || hist.length < 2) return null;
  const ultima = hist[0];
  const penultima = hist[1];
  const evolucao = ultima.kg - penultima.kg;
  const sugeridoKg = +(ultima.kg * 1.025).toFixed(1);
  const sugeridoReps = ultima.reps + 1;
  return (
    <div style={{ padding:12, background:`${C.accent}08`, border:`1px solid ${C.accent}25`, borderRadius:10, marginBottom:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <span style={{ fontSize:14 }}>🤖</span>
        <span style={{ fontWeight:700, fontSize:12, color:C.accent }}>Sugestão IA — Sobrecarga Progressiva</span>
      </div>
      <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>
        Última sessão: <strong style={{ color:C.text }}>{ultima.kg}kg × {ultima.reps}</strong>
        {evolucao > 0 && <span style={{ color:C.accent }}> (+{evolucao}kg vs anterior)</span>}
        <br/>
        Sugerido hoje: <strong style={{ color:C.accent }}>{sugeridoKg}kg</strong> ou <strong style={{ color:C.accent }}>{ultima.kg}kg × {sugeridoReps} reps</strong>
        <br/>
        <span style={{ fontSize:11, fontStyle:"italic" }}>
          {evolucao === 0 ? "Carga estável há 2 semanas — hora de progredir! 💪" : "Progresso detectado — mantendo sobrecarga +2.5%"}
        </span>
      </div>
    </div>
  );
};

const PersonalDashboard = ({ setScreen }) => {
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [statsModal, setStatsModal] = useState(null);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const alunos = gd().alunos?.length > 0 ? gd().alunos : ALUNOS_TODOS;
  const ativos = alunos.filter(a => a.status !== "danger").length;
  const emRisco = alunos.filter(a => a.risco).length;
  const treinosAtivos = TREINOS_PERSONAL.filter(t => t.ativo).length;
  const treinosNovos = TREINOS_PERSONAL.filter(t => t.novoMes).length;

  const ClickStatCard = ({ label, value, sub, color, icon, modalKey }) => (
    <div onClick={() => setStatsModal(modalKey)} style={{ ...s.card, position:"relative", overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s", borderColor: C.border }}
      onMouseEnter={e => e.currentTarget.style.borderColor=color}
      onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
      <div style={{ position:"absolute", top:12, right:14, fontSize:24, opacity:0.12 }}>{icon}</div>
      <div style={s.lbl}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color, marginTop:6 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{sub}</div>}
      <div style={{ fontSize:10, color, marginTop:6, fontWeight:700 }}>Ver lista →</div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {alunoSelecionado && <AlunoModal aluno={alunoSelecionado} onClose={() => setAlunoSelecionado(null)} />}
      {statsModal && <PersonalStatsModal tipo={statsModal} onClose={() => setStatsModal(null)} />}
      {showCopilot && <CopiloPanel onClose={() => setShowCopilot(false)} onVerAluno={(a)=>{ setAlunoSelecionado(a); }} />}
      {showNotif && <NotificacoesPanel onClose={() => setShowNotif(false)} />}

      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <div><div style={s.lbl}>Painel do Personal</div><h1 style={s.h1}>Dr. Paulo Ferreira</h1></div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button style={btn(C.teal,true)} onClick={() => setScreen("personalAssociarAluno")}>🔗 Associar Aluno</button>
          <button style={btn(C.purple)} onClick={() => setScreen("personalCadastrarTreino")}>+ Cadastrar Treino</button>
        </div>
      </div>

      {/* IA Copilot + Notificações strip */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={() => setShowCopilot(true)} style={{ ...s.card, flex:1, minWidth:160, cursor:"pointer", padding:14, display:"flex", alignItems:"center", gap:10, background:`${C.purple}10`, borderColor:`${C.purple}40` }}>
          <span style={{ fontSize:22 }}>🤖</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontWeight:700, color:C.purple, fontSize:13 }}>Copiloto IA</div>
            <div style={{ fontSize:11, color:C.muted }}>5 insights disponíveis</div>
          </div>
        </button>
        <button onClick={() => setShowNotif(true)} style={{ ...s.card, flex:1, minWidth:160, cursor:"pointer", padding:14, display:"flex", alignItems:"center", gap:10, background:`${C.red}08`, borderColor:`${C.red}30` }}>
          <span style={{ fontSize:22 }}>🔔</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontWeight:700, color:C.red, fontSize:13 }}>Alertas</div>
            <div style={{ fontSize:11, color:C.muted }}>{emRisco} alunos sem treinar há 3+ dias</div>
          </div>
        </button>
        <button onClick={() => setScreen("personalPlano")} style={{ ...s.card, flex:1, minWidth:160, cursor:"pointer", padding:14, display:"flex", alignItems:"center", gap:10, background:`${C.blue}08`, borderColor:`${C.blue}30` }}>
          <span style={{ fontSize:22 }}>💼</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontWeight:700, color:C.blue, fontSize:13 }}>Meu Plano</div>
            <div style={{ fontSize:11, color:C.muted }}>Pro · {alunos.length}/30 alunos</div>
          </div>
        </button>
      </div>

      {/* Sprint B quick-access strip */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[
          { label:"📦 Pacotes Vendáveis", screen:"personalPacotes",     color:C.accent },
          { label:"📄 Relatório Mensal",  screen:"personalRelatorio",   color:C.blue },
          { label:"🔗 Link de Convite",   screen:"personalLinkConvite", color:C.purple },
        ].map(it=>(
          <button key={it.screen} onClick={()=>setScreen(it.screen)} style={{ ...btn(it.color,true), fontSize:12, padding:"7px 14px" }}>{it.label}</button>
        ))}
      </div>

      {/* Row 1 — Alunos */}
      <div>
        <div style={{ ...s.lbl, marginBottom:10 }}>Alunos</div>
        <div className="rg3" style={{display:"grid",gap:16}}>
          <ClickStatCard label="Alunos Ativos"   value={ativos}        sub="treinando regularmente" color={C.purple} icon="👥" modalKey="alunos_ativos" />
          <ClickStatCard label="Total de Alunos" value={alunos.length} sub={`${alunos.length - ativos} inativos`} color={C.blue} icon="🎓" modalKey="alunos_total" />
          <ClickStatCard label="Alunos em Risco" value={emRisco}       sub="sem treinar há 5+ dias"  color={C.red}  icon="⚠️" modalKey="alunos_risco" />
        </div>
      </div>

      {/* Row 2 — Treinos */}
      <div>
        <div style={{ ...s.lbl, marginBottom:10 }}>Treinos</div>
        <div className="rg3" style={{display:"grid",gap:16}}>
          <ClickStatCard label="Treinos Ativos"  value={treinosAtivos}        sub="em uso pelos alunos"     color={C.accent} icon="📋" modalKey="treinos_ativos" />
          <ClickStatCard label="Total de Treinos" value={TREINOS_PERSONAL.length} sub="na biblioteca"       color={C.blue}   icon="🏋️" modalKey="treinos_total" />
          <ClickStatCard label="Novos este mês"  value={treinosNovos}         sub="criados em maio/2026"    color={C.teal}   icon="✨" modalKey="treinos_novos" />
        </div>
      </div>

      <div className="rg2" style={{display:"grid",gap:16}}>
        {/* Meus Alunos — scrollable full list */}
        <div style={{ ...s.card, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
            <h3 style={s.h3}>Meus Alunos</h3>
            <Badge text={`${alunos.length} total`} color={C.muted}/>
          </div>
          <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>Clique no nome para ver o perfil completo</div>
          <div style={{ overflowY:"auto", maxHeight:380, paddingRight:4 }}>
            {alunos.map(a => (
              <div key={a.name} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flex:1, minWidth:0 }} onClick={() => setAlunoSelecionado(a)}>
                    <div style={{ width:34,height:34,borderRadius:"50%",flexShrink:0,background:a.status==="danger"?`${C.red}25`:a.status==="alert"?`${C.orange}20`:`${C.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13 }}>{a.name[0]}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:C.accent, textDecoration:"underline", textDecorationColor:`${C.accent}50`, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>Último: {a.last}</div>
                    </div>
                  </div>
                  <div style={{ flexShrink:0, marginLeft:8 }}>
                    {a.status==="danger"?<Badge text="⚠️ Sumido" color={C.red}/>:a.status==="alert"?<Badge text="Irregular" color={C.orange}/>:<Badge text="✓ Regular" color={C.accent}/>}
                  </div>
                </div>
                <div style={{ paddingLeft:44, marginTop:6 }}><PBar pct={a.pct} color={a.status==="danger"?C.red:a.status==="alert"?C.orange:C.accent}/></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Adesão da semana — scrollable full list */}
          <div style={{ ...s.card }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:8 }}>
              <h3 style={s.h3}>Adesão da Semana</h3>
              <Badge text={`${alunos.length} alunos`} color={C.muted}/>
            </div>
            <div style={{ overflowY:"auto", maxHeight:260, paddingRight:4 }}>
              {[...alunos].sort((a,b) => b.pct - a.pct).map(a => (
                <div key={a.name} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:500 }}>{a.name}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:a.pct>60?C.accent:a.pct>30?C.orange:C.red }}>{a.pct}%</span>
                  </div>
                  <PBar pct={a.pct} color={a.pct>60?C.accent:a.pct>30?C.orange:C.red}/>
                </div>
              ))}
            </div>
          </div>

          {/* Ação recomendada */}
          <div style={{ ...s.card, background:`${C.red}08`, borderColor:`${C.red}30` }}>
            <div style={{ fontWeight:700, color:C.red, marginBottom:8 }}>🚨 Ação Recomendada</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>
              {alunos.filter(a=>a.status==="danger").map(a=>a.name.split(" ")[0]).join(", ")} e outros {emRisco - alunos.filter(a=>a.status==="danger").length} alunos estão com adesão baixa.
            </div>
            <button style={{ ...btn(C.red,true), fontSize:11, padding:"5px 12px", marginTop:10 }}>Enviar notificação</button>
          </div>

          {/* Meta de receita mensal */}
          <div style={{ ...s.card, background:`${C.teal}08`, borderColor:`${C.teal}30` }}>
            <div style={{ fontWeight:700, color:C.teal, marginBottom:4 }}>💰 Meta de Receita</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
              <div style={{ fontSize:22, fontWeight:800, color:C.teal }}>R$ 1.240</div>
              <div style={{ fontSize:12, color:C.muted }}>meta R$ 2.000/mês</div>
            </div>
            <PBar pct={62} color={C.teal}/>
            <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>62% da meta · Faltam R$ 760</div>
            <button onClick={()=>setScreen("personalPacotes")} style={{ ...btn(C.teal,true), fontSize:11, padding:"5px 12px", marginTop:10, width:"100%" }}>+ Publicar pacote de treino</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalAssociarAluno = ({ setScreen }) => {
  const [busca, setBusca] = useState("");
  const [encontrado, setEncontrado] = useState(null);
  const [showAnamnese, setShowAnamnese] = useState(false);
  const [associados, setAssociados] = useState(ALUNOS_TODOS.map(a => a.name));
  const [confirmado, setConfirmado] = useState(null);

  // Mock database of registered users (could be found via search)
  const BASE_CADASTROS = [
    { name:"Lucas Mendes",     email:"lucas@email.com",    cpf:"123.456.789-00", nascimento:"15/03/1996", tel:"(19) 99999-0001", associado:true  },
    { name:"Mariana Figueiredo",email:"mari@email.com",   cpf:"987.654.321-00", nascimento:"22/07/2000", tel:"(11) 98888-2222", associado:false },
    { name:"João Pereira",     email:"joao@email.com",     cpf:"111.222.333-44", nascimento:"05/01/1990", tel:"(21) 97777-3333", associado:false },
    { name:"Sofia Andrade",    email:"sofia@email.com",    cpf:"555.666.777-88", nascimento:"30/11/1998", tel:"(19) 96666-4444", associado:false },
    { name:"Ana Souza",        email:"ana@email.com",      cpf:"222.333.444-55", nascimento:"08/04/1995", tel:"(19) 95555-5555", associado:true  },
  ];

  const inp = { width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", color:C.text, fontFamily:"inherit", fontSize:13, boxSizing:"border-box" };
  const resultados = busca.length >= 2 ? BASE_CADASTROS.filter(u =>
    u.name.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase()) ||
    u.cpf.includes(busca)
  ) : [];

  const associar = async (aluno) => {
    if (gd().associarAluno) {
      const { error } = await gd().associarAluno(aluno.email);
      if (error) { alert("Erro ao associar: " + error); return; }
    }
    setAssociados(prev => [...prev, aluno.name]);
    setEncontrado(null); setBusca("");
    setConfirmado(aluno.name);
    setTimeout(() => setConfirmado(null), 3500);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {showAnamnese && <AnamneseModal onClose={() => setShowAnamnese(false)} />}
      <div>
        <button onClick={() => setScreen("personalDash")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"inherit", padding:0, marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>Personal — Dr. Paulo Ferreira</div>
        <h1 style={s.h1}>Associar Aluno</h1>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Busque um aluno cadastrado na plataforma para adicioná-lo à sua carteira</div>
      </div>

      {/* Success toast */}
      {confirmado && (
        <div style={{ ...s.card, background:`${C.accent}15`, borderColor:`${C.accent}50`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:24 }}>✅</div>
          <div>
            <div style={{ fontWeight:700, color:C.accent }}>{confirmado} associado com sucesso!</div>
            <div style={{ fontSize:12, color:C.muted }}>O aluno agora aparece na sua lista de alunos.</div>
          </div>
        </div>
      )}

      {/* Search card */}
      <div style={s.card}>
        <h3 style={{ ...s.h3, marginBottom:14 }}>🔍 Buscar Aluno</h3>
        <div style={{ marginBottom:6 }}><div style={{ ...s.lbl, marginBottom:6 }}>Nome, e-mail ou CPF</div>
          <input style={inp} value={busca} onChange={e => { setBusca(e.target.value); setEncontrado(null); }} placeholder="Ex: Lucas Mendes ou lucas@email.com..." />
        </div>

        {busca.length >= 2 && resultados.length === 0 && (
          <div style={{ padding:16, textAlign:"center", color:C.muted, fontSize:13, marginTop:8 }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🔎</div>
            Nenhum cadastro encontrado para "<strong style={{ color:C.text }}>{busca}</strong>"
            <div style={{ marginTop:10 }}>
              <button onClick={() => setShowAnamnese(true)} style={{ ...btn(C.teal,true), fontSize:12 }}>+ Cadastrar novo aluno via Anamnese</button>
            </div>
          </div>
        )}

        {resultados.length > 0 && (
          <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ ...s.lbl, marginBottom:4 }}>Resultados ({resultados.length})</div>
            {resultados.map((u, i) => {
              const jaAssociado = associados.includes(u.name);
              return (
                <div key={i} style={{ ...s.card, padding:16, border:`1px solid ${jaAssociado ? C.accent+"40" : C.border}`, background: jaAssociado ? `${C.accent}08` : C.card }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44, height:44, borderRadius:"50%", background:`${C.purple}22`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, border:`2px solid ${C.purple}40` }}>{u.name[0]}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15 }}>{u.name}</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>📧 {u.email}</div>
                        <div style={{ fontSize:12, color:C.muted }}>🎂 {u.nascimento} · 📱 {u.tel}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                      {jaAssociado ? (
                        <Badge text="✓ Já é seu aluno" color={C.accent} />
                      ) : (
                        <>
                          <button onClick={() => setEncontrado(u)} style={{ ...btn(C.blue, true), fontSize:12, padding:"5px 12px" }}>Ver perfil</button>
                          <button onClick={() => associar(u)} style={{ ...btn(C.purple), fontSize:12, padding:"6px 14px" }}>+ Associar</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview card if user clicked "Ver perfil" */}
      {encontrado && (
        <div style={{ ...s.card, borderLeft:`4px solid ${C.purple}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
            <h3 style={s.h3}>Perfil de {encontrado.name}</h3>
            <button onClick={() => setEncontrado(null)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, width:28, height:28, cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>✕</button>
          </div>
          <div className="rg2" style={{display:"grid",gap:12}}>
            {[
              { l:"Nome completo", v:encontrado.name },
              { l:"E-mail",        v:encontrado.email },
              { l:"CPF",           v:encontrado.cpf },
              { l:"Nascimento",    v:encontrado.nascimento },
              { l:"Telefone",      v:encontrado.tel },
              { l:"Anamnese",      v:"Preenchida" },
            ].map(({l,v}) => (
              <div key={l} style={{ padding:12, background:C.surface, borderRadius:10 }}>
                <div style={s.lbl}>{l}</div>
                <div style={{ fontWeight:600, fontSize:14, marginTop:3 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap" }}>
            <button onClick={() => associar(encontrado)} style={{ ...btn(C.purple), flex:1, borderRadius:10 }}>✓ Confirmar Associação</button>
            <button onClick={() => { setEncontrado(null); setShowAnamnese(true); }} style={{ ...btn(C.teal,true), fontSize:12, padding:"8px 14px" }}>📋 Ver Anamnese</button>
          </div>
        </div>
      )}

      {/* Novo aluno CTA */}
      <div style={{ ...s.card, borderStyle:"dashed", textAlign:"center", padding:24 }}>
        <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Aluno ainda não cadastrado?</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:14 }}>Cadastre diretamente pela Anamnese — ela serve como cadastro base do aluno na plataforma.</div>
        <button onClick={() => setShowAnamnese(true)} style={btn(C.teal)}>Iniciar Anamnese / Cadastro</button>
      </div>
    </div>
  );
};

const PersonalCadastrarTreino = ({ setScreen }) => {
  const [exercises, setExercises] = useState([
    { name:"Supino Reto",muscle:"Peito",sets:4,reps:"8-10",kg:80,rest:90,equipId:"barra_supino" },
    { name:"Crucifixo",muscle:"Peito",sets:3,reps:"12",kg:14,rest:60,equipId:"haltere_fitzone" },
  ]);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div><button onClick={() => setScreen("personalDash")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>← Voltar</button><h1 style={s.h1}>Cadastrar Treino</h1></div>
      <div className="rg2" style={{display:"grid",gap:16}}>
        <div style={s.card}>
          <h3 style={{ ...s.h3, marginBottom:14 }}>Informações Gerais</h3>
          {[{label:"Nome do Treino",ph:"Ex: Treino A — Peito e Tríceps"},{label:"Aluno",ph:"Selecionar aluno..."}].map(f => (
            <div key={f.label} style={{ marginBottom:12 }}><div style={{ ...s.lbl, marginBottom:6 }}>{f.label}</div><input style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", color:C.text, fontFamily:"inherit", fontSize:14, boxSizing:"border-box" }} placeholder={f.ph} /></div>
          ))}
          <div style={{ marginBottom:12 }}>
            <div style={{ ...s.lbl, marginBottom:6 }}>Academia de Referência</div>
            <select style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", color:C.text, fontFamily:"inherit", fontSize:13 }}>{ACADEMIAS.map(a=><option key={a.id}>{a.name}</option>)}<option>Treino Livre</option></select>
          </div>
          <div className="rg2" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Duração</div><input style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", color:C.text, fontFamily:"inherit", fontSize:14, boxSizing:"border-box" }} defaultValue="60 min" /></div>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Nível</div><select style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", color:C.text, fontFamily:"inherit", fontSize:13 }}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
          </div>
        </div>
        <div style={s.card}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <h3 style={s.h3}>Exercícios</h3>
            <button style={{ ...btn(C.accent,true), fontSize:12, padding:"5px 14px" }} onClick={() => setExercises(e=>[...e,{name:"Novo Exercício",muscle:"Peito",sets:3,reps:"10",kg:0,rest:60,equipId:""}])}>+ Adicionar</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {exercises.map((ex,i) => (
              <div key={i} style={{ ...s.card, padding:14, borderLeft:`3px solid ${C.purple}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <input defaultValue={ex.name} style={{ background:"none", border:"none", color:C.text, fontWeight:700, fontSize:14, fontFamily:"inherit", flex:1 }} />
                  <button style={{ ...btn(C.red,true), fontSize:11, padding:"2px 8px" }} onClick={() => setExercises(e=>e.filter((_,j)=>j!==i))}>✕</button>
                </div>
                <div className="rg2" style={{display:"grid",gap:12}}>
                  <div><div style={{ ...s.lbl, marginBottom:4 }}>Equipamento</div><select defaultValue={ex.equipId} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 10px", color:C.text, fontFamily:"inherit", fontSize:12 }}><option value="">Selecionar...</option>{ACADEMIAS[0].equipamentos.map(eq=><option key={eq.id} value={eq.id}>{eq.name}</option>)}</select></div>
                  <div style={{ display:"flex", gap:8 }}>
                    <div><div style={{ ...s.lbl, marginBottom:4 }}>Séries</div><input defaultValue={ex.sets} style={{ width:50, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 8px", color:C.text, fontFamily:"inherit", fontSize:13, textAlign:"center" }} /></div>
                    <div><div style={{ ...s.lbl, marginBottom:4 }}>Reps</div><input defaultValue={ex.reps} style={{ width:60, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 8px", color:C.text, fontFamily:"inherit", fontSize:13 }} /></div>
                    <div><div style={{ ...s.lbl, marginBottom:4 }}>Kg</div><input defaultValue={ex.kg} style={{ width:50, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 8px", color:C.text, fontFamily:"inherit", fontSize:13, textAlign:"center" }} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12 }}><button style={btn(C.purple)}>💾 Salvar Treino</button><button style={{ ...btn(C.muted,true) }}>Salvar como Template</button></div>
    </div>
  );
};

const AdminDashboard = ({ setScreen }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
    <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
      <div><div style={s.lbl}>Painel Administrativo</div><h1 style={s.h1}>GymAI — Visão Geral</h1></div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={()=>setScreen&&setScreen("adminEstrutura")} style={{ ...btn(C.orange,true), fontSize:12 }}>🗺️ Estrutura da Plataforma</button>
        <button style={btn(C.accent)}>+ Novo cadastro</button>
      </div>
    </div>
    <div className="rg4" style={{display:"grid",gap:16}}>
      <StatCard label="Alunos ativos" value="1.243" sub="+47 este mês" color={C.accent} icon="🎓" />
      <StatCard label="Personais" value="38" sub="plano anual" color={C.purple} icon="🏅" />
      <StatCard label="Academias" value="12" sub="parceiras" color={C.blue} icon="🏢" />
      <StatCard label="MRR" value="R$ 62k" sub="+12% vs mês ant." color={C.orange} icon="💰" />
    </div>
    <div className="rg2" style={{display:"grid",gap:16}}>
      <div style={s.card}>
        <h3 style={{ ...s.h3, marginBottom:14 }}>Biblioteca Global de Exercícios</h3>
        {[{name:"Supino Reto",muscle:"Peito",type:"Força",equip:"Barra"},{name:"Pull-up",muscle:"Costas",type:"Composto",equip:"Barra fixa"},{name:"Agachamento Livre",muscle:"Pernas",type:"Força",equip:"Barra"},{name:"Rosca Direta",muscle:"Bíceps",type:"Isolamento",equip:"Barra/Haltere"}].map(ex => (
          <div key={ex.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
            <div><span style={{ fontWeight:600 }}>{ex.name}</span><div style={{ display:"flex", gap:6, marginTop:4 }}><Badge text={ex.muscle} color={C.blue}/><Badge text={ex.type} color={C.purple}/><Badge text={ex.equip} color={C.muted}/></div></div>
            <button style={{ ...btn(C.accent,true), fontSize:11, padding:"4px 10px" }}>Editar</button>
          </div>
        ))}
        <div style={{ marginTop:10 }}>
          <div style={{ ...s.lbl, marginBottom:8 }}>Equipamentos Genéricos</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{EQUIPAMENTOS_GENERICOS.map(eq=><span key={eq.id} style={tag(C.muted)}>{eq.name} · {eq.tipo}</span>)}</div>
          <button style={{ ...btn(C.accent,true), fontSize:12, marginTop:12 }}>+ Novo Equipamento</button>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={s.card}><h3 style={{ ...s.h3, marginBottom:12 }}>Academias Parceiras</h3>{ACADEMIAS.map(a=><div key={a.id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}><span style={{ fontWeight:600 }}>{a.name}</span><span style={{ fontSize:13, color:C.muted }}>{a.equipamentos.length} equipamentos</span></div>)}</div>
        <div style={s.card}><h3 style={{ ...s.h3, marginBottom:12 }}>Planos & Receita</h3>{[{plan:"Aluno Mensal",price:"R$50/mês",count:1243,rev:62150},{plan:"Personal Anual",price:"R$800/ano",count:38,rev:30400}].map(p=><div key={p.plan} style={{ padding:12, background:C.surface, borderRadius:8, marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontWeight:600 }}>{p.plan}</span><span style={{ color:C.accent, fontWeight:700 }}>R$ {p.rev.toLocaleString()}</span></div><div style={{ fontSize:12, color:C.muted }}>{p.price} · {p.count} ativos</div></div>)}</div>
      </div>
    </div>
    <div style={s.card}>
      <AdminPlanosManager />
    </div>
  </div>
);

const AcademiaPanel = ({ setScreen }) => {
  const [showAddEquip, setShowAddEquip] = useState(false);
  const [showQR, setShowQR] = useState(null);
  const equipamentos = ACADEMIAS[0].equipamentos;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {showQR && <QREquipModal equip={showQR} onClose={()=>setShowQR(null)} />}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <div><div style={s.lbl}>Painel da Academia</div><h1 style={s.h1}>FitZone Campinas</h1></div>
        <button style={btn(C.blue)} onClick={() => setShowAddEquip(!showAddEquip)}>+ Cadastrar Equipamento</button>
      </div>
      {/* Sprint B quick-access strip */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[{ label:"🥇 Ranking", screen:"academiaRanking", color:C.orange },{ label:"⏰ Picos", screen:"academiaHorarios", color:C.teal }].map(it=>(
          <button key={it.screen} onClick={()=>setScreen&&setScreen(it.screen)} style={{ ...btn(it.color,true), fontSize:12, padding:"7px 16px" }}>{it.label}</button>
        ))}
      </div>
      {showAddEquip&&(
        <div style={{ ...s.card, borderLeft:`4px solid ${C.blue}` }}>
          <h3 style={{ ...s.h3, marginBottom:14 }}>Novo Equipamento</h3>
          <div className="rg3" style={{display:"grid",gap:16}}>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Nome</div><input placeholder="Ex: Leg Press 45°" style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontFamily:"inherit", fontSize:13, boxSizing:"border-box" }} /></div>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Tipo</div><select style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontFamily:"inherit", fontSize:13 }}><option>Máquina</option><option>Livre</option><option>Cabo</option><option>Corporal</option></select></div>
            <div><div style={{ ...s.lbl, marginBottom:6 }}>Grupos Musculares</div><input placeholder="Ex: Pernas, Panturrilha" style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontFamily:"inherit", fontSize:13, boxSizing:"border-box" }} /></div>
          </div>
          <div style={{ marginTop:12 }}>
            <div style={{ ...s.lbl, marginBottom:6 }}>Vincular vídeo (URL)</div>
            <input placeholder="https://youtube.com/..." style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontFamily:"inherit", fontSize:13, boxSizing:"border-box" }} />
          </div>
          <button style={{ ...btn(C.blue), marginTop:14 }}>Salvar Equipamento</button>
        </div>
      )}
      <div className="rg4" style={{display:"grid",gap:16}}>
        <StatCard label="Equipamentos" value={equipamentos.length} sub="catalogados" color={C.blue} icon="🏋️" />
        <StatCard label="Personais" value="8" sub="vinculados" color={C.purple} icon="🏅" />
        <StatCard label="Alunos" value="287" sub="ativos" color={C.accent} icon="🎓" />
        <StatCard label="Check-ins hoje" value="43" sub="até agora" color={C.orange} icon="📍" />
      </div>
      <div style={s.card}>
        <h3 style={{ ...s.h3, marginBottom:16 }}>Equipamentos Cadastrados</h3>
        <div className="rg3" style={{display:"grid",gap:16}}>
          {equipamentos.map(eq => (
            <div key={eq.id} style={{ ...s.card, padding:14 }}>
              <div style={{ fontWeight:700, marginBottom:6 }}>{eq.name}</div>
              <Badge text={eq.tipo} color={C.blue}/>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>{eq.muscles.map(m=><span key={m} style={tag(C.accent)}>{m}</span>)}</div>
              <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
                <button onClick={()=>setShowQR(eq)} style={{ ...btn(C.teal,true), fontSize:11, padding:"3px 8px" }}>📷 QR Code</button>
                <button style={{ ...btn(C.blue,true), fontSize:11, padding:"3px 8px" }}>+ Vídeo</button>
                <button style={{ ...btn(C.muted,true), fontSize:11, padding:"3px 8px" }}>Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SPRINT B — FEATURE 1: RESUMO SEMANAL VISUAL (Spotify Wrapped style) ─────
const ResumoSemanalModal = ({ onClose }) => {
  const totalVol = TREINOS_SEMANA.filter(t=>t.done).reduce((a,t)=>a+t.exercises.reduce((b,e)=>b+e.kg*e.reps*e.series,0),0);
  const totalMin = TREINOS_SEMANA.filter(t=>t.done).reduce((a,t)=>a+t.durMin,0);
  const prs = [{ ex:"Supino Reto",kg:80,anterior:75 },{ ex:"Leg Press",kg:120,anterior:110 }];
  const stars = useState(()=>Array.from({length:18},(_,i)=>({ cx:(i*37+13)%97, cy:(i*53+7)%95, r:(i%3)*0.6+0.4, op:(i%5)*0.1+0.2 })))[0];
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 8px" }}>
      <div style={{ width:"100%",maxWidth:480,maxHeight:"94vh",overflowY:"auto",borderRadius:24,position:"relative",overflow:"hidden",background:`linear-gradient(145deg,#0D1F0A 0%,#0A1628 40%,#16081E 100%)`,border:`1px solid ${C.accent}30` }}>
        {/* Starfield BG */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {stars.map((st,i)=><circle key={i} cx={st.cx} cy={st.cy} r={st.r} fill={C.accent} opacity={st.op}/>)}
          <ellipse cx="50" cy="0" rx="60" ry="30" fill={C.accent} opacity="0.04"/>
          <ellipse cx="50" cy="100" rx="45" ry="20" fill={C.purple} opacity="0.06"/>
        </svg>
        <div style={{ position:"relative",zIndex:1,padding:32 }}>
          {/* Header */}
          <div style={{ textAlign:"center",marginBottom:28 }}>
            <div style={{ fontSize:11,fontWeight:700,color:C.accent,letterSpacing:"2px",textTransform:"uppercase",marginBottom:8 }}>Semana de 26/05 – 01/06</div>
            <div style={{ fontSize:32,fontWeight:800,color:"#fff",lineHeight:1.1 }}>Sua semana<br/><span style={{ color:C.accent }}>em destaque</span></div>
            <div style={{ marginTop:12,fontSize:13,color:C.muted }}>Lucas Mendes · FitZone Campinas</div>
          </div>
          {/* Big Stats */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20 }}>
            {[
              { icon:"🔥",val:TREINOS_SEMANA.filter(t=>t.done).length,unit:"treinos",label:"Esta semana",color:C.orange },
              { icon:"⏱️",val:totalMin,unit:"min",label:"Tempo total",color:C.blue },
              { icon:"💪",val:(totalVol/1000).toFixed(1),unit:"t",label:"Volume total",color:C.accent },
              { icon:"🏆",val:prs.length,unit:"PRs",label:"Recordes batidos",color:C.purple },
            ].map((st,i)=>(
              <div key={i} style={{ background:`rgba(255,255,255,0.05)`,borderRadius:16,padding:18,textAlign:"center",border:`1px solid rgba(255,255,255,0.08)`,backdropFilter:"blur(8px)" }}>
                <div style={{ fontSize:28,marginBottom:6 }}>{st.icon}</div>
                <div style={{ fontSize:30,fontWeight:800,color:st.color,lineHeight:1 }}>{st.val}<span style={{ fontSize:14,fontWeight:600,marginLeft:3 }}>{st.unit}</span></div>
                <div style={{ fontSize:11,color:C.muted,marginTop:4 }}>{st.label}</div>
              </div>
            ))}
          </div>
          {/* PRs */}
          <div style={{ background:"rgba(200,241,53,0.08)",borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.accent}30` }}>
            <div style={{ fontSize:11,fontWeight:700,color:C.accent,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12 }}>🏆 Recordes Pessoais</div>
            {prs.map((pr,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <span style={{ fontSize:13,color:"#fff",fontWeight:600 }}>{pr.ex}</span>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:11,color:C.muted,textDecoration:"line-through" }}>{pr.anterior}kg</span>
                  <span style={{ fontSize:18,fontWeight:800,color:C.accent }}>{pr.kg}kg</span>
                  <span style={{ fontSize:11,color:C.accent,fontWeight:700 }}>+{pr.kg-pr.anterior}kg</span>
                </div>
              </div>
            ))}
          </div>
          {/* Streak + XP */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24 }}>
            <div style={{ background:"rgba(255,119,48,0.12)",borderRadius:16,padding:16,textAlign:"center",border:`1px solid ${C.orange}30` }}>
              <div style={{ fontSize:36,marginBottom:4 }}>🔥</div>
              <div style={{ fontSize:24,fontWeight:800,color:C.orange }}>12 dias</div>
              <div style={{ fontSize:11,color:C.muted }}>sequência atual</div>
            </div>
            <div style={{ background:"rgba(155,89,255,0.12)",borderRadius:16,padding:16,textAlign:"center",border:`1px solid ${C.purple}30` }}>
              <div style={{ fontSize:36,marginBottom:4 }}>⚡</div>
              <div style={{ fontSize:24,fontWeight:800,color:C.purple }}>+480 XP</div>
              <div style={{ fontSize:11,color:C.muted }}>ganhos essa semana</div>
            </div>
          </div>
          {/* Muscle bar */}
          <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:16,padding:16,marginBottom:24,border:`1px solid rgba(255,255,255,0.06)` }}>
            <div style={{ fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12 }}>Grupos treinados</div>
            {[["Peito",80],["Costas",100],["Pernas",100],["Bíceps",80],["Tríceps",80]].map(([m,pct])=>(
              <div key={m} style={{ marginBottom:8 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3 }}><span style={{ color:"#fff",fontWeight:600 }}>{m}</span><span style={{ color:C.accent,fontWeight:700 }}>{pct}%</span></div>
                <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.1)" }}><div style={{ height:"100%",borderRadius:3,width:`${pct}%`,background:`linear-gradient(90deg,${C.accent},${C.teal})` }}/></div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button style={{ flex:1,background:"rgba(255,255,255,0.08)",color:"#fff",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"14px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit" }} onClick={onClose}>Fechar</button>
            <button style={{ flex:2,background:C.accent,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit" }} onClick={()=>{
              const txt="🏆 Minha semana no GymAI: 3 treinos, 2 PRs, 🔥 12 dias de sequência e +480 XP! #GymAI #Fitness";
              if(navigator.share){navigator.share({title:"Meu Resumo GymAI",text:txt}).catch(()=>{})}
              else{navigator.clipboard&&navigator.clipboard.writeText(txt).then(()=>alert("Resumo copiado! Cole onde quiser 📋"));}
            }}>📤 Compartilhar resumo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SPRINT B — FEATURE 2: RELATÓRIO MENSAL PDF (Personal → Aluno) ───────────
const RelatorioMensalScreen = ({ setScreen }) => {
  const [gerado, setGerado] = useState(false);
  const [alunoSel, setAlunoSel] = useState("Lucas Mendes");
  const alunos = ALUNOS_TODOS.map(a=>a.name);
  const handleGerarPDF = () => {
    setGerado(true);
    setTimeout(()=>{
      const el = document.getElementById("relatorio-preview");
      if(!el) return;
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Relatório GymAI — ${alunoSel}</title><style>*{box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fff;color:#111;padding:40px;max-width:720px;margin:0 auto}h1,h2{margin:0 0 8px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}.badge{display:inline-block;padding:2px 8px;border-radius:12px;background:#e8f5e9;color:#2e7d32;font-size:11px;font-weight:700}.bar-wrap{background:#eee;border-radius:4px;height:8px}.bar-fill{background:#6abf1e;height:8px;border-radius:4px}@media print{body{padding:20px}}</style></head><body>${el.innerHTML}</body></html>`;
      const blob = new Blob([html], {type:"text/html"});
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `GymAI_Relatorio_${alunoSel.replace(/ /g,"_")}.html`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),3000);
    },150);
  };
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <button onClick={() => setScreen("personalDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>Personal — Dr. Paulo Ferreira</div>
        <h1 style={s.h1}>Relatório Mensal</h1>
        <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>Gere e entregue o relatório mensal de evolução ao aluno</div>
      </div>
      <div style={s.card}>
        <h3 style={{ ...s.h3,marginBottom:12 }}>Configurar Relatório</h3>
        <div style={{ ...s.lbl,marginBottom:6 }}>Selecionar Aluno</div>
        <select value={alunoSel} onChange={e=>setAlunoSel(e.target.value)} style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontFamily:"inherit",fontSize:13,marginBottom:16 }}>
          {alunos.map(a=><option key={a}>{a}</option>)}
        </select>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={() => setGerado(true)} style={{ ...btn(C.blue,true),flex:1 }}>👁 Preview</button>
          <button onClick={handleGerarPDF} style={{ ...btn(C.accent),flex:1 }}>⬇ Gerar PDF</button>
        </div>
      </div>
      {gerado && (
        <div id="relatorio-preview" style={{ ...s.card,padding:28 }}>
          <div style={{ borderBottom:`2px solid ${C.accent}`,paddingBottom:16,marginBottom:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
              <div><div style={{ fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"1px" }}>GymAI · Relatório Mensal</div><h2 style={{ ...s.h2,marginTop:4,fontSize:22 }}>{alunoSel}</h2><div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Personal: Dr. Paulo Ferreira · Maio 2026</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontSize:28,fontWeight:800,color:C.accent }}>87</div><div style={{ fontSize:11,color:C.muted }}>treinos no mês</div></div>
            </div>
          </div>
          <div className="rg3" style={{display:"grid",gap:12,marginBottom:20}}>
            {[{l:"Frequência",v:"4.2x/semana",c:C.accent},{l:"Volume médio",v:"8.240kg/treino",c:C.blue},{l:"Tempo médio",v:"62 min",c:C.purple}].map(({l,v,c})=>(
              <div key={l} style={{ padding:14,background:C.surface,borderRadius:10,textAlign:"center" }}><div style={{ fontSize:18,fontWeight:800,color:c }}>{v}</div><div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{l}</div></div>
            ))}
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ ...s.lbl,marginBottom:12 }}>Evolução de Carga — Principais Exercícios</div>
            {[{ex:"Supino Reto",ini:70,fim:80,delta:"+10kg"},{ex:"Rosca Direta",ini:4,fim:6,delta:"+2kg"},{ex:"Leg Press",ini:100,fim:120,delta:"+20kg"},{ex:"Desenvolvimento",ini:16,fim:20,delta:"+4kg"}].map(({ex,ini,fim,delta})=>(
              <div key={ex} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4 }}><span style={{ fontWeight:600 }}>{ex}</span><span style={{ color:C.accent,fontWeight:700 }}>{delta}</span></div>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:11,color:C.muted,width:40,textAlign:"right" }}>{ini}kg</span>
                  <div style={{ flex:1,height:8,background:C.border,borderRadius:4,overflow:"hidden" }}><div style={{ height:"100%",width:`${(fim/fim)*100}%`,background:`linear-gradient(90deg,${C.blue},${C.accent})`,borderRadius:4 }}/></div>
                  <span style={{ fontSize:14,fontWeight:800,color:C.accent,width:40 }}>{fim}kg</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:14,background:`${C.blue}10`,border:`1px solid ${C.blue}30`,borderRadius:10,marginBottom:16 }}>
            <div style={{ fontWeight:700,color:C.blue,marginBottom:8 }}>📝 Observações do Personal</div>
            <div style={{ fontSize:13,color:C.muted,lineHeight:1.6 }}>{alunoSel.split(" ")[0]} demonstrou ótima evolução no mês. Recomendo aumentar volume de costas nas próximas semanas. Manter sequência e priorizar descanso nos finais de semana.</div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ fontSize:11,color:C.muted }}>Gerado em {new Date().toLocaleDateString("pt-BR")} pelo GymAI v2.6</div>
            <button style={{ ...btn(C.accent),fontSize:12,padding:"6px 16px" }} onClick={handleGerarPDF}>📥 Baixar PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SPRINT B — FEATURE 3: PACOTE DE TREINOS VENDÁVEL ────────────────────────
const PACOTES_TREINO = [
  { id:"p1", nome:"Programa 12 Semanas — Hipertrofia Total", personal:"Dr. Paulo Ferreira", preco:89.90, semanas:12, treinos:48, nivel:"Intermediário", descricao:"Programa completo de hipertrofia com periodização, deload programado e sobrecarga progressiva. Inclui 4 dias/semana de treino.", split:"80% personal · 20% GymAI", tags:["Hipertrofia","Periodização","12 Semanas"], vendas:34, avaliacao:4.9, cor:C.accent },
  { id:"p2", nome:"Shape Verão — 8 Semanas", personal:"Dr. Paulo Ferreira", preco:59.90, semanas:8, treinos:32, nivel:"Iniciante", descricao:"Combinação de musculação e cardio para definição. Ideal para quem quer resultados rápidos e visíveis.", split:"80% personal · 20% GymAI", tags:["Definição","Cardio","8 Semanas"], vendas:18, avaliacao:4.7, cor:C.blue },
  { id:"p3", nome:"Força Máxima — Powerlifting Base", personal:"Dr. Paulo Ferreira", preco:79.90, semanas:10, treinos:30, nivel:"Avançado", descricao:"Programa focado em força nos 3 levantamentos básicos: agachamento, supino e terra. Para atletas sérios.", split:"80% personal · 20% GymAI", tags:["Força","Powerlifting","Avançado"], vendas:9, avaliacao:5.0, cor:C.purple },
];

const PacotesTreinoScreen = ({ setScreen, isPersonal }) => {
  const [criando, setCriando] = useState(false);
  const [comprando, setComprando] = useState(null);
  const [comprados, setComprados] = useState(["p2"]);
  const [novoP, setNovoP] = useState({ nome:"",preco:"",semanas:"12",descricao:"" });

  const StarRating = ({ val }) => <span style={{ color:"#FFD700",fontSize:12 }}>{"★".repeat(Math.round(val))}{"☆".repeat(5-Math.round(val))} <span style={{ color:C.muted,fontSize:11 }}>({val})</span></span>;

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <button onClick={() => setScreen(isPersonal?"personalDash":"alunoDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>{isPersonal?"Personal — Dr. Paulo Ferreira":"Aluno — Lucas Mendes"}</div>
        <h1 style={s.h1}>{isPersonal?"Meus Pacotes de Treino":"Vitrine de Programas"}</h1>
        <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>{isPersonal?"Crie e venda programas de treinamento":"Compre programas criados por profissionais certificados"}</div>
      </div>
      {isPersonal && (
        <div style={{ ...s.card,background:`${C.accent}08`,borderColor:`${C.accent}40` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
            <div>
              <div style={{ fontWeight:700,color:C.accent,fontSize:15 }}>💰 Receita com Pacotes</div>
              <div style={{ fontSize:24,fontWeight:800,marginTop:4 }}>R$ {(PACOTES_TREINO.reduce((a,p)=>a+p.vendas*p.preco*0.8,0)).toLocaleString("pt-BR",{minimumFractionDigits:2})} <span style={{ fontSize:13,color:C.muted,fontWeight:400 }}>acumulado</span></div>
              <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Split 80% para você · 20% GymAI</div>
            </div>
            <button onClick={() => setCriando(true)} style={btn(C.accent)}>+ Novo Pacote</button>
          </div>
        </div>
      )}
      {isPersonal && criando && (
        <div style={{ ...s.card,borderLeft:`4px solid ${C.accent}` }}>
          <h3 style={{ ...s.h3,marginBottom:16 }}>Novo Pacote de Treino</h3>
          {[{l:"Nome do programa",k:"nome",ph:"Ex: Hipertrofia Total 12 Semanas"},{l:"Descrição",k:"descricao",ph:"O que o aluno vai conquistar?"},{l:"Preço (R$)",k:"preco",ph:"89.90"},{l:"Semanas",k:"semanas",ph:"12"}].map(({l,k,ph})=>(
            <div key={k} style={{ marginBottom:14 }}>
              <div style={{ ...s.lbl,marginBottom:6 }}>{l}</div>
              <input value={novoP[k]} onChange={e=>setNovoP(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontFamily:"inherit",fontSize:13,boxSizing:"border-box" }}/>
            </div>
          ))}
          <div style={{ padding:12,background:`${C.blue}10`,border:`1px solid ${C.blue}30`,borderRadius:8,marginBottom:16,fontSize:12,color:C.blue }}>💡 Split de receita: <strong>80% para você</strong> (R${(+(novoP.preco||0)*0.8).toFixed(2)}) + 20% GymAI (R${(+(novoP.preco||0)*0.2).toFixed(2)})</div>
          <div style={{ display:"flex",gap:10 }}><button onClick={()=>setCriando(false)} style={btn(C.accent)}>✓ Publicar Pacote</button><button onClick={()=>setCriando(false)} style={btn(C.muted,true)}>Cancelar</button></div>
        </div>
      )}
      {comprando && (
        <Modal onClose={()=>setComprando(null)} title="Confirmar Compra">
          <div style={{ textAlign:"center",padding:20 }}>
            <div style={{ fontSize:40,marginBottom:12 }}>🛒</div>
            <h2 style={{ ...s.h2,marginBottom:8 }}>{comprando.nome}</h2>
            <div style={{ fontSize:13,color:C.muted,marginBottom:20 }}>por {comprando.personal}</div>
            <div style={{ fontSize:32,fontWeight:800,color:C.accent,marginBottom:8 }}>R$ {comprando.preco.toFixed(2)}</div>
            <div style={{ fontSize:12,color:C.muted,marginBottom:24 }}>{comprando.semanas} semanas · {comprando.treinos} treinos</div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setComprando(null)} style={{ ...btn(C.muted,true),flex:1 }}>Cancelar</button>
              <button onClick={()=>{ setComprados(p=>[...p,comprando.id]); setComprando(null); }} style={{ ...btn(C.accent),flex:2 }}>✓ Confirmar Compra</button>
            </div>
          </div>
        </Modal>
      )}
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {PACOTES_TREINO.map(p => {
          const possuido = comprados.includes(p.id);
          return (
            <div key={p.id} style={{ ...s.card,padding:20,borderLeft:`4px solid ${p.cor}` }}>
              <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:8 }}>{p.tags.map(t=><span key={t} style={tag(p.cor)}>{t}</span>)}</div>
                  <div style={{ fontWeight:800,fontSize:16 }}>{p.nome}</div>
                  <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>por {p.personal}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:26,fontWeight:800,color:p.cor }}>R$ {p.preco.toFixed(2)}</div>
                  <div style={{ fontSize:11,color:C.muted }}>{p.split}</div>
                </div>
              </div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:14 }}>{p.descricao}</div>
              <div style={{ display:"flex",gap:16,marginBottom:14,flexWrap:"wrap" }}>
                {[{v:`${p.semanas} semanas`,c:C.blue},{v:`${p.treinos} treinos`,c:C.accent},{v:p.nivel,c:p.cor}].map(({v,c})=>(
                  <div key={v} style={{ textAlign:"center",padding:"8px 14px",background:C.surface,borderRadius:8 }}><div style={{ fontSize:13,fontWeight:700,color:c }}>{v}</div></div>
                ))}
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <StarRating val={p.avaliacao}/>
                  <span style={{ fontSize:11,color:C.muted }}>{p.vendas} vendas</span>
                </div>
                {!isPersonal && (possuido
                  ? <button style={{ ...btn(C.accent),fontSize:12 }}>✓ Programa adquirido</button>
                  : <button onClick={()=>setComprando(p)} style={{ ...btn(p.cor),fontSize:12 }}>Comprar →</button>
                )}
                {isPersonal && (
                  <div style={{ display:"flex",gap:8 }}>
                    <div style={{ textAlign:"center" }}><div style={{ fontSize:18,fontWeight:800,color:C.accent }}>{p.vendas}</div><div style={{ fontSize:10,color:C.muted }}>vendas</div></div>
                    <div style={{ textAlign:"center" }}><div style={{ fontSize:18,fontWeight:800,color:C.blue }}>R${(p.vendas*p.preco*0.8).toFixed(0)}</div><div style={{ fontSize:10,color:C.muted }}>receita</div></div>
                    <button style={{ ...btn(C.muted,true),fontSize:11,padding:"5px 10px" }}>Editar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SPRINT B — FEATURE 4: LINK DE CONVITE PERSONALIZADO ─────────────────────
const LinkConviteScreen = ({ setScreen }) => {
  const link = "gymAI.app/paulo";
  const [copiado, setCopiado] = useState(false);
  const copiar = () => { setCopiado(true); setTimeout(()=>setCopiado(false),2000); };
  const stats = [{ label:"Cliques no link",val:247,color:C.blue,icon:"👆" },{ label:"Cadastros",val:38,color:C.accent,icon:"✅" },{ label:"Conversões",val:12,color:C.purple,icon:"💰" },{ label:"Taxa conv.",val:"31%",color:C.orange,icon:"📈" }];
  // QR Code SVG simulado com padrão real de módulos
  const QRCode = () => {
    const size = 29;
    const pattern = [];
    for(let r=0;r<size;r++) for(let c=0;c<size;c++){
      const finder=((r<7&&c<7)||(r<7&&c>size-8)||(r>size-8&&c<7));
      const timing=(!finder&&(r===6||c===6));
      const data=(!finder&&!timing&&Math.random()>0.45);
      if(finder||timing||data) pattern.push([r,c]);
    }
    return (
      <svg viewBox={`0 0 ${size} ${size}`} width={160} height={160} style={{ background:"#fff",padding:8,borderRadius:12 }}>
        {pattern.map(([r,c])=><rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111"/>)}
        {/* Finder pattern corners */}
        {[[0,0],[0,size-7],[size-7,0]].map(([ry,cx],i)=>(
          <g key={i}>
            <rect x={cx} y={ry} width={7} height={7} fill="#111"/>
            <rect x={cx+1} y={ry+1} width={5} height={5} fill="#fff"/>
            <rect x={cx+2} y={ry+2} width={3} height={3} fill="#111"/>
          </g>
        ))}
      </svg>
    );
  };
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <button onClick={() => setScreen("personalDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>Personal — Dr. Paulo Ferreira</div>
        <h1 style={s.h1}>Link de Convite</h1>
      </div>
      <div style={{ ...s.card,background:`${C.purple}08`,borderColor:`${C.purple}40`,padding:24,textAlign:"center" }}>
        <div style={{ fontSize:13,color:C.muted,marginBottom:8 }}>Seu link exclusivo</div>
        <div style={{ fontSize:22,fontWeight:800,color:C.purple,fontFamily:"monospace",letterSpacing:"0.5px",marginBottom:16 }}>{link}</div>
        <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
          <button onClick={copiar} style={{ ...btn(copiado?C.accent:C.purple) }}>{copiado?"✓ Copiado!":"📋 Copiar link"}</button>
          <button style={{ ...btn(C.muted,true) }}>📤 Compartilhar</button>
        </div>
      </div>
      <div style={{ ...s.card,display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:24 }}>
        <div style={{ fontSize:13,fontWeight:700,color:C.muted }}>QR Code do seu perfil</div>
        <QRCode />
        <div style={{ fontSize:12,color:C.muted,textAlign:"center" }}>Mostre na academia ou compartilhe nas redes sociais</div>
        <button style={{ ...btn(C.blue,true),fontSize:12 }}>⬇ Baixar QR Code</button>
      </div>
      <div className="rg2" style={{display:"grid",gap:12}}>
        {stats.map(st=>(
          <div key={st.label} style={{ ...s.card,textAlign:"center",padding:18 }}>
            <div style={{ fontSize:24,marginBottom:4 }}>{st.icon}</div>
            <div style={{ fontSize:24,fontWeight:800,color:st.color }}>{st.val}</div>
            <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>{st.label}</div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={{ ...s.h3,marginBottom:14 }}>Últimas conversões</h3>
        {[{nome:"Mariana F.",data:"27/05",via:"Instagram"},{nome:"João P.",data:"24/05",via:"Link direto"},{nome:"Sofia A.",data:"20/05",via:"WhatsApp"}].map((c,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:`${C.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800 }}>{c.nome[0]}</div>
              <div><div style={{ fontWeight:600,fontSize:13 }}>{c.nome}</div><div style={{ fontSize:11,color:C.muted }}>via {c.via}</div></div>
            </div>
            <div style={{ textAlign:"right" }}><Badge text="Convertido" color={C.accent}/><div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{c.data}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SPRINT B — FEATURE 5: QR CODE POR EQUIPAMENTO ───────────────────────────
const QREquipModal = ({ equip, onClose, onScanSuccess }) => {
  const [fase, setFase] = useState("qr"); // qr | scanning | done
  const QRMini = ({ id }) => {
    const hash = id.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
    const cells = Array.from({length:25},(_,i)=>((i*7+hash)%3===0));
    return (
      <svg viewBox="0 0 25 25" width={140} height={140} style={{ background:"#fff",padding:8,borderRadius:10 }}>
        {cells.map((on,i)=>on&&<rect key={i} x={i%5*5} y={Math.floor(i/5)*5} width={4.5} height={4.5} fill="#111" rx={0.5}/>)}
        {[[0,0],[0,20],[20,0]].map(([ry,cx],i)=><g key={i}><rect x={cx} y={ry} width={5} height={5} fill="#111" rx={0.5}/><rect x={cx+1} y={ry+1} width={3} height={3} fill="#fff"/><rect x={cx+1.5} y={ry+1.5} width={2} height={2} fill="#111" rx={0.3}/></g>)}
      </svg>
    );
  };
  return (
    <Modal onClose={onClose} title={fase==="done"?"✅ Equipamento Identificado!":"📷 QR do Equipamento"}>
      {fase==="qr"&&(
        <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
          <div style={{ fontSize:13,color:C.muted }}>QR Code do equipamento na academia</div>
          <div style={{ ...s.card,padding:20,display:"inline-block" }}><QRMini id={equip.id}/><div style={{ marginTop:10,fontWeight:700,fontSize:14 }}>{equip.name}</div><div style={{ fontSize:11,color:C.muted }}>{equip.tipo}</div></div>
          <button onClick={()=>setFase("scanning")} style={{ ...btn(C.blue),width:"100%" }}>📷 Simular Scan de Equipamento</button>
        </div>
      )}
      {fase==="scanning"&&(
        <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
          <div style={{ width:200,height:200,borderRadius:16,background:`${C.surface}`,border:`2px dashed ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:C.accent,animation:"scan 1.5s linear infinite",boxShadow:`0 0 8px ${C.accent}` }}/>
            <div style={{ fontSize:40 }}>📷</div>
          </div>
          <div style={{ fontSize:13,color:C.muted }}>Escaneando QR Code...</div>
          <button onClick={()=>{ setFase("done"); setTimeout(()=>{ onScanSuccess&&onScanSuccess(equip); },300); }} style={{ ...btn(C.accent),width:"100%" }}>✓ Confirmar leitura (simulado)</button>
          <style>{`@keyframes scan{0%{top:0}50%{top:calc(100% - 3px)}100%{top:0}}`}</style>
        </div>
      )}
      {fase==="done"&&(
        <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
          <div style={{ fontSize:52 }}>✅</div>
          <div style={{ fontWeight:800,fontSize:18 }}>{equip.name}</div>
          <div style={{ fontSize:13,color:C.muted }}>Equipamento identificado! Exercícios disponíveis:</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center" }}>{equip.muscles.map(m=><span key={m} style={tag(C.accent)}>{m}</span>)}</div>
          <button onClick={onClose} style={{ ...btn(C.accent),width:"100%" }}>Iniciar treino neste equipamento →</button>
        </div>
      )}
    </Modal>
  );
};

// ─── SPRINT B — FEATURE 6: RANKING DE FREQUÊNCIA ─────────────────────────────
const RankingFrequenciaScreen = ({ setScreen, isAcademia }) => {
  const ranking = [
    { pos:1, nome:"Ana S.",     streak:7, treinos:7, voce:false, avatar:"A" },
    { pos:2, nome:"Fernanda L.",streak:6, treinos:6, voce:false, avatar:"F" },
    { pos:3, nome:"Diego M.",   streak:6, treinos:6, voce:false, avatar:"D" },
    { pos:4, nome:"Rafael C.",  streak:5, treinos:5, voce:false, avatar:"R" },
    { pos:5, nome:"Você",       streak:5, treinos:5, voce:true,  avatar:"L" },
    { pos:6, nome:"Patricia N.",streak:5, treinos:4, voce:false, avatar:"P" },
    { pos:7, nome:"Aluno ****", streak:4, treinos:4, voce:false, avatar:"?" },
    { pos:8, nome:"Aluno ****", streak:3, treinos:4, voce:false, avatar:"?" },
    { pos:9, nome:"Bruno A.",   streak:3, treinos:3, voce:false, avatar:"B" },
    { pos:10,nome:"Aluno ****", streak:2, treinos:3, voce:false, avatar:"?" },
  ];
  const medalColors = ["#FFD700","#C0C0C0","#CD7F32"];
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <button onClick={() => setScreen(isAcademia?"academiaDash":"alunoDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <h1 style={s.h1}>🏆 Ranking de Frequência</h1>
        <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>FitZone Campinas · Semana de 26/05 – 01/06</div>
      </div>
      {!isAcademia && (
        <div style={{ ...s.card,background:`${C.accent}10`,borderColor:`${C.accent}40`,padding:20,textAlign:"center" }}>
          <div style={{ fontSize:13,color:C.muted,marginBottom:4 }}>Sua posição esta semana</div>
          <div style={{ fontSize:48,fontWeight:800,color:C.accent }}>#5</div>
          <div style={{ fontSize:13,color:C.muted }}>Você está entre os <strong style={{ color:C.accent }}>top 10</strong> da FitZone esta semana!</div>
          <div style={{ display:"flex",gap:12,justifyContent:"center",marginTop:12 }}>
            <div><div style={{ fontSize:20,fontWeight:800,color:C.orange }}>🔥 5</div><div style={{ fontSize:11,color:C.muted }}>sequência</div></div>
            <div><div style={{ fontSize:20,fontWeight:800,color:C.blue }}>5</div><div style={{ fontSize:11,color:C.muted }}>treinos/sem</div></div>
          </div>
        </div>
      )}
      <div style={s.card}>
        {isAcademia && <h3 style={{ ...s.h3,marginBottom:16 }}>Top 10 — Semana</h3>}
        {ranking.map((r,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 8px",borderBottom:`1px solid ${C.border}`,background:r.voce?`${C.accent}08`:"transparent",borderRadius:r.voce?10:0,border:r.voce?`1px solid ${C.accent}30`:"none" }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:i<3?`${medalColors[i]}22`:`${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:i<3?16:13,color:i<3?medalColors[i]:C.muted,flexShrink:0 }}>
              {i<3?["🥇","🥈","🥉"][i]:r.pos}
            </div>
            <div style={{ width:36,height:36,borderRadius:"50%",background:r.voce?`${C.accent}25`:`${C.surface}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,border:`2px solid ${r.voce?C.accent:C.border}`,color:r.voce?C.accent:C.text,flexShrink:0 }}>{r.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:r.voce?800:600,fontSize:14,color:r.voce?C.accent:C.text }}>{r.nome}{r.voce&&" (você)"}</div>
              <div style={{ fontSize:11,color:C.muted }}>🔥 {r.streak} dias seguidos</div>
            </div>
            <div style={{ textAlign:"right",flexShrink:0 }}>
              <div style={{ fontSize:18,fontWeight:800,color:r.voce?C.accent:C.text }}>{r.treinos}</div>
              <div style={{ fontSize:10,color:C.muted }}>treinos</div>
            </div>
          </div>
        ))}
      </div>
      {isAcademia && (
        <div className="rg2" style={{display:"grid",gap:12}}>
          {[{l:"Check-ins hoje",v:34,c:C.accent},{l:"Total esta semana",v:187,c:C.blue},{l:"Pico hoje",v:"19h",c:C.purple},{l:"Alunos únicos",v:62,c:C.orange}].map(({l,v,c})=>(
            <div key={l} style={{ ...s.card,textAlign:"center",padding:18 }}><div style={{ fontSize:24,fontWeight:800,color:c }}>{v}</div><div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{l}</div></div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SPRINT B — FEATURE 7: HORÁRIOS DE PICO (HEATMAP) ────────────────────────
const HorariosScreen = ({ setScreen, isAcademia }) => {
  const dias = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  const horas = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
  // Mock: intensidade por hora/dia (0-5)
  const heat = {
    "Seg":{6:1,7:3,8:4,9:2,10:1,11:1,12:3,13:1,14:1,15:2,16:2,17:3,18:5,19:5,20:4,21:2,22:1},
    "Ter":{6:1,7:2,8:3,9:2,10:1,11:1,12:2,13:1,14:1,15:1,16:2,17:4,18:5,19:5,20:3,21:2,22:1},
    "Qua":{6:2,7:3,8:4,9:2,10:1,11:1,12:2,13:1,14:2,15:2,16:3,17:3,18:4,19:5,20:4,21:2,22:1},
    "Qui":{6:1,7:2,8:3,9:1,10:1,11:1,12:2,13:1,14:1,15:1,16:2,17:3,18:5,19:5,20:3,21:2,22:1},
    "Sex":{6:1,7:2,8:3,9:2,10:1,11:1,12:3,13:1,14:1,15:1,16:2,17:4,18:5,19:4,20:3,21:1,22:1},
    "Sáb":{6:2,7:4,8:5,9:4,10:3,11:2,12:2,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,21:0,22:0},
    "Dom":{6:1,7:2,8:3,9:2,10:1,11:1,12:1,13:0,14:0,15:0,16:0,17:0,18:0,19:1,20:1,21:0,22:0},
  };
  const heatColor = (v) => v===0?"#1C1C28":v===1?`${C.border}`:`hsl(${82-v*8},${v*18+20}%,${v*10+15}%)`;
  const horarioVazio = "8h–11h (Sáb) ou 14h–16h qualquer dia";
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <button onClick={() => setScreen(isAcademia?"academiaDash":"alunoDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <h1 style={s.h1}>⏰ Horários de Pico</h1>
        <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>FitZone Campinas · Mapa de calor semanal</div>
      </div>
      {!isAcademia && (
        <div style={{ ...s.card,background:`${C.teal}10`,borderColor:`${C.teal}30`,padding:16 }}>
          <div style={{ fontWeight:700,color:C.teal,marginBottom:4 }}>💡 Melhor horário para você hoje</div>
          <div style={{ fontSize:13,color:C.muted,lineHeight:1.6 }}>Academia mais vazia: <strong style={{ color:C.text }}>{horarioVazio}</strong>. Evite 18h–20h (dias úteis) quando a ocupação chega a 90%.</div>
        </div>
      )}
      <div style={{ ...s.card,overflowX:"auto" }}>
        <h3 style={{ ...s.h3,marginBottom:16 }}>Mapa de calor — Ocupação por horário</h3>
        <div style={{ minWidth:500 }}>
          <div style={{ display:"flex",gap:4,marginBottom:4,paddingLeft:38 }}>
            {dias.map(d=><div key={d} style={{ flex:1,textAlign:"center",fontSize:11,fontWeight:700,color:C.muted }}>{d}</div>)}
          </div>
          {horas.map(h=>(
            <div key={h} style={{ display:"flex",gap:4,marginBottom:4,alignItems:"center" }}>
              <div style={{ width:34,fontSize:10,color:C.muted,textAlign:"right",flexShrink:0 }}>{h}h</div>
              {dias.map(d=>{
                const v=heat[d]?.[h]??0;
                const pct=v===0?0:v===1?15:v===2?35:v===3?55:v===4?78:98;
                return (
                  <div key={d} title={`${d} ${h}h — ${pct===0?"Fechado":pct<30?"Vazio":pct<60?"Moderado":pct<85?"Cheio":"Lotado"}`} style={{ flex:1,height:24,borderRadius:4,background:heatColor(v),display:"flex",alignItems:"center",justifyContent:"center",cursor:"default",transition:"all 0.1s" }}>
                    {v>=4&&<div style={{ fontSize:8,color:"rgba(255,255,255,0.6)",fontWeight:700 }}>{pct}%</div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:12,flexWrap:"wrap" }}>
          <span style={{ fontSize:11,color:C.muted }}>Ocupação:</span>
          {[["Vazio",1],["Moderado",2],["Cheio",3],["Lotado",5]].map(([l,v])=>(
            <div key={l} style={{ display:"flex",alignItems:"center",gap:4 }}>
              <div style={{ width:14,height:14,borderRadius:3,background:heatColor(v) }}/>
              <span style={{ fontSize:10,color:C.muted }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      {isAcademia && (
        <div style={s.card}>
          <h3 style={{ ...s.h3,marginBottom:14 }}>Check-ins por hora — hoje</h3>
          <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:80 }}>
            {horas.map(h=>{
              const v=heat["Ter"]?.[h]??0;
              const hgt=(v/5)*70;
              return (
                <div key={h} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                  <div style={{ height:hgt,width:"100%",background:v>=4?C.red:v>=2?C.orange:C.accent,borderRadius:"3px 3px 0 0",minHeight:v>0?4:0 }}/>
                  <div style={{ fontSize:8,color:C.muted }}>{h}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SPRINT B — FEATURE 8: VITRINE DE PERSONAIS ───────────────────────────────
const VitrinPersonaisScreen = ({ setScreen }) => {
  const [contratando, setContratando] = useState(null);
  const [filtroEspec, setFiltroEspec] = useState("Todos");
  const [filtroDisp, setFiltroDisp] = useState(false);
  const [filtroPreco, setFiltroPreco] = useState("Todos");
  const especialidades = ["Todos","Hipertrofia & Força","Emagrecimento & Funcional","Powerlifting & Performance","Reabilitação & Pilates"];
  const personais = [
    { id:"p1",nome:"Dr. Paulo Ferreira",spec:"Hipertrofia & Força",preco:349,avaliacao:4.9,alunos:12,foto:"P",cor:C.purple,bio:"Especialista em musculação com 8 anos de experiência. CREF 012345-G. Programas personalizados e acompanhamento via app.",disponivel:true },
    { id:"p2",nome:"Prof. Camila Rocha",spec:"Emagrecimento & Funcional",preco:279,avaliacao:4.8,alunos:18,foto:"C",cor:C.teal,bio:"Foco em transformação corporal e qualidade de vida. Especialista em funcional e HIIT. CREF 054321-G.",disponivel:true },
    { id:"p3",nome:"Prof. Marcos Silva",spec:"Powerlifting & Performance",preco:419,avaliacao:5.0,alunos:6,foto:"M",cor:C.orange,bio:"Competidor de powerlifting e coach de performance. 12 anos de experiência em força máxima. CREF 067890-G.",disponivel:false },
    { id:"p4",nome:"Dra. Luana Torres",spec:"Reabilitação & Pilates",preco:299,avaliacao:4.7,alunos:22,foto:"L",cor:C.blue,bio:"Fisioterapeuta e personal trainer. Especialista em reabilitação esportiva e pilates clínico. CREF 089012-G.",disponivel:true },
  ];
  const filtrados = personais
    .filter(p => filtroEspec==="Todos" || p.spec===filtroEspec)
    .filter(p => !filtroDisp || p.disponivel)
    .filter(p => filtroPreco==="Todos" || (filtroPreco==="Até R$300" && p.preco<=300) || (filtroPreco==="R$300–400" && p.preco>300&&p.preco<=400) || (filtroPreco==="Acima R$400" && p.preco>400));
  const StarRating = ({ val }) => <span style={{ color:"#FFD700",fontSize:12 }}>{"★".repeat(Math.round(val))}</span>;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div>
        <button onClick={() => setScreen("alunoDash")} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0,marginBottom:8 }}>← Voltar</button>
        <div style={s.lbl}>Aluno — Lucas Mendes</div>
        <h1 style={s.h1}>Encontrar Personal</h1>
        <div style={{ fontSize:13,color:C.muted,marginTop:4 }}>Personais certificados na sua região</div>
      </div>
      {/* Filtros */}
      <div style={{ ...s.card, padding:16 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ ...s.lbl, marginBottom:6 }}>Especialidade</div>
            <select value={filtroEspec} onChange={e=>setFiltroEspec(e.target.value)} style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.text,fontFamily:"inherit",fontSize:12 }}>
              {especialidades.map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
          <div style={{ flex:1, minWidth:140 }}>
            <div style={{ ...s.lbl, marginBottom:6 }}>Faixa de preço</div>
            <select value={filtroPreco} onChange={e=>setFiltroPreco(e.target.value)} style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.text,fontFamily:"inherit",fontSize:12 }}>
              {["Todos","Até R$300","R$300–400","Acima R$400"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div style={{ ...s.lbl, marginBottom:6 }}>Disponível agora</div>
            <button onClick={()=>setFiltroDisp(v=>!v)} style={{ ...btn(filtroDisp?C.teal:C.muted,!filtroDisp), fontSize:12, padding:"8px 16px" }}>
              {filtroDisp?"✓ Só disponíveis":"Todos"}
            </button>
          </div>
        </div>
        {filtrados.length < personais.length && (
          <div style={{ marginTop:10, fontSize:12, color:C.muted }}>{filtrados.length} personal{filtrados.length!==1?"s":""} encontrado{filtrados.length!==1?"s":""}</div>
        )}
      </div>
      {filtrados.length===0 && (
        <div style={{ ...s.card, textAlign:"center", padding:32, color:C.muted }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
          <div style={{ fontWeight:700, marginBottom:4 }}>Nenhum personal encontrado</div>
          <div style={{ fontSize:12 }}>Tente ajustar os filtros</div>
          <button onClick={()=>{setFiltroEspec("Todos");setFiltroDisp(false);setFiltroPreco("Todos");}} style={{ ...btn(C.accent,true),marginTop:12,fontSize:12 }}>Limpar filtros</button>
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {filtrados.map(p => (
          <div key={p.id} style={{ ...s.card,padding:20,opacity:p.disponivel?1:0.6 }}>
            <div style={{ display:"flex",gap:14,marginBottom:14,flexWrap:"wrap" }}>
              <div style={{ width:64,height:64,borderRadius:"50%",background:`${p.cor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,border:`3px solid ${p.cor}40`,flexShrink:0 }}>{p.foto}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8 }}>
                  <div>
                    <div style={{ fontWeight:800,fontSize:16 }}>{p.nome}</div>
                    <div style={{ fontSize:13,color:p.cor,fontWeight:600,marginTop:2 }}>{p.spec}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:20,fontWeight:800,color:p.disponivel?C.accent:C.muted }}>R$ {p.preco}<span style={{ fontSize:11,fontWeight:400,color:C.muted }}>/mês</span></div>
                    <div style={{ display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end" }}><StarRating val={p.avaliacao}/><span style={{ fontSize:11,color:C.muted }}>({p.avaliacao})</span></div>
                  </div>
                </div>
                <div style={{ fontSize:12,color:C.muted,marginTop:4 }}>{p.alunos} alunos ativos · {p.disponivel?"🟢 Aceitando alunos":"🔴 Lista de espera"}</div>
              </div>
            </div>
            <div style={{ fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:14,padding:12,background:C.surface,borderRadius:8 }}>{p.bio}</div>
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ ...btn(C.muted,true),flex:1,fontSize:12 }}>Ver perfil</button>
              {p.disponivel
                ? <button onClick={()=>setContratando(p)} style={{ ...btn(p.cor),flex:2,fontSize:12 }}>Contratar →</button>
                : <button style={{ ...btn(C.muted,true),flex:2,fontSize:12,cursor:"not-allowed" }}>Lista de espera</button>
              }
            </div>
          </div>
        ))}
      </div>
      {contratando && (
        <Modal onClose={()=>setContratando(null)} title="Contratar Personal">
          <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:10 }}>
            <div style={{ width:72,height:72,borderRadius:"50%",background:`${contratando.cor}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:800,border:`3px solid ${contratando.cor}50` }}>{contratando.foto}</div>
            <div><div style={{ fontSize:20,fontWeight:800 }}>{contratando.nome}</div><div style={{ fontSize:13,color:C.muted }}>{contratando.spec}</div></div>
            <div style={{ fontSize:28,fontWeight:800,color:contratando.cor }}>R$ {contratando.preco}<span style={{ fontSize:13,fontWeight:400,color:C.muted }}>/mês</span></div>
            <div style={{ fontSize:12,color:C.muted,lineHeight:1.6,textAlign:"center" }}>Ao contratar, você terá acesso imediato à plataforma GymAI com o personal e receberá um plano de treino personalizado em até 24h.</div>
            <div style={{ display:"flex",gap:10,width:"100%" }}>
              <button onClick={()=>setContratando(null)} style={{ ...btn(C.muted,true),flex:1 }}>Cancelar</button>
              <button onClick={()=>setContratando(null)} style={{ ...btn(contratando.cor),flex:2 }}>✓ Contratar agora</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── SPRINT B — FEATURE 9: DELOAD AUTOMÁTICO ─────────────────────────────────
const DeloadBanner = ({ onVerTreino, onDismiss }) => (
  <div style={{ ...s.card,background:`linear-gradient(135deg,${C.purple}18,${C.blue}12)`,borderColor:`${C.purple}40`,borderLeft:`4px solid ${C.purple}`,padding:18 }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
          <span style={{ fontSize:20 }}>🔄</span>
          <span style={{ fontWeight:800,fontSize:14,color:C.purple }}>Semana de Deload Recomendada</span>
        </div>
        <div style={{ fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:10 }}>
          Você treinou por <strong style={{ color:C.text }}>4 semanas consecutivas</strong> sem descanso programado. A IA recomenda uma semana de deload para maximizar recuperação e evitar overtraining.
        </div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          <Badge text="Redução 40-60% de carga" color={C.purple}/>
          <Badge text="Foco em mobilidade" color={C.blue}/>
          <Badge text="+23% ganho de força" color={C.accent}/>
        </div>
      </div>
      <button onClick={onDismiss} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:18,padding:0 }}>✕</button>
    </div>
    <div style={{ display:"flex",gap:8,marginTop:14 }}>
      <button onClick={onVerTreino} style={{ ...btn(C.purple),flex:1,fontSize:12 }}>⚡ Ver treino de deload</button>
      <button onClick={onDismiss} style={{ ...btn(C.muted,true),fontSize:12,padding:"8px 14px" }}>Ignorar</button>
    </div>
  </div>
);

const DeloadTreinoModal = ({ onClose }) => {
  const exercicios = [
    { nome:"Supino Reto",normalKg:80,deloadKg:48,reps:"12-15",series:3,obs:"Carga leve, foco em técnica" },
    { nome:"Puxada Frente",normalKg:60,deloadKg:36,reps:"12",series:3,obs:"Amplitude total, sem forçar" },
    { nome:"Agachamento",normalKg:60,deloadKg:36,reps:"15",series:3,obs:"Mobilidade e ativação" },
    { nome:"Desenvolvimento",normalKg:20,deloadKg:12,reps:"12",series:2,obs:"Ombros saudáveis" },
    { nome:"Prancha",normalKg:0,deloadKg:0,reps:"45s",series:3,obs:"Core suave" },
  ];
  return (
    <Modal onClose={onClose} title="🔄 Treino de Deload — Semana de Recuperação">
      <div style={{ padding:12,background:`${C.purple}10`,border:`1px solid ${C.purple}30`,borderRadius:10,marginBottom:20 }}>
        <div style={{ fontWeight:700,color:C.purple,marginBottom:4 }}>O que é Deload?</div>
        <div style={{ fontSize:12,color:C.muted,lineHeight:1.6 }}>Uma semana de treino com volume e intensidade reduzidos (40-60%). Permite que o sistema nervoso e os músculos recuperem completamente, resultando em ganhos superiores nas semanas seguintes.</div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {exercicios.map((ex,i)=>(
          <div key={i} style={{ ...s.card,padding:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:14 }}>{ex.nome}</div>
                <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>💡 {ex.obs}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  {ex.normalKg>0&&<span style={{ fontSize:11,color:C.muted,textDecoration:"line-through" }}>{ex.normalKg}kg</span>}
                  <span style={{ fontSize:18,fontWeight:800,color:C.purple }}>{ex.deloadKg>0?`${ex.deloadKg}kg`:"—"}</span>
                </div>
                <div style={{ fontSize:11,color:C.muted }}>{ex.series}×{ex.reps}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button style={{ ...btn(C.purple),width:"100%",marginTop:16 }} onClick={onClose}>Iniciar treino de deload →</button>
    </Modal>
  );
};

// ─── ADMIN: ESTRUTURA DA PLATAFORMA ──────────────────────────────────────────
const EstruturaDaPlataforma = () => {
  const [secao, setSecao] = useState("mapa");

  // ── helpers de layout ────────────────────────────────────────────────────
  const Secao = ({ titulo, sub, children, cor = C.accent }) => (
    <div style={{ marginBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{ height:3, width:28, background:cor, borderRadius:2, flexShrink:0 }}/>
        <div>
          <div style={{ fontWeight:800, fontSize:18, color:cor }}>{titulo}</div>
          {sub && <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );

  const Chip = ({ label, color = C.accent, size = 12 }) => (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:20, background:`${color}18`, color, fontSize:size, fontWeight:700, border:`1px solid ${color}30`, whiteSpace:"nowrap" }}>{label}</span>
  );

  const Seta = ({ label, color = C.muted }) => (
    <div style={{ display:"flex", alignItems:"center", gap:6, margin:"6px 0", paddingLeft:16 }}>
      <div style={{ width:16, height:1, background:color }}/>
      <div style={{ fontSize:11, color }}>{label}</div>
    </div>
  );

  // ── PERSONA CARD ─────────────────────────────────────────────────────────
  const PersonaCard = ({ icon, titulo, cor, descricao, features, metricas, dores, ganhos }) => (
    <div style={{ ...s.card, borderTop:`4px solid ${cor}`, padding:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ width:46, height:46, borderRadius:12, background:`${cor}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{icon}</div>
        <div>
          <div style={{ fontWeight:800, fontSize:16, color:cor }}>{titulo}</div>
          <div style={{ fontSize:12, color:C.muted }}>{descricao}</div>
        </div>
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Funcionalidades</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {features.map(f => <Chip key={f} label={f} color={cor}/>)}
      </div>
      <div className="rg2" style={{ display:"grid", gap:10 }}>
        <div style={{ padding:10, background:C.surface, borderRadius:8 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.red, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:6 }}>Dores que resolve</div>
          {dores.map(d => <div key={d} style={{ fontSize:11, color:C.muted, marginBottom:3 }}>• {d}</div>)}
        </div>
        <div style={{ padding:10, background:C.surface, borderRadius:8 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:6 }}>Ganhos gerados</div>
          {ganhos.map(g => <div key={g} style={{ fontSize:11, color:C.muted, marginBottom:3 }}>✓ {g}</div>)}
        </div>
      </div>
      {metricas && (
        <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
          {metricas.map(m => (
            <div key={m.l} style={{ textAlign:"center", padding:"8px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:18, fontWeight:800, color:cor }}>{m.v}</div>
              <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>{m.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── MAPA DO PRODUTO (diagrama SVG de fluxo) ───────────────────────────────
  const MapaDoProduto = () => {
    const nodes = [
      // camada 0 — entrada
      { id:"entrada", x:360, y:20, label:"Usuário entra no GymAI", w:200, h:36, cor:C.muted, tipo:"entrada" },
      // camada 1 — personas
      { id:"aluno", x:60, y:110, label:"🎓 Aluno", w:130, h:44, cor:C.accent, tipo:"persona" },
      { id:"personal", x:240, y:110, label:"🏅 Personal", w:130, h:44, cor:C.purple, tipo:"persona" },
      { id:"academia", x:420, y:110, label:"🏢 Academia", w:130, h:44, cor:C.blue, tipo:"persona" },
      { id:"admin", x:600, y:110, label:"⚙️ Admin", w:130, h:44, cor:C.orange, tipo:"persona" },
      // camada 2 — núcleos funcionais
      { id:"treino", x:40, y:230, label:"Treino & IA", w:120, h:36, cor:C.accent, tipo:"modulo" },
      { id:"gamif", x:180, y:230, label:"Gamificação", w:120, h:36, cor:C.orange, tipo:"modulo" },
      { id:"copilot", x:320, y:230, label:"Copiloto IA", w:120, h:36, cor:C.purple, tipo:"modulo" },
      { id:"equip", x:460, y:230, label:"Equipamentos", w:130, h:36, cor:C.blue, tipo:"modulo" },
      { id:"monetiz", x:610, y:230, label:"Monetização", w:130, h:36, cor:C.teal, tipo:"modulo" },
      // camada 3 — infra / dados
      { id:"ia_core", x:160, y:340, label:"Motor IA / Sobrecarga Progressiva", w:220, h:36, cor:C.accent, tipo:"infra" },
      { id:"dados", x:400, y:340, label:"Histórico & Analytics", w:190, h:36, cor:C.blue, tipo:"infra" },
      { id:"pagto", x:610, y:340, label:"Split de Pagamento", w:130, h:36, cor:C.teal, tipo:"infra" },
    ];
    const edges = [
      ["entrada","aluno"],["entrada","personal"],["entrada","academia"],["entrada","admin"],
      ["aluno","treino"],["aluno","gamif"],
      ["personal","copilot"],["personal","monetiz"],
      ["academia","equip"],
      ["treino","ia_core"],["gamif","ia_core"],["copilot","ia_core"],
      ["equip","dados"],["ia_core","dados"],
      ["monetiz","pagto"],
    ];
    const nodeMap = Object.fromEntries(nodes.map(n=>[n.id,n]));
    const tipoBg = { entrada:`${C.muted}22`, persona:"#1C1C28", modulo:"#13131A", infra:"#0A0A0F" };
    return (
      <div style={{ overflowX:"auto", overflowY:"hidden" }}>
        <svg viewBox="0 0 780 400" style={{ width:"100%", minWidth:580, height:"auto", display:"block" }}>
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.border}/>
            </marker>
          </defs>
          {/* edges */}
          {edges.map(([a,b],i) => {
            const na=nodeMap[a], nb=nodeMap[b];
            if(!na||!nb) return null;
            const x1=na.x+na.w/2, y1=na.y+na.h;
            const x2=nb.x+nb.w/2, y2=nb.y;
            const my=(y1+y2)/2;
            return <path key={i} d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`} fill="none" stroke={C.border} strokeWidth="1.5" markerEnd="url(#arr)" opacity="0.6"/>;
          })}
          {/* nodes */}
          {nodes.map(n => (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.tipo==="persona"?10:8} fill={tipoBg[n.tipo]||"#1C1C28"} stroke={n.cor} strokeWidth={n.tipo==="persona"?2:1} opacity="0.95"/>
              <text x={n.x+n.w/2} y={n.y+n.h/2+4} textAnchor="middle" fontSize={n.tipo==="persona"?13:11} fontWeight={n.tipo==="persona"?"800":"600"} fill={n.cor} fontFamily="DM Sans,system-ui,sans-serif">{n.label}</text>
              {n.tipo==="infra"&&<rect x={n.x} y={n.y} width={n.w} height={3} rx={2} fill={n.cor} opacity="0.8"/>}
            </g>
          ))}
          {/* labels das camadas */}
          {[{y:125,l:"PERSONAS",c:C.muted},{y:245,l:"MÓDULOS FUNCIONAIS",c:C.muted},{y:355,l:"INFRAESTRUTURA",c:C.muted}].map(({y,l,c})=>(
            <text key={l} x={6} y={y} fontSize={8} fill={c} fontWeight="700" letterSpacing="1" fontFamily="DM Sans,system-ui">{l}</text>
          ))}
        </svg>
      </div>
    );
  };

  // ── DADOS POR SEÇÃO ────────────────────────────────────────────────────────
  const PERSONAS_DATA = [
    {
      icon:"🎓", titulo:"Aluno", cor:C.accent,
      descricao:"Usuário final — consome e executa",
      features:["Dashboard semanal","Fazer Treino + IA","Histórico & Evolução","Conquistas / XP / Badges","Check-in de Humor","Anamnese 5 etapas","Ranking de Frequência","Horários de Pico","Vitrine de Personais","Programas (compra)","Resumo Semanal","Deload Automático","Avatar SVG","QR Scan de Equip."],
      dores:["Não sabe como progredir","Perde motivação fácil","Não tem acompanhamento","Esquece cargas anteriores"],
      ganhos:["Sobrecarga progressiva automática","Gamificação mantém consistência","Histórico completo de carga","Sugestões de IA personalizadas"],
      metricas:[{v:"87",l:"treinos/aluno"},{v:"12🔥",l:"streak recorde"},{v:"2 PRs",l:"por semana"}],
    },
    {
      icon:"🏅", titulo:"Personal Trainer", cor:C.purple,
      descricao:"Produtor de conteúdo — gera e vende",
      features:["Dashboard com Copiloto IA","Alertas de alunos","Associar Alunos","Cadastrar Treinos","Meus Badges","Pacotes Vendáveis","Relatório Mensal PDF","Link de Convite + QR","Meu Plano (Starter/Pro/Elite)","Split de receita 80/20"],
      dores:["Gestão manual de muitos alunos","Sem visibilidade de quem abandonou","Renda limitada à hora de trabalho","Sem ferramenta de vendas de programas"],
      ganhos:["IA avisa sobre alunos em risco","Renda passiva via programas","Link próprio para conversão","Relatórios profissionais automáticos"],
      metricas:[{v:"R$350",l:"ticket médio"},{v:"80%",l:"split receita"},{v:"12",l:"alunos/personal"}],
    },
    {
      icon:"🏢", titulo:"Academia", cor:C.blue,
      descricao:"Operacional — infraestrutura e dados",
      features:["Cadastro de Equipamentos","QR Code por Equipamento","Ranking de Frequência","Heatmap de Horários","Vínculo de Vídeos","Estatísticas de Check-in","Personais vinculados"],
      dores:["Desconhece horários ociosos","Equipamentos sem rastreabilidade","Não retém alunos digitalmente","Sem dados de uso da academia"],
      ganhos:["Heatmap real de ocupação","QR por equip. aumenta engajamento","Ranking motiva frequência","Analytics de retenção"],
      metricas:[{v:"43",l:"check-ins/dia"},{v:"287",l:"alunos ativos"},{v:"9",l:"equip. QR"}],
    },
    {
      icon:"⚙️", titulo:"Admin GymAI", cor:C.orange,
      descricao:"Plataforma — controle total",
      features:["Visão geral global","Biblioteca de Exercícios","Gestão de Academias","Planos & Receita (MRR)","Gestão de Planos de Personal","Notificação em massa","Estrutura da Plataforma"],
      dores:["Sem visão centralizada","Gestão manual de planos","Escala depende de ops manuais"],
      ganhos:["MRR em tempo real","Biblioteca global de exercícios","Controle total de acesso e planos"],
      metricas:[{v:"R$62k",l:"MRR"},{v:"1.243",l:"alunos"},{v:"38",l:"personais"}],
    },
  ];

  const MODULOS = [
    { icon:"⚡", nome:"Motor de IA / Sobrecarga Progressiva", cor:C.accent, desc:"Núcleo do produto. Calcula a carga ideal por exercício com base no histórico, humor do dia e metodologia selecionada. Sugere +0,5–2kg por sessão automaticamente.", componentes:["SobrecargazPanel","ExercisePanel","CheckInHumor","ResultadoIA","Metodologias (8 tipos)"], complexidade:"Alta", status:"Implementado" },
    { icon:"🏆", nome:"Gamificação & Engajamento", cor:C.orange, desc:"Sistema de XP, níveis, missões semanais, conquistas e badges do personal. Mantém o aluno voltando todos os dias. Maior driver de retenção.", componentes:["XPBanner","GamificacaoScreen","MissoesSemana","ConquistasCatálogo","BadgesPersonal"], complexidade:"Média", status:"Implementado" },
    { icon:"🤖", nome:"Copiloto IA do Personal", cor:C.purple, desc:"5 insights automáticos por aluno: estagnação, risco de abandono, PR batido, sugestão de deload, progresso. Analisa frequência, carga e engajamento.", componentes:["CopiloPanel","NotificacoesPanel","AlertasAlunos"], complexidade:"Média", status:"Implementado" },
    { icon:"📦", nome:"Monetização & Marketplace", cor:C.teal, desc:"Personais criam pacotes de treino (12 semanas), definem preço, publicam. Split automático 80/20. Aluno compra pelo app. Vitrine de personais para contratação mensal.", componentes:["PacotesTreinoScreen","VitrinPersonaisScreen","LinkConviteScreen","PlanoPersonalScreen"], complexidade:"Alta", status:"Implementado" },
    { icon:"📊", nome:"Histórico & Analytics", cor:C.blue, desc:"Rastreamento completo de cargas por exercício, evolução em gráficos, sessões recentes, volume calculado automaticamente.", componentes:["AlunoHistorico","LineChart","BarChart","HISTORICO_EXERCICIOS"], complexidade:"Média", status:"Implementado" },
    { icon:"🏢", nome:"Gestão de Academia", cor:C.blue, desc:"Cadastro de equipamentos com QR Code SVG, vinculação de vídeos, heatmap de horários, ranking de frequência por academia.", componentes:["AcademiaPanel","QREquipModal","HorariosScreen","RankingFrequenciaScreen"], complexidade:"Média", status:"Implementado" },
    { icon:"🎉", nome:"Resumo Semanal (Wrapped)", cor:C.orange, desc:"Card compartilhável estilo Spotify Wrapped. Volume total, PRs batidos, sequência, XP ganho. Estimula compartilhamento social.", componentes:["ResumoSemanalModal"], complexidade:"Baixa", status:"Implementado" },
    { icon:"🔄", nome:"Deload Automático", cor:C.purple, desc:"Detecta 4+ semanas seguidas e exibe banner inteligente com sugestão de semana de deload e treino adaptado automaticamente.", componentes:["DeloadBanner","DeloadTreinoModal"], complexidade:"Baixa", status:"Implementado" },
  ];

  const FLUXOS = [
    { titulo:"Jornada do Aluno — Primeira Semana", cor:C.accent, passos:[
      { n:"1", label:"Cadastro + Anamnese", desc:"5 etapas: dados pessoais, saúde, hábitos, objetivos, PAR-Q + IMC calculado" },
      { n:"2", label:"Personalização do Avatar", desc:"SVG customizável — pele, cabelo, roupa, corpo. Identidade visual no app" },
      { n:"3", label:"Check-in de Humor pré-treino", desc:"IA adapta intensidade: Cansado → -20% carga / No Pique → sobrecarga ativada" },
      { n:"4", label:"Treino gerado pela IA", desc:"Seleciona grupos musculares, metodologia e tempo. IA monta exercícios com kg do histórico" },
      { n:"5", label:"Execução com timer + séries", desc:"Séries individuais com kg/reps editáveis, timer de descanso, marcação de conclusão" },
      { n:"6", label:"XP + Missões desbloqueadas", desc:"Ganho de XP, progresso nas missões semanais, notificação de conquistas" },
    ]},
    { titulo:"Jornada do Personal — Monetização", cor:C.purple, passos:[
      { n:"1", label:"Assina plano (Pro ou Elite)", desc:"Starter grátis (10 alunos) → Pro R$49/mês → Elite R$99/mês (ilimitado)" },
      { n:"2", label:"Gera Link de Convite pessoal", desc:"gymAI.app/nome — QR Code SVG, tracking de cliques e conversões" },
      { n:"3", label:"Associa e cadastra treinos", desc:"Busca aluno por CPF/email, vincula, cria treinos personalizados" },
      { n:"4", label:"Copiloto IA monitora alunos", desc:"Alertas automáticos de abandono, estagnação, PR, deload — sem trabalho manual" },
      { n:"5", label:"Cria Pacote de 12 Semanas", desc:"Define preço, publica na vitrine. Split 80% personal / 20% GymAI" },
      { n:"6", label:"Gera Relatório Mensal PDF", desc:"Evolução de carga, frequência, metas — entrega profissional ao aluno" },
    ]},
  ];

  const OPORTUNIDADES = [
    { categoria:"Produto", cor:C.accent, icon:"🚀", items:[
      { titulo:"Nutrição & Macros", desc:"Calculadora TDEE integrada à Anamnese. Meta de proteína/carbo. Alto valor percebido.", impacto:"Alto", esforco:"Médio" },
      { titulo:"Chat Personal ↔ Aluno", desc:"Mensagens in-app. Reduz churn de personal. Aumenta retenção de aluno.", impacto:"Alto", esforco:"Médio" },
      { titulo:"Progressão de Fotos", desc:"Antes/depois com data e peso. Prova visual de resultado. Viral potencial.", impacto:"Alto", esforco:"Baixo" },
      { titulo:"App Nativo (React Native)", desc:"Notificações push reais. Timer de descanso com vibração. Câmera para QR.", impacto:"Muito Alto", esforco:"Alto" },
      { titulo:"Integração Wearables", desc:"Apple Watch / Garmin: frequência cardíaca, calorias, sono automático.", impacto:"Médio", esforco:"Alto" },
    ]},
    { categoria:"Comercial", cor:C.purple, icon:"💰", items:[
      { titulo:"White-label para Academias", desc:"Academia paga R$500–2k/mês para ter o GymAI com sua marca. Maior ticket.", impacto:"Muito Alto", esforco:"Alto" },
      { titulo:"Plano Aluno Premium", desc:"R$29/mês para alunos sem personal. IA avançada, Wrapped, relatório próprio.", impacto:"Alto", esforco:"Baixo" },
      { titulo:"Afiliados de Personal", desc:"Personal indica academia → comissão recorrente. Acelera B2B.", impacto:"Médio", esforco:"Baixo" },
      { titulo:"Certificação GymAI", desc:"Curso online para personais: como usar IA no treino. Ticket único R$297.", impacto:"Médio", esforco:"Médio" },
    ]},
    { categoria:"Suporte & Ops", cor:C.blue, icon:"🛠️", items:[
      { titulo:"Onboarding Guiado", desc:"Tooltip overlay nos primeiros 3 acessos. Reduz suporte em 40%.", impacto:"Alto", esforco:"Baixo" },
      { titulo:"Central de Ajuda In-app", desc:"FAQ contextual por tela. Reduz tickets de suporte.", impacto:"Médio", esforco:"Baixo" },
      { titulo:"Status Page", desc:"Indicador de sistema operacional. Reduz tickets de 'app caiu'.", impacto:"Baixo", esforco:"Baixo" },
    ]},
  ];

  const SUPORTE_AREAS = [
    { area:"Onboarding", volume:"Alto", complexidade:"Baixa", canais:["Chat in-app","Vídeo tutorial","FAQ"], tipicos:["Como criar treino","Como associar aluno","Como usar o QR Code"], automacao:"80% — chatbot ou FAQ resolve" },
    { area:"Técnico (bugs)", volume:"Médio", complexidade:"Alta", canais:["Email","WhatsApp Business"], tipicos:["Timer não contou","Sync de carga","Login OAuth"], automacao:"30% — requer dev ou análise de log" },
    { area:"Financeiro", volume:"Baixo", complexidade:"Média", canais:["Email","Suporte Pro"], tipicos:["Split não caiu","Upgrade de plano","Cancelamento"], automacao:"60% — automação de billing" },
    { area:"Personal (B2B)", volume:"Médio", complexidade:"Média", canais:["WhatsApp VIP","Email prioritário"], tipicos:["Relatório PDF","Pacote não publicou","Aluno não encontrado"], automacao:"50% — FAQ dedicado para personal" },
  ];

  const tabs = [
    { id:"mapa",      label:"🗺️ Mapa do Produto" },
    { id:"personas",  label:"👥 Personas" },
    { id:"modulos",   label:"🧩 Módulos" },
    { id:"fluxos",    label:"🔄 Fluxos" },
    { id:"oport",     label:"🚀 Oportunidades" },
    { id:"suporte",   label:"🛠️ Suporte" },
    { id:"numeros",   label:"📊 Números" },
  ];

  const impactoCor = { "Muito Alto":C.accent, "Alto":C.teal, "Médio":C.blue, "Baixo":C.muted };
  const esforcoCor = { "Alto":C.red, "Médio":C.orange, "Baixo":C.accent };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Header */}
      <div style={{ ...s.card, background:`linear-gradient(135deg,#0D1A06,#0A0A1E)`, borderColor:`${C.accent}30`, padding:28 }}>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.accent, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>GymAI · Documento de Produto</div>
            <h1 style={{ ...s.h1, fontSize:28, color:"#fff" }}>Estrutura da Plataforma</h1>
            <div style={{ fontSize:13, color:C.muted, marginTop:6, maxWidth:520 }}>Visão completa do produto: personas, módulos funcionais, fluxos de valor, oportunidades comerciais e estimativa de suporte. Use este documento para pitch, roadmap e decisões de produto.</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
              {[{v:"4",l:"Personas",c:C.accent},{v:"8",l:"Módulos",c:C.purple},{v:"v2.6",l:"Versão",c:C.blue},{v:"R$62k",l:"MRR",c:C.orange}].map(m=>(
                <div key={m.l} style={{ textAlign:"center", padding:"10px 16px", background:"rgba(255,255,255,0.05)", borderRadius:10, border:`1px solid rgba(255,255,255,0.08)` }}>
                  <div style={{ fontSize:18, fontWeight:800, color:m.c }}>{m.v}</div>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.6px" }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setSecao(t.id)} style={{ flexShrink:0, padding:"9px 14px", borderRadius:10, border:`1px solid ${secao===t.id?C.orange:C.border}`, background:secao===t.id?`${C.orange}18`:"transparent", color:secao===t.id?C.orange:C.muted, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all 0.15s" }}>{t.label}</button>
        ))}
      </div>

      {/* ── MAPA ── */}
      {secao==="mapa" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <Secao titulo="Diagrama Geral da Plataforma" sub="Personas → Módulos → Infraestrutura" cor={C.orange}>
            <div style={{ ...s.card, padding:20 }}>
              <MapaDoProduto />
            </div>
          </Secao>

          <Secao titulo="Posicionamento de Mercado" cor={C.orange}>
            <div className="rg3" style={{ display:"grid", gap:14 }}>
              {[
                { titulo:"Para quem", desc:"Academias independentes, personal trainers autônomos e alunos que querem progresso real. Não atletas de elite — o mercado de massa fitness (40M de praticantes no Brasil).", icon:"🎯" },
                { titulo:"Proposta de valor", desc:"O único app que conecta aluno + personal + academia numa plataforma só, com IA de sobrecarga progressiva embutida e monetização para o personal.", icon:"💎" },
                { titulo:"Modelo de negócio", desc:"SaaS B2C (aluno paga plano) + SaaS B2B (personal paga plano) + Marketplace take-rate 20% em cada pacote vendido + White-label para academias.", icon:"💰" },
              ].map(c=>(
                <div key={c.titulo} style={{ ...s.card, padding:18 }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:6, color:C.orange }}>{c.titulo}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </Secao>

          <Secao titulo="Como as Personas se Conectam" cor={C.orange}>
            <div style={{ ...s.card, padding:20 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:`${C.accent}08`, borderRadius:10, border:`1px solid ${C.accent}25`, flexWrap:"wrap" }}>
                  <Chip label="🏅 Personal" color={C.purple}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="Cria treino + Badge + Pacote" color={C.muted}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="🎓 Aluno recebe e executa" color={C.accent}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:`${C.blue}08`, borderRadius:10, border:`1px solid ${C.blue}25`, flexWrap:"wrap" }}>
                  <Chip label="🏢 Academia" color={C.blue}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="Cadastra equipamentos + QR" color={C.muted}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="🎓 Aluno escaneia e treina" color={C.accent}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:`${C.teal}08`, borderRadius:10, border:`1px solid ${C.teal}25`, flexWrap:"wrap" }}>
                  <Chip label="🎓 Aluno" color={C.accent}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="Compra Pacote (R$89)" color={C.muted}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="🏅 Personal recebe 80%" color={C.purple}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="GymAI retém 20%" color={C.teal}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:`${C.orange}08`, borderRadius:10, border:`1px solid ${C.orange}25`, flexWrap:"wrap" }}>
                  <Chip label="⚙️ Admin" color={C.orange}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="Controla planos + biblioteca + notificações" color={C.muted}/><span style={{ fontSize:18, color:C.border }}>→</span><Chip label="Todas as personas" color={C.muted}/>
                </div>
              </div>
            </div>
          </Secao>
        </div>
      )}

      {/* ── PERSONAS ── */}
      {secao==="personas" && (
        <Secao titulo="As 4 Personas do GymAI" sub="Cada uma com jornada, dores e ganhos distintos" cor={C.orange}>
          <div className="rg2" style={{ display:"grid", gap:16 }}>
            {PERSONAS_DATA.map(p => <PersonaCard key={p.titulo} {...p}/>)}
          </div>
        </Secao>
      )}

      {/* ── MÓDULOS ── */}
      {secao==="modulos" && (
        <Secao titulo="Módulos Funcionais" sub="8 núcleos de funcionalidade implementados em v2.6" cor={C.orange}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {MODULOS.map((m,i) => (
              <div key={i} style={{ ...s.card, padding:18, borderLeft:`4px solid ${m.cor}` }}>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:`${m.cor}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14, color:m.cor }}>{m.nome}</div>
                      <div style={{ display:"flex", gap:6, marginTop:4 }}>
                        <Chip label={`Complexidade: ${m.complexidade}`} color={m.complexidade==="Alta"?C.red:m.complexidade==="Média"?C.orange:C.accent} size={10}/>
                        <Chip label={m.status} color={C.accent} size={10}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, marginBottom:12 }}>{m.desc}</div>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:6 }}>Componentes</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {m.componentes.map(c=><Chip key={c} label={c} color={C.muted} size={10}/>)}
                </div>
              </div>
            ))}
          </div>
        </Secao>
      )}

      {/* ── FLUXOS ── */}
      {secao==="fluxos" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {FLUXOS.map((f,fi) => (
            <Secao key={fi} titulo={f.titulo} cor={f.cor}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {f.passos.map((p,i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:`${f.cor}22`, border:`2px solid ${f.cor}50`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:f.cor, flexShrink:0 }}>{p.n}</div>
                    <div style={{ flex:1, padding:"12px 14px", background:C.card, border:`1px solid ${C.border}`, borderRadius:10 }}>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:4, color:f.cor }}>{p.label}</div>
                      <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{p.desc}</div>
                    </div>
                    {i<f.passos.length-1 && <div style={{ display:"none" }}/>}
                  </div>
                ))}
              </div>
            </Secao>
          ))}

          <Secao titulo="Fluxo de Dados & IA" cor={C.accent}>
            <div style={{ ...s.card, padding:20 }}>
              {[
                { icon:"📥", label:"Entrada de dados", items:["Check-in de humor","Seleção de grupos musculares","Histórico de cargas","Anamnese (IMC, objetivo, limitações)"] },
                { icon:"🧠", label:"Processamento IA", items:["Cálculo de sobrecarga progressiva (+0,5–2kg)","Adaptação por humor (cansado → -20%)","Sugestão de deload (4+ semanas)","Alertas de alunos em risco (frequência × padrão)"] },
                { icon:"📤", label:"Saída & Feedback", items:["Treino montado com cargas personalizadas","XP + missões desbloqueadas","Resumo semanal gerado","Relatório PDF para o personal"] },
              ].map((et,i) => (
                <div key={i} style={{ marginBottom:i<2?16:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:20 }}>{et.icon}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:C.accent }}>{et.label}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, paddingLeft:30 }}>
                    {et.items.map(it=><Chip key={it} label={it} color={C.muted} size={11}/>)}
                  </div>
                  {i<2 && <div style={{ height:1, background:C.border, margin:"14px 0" }}/>}
                </div>
              ))}
            </div>
          </Secao>
        </div>
      )}

      {/* ── OPORTUNIDADES ── */}
      {secao==="oport" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ ...s.card, background:`${C.orange}08`, borderColor:`${C.orange}30`, padding:18 }}>
            <div style={{ fontWeight:700, color:C.orange, marginBottom:6 }}>🧭 Como usar esta seção</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>Cada oportunidade está classificada por <strong style={{ color:C.text }}>Impacto</strong> (valor gerado ao produto/negócio) e <strong style={{ color:C.text }}>Esforço</strong> (custo de implementação). Priorize: <Chip label="Impacto Alto + Esforço Baixo" color={C.accent} size={11}/> primeiro.</div>
          </div>
          {OPORTUNIDADES.map((cat,ci) => (
            <Secao key={ci} titulo={cat.categoria} cor={cat.cor}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {cat.items.map((item,i) => (
                  <div key={i} style={{ ...s.card, padding:16, display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
                    <div style={{ flex:1, minWidth:180 }}>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{item.titulo}</div>
                      <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{item.desc}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end", flexShrink:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:10, color:C.muted }}>Impacto</span><Chip label={item.impacto} color={impactoCor[item.impacto]} size={10}/></div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:10, color:C.muted }}>Esforço</span><Chip label={item.esforco} color={esforcoCor[item.esforco]} size={10}/></div>
                    </div>
                  </div>
                ))}
              </div>
            </Secao>
          ))}
        </div>
      )}

      {/* ── SUPORTE ── */}
      {secao==="suporte" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ ...s.card, background:`${C.blue}08`, borderColor:`${C.blue}30`, padding:18 }}>
            <div style={{ fontWeight:700, color:C.blue, marginBottom:6 }}>📋 Estimativa de Time de Suporte</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>
              Com <strong style={{ color:C.text }}>1.243 alunos ativos</strong> e <strong style={{ color:C.text }}>38 personais</strong>, a estimativa é de <strong style={{ color:C.accent }}>1 pessoa de suporte para até ~2.000 usuários ativos</strong>, assumindo automação de 50–70% via FAQ e onboarding guiado. Abaixo, o breakdown por área.
            </div>
          </div>
          <Secao titulo="Áreas de Suporte & Volume Estimado" cor={C.blue}>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {SUPORTE_AREAS.map((a,i) => (
                <div key={i} style={{ ...s.card, padding:18 }}>
                  <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14 }}>{a.area}</div>
                      <div style={{ display:"flex", gap:6, marginTop:6 }}>
                        <Chip label={`Volume: ${a.volume}`} color={a.volume==="Alto"?C.red:a.volume==="Médio"?C.orange:C.accent} size={10}/>
                        <Chip label={`Complexidade: ${a.complexidade}`} color={a.complexidade==="Alta"?C.red:a.complexidade==="Média"?C.orange:C.accent} size={10}/>
                      </div>
                    </div>
                    <div style={{ padding:10, background:`${C.accent}10`, borderRadius:8, textAlign:"center" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.accent }}>{a.automacao}</div>
                      <div style={{ fontSize:9, color:C.muted }}>automatizável</div>
                    </div>
                  </div>
                  <div className="rg2" style={{ display:"grid", gap:10 }}>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:6 }}>Canais</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{a.canais.map(c=><Chip key={c} label={c} color={C.blue} size={10}/>)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:6 }}>Tickets típicos</div>
                      {a.tipicos.map(t=><div key={t} style={{ fontSize:11, color:C.muted, marginBottom:2 }}>• {t}</div>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Secao>
          <Secao titulo="Recomendações de Estrutura de Suporte" cor={C.blue}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { fase:"0–500 usuários", estrutura:"Fundador(es) fazem suporte direto. WhatsApp Business + email.", foco:"Aprender dores reais. Zero custo.", time:"0 pessoas dedicadas" },
                { fase:"500–2.000 usuários", estrutura:"1 CS part-time + FAQ in-app + onboarding guiado automático.", foco:"Escalar sem contratar. Documentar os 20 tickets mais frequentes.", time:"0,5–1 pessoa" },
                { fase:"2.000–10.000 usuários", estrutura:"2 CS full-time (1 B2C, 1 B2B personais) + chatbot + Slack VIP para personais.", foco:"SLA: 4h úteis para personais, 24h para alunos.", time:"2 pessoas" },
                { fase:"10.000+ usuários", estrutura:"Time de CS especializado por persona + suporte 24/7 assíncrono.", foco:"NPS > 70. CSAT > 90%.", time:"4–6 pessoas + automação IA" },
              ].map((f,i) => (
                <div key={i} style={{ ...s.card, padding:16, borderLeft:`4px solid ${C.blue}` }}>
                  <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10, marginBottom:8 }}>
                    <div style={{ fontWeight:800, fontSize:13, color:C.blue }}>{f.fase}</div>
                    <Chip label={f.time} color={C.purple} size={10}/>
                  </div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}><strong style={{ color:C.text }}>Estrutura:</strong> {f.estrutura}</div>
                  <div style={{ fontSize:12, color:C.muted }}><strong style={{ color:C.text }}>Foco:</strong> {f.foco}</div>
                </div>
              ))}
            </div>
          </Secao>
        </div>
      )}

      {/* ── NÚMEROS ── */}
      {secao==="numeros" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <Secao titulo="Estado Atual — v2.6" cor={C.orange}>
            <div className="rg4" style={{ display:"grid", gap:14 }}>
              {[
                {v:"4",     l:"Personas",          sub:"Aluno/Personal/Academia/Admin", c:C.accent },
                {v:"8",     l:"Módulos funcionais", sub:"Implementados em v2.6",        c:C.purple },
                {v:"30+",   l:"Telas/screens",      sub:"Navegáveis no protótipo",      c:C.blue   },
                {v:"9",     l:"Features Sprint B",  sub:"Todas implementadas",          c:C.teal   },
                {v:"3.314", l:"Linhas de código",   sub:"JSX sem dependências",         c:C.orange },
                {v:"80/20", l:"Split de receita",   sub:"Personal / GymAI",             c:C.accent },
                {v:"3",     l:"Planos Personal",    sub:"Starter / Pro / Elite",        c:C.purple },
                {v:"∞",     l:"Escalabilidade",     sub:"SaaS puro — sem ops manual",   c:C.teal   },
              ].map(m=>(
                <div key={m.l} style={{ ...s.card, padding:18, textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:m.c }}>{m.v}</div>
                  <div style={{ fontSize:12, fontWeight:700, marginTop:4 }}>{m.l}</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </Secao>

          <Secao titulo="Projeção de Receita — Cenários" cor={C.orange}>
            <div className="rg3" style={{ display:"grid", gap:14 }}>
              {[
                { cenario:"Conservador", prazo:"12 meses", alunos:500, personais:25, mrr:"R$ 28k", arr:"R$ 336k", cor:C.muted, assumpt:"Crescimento orgânico. Sem paid ads. Só product-led." },
                { cenario:"Base", prazo:"12 meses", alunos:2000, personais:80, mrr:"R$ 110k", arr:"R$ 1,3M", cor:C.blue, assumpt:"20% paid + 80% virality. Personal indica aluno. QR code converte." },
                { cenario:"Agressivo", prazo:"12 meses", alunos:8000, personais:250, mrr:"R$ 420k", arr:"R$ 5M", cor:C.accent, assumpt:"White-label academias + paid. 5 academias com 500 alunos cada." },
              ].map(c=>(
                <div key={c.cenario} style={{ ...s.card, padding:20, borderTop:`4px solid ${c.cor}` }}>
                  <div style={{ fontWeight:800, fontSize:15, color:c.cor, marginBottom:4 }}>{c.cenario}</div>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:14 }}>{c.prazo}</div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:28, fontWeight:800, color:c.cor }}>{c.mrr}<span style={{ fontSize:12, fontWeight:400, color:C.muted }}>/mês</span></div>
                    <div style={{ fontSize:13, color:C.muted }}>{c.arr}/ano</div>
                  </div>
                  {[{l:"Alunos",v:c.alunos.toLocaleString()},{l:"Personais",v:c.personais}].map(m=>(
                    <div key={m.l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ color:C.muted }}>{m.l}</span><span style={{ fontWeight:700, color:c.cor }}>{m.v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:12, fontSize:11, color:C.muted, lineHeight:1.5 }}>{c.assumpt}</div>
                </div>
              ))}
            </div>
          </Secao>

          <Secao titulo="Métricas-chave para Acompanhar" cor={C.orange}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { grupo:"Produto", cor:C.accent, metricas:[
                  {m:"DAU/MAU",v:"Meta > 40%",desc:"Stickiness. Gamificação deve impulsionar."},
                  {m:"Treinos/semana por aluno",v:"Meta ≥ 3",desc:"Indicador de uso ativo real."},
                  {m:"Streak médio",v:"Meta ≥ 7 dias",desc:"Sequências = retenção."},
                  {m:"XP ganho/semana",v:"Meta ≥ 200 XP",desc:"Engajamento com missões."},
                ]},
                { grupo:"Negócio", cor:C.purple, metricas:[
                  {m:"MRR",v:"R$ 62k atual",desc:"Crescimento alvo: 15% MoM."},
                  {m:"LTV / CAC",v:"Meta > 5:1",desc:"SaaS saudável."},
                  {m:"Churn mensal",v:"Meta < 3%",desc:"Personal: < 2%. Aluno: < 5%."},
                  {m:"Take-rate marketplace",v:"20%",desc:"Por pacote de treino vendido."},
                ]},
                { grupo:"Suporte", cor:C.blue, metricas:[
                  {m:"CSAT",v:"Meta > 90%",desc:"Satisfação pós-atendimento."},
                  {m:"NPS",v:"Meta > 60",desc:"Promotores virais."},
                  {m:"Tempo médio de resposta",v:"< 4h",desc:"Para planos pagos."},
                  {m:"% tickets evitados por FAQ",v:"Meta > 60%",desc:"Eficiência de suporte."},
                ]},
              ].map((g,gi) => (
                <div key={gi} style={{ ...s.card, padding:18 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:g.cor, marginBottom:12 }}>{g.grupo}</div>
                  {g.metricas.map(m=>(
                    <div key={m.m} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ flex:1 }}><span style={{ fontWeight:600, fontSize:13 }}>{m.m}</span><div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{m.desc}</div></div>
                      <Chip label={m.v} color={g.cor} size={10}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Secao>
        </div>
      )}
    </div>
  );
};


const AlunoVitrinePacotes  = ({ setScreen }) => <PacotesTreinoScreen setScreen={setScreen} isPersonal={false} />;
const PersonalPacotes      = ({ setScreen }) => <PacotesTreinoScreen setScreen={setScreen} isPersonal={true} />;
const PersonalRelatorio    = ({ setScreen }) => <RelatorioMensalScreen setScreen={setScreen} />;
const PersonalLinkConvite  = ({ setScreen }) => <LinkConviteScreen setScreen={setScreen} />;
const AlunoRanking         = ({ setScreen }) => <RankingFrequenciaScreen setScreen={setScreen} isAcademia={false} />;
const AlunoHorarios        = ({ setScreen }) => <HorariosScreen setScreen={setScreen} isAcademia={false} />;
const AlunoVitrinPersonais = ({ setScreen }) => <VitrinPersonaisScreen setScreen={setScreen} />;
const AcademiaRanking      = ({ setScreen }) => <RankingFrequenciaScreen setScreen={setScreen} isAcademia={true} />;
const AcademiaHorarios     = ({ setScreen }) => <HorariosScreen setScreen={setScreen} isAcademia={true} />;

const personaConfig = {
  aluno: { color:C.accent, label:"Aluno", defaultScreen:"alunoDash", screens:{
    alunoDash:       { label:"Dashboard",      icon:"🏠" },
    alunoTreino:     { label:"Fazer Treino",   icon:"🏋️" },
    alunoHistorico:  { label:"Histórico",      icon:"📊" },
    alunoGamificacao:{ label:"Conquistas",     icon:"🏆" },
    alunoRanking:    { label:"Ranking",        icon:"🥇" },
    alunoHorarios:   { label:"Pico / Horários",icon:"⏰" },
    alunoPersonais:  { label:"Personais",      icon:"👤" },
    alunoPacotes:    { label:"Programas",      icon:"📦" },
    alunoAvatar:     { label:"Meu Avatar",     icon:"🧍" },
  }},
  personal: { color:C.purple, label:"Personal", defaultScreen:"personalDash", screens:{
    personalDash:          { label:"Dashboard",       icon:"🏠" },
    personalAssociarAluno: { label:"Associar Aluno",  icon:"🔗" },
    personalCadastrarTreino:{ label:"Cadastrar Treino",icon:"📋" },
    personalBadges:        { label:"Meus Badges",     icon:"🎖️" },
    personalPacotes:       { label:"Pacotes Vendáveis",icon:"📦" },
    personalRelatorio:     { label:"Relatório Mensal",icon:"📄" },
    personalLinkConvite:   { label:"Link de Convite", icon:"🔗" },
    personalPlano:         { label:"Meu Plano",       icon:"💼" },
    personalAvatar:        { label:"Meu Avatar",      icon:"🧍" },
  }},
  admin: { color:C.orange, label:"Admin", defaultScreen:"adminDash", screens:{
    adminDash:       { label:"Visão Geral",          icon:"🏠" },
    adminEstrutura:  { label:"Estrutura da Plataforma", icon:"🗺️" },
  }},
  academia: { color:C.blue, label:"Academia", defaultScreen:"academiaDash", screens:{
    academiaDash:     { label:"Painel",          icon:"🏢" },
    academiaRanking:  { label:"Ranking",         icon:"🥇" },
    academiaHorarios: { label:"Horários de Pico",icon:"⏰" },
  }},
};

const screenMap = {
  alunoDash:AlunoDashboard, alunoTreino:AlunoTreino, alunoHistorico:AlunoHistorico,
  alunoGamificacao:GamificacaoScreen, alunoAvatar:AvatarScreen,
  alunoRanking:AlunoRanking, alunoHorarios:AlunoHorarios,
  alunoPersonais:AlunoVitrinPersonais, alunoPacotes:AlunoVitrinePacotes,
  personalDash:PersonalDashboard, personalAssociarAluno:PersonalAssociarAluno,
  personalCadastrarTreino:PersonalCadastrarTreino, personalBadges:BadgesManagerScreen,
  personalPlano:PlanoPersonalScreen, personalAvatar:AvatarScreen,
  personalPacotes:PersonalPacotes, personalRelatorio:PersonalRelatorio,
  personalLinkConvite:PersonalLinkConvite,
  adminDash:AdminDashboard, adminEstrutura:EstruturaDaPlataforma,
  academiaDash:AcademiaPanel, academiaRanking:AcademiaRanking, academiaHorarios:AcademiaHorarios,
};
const userNames = { aluno:"Lucas Mendes", personal:"Dr. Paulo Ferreira", admin:"Admin Root", academia:"FitZone Campinas" };

export default function App() {
  const [persona, setPersona] = useState("aluno");
  const [screen, setScreen] = useState("alunoDash");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();
  const cfg = personaConfig[persona];
  const ScreenComp = screenMap[screen]||AlunoDashboard;
  const switchPersona = (p) => { setPersona(p); setScreen(personaConfig[p].defaultScreen); setMobileNavOpen(false); };
  const navigate = (key) => { setScreen(key); setMobileNavOpen(false); };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; } input,select,textarea { outline: none; }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #2A2A3A; border-radius: 3px; }
    button { transition: opacity 0.15s; } button:hover { opacity: 0.85; }
    .rg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .rg3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .rg4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    .avatar-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: start; }
    @media (max-width: 767px) {
      .rg2 { grid-template-columns: 1fr !important; }
      .rg3 { grid-template-columns: 1fr 1fr !important; }
      .rg4 { grid-template-columns: 1fr 1fr !important; }
      .avatar-layout { grid-template-columns: 1fr !important; }
      .serie-row { grid-template-columns: 24px 1fr 1fr 60px 30px !important; gap: 4px !important; }
      .topbar-version { display: none !important; }
    }
    @media (min-width: 768px) { .show-mobile-only { display: none !important; } }
  `;

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif", background:C.bg, color:C.text, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <style>{CSS}</style>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 16px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.accent, letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:6 }}>⚡ GymAI</div>
        <div style={{ display:"flex", gap:3, background:C.card, padding:3, borderRadius:10 }}>
          {Object.entries(personaConfig).map(([key,val]) => (
            <button key={key} onClick={() => switchPersona(key)} style={{ padding:isMobile?"6px 10px":"6px 14px", borderRadius:7, border:"none", cursor:"pointer", fontSize:isMobile?11:13, fontWeight:700, fontFamily:"inherit", background:persona===key?val.color:"transparent", color:persona===key?"#000":C.muted, whiteSpace:"nowrap" }}>{val.label}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="topbar-version" style={{ fontSize:12, color:C.muted }}>v2.7</div>
          <button onClick={() => gd().signOut && gd().signOut()} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", color:C.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>Sair</button>
          <button className="show-mobile-only" onClick={() => setMobileNavOpen(v=>!v)} style={{ background:mobileNavOpen?`${cfg.color}20`:"transparent", border:`1px solid ${mobileNavOpen?cfg.color:C.border}`, borderRadius:8, width:36, height:36, cursor:"pointer", color:mobileNavOpen?cfg.color:C.muted, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>{mobileNavOpen?"✕":"☰"}</button>
        </div>
      </div>
      {isMobile&&mobileNavOpen&&(
        <div style={{ position:"fixed", inset:0, zIndex:150, display:"flex" }}>
          <div style={{ width:260, background:C.surface, borderRight:`1px solid ${C.border}`, padding:"16px 12px", display:"flex", flexDirection:"column", gap:4, overflowY:"auto" }}>
            <div style={{ fontSize:12, color:C.muted, padding:"4px 12px 12px", borderBottom:`1px solid ${C.border}`, marginBottom:8 }}>Logado como <strong style={{ color:cfg.color }}>{userNames[persona]}</strong></div>
            {Object.entries(cfg.screens).map(([key,val]) => (
              <div key={key} onClick={() => navigate(key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:10, cursor:"pointer", background:screen===key?`${cfg.color}18`:"transparent", color:screen===key?cfg.color:C.text, fontWeight:screen===key?700:400, fontSize:15, border:screen===key?`1px solid ${cfg.color}30`:"1px solid transparent" }}>
                <span style={{ fontSize:18 }}>{val.icon}</span><span>{val.label}</span>
              </div>
            ))}
          </div>
          <div style={{ flex:1, background:"rgba(0,0,0,0.5)" }} onClick={() => setMobileNavOpen(false)} />
        </div>
      )}
      <div style={{ display:"flex", flex:1, minHeight:0 }}>
        {!isMobile&&(
          <div style={{ width:220, background:C.surface, borderRight:`1px solid ${C.border}`, padding:"16px 12px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
            {Object.entries(cfg.screens).map(([key,val]) => (
              <div key={key} onClick={() => navigate(key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, cursor:"pointer", background:screen===key?`${cfg.color}18`:"transparent", color:screen===key?cfg.color:C.muted, fontWeight:screen===key?600:400, fontSize:14, border:screen===key?`1px solid ${cfg.color}30`:"1px solid transparent", transition:"all 0.15s" }}>
                <span>{val.icon}</span><span>{val.label}</span>
              </div>
            ))}
            <div style={{ flex:1 }} />
            <div style={{ padding:"12px 12px", borderTop:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, color:C.muted }}>Logado como</div>
              <div style={{ fontSize:13, fontWeight:700, color:cfg.color, marginTop:2 }}>{gd().nome || userNames[persona]}</div>
            </div>
          </div>
        )}
        <div style={{ flex:1, padding:isMobile?14:24, overflow:"auto", paddingBottom:isMobile?80:24 }}>
          <ScreenComp setScreen={navigate} />
        </div>
      </div>
      {isMobile&&(
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:190, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"stretch", height:60, paddingBottom:"env(safe-area-inset-bottom)" }}>
          {Object.entries(cfg.screens).slice(0,4).map(([key,val]) => (
            <button key={key} onClick={() => navigate(key)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, border:"none", background:screen===key?`${cfg.color}15`:"transparent", color:screen===key?cfg.color:C.muted, cursor:"pointer", fontFamily:"inherit", borderTop:screen===key?`2px solid ${cfg.color}`:"2px solid transparent", transition:"all 0.15s" }}>
              <span style={{ fontSize:20 }}>{val.icon}</span>
              <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>{val.label.split(" ")[0]}</span>
            </button>
          ))}
          {Object.entries(cfg.screens).length > 4 && (
            <button onClick={() => setMobileNavOpen(v=>!v)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, border:"none", background:mobileNavOpen?`${cfg.color}15`:"transparent", color:mobileNavOpen?cfg.color:C.muted, cursor:"pointer", fontFamily:"inherit", borderTop:mobileNavOpen?`2px solid ${cfg.color}`:"2px solid transparent" }}>
              <span style={{ fontSize:20 }}>⋯</span>
              <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>Mais</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
