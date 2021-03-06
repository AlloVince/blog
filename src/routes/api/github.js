import {
  DI
} from 'evaengine';
import GithubWebHook from 'express-github-webhook';
import HexoManager from '../../models/hexo_manager';

const webhookHandler = GithubWebHook({
  path: '/v1/github/hook',
  secret: DI.get('config').get('blog.github.webhookSecret')
});

//@formatter:off
/**
 @swagger
 /github/hook:
   post:
     summary: Github Webhook
     tags:
       - Github
     responses:
       200:
         description: success response
 */
//@formatter:on
webhookHandler.on('*', (event, repo, data) => {
  const logger = DI.get('logger');
  const { branch, postsPath } = DI.get('config').get('blog.github');
  logger.debug('Received Github event %s: %s', event, repo);
  if (event !== 'push' || !data.commits || data.commits.length < 1) {
    return logger.debug('Github event [%s: %s] ignored by no commit', event, repo);
  }
  if (data.ref !== `refs/heads/${branch}`) {
    return logger.debug('Github event [%s: %s] ignored by branch not match [%s:%s]', event, repo, branch, data.ref);
  }
  for (const commit of data.commits) {
    //TODO: handle with commits.removed
    const files = [].concat(commit.added, commit.modified);
    if (files.length < 1) {
      logger.info('Github commit %s ignored by no modified file', commit.url);
      continue;
    }
    logger.info('Start handle Github commit %s with %s modified files, message: %s', commit.url, commit.modified.length, commit.message);
    for (const file of files) {
      if (!file.startsWith(postsPath)) {
        logger.info('Ignore Github commit file %s %s ', commit.url, commit.id, file);
        continue;
      }
      HexoManager
        .importHexoFileFromGithub(file)
        .then(() => {
          logger.info('Github commit finished file %s %s ', commit.url, commit.id, file);
          DI.get('cache').namespace('view').flush();
        });
    }
  }
  return true;
});

module.exports = webhookHandler;
