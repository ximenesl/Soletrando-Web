# Soletrando

## Descrição

O Soletrando é um jogo de soletração interativo projetado para ajudar os usuários a praticar suas habilidades de soletração de uma forma divertida e educativa. A aplicação web é construída com React e se comunica com um backend Python que gerencia a lógica do jogo.

O projeto é totalmente responsivo, adaptando-se a diferentes tamanhos de tela, de desktops a dispositivos móveis.

Uma característica opcional deste projeto é a sua integração com o robô NAO, que pode ser usado como uma fonte de microfone para entrada de voz, oferecendo uma experiência de usuário única e interativa.

## Fluxo da Aplicação

1.  **Página Inicial**: Uma tela de boas-vindas ao jogo com um botão para começar.
2.  **Configurações do Jogo**: Permite ao usuário configurar o jogo, escolhendo o nível de dificuldade (ano escolar) e a fonte do microfone (PC ou NAO, se conectado).
3.  **Página do Jogo**: A tela principal do jogo, onde o usuário ouve a palavra e a soletra.
4.  **Página Final**: Exibe a pontuação final do jogador e oferece a opção de jogar novamente.

## Como Executar o Projeto

Para executar o projeto, você precisará ter o Node.js e o Python instalados em sua máquina.

### Backend

1.  Abra um terminal e navegue até o diretório do backend.
2.  Instale as dependências do Python:
    ```bash
    pip install -r requirements.txt
    ```
3.  Inicie o servidor de backend:
    ```bash
    python api.py
    ```

O servidor backend estará em execução em `http://localhost:8000`.

### Frontend

1.  Abra outro terminal e navegue até o diretório `interface`.
2.  Instale as dependências do Node.js:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```

A aplicação web estará acessível em `http://localhost:5173` (ou em outra porta, se a 5173 estiver em uso).
