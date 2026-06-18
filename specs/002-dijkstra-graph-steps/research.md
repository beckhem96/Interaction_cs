# Research: Dijkstra Graph Step Workbench

## Decision: 기존 graph domain 안에 다익스트라 slice를 추가한다

**Rationale**: 프로젝트에는 이미 `src/concepts/graphs` 아래에 그래프 구조와 BFS/DFS 탐색이 분리되어 있다. 다익스트라는 같은 graph algorithm domain이므로 기존 타입, SVG 스타일, route 패턴, code tab 패턴을 확장하는 편이 scope를 작게 유지한다.

**Alternatives considered**:

- 별도 `src/concepts/shortest-path` domain: 새 domain을 만들 만큼 범위가 크지 않고 Home/route 구조가 중복된다.
- `search` domain에 추가: 다익스트라는 graph weighted shortest path가 핵심이므로 graph domain이 더 적합하다.

## Decision: 수동 deterministic trace generator를 사용한다

**Rationale**: 학습 목표는 실제 라이브러리 실행보다 각 상태 전이를 설명하는 것이다. 고정 예제와 순수 함수 trace는 거리 표, edge inspection, relaxation, no-update, tie-break, code highlight를 테스트하기 쉽다.

**Alternatives considered**:

- 외부 priority queue/graph library: 작은 curated graph에는 과하고 학습용 step metadata를 직접 만들기 어렵다.
- React component 안에서 step 계산: constitution의 domain separation 원칙을 위반한다.

## Decision: 무방향 예제와 방향 예제를 모두 제공한다

**Rationale**: 사용자가 clarification에서 두 예제를 모두 선택했다. 무방향 예제는 초심자가 거리 갱신을 이해하기 좋고, 방향 예제는 간선 방향이 reachable/path 결과에 영향을 주는 점을 보여준다.

**Alternatives considered**:

- 무방향만 제공: 방향성 학습 가치가 빠진다.
- 방향만 제공: 첫 학습 흐름이 불필요하게 복잡해진다.

## Decision: 같은 임시 거리 후보는 노드 라벨 알파벳순으로 선택한다

**Rationale**: tie-break를 명시하면 trace 순서와 테스트 기대값이 항상 같다. 노드 라벨 기준은 화면 설명도 단순하다.

**Alternatives considered**:

- frontier 진입 순서: 구현 세부 순서에 의존해 설명이 복잡해질 수 있다.
- tie가 없는 예제만 설계: edge case 요구사항을 검증하지 못한다.

## Decision: SVG 시각화를 유지한다

**Rationale**: 노드 5-7개 규모의 정적 curated graph는 SVG로 충분하다. SVG는 노드/간선 aria label, weight label, class 기반 상태 표시, 테스트 selector가 쉽다.

**Alternatives considered**:

- Canvas: 현재 규모에서는 접근성/테스트 비용이 더 크다.
- WebGL/Three.js: 2D 알고리즘 학습 slice에는 과하다.

## Decision: 5개 언어 코드 탭과 per-language line mapping을 제공한다

**Rationale**: 프로젝트 규칙과 clarification에서 C, C++, Java, Python, JavaScript 탭이 확정되었다. 기존 sorting/graph traversal 코드 패널 패턴을 재사용하면 highlight mapping을 trace step에 안정적으로 연결할 수 있다.

**Alternatives considered**:

- 의사코드만 제공: 프로젝트 규칙과 사용자 clarification에 맞지 않는다.
- 한 언어만 제공: 언어 탭 요구사항을 충족하지 못한다.

## Decision: 최종 단계에서 도착 노드 selector로 path display를 갱신한다

**Rationale**: 알고리즘 trace는 한 번 완료된 결과로 유지하고, learner-selected destination에 따라 predecessor chain을 읽어 path summary만 갱신하면 학습자의 탐색 경험과 테스트 안정성을 모두 만족한다.

**Alternatives considered**:

- 예제마다 고정 도착 노드만 표시: clarification 결과와 맞지 않는다.
- 모든 path를 항상 펼쳐 표시: 작은 화면에서 정보 밀도가 과해지고 핵심 경로 읽기가 흐려진다.

## Decision: 테스트는 trace correctness를 중심으로 둔다

**Rationale**: 다익스트라의 correctness는 최단 거리, predecessor, settled order, no-update, unreachable, tie-break에서 결정된다. UI 테스트는 control/render sync와 label presence에 집중한다.

**Alternatives considered**:

- 시각 snapshot 위주 테스트: 스타일 변화에 취약하고 알고리즘 correctness를 직접 보장하지 못한다.
