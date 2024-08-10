"use client";
import axios from "axios";
import Link from "next/link";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
    },
  ]);

  const [message, setMessage] = useState("");
  const [data, setData] = React.useState("nothing");

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: message }],
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });

        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: result,
            },
          ];
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor={"#355e3b"}
      position="relative"
    >
      <h1 className="main-title fade-title">NutriBot</h1>
      <button
        className="signup-button"
        onClick={logout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "lightgreen",
          color: "black",
        }}
      >
        Logout
      </button>
      <h2>
        {data === "nothing" ? (
          ""
        ) : (
          <Link href={`/profile/${data}`}>Link to Profile</Link>
        )}
      </h2>
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="4px solid black"
        p={2}
        spacing={2}
        bgcolor={"white"}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant" ? "lightgreen" : "#c0c0c0"
                }
                color="black"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "green",
                },
              },
            }}
          />
          <Button
            onClick={sendMessage}
            sx={{
              backgroundColor: "#c0c0c0",
              color: "white",
              "&:hover": {
                backgroundColor: "black",
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
