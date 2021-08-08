import CLIENT from './client';
import './handlers';

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('No bot token specified.');
  process.exit(1);
}

CLIENT.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    if (CLIENT.user) {
      console.log(`Bot client logged in as ${CLIENT.user.tag}`);
    }
  })
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
