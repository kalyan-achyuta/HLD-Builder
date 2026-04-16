import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import type { Connection } from "reactflow";
import { useCallback, useState, useEffect } from "react";
import CustomNode from "./components/CustomNode";
import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
};

function App() {
  const [diagramName, setDiagramName] = useState("");
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "custom",
      position: { x: 200, y: 200 },
      data: {
        label: "service node",
        type: "service",
        endpoint: "",
        method: "GET",
        serviceName: "",
        dbName: "",
        collection: "",
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // ✅ SAFE FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/diagrams");
        const data = await res.json();

        setDiagrams(data);

        if (data.length > 0) {
          const latest = data[data.length - 1];
          setNodes(latest.nodes || []);
          setEdges(latest.edges || []);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    fetchData();
  }, []);

  // ✅ UNIQUE NODE ID FIX
  const addNode = (type: string) => {
    const newNode = {
      id: Date.now().toString(),
      type: "custom",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: `${type} node`,
        type: type,
        endpoint: "",
        method: "GET",
        serviceName: "",
        dbName: "",
        collection: "",
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      const sourceType = sourceNode?.data?.type;
      const targetType = targetNode?.data?.type;

      let label = "";
      let strokeColor = "#000";

      if (sourceType === "api" && targetType === "service") {
        label = prompt("Enter type: REST / GraphQL") || "REST";
      } else if (sourceType === "service" && targetType === "service") {
        label = "gRPC";
      } else if (sourceType === "service" && targetType === "database") {
        label = "Query";
      } else {
        alert("❌ Invalid connection!");
        return;
      }

      if (label === "REST") strokeColor = "#3b82f6";
      if (label === "GraphQL") strokeColor = "#ec4899";
      if (label === "gRPC") strokeColor = "#8b5cf6";
      if (label === "Query") strokeColor = "#6b7280";

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            label,
            style: { stroke: strokeColor, strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds,
        ),
      );
    },
    [nodes],
  );

  const handleLabelChange = (newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: { ...node.data, label: newLabel },
            }
          : node,
      ),
    );

    setSelectedNode((prev: any) => ({
      ...prev,
      data: { ...prev.data, label: newLabel },
    }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: { ...node.data, [field]: value },
            }
          : node,
      ),
    );

    setSelectedNode((prev: any) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  // ✅ API FIX ONLY
  const handleSave = async () => {
    try {
      const url = selectedId
        ? `http://localhost:5000/diagram/${selectedId}`
        : "http://localhost:5000/diagram";

      const method = selectedId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: diagramName,
          nodes,
          edges,
        }),
      });

      const data = await res.json();
      alert(data.message || "Saved");

      const refresh = await fetch("http://localhost:5000/diagrams");
      const updated = await refresh.json();
      setDiagrams(updated);
    } catch (err) {
      alert("Error ❌");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-56 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">HLD Builder</h2>

        <input
          className="w-full p-2 mb-2 rounded text-black"
          placeholder="Enter diagram name"
          value={diagramName}
          onChange={(e) => setDiagramName(e.target.value)}
        />

        <button
          className="block w-full mb-2 p-2 bg-blue-500 rounded"
          onClick={() => addNode("api")}
        >
          Add API
        </button>

        <button
          className="block w-full mb-2 p-2 bg-green-500 rounded"
          onClick={() => addNode("service")}
        >
          Add Service
        </button>

        <button
          className="block w-full p-2 bg-yellow-400 text-black rounded"
          onClick={() => addNode("database")}
        >
          Add DB
        </button>

        <button
          className="block w-full mt-4 p-2 bg-purple-500 rounded"
          onClick={handleSave}
        >
          Save Diagram
        </button>

        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2">My Diagrams</h3>

          {Array.isArray(diagrams) &&
            diagrams.map((d: any) => (
              <div
                key={d._id}
                className="p-2 mb-1 bg-gray-700 rounded flex justify-between items-center"
              >
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setNodes(d.nodes || []);
                    setEdges(d.edges || []);
                    setDiagramName(d.name || "");
                    setSelectedId(d._id);
                  }}
                >
                  {d.name}
                </span>

                <button
                  className="text-red-400 ml-2"
                  onClick={async () => {
                    await fetch(`http://localhost:5000/diagram/${d._id}`, {
                      method: "DELETE",
                    });

                    const res = await fetch("http://localhost:5000/diagrams");
                    const data = await res.json();
                    setDiagrams(data);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-100 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-72 bg-white border-l p-4">
          <h2 className="font-bold mb-4">Node Config</h2>

          <input
            className="border p-2 w-full rounded mb-2"
            value={selectedNode.data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />

          {selectedNode.data.type === "api" && (
            <>
              <input
                className="border p-2 w-full mt-2 rounded"
                placeholder="Endpoint (/users)"
                value={selectedNode.data.endpoint}
                onChange={(e) => handleFieldChange("endpoint", e.target.value)}
              />

              <select
                className="border p-2 w-full mt-2 rounded"
                value={selectedNode.data.method}
                onChange={(e) => handleFieldChange("method", e.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
              </select>
            </>
          )}

          {selectedNode.data.type === "service" && (
            <input
              className="border p-2 w-full mt-2 rounded"
              placeholder="Service Name"
              value={selectedNode.data.serviceName}
              onChange={(e) => handleFieldChange("serviceName", e.target.value)}
            />
          )}

          {selectedNode.data.type === "database" && (
            <>
              <input
                className="border p-2 w-full mt-2 rounded"
                placeholder="DB Name"
                value={selectedNode.data.dbName}
                onChange={(e) => handleFieldChange("dbName", e.target.value)}
              />

              <input
                className="border p-2 w-full mt-2 rounded"
                placeholder="Collection"
                value={selectedNode.data.collection}
                onChange={(e) =>
                  handleFieldChange("collection", e.target.value)
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
