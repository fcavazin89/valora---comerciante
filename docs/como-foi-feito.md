# Documentação Técnica - Terminal do Comerciante

## Visão Geral

Aplicação Next.js para comerciantes credenciados processarem vouchers sociais NFT via QR Code, com conexão à blockchain Ethereum Sepolia através de smart contract.

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Next.js)              │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ Login Screen │  │ Generate Charge  │  │  History  │ │
│  │  (CNPJ+Senha) │  │   (QR Code)      │  │(Transações)│ │
│  └──────┬───────┘  └────────┬─────────┘  └─────┬─────┘ │
│         │                   │                   │        │
│         └───────────────────┼───────────────────┘        │
│                             │                           │
│                    ┌────────▼────────┐                  │
│                    │  API Routes     │                  │
│                    │  (Next.js)      │                  │
│                    └────────┬────────┘                  │
└─────────────────────────────┼───────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  lib/blockchain.ts │
                    │     (viem)         │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Ethereum Sepolia │
                    │  Smart Contract    │
                    └────────────────────┘
```

## Tecnologias Utilizadas

- **Next.js 16** (App Router) - framework React com suporte a API Routes
- **viem** - biblioteca moderna para interação com blockchain (substitui ethers.js)
- **TypeScript** - tipagem estática
- **Tailwind CSS** - estilização
- **shadcn/ui** - componentes de interface

## Estrutura de Arquivos

```
├── app/
│   ├── api/
│   │   ├── charges/
│   │   │   ├── create/route.ts        # POST: criar cobrança
│   │   │   ├── approve/route.ts       # POST: aprovar pagamento
│   │   │   ├── cancel/route.ts        # POST: cancelar cobrança
│   │   │   └── [chargeId]/
│   │   │       └── status/route.ts    # GET: verificar status
│   │   └── transactions/route.ts      # GET: listar transações
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── merchant/
│       ├── merchant-terminal.tsx      # Componente principal
│       ├── generate-charge-screen.tsx  # Tela de cobrança (atualizada)
│       ├── login-screen.tsx           # Tela de login
│       ├── scan-button.tsx            # Botão de gerar QR Code
│       ├── daily-summary-card.tsx     # Resumo diário
│       ├── recent-sales-list.tsx      # Vendas recentes
│       ├── sales-history-screen.tsx   # Histórico de vendas
│       └── merchant-header.tsx        # Cabeçalho
├── lib/
│   └── blockchain.ts                  # Conexão com smart contract
├── docs/
│   └── como-foi-feito.md              # Este documento
└── .env.local                         # Configurações da blockchain
```

## API Routes

### POST /api/charges/create

Cria uma cobrança na blockchain.

**Request:**
```json
{
  "chargeId": "chg_abc123",
  "merchantAddress": "0x...",
  "amount": 45.50
}
```

**Response:**
```json
{
  "success": true,
  "chargeId": "chg_abc123",
  "transactionHash": "0x...",
  "blockNumber": "12345678",
  "explorerUrl": "https://sepolia.etherscan.io/tx/0x..."
}
```

### GET /api/charges/[chargeId]/status

Verifica o status de uma cobrança.

**Response:**
```json
{
  "chargeId": "chg_abc123",
  "merchant": "0x...",
  "beneficiary": "0x...",
  "amount": 45.50,
  "currency": "BRL",
  "status": "pending" | "approved" | "cancelled" | "expired",
  "createdAt": "2026-06-06T10:30:00.000Z"
}
```

### POST /api/charges/approve

Aprova um pagamento (chamado pelo app do beneficiário ao escanear o QR Code).

**Request:**
```json
{
  "chargeId": "chg_abc123",
  "beneficiaryAddress": "0x..."
}
```

### POST /api/charges/cancel

Cancela uma cobrança pendente.

### GET /api/transactions?merchantAddress=0x...

Retorna o histórico de transações do comerciante filtrando eventos `ChargeApproved` do contrato.

## Fluxo de Cobrança

1. Comerciante faz login com CNPJ e senha
2. Informa o valor da compra e clica em "Gerar QR Code"
3. A API `/api/charges/create` é chamada, registrando a cobrança on-chain
4. Um QR Code é exibido contendo:
   - `type`: "VOUCHER_CHARGE"
   - `chargeId`: identificador único
   - `merchantName`: nome do comerciante
   - `amount`: valor da cobrança
   - `apiUrl`: URL para aprovação
5. O frontend faz polling a cada 3s em `/api/charges/[id]/status`
6. O beneficiário escaneia o QR Code com o app de vouchers
7. O app do beneficiário chama `POST /api/charges/approve` com o `chargeId` e o endereço do beneficiário
8. A transação é registrada na blockchain
9. O frontend detecta o status `approved` e exibe a confirmação

## Configuração do Smart Contract

O arquivo `lib/blockchain.ts` contém uma ABI genérica. Quando você tiver a ABI real do seu contrato, substitua o array `VOUCHER_ABI`.

```typescript
export const VOUCHER_ABI = [...] as const // Substitua pela ABI real
```

### Funções esperadas no contrato:

| Função | Descrição |
|--------|-----------|
| `createCharge(bytes32 chargeId, address merchant, uint256 amount, string currency)` | Cria cobrança |
| `approveCharge(bytes32 chargeId, address beneficiary)` | Aprova pagamento |
| `getCharge(bytes32 chargeId)` | Consulta dados da cobrança |
| `cancelCharge(bytes32 chargeId)` | Cancela cobrança |

### Eventos esperados:

| Evento | Descrição |
|--------|-----------|
| `ChargeCreated(bytes32 chargeId, address merchant, uint256 amount, string currency)` | Cobrança criada |
| `ChargeApproved(bytes32 chargeId, address merchant, address beneficiary, uint256 amount)` | Pagamento aprovado |

## Variáveis de Ambiente (.env.local)

```env
# Provider RPC da Sepolia (Infura, Alchemy, etc.)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID

# Endereço do smart contract implantado
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Chave privada da wallet do comerciante (apenas server-side)
PRIVATE_KEY=0x...

# URL do explorador de blocos
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.etherscan.io
```

## Instalação e Uso

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
# Edite o arquivo .env.local com suas credenciais

# Rodar em desenvolvimento
pnpm dev

# Build de produção
pnpm build
pnpm start
```

## Observações

- As transações na blockchain Sepolia levam alguns segundos para serem confirmadas
- O contrato precisa estar implantado na Sepolia antes do uso
- A chave privada no `.env.local` nunca deve ser exposta no frontend
- O polling de status pode ser substituído por WebSockets ou eventos em tempo real
