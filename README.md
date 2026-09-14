# ひまわり予定表

**本番環境**: https://schedule-app.org

![カレンダー画面](docs/calendar.png)

## 主な機能

- 月間カレンダーで子どもの出席を管理（平日のみ表示）
- 出席ごとに 午前/午後・送り・迎えを設定
- 1日の上限人数（10人）をサーバー側で保証
- 子どもの追加・削除・色分け・契約日数の設定・ドラッグ&ドロップ並び替え
- 先月の予定を「第n◯曜日」で今月にコピー（祝日は自動でスキップ）
- 契約日数に対する利用状況の集計（残日数がマイナスなら赤字）
- 日本の祝日を外部APIから取得して表示
- Googleアカウント認証 + 管理者による利用承認

## 技術構成

| | |
|---|---|
| フロント | Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4 |
| 状態管理 | TanStack Query v5（サーバー状態） / Zustand（UI状態） |
| フォーム | React Hook Form + Zod |
| DB | MySQL 8.0 / Prisma 7（driver adapter 経由） |
| 認証 | Auth.js v5（Google OAuth・DBセッション） |
| CI/CD | GitHub Actions |
| テスト | Vitest |
| インフラ | Synology NAS (DS225) / Docker Compose / Cloudflare Tunnel |
| 旧インフラ | AWS EC2 (Ubuntu 24.04) / nginx / systemd / Let's Encrypt（2026-09 に移行） |

```mermaid
flowchart TB
    User["ブラウザ"]
    Google["Google OAuth"]
    Holidays["holidays-jp API<br/>（祝日）"]

    subgraph CF["Cloudflare"]
        Edge["DNS / TLS終端<br/>schedule-app.org"]
    end

    subgraph Home["自宅ネットワーク（開放ポート 0）"]
        subgraph NAS["Synology DS225 — Docker Compose"]
            Tunnel["cloudflared<br/>schedule-tunnel"]
            App["Next.js standalone<br/>schedule-app : 3000"]
            DB[("MySQL 8.0<br/>schedule-db : 3306")]
        end
    end

    User -->|HTTPS 443| Edge
    Tunnel -.->|アウトバウンド接続を確立| Edge
    Edge -->|確立済みの接続を逆流| Tunnel
    Tunnel -->|app:3000| App
    App -->|db:3306| DB
    User -->|ログイン| Google
    App -->|認可コード交換| Google
    App --> Holidays
```

## 構成の変遷

当初は AWS EC2 上に構築した（ EC2でのインフラ構築の学習のため ）

その後、月々のコスト削減のため、事務所の Synology NAS へ移行した。

移行にあたって 停電・回線障害で止まる可能性がある

<details>
<summary>旧構成（AWS EC2）</summary>

```mermaid
flowchart TB
    User["ブラウザ"]
    Google["Google OAuth"]
    Holidays["holidays-jp API<br/>（祝日）"]

    subgraph AWS["AWS ap-northeast-1"]
        subgraph SG["Security Group: 22（自宅IPのみ）/ 80 / 443"]
            subgraph EC2["EC2 t3.small — Ubuntu 24.04"]
                Nginx["nginx<br/>TLS終端 / Let's Encrypt"]
                App["Next.js<br/>systemd: schedule-app<br/>127.0.0.1:3000"]
                DB[("MySQL 8.0<br/>bind-address: 127.0.0.1")]
            end
        end
    end

    User -->|HTTPS 443| Nginx
    Nginx -->|proxy_pass| App
    App -->|localhost:3306| DB
    User -->|ログイン| Google
    App -->|認可コード交換| Google
    App --> Holidays
```
