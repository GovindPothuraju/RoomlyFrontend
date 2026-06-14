import { useState } from "react";
import axios from "axios";
import {Video,Users,Copy,Check,} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Meetings = () => {
  const [meetingName, setMeetingName] =useState("");
  const [meetingId, setMeetingId] =useState("");
  const [meetingLink, setMeetingLink] =useState("");
  const [joinMeetingId, setJoinMeetingId] =useState("");
  const [copied, setCopied] =useState(false);
  const [loading, setLoading] =useState(false);
  const navigate =useNavigate();

  const createMeeting = async () => {
    try {
      setLoading(true);
      const response =await axios.post("https://roomlybackend.onrender.com/api/v1/meetings",
          {
            meetingName,
          },
          {
            withCredentials: true,
          }
        );

      const generatedMeetingId =
        response.data.data.meetingId;

      setMeetingId(generatedMeetingId);

      const link =
        `${window.location.origin}/meetings/${generatedMeetingId}`;

      setMeetingLink(link);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(
        meetingLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };


  const joinMeeting = () => {
    const value = joinMeetingId.trim();

    if (!value) return;

    let id = value;

    try {
      if (value.startsWith("http")) {
        id = new URL(value).pathname.split("/").pop();
      }
    } catch (err) {
      console.error(err);
      return;
    }

    navigate(`/meetings/${id}`);
  };

  return (
    <div className="pt-20 lg:pt-8 px-4 lg:px-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Meetings
        </h1>

        <p className="mt-2 text-slate-500">
          Create a new meeting or join an
          existing one.
        </p>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        {/* Create Meeting */}
        <div
          className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          p-6
        "
        >
          <div className="flex items-center gap-3">
            <Video
              className="text-cyan-500"
              size={24}
            />

            <h2 className="text-xl font-semibold">
              Create Meeting
            </h2>
          </div>

          <div className="mt-6">
            <label className="text-sm text-slate-500">
              Meeting Name
            </label>

            <input
              type="text"
              value={meetingName}
              onChange={(e) =>
                setMeetingName(
                  e.target.value
                )
              }
              placeholder="Sprint Planning"
              className="
              mt-2
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              outline-none
              focus:border-cyan-500
              focus:ring-4
              focus:ring-cyan-100
            "
            />
          </div>

          <button
            onClick={createMeeting}
            disabled={
              !meetingName.trim() || loading
            }
            className="
            mt-6
            w-full
            rounded-xl
            bg-cyan-500
            py-3
            text-white
            font-medium

            hover:bg-cyan-600

            disabled:opacity-50
            disabled:cursor-not-allowed

            transition-all
          "
          >
            {loading
              ? "Creating..."
              : "Create Meeting"}
          </button>

          {meetingLink && (
            <div
              className="
              mt-6
              rounded-2xl
              border
              border-cyan-200
              bg-cyan-50
              p-4
            "
            >
              <p className="text-sm font-medium text-slate-600">
                Share this meeting link
              </p>

              <div
                className="
                mt-3
                rounded-xl
                bg-white
                border
                border-slate-200
                p-3
                text-sm
                break-all
              "
              >
                {meetingLink}
              </div>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={copyMeetingLink}
                  className="
                  flex
                  items-center
                  gap-2

                  rounded-xl
                  bg-cyan-500
                  px-4
                  py-3

                  text-white
                  font-medium

                  hover:bg-cyan-600
                "
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Meeting ID: {meetingId}
              </div>
            </div>
          )}
        </div>

        {/* Join Meeting */}
        <div className=" bg-white rounded-3xl border border-slate-200shadow-sm p-6 ">
          <div className="flex items-center gap-3">
            <Users
              className="text-cyan-500"
              size={24}
            />

            <h2 className="text-xl font-semibold">
              Join Meeting
            </h2>
          </div>

          <div className="mt-6">
            <label className="text-sm text-slate-500">
              Meeting ID
            </label>

            <input
              type="text"
              value={joinMeetingId}
              onChange={(e) =>
                setJoinMeetingId(
                  e.target.value
                )
              }
              placeholder="Enter Meeting ID"
              className="
              mt-2
              w-full
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              outline-none

              focus:border-cyan-500
              focus:ring-4
              focus:ring-cyan-100
            "
            />
          </div>

          <button
            onClick={joinMeeting}
            disabled={!joinMeetingId.trim()}
            className="
            mt-6
            w-full

            rounded-xl
            border
            border-cyan-500

            py-3

            text-cyan-600
            font-medium

            hover:bg-cyan-50

            disabled:opacity-50
            disabled:cursor-not-allowed

            transition-all
          "
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meetings;