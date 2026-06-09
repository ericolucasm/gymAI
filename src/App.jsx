import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0F", surface: "#13131A", card: "#1C1C28", border: "#2A2A3A",
  accent: "#C8F135", red: "#FF4757", blue: "#3D91FF", purple: "#9B59FF",
  orange: "#FF7730", teal: "#00D2C8", text: "#F0F0F8", muted: "#6B6B85",
};

// ─── BANCO DE EXERCÍCIOS ──────────────────────────────────────────────────────
const BANCO = {
  Peito: [
    { name: "Supino Reto c/ Barra", aparelho: "Banco de Supino c/ Barra", sets: 4, reps: "8-10", kg: 60, rest: 90 },
    { name: "Supino Inclinado c/ Haltere", aparelho: "Halteres (par)", sets: 4, reps: "10-12", kg: 18, rest: 75 },
    { name: "Crucifixo", aparelho: "Halteres (par)", sets: 3, reps: "12", kg: 14, rest: 60 },
    { name: "Crossover no Cabo", aparelho: "Crossover", sets: 3, reps: "12-15", kg: 20, rest: 45 },
    { name: "Flexão de Braço", aparelho: "Peso Corporal", sets: 4, reps: "15", kg: 0, rest: 60 },
  ],
  Costas: [
    { name: "Puxada Frente", aparelho: "Polia Alta", sets: 4, reps: "10-12", kg: 60, rest: 75 },
    { name: "Remada Baixa", aparelho: "Polia Baixa", sets: 4, reps: "10", kg: 55, rest: 75 },
    { name: "Remada Unilateral", aparelho: "Halteres (par)", sets: 3, reps: "10", kg: 30, rest: 60 },
    { name: "Puxada Supinada", aparelho: "Polia Alta", sets: 3, reps: "10-12", kg: 55, rest: 75 },
    { name: "Pullover", aparelho: "Halteres (par)", sets: 3, reps: "12", kg: 20, rest: 60 },
  ],
  Pernas: [
    { name: "Agachamento Livre", aparelho: "Smith Machine", sets: 4, reps: "10-12", kg: 60, rest: 90 },
    { name: "Leg Press 45°", aparelho: "Leg Press 45°", sets: 4, reps: "12-15", kg: 120, rest: 90 },
    { name: "Extensora", aparelho: "Extensora", sets: 3, reps: "15", kg: 50, rest: 60 },
    { name: "Flexora", aparelho: "Flexora", sets: 3, reps: "12-15", kg: 40, rest: 60 },
    { name: "Avanço c/ Halteres", aparelho: "Halteres (par)", sets: 3, reps: "12", kg: 20, rest: 60 },
    { name: "Stiff", aparelho: "Halteres (par)", sets: 4, reps: "10-12", kg: 30, rest: 75 },
  ],
  Bíceps: [
    { name: "Rosca Direta c/ Barra", aparelho: "Barra + Anilhas", sets: 3, reps: "10-12", kg: 30, rest: 60 },
    { name: "Rosca Direta c/ Haltere", aparelho: "Halteres (par)", sets: 3, reps: "12", kg: 12, rest: 60 },
    { name: "Rosca Martelo", aparelho: "Halteres (par)", sets: 3, reps: "10", kg: 14, rest: 60 },
    { name: "Rosca Concentrada", aparelho: "Halteres (par)", sets: 3, reps: "12", kg: 10, rest: 45 },
    { name: "Rosca no Cabo", aparelho: "Polia Baixa", sets: 3, reps: "12-15", kg: 15, rest: 45 },
  ],
  Tríceps: [
    { name: "Tríceps Corda", aparelho: "Polia Alta", sets: 4, reps: "12-15", kg: 25, rest: 45 },
    { name: "Tríceps Barra Reta", aparelho: "Polia Alta", sets: 3, reps: "12", kg: 20, rest: 60 },
    { name: "Tríceps Francês", aparelho: "Halteres (par)", sets: 3, reps: "10", kg: 10, rest: 60 },
    { name: "Mergulho no Banco", aparelho: "Peso Corporal", sets: 3, reps: "15", kg: 0, rest: 60 },
    { name: "Supino Fechado", aparelho: "Banco de Supino c/ Barra", sets: 4, reps: "10", kg: 50, rest: 75 },
  ],
  Ombros: [
    { name: "Desenvolvimento c/ Halteres", aparelho: "Halteres (par)", sets: 4, reps: "10-12", kg: 20, rest: 60 },
    { name: "Elevação Lateral", aparelho: "Halteres (par)", sets: 3, reps: "12-15", kg: 10, rest: 45 },
    { name: "Elevação Frontal", aparelho: "Halteres (par)", sets: 3, reps: "12", kg: 8, rest: 45 },
    { name: "Arnold Press", aparelho: "Halteres (par)", sets: 3, reps: "10", kg: 16, rest: 60 },
    { name: "Face Pull", aparelho: "Polia Alta", sets: 3, reps: "12-15", kg: 20, rest: 45 },
  ],
  Abdômen: [
    { name: "Prancha Isométrica", aparelho: "Peso Corporal", sets: 4, reps: "60s", kg: 0, rest: 30 },
    { name: "Crunch no Cabo", aparelho: "Polia Alta", sets: 4, reps: "15", kg: 25, rest: 45 },
    { name: "Elevação de Pernas", aparelho: "Peso Corporal", sets: 3, reps: "15", kg: 0, rest: 30 },
    { name: "Abdominal Supra", aparelho: "Peso Corporal", sets: 4, reps: "20", kg: 0, rest: 30 },
  ],
  Panturrilha: [
    { name: "Panturrilha em Pé", aparelho: "Peso Corporal", sets: 4, reps: "20", kg: 0, rest: 30 },
    { name: "Panturrilha Sentado", aparelho: "Máquina Guiada", sets: 4, reps: "15", kg: 30, rest: 30 },
    { name: "Panturrilha no Leg Press", aparelho: "Leg Press 45°", sets: 3, reps: "20", kg: 80, rest: 30 },
  ],
};

