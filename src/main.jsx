// ─── main.jsx v2 ──────────────────────────────────────────────────────────────
// Injeta todos os dados reais do Supabase no App.jsx via window.gymData

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthScreen } from './AuthScreen.jsx'
import { useGymAI } from './useGymAI.js'

function Root() {
  const gym = useGymAI()

  if (gym.authLoading) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', display:'flex',
      alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:40 }}>⚡</div>
      <div style={{ color:'#6B6B85', fontSize:14 }}>Carregando...</div>
    </div>
  )

  if (!gym.user) return <AuthScreen onSignIn={gym.signIn} onSignUp={gym.signUp} />

  // ── Expõe dados reais para o App.jsx consumir via window.gymData ──────────
  window.gymData = {
    // Perfil
    user: gym.user,
    profile: gym.profile,
    nome: gym.profile?.nome || gym.user?.email?.split('@')[0] || 'Atleta',
    nivel: gym.profile?.nivel || 'iniciante',
    academiaId: gym.profile?.academia_id,
    avatar: gym.profile?.avatar || {},
    tipo: gym.profile?.tipo || 'aluno',

    // Sessões e histórico
    sessions: gym.sessions,
    sessoesSemana: gym.sessoesSemana,
    treinosSemana: gym.treinosSemana,       // substitui TREINOS_SEMANA
    historicoExercicios: gym.historicoExercicios, // substitui HISTORICO_EXERCICIOS

    // Stats derivados
    streak: gym.streak,
    tempoMedio: gym.tempoMedio,
    musculosRecentes: gym.musculosRecentes,
    totalTreinos: gym.sessions.length,

    // Gamificação
    xp: gym.xpAtual,
    nivelGamificacao: gym.nivelAtual,
    xpLevels: gym.XP_LEVELS,
    conquistas: gym.conquistas,
    missoes: gym.missoes,

    // Anamnese
    anamnese: gym.anamnese,

    // Check-in
    checkinHoje: gym.checkinHoje,

    // Planos
    planos: gym.planos,

    // Personal
    alunos: gym.alunos,

    // Ações
    saveSession: gym.saveSession,
    updateProfile: gym.updateProfile,
    saveAvatar: gym.saveAvatar,
    saveAnamnese: gym.saveAnamnese,
    saveCheckin: gym.saveCheckin,
    completarMissao: gym.completarMissao,
    salvarPlano: gym.salvarPlano,
    fetchAlunos: gym.fetchAlunos,
    associarAluno: gym.associarAluno,
    signOut: gym.signOut,
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)
