{/*// import { useParams,useNavigate } from "react-router-dom";
// import { useEffect,useState } from "react";
// import axios from "axios";
// import { Video,PhoneOff,Users } from "lucide-react";
// import { socket } from "../utils/socket";

// const MeetingRoom=()=>{

//   const { meetingId }=useParams();
//   const navigate=useNavigate();

//   const [joined,setJoined]=useState(false);
//   const [meeting,setMeeting]=useState(null);
//   const [participants,setParticipants]=useState([]);
//   const [loading,setLoading]=useState(false);
//   const [errorMessage,setErrorMessage]=useState("");
//   const [isHost,setIsHost]=useState(false);

//   const joinMeeting=async()=>{
//     try{
//       setLoading(true);
//       setErrorMessage("");

//       const response=await axios.post(
//         `https://roomlybackend.onrender.com/api/v1/meetings/${meetingId}/join`,
//         {},
//         {
//           withCredentials:true,
//         }
//       );

//       const meetingData=response.data.meeting;
//       const participant=response.data.participant;

//       setMeeting(meetingData);

//       setIsHost(
//         meetingData.hostId?.toString()===
//         participant._id?.toString()
//       );

//       if(!socket.connected){
//         socket.connect();
//       }

//       socket.emit("joinMeeting",{
//         meetingId,
//         participant,
//       });

//       setJoined(true);

//     }catch(err){

//       setErrorMessage(
//         err?.response?.data?.message ||
//         "Failed to join meeting"
//       );

//     }finally{
//       setLoading(false);
//     }
//   };

//   useEffect(()=>{

//     const handleParticipants=(users)=>{
//       setParticipants(users);
//     };

//     const handleMeetingEnded=()=>{

//       setParticipants([]);

//       if(socket.connected){
//         socket.disconnect();
//       }

//       navigate(
//         "/home/meetings",
//         {
//           replace:true,
//         }
//       );

//     };

//     socket.on(
//       "participantsUpdated",
//       handleParticipants
//     );

//     socket.on(
//       "meetingEnded",
//       handleMeetingEnded
//     );

//     return()=>{

//       socket.off(
//         "participantsUpdated",
//         handleParticipants
//       );

//       socket.off(
//         "meetingEnded",
//         handleMeetingEnded
//       );

//       if(socket.connected){
//         socket.disconnect();
//       }

//     };

//   },[navigate]);

//   const leaveMeeting=()=>{

//     if(socket.connected){
//       socket.disconnect();
//     }

//     navigate("/home/meetings");

//   };

//   const endMeeting=async()=>{

//     try{

//       await axios.patch(
//         `https://roomlybackend.onrender.com/api/v1/meetings/${meetingId}/end`,
//         {},
//         {
//           withCredentials:true,
//         }
//       );

//       socket.emit(
//         "endMeeting",
//         {
//           meetingId,
//         }
//       );

//       if(socket.connected){
//         socket.disconnect();
//       }

//       navigate(
//         "/home/meetings",
//         {
//           replace:true,
//         }
//       );

//     }catch(err){

//       console.log(err);

//     }

//   };

//   if(!joined){
//     return(
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
//         <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">

//           <Video
//             size={56}
//             className="mx-auto text-cyan-500"
//           />

//           <h1 className="mt-6 text-center text-3xl font-bold text-white">
//             RoomLY Meeting
//           </h1>

//           <p className="mt-3 text-center text-slate-400">
//             Meeting ID
//           </p>

//           <div className="mt-3 rounded-xl bg-slate-800 p-4 text-center text-cyan-400 font-mono">
//             {meetingId}
//           </div>

//           {errorMessage && (
//             <p className="mt-4 text-center text-red-500">
//               {errorMessage}
//             </p>
//           )}

//           <button
//             onClick={joinMeeting}
//             disabled={loading}
//             className="mt-8 w-full rounded-xl bg-cyan-500 py-4 text-white font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-all"
//           >
//             {loading
//               ? "Joining..."
//               : "Join Meeting"}
//           </button>

//         </div>
//       </div>
//     );
//   }

//   return(
//     <div className="min-h-screen bg-slate-950">

//       <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

//         <div>
//           <h1 className="text-2xl font-bold text-white">
//             {meeting?.meetingName}
//           </h1>

//           <p className="text-slate-400">
//             {meeting?.meetingId}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">

//           {isHost && (
//             <button
//               onClick={endMeeting}
//               className="rounded-xl bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 transition-all"
//             >
//               End Meeting
//             </button>
//           )}

//           <button
//             onClick={leaveMeeting}
//             className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white font-medium hover:bg-red-600 transition-all"
//           >
//             <PhoneOff size={18}/>
//             Leave
//           </button>

//         </div>

//       </div>

//       <div className="p-6">

//         <div className="mb-6 flex items-center gap-2 text-white">
//           <Users size={20}/>
//           <span>
//             {participants.length}
//             {" "}
//             Participant
//             {participants.length!==1
//               ? "s"
//               : ""}
//           </span>
//         </div>

//         {participants.length===0 ? (

//           <div className="flex flex-col items-center justify-center py-20">

//             <Users
//               size={60}
//               className="text-slate-600"
//             />

//             <h2 className="mt-4 text-xl font-semibold text-white">
//               Waiting For Participants
//             </h2>

//             <p className="mt-2 text-slate-400">
//               Share your meeting link and invite others.
//             </p>

//           </div>

//         ) : (

//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

//             {participants.map((user)=>(

//               <div
//                 key={user._id}
//                 className="aspect-video rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative hover:border-cyan-500 transition-all"
//               >

//                 {meeting?.hostId?.toString()===
//                   user?._id?.toString() && (
//                   <div className="absolute top-3 right-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
//                     Host
//                   </div>
//                 )}

//                 <div className="h-20 w-20 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
//                   {user?.name?.charAt(0)?.toUpperCase()}
//                 </div>

//                 <h3 className="mt-4 text-lg font-semibold text-white">
//                   {user?.name}
//                 </h3>

//                 <p className="mt-1 px-3 text-center text-sm text-slate-400 break-all">
//                   {user?.email}
//                 </p>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </div>
//   );
// };

// export default MeetingRoom;*/}

