-- V2__Seed_Data_Oracle.sql
-- Dados iniciais (seeds) para a plataforma (Oracle)
-- Usa prefixo TRILHAS_ nas tabelas

-- Inserir competências do futuro do trabalho
INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Inteligência Artificial', 'Tecnologia', 'Compreensão e aplicação de IA, Machine Learning e Deep Learning');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Análise de Dados', 'Tecnologia', 'Capacidade de interpretar e extrair insights de grandes volumes de dados');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Cloud Computing', 'Tecnologia', 'Conhecimento em computação em nuvem (AWS, Azure, GCP)');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Cibersegurança', 'Tecnologia', 'Proteção de sistemas e dados contra ameaças digitais');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Desenvolvimento Sustentável', 'Tecnologia', 'Tecnologias verdes e práticas sustentáveis');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Pensamento Crítico', 'Humana', 'Capacidade de análise lógica e tomada de decisões fundamentadas');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Criatividade', 'Humana', 'Inovação e desenvolvimento de soluções originais');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Inteligência Emocional', 'Humana', 'Capacidade de reconhecer e gerenciar emoções');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Colaboração', 'Humana', 'Trabalho efetivo em equipe e ambientes híbridos');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Adaptabilidade', 'Humana', 'Flexibilidade para mudanças e novas situações');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Gestão de Projetos Ágeis', 'Gestão', 'Metodologias ágeis (Scrum, Kanban)');

INSERT INTO TRILHAS_COMPETENCIAS (nome, categoria, descricao) VALUES
('Liderança Digital', 'Gestão', 'Liderança em ambientes digitais e remotos');

-- Inserir trilhas de aprendizagem
INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('IA Generativa para Profissionais', 'Aprenda a utilizar ferramentas de IA generativa no dia a dia profissional', 'INICIANTE', 40, 'IA');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Cientista de Dados 2030', 'Formação completa em análise de dados, estatística e machine learning', 'AVANCADO', 200, 'Dados');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Cloud Engineer Essentials', 'Fundamentos de computação em nuvem e arquitetura de sistemas distribuídos', 'INTERMEDIARIO', 80, 'Cloud');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Cibersegurança para o Futuro', 'Proteção de dados e sistemas em ambientes digitais', 'INTERMEDIARIO', 120, 'Segurança');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Soft Skills para Líderes Digitais', 'Desenvolva habilidades humanas essenciais para liderança no futuro', 'INICIANTE', 60, 'Soft Skills');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Green Tech e Sustentabilidade', 'Tecnologias sustentáveis e economia circular', 'INICIANTE', 50, 'Sustentabilidade');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Transformação Digital Completa', 'Entenda e lidere processos de transformação digital nas organizações', 'AVANCADO', 160, 'Gestão');

INSERT INTO TRILHAS_TRILHAS (nome, descricao, nivel, carga_horaria, foco_principal) VALUES
('Desenvolvimento Ágil de Software', 'Metodologias ágeis aplicadas ao desenvolvimento de software', 'INTERMEDIARIO', 100, 'Tecnologia');

-- Relacionar trilhas com competências
-- IA Generativa
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (1, 1);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (1, 6);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (1, 7);

-- Cientista de Dados
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (2, 1);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (2, 2);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (2, 6);

-- Cloud Engineer
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (3, 3);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (3, 11);

-- Cibersegurança
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (4, 4);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (4, 6);

-- Soft Skills
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (5, 6);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (5, 7);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (5, 8);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (5, 9);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (5, 10);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (5, 12);

-- Green Tech
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (6, 5);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (6, 7);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (6, 10);

-- Transformação Digital
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (7, 1);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (7, 3);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (7, 11);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (7, 12);

-- Desenvolvimento Ágil
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (8, 9);
INSERT INTO TRILHAS_TRILHA_COMPETENCIA (trilha_id, competencia_id) VALUES (8, 11);

-- Inserir usuários de exemplo
INSERT INTO TRILHAS_USUARIOS (nome, email, area_atuacao, nivel_carreira, data_cadastro) VALUES
('Ana Silva', 'ana.silva@email.com', 'Tecnologia da Informação', 'Pleno', TO_DATE('2025-01-15', 'YYYY-MM-DD'));

INSERT INTO TRILHAS_USUARIOS (nome, email, area_atuacao, nivel_carreira, data_cadastro) VALUES
('Carlos Santos', 'carlos.santos@email.com', 'Gestão de Projetos', 'Senior', TO_DATE('2025-02-10', 'YYYY-MM-DD'));

INSERT INTO TRILHAS_USUARIOS (nome, email, area_atuacao, nivel_carreira, data_cadastro) VALUES
('Maria Oliveira', 'maria.oliveira@email.com', 'Marketing Digital', 'Junior', TO_DATE('2025-03-05', 'YYYY-MM-DD'));

INSERT INTO TRILHAS_USUARIOS (nome, email, area_atuacao, nivel_carreira, data_cadastro) VALUES
('João Pereira', 'joao.pereira@email.com', 'Análise de Dados', 'Em transição', TO_DATE('2025-03-20', 'YYYY-MM-DD'));

-- Inserir matrículas de exemplo
INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, progresso_percentual) VALUES
(1, 1, TO_DATE('2025-01-20', 'YYYY-MM-DD'), 'ATIVA', 65);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, progresso_percentual) VALUES
(1, 3, TO_DATE('2025-02-01', 'YYYY-MM-DD'), 'ATIVA', 30);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, progresso_percentual) VALUES
(2, 5, TO_DATE('2025-02-15', 'YYYY-MM-DD'), 'ATIVA', 80);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, data_conclusao, progresso_percentual, avaliacao) VALUES
(2, 7, TO_DATE('2025-02-20', 'YYYY-MM-DD'), 'CONCLUIDA', TO_DATE('2025-04-15', 'YYYY-MM-DD'), 100, 5);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, progresso_percentual) VALUES
(3, 1, TO_DATE('2025-03-10', 'YYYY-MM-DD'), 'ATIVA', 45);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, progresso_percentual) VALUES
(4, 2, TO_DATE('2025-03-25', 'YYYY-MM-DD'), 'ATIVA', 20);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, data_cancelamento, progresso_percentual) VALUES
(3, 4, TO_DATE('2025-02-05', 'YYYY-MM-DD'), 'CANCELADA', TO_DATE('2025-02-28', 'YYYY-MM-DD'), 15);

INSERT INTO TRILHAS_MATRICULAS (usuario_id, trilha_id, data_inscricao, status, data_conclusao, progresso_percentual, avaliacao) VALUES
(4, 6, TO_DATE('2025-01-10', 'YYYY-MM-DD'), 'CONCLUIDA', TO_DATE('2025-02-20', 'YYYY-MM-DD'), 100, 4);

-- Commit das alterações
COMMIT;
