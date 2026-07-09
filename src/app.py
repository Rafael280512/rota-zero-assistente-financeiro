# Interface Streamlit do agente Rota Zero (Etapa 4 - Aplicacao Funcional).
# Para rodar localmente: streamlit run src/app.py
import streamlit as st

import agente
import config

st.set_page_config(page_title="Rota Zero", page_icon="🧭")
st.title("Rota Zero - Assistente Financeiro")
st.caption("Prototipo do Lab DIO: Construa seu Assistente Virtual com Inteligencia Artificial")

if not config.GOOGLE_API_KEY:
    st.warning("Defina a variavel de ambiente GOOGLE_API_KEY (veja .env.example) para conversar com o Rota Zero.")
    st.stop()

if "historico_chat" not in st.session_state:
    st.session_state.historico_chat = []

if "mensagens_exibidas" not in st.session_state:
    st.session_state.mensagens_exibidas = []

if "modelo" not in st.session_state:
    st.session_state.modelo = agente.montar_modelo()

if "contexto" not in st.session_state:
    perfil, produtos = agente.carregar_base_conhecimento()
    st.session_state.contexto = agente.montar_contexto(perfil, produtos)
    st.session_state.nome_cliente = perfil.get("nome", "")

st.sidebar.header("Sobre o Rota Zero")
st.sidebar.write("Assistente educativo para ajudar pessoas endividadas a sairem do vermelho e planejarem investimentos saudaveis.")
st.sidebar.write("Cliente de exemplo: " + st.session_state.nome_cliente)

for autor, texto in st.session_state.mensagens_exibidas:
    with st.chat_message(autor):
        st.write(texto)

pergunta = st.chat_input("Escreva sua pergunta para o Rota Zero...")

if pergunta:
    st.session_state.mensagens_exibidas.append(("user", pergunta))
    with st.chat_message("user"):
        st.write(pergunta)
    with st.chat_message("assistant"):
        with st.spinner("Rota Zero esta pensando..."):
            resposta, historico = agente.perguntar(
                st.session_state.modelo,
                st.session_state.contexto,
                st.session_state.historico_chat,
                pergunta,
            )
            st.session_state.historico_chat = historico
        st.write(resposta)
    st.session_state.mensagens_exibidas.append(("assistant", resposta))
