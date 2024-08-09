// "use client";
// import { Box, Button, Stack, TextField, Typography, Fade } from "@mui/material";
// import { useState } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
//       isComplete: true,
//       showFeedback: false,
//     },
//   ]);
//   const [message, setMessage] = useState("");
//   const [showThankYou, setShowThankYou] = useState(false);
//   const [showFeedbackInput, setShowFeedbackInput] = useState(false);
//   const [feedbackMessage, setFeedbackMessage] = useState("");

//   const sendMessage = async () => {
//     setMessages((messages) => [
//       ...messages,
//       { role: "user", content: message, isComplete: true, showFeedback: false },
//       { role: "assistant", content: "", isComplete: false, showFeedback: true },
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
//               isComplete: false,
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
//             isComplete: true,
//           },
//         ];
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleFeedback = async (feedbackType) => {
//     try {
//       const lastMessage = messages[messages.length - 1];
//       const userLastMessage = messages[messages.length - 2];

//       const response = await fetch("/api/chat/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chatMessage: lastMessage.content,
//           userMessage: userLastMessage.content,
//           feedback: feedbackType,
//           messageID: Date.now().toString(),
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit feedback");

//       if (feedbackType === "thumbsUp") {
//         setShowThankYou(true);
//         setTimeout(() => setShowThankYou(false), 2000);
//       } else if (feedbackType === "thumbsDown") {
//         setShowFeedbackInput(true);
//       }

//       setMessages((messages) =>
//         messages.map((msg, idx) =>
//           idx === messages.length - 1 ? { ...msg, showFeedback: false } : msg
//         )
//       );
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   const submitDetailedFeedback = async () => {
//     setShowFeedbackInput(false);
//     setFeedbackMessage("");

//     try {
//       const lastMessage = messages[messages.length - 1];
//       const userLastMessage = messages[messages.length - 2];

//       const response = await fetch("/api/chat/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chatMessage: lastMessage.content,
//           userMessage: userLastMessage.content,
//           feedback: "detailed",
//           detailedFeedback: feedbackMessage,
//           messageID: Date.now().toString(),
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit detailed feedback");

//     } catch (error) {
//       console.error("Error submitting detailed feedback:", error);
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
//               {message.role === "assistant" &&
//                 message.isComplete &&
//                 message.showFeedback && (
//                   <Stack
//                     direction="column"
//                     spacing={1}
//                     mt={1}
//                     alignSelf="flex-start"
//                   >
//                     <Typography variant="body2" color="textSecondary">
//                       Was this response helpful?
//                     </Typography>
//                     <Stack direction="row" spacing={1}>
//                       <Button
//                         variant="contained"
//                         onClick={() => handleFeedback("thumbsUp")}
//                       >
//                         👍
//                       </Button>
//                       <Button
//                         variant="contained"
//                         onClick={() => handleFeedback("thumbsDown")}
//                       >
//                         👎
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 )}
//             </Box>
//           ))}
//         </Stack>
//         {showThankYou && (
//           <Fade in={showThankYou}>
//             <Typography variant="h6" color="textPrimary">
//               Thank you!
//             </Typography>
//           </Fade>
//         )}
//         {showFeedbackInput && (
//           <Stack direction="column" spacing={2} mt={2}>
//             <TextField
//               label="Please provide your feedback"
//               fullWidth
//               multiline
//               rows={4}
//               value={feedbackMessage}
//               onChange={(e) => setFeedbackMessage(e.target.value)}
//             />
//             <Button variant="contained" onClick={submitDetailedFeedback}>
//               Submit
//             </Button>
//           </Stack>
//         )}
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



// "use client";
// import { Box, Button, Stack, TextField, Typography, Fade } from "@mui/material";
// import { useState } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
//       isComplete: true,
//       showFeedback: false,
//     },
//   ]);
//   const [message, setMessage] = useState("");
//   const [showThankYou, setShowThankYou] = useState(false);
//   const [showFeedbackInput, setShowFeedbackInput] = useState(false);
//   const [feedbackMessage, setFeedbackMessage] = useState("");

