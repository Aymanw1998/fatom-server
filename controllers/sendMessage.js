// const accountSid = 'ACd829e75909b477dd95ba129fb4e26803';
// const authToken = '7792c4c8c6f47ebd0312bd35bf4ca44b';
const twilio = require('twilio');
const client = new twilio(process.env.SID, process.env.TOKEN);

const send = async(req,res) => {
  await sendMessage(req.body);

}
const sendMessage = async (body) => {
  try {
    const text = body.text;
    const to = body.to;
    const from = body.from; 
    const message = await client.messages.create({
      body: text,
      from: from,
      to: to,
    });
    console.log(message);

    console.log('Message sent successfully:', message.sid);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
};

// Call the function to send a message
module.exports = {sendMessage, send};
