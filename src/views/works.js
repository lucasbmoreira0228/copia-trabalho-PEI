import { store } from '../store.js';
import { renderLayout } from '../components/layout.js';

export function WorksView(params = {}) {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto space-y-6 slide-up';

    if (params.id) {
        if(params.id === 'nova') return renderWorkForm(container, 'nova');
        return renderWorkDetails(container, params.id);
    }
    
    return renderWorksList(container);
}

function renderWorksList(container) {
    const works = store.getAll('works');
    const clients = store.getAll('clients');

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Obras e Projetos</h1>
                <p class="text-sm text-slate-500 mt-1">Gerencie instalações elétricas e solares.</p>
            </div>
            <a href="#/obras/nova" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors hover-lift flex items-center gap-2">
                <i class="ph ph-plus-circle text-lg"></i>
                Nova Obra
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            ${works.length === 0 ? `
                <div class="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
                    <div class="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
                        <i class="ph ph-buildings text-3xl"></i>
                    </div>
                    <p class="text-lg font-semibold text-slate-900">Nenhuma obra cadastrada</p>
                    <p class="text-sm text-slate-500 mt-1">Inicie o seu primeiro projeto clicando no botão acima.</p>
                </div>
            ` : works.map((work, idx) => {
                const client = clients.find(c => c.id === work.clientId) || { name: 'Desconhecido' };
                const materialsCount = store.getAll('workMaterials').filter(wm => wm.workId === work.id).length;
                
                let statusColor = 'bg-blue-100 text-blue-800';
                if(work.status === 'Concluída') statusColor = 'bg-emerald-100 text-emerald-800';
                else if(work.status === 'Paralisada') statusColor = 'bg-rose-100 text-rose-800';

                return `
                <a href="#/obras/${work.id}" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover-lift flex flex-col stagger-${(idx%3)+1}">
                    <div class="flex justify-between items-start mb-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}">
                            ${work.status || 'Em andamento'}
                        </span>
                        <div class="text-slate-400 p-1 hover:text-brand-600 transition-colors">
                            <i class="ph ph-arrow-up-right text-xl"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 font-display leading-tight mb-2">${work.name}</h3>
                    <div class="text-sm text-slate-600 mb-6 flex items-center gap-2">
                        <i class="ph ph-user text-slate-400"></i> ${client.name}
                    </div>
                    <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                         <div class="flex items-center gap-2 text-slate-500">
                            <i class="ph ph-map-pin"></i> 
                            <span class="truncate w-32">${work.address || 'Sem endereço'}</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-slate-700 font-medium">
                            <i class="ph ph-package text-brand-500"></i>
                            ${materialsCount} mat.
                        </div>
                    </div>
                </a>
                `;
            }).join('')}
        </div>
    `;

    return renderLayout(container, '/obras');
}

function renderWorkForm(container, id) {
    const clients = store.getAll('clients');

    if(clients.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center py-20 bg-white rounded-2xl shadow-sm border border-orange-200 bg-orange-50/50">
                <i class="ph-duotone ph-warning-circle text-5xl text-orange-500 mb-4"></i>
                <h2 class="text-xl font-bold text-slate-800 mb-2">Atenção! Cadastre um cliente primeiro</h2>
                <p class="text-slate-600 text-center max-w-md mb-6">Toda obra precisa estar associada a um cliente. Por favor, vá até a página de clientes e faça um registro antes de criar uma obra.</p>
                <a href="#/clientes/novo" class="px-5 py-2.5 bg-brand-600 text-white font-medium rounded-lg">Ir para Cadastro de Clientes</a>
            </div>
        `;
        return renderLayout(container, '/obras');
    }

    container.innerHTML = `
        <div class="mb-6 flex items-center gap-4">
            <a href="#/obras" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors">
                <i class="ph ph-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Nova Obra / Projeto</h1>
                <p class="text-sm text-slate-500 mt-1">Preencha os detalhes da nova instalação.</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <form id="workForm" class="space-y-6 max-w-3xl">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nome identificador da Obra/Projeto *</label>
                        <input type="text" id="workName" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: Galpão Logístico - Fase 1 / Usina Solar Solar 5kWp">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
                        <select id="workClient" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white">
                            <option value="">Selecione um cliente...</option>
                            ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Data de Início Prevista</label>
                        <input type="date" id="workDate" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-700">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Endereço da Obra</label>
                        <input type="text" id="workAddress" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all" placeholder="Rua, Número, Bairro, Cidade - UF">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada do Projeto</label>
                        <textarea id="workDesc" rows="4" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-none placeholder:text-slate-400" placeholder="Detalhes técnicos, requisitos específicos de baixa/média tensão..."></textarea>
                    </div>
                </div>

                <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <a href="#/obras" class="px-5 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors">Cancelar</a>
                    <button type="submit" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <i class="ph ph-check-circle text-lg"></i>
                        Registrar Obra
                    </button>
                </div>
            </form>
        </div>
    `;

    setTimeout(() => {
        const form = document.getElementById('workForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('workName').value,
                clientId: document.getElementById('workClient').value,
                startDate: document.getElementById('workDate').value,
                address: document.getElementById('workAddress').value,
                description: document.getElementById('workDesc').value,
                status: 'Em andamento'
            };

            store.create('works', data);
            window.location.hash = '#/obras';
        });
    }, 0);

    return renderLayout(container, '/obras');
}

