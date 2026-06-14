import { store } from '../store.js';
import { renderLayout } from '../components/layout.js';

export function ClientsView(params = {}) {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto space-y-6 slide-up';

    if (params.id) {
        return renderClientForm(container, params.id);
    }
    
    return renderClientList(container);
}

function renderClientList(container) {
    const clients = store.getAll('clients');

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Clientes</h1>
                <p class="text-sm text-slate-500 mt-1">Gerencie a carteira de clientes da construtora.</p>
            </div>
            <a href="#/clientes/novo" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors hover-lift flex items-center gap-2">
                <i class="ph ph-plus-circle text-lg"></i>
                Novo Cliente
            </a>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm fade-in mt-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th class="px-6 py-4 font-semibold">Nome/Empresa</th>
                            <th class="px-6 py-4 font-semibold">Contato</th>
                            <th class="px-6 py-4 font-semibold">Documento</th>
                            <th class="px-6 py-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        ${clients.length === 0 ? `
                            <tr>
                                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                                    <div class="flex flex-col items-center justify-center">
                                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                            <i class="ph ph-users text-3xl"></i>
                                        </div>
                                        <p class="text-base font-medium text-slate-700">Nenhum cliente cadastrado</p>
                                        <p class="text-sm mt-1">Adicione o primeiro cliente para começar.</p>
                                        <a href="#/clientes/novo" class="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Adicionar Cliente</a>
                                    </div>
                                </td>
                            </tr>
                        ` : clients.map(client => `
                            <tr class="hover:bg-slate-50 transition-colors group">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-slate-900">${client.name}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-slate-600 text-sm flex flex-col gap-1">
                                        ${client.email ? `<span class="flex items-center gap-2"><i class="ph ph-envelope text-slate-400"></i> ${client.email}</span>` : ''}
                                        ${client.phone ? `<span class="flex items-center gap-2"><i class="ph ph-phone text-slate-400"></i> ${client.phone}</span>` : ''}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-slate-600">${client.document || '-'}</td>
                                <td class="px-6 py-4 text-right">
                                    <button onclick="window.deleteClient('${client.id}')" class="text-rose-500 hover:text-rose-700 font-medium text-sm p-2 rounded-lg hover:bg-rose-50 transition-colors mr-2">
                                        <i class="ph ph-trash text-lg"></i>
                                    </button>
                                    <a href="#/clientes/${client.id}" class="text-brand-600 hover:text-brand-900 font-medium text-sm p-2 rounded-lg hover:bg-brand-50 transition-colors">
                                        <i class="ph ph-pencil-simple text-lg"></i>
                                    </a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Global delete for inline script handler
    window.deleteClient = (id) => {
        if (confirm('Tem certeza que deseja remover este cliente?')) {
            store.delete('clients', id);
            window.location.reload(); // simple re-render
        }
    };

    return renderLayout(container, '/clientes');
}

function renderClientForm(container, id) {
    const isNew = id === 'novo';
    const client = isNew ? {} : store.getById('clients', id);

    if (!isNew && !client) {
        window.location.hash = '#/clientes';
        return container;
    }

    container.innerHTML = `
        <div class="mb-6 flex items-center gap-4">
            <a href="#/clientes" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors">
                <i class="ph ph-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">${isNew ? 'Novo Cliente' : 'Editar Cliente'}</h1>
                <p class="text-sm text-slate-500 mt-1">Preencha os dados abaixo.</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <form id="clientForm" class="space-y-6 max-w-2xl">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nome Competo / Razão Social *</label>
                        <input type="text" id="clientName" required value="${client.name || ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: Prefeitura Municipal" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Documento (CPF/CNPJ)</label>
                        <input type="text" id="clientDoc" value="${client.document || ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" placeholder="000.000.000-00" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                        <input type="text" id="clientPhone" value="${client.phone || ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" placeholder="(27) 99999-9999" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <input type="email" id="clientEmail" value="${client.email || ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" placeholder="contato@exemplo.com" />
                    </div>
                     <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                        <textarea id="clientAddress" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-none">${client.address || ''}</textarea>
                    </div>
                </div>

                <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <a href="#/clientes" class="px-5 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors">Cancelar</a>
                    <button type="submit" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <i class="ph ph-check-circle text-lg"></i>
                        Salvar Cliente
                    </button>
                </div>
            </form>
        </div>
    `;

    setTimeout(() => {
        const form = document.getElementById('clientForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('clientName').value,
                document: document.getElementById('clientDoc').value,
                phone: document.getElementById('clientPhone').value,
                email: document.getElementById('clientEmail').value,
                address: document.getElementById('clientAddress').value
            };

            if (isNew) {
                store.create('clients', data);
            } else {
                store.update('clients', id, data);
            }

            window.location.hash = '#/clientes';
        });
    }, 0);

    return renderLayout(container, '/clientes');
}
