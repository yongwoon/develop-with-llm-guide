# 공개 가드 도구 비교 (2026-10-28)

`yk-000001-030-infra-public-guard` 착수 전에, 공개 가드(spec R-GUARD)를 기존 도구로 대체할 수 있는지 확인했다.

## 요구 사항 (R-GUARD 요약)

- `dist/` 텍스트 file 과 원본 tree 를 검사하고, 규칙별로 대상 경로가 다르다 (email 형식은 HTML 만, `docs/` 는 일반 패턴 제외).
- 민감 단어는 저장소에 두지 않는다. CI 는 secret, 로컬은 추적 제외 file 에서 읽는다. NFC 정규화, 대소문자 무시, 고정 문자열 비교.
- CI 에서 secret 부재·빈 값·0단어면 실패 (fail-closed). 로컬은 경고 후 계속.
- 실패 시 file 경로와 규칙 번호만 출력하고, 일치한 문자열은 출력하지 않는다.

## 비교

| 항목 | gitleaks | secretlint | 자체 script (Node 표준 library) |
|---|---|---|---|
| 배포 형태 | Go binary (Homebrew, Docker, release binary). npm 없음 | npm package | 저장소 내 script, 의존성 없음 |
| 디렉터리 검사 | `gitleaks dir` 로 가능 | glob 으로 가능 | 직접 구현 |
| 사용자 정의 규칙 | TOML 의 regex, keywords, path. 규칙별·전역 allowlist | `@secretlint/secretlint-rule-pattern` (13.1.0). 설정 방법은 README 에 없어 미확인 | 직접 정의 |
| 일치 문자열 숨김 | `--redact` (기본 100%) | 기본으로 mask | 출력 형식을 직접 정함 |
| 민감 단어 주입 | secret 으로 설정 file 을 실행 시 생성하는 wrapper 필요 | 같음 | secret 또는 local file 을 직접 읽음 |
| fail-closed, NFC 정규화 | wrapper 에서 구현 필요 | wrapper 에서 구현 필요 | 직접 구현 |
| 유지 상태 | README 에 "feature complete, 보안 patch 만" 명시 | 활동 중 | 해당 없음 |
| 추가 비용 | CI·로컬 binary 설치 | npm 의존성 1~2개 | 약 100줄과 test |

## 결론

자체 script 를 유지한다.

- 두 도구 모두 민감 단어 주입, fail-closed, NFC 정규화를 위해 wrapper 가 필요하다. wrapper 를 쓰면 남는 이점은 정규식 실행과 출력 mask 뿐이다.
- gitleaks 는 유지 축소 상태이고 npm 생태계 밖의 binary 를 CI 와 로컬 양쪽에 설치해야 한다.
- secretlint 는 pattern rule 의 설정 방식을 문서로 확인하지 못했다.
- 이번 검사는 고정 문자열과 단순 정규식 몇 개라서 도구가 주는 탐지 엔진의 이점이 작다.
- 재검토 조건: API key 류의 범용 secret 탐지가 필요해지면 gitleaks 또는 secretlint 를 추가 단계로 도입한다.

## 함께 확인한 사항

- `starlight-links-validator` 0.27.0 의 peerDependencies 는 `astro >=7.2.10`, `@astrojs/starlight >=0.42.0` 이다. 이 project 의 Astro 7.4.2, Starlight 0.42.7 과 호환된다 (npm registry, 2026-10-28 조회).

## 출처

- gitleaks README: https://github.com/gitleaks/gitleaks (2026-10-28 조회)
- secretlint README: https://github.com/secretlint/secretlint (2026-10-28 조회)
- npm registry: `starlight-links-validator`, `@secretlint/secretlint-rule-pattern`, `@astrojs/starlight` (2026-10-28 조회)
