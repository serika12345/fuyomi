# fuyomi

音部記号を選び、五線譜に表示された音を鍵盤から当てる譜読み練習用の
単一ページアプリケーションです。

## 機能

- ト音記号、ヘ音記号、アルト記号から練習対象を選択
- 五線内と上下1本の加線にある自然音を出題
- 音部記号ごとの2オクターブ鍵盤で回答
- 回答後に正誤、正解鍵、正解数、回答数を表示
- 13音を無作為に一巡し、直前と同じ音を避けて継続
- 終了時に正答率を表示し、同じ記号で再開または記号を再選択

## 構成

- `src/domain`: 音高、音域、音名変換、出題順
- `src/application`: 練習状態と状態遷移
- `src/infrastructure`: VexFlowによるSVG譜面描画
- `src/presentation`: React画面、Radix Themes、CSS Modules
- `e2e`: Playwrightによる利用者操作とブラウザ検査

状態はブラウザのメモリだけに保持します。ページを再読み込みすると練習状態は
初期化されます。

## 開発環境

Nix flakesを有効にして、開発シェルへ入ります。

```sh
nix develop
pnpm install --frozen-lockfile
pnpm dev
```

direnvを利用する場合は、リポジトリで `direnv allow` を実行します。

## 検査と構築

```sh
nix develop -c zsh -lc 'pnpm verify'
nix develop -c zsh -lc 'pnpm e2e:install'
nix develop -c zsh -lc 'pnpm test:e2e'
nix develop -c zsh -lc 'pnpm build'
```

製品ファイルは `dist` に生成されます。Viteの基準パスは相対指定のため、任意の
静的配信先の下に配置できます。

## 出題域

| 音部記号   | 出題域 | 鍵盤   |
| ---------- | ------ | ------ |
| ト音記号   | C4〜A5 | C4〜C6 |
| ヘ音記号   | E2〜C4 | C2〜C4 |
| アルト記号 | D3〜B4 | C3〜C5 |

C4を中央のドとする国際式オクターブ番号を使用します。音名は
`ド4 (C4)` のように固定ドと国際式音名を併記します。

## 保守

- 音域や音部記号の設定は `src/domain/music/pitch.ts` に集約しています。
- 出題順の規則は `src/domain/quiz/questionDeck.ts` に集約しています。
- 新しい外部入力や保存機能を追加する場合は、境界でzodによる実行時検証を追加します。
- UIの装飾は `docs/static-css-architecture.md` に従い、機能固有の規則をCSS Modulesへ置きます。
