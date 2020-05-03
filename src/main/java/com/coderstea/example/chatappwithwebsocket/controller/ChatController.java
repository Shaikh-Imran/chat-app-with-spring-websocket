package com.coderstea.example.chatappwithwebsocket.controller;

import com.coderstea.example.chatappwithwebsocket.dto.ChatDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    //send your message to this with /app/send-msg-at
    /// you don't need to put /app
    @MessageMapping("send-msg-to")
    //all the subscriber to this  will get the message
    @SendTo("/topic/receive-msg-at")
    public ChatDto chatWithUsers(ChatDto chatDto){
        //do some other stuffs if you want to or modify the chatDto
        return chatDto;
    }
}
