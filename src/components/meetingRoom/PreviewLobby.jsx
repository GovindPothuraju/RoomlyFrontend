import { Mic,MicOff,Video,VideoOff } from "lucide-react";

const PreviewLobby=({localVideoRef,isMicOn,isVideoOn,toggleMic,toggleVideo})=>{
  return(
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover"/>
        {!isVideoOn&&(
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white text-xl font-semibold">
            Camera Off
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button onClick={toggleMic} className={`flex items-center gap-2 rounded-full px-5 py-3 text-white ${isMicOn?"bg-slate-700":"bg-red-600"}`}>
          {isMicOn?<Mic size={18}/>:<MicOff size={18}/>}
          {isMicOn?"Mic On":"Mic Off"}
        </button>
        <button onClick={toggleVideo} className={`flex items-center gap-2 rounded-full px-5 py-3 text-white ${isVideoOn?"bg-slate-700":"bg-red-600"}`}>
          {isVideoOn?<Video size={18}/>:<VideoOff size={18}/>}
          {isVideoOn?"Camera On":"Camera Off"}
        </button>
      </div>
    </div>
  );
};

export { PreviewLobby };
