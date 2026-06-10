// ─── useGymAI.js v2 ───────────────────────────────────────────────────────────
// Hook central de dados — conecta o App.jsx ao Supabase.
// Cobre todas as 14 integrações mapeadas.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// ─── CATÁLOGO DE CONQUISTAS (critérios automáticos) ───────────────────────────
const CONQUISTAS_CRITERIOS = [
  { id: 'primeiro_treino',   check: (s) => s.length >= 1 },
  { id: 'cincoDias',         check: (_, streak) => streak >= 5 },
  { id: 'semanaCompleta',    check: (s) => {
    const semana = s.filter(x => (new Date() - new Date(x.created_at)) / 86400000 < 7)
    return semana.length >= 5
  }},
  { id: 'volumeTotal',       check: (s) => {
    const vol = s.flatMap(x => x.session_exercises || [])
      .flatMap(e => e.series || [])
      .reduce((a, sr) => a + (sr.kg || 0) * (sr.reps || 0), 0)
    return vol >= 10000
  }},
  { id: 'trintaDias',        check: (_, streak) => streak >= 30 },
  { id: 'primeiro_pr',       check: (s) => {
    // PR = mesma série com kg maior que a média anterior
    const byEx = {}
    s.forEach(sess => (sess.session_exercises || []).forEach(ex => {
      const maxKg = Math.max(...(ex.series || []).map(sr => sr.kg || 0))
      if (!byEx[ex.name]) byEx[ex.name] = []
      byEx[ex.name].push(maxKg)
    }))
    return Object.values(byEx).some(cargas => cargas.length >= 2 && cargas[0] > cargas[1])
  }},
]

// XP por ação
const XP_ACTIONS = { treino_completo: 100, serie_completa: 5, pr_batido: 50, checkin: 10 }

