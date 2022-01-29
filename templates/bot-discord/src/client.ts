import { BitFieldResolvable, Client, IntentsString } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT = new Client({
  intents: (
    (process.env.DISCORD_BOT_INTENTS as string).split(',') as
      BitFieldResolvable<IntentsString, number>
  ),
});

export default CLIENT;
