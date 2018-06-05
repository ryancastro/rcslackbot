const helpers = require('./helpers.js');

const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const { WebClient } = require('@slack/client');
const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const port = process.env.PORT || 3000;

const slackBotToken = process.env.BOT_USER_TOKEN;
const adminUserToken = process.env.ADMIN_USER_TOKEN;
const adminClient = new WebClient(adminUserToken);
const botClient = new WebClient(slackBotToken);

slackEvents.on('message', (message) => {

   helpers.debug("message received", message);
  
  if(helpers.isJoinOrLeave(message)){
    helpers.debug("Ignoring join/leave message"); 
    return 
  }

  if(helpers.isDeletedMessage(message)){
    helpers.debug("message deleted");
    return
   }

  
  if(helpers.isThreadedComment(message)){
    helpers.debug("Comment on Thread. Ignoring.")
    return
  }
  
  if(helpers.isBotMessage(message)){
    helpers.debug("Ignoring bot message") 
    return 
  }

  if(helpers.messageEdited(message)){
     helpers.debug("message edited.")
      botClient.chat.getPermalink(message.channel,message.previous_message.ts).then(function(result){
        botClient.chat.postMessage(message.channel, `*The following announcement was updated:*\n ${result.permalink}`, {unfurl_links:true})
      })
     return  
   }
  
  if(!helpers.isAuthorizedUser(message.user) && !helpers.isThreadedComment(message)){
    helpers.debug(`${message.user} is not an authorized user. Deleting the message.`);
    
    adminClient.chat.delete(message.ts, message.channel).then(function(){
      botClient.chat.postMessage(
          message.user,
          `Hi there!
           I saw that you tried to leave this in a read-only channel:
            \`\`\`
            ${message.text}
            \`\`\`
           
            Sadly, I had to delete your message. Try responding on a thread, or talking to the poster directly. Thank you!
          `
      )
    })
  }
 

});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});