function renderWorkDetails(container, id) {
    const work = store.getById('works', id);
    if(!work) {
        window.location.hash = '#/obras';
        return container;
    }
    const client = store.getById('clients', work.clientId);

    container.innerHTML = `
        <div class="mb-6 flex items-center gap-4">
            <a href="#/obras" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors">
                <i class="ph ph-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">${work.name}</h1>
                <p class="text-sm text-brand-600 font-medium mt-1 flex items-center gap-2">
                    <i class="ph-fill ph-user-circle"></i>
                    ${client ? client.name : 'Cliente Anônimo'}
                </p>
            </div>
            
            <div class="ml-auto flex gap-2">
                <button onclick="window.deleteWork('${work.id}')" class="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-50 transition-colors">
                    <i class="ph ph-trash mr-1"></i> Excluir
                </button>
            </div>
        </div>

        <!-- Work Hub Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content Area -->
            <div class="lg:col-span-2 space-y-6">
                
                <!-- Materials Widget -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <i class="ph-fill ph-package text-xl"></i>
                            </div>
                            <h2 class="text-lg font-bold text-slate-800 font-display">Materiais e Insumos</h2>
                        </div>
                        <a href="#/materiais?obra=${work.id}" class="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-semibold hover:bg-brand-100 flex gap-2 items-center">
                            Gerenciar <i class="ph ph-arrow-right"></i>
                        </a>
                    </div>
                    
                    <div class="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                       <p class="text-slate-500 text-sm mb-3">Nenhum material listado para esta obra ainda.</p>
                       <button class="text-brand-600 font-medium text-sm flex items-center gap-1 mx-auto hover:underline">
                           <i class="ph ph-plus-circle"></i> Adicionar Insumos
                       </button>
                    </div>
                </div>

                 <!-- Financial Widget -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <div class="flex justify-between items-center mb-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <i class="ph-fill ph-currency-dollar text-xl"></i>
                            </div>
                            <h2 class="text-lg font-bold text-slate-800 font-display">Resumo Financeiro</h2>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Custo Projetado</div>
                            <div class="text-2xl font-bold text-slate-800">R$ 0,00</div>
                        </div>
                         <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recebido</div>
                            <div class="text-2xl font-bold text-emerald-600">R$ 0,00</div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Sidebar Info -->
            <div class="space-y-6">
                <!-- Data Card -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 class="font-bold text-slate-800 mb-4 font-display">Informações Sensíveis</h3>
                    
                    <ul class="space-y-4 text-sm">
                        <li class="flex flex-col">
                            <span class="text-slate-500 text-xs font-semibold mb-1 uppercase">Status Atual</span>
                            <span class="inline-flex w-max items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                ${work.status || 'Em andamento'}
                            </span>
                        </li>
                        <li class="flex flex-col">
                            <span class="text-slate-500 text-xs font-semibold mb-1 uppercase">Localização</span>
                            <span class="text-slate-800 font-medium">${work.address || 'Não informado'}</span>
                        </li>
                        <li class="flex flex-col">
                            <span class="text-slate-500 text-xs font-semibold mb-1 uppercase">Data de Início</span>
                            <span class="text-slate-800 font-medium">${work.startDate ? new Date(work.startDate).toLocaleDateString('pt-BR') : 'Não informada'}</span>
                        </li>
                         <li class="flex flex-col border-t border-slate-100 pt-3 mt-1">
                            <span class="text-slate-500 text-xs font-semibold mb-1 uppercase">Descrição</span>
                            <span class="text-slate-700 italic">${work.description || 'Nenhuma descrição técnica providenciada.'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Global delete for inline script handler
    window.deleteWork = (workId) => {
        if (confirm('Atenção: A exclusão da obra também removerá financeiro e materiais atrelados a ela. Confirmar?')) {
            store.delete('works', workId);
            window.location.hash = '#/obras';
        }
    };

    return renderLayout(container, '/obras');
}
