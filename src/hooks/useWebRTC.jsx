import { useEffect,useRef,useState } from "react";

const useWebRTC=()=>{

  const localVideoRef=useRef(null);

  const [localStream,setLocalStream]=useState(null);
  const [isMicOn,setIsMicOn]=useState(true);
  const [isVideoOn,setIsVideoOn]=useState(true);

  const peerConnectionRef = useRef(null);

  const startLocalStream=async()=>{

    try{

      const stream=await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
      });

      setLocalStream(stream);

    }catch(error){

      console.error("MEDIA ERROR:",error);

    }

  };

  const stopLocalStream=()=>{

    if(!localStream)return;

    localStream.getTracks().forEach(track=>{
      track.stop();
    });
    setLocalStream(null);
  };

  const toggleMic = async () => {
    if (!localStream) return;
    if (isMicOn) {
      // Turn mic OFF
      localStream.getAudioTracks().forEach(track => {
        track.stop();
      });
      setIsMicOn(false);
    } else {
      // Turn mic ON
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const newAudioTrack = audioStream.getAudioTracks()[0];
      const updatedStream = new MediaStream();
      // Keep existing video track
      localStream.getVideoTracks().forEach(track => {
        updatedStream.addTrack(track);
      });
      updatedStream.addTrack(newAudioTrack);
      setLocalStream(updatedStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = updatedStream;
      }
      setIsMicOn(true);
    }
  };

  const toggleVideo = async () => {
    if (!localStream) return;
    if (isVideoOn) {
      // Turn camera OFF
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
      }
      setIsVideoOn(false);
    } else {
      // Turn camera ON again
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      const newVideoTrack = newStream.getVideoTracks()[0];

      // Keep existing audio track
      const audioTrack = localStream.getAudioTracks()[0];
      const updatedStream = new MediaStream();
      if (audioTrack) {
        updatedStream.addTrack(audioTrack);
      }
      updatedStream.addTrack(newVideoTrack);
      setLocalStream(updatedStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = updatedStream;
      }
      setIsVideoOn(true);
    }
  };

  //2  creating peer
  const createPeerConnection=()=>{

    const pc=new RTCPeerConnection({
      iceServers:[
        {
          urls:"stun:stun.l.google.com:19302"
        }
      ]
    });

    pc.onconnectionstatechange=()=>{
      console.log(
        "CONNECTION STATE:",
        pc.connectionState
      );
    };

    pc.oniceconnectionstatechange=()=>{
      console.log(
        "ICE CONNECTION STATE:",
        pc.iceConnectionState
      );
    };

    pc.onicegatheringstatechange=()=>{
      console.log(
        "ICE GATHERING STATE:",
        pc.iceGatheringState
      );
    };

    pc.onsignalingstatechange=()=>{
      console.log(
        "SIGNALING STATE:",
        pc.signalingState
      );
    };

    peerConnectionRef.current=pc;

    console.log("PEER CREATED");
    console.log(pc);

    return pc;
  };

  // 3 .add tracks to pc
  const addLocalTracks=()=>{
    const pc=peerConnectionRef.current;
    if(!pc||!localStream)return;

    const sendersByKind = new Map(
      pc.getSenders().map((s) => [s.track?.kind, s])
    );

    localStream.getTracks().forEach(track => {
      // Prevent: "A sender already exists for the track"
      if (sendersByKind.has(track.kind)) return;
      pc.addTrack(track, localStream);
      console.log("TRACK ADDED:", track.kind);
    });

    console.log("SENDERS:", pc.getSenders());
    console.log("SENDER COUNT:", pc.getSenders().length);
  };

  useEffect(() => {
    // 1. start local stream
    startLocalStream();
    // 2. create peer connection
    createPeerConnection();
    return () => {
      stopLocalStream();
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

// for audio tracks
  useEffect(()=>{
    if(localStream&&peerConnectionRef.current){
      addLocalTracks();
    }
  },[localStream]);

  return{
    localVideoRef,
    localStream,
    isMicOn,
    isVideoOn,
    toggleMic,
    toggleVideo,
    stopLocalStream
  };

};

export default useWebRTC;