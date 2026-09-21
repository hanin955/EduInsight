import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';

const run = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('Started in-memory MongoDB at', uri);

  const child = spawn(process.execPath, ['seed.js'], {
    cwd: process.cwd(),
    env: { ...process.env, MONGO_URI: uri },
    stdio: 'inherit',
  });

  child.on('exit', async (code) => {
    console.log(`seed.js exited with code ${code}`);
    try {
      await mongod.stop();
      console.log('Stopped in-memory MongoDB');
    } catch (err) {
      console.error('Error stopping in-memory MongoDB:', err);
    }
    process.exit(code === null ? 1 : code);
  });

  child.on('error', async (err) => {
    console.error('Failed to run seed.js:', err);
    try { await mongod.stop(); } catch (e) {}
    process.exit(1);
  });
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
