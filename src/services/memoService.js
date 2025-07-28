import { generateMemoId } from '../utils/index.js';

class MemoService {
  constructor() {
    this.dbName = 'VoiceMemosDB'
    this.dbVersion = 2 // Увеличиваем версию для обновления схемы
    this.storeName = 'memos'
    this.db = null
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('createdAt', 'createdAt', { unique: false })
          store.createIndex('type', 'type', { unique: false })
        }
      }
    })
  }

  async getAllMemos() {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const memos = request.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        resolve(memos)
      }
    })
  }

  async createMemo(memoData) {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      const id = generateMemoId(memoData);
      const memo = {
        id,
        ...memoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const request = store.add(memo)

      request.onerror = () => {
        console.error('Error creating memo:', request.error)
        reject(request.error)
      }
      request.onsuccess = () => {
        resolve(memo)
      }
    })
  }

  async updateMemo(id, memoData) {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      const getRequest = store.get(id)
      
      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const existingMemo = getRequest.result
        if (!existingMemo) {
          reject(new Error('Memo not found'))
          return
        }

        const updatedMemo = {
          ...existingMemo,
          ...memoData,
          updatedAt: new Date().toISOString()
        }

        const putRequest = store.put(updatedMemo)
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve(updatedMemo)
      }
    })
  }

  async deleteMemo(id) {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getMemoById(id) {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }
}

export default new MemoService() 