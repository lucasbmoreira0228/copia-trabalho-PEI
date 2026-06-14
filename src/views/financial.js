// src/views/login.js
// Export a function component for the login view.
export default function LoginView() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="flex items-center justify-center min-h-screen bg-slate-50">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 class="text-2xl font-bold text-center text-slate-900">Login</h2>
        <form id="loginForm" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">E-mail</label>
            <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700">Senha</label>
            <input type="password" id="password" name="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <button type="submit" class="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md transition-colors">Entrar</button>
        </form>
      </div>
    </div>
  `;
  // Simple client‑side authentication placeholder
  container.querySelector('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    if (email && password) {
      const fakeToken = btoa(email + ':' + password);
      localStorage.setItem('authToken', fakeToken);
      // Update global store state (assuming store is globally accessible)
      window.store.setState({ isAuthenticated: true, user: { email } });
      // Navigate to home after login
      Router.navigate('/');
    } else {
      alert('Por favor, preencha e‑mail e senha.');
    }
  });
  return container;
}
