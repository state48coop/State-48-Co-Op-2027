export default function DashboardPage() {
  return <div className="mx-auto max-w-6xl px-5 py-12"><p className="eyebrow">Admin Dashboard</p><h1 className="display mt-4">Control the<br /><span className="text-ember">whole shop.</span></h1><div className="mt-10 grid gap-4 md:grid-cols-3">{[["0", "Published products"], ["0", "Gallery projects"], ["0", "Open project intakes"]].map(([value, label]) => <div className="panel p-6" key={label}><p className="text-4xl font-black">{value}</p><p className="mt-5 text-xs font-bold uppercase tracking-widest text-black/60">{label}</p></div>)}</div></div>;
}
