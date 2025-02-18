import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { autenticarUsuario } from "../../services/usuarioService"; // Importa o serviço de API
import exampleImage from "../../assets/images/2.png";
import "./Login.css";

const Login = () => {
    const [cnpj, setCnpj] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagem("");

        try {
            const response = await autenticarUsuario({ cnpj, senha: password });
            
            if (response.user_id && response.token) {
                localStorage.setItem("userId", response.user_id);
                localStorage.setItem('token', response.token);
                navigate("/dashboard");
            } else {
                console.log("Erro ao autenticar, token ou user_id não encontrados", response);
                setMensagem(response.message || "Erro ao autenticar");
            }
        } catch (error) {
            setMensagem("Erro na conexão com o servidor");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="image-container">
                    <img src={exampleImage} alt="Financial data" className="login-image" />
                </div>
                <div className="form-container">
                    <h2 className="title">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-container">
                            <input
                                type="text"
                                name="cnpj"
                                className="input"
                                placeholder="CNPJ"
                                value={cnpj}
                                onChange={(e) => setCnpj(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                name="password"
                                className="input"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {mensagem && <p className="error-message">{mensagem}</p>}
                        <button type="submit" className="button">Entrar</button>
                    </form>
                    <p className="forgot-password">Esqueceu a senha?</p>
                </div>
            </div>
        </div>
    );
};

export default Login;