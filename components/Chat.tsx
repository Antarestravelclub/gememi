"use client";

import { useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { storeUser, getUser, updateLastInteraction } from '../utils/db';
import { useState, useEffect } from 'react';

export default function Chat({ accessToken }: { accessToken: string }) {
  const { status, messages, sendMessage } = useVoice();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (userEmail) {
        try {
          const user = await getUser(userEmail);
          if (user) {
            setUserName(user.name);
            await updateLastInteraction(userEmail);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [userEmail]);

  const handleUserMessage = async (message: string) => {
    await sendMessage(message);
    
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = message.match(emailRegex);
    if (match) {
      setUserEmail(match[0]);
    }

    if (message.toLowerCase().includes("book appointment") || message.toLowerCase().includes("schedule meeting")) {
      handleAppointmentRequest();
    }

    if (!userName && message.toLowerCase().includes("my name is")) {
      const nameMatch = message.match(/my name is (\w+)/i);
      if (nameMatch && nameMatch[1]) {
        const extractedName = nameMatch[1];
        setUserName(extractedName);
        try {
          await storeUser(extractedName, userEmail);
        } catch (error) {
          console.error('Error storing user:', error);
        }
      }
    }
  };

  const handleAppointmentRequest = async () => {
    const appointmentInfo = setAppointment({});
    await sendMessage(appointmentInfo.message);
  };

  return (
    <div className="flex flex-col h-screen">
      {status.value === "connected" ? (
        <>
          <Messages messages={messages} />
          <Controls onSendMessage={handleUserMessage} />
        </>
      ) : (
        <StartCall accessToken={accessToken} />
      )}
    </div>
  );
}
