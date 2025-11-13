// Main Application Module
// Handles routing, state management, and application logic

class App {
    constructor() {
        this.currentPage = 'home';
        this.usuarios = [];
        this.trilhas = [];
        this.matriculas = [];
        this.estatisticas = null;
        this.filteredUsuarios = [];
        this.filteredTrilhas = [];
        this.filteredMatriculas = [];
        this.dashboardFilters = { range: '12m', group: 'month' };
        this.dashboardCharts = {};
        
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    async init() {
        this.setupEventListeners();
        this.setupRouting();
        this.setupMasks();
        
        // Load initial data
        await this.loadData();
        
        // Navigate to initial page
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateTo(hash);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Hero actions
        document.querySelectorAll('[data-action="goto-usuarios"]').forEach(btn => {
            btn.addEventListener('click', () => this.navigateTo('usuarios'));
        });

        document.querySelectorAll('[data-action="goto-trilhas"]').forEach(btn => {
            btn.addEventListener('click', () => this.navigateTo('trilhas'));
        });

        // Search
        const searchUsuarios = document.getElementById('search-usuarios');
        if (searchUsuarios) {
            searchUsuarios.addEventListener('input', (e) => {
                this.filterUsuarios(e.target.value);
            });
        }

        const searchTrilhas = document.getElementById('search-trilhas');
        if (searchTrilhas) {
            searchTrilhas.addEventListener('input', (e) => {
                this.filterTrilhas(e.target.value);
            });
        }

        const searchMatriculas = document.getElementById('search-matriculas');
        if (searchMatriculas) {
            searchMatriculas.addEventListener('input', (e) => {
                this.filterMatriculas(e.target.value);
            });
        }

        // Delegate events for dynamically created elements
        document.addEventListener('click', async (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.getAttribute('data-action');
            const idAttr = target.getAttribute('data-id');
            const id = idAttr !== null ? Number(idAttr) : null;

            switch (action) {
                case 'new-usuario':
                    this.showNewUsuarioModal();
                    break;
                case 'edit-usuario':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.showEditUsuarioModal(id);
                    }
                    break;
                case 'delete-usuario':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.deleteUsuario(id);
                    }
                    break;
                case 'new-trilha':
                    this.showNewTrilhaModal();
                    break;
                case 'edit-trilha':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.showEditTrilhaModal(id);
                    }
                    break;
                case 'delete-trilha':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.deleteTrilha(id);
                    }
                    break;
                case 'new-matricula':
                    this.showNewMatriculaModal();
                    break;
                case 'concluir-matricula':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.concluirMatricula(id);
                    }
                    break;
                case 'cancelar-matricula':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.cancelarMatricula(id);
                    }
                    break;
                case 'delete-matricula':
                    if (!Number.isNaN(id) && id !== null) {
                        await this.deleteMatricula(id);
                    }
                    break;
                case 'inscrever-usuario-trilha':
                    const trilhaId = target.getAttribute('data-trilha-id');
                    if (trilhaId) {
                        this.showInscreverUsuarioNaTrilhaModal(Number(trilhaId));
                    }
                    break;
            }
        });
    }

    // ========================================
    // ROUTING
    // ========================================
    setupRouting() {
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.slice(1) || 'home';
            this.navigateTo(page, false);
        });
    }

    navigateTo(page, updateHash = true) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Update active page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            if (updateHash) {
                window.location.hash = page;
            }

            // Load page-specific data
            if (page === 'usuarios') {
                this.renderUsuarios();
            } else if (page === 'trilhas') {
                this.renderTrilhas();
            } else if (page === 'matriculas') {
                this.loadMatriculas().then(() => this.renderMatriculas());
            } else if (page === 'dashboard') {
                Promise.all([this.loadEstatisticas(), this.matriculas.length ? Promise.resolve() : this.loadMatriculas()])
                    .then(() => this.renderDashboard());
            }
        }
    }

    // ========================================
    // DATA LOADING
    // ========================================
    async loadData() {
        try {
            Components.showLoading();
            
            // Load both datasets in parallel
            const [usuarios, trilhas] = await Promise.all([
                api.getUsuarios(),
                api.getTrilhas()
            ]);

            this.usuarios = usuarios || [];
            this.trilhas = trilhas || [];
            this.filteredUsuarios = [...this.usuarios];
            this.filteredTrilhas = [...this.trilhas];

            Components.hideLoading();
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao carregar dados: ' + error.message, 'error');
        }
    }

    // ========================================
    // USUARIOS
    // ========================================
    renderUsuarios() {
        const grid = document.getElementById('usuarios-grid');
        
        if (this.filteredUsuarios.length === 0) {
            grid.innerHTML = Components.createEmptyState(
                'Nenhum usuário encontrado',
                'Comece criando seu primeiro usuário',
                'Criar Usuário',
                'app.showNewUsuarioModal()'
            );
            return;
        }

        grid.innerHTML = this.filteredUsuarios
            .map(usuario => Components.createUsuarioCard(usuario))
            .join('');
    }

    filterUsuarios(query) {
        const searchTerm = query.toLowerCase();
        if (!searchTerm) {
            this.filteredUsuarios = [...this.usuarios];
            this.renderUsuarios();
            return;
        }

        this.filteredUsuarios = this.usuarios.filter(usuario => {
            const textMatch = [
                usuario.nome,
                usuario.email,
                usuario.areaAtuacao,
                usuario.nivelCarreira
            ].some(field => field && field.toLowerCase().includes(searchTerm));

            const idMatch = usuario.id?.toString().includes(searchTerm);
            return textMatch || idMatch;
        });
        this.renderUsuarios();
    }

    showNewUsuarioModal() {
        const modal = Components.createModal(
            'Novo Usuário',
            Components.createUsuarioForm(),
            `
                <button class="btn btn-ghost" onclick="Components.closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="app.createUsuario()">Criar</button>
            `
        );
    }

    async showEditUsuarioModal(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de usuário inválido.', 'error');
            return;
        }

        try {
            Components.showLoading();
            const usuario = await api.getUsuario(numericId);
            Components.hideLoading();

            if (!usuario) {
                Components.showToast('Usuário não encontrado.', 'error');
                return;
            }

            const formHtml = Components.createUsuarioForm(usuario);

            Components.createModal(
                'Editar Usuário',
                formHtml,
                `
                    <button class="btn btn-ghost" onclick="Components.closeModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="app.updateUsuario(${numericId})">Salvar</button>
                `
            );
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao carregar usuário: ' + error.message, 'error');
        }
    }

    async createUsuario() {
        if (!Components.validateForm('usuario-form')) {
            return;
        }

        const data = Components.getFormData('usuario-form');

        try {
            Components.showLoading();
            const newUsuario = await api.createUsuario(data);
            Components.hideLoading();

            this.usuarios.push(newUsuario);
            this.filteredUsuarios = [...this.usuarios];
            
            Components.closeModal();
            Components.showToast('Usuário criado com sucesso!', 'success');
            
            if (this.currentPage === 'usuarios') {
                this.renderUsuarios();
            }
        } catch (error) {
            Components.hideLoading();
            
            if (error.errors && Object.keys(error.errors).length > 0) {
                Components.displayFormErrors(error.errors);
            } else {
                Components.showToast('Erro ao criar usuário: ' + error.message, 'error');
            }
        }
    }

    async updateUsuario(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de usuário inválido.', 'error');
            return;
        }

        if (!Components.validateForm('usuario-form')) {
            return;
        }

        const data = Components.getFormData('usuario-form');

        try {
            Components.showLoading();
            const updatedUsuario = await api.updateUsuario(numericId, data);
            Components.hideLoading();

            const index = this.usuarios.findIndex(u => u.id === numericId);
            if (index !== -1) {
                this.usuarios[index] = updatedUsuario;
                this.filteredUsuarios = [...this.usuarios];
            }

            Components.closeModal();
            Components.showToast('Usuário atualizado com sucesso!', 'success');
            
            if (this.currentPage === 'usuarios') {
                this.renderUsuarios();
            }
        } catch (error) {
            Components.hideLoading();
            
            if (error.errors && Object.keys(error.errors).length > 0) {
                Components.displayFormErrors(error.errors);
            } else {
                Components.showToast('Erro ao atualizar usuário: ' + error.message, 'error');
            }
        }
    }

    async deleteUsuario(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de usuário inválido.', 'error');
            return;
        }

        const usuario = this.usuarios.find(u => u.id === numericId);
        if (!usuario) return;

        const confirmed = confirm(`Tem certeza que deseja deletar o usuário "${usuario.nome}"?`);
        if (!confirmed) return;

        try {
            Components.showLoading();
            await api.deleteUsuario(numericId);
            Components.hideLoading();

            this.usuarios = this.usuarios.filter(u => u.id !== numericId);
            this.filteredUsuarios = [...this.usuarios];

            Components.showToast('Usuário deletado com sucesso!', 'success');
            
            if (this.currentPage === 'usuarios') {
                this.renderUsuarios();
            }
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao deletar usuário: ' + error.message, 'error');
        }
    }

    // ========================================
    // TRILHAS
    // ========================================
    renderTrilhas() {
        const grid = document.getElementById('trilhas-grid');
        
        if (this.filteredTrilhas.length === 0) {
            grid.innerHTML = Components.createEmptyState(
                'Nenhuma trilha encontrada',
                'Comece criando sua primeira trilha de aprendizado',
                'Criar Trilha',
                'app.showNewTrilhaModal()'
            );
            return;
        }

        grid.innerHTML = this.filteredTrilhas
            .map(trilha => Components.createTrilhaCard(trilha))
            .join('');
    }

    filterTrilhas(query) {
        const searchTerm = query.toLowerCase();
        if (!searchTerm) {
            this.filteredTrilhas = [...this.trilhas];
            this.renderTrilhas();
            return;
        }

        this.filteredTrilhas = this.trilhas.filter(trilha => {
            const textMatch = [
                trilha.nome,
                trilha.descricao,
                trilha.nivel,
                trilha.focoPrincipal
            ].some(field => field && field.toLowerCase().includes(searchTerm));

            const cargaMatch = typeof trilha.cargaHoraria === 'number' && 
                trilha.cargaHoraria.toString().includes(searchTerm);

            return textMatch || cargaMatch;
        });
        this.renderTrilhas();
    }

    showNewTrilhaModal() {
        const modal = Components.createModal(
            'Nova Trilha',
            Components.createTrilhaForm(),
            `
                <button class="btn btn-ghost" onclick="Components.closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="app.createTrilha()">Criar</button>
            `
        );
    }

    async showEditTrilhaModal(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de trilha inválido.', 'error');
            return;
        }

        try {
            Components.showLoading();
            const trilha = await api.getTrilha(numericId);
            Components.hideLoading();

            Components.createModal(
                'Editar Trilha',
                Components.createTrilhaForm(trilha),
                `
                    <button class="btn btn-ghost" onclick="Components.closeModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="app.updateTrilha(${numericId})">Salvar</button>
                `
            );
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao carregar trilha: ' + error.message, 'error');
        }
    }

    async createTrilha() {
        if (!Components.validateForm('trilha-form')) {
            return;
        }

        const data = Components.getFormData('trilha-form');

        try {
            Components.showLoading();
            const newTrilha = await api.createTrilha(data);
            Components.hideLoading();

            this.trilhas.push(newTrilha);
            this.filteredTrilhas = [...this.trilhas];
            
            Components.closeModal();
            Components.showToast('Trilha criada com sucesso!', 'success');
            
            if (this.currentPage === 'trilhas') {
                this.renderTrilhas();
            }
        } catch (error) {
            Components.hideLoading();
            
            if (error.errors && Object.keys(error.errors).length > 0) {
                Components.displayFormErrors(error.errors);
            } else {
                Components.showToast('Erro ao criar trilha: ' + error.message, 'error');
            }
        }
    }

    async updateTrilha(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de trilha inválido.', 'error');
            return;
        }

        if (!Components.validateForm('trilha-form')) {
            return;
        }

        const data = Components.getFormData('trilha-form');

        try {
            Components.showLoading();
            const updatedTrilha = await api.updateTrilha(numericId, data);
            Components.hideLoading();

            const index = this.trilhas.findIndex(t => t.id === numericId);
            if (index !== -1) {
                this.trilhas[index] = updatedTrilha;
                this.filteredTrilhas = [...this.trilhas];
            }

            Components.closeModal();
            Components.showToast('Trilha atualizada com sucesso!', 'success');
            
            if (this.currentPage === 'trilhas') {
                this.renderTrilhas();
            }
        } catch (error) {
            Components.hideLoading();
            
            if (error.errors && Object.keys(error.errors).length > 0) {
                Components.displayFormErrors(error.errors);
            } else {
                Components.showToast('Erro ao atualizar trilha: ' + error.message, 'error');
            }
        }
    }

    async deleteTrilha(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de trilha inválido.', 'error');
            return;
        }

        const trilha = this.trilhas.find(t => t.id === numericId);
        if (!trilha) return;

        const confirmed = confirm(`Tem certeza que deseja deletar a trilha "${trilha.nome}"?`);
        if (!confirmed) return;

        try {
            Components.showLoading();
            await api.deleteTrilha(numericId);
            Components.hideLoading();

            this.trilhas = this.trilhas.filter(t => t.id !== numericId);
            this.filteredTrilhas = [...this.trilhas];

            Components.showToast('Trilha deletada com sucesso!', 'success');
            
            if (this.currentPage === 'trilhas') {
                this.renderTrilhas();
            }
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao deletar trilha: ' + error.message, 'error');
        }
    }

    // ========================================
    // MATRICULAS
    // ========================================
    async loadMatriculas() {
        try {
            Components.showLoading();
            this.matriculas = await api.getMatriculas() || [];
            this.filteredMatriculas = [...this.matriculas];
            Components.hideLoading();
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao carregar matrículas: ' + error.message, 'error');
        }
    }

    renderMatriculas() {
        const grid = document.getElementById('matriculas-grid');
        
        if (this.filteredMatriculas.length === 0) {
            grid.innerHTML = Components.createEmptyState(
                'Nenhuma matrícula encontrada',
                'Inscreva usuários em trilhas para começar',
                'Nova Inscrição',
                'app.showNewMatriculaModal()'
            );
            return;
        }

        grid.innerHTML = this.filteredMatriculas
            .map(matricula => Components.createMatriculaCard(matricula))
            .join('');
    }

    filterMatriculas(query) {
        const searchTerm = query.toLowerCase();
        if (!searchTerm) {
            this.filteredMatriculas = [...this.matriculas];
            this.renderMatriculas();
            return;
        }

        this.filteredMatriculas = this.matriculas.filter(matricula => {
            const textMatch = [
                matricula.usuarioNome,
                matricula.usuarioEmail,
                matricula.trilhaNome,
                matricula.status
            ].some(field => field && field.toLowerCase().includes(searchTerm));

            return textMatch;
        });
        this.renderMatriculas();
    }

    showNewMatriculaModal() {
        const modal = Components.createModal(
            'Nova Inscrição',
            Components.createInscreverForm(this.usuarios, this.trilhas),
            `
                <button class="btn btn-ghost" onclick="Components.closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="app.createMatricula()">Inscrever</button>
            `
        );
    }

    async createMatricula() {
        if (!Components.validateForm('inscrever-form')) {
            return;
        }

        const data = Components.getFormData('inscrever-form');

        try {
            Components.showLoading();
            const newMatricula = await api.inscreverTrilha(data);
            Components.hideLoading();

            this.matriculas.push(newMatricula);
            this.filteredMatriculas = [...this.matriculas];
            
            Components.closeModal();
            Components.showToast('Inscrição realizada com sucesso!', 'success');
            
            if (this.currentPage === 'matriculas') {
                this.renderMatriculas();
            }
        } catch (error) {
            Components.hideLoading();
            
            if (error.errors && Object.keys(error.errors).length > 0) {
                Components.displayFormErrors(error.errors);
            } else {
                Components.showToast('Erro ao criar inscrição: ' + error.message, 'error');
            }
        }
    }

    async concluirMatricula(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de matrícula inválido.', 'error');
            return;
        }

        const matricula = this.matriculas.find(m => m.id === numericId);
        if (!matricula) return;

        // Perguntar avaliação
        const avaliacao = prompt('Avalie a trilha de 1 a 5 estrelas (opcional):');
        let avaliacaoNum = null;
        
        if (avaliacao !== null && avaliacao.trim() !== '') {
            avaliacaoNum = parseInt(avaliacao);
            if (isNaN(avaliacaoNum) || avaliacaoNum < 1 || avaliacaoNum > 5) {
                Components.showToast('Avaliação deve ser entre 1 e 5', 'warning');
                return;
            }
        }

        try {
            Components.showLoading();
            const updated = await api.concluirMatricula(numericId, avaliacaoNum);
            Components.hideLoading();

            const index = this.matriculas.findIndex(m => m.id === numericId);
            if (index !== -1) {
                this.matriculas[index] = updated;
                this.filteredMatriculas = [...this.matriculas];
            }

            Components.showToast('Matrícula concluída com sucesso!', 'success');
            
            if (this.currentPage === 'matriculas') {
                this.renderMatriculas();
            }
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao concluir matrícula: ' + error.message, 'error');
        }
    }

    async cancelarMatricula(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de matrícula inválido.', 'error');
            return;
        }

        const matricula = this.matriculas.find(m => m.id === numericId);
        if (!matricula) return;

        const confirmed = confirm(`Tem certeza que deseja cancelar a inscrição de "${matricula.usuarioNome}" na trilha "${matricula.trilhaNome}"?`);
        if (!confirmed) return;

        try {
            Components.showLoading();
            const updated = await api.cancelarMatricula(numericId);
            Components.hideLoading();

            const index = this.matriculas.findIndex(m => m.id === numericId);
            if (index !== -1) {
                this.matriculas[index] = updated;
                this.filteredMatriculas = [...this.matriculas];
            }

            Components.showToast('Matrícula cancelada com sucesso!', 'success');
            
            if (this.currentPage === 'matriculas') {
                this.renderMatriculas();
            }
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao cancelar matrícula: ' + error.message, 'error');
        }
    }

    async deleteMatricula(id) {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            Components.showToast('ID de matrícula inválido.', 'error');
            return;
        }

        const matricula = this.matriculas.find(m => m.id === numericId);
        if (!matricula) return;

        const confirmed = confirm(`Tem certeza que deseja deletar esta matrícula?`);
        if (!confirmed) return;

        try {
            Components.showLoading();
            await api.deleteMatricula(numericId);
            Components.hideLoading();

            this.matriculas = this.matriculas.filter(m => m.id !== numericId);
            this.filteredMatriculas = [...this.matriculas];

            Components.showToast('Matrícula deletada com sucesso!', 'success');
            
            if (this.currentPage === 'matriculas') {
                this.renderMatriculas();
            }
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao deletar matrícula: ' + error.message, 'error');
        }
    }

    // ========================================
    // DASHBOARD / ESTATISTICAS
    // ========================================
    async loadEstatisticas() {
        try {
            Components.showLoading();
            this.estatisticas = await api.getEstatisticas();
            Components.hideLoading();
        } catch (error) {
            Components.hideLoading();
            Components.showToast('Erro ao carregar estatísticas: ' + error.message, 'error');
        }
    }

    renderDashboard() {
        const container = document.getElementById('dashboard-container');
        
        if (!this.estatisticas) {
            container.innerHTML = '<p>Carregando estatísticas...</p>';
            return;
        }

        // Render new dashboard layout (v2)
        container.innerHTML = Components.createDashboardV2();

        // Attach events for filters and actions
        this.setupDashboardEvents();

        // Compute and render
        this.refreshDashboard();
    }

    setupDashboardEvents() {
        const range = document.getElementById('dash-range');
        const group = document.getElementById('dash-group');
        const refresh = document.getElementById('dash-refresh');

        if (range) {
            range.value = this.dashboardFilters.range;
            range.addEventListener('change', () => {
                this.dashboardFilters.range = range.value;
                this._syncSegmentedStates();
                this.refreshDashboard();
            });
        }
        if (group) {
            group.value = this.dashboardFilters.group;
            group.addEventListener('change', () => {
                this.dashboardFilters.group = group.value;
                this._syncSegmentedStates();
                this.refreshDashboard();
            });
        }
        if (refresh) {
            refresh.addEventListener('click', () => this.refreshDashboard());
        }

        // Segmented filter buttons (chips)
        document.querySelectorAll('[data-range]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-range') === this.dashboardFilters.range);
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-range');
                if (val && this.dashboardFilters.range !== val) {
                    this.dashboardFilters.range = val;
                    if (range) range.value = val;
                    this._syncSegmentedStates();
                    this.refreshDashboard();
                }
            });
        });

        document.querySelectorAll('[data-group]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-group') === this.dashboardFilters.group);
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-group');
                if (val && this.dashboardFilters.group !== val) {
                    this.dashboardFilters.group = val;
                    if (group) group.value = val;
                    this._syncSegmentedStates();
                    this.refreshDashboard();
                }
            });
        });

        // Export handlers
        document.querySelectorAll('[data-export]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-export');
                const canvas = document.getElementById(id);
                if (!canvas) return;
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `${id}.png`;
                link.click();
            });
        });
    }

    _syncSegmentedStates() {
        document.querySelectorAll('[data-range]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-range') === this.dashboardFilters.range);
        });
        document.querySelectorAll('[data-group]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-group') === this.dashboardFilters.group);
        });
    }

    refreshDashboard() {
        const computed = this.computeDashboardData();
        this.updateKpis(computed);
        this.renderDashboardCharts(computed);
    }

    computeDashboardData() {
        const now = new Date();
        const addMonths = (date, m) => new Date(date.getFullYear(), date.getMonth() + m, 1);
        const start = (() => {
            switch (this.dashboardFilters.range) {
                case '3m': return addMonths(now, -3);
                case '6m': return addMonths(now, -6);
                case '12m': return addMonths(now, -12);
                case 'all': default: return new Date(2000, 0, 1);
            }
        })();

        const inRange = (d) => {
            const dt = new Date(d);
            return dt >= start && dt <= now;
        };

        const matriculas = this.matriculas.filter(m => m.dataInscricao && inRange(m.dataInscricao));

        // Grouping buckets
        const keyOf = (d) => {
            const dt = new Date(d);
            if (this.dashboardFilters.group === 'quarter') {
                const q = Math.floor(dt.getMonth() / 3) + 1;
                return `${dt.getFullYear()}-T${q}`;
            }
            // month
            return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,'0')}`;
        };

        const sortKeys = (a, b) => {
            // handle quarter and month lexicographically works if same format
            return a.localeCompare(b);
        };

        // Series: novas matriculas por período
        const perKeyCounts = {};
        matriculas.forEach(m => {
            const k = keyOf(m.dataInscricao);
            perKeyCounts[k] = (perKeyCounts[k] || 0) + 1;
        });
        const keys = Object.keys(perKeyCounts).sort(sortKeys);
        const seriesMatriculas = keys.map(k => perKeyCounts[k]);

        // Stacked status por período
        const statuses = ['ATIVA', 'CONCLUIDA', 'CANCELADA'];
        const perKeyStatus = {};
        matriculas.forEach(m => {
            const k = keyOf(m.dataInscricao);
            if (!perKeyStatus[k]) perKeyStatus[k] = { ATIVA: 0, CONCLUIDA: 0, CANCELADA: 0 };
            const s = (m.status || '').toUpperCase();
            if (perKeyStatus[k][s] !== undefined) perKeyStatus[k][s]++;
        });
        const seriesStatus = statuses.map(s => keys.map(k => (perKeyStatus[k]?.[s] || 0)));

        // Níveis das trilhas (com base nas matrículas)
        const nivelMap = { INICIANTE: 0, INTERMEDIARIO: 0, AVANCADO: 0 };
        matriculas.forEach(m => {
            const n = (m.trilhaNivel || '').toUpperCase();
            if (nivelMap[n] !== undefined) nivelMap[n]++;
        });

        // Top trilhas por matrículas
        const porTrilha = {};
        matriculas.forEach(m => {
            const nome = m.trilhaNome || `Trilha ${m.trilhaId || '?'}`;
            porTrilha[nome] = (porTrilha[nome] || 0) + 1;
        });
        const topTrilhas = Object.entries(porTrilha)
            .sort((a,b) => b[1]-a[1])
            .slice(0, 8);

        // Avaliação média por nível
        const avalPorNivel = { INICIANTE: { sum:0, count:0 }, INTERMEDIARIO: {sum:0, count:0}, AVANCADO: {sum:0, count:0} };
        this.matriculas.filter(m => m.avaliacao && inRange(m.dataConclusao || m.dataInscricao)).forEach(m => {
            const n = (m.trilhaNivel || '').toUpperCase();
            if (avalPorNivel[n]) { avalPorNivel[n].sum += Number(m.avaliacao); avalPorNivel[n].count += 1; }
        });
        const avalNivelVals = ['INICIANTE','INTERMEDIARIO','AVANCADO'].map(n => {
            const a = avalPorNivel[n];
            return a.count ? +(a.sum / a.count).toFixed(2) : 0;
        });

        // KPIs baseados no período
        const kpiTotal = matriculas.length;
        const kpiConcluidas = matriculas.filter(m => (m.status||'').toUpperCase()==='CONCLUIDA').length;
        const kpiAtivas = matriculas.filter(m => (m.status||'').toUpperCase()==='ATIVA').length;
        const kpiCanceladas = matriculas.filter(m => (m.status||'').toUpperCase()==='CANCELADA').length;

        // Tendência vs período anterior
        const prevStart = (() => {
            if (this.dashboardFilters.range === 'all') return start; // no previous
            const months = this.dashboardFilters.range === '3m' ? -3 : this.dashboardFilters.range === '6m' ? -6 : -12;
            return addMonths(start, months);
        })();
        const inPrevRange = (d) => {
            const dt = new Date(d);
            return dt >= prevStart && dt < start;
        };
        const prev = this.matriculas.filter(m => m.dataInscricao && inPrevRange(m.dataInscricao));
        const trend = (cur, prev) => {
            if (this.dashboardFilters.range === 'all') return { value: 0, dir: 'neutral' };
            if (prev === 0) return { value: 100, dir: 'positive' };
            const diff = ((cur - prev) / prev) * 100;
            return { value: Math.round(diff), dir: diff === 0 ? 'neutral' : (diff > 0 ? 'positive' : 'negative') };
        };
        const trendTotal = trend(kpiTotal, prev.length);
        const trendConc = trend(kpiConcluidas, prev.filter(m => (m.status||'').toUpperCase()==='CONCLUIDA').length);
        const trendAtiv = trend(kpiAtivas, prev.filter(m => (m.status||'').toUpperCase()==='ATIVA').length);
        const trendCanc = trend(kpiCanceladas, prev.filter(m => (m.status||'').toUpperCase()==='CANCELADA').length);

        return {
            keys,
            seriesMatriculas,
            statuses,
            seriesStatus,
            niveis: nivelMap,
            topTrilhas,
            avalNivelVals,
            kpis: {
                totalMatriculas: { value: kpiTotal, trend: trendTotal },
                matriculasConcluidas: { value: kpiConcluidas, trend: trendConc },
                matriculasAtivas: { value: kpiAtivas, trend: trendAtiv },
                matriculasCanceladas: { value: kpiCanceladas, trend: trendCanc },
                avaliacaoMedia: { value: this.estatisticas?.avaliacaoMedia ?? 0 }
            }
        };
    }

    updateKpis(computed) {
        const setVal = (key, val) => {
            const el = document.querySelector(`[data-kpi="${key}"]`);
            if (el) el.textContent = val;
        };
        const setTrend = (key, t) => {
            const el = document.querySelector(`[data-kpi-trend="${key}"]`);
            if (!el) return;
            el.className = `kpi-trend ${t.dir}`;
            el.textContent = t.dir === 'neutral' ? '—' : `${t.dir === 'positive' ? '▲' : '▼'} ${t.value}% vs período anterior`;
        };

        setVal('totalMatriculas', computed.kpis.totalMatriculas.value);
        setVal('matriculasConcluidas', computed.kpis.matriculasConcluidas.value);
        setVal('matriculasAtivas', computed.kpis.matriculasAtivas.value);
        setVal('matriculasCanceladas', computed.kpis.matriculasCanceladas.value);
        setVal('avaliacaoMedia', computed.kpis.avaliacaoMedia.value?.toFixed ? computed.kpis.avaliacaoMedia.value.toFixed(2) : computed.kpis.avaliacaoMedia.value);

        const starsEl = document.querySelector('[data-kpi-stars]');
        if (starsEl) starsEl.innerHTML = Components.createStarRating(Math.round(computed.kpis.avaliacaoMedia.value || 0));

        setTrend('totalMatriculas', computed.kpis.totalMatriculas.trend);
        setTrend('matriculasConcluidas', computed.kpis.matriculasConcluidas.trend);
        setTrend('matriculasAtivas', computed.kpis.matriculasAtivas.trend);
        setTrend('matriculasCanceladas', computed.kpis.matriculasCanceladas.trend);
    }

    renderDashboardCharts(computed) {
        const monthLabel = (k) => {
            if (k.includes('T')) return k; // quarter label
            const [y,m] = k.split('-');
            const names = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
            return `${names[Number(m)-1]}/${y.slice(2)}`;
        };

        // Destroy previous instances to avoid leaks
        Object.values(this.dashboardCharts).forEach(c => { try { c.destroy(); } catch {} });
        this.dashboardCharts = {};

        // Chart: Novas Matrículas (line/area)
        const elMat = document.getElementById('chart-matriculas');
        if (elMat) {
            this.dashboardCharts.matriculas = new Chart(elMat, {
                type: 'line',
                data: {
                    labels: computed.keys.map(monthLabel),
                    datasets: [{
                        label: 'Novas matrículas',
                        data: computed.seriesMatriculas,
                        fill: true,
                        tension: 0.35,
                        borderColor: '#007AFF',
                        backgroundColor: 'rgba(0,122,255,0.15)',
                        pointRadius: 3,
                        pointBackgroundColor: '#007AFF'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Chart: Status por período (stacked bar)
        const elStatus = document.getElementById('chart-status-stacked');
        if (elStatus) {
            this.dashboardCharts.status = new Chart(elStatus, {
                type: 'bar',
                data: {
                    labels: computed.keys.map(monthLabel),
                    datasets: [
                        { label: 'Ativas', data: computed.seriesStatus[0], backgroundColor: '#FF9500', borderRadius: 6 },
                        { label: 'Concluídas', data: computed.seriesStatus[1], backgroundColor: '#34C759', borderRadius: 6 },
                        { label: 'Canceladas', data: computed.seriesStatus[2], backgroundColor: '#FF3B30', borderRadius: 6 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
                }
            });
        }

        // Chart: Níveis (doughnut)
        const elNiveis = document.getElementById('chart-niveis');
        if (elNiveis) {
            const labels = ['Iniciante','Intermediário','Avançado'];
            const data = [computed.niveis.INICIANTE, computed.niveis.INTERMEDIARIO, computed.niveis.AVANCADO];
            this.dashboardCharts.niveis = new Chart(elNiveis, {
                type: 'doughnut',
                data: { labels, datasets: [{ data, backgroundColor: ['#5856D6','#007AFF','#34C759'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
            });
        }

        // Chart: Top Trilhas (horizontal bar)
        const elTop = document.getElementById('chart-top-trilhas');
        if (elTop) {
            const labels = computed.topTrilhas.map(t => t[0]);
            const data = computed.topTrilhas.map(t => t[1]);
            this.dashboardCharts.top = new Chart(elTop, {
                type: 'bar',
                data: { labels, datasets: [{ label: 'Matrículas', data, backgroundColor: '#007AFF', borderRadius: 8 }] },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Chart: Avaliação por nível (radar)
        const elRadar = document.getElementById('chart-avaliacao-nivel');
        if (elRadar) {
            this.dashboardCharts.radar = new Chart(elRadar, {
                type: 'radar',
                data: {
                    labels: ['Iniciante','Intermediário','Avançado'],
                    datasets: [{
                        label: 'Média de avaliação',
                        data: computed.avalNivelVals,
                        backgroundColor: 'rgba(88,86,214,0.15)',
                        borderColor: '#5856D6',
                        pointBackgroundColor: '#5856D6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { r: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    showInscreverUsuarioNaTrilhaModal(trilhaId) {
        const trilha = this.trilhas.find(t => t.id === trilhaId);
        if (!trilha) {
            Components.showToast('Trilha não encontrada', 'error');
            return;
        }

        const formHtml = `
            <form id="inscrever-rapido-form" class="form">
                <div class="alert alert-info">
                    <strong>Trilha:</strong> ${Components.escapeHtml(trilha.nome)}<br>
                    <strong>Nível:</strong> ${Components.formatNivelLabel(trilha.nivel)}<br>
                    <strong>Carga Horária:</strong> ${trilha.cargaHoraria}h
                </div>
                <div class="form-group">
                    <label for="usuarioId" class="form-label">Selecione o Usuário *</label>
                    <select id="usuarioId" name="usuarioId" class="form-input" required>
                        <option value="">Escolha um usuário</option>
                        ${this.usuarios.map(u => `
                            <option value="${u.id}">${Components.escapeHtml(u.nome)} (${Components.escapeHtml(u.email)})</option>
                        `).join('')}
                    </select>
                    <span id="usuarioId-error" class="form-error"></span>
                </div>
            </form>
        `;

        Components.createModal(
            'Inscrever Usuário na Trilha',
            formHtml,
            `
                <button class="btn btn-ghost" onclick="Components.closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="app.inscreverUsuarioRapido(${trilhaId})">Inscrever</button>
            `
        );
    }

    async inscreverUsuarioRapido(trilhaId) {
        if (!Components.validateForm('inscrever-rapido-form')) {
            return;
        }

        const data = Components.getFormData('inscrever-rapido-form');
        data.trilhaId = trilhaId;

        try {
            Components.showLoading();
            await api.inscreverTrilha(data);
            Components.hideLoading();

            Components.closeModal();
            Components.showToast('Usuário inscrito na trilha com sucesso!', 'success');
            
            // Reload matriculas if on that page
            if (this.currentPage === 'matriculas') {
                await this.loadMatriculas();
                this.renderMatriculas();
            }
        } catch (error) {
            Components.hideLoading();
            
            if (error.errors && Object.keys(error.errors).length > 0) {
                Components.displayFormErrors(error.errors);
            } else {
                Components.showToast('Erro ao inscrever: ' + error.message, 'error');
            }
        }
    }

    // ========================================
    // INPUT MASKS
    // ========================================
    setupMasks() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'cpf') {
                Components.maskCpf(e.target);
            } else if (e.target.id === 'telefone') {
                Components.maskTelefone(e.target);
            }
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
