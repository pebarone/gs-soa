# GS SOA - API Plataforma de Upskilling/Reskilling

API RESTful com versionamento para plataforma de capacitação profissional voltada ao futuro do trabalho 2030+.

## Descrição

Este projeto implementa uma plataforma completa de upskilling e reskilling profissional com funcionalidades de gerenciamento de usuários, trilhas de aprendizagem, matrículas e estatísticas. A API utiliza versionamento para permitir evolução gradual e compatibilidade.

## Tecnologias

- **ASP.NET Core 8.0** - Framework web moderno e performático
- **Entity Framework Core 8.0** - ORM para acesso a dados
- **Oracle Database** - Banco de dados relacional enterprise
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers
- **Swagger/OpenAPI** - Documentação interativa da API
- **Microsoft.AspNetCore.Mvc.Versioning** - Versionamento de API

## Estrutura do Projeto

```
gs-profissoes/
├── src/
│   ├── Controllers/        # Endpoints da API (v1 e v2)
│   │   ├── UsuariosController.cs (v1)
│   │   ├── TrilhasController.cs (v1)
│   │   ├── MatriculasController.cs (v2)
│   │   └── EstatisticasController.cs (v2)
│   ├── Services/          # Lógica de negócio
│   ├── Repositories/      # Acesso a dados
│   ├── Models/            # Entidades do domínio
│   ├── DTOs/              # Objetos de transferência
│   ├── Data/              # Contexto do banco
│   ├── Middleware/        # Tratamento de exceções
│   ├── Exceptions/        # Exceções customizadas
│   └── Program.cs         # Configuração da aplicação
├── Migrations/            # Scripts SQL (Oracle)
│   ├── V1__Initial_Schema_Oracle.sql
│   └── V2__Seed_Data_Oracle.sql
├── static/                # Frontend SPA
│   ├── index.html
│   ├── css/
│   └── js/
│       ├── api.js         # Chamadas à API
│       ├── components.js  # Componentes UI
│       └── app.js         # Lógica da aplicação
└── postman_collection.json
```

## Configuração e Execução

### Opção 1: Executar com Docker (Recomendado)

#### Pré-requisitos

- Docker 20.10 ou superior
- Docker Compose 2.0 ou superior

#### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/pebarone/gs-soa.git
cd gs-soa
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Oracle Database:
```env
DB_CONNECTION_STRING=User Id=seu_usuario;Password=sua_senha;Data Source=seu_host:1521/seu_service
```

3. Execute a aplicação com Docker Compose:
```bash
docker-compose up -d
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5000
- **API v1**: http://localhost:5000/api/v1
- **API v2**: http://localhost:5000/api/v2
- **Swagger**: http://localhost:5000/api-docs

#### Comandos Docker Úteis

Parar a aplicação:
```bash
docker-compose down
```

Ver logs da aplicação:
```bash
docker-compose logs -f app
```

Reconstruir a imagem após mudanças no código:
```bash
docker-compose up -d --build
```

Executar comandos dentro do container:
```bash
docker-compose exec app /bin/bash
```

### Opção 2: Executar com Docker (sem Docker Compose)

Build da imagem:
```bash
docker build -t gs-profissoes .
```

Executar o container:
```bash
docker run -d \
  -p 5000:5000 \
  -e ConnectionStrings__DefaultConnection="User Id=seu_usuario;Password=sua_senha;Data Source=seu_host:1521/seu_service" \
  --name gs-profissoes-app \
  gs-profissoes
```

### Opção 3: Executar Localmente (sem Docker)

#### Pré-requisitos

- .NET 8.0 SDK
- Oracle Database

#### Passos para Execução

1. Configure a string de conexão no `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "User Id=seu_usuario;Password=sua_senha;Data Source=seu_host:1521/seu_service"
  }
}
```

2. Execute as migrations SQL na pasta `Migrations/` em ordem:
```bash
# 1. Criar schema
sqlplus user/password@database @Migrations/V1__Initial_Schema_Oracle.sql

