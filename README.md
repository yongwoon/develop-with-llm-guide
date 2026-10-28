# ywc skills

`develop-with-llm` 의 ywc skill 과 agent 사용법을 정리한 한국어 guidebook 사이트입니다.

**사이트: https://yongwoon.github.io/develop-with-llm-guide/**

## 담은 내용

- **상황별 흐름 16개**: 새 project 시작, 작은 변경, PR 리뷰 대응처럼 상황에서 출발해 어떤 skill 을 어떤 순서로 쓰는지 보여 줍니다.
- **Skill reference 63개**: skill 마다 언제 쓰는지, 호출 예시, Claude Code 와 Codex 의 option 표를 둡니다. Skill 색인에서 이름과 분류로 찾을 수 있습니다.
- **Agents**: skill 이 일을 맡기는 agent 의 도구별 구성과, 어떤 skill 이 어떤 agent 를 쓰는지 정리합니다.
- **시작하기**: 설치 방법과 두 도구의 차이를 설명합니다.
- **사용 안내**: 자주 쓰는 명령, 헷갈리기 쉬운 skill 비교, 말로 부르기, 공통 option, 설정, 산출물 지도, 문제 해결, 이 사이트를 만든 실제 case 를 다룹니다.

사이트 안 검색(Pagefind)으로 skill 이름이나 한국어 키워드로 찾을 수 있습니다.

## 개발

Node 22 (`.nvmrc`) 와 pnpm (`package.json` 의 `packageManager`) 을 씁니다.

```bash
pnpm install
pnpm run dev        # 개발 server
pnpm run build      # dist/ 로 정적 build
pnpm run preview    # build 결과 확인 (검색은 build 후에만 동작)
```

| 명령 | 하는 일 |
|---|---|
| `pnpm run guard` | 공개하면 안 되는 내용(로컬 경로, email 등)이 build 결과에 없는지 검사합니다. 배포 workflow 에서도 실행합니다 |
| `pnpm run fresh-check` | skill·option·agent 표기가 원본과 일치하는지 확인합니다. 원본 저장소가 옆 directory 에 있어야 하므로 로컬 전용입니다 |
| `pnpm run subset-font` | 사이트에서 쓰는 글자만 담은 Pretendard subset (글꼴 이름 DWLG Sans) 을 다시 만듭니다. `pnpm run build` 뒤에 실행하고 다시 build 합니다 |

## 배포

`main` 에 push 하면 GitHub Actions 가 build 와 guard 를 거쳐 GitHub Pages 에 배포합니다. guard 가 실패하면 배포하지 않고 이전 배포가 유지됩니다.

## 문서

- `AGENTS.md`: 이 저장소에서 작업할 때의 규칙 (공개 저장소 content 규칙 포함)
- `docs/mission.md`: 목적, 성공 기준, 하지 않는 것
- `docs/specification/`: 사양
- `docs/tech-stack.md`: directory 구조와 기술 선택
- `docs/design/design-system.md`: 디자인 기준
- `docs/measurements/`: 첫 공개 측정 기록

## License

글꼴은 `public/fonts/` 아래 각 directory 의 `LICENSE.txt` (SIL Open Font License 1.1) 를 따릅니다.
