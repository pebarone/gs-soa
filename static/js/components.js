// UI Components Module
// Reusable component functions for creating UI elements

const Components = {
    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================
    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // ========================================
    // MODAL
    // ========================================
    createModal(title, content, footer = null) {
        const container = document.getElementById('modal-container');
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">${content}</div>
                ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        `;
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on ESC key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        container.innerHTML = '';
        container.appendChild(modal);
        
        return modal;
    },

    closeModal() {
        const container = document.getElementById('modal-container');
        container.innerHTML = '';
    },

    // ========================================
    // LOADING OVERLAY
    // ========================================
    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    },

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    },

    // ========================================
    // USUARIO CARD
    // ========================================
    createUsuarioCard(usuario) {
        return `
            <div class="card" data-id="${usuario.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${this.escapeHtml(usuario.nome)}</h3>
                        <p class="card-subtitle">ID: ${usuario.id}</p>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn edit" data-action="edit-usuario" data-id="${usuario.id}" title="Editar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="card-btn delete" data-action="delete-usuario" data-id="${usuario.id}" title="Deletar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-field">
                        <div class="card-label">Email</div>
                        <div class="card-value">${this.escapeHtml(usuario.email)}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Área de Atuação</div>
                        <div class="card-value">${usuario.areaAtuacao ? this.escapeHtml(usuario.areaAtuacao) : '—'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Nível de Carreira</div>
                        <div class="card-value">${usuario.nivelCarreira ? this.escapeHtml(usuario.nivelCarreira) : '—'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Criado em</div>
                        <div class="card-value">${usuario.dataCadastro ? this.formatDate(usuario.dataCadastro) : '—'}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // ========================================
    // TRILHA CARD
    // ========================================
    createTrilhaCard(trilha) {
        return `
            <div class="card" data-id="${trilha.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${this.escapeHtml(trilha.nome)}</h3>
                        <p class="card-subtitle">ID: ${trilha.id}</p>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn success" data-action="inscrever-usuario-trilha" data-trilha-id="${trilha.id}" title="Inscrever Usuário">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <line x1="20" y1="8" x2="20" y2="14"/>
                                <line x1="23" y1="11" x2="17" y2="11"/>
                            </svg>
                        </button>
                        <button class="card-btn edit" data-action="edit-trilha" data-id="${trilha.id}" title="Editar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="card-btn delete" data-action="delete-trilha" data-id="${trilha.id}" title="Deletar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-field">
                        <div class="card-label">Descrição</div>
                        <div class="card-value">${trilha.descricao ? this.escapeHtml(trilha.descricao) : '—'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Nível</div>
                        <div class="card-value">${trilha.nivel ? this.formatNivelLabel(trilha.nivel) : '—'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Carga Horária</div>
                        <div class="card-value">${typeof trilha.cargaHoraria === 'number' ? `${trilha.cargaHoraria}h` : '—'}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Foco Principal</div>
                        <div class="card-value">${trilha.focoPrincipal ? this.escapeHtml(trilha.focoPrincipal) : '—'}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // ========================================
    // FORMS
    // ========================================
    createUsuarioForm(usuario = null) {
        const isEdit = usuario !== null;
        
        // For edit mode, pre-populate with existing values or empty strings
        const nome = (isEdit && usuario) ? (usuario.nome || '') : '';
        const email = (isEdit && usuario) ? (usuario.email || '') : '';
        const areaAtuacao = (isEdit && usuario) ? (usuario.areaAtuacao || '') : '';
        const nivelCarreira = (isEdit && usuario) ? (usuario.nivelCarreira || '') : '';
        
        return `
            ${isEdit && usuario ? `
                <div class="info-display">
                    <h4 style="margin-bottom: 12px; color: #64748b; font-size: 14px; font-weight: 500;">Dados Atuais</h4>
                    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <div style="display: grid; gap: 12px;">
                            <div>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Nome</div>
                                <div style="font-size: 14px; color: #1e293b; font-weight: 500;">${this.escapeHtml(nome || '—')}</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Email</div>
                                <div style="font-size: 14px; color: #1e293b;">${this.escapeHtml(email || '—')}</div>
                            </div>
                            ${areaAtuacao ? `
                                <div>
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Área de Atuação</div>
                                    <div style="font-size: 14px; color: #1e293b;">${this.escapeHtml(areaAtuacao)}</div>
                                </div>
                            ` : ''}
                            ${nivelCarreira ? `
                                <div>
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Nível de Carreira</div>
                                    <div style="font-size: 14px; color: #1e293b;">${this.escapeHtml(nivelCarreira)}</div>
                                </div>
                            ` : ''}
                            ${usuario.dataCadastro ? `
                                <div>
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Cadastrado em</div>
                                    <div style="font-size: 14px; color: #1e293b;">${this.formatDate(usuario.dataCadastro)}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <h4 style="margin-bottom: 12px; color: #64748b; font-size: 14px; font-weight: 500;">Editar Informações</h4>
                </div>
            ` : ''}
            <form id="usuario-form">
                <div class="form-group">
                    <label class="form-label required" for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-input" 
                           value="${this.escapeHtml(nome)}" 
                           required maxlength="100">
                    <div class="form-error" id="nome-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label required" for="email">Email</label>
                    <input type="email" id="email" name="email" class="form-input" 
                           value="${this.escapeHtml(email)}" 
                           required maxlength="150">
                    <div class="form-error" id="email-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="areaAtuacao">Área de Atuação</label>
                    <input type="text" id="areaAtuacao" name="areaAtuacao" class="form-input" 
                           value="${this.escapeHtml(areaAtuacao)}" 
                           placeholder="Ex.: Tecnologia, Marketing" maxlength="100">
                    <div class="form-error" id="areaAtuacao-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="nivelCarreira">Nível de Carreira</label>
                    <input type="text" id="nivelCarreira" name="nivelCarreira" class="form-input" 
                           value="${this.escapeHtml(nivelCarreira)}" 
                           placeholder="Ex.: Júnior, Pleno, Sênior" maxlength="50">
                    <div class="form-error" id="nivelCarreira-error"></div>
                </div>
            </form>
        `;
    },

    createTrilhaForm(trilha = null) {
        const isEdit = trilha !== null;
        
        return `
            <form id="trilha-form">
                <div class="form-group">
                    <label class="form-label required" for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-input" 
                           value="${isEdit ? this.escapeHtml(trilha.nome) : ''}" 
                           required maxlength="100">
                    <div class="form-error" id="nome-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-textarea" 
                              maxlength="500" placeholder="Conte um pouco sobre a trilha">${isEdit && trilha.descricao ? this.escapeHtml(trilha.descricao) : ''}</textarea>
                    <div class="form-error" id="descricao-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label required" for="nivel">Nível</label>
                    <select id="nivel" name="nivel" class="form-select" required>
                        <option value="">Selecione...</option>
                        <option value="INICIANTE" ${isEdit && trilha.nivel && trilha.nivel.toUpperCase() === 'INICIANTE' ? 'selected' : ''}>Iniciante</option>
                        <option value="INTERMEDIARIO" ${isEdit && trilha.nivel && trilha.nivel.toUpperCase() === 'INTERMEDIARIO' ? 'selected' : ''}>Intermediário</option>
                        <option value="AVANCADO" ${isEdit && trilha.nivel && trilha.nivel.toUpperCase() === 'AVANCADO' ? 'selected' : ''}>Avançado</option>
                    </select>
                    <div class="form-error" id="nivel-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label required" for="cargaHoraria">Carga Horária (horas)</label>
                    <input type="number" id="cargaHoraria" name="cargaHoraria" class="form-input" 
                           value="${isEdit && typeof trilha.cargaHoraria === 'number' ? trilha.cargaHoraria : ''}" 
                           min="1" max="10000" step="1" required>
                    <div class="form-error" id="cargaHoraria-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="focoPrincipal">Foco Principal</label>
                    <input type="text" id="focoPrincipal" name="focoPrincipal" class="form-input"
                           value="${isEdit && trilha.focoPrincipal ? this.escapeHtml(trilha.focoPrincipal) : ''}"
                           maxlength="100" placeholder="Ex.: IA, Soft Skills, Dados">
                    <div class="form-error" id="focoPrincipal-error"></div>
                </div>
            </form>
        `;
    },

    // ========================================
    // EMPTY STATE
    // ========================================
    createEmptyState(title, description, actionText = null, actionCallback = null) {
        return `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3 class="empty-state-title">${title}</h3>
                <p class="empty-state-description">${description}</p>
                ${actionText ? `<button class="btn btn-primary" onclick="${actionCallback}">${actionText}</button>` : ''}
            </div>
        `;
    },

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text ?? '';
        return div.innerHTML;
    },

    formatCpf(cpf) {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    formatTelefone(telefone) {
        if (!telefone) return '';
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },

    formatNivelLabel(nivel) {
        if (!nivel) return '';
        const normalized = nivel.toUpperCase();
        const labels = {
            INICIANTE: 'Iniciante',
            INTERMEDIARIO: 'Intermediário',
            AVANCADO: 'Avançado',
        };
        return labels[normalized] || this.escapeHtml(nivel);
    },

    // Form validation
    validateForm(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            const errorElement = document.getElementById(`${input.name}-error`);
            
            if (!input.value.trim()) {
                input.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'Este campo é obrigatório';
                }
                isValid = false;
            } else {
                input.classList.remove('error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });

        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const errorElement = document.getElementById(`${emailInput.name}-error`);
            
            if (!emailRegex.test(emailInput.value)) {
                emailInput.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'Email inválido';
                }
                isValid = false;
            }
        }

        return isValid;
    },

    // Get form data
    getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            const trimmed = value.trim();
            if (!trimmed) {
                continue;
            }

            const field = form.querySelector(`[name="${key}"]`);
            if (field && field.type === 'number') {
                data[key] = Number(trimmed);
            } else {
                data[key] = trimmed;
            }
        }

        return data;
    },

    // Display API errors on form
    displayFormErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
            const errorElement = document.getElementById(`${field}-error`);
            const inputElement = document.getElementById(field);
            
            if (errorElement && inputElement) {
                inputElement.classList.add('error');
                errorElement.textContent = errors[fieldName].join(', ');
            }
        });
    },

    // Mask inputs
    maskCpf(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = value;
    },

    maskTelefone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        input.value = value;
    },

    // ========================================
    // MATRICULA CARD
    // ========================================
    createMatriculaCard(matricula) {
        const statusBadge = this.createStatusBadge(matricula.status);
        const progressBar = this.createProgressBar(matricula.progressoPercentual || 0);
        
        return `
            <div class="card matricula-card" data-id="${matricula.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${this.escapeHtml(matricula.trilhaNome)}</h3>
                        <p class="card-subtitle">${this.escapeHtml(matricula.usuarioNome)}</p>
                    </div>
                    <div class="card-actions">
                        ${matricula.status === 'ATIVA' ? `
                            <button class="card-btn primary" data-action="concluir-matricula" data-id="${matricula.id}" title="Concluir">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </button>
                            <button class="card-btn warning" data-action="cancelar-matricula" data-id="${matricula.id}" title="Cancelar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="card-btn delete" data-action="delete-matricula" data-id="${matricula.id}" title="Deletar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-field">
                        <div class="card-label">Status</div>
                        <div class="card-value">${statusBadge}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Progresso</div>
                        <div class="card-value">${progressBar}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Inscrição</div>
                        <div class="card-value">${this.formatDate(matricula.dataInscricao)}</div>
                    </div>
                    ${matricula.dataConclusao ? `
                    <div class="card-field">
                        <div class="card-label">Conclusão</div>
                        <div class="card-value">${this.formatDate(matricula.dataConclusao)}</div>
                    </div>
                    ` : ''}
                    ${matricula.avaliacao ? `
                    <div class="card-field">
                        <div class="card-label">Avaliação</div>
                        <div class="card-value">${this.createStarRating(matricula.avaliacao)}</div>
                    </div>
                    ` : ''}
                    <div class="card-field">
                        <div class="card-label">Nível</div>
                        <div class="card-value">${this.formatNivelLabel(matricula.trilhaNivel)}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Carga Horária</div>
                        <div class="card-value">${matricula.trilhaCargaHoraria}h</div>
                    </div>
                </div>
            </div>
        `;
    },

    createStatusBadge(status) {
        const badges = {
            ATIVA: '<span class="badge badge-success">Ativa</span>',
            CONCLUIDA: '<span class="badge badge-primary">Concluída</span>',
            CANCELADA: '<span class="badge badge-danger">Cancelada</span>',
        };
        return badges[status] || `<span class="badge">${this.escapeHtml(status)}</span>`;
    },

    createProgressBar(percentage) {
        const value = Math.min(100, Math.max(0, percentage || 0));
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${value}%"></div>
                <span class="progress-text">${value}%</span>
            </div>
        `;
    },

    createStarRating(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push('<span class="star filled">★</span>');
            } else {
                stars.push('<span class="star">☆</span>');
            }
        }
        return `<div class="star-rating">${stars.join('')}</div>`;
    },

    // ========================================
    // DASHBOARD STATS
    // ========================================
    createStatsCard(title, value, icon, color = 'primary') {
        return `
            <div class="stats-card stats-${color}">
                <div class="stats-icon">${icon}</div>
                <div class="stats-content">
                    <div class="stats-value">${value}</div>
                    <div class="stats-label">${title}</div>
                </div>
            </div>
        `;
    },

    createDashboard(stats) {
        const icons = {
            usuarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            trilhas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
            matriculas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
            conclusoes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        };

        return `
            <div class="dashboard-stats">
                ${this.createStatsCard('Usuários', stats.totalUsuarios, icons.usuarios, 'primary')}
                ${this.createStatsCard('Trilhas', stats.totalTrilhas, icons.trilhas, 'info')}
                ${this.createStatsCard('Matrículas Ativas', stats.matriculasAtivas, icons.matriculas, 'warning')}
                ${this.createStatsCard('Conclusões', stats.matriculasConcluidas, icons.conclusoes, 'success')}
            </div>
            
            <div class="dashboard-charts">
                <div class="chart-card">
                    <h3>Distribuição de Matrículas</h3>
                    <canvas id="chart-status" height="200"></canvas>
                </div>
                
                <div class="chart-card">
                    <h3>Taxa de Conclusão</h3>
                    <div class="metric-large">
                        <div class="metric-value-large">${stats.taxaConclusao}%</div>
                        <div class="metric-progress">
                            ${this.createProgressBar(stats.taxaConclusao)}
                        </div>
                        <div class="metric-subtitle">${stats.matriculasConcluidas} de ${stats.totalMatriculas} concluídas</div>
                    </div>
                </div>
                
                <div class="chart-card">
                    <h3>Avaliação Média</h3>
                    <div class="metric-large">
                        <div class="metric-value-large">${stats.avaliacaoMedia} <span class="metric-unit">/ 5</span></div>
                        <div class="metric-stars">
                            ${this.createStarRating(Math.round(stats.avaliacaoMedia))}
                        </div>
                        <div class="metric-subtitle">Baseado nas trilhas concluídas</div>
                    </div>
                </div>
            </div>
            
            ${stats.trilhasMaisPopulares && stats.trilhasMaisPopulares.length > 0 ? `
            <div class="dashboard-charts">
                <div class="chart-card chart-full">
                    <h3>Trilhas Mais Populares</h3>
                    <canvas id="chart-trilhas" height="100"></canvas>
                </div>
            </div>
            ` : ''}
        `;
    },

    // New, richer dashboard layout (v2)
    createDashboardV2() {
        // Inline icons for KPIs
        const icons = {
            total: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
            ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
            x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
            star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"/></svg>'
        };

        return `
            <div class="dashv2-toolbar">
                <div class="dashv2-filters">
                    <div class="filter-group">
                        <span class="filter-label">Período</span>
                        <div class="segmented" role="tablist" aria-label="Período">
                            <button class="seg-button" data-range="3m">3M</button>
                            <button class="seg-button" data-range="6m">6M</button>
                            <button class="seg-button" data-range="12m">12M</button>
                            <button class="seg-button" data-range="all">Tudo</button>
                        </div>
                        <!-- hidden inputs to keep backward compatibility with JS listeners -->
                        <input type="hidden" id="dash-range" value="12m" />
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Agrupar</span>
                        <div class="segmented" role="tablist" aria-label="Agrupar por">
                            <button class="seg-button" data-group="month">Mês</button>
                            <button class="seg-button" data-group="quarter">Trimestre</button>
                        </div>
                        <input type="hidden" id="dash-group" value="month" />
                    </div>
                </div>
                <div class="dashv2-actions">
                    <button id="dash-refresh" class="btn btn-ghost btn-sm" title="Atualizar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10"/><path d="M20.49 15A9 9 0 0 1 6.36 18.36L1 14"/></svg>
                        Atualizar
                    </button>
                </div>
            </div>

            <section class="dashv2-kpis">
                <div class="kpi kpi-accent-blue" id="kpi-total-matriculas">
                    <div class="kpi-icon">${icons.total}</div>
                    <div class="kpi-label">Matrículas</div>
                    <div class="kpi-value" data-kpi="totalMatriculas">—</div>
                    <div class="kpi-trend" data-kpi-trend="totalMatriculas"></div>
                </div>
                <div class="kpi kpi-accent-green" id="kpi-conclusoes">
                    <div class="kpi-icon">${icons.ok}</div>
                    <div class="kpi-label">Conclusões</div>
                    <div class="kpi-value" data-kpi="matriculasConcluidas">—</div>
                    <div class="kpi-trend" data-kpi-trend="matriculasConcluidas"></div>
                </div>
                <div class="kpi kpi-accent-orange" id="kpi-ativas">
                    <div class="kpi-icon">${icons.play}</div>
                    <div class="kpi-label">Ativas</div>
                    <div class="kpi-value" data-kpi="matriculasAtivas">—</div>
                    <div class="kpi-trend" data-kpi-trend="matriculasAtivas"></div>
                </div>
                <div class="kpi kpi-accent-red" id="kpi-canceladas">
                    <div class="kpi-icon">${icons.x}</div>
                    <div class="kpi-label">Canceladas</div>
                    <div class="kpi-value" data-kpi="matriculasCanceladas">—</div>
                    <div class="kpi-trend" data-kpi-trend="matriculasCanceladas"></div>
                </div>
                <div class="kpi kpi-accent-purple" id="kpi-avaliacao">
                    <div class="kpi-icon">${icons.star}</div>
                    <div class="kpi-label">Avaliação Média</div>
                    <div class="kpi-value"><span data-kpi="avaliacaoMedia">—</span><span class="kpi-unit">/5</span></div>
                    <div class="kpi-stars" data-kpi-stars></div>
                </div>
            </section>

            <section class="dashv2-grid">
                <div class="panel">
                    <div class="panel-header">
                        <h3>Novas Matrículas</h3>
                        <div class="panel-actions">
                            <button class="icon-btn" data-export="chart-matriculas" title="Exportar PNG">📤</button>
                        </div>
                    </div>
                    <div class="panel-body">
                        <canvas id="chart-matriculas"></canvas>
                    </div>
                </div>

                <div class="panel">
                    <div class="panel-header">
                        <h3>Status por Período</h3>
                        <div class="panel-actions">
                            <button class="icon-btn" data-export="chart-status-stacked" title="Exportar PNG">📤</button>
                        </div>
                    </div>
                    <div class="panel-body">
                        <canvas id="chart-status-stacked"></canvas>
                    </div>
                </div>

                <div class="panel">
                    <div class="panel-header">
                        <h3>Nível das Trilhas</h3>
                        <div class="panel-actions">
                            <button class="icon-btn" data-export="chart-niveis" title="Exportar PNG">📤</button>
                        </div>
                    </div>
                    <div class="panel-body">
                        <canvas id="chart-niveis"></canvas>
                    </div>
                </div>

                <div class="panel">
                    <div class="panel-header">
                        <h3>Top Trilhas</h3>
                        <div class="panel-actions">
                            <button class="icon-btn" data-export="chart-top-trilhas" title="Exportar PNG">📤</button>
                        </div>
                    </div>
                    <div class="panel-body">
                        <canvas id="chart-top-trilhas"></canvas>
                    </div>
                </div>

                <div class="panel panel-wide">
                    <div class="panel-header">
                        <h3>Avaliação por Nível</h3>
                        <div class="panel-actions">
                            <button class="icon-btn" data-export="chart-avaliacao-nivel" title="Exportar PNG">📤</button>
                        </div>
                    </div>
                    <div class="panel-body">
                        <canvas id="chart-avaliacao-nivel"></canvas>
                    </div>
                </div>
            </section>
        `;
    },

    // ========================================
    // INSCREVER MODAL
    // ========================================
    createInscreverForm(usuarios, trilhas) {
        return `
            <form id="inscrever-form" class="form">
                <div class="form-group">
                    <label for="usuarioId" class="form-label">Usuário *</label>
                    <select id="usuarioId" name="usuarioId" class="form-input" required>
                        <option value="">Selecione um usuário</option>
                        ${usuarios.map(u => `
                            <option value="${u.id}">${this.escapeHtml(u.nome)} (${this.escapeHtml(u.email)})</option>
                        `).join('')}
                    </select>
                    <span id="usuarioId-error" class="form-error"></span>
                </div>
                <div class="form-group">
                    <label for="trilhaId" class="form-label">Trilha *</label>
                    <select id="trilhaId" name="trilhaId" class="form-input" required>
                        <option value="">Selecione uma trilha</option>
                        ${trilhas.map(t => `
                            <option value="${t.id}">${this.escapeHtml(t.nome)} - ${this.formatNivelLabel(t.nivel)} (${t.cargaHoraria}h)</option>
                        `).join('')}
                    </select>
                    <span id="trilhaId-error" class="form-error"></span>
                </div>
            </form>
        `;
    }
};
