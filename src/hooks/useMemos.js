import { useState, useEffect, useCallback } from 'react'
import memoService from '../services/memoService'

export const useMemos = () => {
  const [memos, setMemos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMemos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const loadedMemos = await memoService.getAllMemos()
      setMemos(loadedMemos)
    } catch (err) {
      console.error('Ошибка загрузки заметок:', err)
      setError('Не удалось загрузить заметки')
    } finally {
      setLoading(false)
    }
  }, [])

  const createMemo = useCallback(async (memoData) => {
    try {
      setError(null)
      const newMemo = await memoService.createMemo(memoData)
      setMemos(prevMemos => [newMemo, ...prevMemos])
      return newMemo
    } catch (err) {
      console.error('Ошибка создания заметки:', err)
      setError('Не удалось создать заметку')
      throw err
    }
  }, [])

  const updateMemo = useCallback(async (id, memoData) => {
    try {
      setError(null)
      const updatedMemo = await memoService.updateMemo(id, memoData)
      setMemos(prevMemos => 
        prevMemos.map(memo => 
          memo.id === id ? updatedMemo : memo
        )
      )
      return updatedMemo
    } catch (err) {
      console.error('Ошибка обновления заметки:', err)
      setError('Не удалось обновить заметку')
      throw err
    }
  }, [])

  const deleteMemo = useCallback(async (id) => {
    try {
      setError(null)
      await memoService.deleteMemo(id)
      setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id))
    } catch (err) {
      console.error('Ошибка удаления заметки:', err)
      setError('Не удалось удалить заметку')
      throw err
    }
  }, [])

  const getMemoById = useCallback(async (id) => {
    try {
      setError(null)
      return await memoService.getMemoById(id)
    } catch (err) {
      console.error('Ошибка получения заметки:', err)
      setError('Не удалось получить заметку')
      throw err
    }
  }, [])

  useEffect(() => {
    loadMemos()
  }, [loadMemos])

  return {
    memos,
    loading,
    error,
    createMemo,
    updateMemo,
    deleteMemo,
    getMemoById,
    reloadMemos: loadMemos
  }
} 