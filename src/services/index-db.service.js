export class IndexDbService {
  constructor(initCallback) {
    this.db = null;

    this.dbReq = indexedDB.open('chartsDb', 1);

    this.dbReq.onupgradeneeded = (event) => {
      this.db = event.target.result;

      let temperature = null;
      if (!this.db.objectStoreNames.contains('temperature')) {
        temperature = this.db.createObjectStore('temperature');
      } else {
        temperature = this.dbReq.transaction.objectStore('temperature');
      }
      temperature.createIndex('t', 't', { unique: true });

      let precipitation = null;
      if (!this.db.objectStoreNames.contains('precipitation')) {
        precipitation = this.db.createObjectStore('precipitation');
      } else {
        precipitation = this.dbReq.transaction.objectStore('precipitation');
      }
      precipitation.createIndex('t', 't', { unique: true });
    }

    this.dbReq.onsuccess = (event) => {
      this.db = event.target.result;
      initCallback();
    }
    this.dbReq.onerror = (event) => {
      console.error(event.target.errorCode);
    }
  }

  getData(type, start, end) {
    if (!this.db) {
      throw new Error('bd not created yet');
    }
    const tx = this.db.transaction([type], 'readonly');
    const store = tx.objectStore(type);
    const index = store.index('t');

    const keyRange = IDBKeyRange.bound(start, end);
    const req = index.openCursor(keyRange);
    const data = [];

    return new Promise((resolve, reject) => {
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor != null) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          resolve(data);
        }
      }
      req.onerror = (event) => {
        reject(event.target.errorCode);
      }
    });
  }

  addData(type, data) {
    if (!this.db) {
      throw new Error('bd not created yet');
    }
    const tx = this.db.transaction([type], 'readwrite');
    const store = tx.objectStore(type);
    if (data instanceof Array) {
      data.forEach((item) => {
        store.add(item, item.t);
      })
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        resolve(data);
      }
      tx.onerror = (event) => {
        reject(event.target.errorCode);
      }
    });
  }
}
