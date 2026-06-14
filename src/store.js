// LocalStorage based Data Store
const STORAGE_KEY = 'sgome_data_v1';

const INITIAL_DATA = {
    clients: [],
    works: [],      // Obras
    projects: [],   // Projetos associados a obras
    materials: [],  // Catálogo Base
    workMaterials: [], // Materiais associados a obras
    transactions: [], // Receitas e Despesas (Pagamentos e NFs)
    settings: {
        companyName: 'ACB Moreira Engenharia',
        user: 'Antônio Carlos Barbosa Moreira'
    }
};

export class Store {
    constructor() {
        this.data = this.load();
    }

    load() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing stored data", e);
                return { ...INITIAL_DATA };
            }
        }
        return { ...INITIAL_DATA };
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        // Dispatch an event to allow reactive components to update
        window.dispatchEvent(new CustomEvent('storeUpdated'));
    }

    // Generic CRUD
    create(collection, item) {
        if (!this.data[collection]) return null;
        const newItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        this.data[collection].push(newItem);
        this.save();
        return newItem;
    }

    getAll(collection) {
        return this.data[collection] || [];
    }

    getById(collection, id) {
        return (this.data[collection] || []).find(item => item.id === id);
    }

    update(collection, id, updates) {
        if (!this.data[collection]) return false;
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[collection][index] = {
                ...this.data[collection][index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.save();
            return true;
        }
        return false;
    }

    delete(collection, id) {
        if (!this.data[collection]) return false;
        const initialLength = this.data[collection].length;
        this.data[collection] = this.data[collection].filter(item => item.id !== id);
        this.save();
        return this.data[collection].length !== initialLength;
    }
}

export const store = new Store();
