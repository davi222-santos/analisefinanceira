import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../../services/usuarioService";
import "./Register.css";
import ExampleImage from "../../assets/images/3.png";

const Register = () => {
    const [dados, setDados] = useState({
        cnpj: "",
        nome: "",
        phone: "",
        email: "",
        confirmEmail: "",
        senha: "",
    });
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDados({ ...dados, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (dados.email !== dados.confirmEmail) {
            setMensagem("Os e-mails não coincidem!");
            return;
        }

        try {
            const response = await cadastrarUsuario({
                cnpj: dados.cnpj,
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
            });

            if (response.user_id) {
                setMensagem("Usuário cadastrado com sucesso!");
                localStorage.setItem('userId', response.user_id);
                setTimeout(() => navigate("/login"), 2000); // Redireciona para o login após 2s
            } else {
                setMensagem(response.message || "Erro ao cadastrar");
            }
        } catch (error) {
            setMensagem("Erro na conexão com o servidor");
        }
    };

    return (
        <div className="register-container">
            <div className="text-container">
                <h2 className="title">Complete os campos ao lado para concluir seu cadastro</h2>
                <img src={ExampleImage} alt="Dashboard Preview" className="image" />
            </div>
            <div className="form-section">
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>CNPJ:</label>
                        <input type="text" name="cnpj" className="input" value={dados.cnpj} onChange={handleChange} required />
                    </div>
                    <div className="input-container">
                        <label>Nome da Empresa:</label>
                        <input type="text" name="nome" className="input" value={dados.nome} onChange={handleChange} required />
                    </div>
                    <div className="input-container">
                        <label>Celular:</label>
                        <input type="text" name="phone" className="input" value={dados.phone} onChange={handleChange} />
                    </div>
                    <div className="input-container">
                        <label>Email:</label>
                        <input type="email" name="email" className="input" value={dados.email} onChange={handleChange} required />
                    </div>
                    <div className="input-container">
                        <label>Confirmar Email:</label>
                        <input type="email" name="confirmEmail" className="input" value={dados.confirmEmail} onChange={handleChange} required />
                    </div>
                    <div className="input-container">
                        <label>Senha:</label>
                        <input type="password" name="senha" className="input" value={dados.senha} onChange={handleChange} required />
                    </div>
                    {mensagem && <p className="error-message">{mensagem}</p>}
                    <button type="submit" className="button">Criar conta</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
