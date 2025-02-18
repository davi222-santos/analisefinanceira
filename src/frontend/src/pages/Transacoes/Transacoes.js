import React, { useEffect, useState } from 'react';
import { inserirTransacao, getTransacoes, removerTransacao } from '../../services/transacoesService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './Transacoes.css';

const formatarValor = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

const Filtros = ({ filtroMes, setFiltroMes, filtroAno, setFiltroAno }) => (
  <div className="filtros-container">
    <h2>Filtrar Transações</h2>
    <div className="filtro-item">
      <label htmlFor="mes">Mês:</label>
      <select
        id="mes"
        value={filtroMes}
        onChange={(e) => setFiltroMes(e.target.value)}
      >
        <option value="">Todos</option>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(2023, i).toLocaleString('pt-BR', { month: 'long' })}
          </option>
        ))}
      </select>
    </div>
    <div className="filtro-item">
      <label htmlFor="ano">Ano:</label>
      <input
        id="ano"
        type="number"
        value={filtroAno}
        onChange={(e) => setFiltroAno(e.target.value)}
        placeholder="Ex: 2024"
      />
    </div>
  </div>
);

const Transacao = () => {
  const userId = localStorage.getItem('userId');
  const [transacoes, setTransacoes] = useState([]);
  const [dadosTransacao, setDadosTransacao] = useState({
    valor: '',
    tipo: '',
    user_id: userId,
    data: '',
    categoria: '',
    metodo: '',
    descricao: '',
    remetente: '',
  });
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAno, setFiltroAno] = useState('');
  const [mostrarCamposExtras, setMostrarCamposExtras] = useState(false);

  useEffect(() => {
    getTransacoes(userId).then((data) => {
      console.log("Resposta da API:", data);
      setTransacoes(data);
    })
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "valor" ? parseFloat(value) || '' : value;
    setDadosTransacao((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await inserirTransacao({ ...dadosTransacao, user_id: userId });
    getTransacoes(userId).then(setTransacoes);
    setDadosTransacao({
      valor: '',
      tipo: '',
      user_id: userId,
      data: '',
      categoria: '',
      metodo: '',
      descricao: '',
      remetente: '',
    });
  };

  const handleRemoverTransacao = async (id) => {
    await removerTransacao(id);
    getTransacoes(userId).then(setTransacoes);
  };

  const filtrarTransacoes = () => {
    return transacoes.filter((transacao) => {
      const data = new Date(transacao.data);
      return (
        (filtroMes ? data.getMonth() + 1 === parseInt(filtroMes) : true) &&
        (filtroAno ? data.getFullYear() === parseInt(filtroAno) : true)
      );
    });
  };

  return (
    <div className="transacoes-container">
      <form onSubmit={handleSubmit} className="transacoes-form">
        <h2>Adicione uma Transação</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Valor:</label>
            <input type="number" name="valor" value={dadosTransacao.valor} onChange={handleChange} required />
          </div>
          <div>
            <label>Tipo:</label>
            <select name="tipo" value={dadosTransacao.tipo} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="saida">Despesa</option>
              <option value="entrada">Receita</option>
            </select>
          </div>
          <div>
            <label>Data:</label>
            <input type="date" name="data" value={dadosTransacao.data} onChange={handleChange} required />
          </div>
        </div>

        {/* Botão de seta para mostrar/ocultar campos extras */}
        <span
          className={`toggle-text ${mostrarCamposExtras ? 'rotate' : ''}`}
          onClick={() => setMostrarCamposExtras(!mostrarCamposExtras)}
        >
          <FontAwesomeIcon icon={mostrarCamposExtras ? faChevronUp : faChevronDown} />
        </span>

        {/* Campos extras */}
        {mostrarCamposExtras && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Categoria:</label>
              <input type="text" name="categoria" value={dadosTransacao.categoria} onChange={handleChange} />
            </div>
            <div>
              <label>Método:</label>
              <input type="text" name="metodo" value={dadosTransacao.metodo} onChange={handleChange} />
            </div>
            <div>
              <label>Descrição:</label>
              <input type="text" name="descricao" value={dadosTransacao.descricao} onChange={handleChange} />
            </div>
            <div>
              <label>Remetente:</label>
              <input type="text" name="remetente" value={dadosTransacao.remetente} onChange={handleChange} />
            </div>
          </div>
        )}

        <button type="submit">Adicionar Transação</button>
      </form>

      <div className="transacoes-lista-container">
        <Filtros
          filtroMes={filtroMes}
          setFiltroMes={setFiltroMes}
          filtroAno={filtroAno}
          setFiltroAno={setFiltroAno}
        />
      </div>

      <div className="transacoes-lista">
        <h2>Lista de Transações</h2>
        {filtrarTransacoes().length > 0 ? (
          <ul>
            {filtrarTransacoes().map((transacao) => (
              <li key={transacao._id} className={transacao.tipo === 'saida' ? 'saida' : 'entrada'}>
                <span>{transacao.descricao}</span> - {formatarValor(transacao.valor)} - {formatarData(transacao.data)}
                <button onClick={() => handleRemoverTransacao(transacao._id)}>✖</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma transação encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default Transacao;
