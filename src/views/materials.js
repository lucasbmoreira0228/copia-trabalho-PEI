import { store } from '../store.js';
import { renderLayout } from '../components/layout.js';

export function MaterialsView() {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto space-y-6 slide-up';

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const workId = urlParams.get('obra');

    if (workId) {
        return renderWorkMaterials(container, workId);
    }
    
    return renderMaterialCatalog(container);
}

function renderMaterialCatalog(container) {
    const materials = store.getAll('materials');

    container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Catálogo de Materiais</h1>
                <p class="text-sm text-slate-500 mt-1">Gerencie a base de materiais e insumos elétricos.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <!-- Add Form -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 class="font-bold text-slate-800 font-display mb-4">Adicionar ao Catálogo</h3>
                <form id="materialForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nome do Material *</label>
                        <input type="text" id="matName" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500" placeholder="Ex: Cabo Flexível 2.5mm²">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Unidade *</label>
                            <select id="matUnit" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500">
                                <option value="Metros">Metros</option>
                                <option value="Unidade">Unidade</option>
                                <option value="Rolo">Rolo 100m</option>
                                <option value="Caixa">Caixa</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Custo Est. (R$)</label>
                            <input type="number" step="0.01" id="matPrice" class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500" placeholder="0.00">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors mt-4">
                        Salvar Material
                    </button>
                </form>
            </div>

            <!-- List -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <h3 class="font-semibold text-slate-800">Materiais Cadastrados</h3>
                    <span class="text-xs font-semibold bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full">${materials.length} itens</span>
                </div>
                <div class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    ${materials.length === 0 ? `
                        <div class="p-8 text-center text-slate-500 flex flex-col items-center">
                            <i class="ph ph-package text-4xl text-slate-300 mb-2"></i>
                            <p>O catálogo está vazio.</p>
                        </div>
                    ` : materials.map(mat => `
                        <div class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                    <i class="ph ph-plug text-xl"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-slate-900">${mat.name}</p>
                                    <p class="text-xs text-slate-500">${mat.unit} • R$ ${parseFloat(mat.estimatedPrice || 0).toFixed(2).replace('.', ',')} / ${mat.unit}</p>
                                </div>
                            </div>
                            <button onclick="window.deleteMaterial('${mat.id}')" class="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                                <i class="ph ph-trash text-lg"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const form = document.getElementById('materialForm');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                store.create('materials', {
                    name: document.getElementById('matName').value,
                    unit: document.getElementById('matUnit').value,
                    estimatedPrice: document.getElementById('matPrice').value || 0
                });
                window.location.reload();
            });
        }
    }, 0);

    window.deleteMaterial = (id) => {
        if(confirm('Tem certeza? Removerá o material do catálogo base.')) {
            store.delete('materials', id);
            window.location.reload();
        }
    };

    return renderLayout(container, '/materiais');
}

function renderWorkMaterials(container, workId) {
    const work = store.getById('works', workId);
    if (!work) {
        window.location.hash = '#/obras';
        return container;
    }

    const catalog = store.getAll('materials');
    const workMaterials = store.getAll('workMaterials').filter(wm => wm.workId === workId);

    // Calculate total cost
    const totalCost = workMaterials.reduce((acc, wm) => acc + (parseFloat(wm.price) * parseFloat(wm.quantity)), 0);

    container.innerHTML = `
        <div class="mb-6 flex items-center gap-4">
            <a href="#/obras/${workId}" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors">
                <i class="ph ph-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 font-display">Materiais da Obra</h1>
                <p class="text-sm text-brand-600 font-medium mt-1">${work.name}</p>
            </div>
            <div class="ml-auto">
                <div class="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg flex flex-col items-end border border-emerald-100">
                    <span class="text-xs uppercase font-bold text-emerald-600/70">Custo Total de Materiais</span>
                    <span class="font-bold font-display leading-tight">R$ ${totalCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
            </div>
        </div>

         <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <!-- Add Material to Work -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 class="font-bold text-slate-800 font-display mb-4">Lançar Material na Obra</h3>
                <form id="workMaterialForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Selecionar do Catálogo *</label>
                        <select id="wmMaterial" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 bg-white">
                            <option value="">Escolha um material...</option>
                            ${catalog.map(c => `<option value="${c.id}" data-price="${c.estimatedPrice}" data-unit="${c.unit}">${c.name} (${c.unit})</option>`).join('')}
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Quantidade *</label>
                            <input type="number" step="0.01" id="wmQtd" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500" placeholder="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Custo Unit. (R$)</label>
                            <input type="number" step="0.01" id="wmPrice" required class="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500" placeholder="0.00">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors mt-4">
                        Adicionar à Lista
                    </button>
                    <div class="mt-4 pt-4 border-t border-slate-100 text-center">
                        <a href="#/materiais" class="text-sm text-brand-600 hover:underline">Falta no catálogo? Ir para base</a>
                    </div>
                </form>
            </div>

            <!-- Material List -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div class="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <h3 class="font-semibold text-slate-800">Lista de Utilização</h3>
                </div>
                <div class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    ${workMaterials.length === 0 ? `
                        <div class="p-8 text-center text-slate-500 flex flex-col items-center">
                            <i class="ph ph-clipboard text-4xl text-slate-300 mb-2"></i>
                            <p>Nenhum material listado para execução desta obra ainda.</p>
                        </div>
                    ` : workMaterials.map(wm => {
                        const matInfo = catalog.find(c => c.id === wm.materialId) || { name: 'Desconhecido', unit: 'und' };
                        const subtotal = parseFloat(wm.quantity) * parseFloat(wm.price);
                        return `
                        <div class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors">
                            <div class="col-span-6 md:col-span-5 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                    <i class="ph ph-package"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-slate-900 leading-tight">${matInfo.name}</p>
                                </div>
                            </div>
                            <div class="col-span-3">
                                <span class="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm font-medium">
                                    ${wm.quantity} ${matInfo.unit}
                                </span>
                            </div>
                            <div class="col-span-3 text-right">
                                <p class="font-bold text-slate-900 text-sm">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
                                <p class="text-xs text-slate-500">R$ ${parseFloat(wm.price).toFixed(2).replace('.', ',')} / unid</p>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
         </div>
    `;

    setTimeout(() => {
        const matSelect = document.getElementById('wmMaterial');
        const priceInput = document.getElementById('wmPrice');
        
        if(matSelect && priceInput) {
            matSelect.addEventListener('change', (e) => {
                const selected = e.target.options[e.target.selectedIndex];
                if(selected && selected.dataset.price) {
                    priceInput.value = selected.dataset.price;
                }
            });
        }

        const form = document.getElementById('workMaterialForm');
        if(form) {
             form.addEventListener('submit', (e) => {
                e.preventDefault();
                store.create('workMaterials', {
                    workId: workId,
                    materialId: document.getElementById('wmMaterial').value,
                    quantity: document.getElementById('wmQtd').value,
                    price: document.getElementById('wmPrice').value
                });
                window.location.reload();
             });
        }
    }, 0);

    return renderLayout(container, '/obras'); // keep sidebar "obras" highlighted
}
