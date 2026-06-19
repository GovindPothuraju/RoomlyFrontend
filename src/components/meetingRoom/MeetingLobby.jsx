import { Video } from "lucide-react";
import { PreviewLobby } from "./PreviewLobby";

const MeetingLobby=({
  meetingId,
  loading,
  errorMessage,
  joinMeeting,
  localVideoRef,
  isMicOn,
  isVideoOn,
  toggleMic,
  toggleVideo
})=>{
  return(
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2">
        <PreviewLobby
          localVideoRef={localVideoRef}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          toggleMic={toggleMic}
          toggleVideo={toggleVideo}
        />
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl flex flex-col justify-center">
          <Video size={56} className="mx-auto text-cyan-500"/>
          <h1 className="mt-6 text-center text-3xl font-bold text-white">
            RoomLY Meeting
          </h1>
          <p className="mt-3 text-center text-slate-400">
            Meeting ID
          </p>
          <div className="mt-3 rounded-xl bg-slate-800 p-4 text-center text-cyan-400 font-mono">
            {meetingId}
          </div>
          {errorMessage&&(
            <p className="mt-4 text-center text-red-500">
              {errorMessage}
            </p>
          )}
          <button
            onClick={joinMeeting}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-cyan-500 py-4 text-white font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-all"
          >
            {loading?"Joining...":"Join Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingLobby;