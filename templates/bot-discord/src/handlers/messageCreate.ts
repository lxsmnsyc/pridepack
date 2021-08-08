import CLIENT from '../client';

CLIENT.on('messageCreate', async (message) => {
  if (!CLIENT.user) {
    return;
  }

  if (message.author.id === CLIENT.user.id) {
    // Do not listen to own messages.
    return;
  }

  // create logic here
  if (message.mentions.users.has(CLIENT.user.id)) {
    await message.reply({
      embeds: message.embeds,
      content: message.content,
    });
  }
});
