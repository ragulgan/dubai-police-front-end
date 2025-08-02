import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addCommentDispatch, clearCommentAddState } from "@/redux/slices/suggestionsAndPolls/comment/CommentAddSlice";
import { editSuggestionsAndPolls } from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsEditSlice";
import { clearCommentUpdateState, updateCommentDispatch } from "@/redux/slices/suggestionsAndPolls/comment/CommentUpdateSlice";
import { clearCommentDeleteState, deleteCommentDispatch } from "@/redux/slices/suggestionsAndPolls/comment/CommentDeleteSlice";
import { getTokenData } from "@/utils/helper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Send from "../../../../public/send.svg";
import SendIcon from '@mui/icons-material/Send';
import { isArray } from "lodash";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ChatBox = ({ suggestionsAndPollsData, editPayload, setCall }: any) => {
  const dispatch: any = useDispatch();
  const loginData = getTokenData();

  const commentsAddResponse = useSelector((state: any) => state.commentAddData);
  const commentsUpdateResponse = useSelector((state: any) => state.commentUpdateData);
  const commentsDeleteResponse = useSelector((state: any) => state.commentDeleteData);

  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<any>(null);
  const [editedText, setEditedText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    if (commentsAddResponse?.code === 200) {
      dispatch(editSuggestionsAndPolls({ url: "/GetPollsAndSuggestionsByID", payload: editPayload }));
      dispatch(clearCommentAddState());
    }
  }, [commentsAddResponse]);

  useEffect(() => {
    if (commentsUpdateResponse?.code === 200) {
      dispatch(editSuggestionsAndPolls({ url: "/GetPollsAndSuggestionsByID", payload: editPayload }));
      dispatch(clearCommentUpdateState());
    }
  }, [commentsUpdateResponse]);

  useEffect(() => {
    if (commentsDeleteResponse?.code === 200) {
      dispatch(editSuggestionsAndPolls({ url: "/GetPollsAndSuggestionsByID", payload: editPayload }));
      dispatch(clearCommentDeleteState());
    }
  }, [commentsDeleteResponse]);

  const handleSend = () => {
    if (input.trim() === "") return;

    const params = {
      suggestionsID: suggestionsAndPollsData?.suggestionsID,
      suggestionDescription: input,
      createdByModule: loginData?.roleModule,
    };

    dispatch(addCommentDispatch({ url: "/InsertSuggestionComments", payload: params }));
    setInput("");
    setCall(true);
  };

  const handleEdit = (commentId: any) => {
    if (!editedText.trim()) return;
    const params = {
      suggestionsID: suggestionsAndPollsData?.suggestionsID,
      suggestionDescription: editedText,
      createdByModule: loginData?.roleModule,
      commentsID: commentId
    };
    dispatch(updateCommentDispatch({
      url: "/UpdateSuggestionCommentsByID",
      payload: params
    }));
    setEditingMessageId(null);
  };

  const handleDelete = (commentId: any) => {
    dispatch(deleteCommentDispatch({ url: "/DeleteSuggestionCommentsByID", payload: { commentsID: commentId } }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, commentId: any, commentText: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(commentId);
    setEditedText(commentText);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [suggestionsAndPollsData?.suggestionComments]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (editingMessageId) inputRef.current?.focus();
  }, [editingMessageId]);

  const handleBlur = () => {
    setEditingMessageId(null)
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "white" }}>
      {/* Chat Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {suggestionsAndPollsData &&
          suggestionsAndPollsData?.suggestionComments &&
          isArray(suggestionsAndPollsData?.suggestionComments) &&
          suggestionsAndPollsData?.suggestionComments.map((msg: any, index: any) => {
            const isUser = msg?.createdBy === loginData?.userID;
            const isEditing = editingMessageId === msg.commentsID;
            return (
              <Box
                key={index}
                sx={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  color: "rgba(0, 0, 0, 1)",
                  borderColor: "rgba(38, 208, 124, 1)",
                  backgroundColor: "rgba(38, 208, 124, 0.06)",
                  padding: "10px",
                  maxWidth: "70%",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  position: "relative",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: "5px" }}>
                  <Avatar sx={{
                    width: 24, height: 24, marginRight: 4,
                    bgcolor: "rgba(0, 135, 85, 1)",
                    borderColor: "rgba(0, 135, 85, 1) !important",
                  }} src={msg?.createdProfileimage || "/path-to-user-image.jpg"} />
                </Box>
                {isUser && (
                  <Box sx={{ position: "absolute", top: 5, right: 5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, msg.commentsID, msg.suggestionDescription)}
                      sx={{
                        border: "1px solid rgba(0, 135, 85, 1)", // Border color
                        borderRadius: "8px", // Rounded edges
                        padding: "4px", // Space inside the box
                        backgroundColor: "white", // Optional: Background color
                        "&:hover": {
                          backgroundColor: "rgba(0, 135, 85, 0.1)", // Light hover effect
                        },
                      }}
                    >
                      <MoreVert fontSize="small" sx={{ color: "rgba(0, 135, 85, 1)" }} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedComment === msg.commentsID)}
                      onClose={() => setAnchorEl(null)}
                    >
                      {checkAccess(USER_PERMISSION.SuggestionPollsEdit) ? <MenuItem
                        onClick={() => {
                          setEditingMessageId(msg.commentsID);
                          setAnchorEl(null);
                        }}
                      >
                        <Tooltip title={"Edit"}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <EditIcon
                              sx={{
                                color: "rgba(0, 135, 85, 1)",
                                fontSize: "24px",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Dubai",
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "150%",
                                letterSpacing: "0%",
                                color: "rgba(0, 135, 85, 1)",
                              }}
                            >
                              Edit
                            </Typography>
                          </Box>
                        </Tooltip>
                      </MenuItem> : null}
                      {checkAccess(USER_PERMISSION.SuggestionPollsDelete) ? <MenuItem onClick={() => handleDelete(msg.commentsID)}>
                        <Tooltip title={"Delete"}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <DeleteOutlinedIcon
                              sx={{
                                color: "rgba(0, 135, 85, 1)",
                                fontSize: "24px",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Dubai",
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "150%",
                                letterSpacing: "0%",
                                color: "rgba(0, 135, 85, 1)",
                              }}
                            >
                              Delete
                            </Typography>
                          </Box>
                        </Tooltip>
                      </MenuItem> : null}
                    </Menu>
                  </Box>
                )}
                {isEditing ? (
                  <TextareaAutosize
                    ref={inputRef}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    // onBlur={() => handleEdit(msg.commentsID)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleEdit(msg.commentsID);
                      }
                    }}
                    minRows={1}
                    maxRows={6}
                    placeholder="Edit your comment..."
                    style={{
                      fontSize: '14px',
                      padding: '8px',
                      width: `${Math.min(Math.max(editedText.length, 20), 80)}ch`, // responsive width
                      maxWidth: '100%',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      resize: 'none',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                ) : (
                  <Typography className="dubai-med">{msg.suggestionDescription}</Typography>
                )}
              </Box>
            );
          })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Box */}
      <Box sx={{
        height: "64px", borderRadius: "8px", borderWidth: "1px", borderColor: "#ddd", display: "flex", alignItems: "center",
        ":hover": {
          borderStyle: "#bbb",
        }
      }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type Your Answer ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(); }}
          InputProps={{
            sx: {
              backgroundColor: "#FFF", // Ensure text field itself remains white
              borderRadius: "8px", // Match with the Box
              ":hover": {
                backgroundColor: "#f9f9f9",
              }
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || commentsAddResponse.loading}
                >
                  {commentsAddResponse.loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatBox;