const MUSCULOS = [
  { id: "Peito", icon: "💪" }, { id: "Costas", icon: "🔙" }, { id: "Pernas", icon: "🦵" },
  { id: "Bíceps", icon: "💪" }, { id: "Tríceps", icon: "🦾" }, { id: "Ombros", icon: "🙆" },
  { id: "Abdômen", icon: "⚡" }, { id: "Panturrilha", icon: "🦶" },
];
const FOCOS = ["Hipertrofia", "Definição", "Força Máxima", "Resistência Muscular", "Emagrecimento"];
const EQUIPAMENTOS = ["Peso Livre", "Máquinas", "Cabos/Polias", "Peso Corporal", "Elásticos"];

// ─── ESTILOS BASE ─────────────────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: ${C.bg}; color: ${C.text}; }
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
  input[type=number]::-webkit-inner-spin-button { opacity: 1; }
`;

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
const s = {
  topbar: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: 17, fontWeight: 800, color: C.accent, letterSpacing: "-0.5px" },
  content: { flex: 1, padding: 16, paddingBottom: 80, overflowY: "auto" },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 },
  statCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 },
  lbl: { fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", height: 58, zIndex: 100 },
};

const btnStyle = (color = C.accent, outline = false) => ({
  borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 13,
  cursor: "pointer", fontFamily: "inherit",
  background: outline ? "transparent" : color,
  color: outline ? color : color === C.accent ? "#000" : "#fff",
  border: `1px solid ${color}`, transition: "opacity 0.15s",
});

const Badge = ({ text, color = C.accent }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}20`, color, border: `1px solid ${color}30` }}>
    {text}
  </span>
);

const PBar = ({ pct, color = C.accent }) => (
  <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
  </div>
);

