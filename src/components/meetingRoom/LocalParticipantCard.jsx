import {useEffect,useRef} from "react";
import {Mic,MicOff,Video,VideoOff} from "lucide-react";

const LocalParticipantCard=({stream,user,isMicOn,isVideoOn,toggleMic,toggleVideo})=>{
  const videoRef=useRef(null);

  useEffect(()=>{
    if(!videoRef.current)return;
    if(stream){
      videoRef.current.srcObject=stream;
      videoRef.current.play().catch(()=>{});
    }
  },[stream]);

  // When video is turned off, clear srcObject so the frozen frame disappears
  useEffect(()=>{
    if(!videoRef.current)return;
    if(!isVideoOn){
      videoRef.current.srcObject=null;
    }else if(stream){
      videoRef.current.srcObject=stream;
      videoRef.current.play().catch(()=>{});
    }
  },[isVideoOn]);

  return(
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-900 border border-cyan-500">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`h-full w-full object-cover ${isVideoOn&&stream?"block":"hidden"}`}
      />
      {(!isVideoOn||!stream)&&(
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase()||"Y"}
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <button onClick={toggleMic} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white">
          {isMicOn?<Mic size={18}/>:<MicOff size={18}/>}
        </button>
        <button onClick={toggleVideo} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white">
          {isVideoOn?<Video size={18}/>:<VideoOff size={18}/>}
        </button>
      </div>
      <div className="absolute bottom-4 right-4 rounded-xl bg-black/60 px-3 py-1 text-sm text-white">You</div>
    </div>
  );
};

export default LocalParticipantCard;