//   const sendMessage = async () => {
//     setMessages((messages) => [
//       ...messages,
//       { role: "user", content: message, isComplete: true, showFeedback: false },
//       { role: "assistant", content: "", isComplete: false, showFeedback: true },
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
//               isComplete: false,
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
//             isComplete: true,
//           },
//         ];
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleFeedback = async (feedbackType) => {
//     try {
//       const lastMessage = messages[messages.length - 1];
//       const userLastMessage = messages[messages.length - 2];

//       const response = await fetch("/api/chat/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chatMessage: lastMessage.content,
//           userMessage: userLastMessage.content,
//           feedback: feedbackType,
//           messageID: Date.now().toString(),
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit feedback");

//       if (feedbackType === "thumbsUp") {
//         setShowThankYou(true);
//         setTimeout(() => setShowThankYou(false), 2000);
//       } else if (feedbackType === "thumbsDown") {
//         setShowFeedbackInput(true);
//       }

//       setMessages((messages) =>
//         messages.map((msg, idx) =>
//           idx === messages.length - 1 ? { ...msg, showFeedback: false } : msg
//         )
//       );
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     }
//   };

//   const submitDetailedFeedback = async () => {
//     setShowFeedbackInput(false);
//     setFeedbackMessage("");

//     try {
//       const lastMessage = messages[messages.length - 1];
//       const userLastMessage = messages[messages.length - 2];

//       const response = await fetch("/api/chat/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chatMessage: lastMessage.content,
//           userMessage: userLastMessage.content,
//           feedback: "detailed",
//           detailedFeedback: feedbackMessage,
//           messageID: Date.now().toString(),
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit detailed feedback");

//     } catch (error) {
//       console.error("Error submitting detailed feedback:", error);
//     }
//   };

//   return (
//     <Box>
//       <Stack spacing={2}>
//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Nutrition App ChatBot
//         </Typography>
//         <Box>
//           {messages.map((msg, idx) => (
//             <Box key={idx}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   backgroundColor:
//                     msg.role === "user" ? "#e0f7fa" : "#e8eaf6",
//                   padding: "10px",
//                   borderRadius: "8px",
//                   textAlign: msg.role === "user" ? "right" : "left",
//                 }}
//               >
//                 {msg.content}
//               </Typography>
//               {msg.isComplete && msg.showFeedback && (
//                 <Stack direction="row" spacing={1} justifyContent="flex-end">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleFeedback("thumbsUp")}
//                   >
//                     👍
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => handleFeedback("thumbsDown")}
//                   >
//                     👎
//                   </Button>
//                 </Stack>
//               )}
//             </Box>
//           ))}
//         </Box>
//         <TextField
//           label="Type your message..."
//           variant="outlined"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           fullWidth
//           onKeyPress={(e) => {
//             if (e.key === "Enter") {
//               sendMessage();
//             }
//           }}
//         />
//         <Button variant="contained" color="primary" onClick={sendMessage}>
//           Send
//         </Button>
//       </Stack>

//       <Fade in={showThankYou}>
//         <Typography variant="h6" color="primary" textAlign="center">
//           Thank you for your feedback!
//         </Typography>
//       </Fade>

//       {showFeedbackInput && (
//         <Box>
//           <TextField
//             label="Please provide more details..."
//             variant="outlined"
//             value={feedbackMessage}
//             onChange={(e) => setFeedbackMessage(e.target.value)}
//             fullWidth
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={submitDetailedFeedback}
//           >
//             Submit Feedback
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

