import { Router } from './router.js';
import { store } from './store.js';

// Views
import { DashboardView } from './views/dashboard.js';
import { ClientsView } from './views/clients.js';
import { WorksView } from './views/works.js';
import { MaterialsView } from './views/materials.js';
import { FinancialView } from './views/financial.js';

const routes = [
    { path: '/', component: DashboardView },
    // Obras
    { path: '/obras', component: WorksView },
    { path: '/obras/:id', component: WorksView },
    
    // Clientes
    { path: '/clientes', component: ClientsView },
    { path: '/clientes/:id', component: ClientsView },
    
    // Materiais
    { path: '/materiais', component: MaterialsView },
    
    // Financeiro
    { path: '/financeiro', component: FinancialView },
    { path: "/login", component: async () => (await import("./views/login.js")).default },
    { path: '*', component: () => {
        const div = document.createElement('div');
        div.innerHTML = `<div class="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500 pb-20">
            <i class="ph-duotone ph-warning-circle text-6xl text-brand-300 mb-4"></i>
            <h2 class="text-2xl font-bold text-slate-800">404 - Página não encontrada</h2>
            <p class="mt-2 text-slate-500">A página que você está procurando não existe.</p>
            <a href="#/" class="mt-6 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">Voltar para Dashboard</a>
        </div>`;
        return div;
    }}
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Basic seed data if completely empty
    if (store.getAll('clients').length === 0 && store.getAll('works').length === 0) {
        console.log("Seeding initial mock data...");
        // Add a master client
        const c1 = store.create('clients', { 
            name: 'Prefeitura Municipal', 
            email: 'contato@prefeitura.gov.br', 
            phone: '27 3288-1234',
            document: '12.345.678/0001-90'
        });
        
        // Add a work
        store.create('works', {
            clientId: c1.id,
            name: 'Iluminação Praça Central',
            address: 'Centro, Marechal Floriano - ES',
            status: 'Em andamento',
            startDate: new Date().toISOString()
        });
    }

    const router = new Router('app', routes);
});

