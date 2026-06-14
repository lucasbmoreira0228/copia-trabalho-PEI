import { store } from '../store.js';
import { renderLayout } from '../components/layout.js';

export function FinancialView() {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto space-y-6 slide-up';

    const transactions = store.getAll('transactions');
    const works = store.getAll('works');

    const incomes = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');

    const totalIncome = incomes.reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const totalExpense = expenses.reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const balance = totalIncome - totalExpense;

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Controle Financeiro</h1>
                <p class="text-sm text-slate-500 mt-1">Gestão de pagamentos, despesas e orçamento por obra.</p>
            </div>
        </div>

        <!-- Summary Widgets -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-emerald-50 text-emerald-900 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                    <p class="text-emerald-700 text-sm font-semibold uppercase tracking-wider mb-1">Receitas Manuais/Pagamentos</p>
                    <h2 class="text-3xl font-bold font-display">R$ ${totalIncome.toFixed(2).replace('.', ',')}</h2>
                </div>
                <div class="w-12 h-12 rounded-full bg-emerald-200 shadow-inner flex items-center justify-center text-emerald-700 text-2xl">
                    <i class="ph-bold ph-arrow-up"></i>
                </div>
            </div>
            
            <div class="bg-rose-50 text-rose-900 p-6 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                    <p class="text-rose-700 text-sm font-semibold uppercase tracking-wider mb-1">Despesas / NF</p>
                    <h2 class="text-3xl font-bold font-display">R$ ${totalExpense.toFixed(2).replace('.', ',')}</h2>
                </div>
                <div class="w-12 h-12 rounded-full bg-rose-200 shadow-inner flex items-center justify-center text-rose-700 text-2xl">
                    <i class="ph-bold ph-arrow-down"></i>
                </div>
            </div>

            <div class="bg-brand-50 text-brand-900 p-6 rounded-2xl border border-brand-100 flex items-center justify-between">
                <div>
                    <p class="text-brand-700 text-sm font-semibold uppercase tracking-wider mb-1">Saldo Líquido</p>
                    <h2 class="text-3xl font-bold font-display">R$ ${balance.toFixed(2).replace('.', ',')}</h2>
                </div>
                <div class="w-12 h-12 rounded-full bg-brand-200 shadow-inner flex items-center justify-center text-brand-700 text-2xl">
                    <i class="ph-bold ph-wallet"></i>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Launch transaction form -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 class="font-bold text-slate-800 font-display mb-4 flex items-center gap-2">
                    <i class="ph-bold ph-plus-circle text-brand-500"></i>
                    Lançar Transação
                </h3>
                <form id="txForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Tipo de Transação *</label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="cursor-pointer">
                                <input type="radio" name="txType" value="income" class="peer sr-only" checked>
                                <div class="px-4 py-3 rounded-lg border border-slate-200 text-center font-medium text-slate-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 transition-all flex items-center justify-center gap-2">
                                    <i class="ph-bold ph-arrow-up"></i> Receita
                                </div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" name="txType" value="expense" class="peer sr-only">
                                <div class="px-4 py-3 rounded-lg border border-slate-200 text-center font-medium text-slate-600 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700 transition-all flex items-center justify-center gap-2">
                                    <i class="ph-bold ph-arrow-down"></i> Despesa
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label>
                        <input type="number" step="0.01" id="txAmount" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 text-lg font-bold text-slate-800" placeholder="0.00">
                    </div>

                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Obra Associada (Opcional)</label>
                        <select id="txWork" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 bg-white">
                            <option value="">Nenhuma Obra...</option>
                            ${works.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descrição / Nota Fiscal *</label>
                        <input type="text" id="txDesc" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500" placeholder="Ex: Pagamento 1ª Parcela / Compra de Cabos NF 1024">
                    </div>

                    <button type="submit" class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors mt-4">
                        Confirmar Lançamento
                    </button>
                </form>
            </div>

            <!-- Transaction List -->
            <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div class="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <h3 class="font-semibold text-slate-800">Histórico de Transações</h3>
                </div>
                <!-- Transactions list -->
                <div class="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[500px]">
                    ${transactions.length === 0 ? `
                        <div class="p-12 text-center text-slate-500 flex flex-col items-center">
                            <i class="ph ph-receipt text-5xl text-slate-300 mb-3"></i>
                            <p class="font-medium text-slate-700">Nenhum lançamento no financeiro.</p>
                            <p class="text-sm mt-1">Suas receitas e despesas aparecerão aqui.</p>
                        </div>
                    ` : transactions.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(tx => {
                        const isIncome = tx.type === 'income';
                        const work = tx.workId ? works.find(w => w.id === tx.workId) : null;
                        
                        return `
                        <div class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">
                                    <i class="ph-bold ${isIncome ? 'ph-arrow-up-right' : 'ph-arrow-down-left'} text-lg"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-slate-900 leading-tight">${tx.description}</p>
                                    <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                        <span class="flex items-center gap-1"><i class="ph-fill ph-calendar-blank"></i> ${new Date(tx.createdAt).toLocaleDateString('pt-BR')}</span>
                                        ${work ? `<span class="flex items-center gap-1 px-2 py-[0.5px] bg-slate-100 rounded text-slate-600"><i class="ph-fill ph-buildings"></i> ${work.name}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                           <div class="text-right">
                                <p class="font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}">${isIncome ? '+' : '-'} R$ ${parseFloat(tx.amount).toFixed(2).replace('.', ',')}</p>
                            </div>
                            <button onclick="window.deleteTx('${tx.id}')" class="text-slate-400 hover:text-rose-500 p-2 ml-2 transition-colors">
                                <i class="ph-fill ph-trash"></i>
                            </button>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const form = document.getElementById('txForm');
        if (form) {
             form.addEventListener('submit', (e) => {
                e.preventDefault();
                store.create('transactions', {
                    type: document.querySelector('input[name="txType"]:checked').value,
                    amount: document.getElementById('txAmount').value,
                    workId: document.getElementById('txWork').value || null,
                    description: document.getElementById('txDesc').value
                });
                window.location.reload();
             });
        }
    }, 0);

    window.deleteTx = (id) => {
        if(confirm('Tem certeza que deseja apagar essa transação financeira?')) {
            store.delete('transactions', id);
            window.location.reload();
        }
    }

    return renderLayout(container, '/financeiro');
}
