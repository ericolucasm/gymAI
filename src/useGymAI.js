// ─── useGymAI.js ──────────────────────────────────────────────────────────────
// Hook central de dados do GymAI.
// Substitui todos os dados mockados do App.jsx por dados reais do Supabase.
// Uso: importe este hook no App.jsx e passe os dados como props para as telas.
//
// import { useGymAI } from './useGymAI'
// const gym = useGymAI()
// <AlunoDashboard sessions={gym.sessions} user={gym.user} ... />

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useGymAI() {
  const [user, setUser]           = useState(null)   // usuário autenticado
  const [profile, setProfile]     = useState(null)   // dados do perfil (tabela users)
  const [sessions, setSessions]   = useState([])     // sessões de treino
  const [loading, setLoading]     = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  // ── Auth: escuta mudanças de sessão ──────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Carrega perfil e sessões quando o usuário logar ───────────────────────
  useEffect(() => {
    if (!user) { setLoading(false); return }
    Promise.all([fetchProfile(), fetchSessions()])
      .finally(() => setLoading(false))
  }, [user])

  // ── Perfil ────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    if (!error && data) setProfile(data)
    // Se não existe perfil ainda, cria com dados básicos do auth
    if (error?.code === 'PGRST116') {
      const { data: novo } = await supabase
        .from('users')
        .insert({ id: user.id, email: user.email, nome: user.email.split('@')[0] })
        .select()
        .single()
      if (novo) setProfile(novo)
    }
  }, [user])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error && data) setProfile(data)
    return { data, error }
  }, [user])

  // ── Sessões ───────────────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        session_exercises (
          *,
          series ( * )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error && data) setSessions(data)
  }, [user])

  // Salva uma sessão completa (ao concluir treino)
  const saveSession = useCallback(async ({ titulo, musculos, duracao_min, metodologia, foco, academia_id, exercises }) => {
    if (!user) return { error: 'Não autenticado' }

    // 1. Cria a sessão
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, titulo, musculos, duracao_min, metodologia, foco, academia_id })
      .select()
      .single()
    if (sessionError) return { error: sessionError }

    // 2. Cria os exercícios da sessão
    const exRows = exercises.map((ex, i) => ({
      session_id: session.id,
      name: ex.name,
      muscle: ex.muscle,
      aparelho: ex.aparelho,
      sets: ex.sets,
      reps: String(ex.reps),
      ordem: i,
    }))
    const { data: exData, error: exError } = await supabase
      .from('session_exercises')
      .insert(exRows)
      .select()
    if (exError) return { error: exError }

    // 3. Cria as séries de cada exercício
    const seriesRows = exData.flatMap((dbEx, i) => {
      const doneData = exercises[i]?.done || []
      return doneData.map((sr, j) => ({
        exercise_id: dbEx.id,
        serie_num: j + 1,
        kg: sr.kg,
        reps: sr.reps,
      }))
    })
    if (seriesRows.length > 0) {
      await supabase.from('series').insert(seriesRows)
    }

    // 4. Atualiza o estado local
    await fetchSessions()
    return { data: session }
  }, [user, fetchSessions])

  // ── Auth helpers ──────────────────────────────────────────────────────────
  const signUp = async (email, password, nome) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) {
      await supabase.from('users').insert({ id: data.user.id, email, nome })
    }
    return { data, error }
  }

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setSessions([])
  }

  // ── Dados derivados (equivalentes aos mockados do App.jsx) ────────────────

  // Sessões da última semana
  const sessoesSemana = sessions.filter(s => {
    const diff = (new Date() - new Date(s.created_at)) / (1000 * 60 * 60 * 24)
    return diff < 7
  })

  // Streak: dias consecutivos com treino
  const streak = (() => {
    if (sessions.length === 0) return 0
    const dias = [...new Set(sessions.map(s =>
      new Date(s.created_at).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a))
    let count = 0
    let current = new Date()
    for (const dia of dias) {
      const d = new Date(dia)
      const diff = Math.floor((current - d) / (1000 * 60 * 60 * 24))
      if (diff <= 1) { count++; current = d }
      else break
    }
    return count
  })()

  // Grupos musculares treinados recentemente (últimas 2 sessões)
  const musculosRecentes = sessions.slice(0, 2).flatMap(s => s.musculos || [])

  // Tempo médio de treino
  const tempoMedio = sessoesSemana.length > 0
    ? Math.round(sessoesSemana.reduce((a, s) => a + (s.duracao_min || 0), 0) / sessoesSemana.length)
    : null

  return {
    // Estado
    user,
    profile,
    sessions,
    loading,
    authLoading,

    // Dados derivados
    sessoesSemana,
    streak,
    musculosRecentes,
    tempoMedio,

    // Ações
    saveSession,
    updateProfile,
    fetchSessions,
    signUp,
    signIn,
    signOut,
  }
}