const Chip = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: 20, fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
    border: `1px solid ${selected ? C.accent : C.border}`,
    background: selected ? `${C.accent}18` : "transparent",
    color: selected ? C.accent : C.muted, transition: "all 0.15s",
  }}>{label}</button>
);

const BottomNav = ({ screen, setScreen }) => {
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "treino", icon: "🏋️", label: "Treinar" },
    { id: "historico", icon: "📊", label: "Histórico" },
    { id: "perfil", icon: "👤", label: "Perfil" },
  ];
  return (
    <div style={s.bottomNav}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 3, border: "none", fontFamily: "inherit", cursor: "pointer",
          background: screen === t.id ? `${C.accent}10` : "transparent",
          color: screen === t.id ? C.accent : C.muted,
          fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
          borderTop: screen === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
          transition: "all 0.15s",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
};

// ─── MODAL BASE ───────────────────────────────────────────────────────────────
const BottomSheet = ({ onClose, title, children }) => (
  <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
    <div style={{ background: C.surface, borderRadius: "18px 18px 0 0", padding: 20, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
      <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 16px" }} />
      {title && <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{title}</h3>}
      {children}
    </div>
  </div>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia 👋";
  if (h < 18) return "Boa tarde 👋";
  return "Boa noite 👋";
};
const academiaLabel = id => ({ fitzone: "FitZone Campinas", ironhouse: "Iron House SP", livre: "Treino Livre" }[id] || id);
const nivelLabel = id => ({ iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" }[id] || id);

// ─── TELA: ONBOARDING ─────────────────────────────────────────────────────────
const Onboarding = ({ onFinish }) => {
  const [nome, setNome] = useState("");
  const [academia, setAcademia] = useState("fitzone");
  const [nivel, setNivel] = useState("iniciante");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, letterSpacing: -1 }}>GymAI</div>
        <div style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>Seu treino inteligente</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={s.lbl}>Seu nome</div>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Lucas"
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%" }} />
        </div>
        <div>
          <div style={s.lbl}>Sua academia</div>
          <select value={academia} onChange={e => setAcademia(e.target.value)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%" }}>
            <option value="fitzone">FitZone Campinas</option>
            <option value="ironhouse">Iron House SP</option>
            <option value="livre">Treino Livre / Em casa</option>
          </select>
        </div>
        <div>
          <div style={s.lbl}>Seu nível</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["iniciante", "intermediario", "avancado"].map(n => (
              <Chip key={n} label={nivelLabel(n)} selected={nivel === n} onClick={() => setNivel(n)} />
            ))}
          </div>
        </div>
        <button onClick={() => nome.trim() ? onFinish({ nome: nome.trim(), academia, nivel }) : alert("Digite seu nome!")}
          style={{ ...btnStyle(), width: "100%", padding: 13, marginTop: 8 }}>
          Começar →
        </button>
      </div>
    </div>
  );
};

// ─── TELA: HOME ───────────────────────────────────────────────────────────────
const Home = ({ user, historico, streak, setScreen }) => {
  const semana = historico.filter(s => (new Date() - new Date(s.data)) / (1000 * 60 * 60 * 24) < 7);
  const tempos = semana.map(s => s.duracao).filter(Boolean);
  const tempoMedio = tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : null;
  const pct = Math.min(100, Math.round((semana.length / 5) * 100));

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hoje = new Date().getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = (hoje - 6 + i + 7) % 7;
    const treino = semana.find(s => new Date(s.data).getDay() === d);
    return { label: dias[d], treino };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
      <div style={s.topbar}>
        <div style={s.logo}>⚡ GymAI</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.orange }}>🔥 {streak}</div>
      </div>
      <div style={s.content}>
        <div style={{ marginBottom: 20 }}>
          <div style={s.lbl}>{getGreeting()}</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{user.nome}</h1>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Badge text={nivelLabel(user.nivel)} color={C.blue} />
            <Badge text={academiaLabel(user.academia)} color={C.purple} />
          </div>
        </div>

        <div style={{ ...s.grid2, marginBottom: 16 }}>
          <div style={s.statCard}>
            <div style={s.lbl}>Treinos na semana</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, marginTop: 4 }}>{semana.length}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Meta: 5</div>
          </div>
          <div style={s.statCard}>
            <div style={s.lbl}>Tempo médio</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.blue, marginTop: 4 }}>{tempoMedio ? `${tempoMedio}min` : "—"}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>por sessão</div>
          </div>
        </div>

        <div style={{ ...s.card, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Semana atual</span>
            <span style={{ fontSize: 12, color: C.muted }}>{pct}% da meta</span>
          </div>
          <PBar pct={pct} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            {weekDays.map((d, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: d.treino ? C.accent : C.border, color: d.treino ? "#000" : C.muted }}>
                  {d.treino ? "✓" : ""}
                </div>
                <div style={{ fontSize: 9, color: C.muted }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div onClick={() => setScreen("treino")} style={{ ...s.card, borderLeft: `4px solid ${C.accent}`, cursor: "pointer", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={s.lbl}>Pronto para treinar?</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Montar treino de hoje →</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Toque para configurar</div>
            </div>
            <span style={{ fontSize: 28 }}>🏋️</span>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Últimas sessões</div>
          {historico.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: 16 }}>Nenhuma sessão ainda. Faça seu primeiro treino!</div>
          ) : (
            historico.slice().reverse().slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.titulo}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.dataStr} · {s.exercicios} exercícios</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{s.duracao}min</div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav screen="home" setScreen={setScreen} />
    </div>
  );
};

// ─── TELA: CONFIGURAR TREINO ──────────────────────────────────────────────────
const ConfigTreino = ({ user, historico, setScreen, onGerar }) => {
  const [musculos, setMusculos] = useState([]);
  const [tempo, setTempo] = useState(60);
  const [metodologia, setMetodologia] = useState("normal");
  const [foco, setFoco] = useState("Hipertrofia");
  const [equipamentos, setEquipamentos] = useState([]);

  const musculosRecentes = historico.slice(-2).flatMap(s => s.musculos || []);
  const conflito = musculos.some(m => musculosRecentes.includes(m));

  const toggle = (arr, setArr, id) => setArr(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);

  const metodologias = [
    { id: "normal", label: "Normal" }, { id: "biset", label: "Bi-Set" }, { id: "triset", label: "Tri-Set" },
    { id: "dropset", label: "Drop-Set" }, { id: "piramide", label: "Pirâmide" }, { id: "circuito", label: "Circuito" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
      <div style={s.topbar}>
        <div style={s.logo}>⚡ GymAI</div>
        <span style={{ fontSize: 12, color: C.muted }}>{academiaLabel(user.academia)}</span>
      </div>
      <div style={s.content}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>O que vai treinar hoje?</h2>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Selecione os grupos musculares</p>

        <div style={{ marginBottom: 20 }}>
          <div style={s.lbl}>Grupos musculares</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {MUSCULOS.map(m => (
              <Chip key={m.id} label={`${m.icon} ${m.id}`} selected={musculos.includes(m.id)} onClick={() => toggle(musculos, setMusculos, m.id)} />
            ))}
          </div>
          {conflito && (
            <div style={{ marginTop: 10, padding: 10, background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 8, fontSize: 12, color: C.red }}>
              ⚠️ Alguns grupos foram treinados recentemente. Considere descansar mais.
            </div>
          )}
        </div>

        <div style={{ ...s.grid2, marginBottom: 20 }}>
          <div>
            <div style={s.lbl}>Tempo disponível</div>
            <select value={tempo} onChange={e => setTempo(Number(e.target.value))}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%" }}>
              {[30, 45, 60, 90].map(t => <option key={t} value={t}>{t} min</option>)}
            </select>
          </div>
          <div>
            <div style={s.lbl}>Metodologia</div>
            <select value={metodologia} onChange={e => setMetodologia(e.target.value)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%" }}>
              {metodologias.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={s.lbl}>Foco do treino</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {FOCOS.map(f => <Chip key={f} label={f} selected={foco === f} onClick={() => setFoco(f)} />)}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={s.lbl}>Equipamentos preferidos</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {EQUIPAMENTOS.map(e => <Chip key={e} label={e} selected={equipamentos.includes(e)} onClick={() => toggle(equipamentos, setEquipamentos, e)} />)}
          </div>
        </div>

        <button onClick={() => {
          if (musculos.length === 0) { alert("Selecione ao menos 1 grupo muscular!"); return; }
          const exPorMuscle = tempo <= 30 ? 1 : tempo <= 45 ? 2 : 3;
          const todos = musculos.flatMap(m => {
            const lista = BANCO[m] || [];
            return lista.sort(() => Math.random() - 0.5).slice(0, exPorMuscle).map(ex => ({ ...ex, muscle: m, id: Math.random().toString(36).substr(2, 9) }));
          });
          onGerar({ musculos, tempo, metodologia, foco, sugestao: todos });
          setScreen("sugestao");
        }} style={{ ...btnStyle(), width: "100%", padding: 13 }}>
          ⚡ Gerar treino
        </button>
      </div>
      <BottomNav screen="treino" setScreen={setScreen} />
    </div>
  );
};

// ─── TELA: SUGESTÃO ───────────────────────────────────────────────────────────
const Sugestao = ({ config, setScreen, onIniciar }) => {
  const [exercicios, setExercicios] = useState(config.sugestao);
  const [trocando, setTrocando] = useState(null);

  const metLabel = { normal: "Normal", biset: "Bi-Set", triset: "Tri-Set", dropset: "Drop-Set", piramide: "Pirâmide", circuito: "Circuito" };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
      <div style={s.topbar}>
        <button onClick={() => setScreen("treino")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Refazer</button>
        <div style={s.logo}>⚡ GymAI</div>
        <span style={{ fontSize: 11, color: C.muted }}>Sugestão</span>
      </div>
      <div style={s.content}>
        <div style={{ marginBottom: 4 }}><span style={s.lbl}>Treino gerado</span></div>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Treino — {config.musculos.join(" & ")}</h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <Badge text={`${config.tempo}min`} color={C.blue} />
          <Badge text={metLabel[config.metodologia] || config.metodologia} color={C.purple} />
          <Badge text={config.foco} color={C.teal} />
        </div>

        <div style={{ padding: 10, background: `${C.blue}12`, border: `1px solid ${C.blue}25`, borderRadius: 8, fontSize: 12, color: C.blue, marginBottom: 16 }}>
          ✏️ Toque em <strong>Trocar</strong> para substituir por alternativa
        </div>

        {exercicios.map((ex, i) => (
          <div key={ex.id} style={{ background: C.surface, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ex.muscle} · {ex.sets}×{ex.reps} · {ex.aparelho}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {ex.kg > 0 && <span style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>{ex.kg}kg</span>}
              <button onClick={() => setTrocando(i)} style={{ ...btnStyle(C.accent, true), padding: "5px 10px", fontSize: 11 }}>Trocar</button>
            </div>
          </div>
        ))}

        <button onClick={() => {
          const primeiroMuscle = config.musculos[0] || "Peito";
          const lista = (BANCO[primeiroMuscle] || []).filter(e => !exercicios.some(s => s.name === e.name));
          if (lista.length > 0) setExercicios([...exercicios, { ...lista[0], muscle: primeiroMuscle, id: Math.random().toString(36).substr(2, 9) }]);
        }} style={{ ...btnStyle(C.accent, true), width: "100%", marginBottom: 10 }}>
          + Adicionar exercício
        </button>
        <button onClick={() => onIniciar(exercicios)} style={{ ...btnStyle(), width: "100%", padding: 13 }}>
          🏋️ Iniciar treino
        </button>
      </div>

      {trocando !== null && (
        <BottomSheet onClose={() => setTrocando(null)} title={`Trocar: ${exercicios[trocando]?.name}`}>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>Alternativas para {exercicios[trocando]?.muscle}</p>
          {(BANCO[exercicios[trocando]?.muscle] || []).filter(e => e.name !== exercicios[trocando]?.name).map((alt, i) => (
            <div key={i} onClick={() => {
              const novo = exercicios.map((e, idx) => idx === trocando ? { ...alt, muscle: e.muscle, id: e.id } : e);
              setExercicios(novo); setTrocando(null);
            }} style={{ background: C.card, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}`, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{alt.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{alt.sets}×{alt.reps} · {alt.aparelho}</div>
              </div>
              <span style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>Usar →</span>
            </div>
          ))}
          <button onClick={() => setTrocando(null)} style={{ ...btnStyle(C.muted, true), width: "100%", marginTop: 8 }}>Cancelar</button>
        </BottomSheet>
      )}
      <BottomNav screen="treino" setScreen={setScreen} />
    </div>
  );
};

// ─── TELA: EXECUÇÃO ───────────────────────────────────────────────────────────
const Execucao = ({ exercicios, config, setScreen, onConcluir }) => {
  const [done, setDone] = useState({});
  const [ativo, setAtivo] = useState(null);
  const [series, setSeries] = useState([]);
  const inicio = useState(() => Date.now())[0];

  const completados = Object.keys(done).length;

  const abrirEx = (ex) => {
    setSeries([{ kg: ex.kg, reps: typeof ex.reps === "number" ? ex.reps : 12 }]);
    setAtivo(ex);
  };

  const confirmarEx = () => {
    setDone(d => ({ ...d, [ativo.id]: { series: [...series] } }));
    setAtivo(null);
    if (completados + 1 === exercicios.length) {
      setTimeout(() => onConcluir({ exercicios, done: { ...done, [ativo.id]: { series: [...series] } }, inicio, config }), 400);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
      <div style={s.topbar}>
        <button onClick={() => { if (window.confirm("Sair do treino? O progresso não será salvo.")) setScreen("home"); }}
          style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>✕ Sair</button>
        <div style={s.logo}>⚡ GymAI</div>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{completados}/{exercicios.length}</span>
      </div>
      <div style={s.content}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Treino — {config.musculos.join(" & ")}</div>
          <PBar pct={Math.round((completados / exercicios.length) * 100)} />
        </div>

        {exercicios.map((ex) => {
          const isDone = !!done[ex.id];
          return (
            <div key={ex.id} style={{ background: C.surface, borderRadius: 10, padding: "12px 14px", border: `1px solid ${isDone ? C.accent + "40" : C.border}`, marginBottom: 8, borderLeft: isDone ? `3px solid ${C.accent}` : `1px solid ${C.border}`, opacity: isDone ? 0.6 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{isDone ? "✓ " : ""}{ex.name}</div>
                  {isDone ? (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                      {done[ex.id].series.map((sr, si) => (
                        <Badge key={si} text={`${sr.kg > 0 ? sr.kg + "kg×" : ""}${sr.reps}`} color={C.accent} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ex.sets} séries × {ex.reps} · {ex.aparelho}</div>
                  )}
                </div>
                {!isDone && (
                  <button onClick={() => abrirEx(ex)} style={{ ...btnStyle(), padding: "6px 14px", fontSize: 12 }}>Executar</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {ativo && (
        <BottomSheet onClose={() => setAtivo(null)} title={ativo.name}>
          {series.map((sr, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 20 }}>S{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={s.lbl}>Carga (kg)</div>
                <input type="number" value={sr.kg} min={0} step={2.5}
                  onChange={e => setSeries(series.map((s, j) => j === i ? { ...s, kg: parseFloat(e.target.value) || 0 } : s))}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 8, color: C.accent, fontWeight: 700, fontSize: 14, width: "100%", fontFamily: "inherit", textAlign: "center" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={s.lbl}>Reps</div>
                <input type="number" value={sr.reps} min={1}
                  onChange={e => setSeries(series.map((s, j) => j === i ? { ...s, reps: parseInt(e.target.value) || 1 } : s))}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 8, color: C.text, fontWeight: 700, fontSize: 14, width: "100%", fontFamily: "inherit", textAlign: "center" }} />
              </div>
              {series.length > 1 && (
                <button onClick={() => setSeries(series.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 16 }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={() => setSeries([...series, { ...series[series.length - 1] }])}
            style={{ ...btnStyle(C.muted, true), width: "100%", marginBottom: 12 }}>+ Adicionar série</button>
          <button onClick={confirmarEx} style={{ ...btnStyle(), width: "100%", padding: 13 }}>✓ Concluir exercício</button>
        </BottomSheet>
      )}
    </div>
  );
};

// ─── TELA: CONCLUSÃO ──────────────────────────────────────────────────────────
const Conclusao = ({ resultado, onSalvar }) => {
  const duracao = Math.round((Date.now() - resultado.inicio) / 60000);
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
      <div style={s.topbar}><div style={s.logo}>⚡ GymAI</div><span /></div>
      <div style={{ ...s.content, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Treino concluído!</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Treino — {resultado.config.musculos.join(" & ")}</p>

        <div style={{ ...s.grid2, width: "100%", marginBottom: 24 }}>
          <div style={{ ...s.statCard, textAlign: "center" }}>
            <div style={s.lbl}>Exercícios</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, marginTop: 4 }}>{resultado.exercicios.length}</div>
          </div>
          <div style={{ ...s.statCard, textAlign: "center" }}>
            <div style={s.lbl}>Duração</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.blue, marginTop: 4 }}>{duracao}min</div>
          </div>
        </div>

        <div style={{ ...s.card, width: "100%", textAlign: "left", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Séries realizadas</div>
          {resultado.exercicios.map(ex => {
            const d = resultado.done[ex.id];
            if (!d) return null;
            return (
              <div key={ex.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{ex.name}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                  {d.series.map((sr, i) => <Badge key={i} text={`${sr.kg > 0 ? sr.kg + "kg×" : ""}${sr.reps} reps`} color={C.accent} />)}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => onSalvar(duracao)} style={{ ...btnStyle(), width: "100%", padding: 13 }}>
          Salvar e voltar para home →
        </button>
      </div>
    </div>
  );
};

// ─── TELA: HISTÓRICO ─────────────────────────────────────────────────────────
const Historico = ({ historico, setScreen }) => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
    <div style={s.topbar}><div style={s.logo}>⚡ GymAI</div><span style={{ fontSize: 12, color: C.muted }}>Histórico</span></div>
    <div style={s.content}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Suas sessões</h2>
      {historico.length === 0 ? (
        <div style={{ ...s.card, textAlign: "center", color: C.muted, padding: 32 }}>Nenhuma sessão ainda.<br />Faça seu primeiro treino!</div>
      ) : (
        historico.slice().reverse().map((sess, i) => (
          <div key={i} style={{ ...s.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{sess.titulo}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sess.dataStr}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{sess.duracao}min</div>
                <div style={{ fontSize: 11, color: C.muted }}>{sess.exercicios} exercícios</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {(sess.musculos || []).map(m => <Badge key={m} text={m} color={C.accent} />)}
            </div>
          </div>
        ))
      )}
    </div>
    <BottomNav screen="historico" setScreen={setScreen} />
  </div>
);

// ─── TELA: PERFIL ─────────────────────────────────────────────────────────────
const Perfil = ({ user, setUser, historico, streak, setScreen }) => {
  const [nome, setNome] = useState(user.nome);
  const [academia, setAcademia] = useState(user.academia);
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>
      <div style={s.topbar}><div style={s.logo}>⚡ GymAI</div><span style={{ fontSize: 12, color: C.muted }}>Perfil</span></div>
      <div style={s.content}>
        <div style={{ ...s.card, marginBottom: 16, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.accent}20`, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px" }}>💪</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{user.nome}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{nivelLabel(user.nivel)} · {academiaLabel(user.academia)}</div>
        </div>

        <div style={{ ...s.grid2, marginBottom: 16 }}>
          <div style={s.statCard}>
            <div style={s.lbl}>Total de treinos</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.accent, marginTop: 4 }}>{historico.length}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.lbl}>Sequência</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.orange, marginTop: 4 }}>{streak}🔥</div>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Configurações</div>
          <div style={{ marginBottom: 12 }}>
            <div style={s.lbl}>Seu nome</div>
            <input value={nome} onChange={e => setNome(e.target.value)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={s.lbl}>Academia</div>
            <select value={academia} onChange={e => setAcademia(e.target.value)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontFamily: "inherit", fontSize: 14, width: "100%" }}>
              <option value="fitzone">FitZone Campinas</option>
              <option value="ironhouse">Iron House SP</option>
              <option value="livre">Treino Livre</option>
            </select>
          </div>
          <button onClick={() => { setUser({ ...user, nome, academia }); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
            style={{ ...btnStyle(), width: "100%", padding: 13 }}>
            {saved ? "✓ Salvo!" : "Salvar"}
          </button>
        </div>
      </div>
      <BottomNav screen="perfil" setScreen={setScreen} />
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [user, setUser] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [streak, setStreak] = useState(0);
  const [treinoConfig, setTreinoConfig] = useState(null);
  const [execucaoData, setExecucaoData] = useState(null);
  const [resultadoFinal, setResultadoFinal] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("gymAI_state");
    if (saved) {
      try {
        const { user: u, historico: h, streak: st } = JSON.parse(saved);
        if (u) { setUser(u); setHistorico(h || []); setStreak(st || 0); setScreen("home"); }
      } catch (e) {}
    }
  }, []);

  const saveState = (u, h, st) => {
    localStorage.setItem("gymAI_state", JSON.stringify({ user: u, historico: h, streak: st }));
  };

  if (screen === "onboarding") return (
    <Onboarding onFinish={u => { setUser(u); setScreen("home"); saveState(u, [], 0); }} />
  );
  if (!user) return null;

  if (screen === "execucao" && execucaoData) return (
    <Execucao exercicios={execucaoData.exercicios} config={execucaoData.config} setScreen={setScreen}
      onConcluir={resultado => { setResultadoFinal(resultado); setScreen("conclusao"); }} />
  );

  if (screen === "conclusao" && resultadoFinal) return (
    <Conclusao resultado={resultadoFinal} onSalvar={duracao => {
      const now = new Date();
      const nova = {
        titulo: "Treino — " + resultadoFinal.config.musculos.join(" & "),
        duracao, exercicios: resultadoFinal.exercicios.length,
        musculos: resultadoFinal.config.musculos,
        data: now.toISOString(),
        dataStr: now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      };
      const novoHistorico = [...historico, nova];
      const novoStreak = streak + 1;
      setHistorico(novoHistorico); setStreak(novoStreak);
      saveState(user, novoHistorico, novoStreak);
      setResultadoFinal(null); setExecucaoData(null); setScreen("home");
    }} />
  );

  if (screen === "sugestao" && treinoConfig) return (
    <Sugestao config={treinoConfig} setScreen={setScreen}
      onIniciar={exercicios => { setExecucaoData({ exercicios, config: treinoConfig }); setScreen("execucao"); }} />
  );

  const navScreens = {
    home: <Home user={user} historico={historico} streak={streak} setScreen={setScreen} />,
    treino: <ConfigTreino user={user} historico={historico} setScreen={setScreen}
      onGerar={config => setTreinoConfig(config)} />,
    historico: <Historico historico={historico} setScreen={setScreen} />,
    perfil: <Perfil user={user} setUser={u => { setUser(u); saveState(u, historico, streak); }} historico={historico} streak={streak} setScreen={setScreen} />,
  };

  return navScreens[screen] || navScreens.home;
}