# 2. Popular dados
sqlplus user/password@database @Migrations/V2__Seed_Data_Oracle.sql
```

3. Restaure as dependências e execute a aplicação:
```bash
dotnet restore
dotnet run
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5000
- **API v1**: http://localhost:5000/api/v1
- **API v2**: http://localhost:5000/api/v2
- **Swagger**: http://localhost:5000/api-docs

## Configuração do Docker

### Dockerfile

O projeto utiliza build multi-estágio para otimização:

- **Stage 1 (Build)**: Compila a aplicação usando SDK .NET 8.0
- **Stage 2 (Runtime)**: Executa a aplicação usando runtime ASP.NET Core 8.0

Características de segurança:
- Execução como usuário não-root (appuser)
- Porta não-privilegiada (5000)
- Health check configurado
- Variáveis de ambiente para produção

### Docker Compose

O arquivo `docker-compose.yml` configura:

- **Aplicação**: Container principal com a API
- **Rede isolada**: Comunicação segura entre containers
- **Health checks**: Monitoramento da saúde da aplicação
- **Limites de recursos**: CPU e memória controlados
- **Logs**: Rotação automática de logs
- **Security hardening**: Capabilidades restritas e filesystem read-only

Opcionalmente, pode incluir:
- **Oracle Database**: Container local para desenvolvimento (comentado por padrão)

## Versionamento de API

A API utiliza versionamento de URL para manter compatibilidade e permitir evolução gradual:

- **v1**: Endpoints básicos de CRUD para Usuários e Trilhas
- **v2**: Funcionalidades avançadas de Matrículas e Estatísticas

### Estratégia de Versionamento

- Versionamento explícito na URL (`/api/v1/`, `/api/v2/`)
- v1 como versão padrão quando não especificada
- Documentação separada no Swagger para cada versão
- Endpoints v1 mantidos para compatibilidade

## Endpoints da API

### API v1 - Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/usuarios` | Lista todos os usuários |
| GET | `/api/v1/usuarios/{id}` | Busca usuário por ID |
| POST | `/api/v1/usuarios` | Cria novo usuário |
| PUT | `/api/v1/usuarios/{id}` | Atualiza usuário |
| DELETE | `/api/v1/usuarios/{id}` | Remove usuário |

#### Modelo de Usuário

```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "areaAtuacao": "Tecnologia da Informação",
  "nivelCarreira": "Pleno"
}
```

### API v1 - Trilhas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/trilhas` | Lista todas as trilhas |
| GET | `/api/v1/trilhas/{id}` | Busca trilha por ID |
| POST | `/api/v1/trilhas` | Cria nova trilha |
| PUT | `/api/v1/trilhas/{id}` | Atualiza trilha |
| DELETE | `/api/v1/trilhas/{id}` | Remove trilha |

#### Modelo de Trilha

```json
{
  "nome": "IA Generativa para Profissionais",
  "descricao": "Aprenda a utilizar ferramentas de IA generativa no dia a dia profissional",
  "nivel": "INICIANTE",
  "cargaHoraria": 40,
  "focoPrincipal": "IA"
}
```

### API v2 - Matrículas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v2/matriculas` | Lista todas as matrículas |
| GET | `/api/v2/matriculas/{id}` | Busca matrícula por ID |
| GET | `/api/v2/matriculas/usuario/{usuarioId}` | Matrículas por usuário |
| GET | `/api/v2/matriculas/trilha/{trilhaId}` | Matrículas por trilha |
| POST | `/api/v2/matriculas/inscrever` | Inscreve usuário em trilha |
| PATCH | `/api/v2/matriculas/{id}` | Atualiza progresso/avaliação |
| POST | `/api/v2/matriculas/{id}/concluir` | Conclui matrícula |
| POST | `/api/v2/matriculas/{id}/cancelar` | Cancela matrícula |
| DELETE | `/api/v2/matriculas/{id}` | Remove matrícula |

#### Modelo de Matrícula (Inscrever)

```json
{
  "usuarioId": 1,
  "trilhaId": 2
}
```

#### Modelo de Matrícula (Atualizar)

