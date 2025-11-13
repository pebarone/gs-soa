// API Service Module
// Handles all HTTP requests to the backend API

const API_BASE_URL = window.location.origin;

class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Generic request handler with error handling
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const isJson = (response.headers.get('content-type') || '').includes('application/json');
            
            // Handle different response statuses
            if (response.status === 204 || !isJson) {
                if (!response.ok) {
                    throw {
                        status: response.status,
                        message: response.statusText || 'Erro desconhecido',
                        errors: {},
                    };
                }
                return null; // No content
            }

            const rawData = await response.json();
            const data = this.normalizeKeys(rawData);

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || data.title || 'Erro desconhecido',
                    errors: data.errors || {},
                };
            }

            return data;
        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                message: 'Erro de conexão com o servidor',
                errors: {},
            };
        }
    }

    // ========================================
    // USUARIOS ENDPOINTS (v1)
    // ========================================

    // GET /api/v1/usuarios - Listar todos os usuários
    async getUsuarios() {
        return this.request('/api/v1/usuarios', {
            method: 'GET',
        });
    }

    // GET /api/v1/usuarios/{id} - Buscar usuário por ID
    async getUsuario(id) {
        return this.request(`/api/v1/usuarios/${id}`, {
            method: 'GET',
        });
    }

    // POST /api/v1/usuarios - Criar novo usuário
    async createUsuario(usuario) {
        return this.request('/api/v1/usuarios', {
            method: 'POST',
            body: JSON.stringify(usuario),
        });
    }

    // PUT /api/v1/usuarios/{id} - Atualizar usuário
    async updateUsuario(id, usuario) {
        return this.request(`/api/v1/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(usuario),
        });
    }

    // DELETE /api/v1/usuarios/{id} - Deletar usuário
    async deleteUsuario(id) {
        return this.request(`/api/v1/usuarios/${id}`, {
            method: 'DELETE',
        });
    }

    // ========================================
    // TRILHAS ENDPOINTS (v1)
    // ========================================

    // GET /api/v1/trilhas - Listar todas as trilhas
    async getTrilhas() {
        return this.request('/api/v1/trilhas', {
            method: 'GET',
        });
    }

    // GET /api/v1/trilhas/{id} - Buscar trilha por ID
    async getTrilha(id) {
        return this.request(`/api/v1/trilhas/${id}`, {
            method: 'GET',
        });
    }

    // POST /api/v1/trilhas - Criar nova trilha
    async createTrilha(trilha) {
        return this.request('/api/v1/trilhas', {
            method: 'POST',
            body: JSON.stringify(trilha),
        });
    }

    // PUT /api/v1/trilhas/{id} - Atualizar trilha
    async updateTrilha(id, trilha) {
        return this.request(`/api/v1/trilhas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(trilha),
        });
    }

    // DELETE /api/v1/trilhas/{id} - Deletar trilha
    async deleteTrilha(id) {
        return this.request(`/api/v1/trilhas/${id}`, {
            method: 'DELETE',
        });
    }

    // ========================================
    // MATRICULAS ENDPOINTS (v2)
    // ========================================

    // GET /api/v2/matriculas - Listar todas as matrículas
    async getMatriculas() {
        return this.request('/api/v2/matriculas', {
            method: 'GET',
        });
    }

    // GET /api/v2/matriculas/{id} - Buscar matrícula por ID
    async getMatricula(id) {
        return this.request(`/api/v2/matriculas/${id}`, {
            method: 'GET',
        });
    }

    // GET /api/v2/matriculas/usuario/{usuarioId} - Listar matrículas por usuário
    async getMatriculasByUsuario(usuarioId) {
        return this.request(`/api/v2/matriculas/usuario/${usuarioId}`, {
            method: 'GET',
        });
    }

    // GET /api/v2/matriculas/trilha/{trilhaId} - Listar matrículas por trilha
    async getMatriculasByTrilha(trilhaId) {
        return this.request(`/api/v2/matriculas/trilha/${trilhaId}`, {
            method: 'GET',
        });
    }

    // POST /api/v2/matriculas/inscrever - Inscrever usuário em trilha
    async inscreverTrilha(matricula) {
        return this.request('/api/v2/matriculas/inscrever', {
            method: 'POST',
            body: JSON.stringify(matricula),
        });
    }

    // PATCH /api/v2/matriculas/{id} - Atualizar progresso/avaliação
    async updateMatricula(id, data) {
        return this.request(`/api/v2/matriculas/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // POST /api/v2/matriculas/{id}/concluir - Concluir matrícula
    async concluirMatricula(id, avaliacao = null) {
        return this.request(`/api/v2/matriculas/${id}/concluir`, {
            method: 'POST',
            body: JSON.stringify(avaliacao),
        });
    }

    // POST /api/v2/matriculas/{id}/cancelar - Cancelar matrícula
    async cancelarMatricula(id) {
        return this.request(`/api/v2/matriculas/${id}/cancelar`, {
            method: 'POST',
        });
    }

    // DELETE /api/v2/matriculas/{id} - Deletar matrícula
    async deleteMatricula(id) {
        return this.request(`/api/v2/matriculas/${id}`, {
            method: 'DELETE',
        });
    }

    // ========================================
    // ESTATISTICAS ENDPOINTS (v2)
    // ========================================

    // GET /api/v2/estatisticas - Obter estatísticas gerais
    async getEstatisticas() {
        return this.request('/api/v2/estatisticas', {
            method: 'GET',
        });
    }

    normalizeKeys(payload) {
        if (Array.isArray(payload)) {
            return payload.map(item => this.normalizeKeys(item));
        }

        if (payload !== null && typeof payload === 'object') {
            const normalized = {};
            Object.entries(payload).forEach(([key, value]) => {
                normalized[this.toCamelCase(key)] = this.normalizeKeys(value);
            });
            return normalized;
        }

        return payload;
    }

    toCamelCase(key) {
        if (!key || typeof key !== 'string') {
            return key;
        }

        if (key.length === 1) {
            return key.toLowerCase();
        }

        return key.charAt(0).toLowerCase() + key.slice(1);
    }
}

// Export singleton instance
const api = new ApiService(API_BASE_URL);
