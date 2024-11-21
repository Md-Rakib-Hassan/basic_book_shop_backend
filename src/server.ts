import app from './app';
import config from './app/config';

app.listen(config.port, () => {
  console.log(`listening on ${config.port}`);
});