"use client";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Fade,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm the Nutrition App ChatBot. How can I assist you today?",
      isComplete: true,
      showFeedback: false,
    },
  ]);
  const [message, setMessage] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  // const handleFeedback = async (feedbackType) => {
  //   try {
  //     const lastMessage = messages[messages.length - 1];
  //     const userLastMessage = messages[messages.length - 2];

  //     const response = await fetch("/api/chat/feedback", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         chatMessage: lastMessage.content,
  //         userMessage: userLastMessage.content,
  //         feedback: feedbackType,
  //         messageID: Date.now().toString(),
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to submit feedback");

  //     if (feedbackType === "thumbsUp") {
  //       setShowThankYou(true);
  //       setTimeout(() => setShowThankYou(false), 2000);
  //     } else if (feedbackType === "thumbsDown") {
  //       setShowFeedbackInput(true);
  //     }

  //     setMessages((messages) =>
  //       messages.map((msg, idx) =>
  //         idx === messages.length - 1 ? { ...msg, showFeedback: false } : msg
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error submitting feedback:", error);
  //   }
  // };

  // const submitDetailedFeedback = async () => {
  //   try {
  //     const lastMessage = messages[messages.length - 1];
  //     const userLastMessage = messages[messages.length - 2];
  
  //     // Prepare the feedback payload
  //     const feedbackPayload = {
  //       chatMessage: lastMessage.content,
  //       userMessage: userLastMessage.content,
  //       feedback: "detailed",
  //       detailedFeedback: feedbackMessage,  // Include the detailed feedback
  //       messageID: Date.now().toString(),
  //     };
  
  //     // Send the feedback to the server
  //     const response = await fetch("/api/chat/feedback", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(feedbackPayload),
  //     });
  
  //     if (!response.ok) throw new Error("Failed to submit detailed feedback");
  
  //     // Reset feedback form
  //     setShowFeedbackInput(false);
  //     setFeedbackMessage("");
  
  //     // Update messages to remove feedback options from the last message
  //     setMessages((messages) =>
  //       messages.map((msg, idx) =>
  //         idx === messages.length - 1 ? { ...msg, showFeedback: false } : msg
  //       )
  //     );
  
  //     console.log("Detailed feedback submitted successfully");
  //   } catch (error) {
  //     console.error("Error submitting detailed feedback:", error);
  //   }
  // };
  const handleFeedback = async (feedbackType) => {
    try {
      const lastMessage = messages[messages.length - 1];
      const userLastMessage = messages[messages.length - 2];
  
      // Only handle thumbsUp or initial thumbsDown (without detailed feedback)
      if (feedbackType === "thumbsUp") {
        const response = await fetch("/api/chat/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatMessage: lastMessage.content,
            userMessage: userLastMessage.content,
            feedback: feedbackType,
            messageID: Date.now().toString(),
          }),
        });
  
        if (!response.ok) throw new Error("Failed to submit thumbsUp feedback");
  
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 2000);
      } else if (feedbackType === "thumbsDown") {
        setShowFeedbackInput(true);
      }
  
      setMessages((messages) =>
        messages.map((msg, idx) =>
          idx === messages.length - 1 ? { ...msg, showFeedback: false } : msg
        )
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  
  const submitDetailedFeedback = async () => {
    try {
      const lastMessage = messages[messages.length - 1];
      const userLastMessage = messages[messages.length - 2];
  
      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatMessage: lastMessage.content,
          userMessage: userLastMessage.content,
          feedback: "thumbsDown",
          detailedFeedback: feedbackMessage,
          messageID: Date.now().toString(),
        }),
      });
  
      if (!response.ok) throw new Error("Failed to submit detailed feedback");
  
      // Reset feedback form
      setShowFeedbackInput(false);
      setFeedbackMessage("");
  
      // Update messages to remove feedback options from the last message
      setMessages((messages) =>
        messages.map((msg, idx) =>
          idx === messages.length - 1 ? { ...msg, showFeedback: false } : msg
        )
      );
  
      console.log("Detailed feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting detailed feedback:", error);
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
        <Typography variant="h4" textAlign="center" gutterBottom>
          Nutrition App ChatBot
        </Typography>
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
              {message.role === "assistant" &&
                message.isComplete &&
                message.showFeedback && (
                  <Stack
                    direction="column"
                    spacing={1}
                    mt={1}
                    alignSelf="flex-start"
                  >
                    <Typography variant="body2" color="textSecondary">
                      Was this response helpful?
                    </Typography>
                    <Stack direction="row" spacing={1}>
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
                  </Stack>
                )}
            </Box>
          ))}
        </Stack>
        {showThankYou && (
          <Fade in={showThankYou}>
            <Typography variant="h6" color="primary" textAlign="center">
              Thank you!
            </Typography>
          </Fade>
        )}
        {showFeedbackInput && (
          <Stack direction="column" spacing={2} mt={2}>
            <TextField
              label="Please provide your feedback"
              fullWidth
              multiline
              rows={4}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            />
            <Button variant="contained" onClick={submitDetailedFeedback}>
              Submit
            </Button>
          </Stack>
        )}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