```json
{
  "progressoPercentual": 75,
  "avaliacao": 5
}
```

#### Resposta de Matrícula

```json
{
  "id": 1,
  "usuarioId": 1,
  "usuarioNome": "João Silva",
  "usuarioEmail": "joao.silva@email.com",
  "trilhaId": 2,
  "trilhaNome": "IA Generativa para Profissionais",
  "trilhaNivel": "INICIANTE",
  "trilhaCargaHoraria": 40,
  "dataInscricao": "2025-01-20T00:00:00",
  "status": "ATIVA",
  "dataConclusao": null,
  "progressoPercentual": 75,
  "dataCancelamento": null,
  "avaliacao": null
}
```

#### Status de Matrícula

- `ATIVA`: Matrícula em andamento
- `CONCLUIDA`: Trilha finalizada com sucesso
- `CANCELADA`: Matrícula cancelada pelo usuário

### API v2 - Estatísticas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v2/estatisticas` | Estatísticas gerais da plataforma |

#### Resposta de Estatísticas

```json
{
  "totalUsuarios": 150,
  "totalTrilhas": 25,
  "totalMatriculas": 450,
  "matriculasAtivas": 320,
  "matriculasConcluidas": 110,
  "matriculasCanceladas": 20,
  "taxaConclusao": 24.44,
  "avaliacaoMedia": 4.65,
  "trilhasMaisPopulares": [
    {
      "trilhaId": 1,
      "trilhaNome": "IA Generativa para Profissionais",
      "totalMatriculas": 85,
      "conclusoes": 42
    }
  ]
}
```

## Frontend

A aplicação inclui um frontend SPA moderno desenvolvido com HTML, CSS e JavaScript vanilla.

### Características

- **Single Page Application (SPA)** com roteamento client-side
- **Design minimalista** inspirado em Apple Design System
- **Busca em tempo real** com filtros inteligentes
- **Validação de formulários** client-side
- **Dashboard interativo** com estatísticas e métricas
- **Gestão de matrículas** (inscrever, concluir, cancelar)
- **Notificações toast** para feedback ao usuário
- **Totalmente responsivo** para mobile, tablet e desktop

### Páginas

1. **Home**: Apresentação da plataforma
2. **Dashboard**: Estatísticas gerais, taxa de conclusão, trilhas populares
3. **Usuários**: CRUD completo de usuários
4. **Trilhas**: CRUD completo de trilhas de aprendizagem
5. **Matrículas**: Gestão de inscrições, progresso e conclusões

### Arquivos

- `static/index.html` - Estrutura principal com todas as páginas
- `static/css/styles.css` - Design system completo com CSS moderno
- `static/js/api.js` - Comunicação com API REST (v1 e v2)
- `static/js/components.js` - Componentes UI reutilizáveis
- `static/js/app.js` - Lógica da aplicação e gerenciamento de estado

## Tratamento de Erros

A API utiliza middleware customizado (`ExceptionHandlingMiddleware`) para tratamento global de exceções, retornando respostas padronizadas:

- `200 OK` - Sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem conteúdo de retorno
- `400 Bad Request` - Validação de dados inválida
- `404 Not Found` - Recurso não encontrado
- `422 Unprocessable Entity` - Regras de negócio violadas
- `500 Internal Server Error` - Erros não tratados

### Exceções Customizadas

- `ResourceNotFoundException`: Recurso não encontrado (404)
- `BusinessException`: Violação de regras de negócio (422)

## Validações

### Usuário

- **Nome**: obrigatório, máximo 100 caracteres
- **Email**: obrigatório, formato válido, único, máximo 150 caracteres
- **Área de Atuação**: opcional, máximo 100 caracteres
- **Nível de Carreira**: opcional, máximo 50 caracteres

### Trilha

- **Nome**: obrigatório, máximo 150 caracteres
- **Descrição**: opcional
- **Nível**: obrigatório (INICIANTE, INTERMEDIARIO, AVANCADO), máximo 50 caracteres
- **Carga Horária**: obrigatório, valor positivo
- **Foco Principal**: opcional, máximo 100 caracteres

