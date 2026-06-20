import {useEffect,useRef,useState} from "react";

const useWebRTC=({socket})=>{
  const localVideoRef=useRef(null);
  const peerConnectionsRef=useRef({});
  const localStreamRef=useRef(null);
  const iceCandidateQueuesRef=useRef({});
  const pendingPeersRef=useRef([]);
  const [localStream,setLocalStream]=useState(null);
  const [remoteStreams,setRemoteStreams]=useState({});
  const [isMicOn,setIsMicOn]=useState(true);
  const [isVideoOn,setIsVideoOn]=useState(true);

  /* ── local media ── */
  const startLocalStream=async()=>{
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      window.localStream=stream;
      localStreamRef.current=stream;
      setLocalStream(stream);
      if(localVideoRef.current)localVideoRef.current.srcObject=stream;
      return stream;
    }catch(err){console.error("MEDIA ERROR:",err);return null;}
  };

  const stopLocalStream=()=>{
    try{window.localStream?.getTracks().forEach(t=>t.stop());}catch(e){}
    localStreamRef.current=null;
    window.localStream=null;
    setLocalStream(null);
  };

  const toggleMic=()=>{
    const stream=localStreamRef.current;
    if(!stream)return;
    stream.getAudioTracks().forEach(t=>{t.enabled=!t.enabled;});
    setIsMicOn(prev=>!prev);
  };

  const toggleVideo=()=>{
    const stream=localStreamRef.current;
    if(!stream)return;
    const videoTrack=stream.getVideoTracks()[0];
    if(!videoTrack)return;
    if(videoTrack.readyState==="live"){
      videoTrack.stop();
      setIsVideoOn(false);
    }else{
      navigator.mediaDevices.getUserMedia({video:true}).then(newStream=>{
        const newTrack=newStream.getVideoTracks()[0];
        stream.removeTrack(videoTrack);
        stream.addTrack(newTrack);
        Object.values(peerConnectionsRef.current).forEach(pc=>{
          const sender=pc.getSenders().find(s=>s.track?.kind==="video");
          if(sender)sender.replaceTrack(newTrack);
        });
        if(localVideoRef.current)localVideoRef.current.srcObject=stream;
        setIsVideoOn(true);
      }).catch(err=>console.error("CAM RE-ACQUIRE ERROR:",err));
    }
  };

  /* ── peer connection ── */
  const createPeerConnection=(targetSocketId)=>{
    if(peerConnectionsRef.current[targetSocketId])return peerConnectionsRef.current[targetSocketId];

    const pc=new RTCPeerConnection({
      iceServers:[
        {urls:"stun:stun.l.google.com:19302"},
        {urls:"stun:stun1.l.google.com:19302"},
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelay",
          credential: "openrelay"
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelay",
          credential: "openrelay"
        },
        {
          urls: "turn:openrelay.metered.ca:443?transport=tcp",
          username: "openrelay",
          credential: "openrelay"
        }
      ]
    });
    

    // receive remote tracks — mirrors reference's onaddstream pattern
    pc.ontrack=(event)=>{
      const stream=event.streams[0];
      if(!stream)return;
      setRemoteStreams(prev=>{
        // don't re-set if stream object is identical (avoids re-render flicker)
        if(prev[targetSocketId]?.id===stream.id)return prev;
        return {...prev,[targetSocketId]:stream};
      });
    };

    pc.onicecandidate=(event)=>{
      if(!event.candidate)return;
      socket.emit("iceCandidate",{candidate:event.candidate,targetSocketId});
    };

    peerConnectionsRef.current[targetSocketId]=pc;
    return pc;
  };

  const addLocalTracks=(pc)=>{
    const stream=localStreamRef.current||window.localStream;
    if(!stream)return;
    stream.getTracks().forEach(track=>{
      const alreadyAdded=pc.getSenders().some(s=>s.track===track);
      if(!alreadyAdded)pc.addTrack(track,stream);
    });
  };

  /* ── ICE queue: same pattern as reference's addIceCandidate guard ── */
  const drainIceCandidates=async(socketId)=>{
    const pc=peerConnectionsRef.current[socketId];
    const queue=iceCandidateQueuesRef.current[socketId]||[];
    if(!pc||!queue.length)return;
    iceCandidateQueuesRef.current[socketId]=[];
    for(const candidate of queue){
      try{await pc.addIceCandidate(new RTCIceCandidate(candidate));}
      catch(err){console.error("ICE drain error:",err);}
    }
  };

  /* ── signaling ── */
  const createOffer=async(targetSocketId)=>{
    const pc=createPeerConnection(targetSocketId);
    if(pc.signalingState!=="stable")return;
    addLocalTracks(pc);
    try{
      const offer=await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer",{offer:pc.localDescription,targetSocketId,senderSocketId:socket.id});
    }catch(err){console.error("createOffer error:",err);}
  };

  const handleOffer=async({offer,senderSocketId})=>{
    const pc=createPeerConnection(senderSocketId);
    if(pc.signalingState!=="stable")return;
    addLocalTracks(pc);
    try{
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      await drainIceCandidates(senderSocketId);
      const answer=await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer",{answer:pc.localDescription,targetSocketId:senderSocketId});
    }catch(err){console.error("handleOffer error:",err);}
  };

  const handleAnswer=async({answer,senderSocketId})=>{
    const pc=peerConnectionsRef.current[senderSocketId];
    if(!pc||pc.signalingState==="stable")return;
    try{
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      await drainIceCandidates(senderSocketId);
    }catch(err){console.error("handleAnswer error:",err);}
  };

  const handleIceCandidate=({candidate,senderSocketId})=>{
    const pc=peerConnectionsRef.current[senderSocketId];
    if(!pc||!pc.remoteDescription){
      if(!iceCandidateQueuesRef.current[senderSocketId])iceCandidateQueuesRef.current[senderSocketId]=[];
      iceCandidateQueuesRef.current[senderSocketId].push(candidate);
      return;
    }
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(err=>console.error("ICE error:",err));
  };

  /* ── lifecycle ── */
  useEffect(()=>{
    startLocalStream();
    return()=>stopLocalStream();
  },[]);

  useEffect(()=>{
    if(localVideoRef.current&&localStream)localVideoRef.current.srcObject=localStream;
  },[localStream]);

  // drain pending peers the moment the local stream is ready
  useEffect(()=>{
    if(!localStream||!pendingPeersRef.current.length)return;
    const pending=[...pendingPeersRef.current];
    pendingPeersRef.current=[];
    pending.forEach(socketId=>createOffer(socketId));
  },[localStream]);

  useEffect(()=>{
    if(!socket)return;

    const onExistingParticipants=(users)=>{
      users.forEach(user=>{
        if(user.socketId===socket.id)return;
        if(!localStreamRef.current){
          pendingPeersRef.current.push(user.socketId);
        }else{
          createOffer(user.socketId);
        }
      });
    };

    const onUserJoined=(user)=>{
      if(user.socketId===socket.id)return;
      // new user joined — they will send us an offer; we don't initiate here
      // (the new user gets existingParticipants and sends offers to everyone)
    };

    const onUserLeft=({socketId})=>{
      try{peerConnectionsRef.current[socketId]?.close();}catch(e){}
      delete peerConnectionsRef.current[socketId];
      delete iceCandidateQueuesRef.current[socketId];
      pendingPeersRef.current=pendingPeersRef.current.filter(id=>id!==socketId);
      setRemoteStreams(prev=>{const u={...prev};delete u[socketId];return u;});
    };

    socket.on("existingParticipants",onExistingParticipants);
    socket.on("userJoined",onUserJoined);
    socket.on("userLeft",onUserLeft);
    socket.on("offer",handleOffer);
    socket.on("answer",handleAnswer);
    socket.on("iceCandidate",handleIceCandidate);

    return()=>{
      socket.off("existingParticipants",onExistingParticipants);
      socket.off("userJoined",onUserJoined);
      socket.off("userLeft",onUserLeft);
      socket.off("offer",handleOffer);
      socket.off("answer",handleAnswer);
      socket.off("iceCandidate",handleIceCandidate);
    };
  },[socket]);

  useEffect(()=>{
    return()=>{
      Object.values(peerConnectionsRef.current).forEach(pc=>{try{pc.close();}catch(e){}});
      peerConnectionsRef.current={};
    };
  },[]);

  return{localVideoRef,localStream,remoteStreams,isMicOn,isVideoOn,toggleMic,toggleVideo,stopLocalStream};
};

export default useWebRTC;