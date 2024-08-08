// // "use client";
// // import { Box, Button, Stack, TextField } from "@mui/material";
// // import { useState } from "react";

// // export default function Home() {
// //   const [messages, setMessages] = useState([
// //     {
// //       role: "assistant",
// //       content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
// //     },
// //   ]);

// //   const [message, setMessage] = useState("");

// //   const sendMessage = async () => {
// //     setMessages((messages) => [
// //       ...messages,
// //       { role: "user", content: message },
// //       { role: "assistant", content: "" },
// //     ]);
// //     setMessage("");

// //     try {
// //       const response = await fetch("/api/chat", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           messages: [...messages, { role: "user", content: message }],
// //         }),
// //       });

// //       if (!response.body) throw new Error("No response body");

// //       const reader = response.body.getReader();
// //       const decoder = new TextDecoder();
// //       let result = "";

// //       while (true) {
// //         const { done, value } = await reader.read();
// //         if (done) break;
// //         result += decoder.decode(value, { stream: true });

// //         setMessages((messages) => {
// //           const lastMessage = messages[messages.length - 1];
// //           const otherMessages = messages.slice(0, messages.length - 1);
// //           return [
// //             ...otherMessages,
// //             {
// //               ...lastMessage,
// //               content: result,
// //               feedback: null, // Add feedback state here
// //             },
// //           ];
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     }
// //   };

// //   const handleFeedback = async (messageID, feedback) => {
// //     try {
// //       await fetch("/api/chat/feedback", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ messageID, feedback }),
// //       });
// //     } catch (error) {
// //       console.error("Error submitting feedback:", error);
// //     }
// //   };

// //   return (
// //     <Box
// //       width="100vw"
// //       height="100vh"
// //       display="flex"
// //       flexDirection="column"
// //       justifyContent="center"
// //       alignItems="center"
// //     >
// //       <Stack
// //         direction="column"
// //         width="600px"
// //         height="700px"
// //         border="1px solid black"
// //         p={2}
// //         spacing={2}
// //       >
// //         <Stack
// //           direction="column"
// //           spacing={2}
// //           flexGrow={1}
// //           overflow="auto"
// //           maxHeight="100%"
// //         >
// //           {messages.map((message, index) => (
// //             <Box
// //               key={index}
// //               display="flex"
// //               justifyContent={
// //                 message.role === "assistant" ? "flex-start" : "flex-end"
// //               }
// //               flexDirection="column"
// //             >
// //               <Box
// //                 bgcolor={
// //                   message.role === "assistant"
// //                     ? "primary.main"
// //                     : "secondary.main"
// //                 }
// //                 color="white"
// //                 borderRadius={16}
// //                 p={3}
// //               >
// //                 {message.content}
// //                 {message.role === "assistant" && (
// //                   <Stack direction="row" spacing={1} mt={1}>
// //                     <Button
// //                       variant="contained"
// //                       onClick={() => handleFeedback(index, "thumbsUp")}
// //                     >
// //                       👍
// //                     </Button>
// //                     <Button
// //                       variant="contained"
// //                       onClick={() => handleFeedback(index, "thumbsDown")}
// //                     >
// //                       👎
// //                     </Button>
// //                   </Stack>
// //                 )}
// //               </Box>
// //             </Box>
// //           ))}
// //         </Stack>
// //         <Stack direction="row" spacing={2}>
// //           <TextField
// //             label="message"
// //             fullWidth
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //           />
// //           <Button variant="contained" onClick={sendMessage}>
// //             Send
// //           </Button>
// //         </Stack>
// //       </Stack>
// //     </Box>
// //   );
// // }

// // "use client";
// // import { Box, Button, Stack, TextField } from "@mui/material";
// // import { useState } from "react";

// // export default function Home() {
// //   const [messages, setMessages] = useState([
// //     {
// //       role: "assistant",
// //       content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
// //       isComplete: true,
// //     },
// //   ]);

// //   const [message, setMessage] = useState("");

// //   const sendMessage = async () => {
// //     setMessages((messages) => [
// //       ...messages,
// //       { role: "user", content: message, isComplete: true },
// //       { role: "assistant", content: "", isComplete: false },
// //     ]);
// //     setMessage("");

