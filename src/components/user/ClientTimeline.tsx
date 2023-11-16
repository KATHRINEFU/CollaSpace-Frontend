import { Timeline } from "antd";
import { clientStatusByDepartment } from "../../utils/constants";
import { SmileTwoTone } from "@ant-design/icons";

interface ClientTimelineProps {
  currentDepartmentId: number;
  currentStatus: string;
}

const ClientTimeline: React.FC<ClientTimelineProps> = ({
  currentDepartmentId,
  currentStatus,
}) => {
  const timelineData = clientStatusByDepartment.map((item, index) => {
    let color = "green";

    if (index === currentDepartmentId - 1) {
      color = "blue";
    } else if (index > currentDepartmentId - 1) {
      color = "gray";
    }

    const isCurrentDepartment = index === currentDepartmentId - 1;

    return {
      color: color,
      children: [
        <p
          className={isCurrentDepartment ? "text-2xs font-bold" : "text-sm"}
        >{`${item.department}`}</p>,
        ...item.processes.map((process, index) => (
          <div className="flex gap-3">
            <p
              className={isCurrentDepartment ? "text-2xs" : "text-xs"}
              key={index}
            >
              {process}
            </p>
            {process.toLowerCase() === currentStatus.toLowerCase() ? (
              <SmileTwoTone />
            ) : (
              ""
            )}
          </div>
        )),
      ],
    };
  });

  return <Timeline items={timelineData} />;
};

export default ClientTimeline;
