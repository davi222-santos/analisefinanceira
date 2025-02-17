import API_URL from "./config";

export async function autenticarUsuario({ cnpj, senha }) {
    const response = await fetch(`${API_URL}/api/usuario/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj, senha }),
    });

    return response.json();
}

export async function cadastrarUsuario({ cnpj, nome, email, senha }) {
    const response = await fetch(`${API_URL}/api/usuario/novo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj, nome, email, senha }),
    });

    return response.json();
}
