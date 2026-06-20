import {useEffect,useRef} from "react";

const ParticipantCard=({user,stream,isHost})=>{
  const videoRef=useRef(null);

  useEffect(()=>{
    if(!videoRef.current)return;
    if(stream){
      videoRef.current.srcObject=stream;
      videoRef.current.play().catch(()=>{});
    }else{
      // Clear srcObject when stream removed so no frozen frame
      videoRef.current.srcObject=null;
    }
  },[stream]);

  return(
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-900 border border-slate-800">
      {/*
        AUDIO FIX: video element is always in the DOM and never hidden.
        Hiding it with display:none or the "hidden" class pauses playback
        in some browsers, which silences audio too.
        Instead we use visibility+absolute positioning to show the avatar
        on top while keeping the video (and its audio track) playing.
      */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />
      {!stream&&(
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="h-24 w-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">{user?.name}</div>
      {isHost&&<div className="absolute top-3 right-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">Host</div>}
    </div>
  );
};

export default ParticipantCard;