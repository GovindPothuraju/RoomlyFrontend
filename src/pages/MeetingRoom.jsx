import { useParams,useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import { Video,PhoneOff,Users } from "lucide-react";
import { socket } from "../utils/socket";

const MeetingRoom=()=>{

  const { meetingId }=useParams();
  const navigate=useNavigate();

  const [joined,setJoined]=useState(false);
  const [meeting,setMeeting]=useState(null);
  const [participants,setParticipants]=useState([]);
  const [loading,setLoading]=useState(false);
  const [errorMessage,setErrorMessage]=useState("");

  const joinMeeting=async()=>{
    try{
      setLoading(true);
      setErrorMessage("");

      const response=await axios.post(
        `https://roomlybackend.onrender.com/api/v1/meetings/${meetingId}/join`,
        {},
        { withCredentials:true }
      );

      const meetingData=response.data.meeting;
      const participant=response.data.participant;

      setMeeting(meetingData);

      if(!socket.connected){
        socket.connect();
      }

      socket.emit("joinMeeting",{ meetingId,participant });

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

    socket.on("participantsUpdated",handleParticipants);

    return()=>{
      socket.off("participantsUpdated",handleParticipants);
    };

  },[]);

  const leaveMeeting=async()=>{
    try{

      await axios.patch(
        `https://roomlybackend.onrender.com/api/v1/meetings/${meetingId}/end`,
        {},
        {
          withCredentials:true,
        }
      );

    }catch(err){
      console.log(err);
    }finally{
      socket.disconnect();
      navigate("/home/meetings");
    }
  };

  if(!joined){
    return(
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
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

          {errorMessage && (
            <p className="mt-4 text-center text-red-500 font-medium">
              {errorMessage}
            </p>
          )}

          <button
            onClick={joinMeeting}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-cyan-500 py-4 text-white font-semibold hover:bg-cyan-600 disabled:opacity-50 transition-all"
          >
            {loading ? "Joining..." : "Join Meeting"}
          </button>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {meeting?.meetingName}
          </h1>

          <p className="text-slate-400">
            {meeting?.meetingId}
          </p>
        </div>

        <button
          onClick={leaveMeeting}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white font-medium hover:bg-red-600"
        >
          <PhoneOff size={18}/>
          Leave
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6 flex items-center gap-2 text-white">
          <Users size={20}/>
          <span>{participants.length} Participants</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {participants.map((user)=>(
            <div
              key={user._id}
              className="aspect-video rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center hover:border-cyan-500 transition-all"
            >
              <div className="h-20 w-20 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                {user.name}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {user.email}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;