// //     try {
// //       const response = await fetch("/api/chat", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           messages: [...messages, { role: "user", content: message }],
// //         }),
// //       });

// //       if (!response.body) throw new Error("No response body");

// //       const reader = response.body.getReader();
// //       const decoder = new TextDecoder();
// //       let result = "";

// //       while (true) {
// //         const { done, value } = await reader.read();
// //         if (done) break;
// //         result += decoder.decode(value, { stream: true });

// //         setMessages((messages) => {
// //           const lastMessage = messages[messages.length - 1];
// //           const otherMessages = messages.slice(0, messages.length - 1);
// //           return [
// //             ...otherMessages,
// //             {
// //               ...lastMessage,
// //               content: result,
// //               isComplete: false, // Message still being written
// //             },
// //           ];
// //         });
// //       }

// //       setMessages((messages) => {
// //         const lastMessage = messages[messages.length - 1];
// //         const otherMessages = messages.slice(0, messages.length - 1);
// //         return [
// //           ...otherMessages,
// //           {
// //             ...lastMessage,
// //             isComplete: true, // Message writing complete
// //           },
// //         ];
// //       });
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     }
// //   };

// //   const handleFeedback = async (feedbackType) => {
// //     try {
// //       const lastMessage = messages[messages.length - 1]; // The bot's latest message
// //       const userLastMessage = messages[messages.length - 2]; // The user's last message

// //       const response = await fetch("/api/chat/feedback", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           chatMessage: lastMessage.content,
// //           userMessage: userLastMessage.content,
// //           feedback: feedbackType,
// //           messageID: Date.now().toString(), // Or a suitable unique ID
// //         }),
// //       });

// //       if (!response.ok) throw new Error("Failed to submit feedback");

// //       console.log("Feedback submitted successfully");
// //     } catch (error) {
// //       console.error("Error submitting feedback:", error);
// //     }
// //   };

// //   return (
// //     <Box
// //       width="100vw"
// //       height="100vh"
// //       display="flex"
// //       flexDirection="column"
// //       justifyContent="center"
// //       alignItems="center"
// //     >
// //       <Stack
// //         direction="column"
// //         width="600px"
// //         height="700px"
// //         border="1px solid black"
// //         p={2}
// //         spacing={2}
// //       >
// //         <Stack
// //           direction="column"
// //           spacing={2}
// //           flexGrow={1}
// //           overflow="auto"
// //           maxHeight="100%"
// //         >
// //           {messages.map((message, index) => (
// //             <Box
// //               key={index}
// //               display="flex"
// //               justifyContent={
// //                 message.role === "assistant" ? "flex-start" : "flex-end"
// //               }
// //               flexDirection="column"
// //             >
// //               <Box
// //                 bgcolor={
// //                   message.role === "assistant"
// //                     ? "primary.main"
// //                     : "secondary.main"
// //                 }
// //                 color="white"
// //                 borderRadius={16}
// //                 p={3}
// //               >
// //                 {message.content}
// //                 {message.role === "assistant" && message.isComplete && (
// //                   <Stack direction="row" spacing={1} mt={1}>
// //                     <Button
// //                       variant="contained"
// //                       onClick={() => handleFeedback("thumbsUp")}
// //                     >
// //                       👍
// //                     </Button>
// //                     <Button
// //                       variant="contained"
// //                       onClick={() => handleFeedback("thumbsDown")}
// //                     >
// //                       👎
// //                     </Button>
// //                   </Stack>
// //                 )}
// //               </Box>
// //             </Box>
// //           ))}
// //         </Stack>
// //         <Stack direction="row" spacing={2}>
// //           <TextField
// //             label="message"
// //             fullWidth
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //           />
// //           <Button variant="contained" onClick={sendMessage}>
// //             Send
// //           </Button>
// //         </Stack>
// //       </Stack>
// //     </Box>
// //   );
// // }


// "use client";
// import { Box, Button, Stack, TextField } from "@mui/material";
// import { useState } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
//       isComplete: true,
//     },
//   ]);

//   const [message, setMessage] = useState("");

