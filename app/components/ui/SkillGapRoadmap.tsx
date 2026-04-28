interface Resource {
  topic: string;
  type: "Course" | "Practice" | "Project" | "Book" | "Documentation";
  platform: string;
  priority: "High" | "Medium" | "Low";
}

interface Phase {
  phase: number;
  title: string;
  duration: string;
  goals: string[];
  resources: Resource[];
}

export interface SkillGapRoadmapData {
  has_gap: boolean;
  gap_level: string;
  estimated_time_to_ready: string;
  phases: Phase[];
}

interface Props {
  data: SkillGapRoadmapData;
}


export default function SkillGapRoadmap({ data }: Props) {
//   const { estimated_time_to_ready, gap_level, phases } = data;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "Course":
        return "bg-blue-100 text-blue-600";
      case "Practice":
        return "bg-indigo-100 text-indigo-600";
      case "Project":
        return "bg-green-100 text-green-600";
      case "Book":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase">
          Skill Gap Roadmap
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          data ·  Gap
        </p>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {data.phases.map((phase, index) => (
          <div key={index} className="flex gap-4">
            {/* Number Circle */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                {phase.phase}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {phase.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">{phase.duration}</p>

              {/* Goals */}
              <ul className="text-sm text-gray-600 mb-3 space-y-1">
                {phase.goals.slice(0, 2).map((goal, i) => (
                  <li key={i}>• {goal}</li>
                ))}
              </ul>

              {/* Resources */}
              <div className="space-y-2">
                {phase.resources.map((res, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    {/* Type Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(
                        res.type,
                      )}`}
                    >
                      {res.type}
                    </span>

                    {/* Topic */}
                    <span className="text-sm text-gray-700">
                      {res.topic} — {res.platform}
                    </span>

                    {/* Priority */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityStyle(
                        res.priority,
                      )}`}
                    >
                      {res.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
