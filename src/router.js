export class Router {
    constructor(appElementId, routes) {
        this.appElement = document.getElementById(appElementId);
        this.routes = routes;
        
        window.addEventListener('hashchange', () => this.handleRoute());
        // Handle init route
        window.addEventListener('load', () => {
            if (!window.location.hash) {
                window.location.hash = '#/';
            } else {
                this.handleRoute();
            }
        });
    }

    async handleRoute() {
        const hash = window.location.hash || '#/';
        const rawPath = hash.slice(1);
        const path = rawPath.split('?')[0];
        
        let match = this.routes.find(r => {
            if(r.path === path) return true;
            // Handle parameterized routes like /works/:id
            if(r.path.includes(':')) {
               const routeParts = r.path.split('/');
               const pathParts = path.split('/');
               if(routeParts.length !== pathParts.length) return false;
               return routeParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
            }
            return false;
        });

        if (!match) {
            match = this.routes.find(r => r.path === '*');
        }

        if (match) {
            // Extract params
            const params = {};
            if(match.path.includes(':')) {
                const routeParts = match.path.split('/');
                const pathParts = path.split('/');
                routeParts.forEach((part, i) => {
                    if(part.startsWith(':')) {
                        params[part.slice(1)] = pathParts[i];
                    }
                });
            }

            // Clear app element smoothly based on previous content (simple clear for now)
            this.appElement.innerHTML = ''; 
            
            try {
                // components return DOM elements
                const view = await match.component(params);
                this.appElement.appendChild(view);
            } catch (error) {
                console.error("View rendering error:", error);
                this.appElement.innerHTML = `<div class="p-8 text-red-500 font-bold">Error loading view: ${error.message}</div>`;
            }
        }
    }

    static navigate(path) {
        window.location.hash = path;
    }
}