### Matrícula

- **Usuário ID**: obrigatório, deve existir
- **Trilha ID**: obrigatório, deve existir
- **Progresso Percentual**: entre 0 e 100
- **Avaliação**: entre 1 e 5 estrelas
- **Regras de negócio**:
  - Usuário não pode se inscrever duas vezes na mesma trilha
  - Matrícula concluída não pode ser atualizada
  - Matrícula cancelada não pode ser concluída

## Banco de Dados

### Schema Oracle

Todas as tabelas utilizam o prefixo `TRILHAS_` e suportam:
- Chaves primárias com IDENTITY (auto-incremento)
- Foreign keys com CASCADE DELETE
- Constraints de validação (CHECK)
- Índices para otimização de queries

### Tabelas

1. **TRILHAS_USUARIOS**: Usuários da plataforma
2. **TRILHAS_TRILHAS**: Trilhas de aprendizagem
3. **TRILHAS_COMPETENCIAS**: Competências/skills
4. **TRILHAS_TRILHA_COMPETENCIA**: Relação N:N trilhas ↔ competências
5. **TRILHAS_MATRICULAS**: Matrículas com tracking de progresso

### Campos Novos em Matrículas (v2)

- `DATA_CONCLUSAO`: Data de conclusão da trilha
- `PROGRESSO_PERCENTUAL`: Progresso de 0 a 100%
- `DATA_CANCELAMENTO`: Data de cancelamento
- `AVALIACAO`: Avaliação de 1 a 5 estrelas

## Requisitos Implementados

### 1. Boas Práticas REST

- **Status codes adequados**: 200, 201, 204, 400, 404, 422, 500
- **Verbos HTTP corretos**: GET (leitura), POST (criação), PUT (atualização completa), PATCH (atualização parcial), DELETE (remoção)
- **Respostas padronizadas** com DTOs
- **Validação de entrada** com DataAnnotations
- **Tratamento de erros** centralizado

### 2. Versionamento da API

- **v1**: Endpoints de Usuários e Trilhas (`/api/v1/`)
- **v2**: Endpoints de Matrículas e Estatísticas (`/api/v2/`)
- **Versionamento na URL** para clareza e controle
- **Documentação Swagger separada** por versão
- **Microsoft.AspNetCore.Mvc.Versioning** configurado
- **Retrocompatibilidade** com v1 mantida
- **README atualizado** com documentação completa

### 3. Integração e Persistência

- **Oracle Database** como banco de dados relacional
- **Entity Framework Core** com DbContext configurado
- **Migrations SQL** versionadas (V1, V2)
- **Repository Pattern** para abstração de dados
- **Service Layer** com lógica de negócio
- **Relacionamentos** corretamente mapeados (1:N, N:N)

## Dependências NuGet

```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc.Versioning" Version="5.1.0" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer" Version="5.1.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
<PackageReference Include="Oracle.EntityFrameworkCore" Version="8.21.121" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
```

## Funcionalidades Principais

### Matrículas (API v2)
- Inscrever usuário em trilha
- Atualizar progresso (0-100%)
- Concluir trilha com avaliação opcional
- Cancelar matrícula
- Listar matrículas por usuário ou trilha
- Validações de regras de negócio

### Estatísticas (API v2)
- Total de usuários, trilhas e matrículas
- Matrículas ativas, concluídas e canceladas
- Taxa de conclusão percentual
- Avaliação média das trilhas
- Ranking de trilhas mais populares

### Dashboard Frontend
- Cards de métricas principais
- Gráficos de progresso
- Lista de trilhas mais populares
- Visualização de taxa de conclusão
- Stars rating para avaliações

## Autor

Desenvolvido para **Global Solution 2025 - FIAP**
Tema: O Futuro do Trabalho - Plataforma de Upskilling/Reskilling

## Licença

Este projeto é parte de um trabalho acadêmico.

## Testes

Utilize a collection do Postman incluída no projeto:

```bash
postman_collection.json
```

Importe no Postman para testar todos os endpoints disponíveis.

## Autores

Global Solution 2025

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
