import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  await mongoose.connect(config.database_uri as string);
}
main();

app.listen(config.port, () => {
  console.log(`listening on ${config.port}`);
});