import { useEffect,useRef,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Video,Mic,MicOff,VideoOff,PhoneOff } from "lucide-react";

const MeetingRoom=()=>{

  const { meetingId }=useParams();
  const navigate=useNavigate();

  const localVideoRef=useRef(null);
  const localStreamRef=useRef(null);

  const [cameraOn,setCameraOn]=useState(true);
  const [micOn,setMicOn]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{

    initializeMedia();

    return()=>{

      if(localStreamRef.current){

        localStreamRef.current
          .getTracks()
          .forEach(track=>track.stop());

      }

    };

  },[]);

  const initializeMedia=async()=>{

    try{

      const stream=
        await navigator.mediaDevices.getUserMedia({
          video:true,
          audio:true,
        });

      localStreamRef.current=stream;

      if(localVideoRef.current){
        localVideoRef.current.srcObject=stream;
      }

    }catch(err){

      console.log(err);

      setError(
        "Camera or microphone permission denied."
      );

    }

  };

  const toggleCamera=()=>{

    const videoTrack=
      localStreamRef.current
      ?.getVideoTracks()[0];

    if(!videoTrack) return;

    videoTrack.enabled=
      !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);

  };

  const toggleMic=()=>{

    const audioTrack=
      localStreamRef.current
      ?.getAudioTracks()[0];

    if(!audioTrack) return;

    audioTrack.enabled=
      !audioTrack.enabled;

    setMicOn(audioTrack.enabled);

  };

  const leaveMeeting=()=>{

    if(localStreamRef.current){

      localStreamRef.current
        .getTracks()
        .forEach(track=>track.stop());

    }

    navigate("/home/meetings");

  };

  return(
    <div className="h-screen bg-slate-950 flex flex-col">

      {/* Header */}

      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">

        <div>

          <h1 className="text-white text-xl font-semibold">
            RoomLY Meeting
          </h1>

          <p className="text-slate-400 text-sm">
            {meetingId}
          </p>

        </div>

      </div>

      {/* Video Area */}

      <div className="flex-1 flex items-center justify-center p-6">

        {error ? (

          <div className="text-center">

            <h2 className="text-red-500 text-xl font-semibold">
              {error}
            </h2>

          </div>

        ) : (

          <div
            className="
            w-full
            max-w-5xl
            aspect-video
            rounded-3xl
            overflow-hidden
            border
            border-slate-800
            bg-black
            "
          >

            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="
              h-full
              w-full
              object-cover
              "
            />

          </div>

        )}

      </div>

      {/* Controls */}

      <div
        className="
        h-24
        border-t
        border-slate-800
        flex
        items-center
        justify-center
        gap-4
        "
      >

        <button
          onClick={toggleMic}
          className="
          h-14
          w-14
          rounded-full
          bg-slate-800
          flex
          items-center
          justify-center
          text-white
          "
        >
          {micOn
            ? <Mic size={22}/>
            : <MicOff size={22}/>}
        </button>

        <button
          onClick={toggleCamera}
          className="
          h-14
          w-14
          rounded-full
          bg-slate-800
          flex
          items-center
          justify-center
          text-white
          "
        >
          {cameraOn
            ? <Video size={22}/>
            : <VideoOff size={22}/>}
        </button>

        <button
          onClick={leaveMeeting}
          className="
          h-14
          px-6
          rounded-full
          bg-red-600
          flex
          items-center
          justify-center
          gap-2
          text-white
          "
        >
          <PhoneOff size={20}/>
          Leave
        </button>

      </div>

    </div>
  );
};

export default MeetingRoom;