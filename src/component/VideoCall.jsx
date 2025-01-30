import React, { useRef, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

function VideoCall({ peerId }) {
  const socket = useSocket();
  const { user } = useAuth();
  const userId = user?.id;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const [offer, setOffer] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const iceCandidateQueue = useRef([]);

  const setupPeerConnection = async () => {
    try {
      // Clean up existing connection if any
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            to: peerId,
            from: userId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Get or reuse existing stream
      if (!localStreamRef.current) {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      peerConnectionRef.current = pc;
      return pc;
    } catch (error) {
      console.error("Error setting up peer connection:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Initial setup
    setupPeerConnection();

    socket.on("callIncoming", ({ from, offer }) => {
      console.log("Incoming call from:", from);
      setIncomingCall(true);
      setCallerId(from);
      setOffer(offer);
    });

    socket.on("callAnswered", async ({ from, answer }) => {
      if (peerConnectionRef.current && from === peerId) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );

          // Process queued candidates
          while (iceCandidateQueue.current.length > 0) {
            const candidate = iceCandidateQueue.current.shift();
            await peerConnectionRef.current.addIceCandidate(candidate);
          }
          setIsCallActive(true);
        } catch (error) {
          console.error("Error handling the answer: ", error);
        }
      }
    });

    socket.on("iceCandidate", async ({ from, candidate }) => {
      if (from === peerId && peerConnectionRef.current) {
        const iceCandidate = new RTCIceCandidate(candidate);
        if (peerConnectionRef.current.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(iceCandidate);
        } else {
          iceCandidateQueue.current.push(iceCandidate);
        }
      }
    });

    socket.on("callEnded", () => {
      console.log("Call ended");
      cleanupCall();
    });

    return () => {
      socket.off("callIncoming");
      socket.off("callAnswered");
      socket.off("iceCandidate");
      socket.off("callEnded");
      cleanupCall();
    };
  }, [socket, peerId]);

  console.log({ incomingCall });

  const cleanupCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Clear all states
    setOffer(null);
    setIncomingCall(false);
    setCallerId(null);
    setIsCallActive(false);
    iceCandidateQueue.current = [];
  };

  const startCall = async () => {
    try {
      const pc = await setupPeerConnection();

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("callUser", { to: peerId, from: userId, offer });
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting the call:", error);
    }
  };

  const answerCall = async () => {
    try {
      const pc = await setupPeerConnection();

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", { to: callerId, from: userId, answer });

      while (iceCandidateQueue.current.length > 0) {
        const candidate = iceCandidateQueue.current.shift();
        await pc.addIceCandidate(candidate);
      }

      setIncomingCall(false);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const endCall = () => {
    socket.emit("endCall", { to: peerId, from: userId });
    cleanupCall();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="flex space-x-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-64 h-48 bg-gray-200 rounded-lg"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 h-48 bg-gray-200 rounded-lg"
        />
      </div>

      <div className="space-x-4">
        {!isCallActive && !incomingCall && (
          <button
            onClick={startCall}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Call
          </button>
        )}

        {isCallActive && (
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            End Call
          </button>
        )}
      </div>

      {incomingCall && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="mb-2">Incoming call from {callerId}</p>
          <div className="space-x-2">
            <button
              onClick={answerCall}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Answer
            </button>
            <button
              onClick={() => {
                setIncomingCall(false);
                setCallerId(null);
                setOffer(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCall;
