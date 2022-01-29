import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  vi,
} from 'vitest';
import { EventEmitter } from 'events';
import CLIENT from '../src/client';
import '../src/handlers';

vi.mock('dotenv', () => ({
  config: () => {
    process.env.DISCORD_BOT_TOKEN = 'token';
    process.env.DISCORD_BOT_INTENTS = 'GUILDS,GUILD_MESSAGES';
  },
}));

vi.mock('discord.js', () => ({
  Client: class MockClient extends EventEmitter {
    public user: any = {};

    public token = '';

    async login(token: string) {
      this.token = token;
      this.user = {
        id: '0',
        tag: 'User#0000',
      };
      return Promise.resolve(token);
    }
  },
}));

describe('Example', () => {
  let defaultConsoleLog: typeof console.log;

  beforeEach(() => {
    defaultConsoleLog = console.log;
    console.log = vi.fn();
  });

  afterEach(() => {
    console.log = defaultConsoleLog;
  });

  beforeEach(async () => {
    await CLIENT.login('token');
  });

  it('should ensure logged in user exists', () => {
    expect(CLIENT.user).toEqual({
      id: '0',
      tag: 'User#0000',
    });
  });

  it('should handle ready event', () => {
    CLIENT.emit('ready', CLIENT);
    expect(console.log).toBeCalledWith('client ready');
  });

  it('should handle messageCreate event by echoing user message', () => {
    const payload: Record<string, any> = {
      author: {
        id: '1',
        tag: 'Anon#1337',
      },
      embeds: [],
      content: 'Test content.',
      mentions: {
        users: new Map([
          ['0', {
            id: '0',
            tag: 'User#0000',
          }],
        ]),
      },
      reply: vi.fn(),
    };

    CLIENT.emit('messageCreate', payload as any);
    expect(payload.reply).toBeCalledWith({
      embeds: [],
      content: 'Test content.',
    });
  });
});