export function useGymAI() {
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [sessions, setSessions]     = useState([])
  const [anamnese, setAnamnese]     = useState(null)
  const [checkinHoje, setCheckinHoje] = useState(null)
  const [conquistas, setConquistas] = useState([])
  const [missoes, setMissoes]       = useState([])
  const [planos, setPlanos]         = useState([])
  const [alunos, setAlunos]         = useState([])       // para persona personal
  const [loading, setLoading]       = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  // ── AUTH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setLoading(false); return }
    loadAll().finally(() => setLoading(false))
  }, [user])

  const loadAll = useCallback(async () => {
    if (!user) return
    await Promise.all([
      fetchProfile(),
      fetchSessions(),
      fetchAnamnese(),
      fetchCheckinHoje(),
      fetchConquistas(),
      fetchMissoes(),
      fetchPlanos(),
    ])
  }, [user])

  // ── PERFIL ────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()
    if (!error && data) { setProfile(data); return }
    if (error?.code === 'PGRST116') {
      const { data: novo } = await supabase
        .from('users')
        .insert({ id: user.id, email: user.email, nome: user.email.split('@')[0] })
        .select().single()
      if (novo) setProfile(novo)
    }
  }, [user])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: 'Não autenticado' }
    const { data, error } = await supabase.from('users').update(updates).eq('id', user.id).select().single()
    if (!error && data) setProfile(data)
    return { data, error }
  }, [user])

  const saveAvatar = useCallback(async (avatarConfig) => {
    return await updateProfile({ avatar: avatarConfig })
  }, [updateProfile])

  // ── SESSÕES ───────────────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('sessions')
      .select(`*, session_exercises(*, series(*))`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
    if (!error && data) setSessions(data)
  }, [user])

  const saveSession = useCallback(async ({ titulo, musculos, duracao_min, metodologia, foco, academia_id, exercises }) => {
    if (!user) return { error: 'Não autenticado' }

    // 1. Sessão
    const { data: session, error: sErr } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, titulo, musculos, duracao_min, metodologia, foco, academia_id })
      .select().single()
    if (sErr) return { error: sErr }

    // 2. Exercícios
    const exRows = exercises.map((ex, i) => ({
      session_id: session.id, name: ex.name, muscle: ex.muscle,
      aparelho: ex.aparelho || ex.aparelhoId, sets: ex.sets,
      reps: String(ex.reps), ordem: i,
    }))
    const { data: exData, error: exErr } = await supabase
      .from('session_exercises').insert(exRows).select()
    if (exErr) return { error: exErr }

    // 3. Séries
    const seriesRows = exData.flatMap((dbEx, i) =>
      (exercises[i]?.done || []).map((sr, j) => ({
        exercise_id: dbEx.id, serie_num: j + 1, kg: sr.kg, reps: sr.reps,
      }))
    ).filter(sr => sr.exercise_id)
    if (seriesRows.length > 0) await supabase.from('series').insert(seriesRows)

    // 4. XP + streak
    const novoXp = (profile?.xp || 0) + XP_ACTIONS.treino_completo +
      seriesRows.length * XP_ACTIONS.serie_completa
    const novoStreak = calcStreak([{ created_at: new Date().toISOString() }, ...sessions])
    await supabase.from('users').update({ xp: novoXp, streak: novoStreak }).eq('id', user.id)

    // 5. Atualiza estado e verifica conquistas
    await fetchSessions()
    await fetchProfile()
    await verificarConquistas()
    return { data: session }
  }, [user, profile, sessions, fetchSessions, fetchProfile])

  // ── ANAMNESE ──────────────────────────────────────────────────────────────
  const fetchAnamnese = useCallback(async () => {
    if (!user) return
    const { data } = await supabase.from('anamnese').select('*').eq('user_id', user.id).single()
    if (data) setAnamnese(data)
  }, [user])

  const saveAnamnese = useCallback(async (form) => {
    if (!user) return { error: 'Não autenticado' }
    const payload = { ...form, user_id: user.id, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from('anamnese').upsert(payload, { onConflict: 'user_id' }).select().single()
    if (!error && data) setAnamnese(data)
    return { data, error }
  }, [user])

  // ── CHECK-IN DE HUMOR ─────────────────────────────────────────────────────
  const fetchCheckinHoje = useCallback(async () => {
    if (!user) return
    const hoje = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('checkins').select('*').eq('user_id', user.id)
      .gte('created_at', hoje).order('created_at', { ascending: false }).limit(1)
    if (data?.length > 0) setCheckinHoje(data[0].humor)
  }, [user])

  const saveCheckin = useCallback(async (humor) => {
    if (!user) return { error: 'Não autenticado' }
    const { data, error } = await supabase
      .from('checkins').insert({ user_id: user.id, humor }).select().single()
    if (!error) {
      setCheckinHoje(humor)
      const novoXp = (profile?.xp || 0) + XP_ACTIONS.checkin
      await supabase.from('users').update({ xp: novoXp }).eq('id', user.id)
      await fetchProfile()
    }
    return { data, error }
  }, [user, profile, fetchProfile])

  // ── CONQUISTAS ────────────────────────────────────────────────────────────
  const fetchConquistas = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('conquistas_usuarios').select('*').eq('user_id', user.id)
    if (data) setConquistas(data.map(c => c.conquista_id))
  }, [user])

  const verificarConquistas = useCallback(async () => {
    if (!user) return
    const { data: currentSessions } = await supabase
      .from('sessions').select(`*, session_exercises(*, series(*))`)
      .eq('user_id', user.id)
    const streak = calcStreak(currentSessions || [])
    const novas = CONQUISTAS_CRITERIOS.filter(c =>
      !conquistas.includes(c.id) && c.check(currentSessions || [], streak)
    )
    if (novas.length > 0) {
      await supabase.from('conquistas_usuarios').insert(
        novas.map(c => ({ user_id: user.id, conquista_id: c.id }))
      )
      const xpBonus = novas.reduce((a, c) => a + (c.xp || 100), 0)
      await supabase.from('users').update({ xp: (profile?.xp || 0) + xpBonus }).eq('id', user.id)
      await fetchConquistas()
      await fetchProfile()
    }
  }, [user, conquistas, profile, fetchConquistas, fetchProfile])

  // ── MISSÕES ───────────────────────────────────────────────────────────────
  const fetchMissoes = useCallback(async () => {
    if (!user) return
    const seg = getSegundaFeira()
    const { data } = await supabase
      .from('missoes_completadas').select('*')
      .eq('user_id', user.id).eq('semana', seg)
    if (data) setMissoes(data.map(m => m.missao_id))
  }, [user])

  const completarMissao = useCallback(async (missaoId) => {
    if (!user || missoes.includes(missaoId)) return
    const seg = getSegundaFeira()
    await supabase.from('missoes_completadas').insert({ user_id: user.id, missao_id: missaoId, semana: seg })
    setMissoes(prev => [...prev, missaoId])
  }, [user, missoes])

  // ── PLANOS DE TREINO ──────────────────────────────────────────────────────
  const fetchPlanos = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('workout_plans').select('*')
      .or(`criado_por.eq.${user.id},aluno_id.eq.${user.id}`)
      .eq('ativo', true).order('created_at', { ascending: false })
    if (data) setPlanos(data)
  }, [user])

  const salvarPlano = useCallback(async (plano) => {
    if (!user) return { error: 'Não autenticado' }
    const { data, error } = await supabase
      .from('workout_plans').insert({ ...plano, criado_por: user.id }).select().single()
    if (!error && data) { setPlanos(prev => [data, ...prev]) }
    return { data, error }
  }, [user])

  // ── PERSONAL: alunos vinculados ───────────────────────────────────────────
  const fetchAlunos = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('personal_alunos')
      .select(`aluno_id, users!personal_alunos_aluno_id_fkey(id, nome, email, xp, streak, avatar)`)
      .eq('personal_id', user.id)
    if (data) {
      const alunoIds = data.map(d => d.aluno_id)
      // Busca última sessão de cada aluno para calcular status
      const { data: ultimasSessoes } = await supabase
        .from('sessions').select('user_id, created_at')
        .in('user_id', alunoIds).order('created_at', { ascending: false })
      const alunosComStatus = data.map(d => {
        const ultima = ultimasSessoes?.find(s => s.user_id === d.aluno_id)
        const diasSemTreinar = ultima
          ? Math.floor((new Date() - new Date(ultima.created_at)) / 86400000)
          : 999
        return {
          ...d.users,
          last: ultima ? `Há ${diasSemTreinar} dia${diasSemTreinar !== 1 ? 's' : ''}` : 'Nunca treinou',
          status: diasSemTreinar <= 2 ? 'ok' : diasSemTreinar <= 5 ? 'alert' : 'danger',
          risco: diasSemTreinar > 3,
        }
      })
      setAlunos(alunosComStatus)
    }
  }, [user])

  const associarAluno = useCallback(async (emailAluno) => {
    if (!user) return { error: 'Não autenticado' }
    const { data: aluno } = await supabase.from('users').select('id').eq('email', emailAluno).single()
    if (!aluno) return { error: 'Aluno não encontrado' }
    const { data, error } = await supabase.from('personal_alunos')
      .insert({ personal_id: user.id, aluno_id: aluno.id }).select().single()
    if (!error) await fetchAlunos()
    return { data, error }
  }, [user, fetchAlunos])

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const calcStreak = (sessions) => {
    if (!sessions?.length) return 0
    const dias = [...new Set(sessions.map(s => new Date(s.created_at).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a))
    let count = 0
    let current = new Date()
    for (const dia of dias) {
      const diff = Math.floor((current - new Date(dia)) / 86400000)
      if (diff <= 1) { count++; current = new Date(dia) }
      else break
    }
    return count
  }

  const getSegundaFeira = () => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff)).toISOString().split('T')[0]
  }

  // ── DADOS DERIVADOS ───────────────────────────────────────────────────────
  const sessoesSemana = sessions.filter(s =>
    (new Date() - new Date(s.created_at)) / 86400000 < 7
  )

  const streak = calcStreak(sessions)

  const tempoMedio = sessoesSemana.length
    ? Math.round(sessoesSemana.reduce((a, s) => a + (s.duracao_min || 0), 0) / sessoesSemana.length)
    : null

  const musculosRecentes = sessions.slice(0, 2).flatMap(s => s.musculos || [])

  // Histórico de exercícios no formato que o App.jsx espera (HISTORICO_EXERCICIOS)
  const historicoExercicios = (() => {
    const map = {}
    sessions.forEach(sess => {
      (sess.session_exercises || []).forEach(ex => {
        if (!map[ex.name]) map[ex.name] = []
        const melhorSerie = (ex.series || []).reduce((a, sr) => sr.kg > (a?.kg || 0) ? sr : a, null)
        if (melhorSerie) {
          map[ex.name].push({
            data: new Date(sess.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            aparelho: ex.aparelho || '—',
            kg: melhorSerie.kg,
            reps: melhorSerie.reps,
            series: ex.series?.length || 1,
            academia: sess.academia_id || '—',
          })
        }
      })
    })
    return map
  })()

  // Treinos da semana no formato barData (BarChart)
  const treinosSemana = (() => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const hoje = new Date().getDay()
    return Array.from({ length: 7 }, (_, i) => {
      const dIdx = (hoje - 6 + i + 7) % 7
      const sess = sessoesSemana.find(s => new Date(s.created_at).getDay() === dIdx)
      return {
        day: dias[dIdx],
        date: sess ? new Date(sess.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '—',
        muscles: sess?.musculos || [],
        done: !!sess,
        durMin: sess?.duracao_min || 0,
        academia: sess?.academia_id || '',
        exercises: (sess?.session_exercises || []).map(ex => ({
          name: ex.name, muscle: ex.muscle, aparelho: ex.aparelho,
          kg: Math.max(...(ex.series || []).map(sr => sr.kg || 0), 0),
          reps: ex.reps, sets: ex.sets,
        })),
        vol: (sess?.session_exercises || []).flatMap(e => e.series || [])
          .reduce((a, sr) => a + (sr.kg || 0) * (sr.reps || 0), 0),
      }
    })
  })()

  // Nível de gamificação baseado no XP real
  const XP_LEVELS = [
    { nivel: 'Iniciante', xpMin: 0,    xpMax: 500,  cor: '#6B6B85', icon: '🌱' },
    { nivel: 'Dedicado',  xpMin: 500,  xpMax: 1500, cor: '#3D91FF', icon: '⚡' },
    { nivel: 'Avançado',  xpMin: 1500, xpMax: 3000, cor: '#9B59FF', icon: '🔥' },
    { nivel: 'Elite',     xpMin: 3000, xpMax: 6000, cor: '#FF7730', icon: '💎' },
    { nivel: 'Lendário',  xpMin: 6000, xpMax: 9999, cor: '#C8F135', icon: '👑' },
  ]
  const xpAtual = profile?.xp || 0
  const nivelAtual = XP_LEVELS.find(l => xpAtual >= l.xpMin && xpAtual < l.xpMax) || XP_LEVELS[0]

  // Auth helpers
  const signUp = async (email, password, nome) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) await supabase.from('users').insert({ id: data.user.id, email, nome })
    return { data, error }
  }
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null); setSessions([]); setAnamnese(null)
    setCheckinHoje(null); setConquistas([]); setMissoes([])
  }

  return {
    // Auth
    user, authLoading, signUp, signIn, signOut,
    // Perfil
    profile, loading, updateProfile, saveAvatar,
    // Sessões
    sessions, saveSession, fetchSessions,
    // Dados derivados (substitutos dos mocks)
    sessoesSemana, streak, tempoMedio, musculosRecentes,
    historicoExercicios, // substitui HISTORICO_EXERCICIOS
    treinosSemana,       // substitui TREINOS_SEMANA
    xpAtual, nivelAtual, XP_LEVELS,
    // Anamnese
    anamnese, saveAnamnese,
    // Check-in
    checkinHoje, saveCheckin,
    // Conquistas
    conquistas, verificarConquistas,
    // Missões
    missoes, completarMissao,
    // Planos
    planos, salvarPlano, fetchPlanos,
    // Personal
    alunos, fetchAlunos, associarAluno,
  }
}
