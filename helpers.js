// tools.js
// ========
module.exports = {
  isDeletedMessage: function (message) {
    return message.subtype && message.subtype=="message_deleted" ? true :  false
  },
  
  debug: function foo() {
    if(process.env.DEBUG!='true'){return}
    for (var i = 0; i < arguments.length; i++) {
      console.log(arguments[i]);
    }
  },
  
  isAuthorizedUser: function(user){
     return process.env.AUTHORIZED_USERS.split(",").includes(user)
  },
  
  isThreadedComment:function(message){
    return message.thread_ts || (message.message && message.message.thread_ts) ? true : false
  },
  
  isJoinOrLeave:function(message){
     return message.subtype && ["channel_join", "channel_leave"].includes(message.subtype)
  },
  
  messageEdited:function(message){
     return message.subtype && message.subtype == "message_changed"
  },
  
  isBotMessage:function(message){
     return message.subtype && message.subtype == "bot_message" || (message.message && message.message.subtype && message.message.subtype == "bot_message")
  }
  
};
  