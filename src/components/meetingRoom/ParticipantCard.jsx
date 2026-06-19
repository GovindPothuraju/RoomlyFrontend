const ParticipantCard=({user,isHost})=>{
  return(
    <div className="aspect-video rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative hover:border-cyan-500 transition-all">
      {isHost&&(
        <div className="absolute top-3 right-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
          Host
        </div>
      )}
      <div className="h-20 w-20 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
        {user?.name?.charAt(0)?.toUpperCase()}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">
        {user?.name}
      </h3>
      <p className="mt-1 px-3 text-center text-sm text-slate-400 break-all">
        {user?.email}
      </p>
    </div>
  );
};

export default ParticipantCard;