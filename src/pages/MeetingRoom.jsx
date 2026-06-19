import { useParams,useNavigate } from "react-router-dom";
import { useEffect,useState} from "react";
import axios from "axios";
import { socket } from "../utils/socket";
import MeetingHeader from "../components/meetingRoom/MeetingHeader";
import ParticipantsCount from "../components/meetingRoom/ParticipantsCount";
import EmptyState from "../components/meetingRoom/EmptyState";
import ParticipantsGrid from "../components/meetingRoom/ParticipantsGrid";
import MeetingLobby from "../components/meetingRoom/MeetingLobby";
import useWebRTC from "../hooks/useWebRTC";



const MeetingRoom=()=>{

  const { meetingId }=useParams();
  const navigate=useNavigate();

  const [joined,setJoined]=useState(false);
  const [meeting,setMeeting]=useState(null);
  const [participants,setParticipants]=useState([]);
  const [loading,setLoading]=useState(false);
  const [errorMessage,setErrorMessage]=useState("");
  const [isHost,setIsHost]=useState(false);

  const { localVideoRef, isMicOn, isVideoOn, toggleMic, toggleVideo, stopLocalStream } = useWebRTC();
  
  
  const joinMeeting=async()=>{
    try{
      setLoading(true);
      setErrorMessage("");

      const response=await axios.post(
        `https://roomlybackend.onrender.com/api/v1/meetings/${meetingId}/join`,
        {},
        {
          withCredentials:true,
        }
      );

      const meetingData=response.data.meeting;
      const participant=response.data.participant;

      setMeeting(meetingData);

      setIsHost(
        meetingData.hostId?.toString()===
        participant._id?.toString()
      );

      if(!socket.connected){
        socket.connect();
      }

      socket.emit("joinMeeting",{
        meetingId,
        participant,
      });

      setJoined(true);

    }catch(err){

      setErrorMessage(
        err?.response?.data?.message ||
        "Failed to join meeting"
      );

    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    const handleParticipants=(users)=>{
      setParticipants(users);
    };
    const handleMeetingEnded=()=>{
      setParticipants([]);
      if(socket.connected){
        socket.disconnect();
      }
      navigate("/home/meetings",{replace:true,});
    };
  
    socket.on("participantsUpdated",handleParticipants);
    socket.on( "meetingEnded",handleMeetingEnded);

    return()=>{
      socket.off("participantsUpdated",handleParticipants);
      socket.off("meetingEnded",handleMeetingEnded);
      if(socket.connected){
        socket.disconnect();
      }
    };

  },[navigate]);

  const leaveMeeting=()=>{
    stopLocalStream();
    if(socket.connected){
      socket.disconnect();
    }

    navigate("/home/meetings");

  };

  
  const endMeeting=async()=>{

    try{

      await axios.patch(
        `https://roomlybackend.onrender.com/api/v1/meetings/${meetingId}/end`,
        {},
        {
          withCredentials:true,
        }
      );

      socket.emit(
        "endMeeting",
        {
          meetingId,
        }
      );

      if(socket.connected){
        socket.disconnect();
      }
      stopLocalStream();
      navigate(
        "/home/meetings",
        {
          replace:true,
        }
      );

    }catch(err){

      console.log(err);

    }

  };



  if(!joined){
    return(
      <MeetingLobby
        meetingId={meetingId}
        loading={loading}
        errorMessage={errorMessage}
        joinMeeting={joinMeeting}
        localVideoRef={localVideoRef}
        isMicOn={isMicOn}
        isVideoOn={isVideoOn}
        toggleMic={toggleMic}
        toggleVideo={toggleVideo}
      />
    );
  }

  return(
  <div className="min-h-screen bg-slate-950">
    <MeetingHeader
      meeting={meeting}
      isHost={isHost}
      endMeeting={endMeeting}
      leaveMeeting={leaveMeeting}
    />
    <div className="p-6">
      <ParticipantsCount count={participants.length}/>
      {participants.length===0?(
        <EmptyState/>
      ):(
        <ParticipantsGrid
          participants={participants}
          hostId={meeting?.hostId}
        />
      )}
    </div>
  </div>
);
};

export default MeetingRoom;

