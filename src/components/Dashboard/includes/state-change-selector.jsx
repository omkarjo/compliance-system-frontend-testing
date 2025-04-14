import { useUpdateTaskState } from "@/actions/task/updateTaskState";
import BadgeStatusSelector from "@/components/includes/badge-select";
import BadgeStatusTask from "@/components/includes/badge-status";
import { usePermissionTaskChange } from "@/utils/havePermission";

const StateChangeSelector = ({ data = {} }) => {
  const updateTaskState = useUpdateTaskState();

  const havePermission = usePermissionTaskChange();

  if (!havePermission(data))
    return <BadgeStatusTask text={data?.state} type={data?.state} />;

  return (
    <div className="w-42">
      <BadgeStatusSelector
        defaultStatus={data.state}
        onChange={(state) => {
          updateTaskState.mutate({
            taskId: data.compliance_task_id,
            state: state,
          });
        }}
      />
    </div>
  );
};

export default StateChangeSelector;
