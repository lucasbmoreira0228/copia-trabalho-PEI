export function renderLayout(contentNode, activePath = '/') {
    const container = document.createElement('div');
    container.className = 'flex h-screen w-full bg-slate-50 overflow-hidden';

    // Sidebar
    const navItems = [
        { path: '/', icon: 'ph-squares-four', label: 'Dashboard' },
        { path: '/obras', icon: 'ph-buildings', label: 'Obras' },
        { path: '/clientes', icon: 'ph-users', label: 'Clientes' },
        { path: '/materiais', icon: 'ph-package', label: 'Materiais' },
        { path: '/financeiro', icon: 'ph-currency-dollar', label: 'Financeiro' },
    ];

    const sidebarHTML = `
        <aside class="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0 z-20">
            <div class="h-16 flex items-center px-6 border-b border-slate-100">
                <div class="flex items-center gap-2 text-brand-600">
                    <i class="ph-fill ph-lightning text-2xl"></i>
                    <span class="font-display font-bold text-lg tracking-tight">SGOME</span>
                </div>
            </div>
            <div class="p-4 flex-1 overflow-y-auto">
                <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu Principal</div>
                <nav class="space-y-1">
                    ${navItems.map(item => `
                        <a href="#${item.path}" 
                           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                               activePath === item.path 
                               ? 'bg-brand-50 text-brand-700' 
                               : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                           }">
                            <i class="${item.icon} text-xl ${activePath === item.path ? 'ph-fill' : 'ph'}"></i>
                            ${item.label}
                        </a>
                    `).join('')}
                </nav>
            </div>
            <div class="p-4 border-t border-slate-100">
                <div class="flex items-center gap-3 px-2 py-2">
                    <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        AC
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-slate-700">Antônio Carlos</div>
                        <div class="text-xs text-slate-500">Engenharia</div>
                    </div>
                </div>
            </div>
        </aside>
    `;

    // Wrapper for Main Content
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'flex-1 flex flex-col overflow-hidden relative';
    
    // Header
    const headerHTML = `
        <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
            <div class="flex items-center gap-4 md:hidden">
                <button class="text-slate-500 hover:text-slate-700">
                    <i class="ph ph-list text-2xl"></i>
                </button>
                <div class="flex items-center gap-2 text-brand-600">
                    <i class="ph-fill ph-lightning text-xl"></i>
                    <span class="font-display font-bold text-lg">SGOME</span>
                </div>
            </div>
            <div class="hidden md:block">
                <!-- Desktop breadcrumbs or title could go here -->
            </div>
            <div class="flex items-center gap-4 ml-auto">
                <button class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors relative">
                    <i class="ph ph-bell text-xl"></i>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full"></span>
                </button>
            </div>
        </header>
    `;

    // Main Content Area
    const mainContent = document.createElement('main');
    mainContent.className = 'flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8';
    
    // Assemble
    mainWrapper.innerHTML = headerHTML;
    mainWrapper.appendChild(mainContent);
    mainContent.appendChild(contentNode);

    container.innerHTML = sidebarHTML;
    container.appendChild(mainWrapper);

    return container;
}
