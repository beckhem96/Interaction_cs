# Quickstart: SQL/DATABASE Workbench Enhancement

## 1. 설치 확인

```bash
npm install
```

## 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 database page로 이동한다.

## 3. 수동 확인 시나리오

1. 데이터베이스 화면이 검정 화면처럼 보이지 않고, 주요 panel/table/control text가 읽기 쉬운지 확인한다.
2. selector에서 다음 8개 예시가 모두 보이는지 확인한다.
   - SUB QUERY
   - JOIN
   - GROUP BY
   - HAVING
   - UNION
   - UNION ALL
   - ORDER/LIMIT
   - WINDOW RANK
3. 각 예시에서 Next를 눌러 active SQL line, phase badge, input table highlight, output table, 현재 설명이 함께 바뀌는지 확인한다.
4. 예시를 전환하면 첫 step으로 초기화되는지 확인한다.
5. `UNION`과 `UNION ALL`의 duplicate 처리 차이가 보이는지 확인한다.
6. `WINDOW RANK`에서 동점 row와 rank gap이 보이는지 확인한다.
7. mobile viewport에서도 text overlap 없이 query/table/control을 사용할 수 있는지 확인한다.

## 4. 자동화 테스트

```bash
npm run test
```

중점 확인:

- database trace generator tests
- DatabasePage render/control tests
- query line/table state synchronization
- `UNION ALL` duplicate retained behavior
- `WINDOW RANK` tie and rank gap behavior

## 5. 빌드 검증

```bash
npm run build
```

## 6. 완료 기준

- 기존 6개 예시가 계속 동작한다.
- 신규 `UNION ALL`, `WINDOW RANK` 예시가 완전 인터랙티브다.
- 일반 텍스트와 table cell text가 WCAG AA 대비 기대치를 만족한다.
- 색상만으로 상태를 설명하지 않고 row/cell state와 한국어 설명이 함께 제공된다.
- `npm run test`와 `npm run build`가 통과한다.
