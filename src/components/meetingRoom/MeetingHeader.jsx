import { PhoneOff } from "lucide-react";

const MeetingHeader=({meeting,isHost,endMeeting,leaveMeeting})=>{
  return(
    <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{meeting?.meetingName}</h1>
        <p className="text-slate-400">{meeting?.meetingId}</p>
      </div>
      <div className="flex items-center gap-3">
        {isHost&&(
          <button onClick={endMeeting} className="rounded-xl bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 transition-all">
            End Meeting
          </button>
        )}
        <button onClick={leaveMeeting} className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white font-medium hover:bg-red-600 transition-all">
          <PhoneOff size={18}/>
          Leave
        </button>
      </div>
    </div>
  );
};

export default MeetingHeader;