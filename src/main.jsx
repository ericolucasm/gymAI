// ─── main.jsx ─────────────────────────────────────────────────────────────────
// Ponto de entrada do app.
// Gerencia auth: mostra AuthScreen se não logado, App se logado.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthScreen } from './AuthScreen.jsx'
import { useGymAI } from './useGymAI.js'

function Root() {
  const gym = useGymAI()

  // Carregando auth
  if (gym.authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>⚡</div>
        <div style={{ color: '#6B6B85', fontSize: 14 }}>Carregando...</div>
      </div>
    )
  }

  // Não autenticado → tela de login
  if (!gym.user) {
    return (
      <AuthScreen
        onSignIn={gym.signIn}
        onSignUp={gym.signUp}
      />
    )
  }

  // Autenticado → app completo
  // Passa os dados reais como window.gymData para o App.jsx da Mariana acessar
  window.gymData = {
    user: gym.user,
    profile: gym.profile,
    sessions: gym.sessions,
    sessoesSemana: gym.sessoesSemana,
    streak: gym.streak,
    musculosRecentes: gym.musculosRecentes,
    tempoMedio: gym.tempoMedio,
    saveSession: gym.saveSession,
    updateProfile: gym.updateProfile,
    signOut: gym.signOut,
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
