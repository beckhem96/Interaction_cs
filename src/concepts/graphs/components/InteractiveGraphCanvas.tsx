import { useCallback, useEffect, useMemo, useState } from "react";
import type ELKType from "elkjs/lib/elk.bundled.js";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeChange,
  type NodeProps
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const NODE_WIDTH = 88;
const NODE_HEIGHT = 88;
type ElkInstance = InstanceType<typeof ELKType>;
let elkInstancePromise: Promise<ElkInstance> | undefined;

export type LearningGraphNode = {
  id: string;
  label: string;
  note?: string;
  className: string;
  ariaLabel: string;
  x: number;
  y: number;
};

export type LearningGraphEdge = {
  id: string;
  source: string;
  target: string;
  label?: string | number;
  labelClassName?: string;
  className: string;
  ariaLabel: string;
  directed?: boolean;
  color: string;
  labelBorderColor?: string;
  strokeWidth?: number;
  dashed?: boolean;
  animated?: boolean;
  curveOffset?: number;
};

type LearningNodeData = Record<string, unknown> & {
  label: string;
  note?: string;
  className: string;
  ariaLabel: string;
};

type LearningEdgeData = Record<string, unknown> & {
  ariaLabel: string;
  label?: string | number;
  labelClassName?: string;
  labelBorderColor?: string;
  color: string;
  strokeWidth: number;
  dashed: boolean;
  curveOffset: number;
  labelOffset: Point;
};

type LearningNode = Node<LearningNodeData, "learning">;
type LearningEdge = Edge<LearningEdgeData, "learning">;
type Point = { x: number; y: number };

type InteractiveGraphCanvasProps = {
  ariaLabel: string;
  className?: string;
  direction?: "RIGHT" | "DOWN";
  layoutAlgorithm?: "layered" | "stress" | "manual";
  nodes: LearningGraphNode[];
  edges: LearningGraphEdge[];
};

const nodeTypes = { learning: LearningNodeView };
const edgeTypes = { learning: LearningEdgeView };

