// ─── AuthScreen.jsx ───────────────────────────────────────────────────────────
// Tela de login/cadastro. Substitui o onboarding mockado do App.jsx.
// Uso: renderize antes do App principal se !gym.user

import { useState } from 'react'

const C = {
  bg: "#0A0A0F", surface: "#13131A", card: "#1C1C28", border: "#2A2A3A",
  accent: "#C8F135", red: "#FF4757", text: "#F0F0F8", muted: "#6B6B85",
}

export function AuthScreen({ onSignIn, onSignUp }) {
  const [modo, setModo]       = useState('login')   // 'login' | 'cadastro'
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [nome, setNome]       = useState('')
  const [erro, setErro]       = useState('')
  const [loading, setLoading] = useState(false)

  const input = (value, onChange, placeholder, type = 'text') => (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
        padding: '11px 14px', color: C.text, fontFamily: 'inherit', fontSize: 14,
        width: '100%', marginBottom: 12 }}
    />
  )

  const handleSubmit = async () => {
    setErro('')
    if (!email || !senha) { setErro('Preencha todos os campos'); return }
    if (modo === 'cadastro' && !nome) { setErro('Digite seu nome'); return }
    setLoading(true)
    try {
      let result
      if (modo === 'login') {
        result = await onSignIn(email, senha)
      } else {
        result = await onSignUp(email, senha, nome)
      }
      if (result?.error) setErro(result.error.message || 'Erro ao autenticar')
    } catch(e) {
      setErro('Erro inesperado. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>⚡</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, letterSpacing: -1 }}>GymAI</div>
          <div style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>Seu personal trainer inteligente</div>
        </div>

        {/* Toggle login/cadastro */}
        <div style={{ display: 'flex', background: C.card, borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login', 'cadastro'].map(m => (
            <button key={m} onClick={() => { setModo(m); setErro('') }}
              style={{ flex: 1, padding: '9px 0', border: 'none', borderRadius: 7, cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                background: modo === m ? C.accent : 'transparent',
                color: modo === m ? '#000' : C.muted }}>
              {m === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        {/* Formulário */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {modo === 'cadastro' && input(nome, setNome, 'Seu nome')}
          {input(email, setEmail, 'Email', 'email')}
          {input(senha, setSenha, 'Senha', 'password')}

          {erro && (
            <div style={{ padding: '10px 14px', background: `${C.red}15`, border: `1px solid ${C.red}30`,
              borderRadius: 8, color: C.red, fontSize: 13, marginBottom: 12 }}>
              {erro}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: C.accent, color: '#000', border: 'none', borderRadius: 8,
              padding: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar →' : 'Criar conta →'}
          </button>
        </div>
      </div>
    </div>
  )
}
