
import ParticipantCard from "./ParticipantCard";

const ParticipantsGrid=({participants,hostId,remoteStreams})=>(
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {participants.map(user=>(
      <ParticipantCard
        key={user._id}
        user={user}
        stream={remoteStreams?.[user.socketId]}
        isHost={hostId?.toString()===user?._id?.toString()}
      />
    ))}
  </div>
);

export default ParticipantsGrid;