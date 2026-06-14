import { store } from '../store.js';
import { renderLayout } from '../components/layout.js';

export function DashboardView() {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto space-y-6 slide-up';

    const works = store.getAll('works');
    const clients = store.getAll('clients');
    const transactions = store.getAll('transactions');

    const totalIncomes = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncomes - totalExpenses;

    const activeWorksCount = works.filter(w => w.status !== 'completed').length;

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Dashboard</h1>
                <p class="text-sm text-slate-500 mt-1">Visão geral das obras, clientes e financeiro.</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="window.location.hash='#/obras/nova'" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors hover-lift flex items-center gap-2">
                    <i class="ph ph-plus-circle text-lg"></i>
                    Nova Obra
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <!-- Stat Card 1 -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover-lift stagger-1">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                        <i class="ph ph-buildings text-xl"></i>
                    </div>
                    <span class="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Em andamento
                    </span>
                </div>
                <div>
                    <h3 class="text-3xl font-bold text-slate-900 font-display">${activeWorksCount}</h3>
                    <p class="text-sm font-medium text-slate-500 mt-1">Obras Ativas</p>
                </div>
            </div>

            <!-- Stat Card 2 -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover-lift stagger-2">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <i class="ph ph-users text-xl"></i>
                    </div>
                </div>
                <div>
                    <h3 class="text-3xl font-bold text-slate-900 font-display">${clients.length}</h3>
                    <p class="text-sm font-medium text-slate-500 mt-1">Clientes Cadastrados</p>
                </div>
            </div>

            <!-- Stat Card 3 -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover-lift stagger-3">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <i class="ph ph-trend-up text-xl"></i>
                    </div>
                </div>
                <div>
                    <h3 class="text-3xl font-bold text-slate-900 font-display">R$ ${totalIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p class="text-sm font-medium text-slate-500 mt-1">Receitas Totais</p>
                </div>
            </div>

            <!-- Stat Card 4 -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover-lift stagger-3">
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <i class="ph ph-trend-down text-xl"></i>
                    </div>
                </div>
                <div>
                    <h3 class="text-3xl font-bold text-slate-900 font-display">R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p class="text-sm font-medium text-slate-500 mt-1">Custos & Despesas</p>
                </div>
            </div>
        </div>

        <!-- Recent Works Table -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm fade-in mt-6">
            <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 class="text-lg font-semibold text-slate-900 font-display">Obras Recentes</h2>
                <a href="#/obras" class="text-sm font-medium text-brand-600 hover:text-brand-700">Ver todas</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th class="px-6 py-3 font-semibold">Obra</th>
                            <th class="px-6 py-3 font-semibold">Cliente</th>
                            <th class="px-6 py-3 font-semibold">Status</th>
                            <th class="px-6 py-3 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        ${works.length === 0 ? `
                            <tr>
                                <td colspan="4" class="px-6 py-8 text-center text-slate-500">
                                    <div class="flex flex-col items-center justify-center">
                                        <i class="ph ph-buildings text-4xl text-slate-300 mb-2"></i>
                                        <p>Nenhuma obra cadastrada ainda.</p>
                                    </div>
                                </td>
                            </tr>
                        ` : works.slice(0, 5).map(work => {
                            const client = clients.find(c => c.id === work.clientId) || { name: 'Desconhecido' };
                            return `
                                <tr class="hover:bg-slate-50 transition-colors group">
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-slate-900">${work.name}</div>
                                        <div class="text-xs text-slate-500 truncate w-48">${work.address || ''}</div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-600">${client.name}</td>
                                    <td class="px-6 py-4">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            ${work.status || 'Em andamento'}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <a href="#/obras/${work.id}" class="text-brand-600 hover:text-brand-900 font-medium text-sm">Detalhes</a>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return renderLayout(container, '/');
}
