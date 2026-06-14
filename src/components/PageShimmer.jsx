const PageShimmer = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-pulse">

      <div className="h-16 rounded-xl bg-slate-200 mb-6" />

      <div className="grid grid-cols-4 gap-6">

        <div className="col-span-1">
          <div className="h-[600px] rounded-xl bg-slate-200" />
        </div>

        <div className="col-span-3 space-y-4">
          <div className="h-12 rounded-xl bg-slate-200" />
          <div className="h-48 rounded-xl bg-slate-200" />
          <div className="h-48 rounded-xl bg-slate-200" />
        </div>

      </div>
    </div>
  );
};

export default PageShimmer;