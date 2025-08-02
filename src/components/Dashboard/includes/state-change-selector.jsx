import BadgeStatusSelector from "@/components/includes/badge-select";
import BadgeStatusTask from "@/components/includes/badge-status";
import { useUpdateTaskState } from "@/react-query/mutations/task/updateTaskState";
import useCheckRoles from "@/utils/check-roles";
import { usePermissionTaskChange } from "@/utils/havePermission";

const STATUS_OPTIONS_ADMIN = [
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Review Required", value: "Review Required" },
];

const STATUS_OPTIONS_USER = [{ label: "Completed", value: "Completed" }];

const StateChangeSelector = ({ data = {}, options = null, disabledPropagation = true }) => {
  const updateTaskState = useUpdateTaskState();

  const havePermission = usePermissionTaskChange();
  const havePermissionAdmin = useCheckRoles([
    "Fund Manager",
    "Compliance Officer",
  ]);

  if (!havePermission(data))
    return <BadgeStatusTask text={data?.state} type={data?.state} />;

  return (
    <div className="w-42 relative">
      <BadgeStatusSelector
        defaultStatus={data.state}
        disabledPropagation={disabledPropagation}
        options={
          options
            ? options
            : havePermissionAdmin
              ? STATUS_OPTIONS_ADMIN
              : STATUS_OPTIONS_USER
        }
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
