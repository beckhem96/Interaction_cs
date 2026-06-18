# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  For CS Visual Lab, each story should be one teachable concept slice such as a
  single algorithm operation, SQL operation, protocol step, or OS mechanism.
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe the learner journey in plain language]

**Why this priority**: [Explain the learning value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently through trace output and UI controls]

**Acceptance Scenarios**:

1. **Given** [initial concept state], **When** [learner action], **Then** [expected visual state and explanation]
2. **Given** [initial concept state], **When** [step/play/reset action], **Then** [expected trace position and highlighted code/query/phase]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this learner journey in plain language]

**Why this priority**: [Explain the learning value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this learner journey in plain language]

**Why this priority**: [Explain the learning value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens at the smallest and largest meaningful input size?
- What happens when no visual state changes during a step?
- How does the workbench keep the explanation, visual state, and code/query highlight synchronized?
- For automatic or semi-automatic mode, what happens at the first, last, paused, and reset states?
- For SQL/network/OS lessons, how are logical teaching steps distinguished from real engine/runtime behavior?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate an ordered trace for the target concept before UI rendering depends on it.
- **FR-002**: Each trace step MUST include learner-facing Korean explanation text and meaningful state/highlight data.
- **FR-003**: Users MUST be able to step forward, step backward, reset, and inspect the current step.
- **FR-004**: System SHOULD support automatic play or semi-automatic guided progression when it improves the lesson.
- **FR-005**: System MUST keep visualization, explanation, and code/query/protocol/OS phase highlight synchronized.
- **FR-006**: Algorithm and data-structure code lessons MUST include C, C++, Java, Python, and JavaScript examples when code is presented.
- **FR-007**: SQL lessons MUST show the active query and relevant table changes in one workbench.
- **FR-008**: New external dependencies or non-default technologies MUST be justified by learning value, correctness, performance, or maintainability.

*Example of marking unclear requirements:*

- **FR-009**: System MUST visualize [NEEDS CLARIFICATION: exact operation or input set not specified]

### Key Entities *(include if feature involves data)*

- **Trace Step**: One teachable state transition with title, explanation, state, highlights, and optional code/query/phase line.
- **Concept State**: Domain-specific data rendered by the workbench for the current step.
- **Code or Query Example**: Learner-facing source/query text with highlight mappings for trace steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can complete the primary concept flow using only visible workbench controls.
- **SC-002**: Every tested trace step has deterministic state and highlight output.
- **SC-003**: The selected code/query/protocol/OS phase highlight changes correctly when the step changes.
- **SC-004**: The feature passes build and relevant tests without expanding into unrelated concept domains.

## Assumptions

- The UI copy is Korean-first unless preserving an established English technical term is clearer.
- A single feature targets one concept domain unless the specification explicitly covers shared infrastructure.
- Manual trace behavior is the baseline; real execution engines are optional enhancements after the learning flow is validated.
- SVG is the default visualization technology unless the plan justifies another renderer.
