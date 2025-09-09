export default function EntitiesFund({ data, openView = () => {} }) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-lg font-semibold">Entities in Fund</h2>
      <EntitiesSection openView={openView} fundId={data?.fund_id} />
    </div>
  );
}
