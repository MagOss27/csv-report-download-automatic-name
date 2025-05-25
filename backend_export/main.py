from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime
import csv
import os
import io

app = FastAPI()

# Permitir CORS para o frontend acessar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # substitua pelo domínio real em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARQUIVO_CSV = "relatorio.csv"

# Modelo da transação
class Registro(BaseModel):
    nome: str
    valor: float

# Criação do CSV com cabeçalho, se ainda não existir
@app.on_event("startup")
def startup():
    if not os.path.exists(ARQUIVO_CSV):
        with open(ARQUIVO_CSV, mode="w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Nome", "Valor"])

# Rota para adicionar registros
@app.post("/adicionar")
def adicionar_registro(registro: Registro):
    with open(ARQUIVO_CSV, mode="a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([registro.nome, registro.valor])
    return {"msg": "Registro adicionado com sucesso"}

# Rota para gerar e baixar o relatório CSV com data e hora no nome
@app.get("/relatorio")
def baixar_relatorio():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    nome_arquivo = f"transacoes_{timestamp}.csv"

    buffer = io.StringIO()
    writer = csv.writer(buffer)

    # Lê conteúdo atual do CSV e grava no buffer
    with open(ARQUIVO_CSV, mode="r") as f:
        reader = csv.reader(f)
        for row in reader:
            writer.writerow(row)

    buffer.seek(0)

    headers = {
        "Content-Disposition": f'attachment; filename="{nome_arquivo}"'
    }

    return StreamingResponse(buffer, media_type="text/csv", headers=headers)