//   const sendMessage = async () => {
//     setMessages((messages) => [
//       ...messages,
//       { role: "user", content: message, isComplete: true },
//       { role: "assistant", content: "", isComplete: false },
//     ]);
//     setMessage("");

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messages: [...messages, { role: "user", content: message }],
//         }),
//       });

//       if (!response.body) throw new Error("No response body");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let result = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         result += decoder.decode(value, { stream: true });

//         setMessages((messages) => {
//           const lastMessage = messages[messages.length - 1];
//           const otherMessages = messages.slice(0, messages.length - 1);
//           return [
//             ...otherMessages,
//             {
//               ...lastMessage,
//               content: result,
//               isComplete: false, // Message still being written
//             },
//           ];
//         });
//       }

//       setMessages((messages) => {
//         const lastMessage = messages[messages.length - 1];
//         const otherMessages = messages.slice(0, messages.length - 1);
//         return [
//           ...otherMessages,
//           {
//             ...lastMessage,
//             isComplete: true, // Message writing complete
//           },
//         ];
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleFeedback = async (feedbackType) => {
//     try {
//       const lastMessage = messages[messages.length - 1]; // The bot's latest message
//       const userLastMessage = messages[messages.length - 2]; // The user's last message

//       const response = await fetch("/api/chat/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chatMessage: lastMessage.content,
//           userMessage: userLastMessage.content,
//           feedback: feedbackType,
//           messageID: Date.now().toString(), // Or a suitable unique ID
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit feedback");

//       console.log("Feedback submitted successfully");
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display="flex"
//       flexDirection="column"
//       justifyContent="center"
//       alignItems="center"
//     >
//       <Stack
//         direction="column"
//         width="600px"
//         height="700px"
//         border="1px solid black"
//         p={2}
//         spacing={2}
//       >
//         <Stack
//           direction="column"
//           spacing={2}
//           flexGrow={1}
//           overflow="auto"
//           maxHeight="100%"
//         >
//           {messages.map((message, index) => (
//             <Box
//               key={index}
//               display="flex"
//               justifyContent={
//                 message.role === "assistant" ? "flex-start" : "flex-end"
//               }
//               flexDirection="column"
//             >
//               <Box
//                 bgcolor={
//                   message.role === "assistant"
//                     ? "primary.main"
//                     : "secondary.main"
//                 }
//                 color="white"
//                 borderRadius={16}
//                 p={3}
//               >
//                 {message.content}
//               </Box>
//               {message.role === "assistant" && message.isComplete && (
//                 <Stack direction="row" spacing={1} mt={1} alignSelf="flex-start">
//                   <Button
//                     variant="contained"
//                     onClick={() => handleFeedback("thumbsUp")}
//                   >
//                     👍
//                   </Button>
//                   <Button
//                     variant="contained"
//                     onClick={() => handleFeedback("thumbsDown")}
//                   >
//                     👎
//                   </Button>
//                 </Stack>
//               )}
//             </Box>
//           ))}
//         </Stack>
//         <Stack direction="row" spacing={2}>
//           <TextField
//             label="message"
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button variant="contained" onClick={sendMessage}>
//             Send
//           </Button>
//         </Stack>
//       </Stack>
//     </Box>
//   );
// }
"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
      isComplete: true,
      showFeedback: false, // No feedback buttons for the initial message
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message, isComplete: true, showFeedback: false },
      { role: "assistant", content: "", isComplete: false, showFeedback: true },
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
              isComplete: false,
            },
          ];
        });
      }

      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            isComplete: true,
          },
        ];
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFeedback = async (feedbackType) => {
    try {
      const lastMessage = messages[messages.length - 1]; // The bot's latest message
      const userLastMessage = messages[messages.length - 2]; // The user's last message

      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatMessage: lastMessage.content,
          userMessage: userLastMessage.content,
          feedback: feedbackType,
          messageID: Date.now().toString(), // Or a suitable unique ID
        }),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      console.log("Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={2}
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
              flexDirection="column"
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
              {message.role === "assistant" && message.isComplete && message.showFeedback && (
                <Stack direction="row" spacing={1} mt={1} alignSelf="flex-start">
                  <Button
                    variant="contained"
                    onClick={() => handleFeedback("thumbsUp")}
                  >
                    👍
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleFeedback("thumbsDown")}
                  >
                    👎
                  </Button>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

