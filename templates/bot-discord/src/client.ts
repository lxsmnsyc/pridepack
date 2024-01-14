import type { BitFieldResolvable, GatewayIntentsString } from 'discord.js';
import { Client } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT = new Client({
  intents: (process.env.DISCORD_BOT_INTENTS as string).split(
    ',',
  ) as BitFieldResolvable<GatewayIntentsString, number>,
});

export default CLIENT;
