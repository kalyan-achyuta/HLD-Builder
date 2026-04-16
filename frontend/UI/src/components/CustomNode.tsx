import { Handle, Position } from "reactflow";

const CustomNode = ({ data }: any) => {
  const getBgColor = () => {
    if (data.type === "api") return "bg-blue-500";
    if (data.type === "service") return "bg-green-500";
    if (data.type === "database") return "bg-yellow-400 text-black";
    return "bg-gray-200 text-black";
  };

  return (
    <div
      className={`relative px-4 py-2 rounded-lg shadow-md border min-w-[120px] text-center ${getBgColor()} text-white`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-black"
      />

      <div className="font-semibold">{data.label}</div>
      <div className="text-xs opacity-80 capitalize">{data.type}</div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-black"
      />
    </div>
  );
};

export default CustomNode;
