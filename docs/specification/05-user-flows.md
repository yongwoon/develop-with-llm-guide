# 05. User Flows

## UF-1. skill 이름으로 찾기

1. Owner 가 어느 페이지에서든 ⌘K 를 누르거나 header 검색을 누른다.
2. skill 이름 일부를 입력한다 (예: "handle-pr").
3. 결과 첫 화면(상위 3개)에 해당 skill page 가 나온다.
4. Owner 가 결과를 선택하면 skill page 로 이동한다. SkillCard 에서 사용 가능 도구와 산출물을 확인한다.
5. 기본 호출 tab 에서 현재 쓰는 도구를 고르고 copy 버튼으로 명령을 복사한다.

**예외 경로**

- 결과가 없으면 "결과 없음" 안내가 나오고, Owner 는 상황어로 다시 검색한다.
- 한국어 입력 조합 중에 Enter 를 누르면 조합이 끝난 뒤에 검색해야 한다. 조합 중인 문자가 버려지면 안 된다 (R-SEARCH).

## UF-2. 상황에서 출발해 찾기

1. Owner 가 홈에서 상황별 흐름 목록을 본다.
2. "PR review 대응과 merge"를 선택한다 (1 클릭).
3. 표제란에서 단계 수와 산출물을 확인하고, 연결선 흐름으로 순서를 파악한다.
4. 필요한 단계의 skill 이름을 선택하면 그 skill page 의 option 표(`#options`)로 바로 이동한다 (2 클릭). 사용 case 는 같은 페이지 위쪽에서 확인한다.

**예외 경로**: 현재 도구에서 쓸 수 없는 skill 이 흐름에 있으면, 그 단계의 도구 표시와 대체 안내를 따른다.

## UF-3. 작업 중 명령 복사

1. Owner 가 터미널 옆에 사이트를 dark theme 로 띄워 둔다.
2. 흐름 페이지의 실행 예시에서 tab 을 Codex 로 바꾼다. 이후 모든 페이지가 Codex tab 으로 열린다.
3. copy 버튼을 누르면 표시된 호출 명령이 그대로 복사된다 (`$ywc-…` 포함). code block 에는 프롬프트 기호(›)를 넣지 않으므로 복사 결과에도 없다.

## UF-3b. Skill 색인에서 option 참조

1. Owner 가 sidebar 의 Skill reference 첫 항목인 Skill 색인을 연다.
2. 이름순 목록에서 분류, 사용 가능 도구, 한 줄 용도를 훑어본다.
3. skill 이름을 누르면 해당 skill page 의 option 표로 바로 이동한다 (1 클릭).
4. option 표에서 형식, 기본값, 언제 쓰나, 도구별 지원 여부를 확인한다.

## UF-4. develop-with-llm 변경을 사이트에 반영 (유지보수)

1. develop-with-llm 에서 skill 이 추가·삭제·변경된다.
2. Owner 가 guide 저장소에서 최신성 점검을 실행한다. 차이 보고서에는 다음이 나온다.
   - 추가·삭제된 skill
   - 도구별 사용 가능 여부 변화
   - option 의 추가·삭제와 option 별 지원 도구 변화
   - userInvoked 변화
   - agent 의 추가·삭제와 도구별 존재 변화
   - `sourceVersion` 이 현재 VERSION 과 다른 page (stale)
   - 위임 문구 후보가 있는 option (참고 경고)
3. 영향받는 skill page 의 options 와 사용 case, 그리고 관련 흐름 페이지를 Owner 가 직접 고쳐 쓴다. 고쳐 쓰는 방식은 사실 메모 → 본문 순서를 따른다 (03-data 작성 규칙). Skill 색인은 자동으로 갱신된다.
4. 고친 페이지의 `verifiedAt` 과 `sourceVersion` 을 갱신한다.
5. feature branch 에서 build 와 공개 가드를 통과시킨 뒤 main 에 병합한다 → UF-5.

## UF-5. 배포

1. main 에 push(병합)되면 GitHub Actions 가 시작된다.
2. build step 다음의 별도 step 에서 공개 가드를 실행한다. 민감 단어 secret 은 이 step 에만 전달된다.
3. 둘 다 통과하면 배포 artifact 가 만들어지고 GitHub Pages 에 배포한다.
4. 가드가 실패하면 artifact 가 없으므로 배포되지 않는다. Actions log 에는 발견된 file 경로와 규칙 번호만 나오고, 일치한 문자열은 나오지 않는다 (R-GUARD). 사이트는 직전 배포 상태로 유지된다. Owner 는 GitHub 기본 알림(email)으로 실패를 안다.

**예외 경로**: 잘못된 내용이 이미 배포되었으면 해당 commit 을 revert 하는 commit 을 main 에 push 해 되돌린다 (R-DEPLOY).