export function InteractiveGraphCanvas(props: InteractiveGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <InteractiveGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

function InteractiveGraphCanvasInner({
  ariaLabel,
  className = "",
  direction = "RIGHT",
  layoutAlgorithm = "layered",
  nodes,
  edges
}: InteractiveGraphCanvasProps) {
  const topologyKey = useMemo(
    () =>
      [
        `${layoutAlgorithm}:${direction}`,
        nodes.map((node) => node.id).sort().join(","),
        edges
          .map((edge) => `${edge.id}:${edge.source}>${edge.target}`)
          .sort()
          .join(",")
      ].join("|"),
    [direction, edges, layoutAlgorithm, nodes]
  );
  const fallbackPositions = useMemo(() => getFallbackPositions(nodes), [nodes]);
  const [layoutState, setLayoutState] = useState<{
    key: string;
    positions: Record<string, Point>;
  }>(() => ({ key: topologyKey, positions: fallbackPositions }));
  const [draggedPositions, setDraggedPositions] = useState<Record<string, Point>>({});
  const { fitView } = useReactFlow();

  const positions =
    layoutState.key === topologyKey ? layoutState.positions : fallbackPositions;

  useEffect(() => {
    let cancelled = false;
    setDraggedPositions({});
    setLayoutState({ key: topologyKey, positions: fallbackPositions });

    if (layoutAlgorithm === "manual") {
      return () => {
        cancelled = true;
      };
    }

    void layoutLearningGraph(nodes, edges, direction, layoutAlgorithm).then((nextPositions) => {
      if (!cancelled) {
        setLayoutState({ key: topologyKey, positions: nextPositions });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [direction, layoutAlgorithm, topologyKey]);

  const flowNodes = useMemo<LearningNode[]>(
    () =>
      nodes.map((node) => ({
        id: node.id,
        type: "learning",
        position: draggedPositions[node.id] ?? positions[node.id] ?? { x: node.x, y: node.y },
        className: "flow-graph-node-shell",
        data: {
          label: node.label,
          note: node.note,
          className: node.className,
          ariaLabel: node.ariaLabel
        }
      })),
    [draggedPositions, nodes, positions]
  );

  const flowEdges = useMemo<LearningEdge[]>(() => {
    const pairOffsets = getParallelEdgeOffsets(edges);
    const currentPositions = Object.fromEntries(
      nodes.map((node) => [node.id, draggedPositions[node.id] ?? positions[node.id]])
    );
    const labelOffsets = getEdgeLabelOffsets(edges, currentPositions);

    return edges.map((edge) => {
      const sourcePosition = draggedPositions[edge.source] ?? positions[edge.source];
      const targetPosition = draggedPositions[edge.target] ?? positions[edge.target];
      const sourceSide = getConnectionSide(sourcePosition, targetPosition);
      const targetSide = getOppositeSide(sourceSide);

      return {
        id: edge.id,
        type: "learning",
        source: edge.source,
        target: edge.target,
        sourceHandle: `source-${sourceSide}`,
        targetHandle: `target-${targetSide}`,
        className: edge.className,
        animated: edge.animated,
        markerEnd: edge.directed
          ? {
              type: MarkerType.ArrowClosed,
              color: edge.color,
              width: 18,
              height: 18
            }
          : undefined,
        data: {
          ariaLabel: edge.ariaLabel,
          label: edge.label,
          labelClassName: edge.labelClassName,
          labelBorderColor: edge.labelBorderColor,
          color: edge.color,
          strokeWidth: edge.strokeWidth ?? 3,
          dashed: edge.dashed ?? false,
          curveOffset: edge.curveOffset ?? pairOffsets[edge.id] ?? 0,
          labelOffset: labelOffsets[edge.id] ?? { x: 0, y: 0 }
        }
      };
    });
  }, [draggedPositions, edges, nodes, positions]);

  const handleNodeChanges = useCallback((changes: NodeChange<LearningNode>[]) => {
    const positionChanges = changes.filter(
      (change): change is Extract<NodeChange<LearningNode>, { type: "position" }> =>
        change.type === "position" && change.position !== undefined
    );

    if (positionChanges.length === 0) {
      return;
    }

    setDraggedPositions((current) => {
      const next = { ...current };
      positionChanges.forEach((change) => {
        if (change.position) {
          next[change.id] = change.position;
        }
      });
      return next;
    });
  }, []);

  useEffect(() => {
    let fitFrame = 0;
    const positionFrame = window.requestAnimationFrame(() => {
      fitFrame = window.requestAnimationFrame(() => {
        void fitView({ padding: 0.18, duration: 260 });
      });
    });
    return () => {
      window.cancelAnimationFrame(positionFrame);
      window.cancelAnimationFrame(fitFrame);
    };
  }, [fitView, layoutState]);

  return (
    <div className="graph-visual-scroll flow-graph-scroll">
      <div
        aria-label={ariaLabel}
        className={`graph-visual flow-graph-canvas ${className}`.trim()}
        role="application"
      >
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={handleNodeChanges}
          nodesConnectable={false}
          minZoom={0.45}
          maxZoom={1.8}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#c9d4d8" gap={24} size={1} variant={BackgroundVariant.Dots} />
          <Controls position="bottom-right" showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}

function LearningNodeView({ data }: NodeProps<LearningNode>) {
  return (
    <div aria-label={data.ariaLabel} className={`${data.className} flow-graph-node`}>
      {([Position.Top, Position.Right, Position.Bottom, Position.Left] as const).map(
        (position) => {
          const side = position.toLowerCase();
          return (
            <span key={side}>
              <Handle id={`source-${side}`} type="source" position={position} />
              <Handle id={`target-${side}`} type="target" position={position} />
            </span>
          );
        }
      )}
      <svg aria-hidden="true" viewBox={`0 0 ${NODE_WIDTH} ${NODE_HEIGHT}`}>
        <circle cx="44" cy="34" r="25" />
        <text x="44" y="39">{data.label}</text>
        {data.note ? (
          <text className="graph-node-note" x="44" y="76">
            {data.note}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function LearningEdgeView({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data
}: EdgeProps<LearningEdge>) {
  const edgeData = data ?? {
    ariaLabel: "간선",
    color: "#7a8b93",
    strokeWidth: 3,
    dashed: false,
    curveOffset: 0,
    labelOffset: { x: 0, y: 0 }
  };
  const { path, labelX, labelY } = getLearningEdgePath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curveOffset: edgeData.curveOffset
  });

  return (
    <>
      <g aria-label={edgeData.ariaLabel} role="group">
        <BaseEdge
          id={id}
          markerEnd={markerEnd}
          path={path}
          style={{
            stroke: edgeData.color,
            strokeWidth: edgeData.strokeWidth,
            strokeDasharray: edgeData.dashed ? "7 5" : undefined
          }}
        />
      </g>
      {edgeData.label !== undefined ? (
        <EdgeLabelRenderer>
          <div
            className={`flow-graph-edge-label ${edgeData.labelClassName ?? ""}`.trim()}
            style={{
              borderColor: edgeData.labelBorderColor ?? edgeData.color,
              transform: `translate(-50%, -50%) translate(${labelX + edgeData.labelOffset.x}px, ${labelY + edgeData.labelOffset.y}px)`
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

export async function layoutLearningGraph(
  nodes: LearningGraphNode[],
  edges: LearningGraphEdge[],
  direction: "RIGHT" | "DOWN" = "RIGHT",
  algorithm: "layered" | "stress" = "layered"
): Promise<Record<string, Point>> {
  const elk = await getElk();
  const result = await elk.layout({
    id: "learning-graph",
    layoutOptions: {
      "elk.algorithm": algorithm,
      "elk.direction": direction,
      "elk.edgeRouting": "SPLINES",
      "elk.stress.desiredEdgeLength": "160",
      "elk.layered.spacing.nodeNodeBetweenLayers": "100",
      "elk.spacing.nodeNode": "76",
      "elk.spacing.edgeNode": "42",
      "elk.padding": "[top=32,left=32,bottom=32,right=32]"
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target]
    }))
  });

  const rawPositions = Object.fromEntries(
    (result.children ?? []).map((node) => [
      node.id,
      { x: node.x ?? 0, y: node.y ?? 0 }
    ])
  );
  return normalizeLayoutPositions(rawPositions);
}

function getElk(): Promise<ElkInstance> {
  elkInstancePromise ??= import("elkjs/lib/elk.bundled.js").then(
    ({ default: ELK }) => new ELK()
  );
  return elkInstancePromise;
}

function getFallbackPositions(nodes: LearningGraphNode[]): Record<string, Point> {
  return normalizeLayoutPositions(Object.fromEntries(
    nodes.map((node) => [
      node.id,
      { x: node.x - NODE_WIDTH / 2, y: node.y - NODE_HEIGHT / 2 }
    ])
  ));
}

function getParallelEdgeOffsets(edges: LearningGraphEdge[]): Record<string, number> {
  const groups = new Map<string, LearningGraphEdge[]>();

  edges.forEach((edge) => {
    const key = [edge.source, edge.target].sort().join("::");
    groups.set(key, [...(groups.get(key) ?? []), edge]);
  });

  const offsets: Record<string, number> = {};
  groups.forEach((group) => {
    if (group.length <= 1) {
      return;
    }

    group.forEach((edge, index) => {
      offsets[edge.id] = (index - (group.length - 1) / 2) * 54;
    });
  });
  return offsets;
}

function getEdgeLabelOffsets(
  edges: LearningGraphEdge[],
  positions: Record<string, Point | undefined>
): Record<string, Point> {
  const buckets = new Map<string, LearningGraphEdge[]>();

  edges.forEach((edge) => {
    if (edge.label === undefined) {
      return;
    }
    const source = positions[edge.source];
    const target = positions[edge.target];
    if (!source || !target) {
      return;
    }
    const midX = (source.x + target.x) / 2 + NODE_WIDTH / 2;
    const midY = (source.y + target.y) / 2 + NODE_HEIGHT / 2;
    const key = `${Math.round(midX / 72)}:${Math.round(midY / 54)}`;
    buckets.set(key, [...(buckets.get(key) ?? []), edge]);
  });

  const offsets: Record<string, Point> = {};
  buckets.forEach((bucket) => {
    const ordered = [...bucket].sort((left, right) => left.id.localeCompare(right.id));
    ordered.forEach((edge, index) => {
      if (ordered.length === 1) {
        offsets[edge.id] = { x: 0, y: 0 };
        return;
      }
      const columnCount = Math.min(ordered.length, 2);
      const column = index % columnCount;
      const row = Math.floor(index / columnCount);
      const rowCount = Math.ceil(ordered.length / columnCount);
      offsets[edge.id] = {
        x: (column - (columnCount - 1) / 2) * 34,
        y: (row - (rowCount - 1) / 2) * 28
      };
    });
  });
  return offsets;
}

function normalizeLayoutPositions(positions: Record<string, Point>): Record<string, Point> {
  const values = Object.values(positions);
  if (values.length === 0) {
    return positions;
  }

  const minX = Math.min(...values.map(({ x }) => x));
  const minY = Math.min(...values.map(({ y }) => y));
  const maxX = Math.max(...values.map(({ x }) => x));
  const maxY = Math.max(...values.map(({ y }) => y));
  const scale = Math.min(
    1,
    560 / Math.max(maxX - minX, 1),
    340 / Math.max(maxY - minY, 1)
  );
  const offsetX = 54 + (560 - (maxX - minX) * scale) / 2;
  const offsetY = 48 + (340 - (maxY - minY) * scale) / 2;

  return Object.fromEntries(
    Object.entries(positions).map(([id, position]) => [
      id,
      {
        x: offsetX + (position.x - minX) * scale,
        y: offsetY + (position.y - minY) * scale
      }
    ])
  );
}

function getConnectionSide(source?: Point, target?: Point): "top" | "right" | "bottom" | "left" {
  if (!source || !target) {
    return "right";
  }

  const dx = target.x - source.x;
  const dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }
  return dy >= 0 ? "bottom" : "top";
}

function getOppositeSide(side: "top" | "right" | "bottom" | "left") {
  return {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  }[side];
}

function getLearningEdgePath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  curveOffset
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  curveOffset: number;
}) {
  if (curveOffset === 0) {
    return {
      path: `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`,
      labelX: (sourceX + targetX) / 2,
      labelY: (sourceY + targetY) / 2
    };
  }

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const controlX = (sourceX + targetX) / 2 - (dy / length) * curveOffset;
  const controlY = (sourceY + targetY) / 2 + (dx / length) * curveOffset;
  const labelX = (sourceX + 2 * controlX + targetX) / 4;
  const labelY = (sourceY + 2 * controlY + targetY) / 4;

  return {
    path: `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`,
    labelX,
    labelY
  };
}
