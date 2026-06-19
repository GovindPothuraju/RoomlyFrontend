import { Users } from "lucide-react";

const ParticipantsCount=({count})=>{
  return(
    <div className="mb-6 flex items-center gap-2 text-white">
      <Users size={20}/>
      <span>{count} Participant{count!==1?"s":""}</span>
    </div>
  );
};

export default ParticipantsCount;