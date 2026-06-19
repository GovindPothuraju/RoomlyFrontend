import { Users } from "lucide-react";

const EmptyState=()=>{
  return(
    <div className="flex flex-col items-center justify-center py-20">
      <Users size={60} className="text-slate-600"/>
      <h2 className="mt-4 text-xl font-semibold text-white">
        Waiting For Participants
      </h2>
      <p className="mt-2 text-slate-400">
        Share your meeting link and invite others.
      </p>
    </div>
  );
};

export default EmptyState;