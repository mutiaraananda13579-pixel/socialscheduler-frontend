export default function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>

    </div>
  );
}